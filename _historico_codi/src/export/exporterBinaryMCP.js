// exporterBinaryMCP.js
// Vanilla JS module for browser (import in React). No deps.
// Exports: startDocumentUpload(doc, options) -> Promise(result)
//          resumeUpload(correlationId) -> Promise
//          generateEPUBPackage(doc) -> { files: { 'nav.xhtml': string, 'content.opf': string, ... } }

// ----------------------------- Utilities (UUID, CRC32, small helpers) -----------------------------
export function uuidShort() {
  // small UUID-like id (not RFC) but collision-safe for our use
  return 'cid-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,8);
}

// CRC32 implementation (fast, pure JS)
export function crc32(buf) {
  // buf: ArrayBuffer or Uint8Array
  const table = crc32._table || (crc32._table = (function() {
    let c, table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
      table[n] = c >>> 0;
    }
    return table;
  })());
  let crc = 0 ^ (-1);
  const data = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ data[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

// small sleep
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ----------------------------- IndexedDB: progress store -----------------------------
const DB_NAME = 'exporter-mcp-db';
const DB_VER = 1;
const STORE_PROGRESS = 'upload_progress';

function openExporterDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VER);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_PROGRESS)) {
        db.createObjectStore(STORE_PROGRESS, { keyPath: 'correlationId' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveProgress(record) {
  const db = await openExporterDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PROGRESS, 'readwrite');
    tx.objectStore(STORE_PROGRESS).put(record);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

async function loadProgress(correlationId) {
  const db = await openExporterDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PROGRESS, 'readonly');
    const req = tx.objectStore(STORE_PROGRESS).get(correlationId);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

async function deleteProgress(correlationId) {
  const db = await openExporterDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PROGRESS, 'readwrite');
    tx.objectStore(STORE_PROGRESS).delete(correlationId);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

// ----------------------------- Binary framing helpers -----------------------------
// Header layout (fixed 32 bytes):
// 0-3   : magic 0x45585054 ('EXPT')
// 4-7   : correlationHash (u32)
// 8-11  : chunkIndex (u32)
// 12-19 : offset (u64) -> store as two u32 high/low for portability
// 20-23 : payloadLength (u32)
// 24-27 : crc32 (u32)
// 28-31 : flags/reserved (u32)
function makeHeader(correlationHash, chunkIndex, offset, payloadLength, crc, flags=0) {
  const header = new ArrayBuffer(32);
  const dv = new DataView(header);
  dv.setUint32(0, 0x45585054); // 'EXPT'
  dv.setUint32(4, correlationHash >>> 0);
  dv.setUint32(8, chunkIndex >>> 0);
  // offset as two u32
  const hi = Math.floor(offset / 0x100000000);
  const lo = offset >>> 0;
  dv.setUint32(12, hi);
  dv.setUint32(16, lo);
  dv.setUint32(20, payloadLength >>> 0);
  dv.setUint32(24, crc >>> 0);
  dv.setUint32(28, flags >>> 0);
  return header;
}

function hashString32(s) {
  // simple FNV-1a 32-bit
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

// ----------------------------- WebSocket control frames (JSON) -----------------------------
/*
Control messages (text JSON):
- start_upload: { type:'start_upload', correlationId, docMeta, assets:[{cid, name, size, mime}], chunkSize }
- ack: { type:'ack', correlationId, lastOffset }
- resume_response: { type:'resume_response', correlationId, lastOffset }
- complete: { type:'complete', correlationId, status:'ok'|'error', message? }
- error: { type:'error', correlationId?, code, message }
*/

function sendJson(ws, obj) {
  ws.send(JSON.stringify(obj));
}

// ----------------------------- Core: send asset with chunking and resume -----------------------------
/*
Parameters:
- ws: open WebSocket
- correlationId: string
- asset: { cid, blob, name, size, mime }
- opts: { chunkSize, onProgress(offset, total) }
*/
export async function sendAssetWithResume(ws, correlationId, asset, opts = {}) {
  const chunkSize = opts.chunkSize || 256 * 1024; // 256KB default (tune to 64KB/512KB)
  const correlationHash = hashString32(correlationId);
  const total = asset.size || asset.blob.size;
  let offset = 0;
  let chunkIndex = 0;

  // load persisted progress if any
  const prog = await loadProgress(correlationId).catch(()=>null);
  if (prog && prog.assets && prog.assets[asset.cid] != null) {
    offset = prog.assets[asset.cid].lastOffset || 0;
    chunkIndex = Math.floor(offset / chunkSize);
  }

  // helper to wait for ack from server for this correlationId
  function waitForAck(timeout = 10000) {
    return new Promise((resolve, reject) => {
      const onMessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          if (msg && (msg.type === 'ack' || msg.type === 'resume_response') && msg.correlationId === correlationId) {
            ws.removeEventListener('message', onMessage);
            resolve(msg);
          }
        } catch (e) { /* ignore invalid json */ }
      };
      ws.addEventListener('message', onMessage);
      const timer = setTimeout(() => {
        ws.removeEventListener('message', onMessage);
        reject(new Error('ack timeout'));
      }, timeout);
      // resolve will clear timer via finally in caller
    });
  }

  // send loop
  while (offset < total) {
    // slice
    const end = Math.min(offset + chunkSize, total);
    const slice = asset.blob.slice(offset, end);
    const arr = await slice.arrayBuffer();
    const crc = crc32(arr);
    const header = makeHeader(correlationHash, chunkIndex, offset, arr.byteLength, crc, 0);
    // compose frame
    const frame = new Uint8Array(header.byteLength + arr.byteLength);
    frame.set(new Uint8Array(header), 0);
    frame.set(new Uint8Array(arr), header.byteLength);
    // send
    try {
      ws.send(frame.buffer);
    } catch (err) {
      // network error: persist progress and throw
      await saveProgress({ correlationId, assets: { [asset.cid]: { lastOffset: offset } } }).catch(()=>{});
      throw err;
    }

    // optimistic: wait for ack that includes lastOffset >= end
    try {
      const ack = await waitForAck(15000).catch(()=>null);
      // if ack present and lastOffset advanced, update offset accordingly
      if (ack && typeof ack.lastOffset === 'number') {
        // server may ack cumulative offset
        if (ack.lastOffset > offset) {
          offset = ack.lastOffset;
          chunkIndex = Math.floor(offset / chunkSize);
        } else {
          // server didn't advance: assume chunk accepted, advance locally
          offset = end;
          chunkIndex++;
        }
      } else {
        // no ack: advance locally but persist progress
        offset = end;
        chunkIndex++;
      }
    } catch (err) {
      // ack wait error: persist and rethrow
      await saveProgress({ correlationId, assets: { [asset.cid]: { lastOffset: offset } } }).catch(()=>{});
      throw err;
    }

    // persist progress after each chunk (lightweight)
    await saveProgress({ correlationId, assets: { [asset.cid]: { lastOffset: offset } } }).catch(()=>{});
    if (typeof opts.onProgress === 'function') opts.onProgress(offset, total);
    // yield to event loop to avoid blocking A10
    await sleep(8);
  }

  // done for this asset: clear its progress entry
  const currentProg = await loadProgress(correlationId).catch(()=>null) || { correlationId, assets: {} };
  if (currentProg.assets) delete currentProg.assets[asset.cid];
  await saveProgress(currentProg).catch(()=>{});
  return { status: 'ok', cid: asset.cid, size: total };
}

// ----------------------------- High-level: startDocumentUpload -----------------------------
/*
doc: { id, meta:{title,lang}, blocks: [...], assets: [{cid, blob, name, size, mime}] }
options: { wsUrl, chunkSize, onProgress(docProgress), onAssetProgress(cid, offset, total) }
*/
export async function startDocumentUpload(doc, options = {}) {
  const wsUrl = options.wsUrl || 'ws://localhost:8765/mcp';
  const chunkSize = options.chunkSize || 256*1024;
  const onProgress = options.onProgress || (()=>{});
  const onAssetProgress = options.onAssetProgress || (()=>{});

  const correlationId = uuidShort();
  const ws = new WebSocket(wsUrl);
  ws.binaryType = 'arraybuffer';

  // wait open
  await new Promise((resolve, reject) => {
    const t = setTimeout(()=>reject(new Error('ws open timeout')), 8000);
    ws.onopen = () => { clearTimeout(t); resolve(); };
    ws.onerror = (e) => { clearTimeout(t); reject(new Error('ws error')); };
  });

  // prepare assets list metadata
  const assetsMeta = (doc.assets || []).map(a => ({ cid: a.cid, name: a.name, size: a.size || a.blob.size, mime: a.mime || (a.blob && a.blob.type) || 'application/octet-stream' }));

  // send start_upload control frame
  sendJson(ws, { type: 'start_upload', correlationId, docMeta: { id: doc.id, title: doc.meta?.title || '', lang: doc.meta?.lang || 'en' }, assets: assetsMeta, chunkSize });

  // persist initial progress
  await saveProgress({ correlationId, assets: {} }).catch(()=>{});

  // listen for server messages (ACKs, resume requests)
  ws.onmessage = (ev) => {
    // user can hook into onProgress via options; we handle ack logic inside sendAssetWithResume
    try {
      const msg = JSON.parse(ev.data);
      if (msg.type === 'ack' && msg.correlationId === correlationId) {
        onProgress({ type: 'ack', lastOffset: msg.lastOffset });
      }
      if (msg.type === 'resume_request' && msg.correlationId === correlationId) {
        // server asks to resume: handled by sendAssetWithResume which queries persisted progress
      }
    } catch (e) {
      // ignore non-json messages (binary handled elsewhere)
    }
  };

  // send assets sequentially (to limit memory/IO on A10)
  for (const asset of (doc.assets || [])) {
    await sendAssetWithResume(ws, correlationId, asset, {
      chunkSize,
      onProgress: (offset, total) => {
        onAssetProgress(asset.cid, offset, total);
        // overall progress
        const sent = offset; // approximate
        onProgress({ type: 'asset', cid: asset.cid, sent, total });
      }
    });
  }

  // send final control frame
  sendJson(ws, { type: 'complete', correlationId, status: 'ok' });

  // cleanup persisted progress
  await deleteProgress(correlationId).catch(()=>{});

  // close ws gracefully
  ws.close();

  return { status: 'ok', correlationId };
}

// ----------------------------- Resume helper -----------------------------
export async function resumeUpload(correlationId, wsUrl='ws://localhost:8765/mcp') {
  const prog = await loadProgress(correlationId);
  if (!prog) throw new Error('No progress found for correlationId');
  const ws = new WebSocket(wsUrl);
  ws.binaryType = 'arraybuffer';
  await new Promise((res, rej) => {
    const t = setTimeout(()=>rej(new Error('ws open timeout')), 8000);
    ws.onopen = () => { clearTimeout(t); res(); };
    ws.onerror = () => { clearTimeout(t); rej(new Error('ws error')); };
  });
  // ask server for lastOffset
  sendJson(ws, { type: 'resume_request', correlationId });
  // server should reply with resume_response { lastOffset } and then we can continue sending assets from that offset
  // For brevity, we return ws and let caller orchestrate (or call startDocumentUpload with same correlationId)
  return { ws, prog };
}

// ----------------------------- EPUB generator (nav.xhtml, content.opf minimal) -----------------------------
export function generateNavXhtml(doc) {
  // doc.blocks: [{id, title}]
  const lang = doc.meta?.lang || 'ca';
  const navItems = (doc.blocks || []).map(b => `<li><a href="#${escapeXml(b.id)}">${escapeXml(b.title || b.id)}</a></li>`).join('\n');
  return `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="${lang}">
  <head>
    <meta charset="utf-8"/>
    <title>Taula de Continguts</title>
  </head>
  <body role="document" aria-label="Table of Contents">
    <nav epub:type="toc" id="toc" role="navigation" aria-label="Taula de Continguts">
      <h1>Índex</h1>
      <ol>
        ${navItems}
      </ol>
    </nav>
  </body>
</html>`;
}

export function generateContentOpf(doc) {
  const id = doc.id || 'doc';
  const title = escapeXml(doc.meta?.title || 'Sense Títol');
  const lang = doc.meta?.lang || 'ca';
  // manifest: each block as xhtml, each asset as item
  const items = [];
  const spine = [];
  (doc.blocks || []).forEach((b, i) => {
    const href = `text/${b.id}.xhtml`;
    items.push(`<item id="item-${i}" href="${href}" media-type="application/xhtml+xml"/>`);
    spine.push(`<itemref idref="item-${i}"/>`);
  });
  (doc.assets || []).forEach(a => {
    const media = a.mime || 'image/jpeg';
    items.push(`<item id="${escapeXml(a.cid)}" href="assets/${escapeXml(a.cid)}" media-type="${escapeXml(media)}"/>`);
  });
  return `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="pub-id" version="3.0" xml:lang="${lang}">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="pub-id">${escapeXml(id)}</dc:identifier>
    <dc:title>${title}</dc:title>
    <dc:language>${lang}</dc:language>
  </metadata>
  <manifest>
    ${items.join('\n    ')}
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
  </manifest>
  <spine>
    ${spine.join('\n    ')}
  </spine>
</package>`;
}

function escapeXml(s='') {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
}

// ----------------------------- Typography helpers (soft-hyphen insertion, keep-with-next markers) -----------------------------
/*
Strategy:
- Insert soft hyphens (\u00AD) using a lightweight heuristic for long words (>= 12 chars) at vowel boundaries.
- Mark paragraphs that should be kept with next by adding a class marker in generated XHTML: <p class="keep-with-next">...</p>
- Set CSS in EPUB xhtml: .keep-with-next { page-break-after: avoid; } and set orphans/widows via style.
Note: This is a client-side preflow heuristic; final reflow occurs in Affinity/reader.
*/

export function insertSoftHyphens(text, minLen = 12) {
  // naive vowel-boundary hyphenation for Latin scripts
  if (!text) return text;
  return text.replace(/\w{12,}/g, (word) => {
    // insert soft hyphen every 6-8 chars at vowel boundary if possible
    const vowels = /[aeiouàèéíòóúüAEIOUÀÈÉÍÒÓÚÜ]/;
    let out = '';
    let i = 0;
    while (i < word.length) {
      const rem = word.length - i;
      if (rem <= 10) { out += word.slice(i); break; }
      // look ahead 6..8 chars for vowel
      let found = -1;
      for (let j = 6; j <= 8 && i + j < word.length; j++) {
        if (vowels.test(word[i + j])) { found = i + j; break; }
      }
      if (found === -1) { found = i + 7; }
      out += word.slice(i, found) + '\u00AD';
      i = found;
    }
    return out;
  });
}

export function markKeepWithNext(htmlString) {
  // simple heuristic: headings and short paragraphs keep with next
  return htmlString.replace(/<p>(.*?)<\/p>/g, (m, inner) => {
    if (inner.length < 80) return `<p class="keep-with-next">${inner}</p>`;
    return `<p>${inner}</p>`;
  });
}

// ----------------------------- Accessibility checklist generator -----------------------------
export function generateAccessibilityLandmarks(doc) {
  // returns small snippet to include in each xhtml file header
  const lang = doc.meta?.lang || 'ca';
  return {
    htmlAttrs: `lang="${lang}" xml:lang="${lang}"`,
    headerSnippet: `<header role="banner" aria-label="Book header"><h1>${escapeXml(doc.meta?.title || '')}</h1></header>`,
    navSnippet: `<nav role="navigation" aria-label="Table of Contents"><a href="nav.xhtml">Contents</a></nav>`,
    mainStart: `<main role="main" aria-label="Book content">`,
    mainEnd: `</main>`
  };
}

// ----------------------------- Exports done -----------------------------
export default {
  startDocumentUpload,
  resumeUpload,
  generateNavXhtml,
  generateContentOpf,
  insertSoftHyphens,
  markKeepWithNext,
  generateAccessibilityLandmarks,
  crc32,
  uuidShort
};
