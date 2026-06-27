// affinityMCP.js
// Vanilla JS module for browser (import in React). No external deps.
// Usage: import { exportToAffinity } from './affinityMCP.js'; then call exportToAffinity('doc-123')

/* =========================
   1) Style map (brand manual)
   ========================= */
export const STYLE_MAP = {
  heading: "SDP_Titol",
  subheading: "SDP_Subtitol",
  paragraph: "SDP_CosText",
  quote: "SDP_Cita",
  caption: "SDP_Capcio",
  code: "SDP_Code",
  imageFrame: "SDP_Image"
};

/* =========================
   2) IndexedDB helpers + extractor (bancalDB)
   - expects two object stores: 'documents' and 'assets'
   - documents: { id, meta, blocks: [{id,type,title,content,images:[{cid,name}]}...] }
   - assets: { key, cid, filename, mime, blob }
   ========================= */

const DB_NAME = 'unified-editor-db';
const DB_VERSION = 1;
const DOC_STORE = 'documents';
const ASSET_STORE = 'assets';

function openBancalDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (ev) => {
      const db = req.result;
      if (!db.objectStoreNames.contains(DOC_STORE)) db.createObjectStore(DOC_STORE, { keyPath: 'id' });
      if (!db.objectStoreNames.contains(ASSET_STORE)) db.createObjectStore(ASSET_STORE, { keyPath: 'cid' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getDocumentFromIDB(docId) {
  const db = await openBancalDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DOC_STORE, 'readonly');
    const req = tx.objectStore(DOC_STORE).get(docId);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

async function getAssetByCid(cid) {
  const db = await openBancalDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ASSET_STORE, 'readonly');
    const req = tx.objectStore(ASSET_STORE).get(cid);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    if (!blob) return resolve(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result; // "data:<mime>;base64,...."
      const comma = dataUrl.indexOf(',');
      resolve(dataUrl.slice(comma + 1));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/* extractor: loads document and resolves assets to base64
   returns { doc, assets: [{ cid, filename, mime, data_base64 }] }
*/
export async function extractDocAndAssets(docId, { includeAssets = true } = {}) {
  const doc = await getDocumentFromIDB(docId);
  if (!doc) throw new Error(`Document ${docId} not found in IDB`);

  const assetsMap = {};
  if (includeAssets) {
    // collect unique cids referenced by blocks
    const cids = new Set();
    (doc.blocks || []).forEach(b => {
      (b.images || []).forEach(img => { if (img && img.cid) cids.add(img.cid); });
    });

    for (const cid of cids) {
      const asset = await getAssetByCid(cid);
      if (!asset) continue;
      // asset.blob expected
      const data_base64 = await blobToBase64(asset.blob);
      assetsMap[cid] = {
        cid: asset.cid,
        filename: asset.filename || asset.cid,
        mime: asset.mime || 'application/octet-stream',
        data_base64
      };
    }
  }

  return { doc, assets: Object.values(assetsMap) };
}

/* =========================
   3) Serialitzador -> Affinity payload (JSON-first)
   - Keep Markdown as canonical content; map styles by type
   - Attach image references by cid
   ========================= */

export function serializeToAffinityPayload(doc, styleMap = STYLE_MAP, opts = {}) {
  const pages = (doc.blocks || []).map((b, i) => {
    const style = styleMap[b.type] || styleMap.paragraph;
    const slug = (b.title || `section-${i}`).toLowerCase().replace(/[^\w]+/g, '-').replace(/^-|-$/g, '');
    return {
      id: b.id,
      order: i,
      type: b.type,
      title: b.title || null,
      style,
      contentMarkdown: b.content || '',
      anchors: { slug },
      images: (b.images || []).map(img => ({ name: img.name || img.cid, cid: img.cid || null }))
    };
  });

  return {
    docMeta: {
      id: doc.id || `doc-${Date.now()}`,
      title: (doc.meta && doc.meta.title) || '',
      generatedAt: new Date().toISOString(),
      engine: "SDP-Serializer-v1"
    },
    pages,
    options: {
      targetApp: opts.targetApp || "publisher",
      export: opts.export || ["idml", "pdf"],
      runAI: !!opts.runAI
    }
  };
}

/* =========================
   4) WebSocket orchestrator (ws://localhost:8765/mcp)
   - Connects, sends payload + assets, listens for progress/response
   - Exposes exportToAffinity(docId, opts) which returns a Promise resolving server response
   ========================= */

function connectWebSocket(url, { timeout = 10000 } = {}) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    const timer = setTimeout(() => {
      ws.close();
      reject(new Error('WebSocket connection timeout'));
    }, timeout);

    ws.onopen = () => {
      clearTimeout(timer);
      resolve(ws);
    };
    ws.onerror = (ev) => {
      clearTimeout(timer);
      reject(new Error('WebSocket error'));
    };
  });
}

export async function exportToAffinity(docId, opts = {}) {
  const wsUrl = opts.wsUrl || 'ws://localhost:8765/mcp';
  const includeAssets = opts.includeAssets !== false;
  const styleMap = opts.styleMap || STYLE_MAP;
  const timeout = opts.timeout || 120000; // overall op timeout
  const onProgress = typeof opts.onProgress === 'function' ? opts.onProgress : () => {};

  // 1) extract doc + assets
  const { doc, assets } = await extractDocAndAssets(docId, { includeAssets });

  // 2) serialize
  const payload = serializeToAffinityPayload(doc, styleMap, opts);

  // 3) prepare ws connection
  const ws = await connectWebSocket(wsUrl, { timeout: 8000 });

  function awaitResponse(ws, correlationId, overallTimeout) {
    return new Promise((resolve, reject) => {
      const to = setTimeout(() => {
        ws.close();
        reject(new Error('Affinity MCP response timeout'));
      }, overallTimeout);

      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          if (msg.type === 'progress' && msg.correlationId === correlationId) {
            onProgress(msg);
            return;
          }
          if (msg.type === 'result' && msg.correlationId === correlationId) {
            clearTimeout(to);
            resolve(msg);
            ws.close();
            return;
          }
          if (msg.type === 'error' && msg.correlationId === correlationId) {
            clearTimeout(to);
            reject(new Error(msg.message || 'Affinity MCP error'));
            ws.close();
            return;
          }
        } catch (err) { /* ignore invalid json */ }
      };

      ws.onerror = (ev) => {
        clearTimeout(to);
        reject(new Error('WebSocket error during operation'));
        ws.close();
      };
    });
  }

  const correlationId = `cid-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  const message = {
    action: "compose_document",
    client: "sdp-editor-v1",
    docId: doc.id,
    payloadType: "affinity-json",
    correlationId,
    payload
  };

  if (includeAssets && assets && assets.length) {
    message.assets = assets.map(a => ({
      cid: a.cid,
      filename: a.filename,
      mime: a.mime,
      data_base64: a.data_base64
    }));
  }

  ws.send(JSON.stringify(message));
  const result = await awaitResponse(ws, correlationId, timeout);
  return result;
}
