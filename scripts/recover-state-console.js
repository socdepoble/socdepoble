// scripts/recover-state-console.js
// Executar a la consola del navegador (staging) per verificar i intentar reparar l'estat local.

(async function recoverRhizomeState() {
  console.log('Iniciant procés de recuperació Rhizome');

  function openDb() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('rhizome-store', 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('crdt-deltas')) db.createObjectStore('crdt-deltas', { keyPath: 'ts' });
        if (!db.objectStoreNames.contains('crdt-snapshots')) db.createObjectStore('crdt-snapshots', { keyPath: 'ts' });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function getAll(storeName) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => { db.close(); resolve(req.result); };
      req.onerror = (e) => { db.close(); reject(e); };
    });
  }

  async function arrayBufferToUint8(arr) {
    if (arr instanceof ArrayBuffer) return new Uint8Array(arr);
    if (arr instanceof Blob) return new Uint8Array(await arr.arrayBuffer());
    if (arr instanceof Uint8Array) return arr;
    return new Uint8Array(arr);
  }

  async function sha256(u8) {
    const hash = await crypto.subtle.digest('SHA-256', u8);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,'0')).join('');
  }

  // 1. Llistar snapshots i deltas
  const snapshots = await getAll('crdt-snapshots');
  const deltas = await getAll('crdt-deltas');
  console.log('Snapshots:', snapshots.length, 'Deltas:', deltas.length);

  // 2. Verificar checksums si existeixen a meta
  const validSnapshots = [];
  for (const s of snapshots) {
    try {
      const blobU8 = await arrayBufferToUint8(s.blob);
      const h = await sha256(blobU8);
      const metaHash = s.meta && s.meta.hash;
      if (!metaHash || metaHash === h) {
        validSnapshots.push({ ts: s.ts, blob: blobU8, hash: h });
      } else {
        console.warn('Snapshot checksum mismatch', s.ts, metaHash, h);
      }
    } catch (e) {
      console.error('Error verificació snapshot', s.ts, e);
    }
  }

  if (!validSnapshots.length) {
    console.error('No hi ha snapshots vàlids. Considera reconstruir a partir de deltas o restaurar backup extern.');
    return;
  }

  // 3. Triar snapshot més recent vàlid
  validSnapshots.sort((a,b) => b.ts - a.ts);
  const base = validSnapshots[0];
  console.log('Usant snapshot base ts=', base.ts, 'hash=', base.hash);

  // 4. Ordenar deltas posteriors al snapshot
  const deltasAfter = deltas
    .filter(d => d.ts > base.ts)
    .sort((a,b) => a.ts - b.ts);

  console.log('Deltas a aplicar:', deltasAfter.length);

  // 5. Aplicar snapshot + deltas a ydoc (si Y està disponible)
  if (typeof Y === 'undefined' || !Y.applyUpdate) {
    console.warn('Yjs no està disponible en aquest context. Només verificació feta. Exporta snapshot i deltas per aplicar en entorn amb Y.');
    // Exportar base + deltas per a recuperació manual
    window.__rhizome_recovery_package = { base, deltas: deltasAfter.map(d => ({ ts: d.ts, blob: d.blob })) };
    console.log('Paquet de recuperació disponible a window.__rhizome_recovery_package');
    return;
  }

  try {
    // crear ydoc nou i aplicar state
    const ydoc = new Y.Doc();
    // si el snapshot és un stateUpdate, aplicar directament
    Y.applyUpdate(ydoc, base.blob);
    for (const d of deltasAfter) {
      const u8 = await arrayBufferToUint8(d.blob);
      try {
        Y.applyUpdate(ydoc, u8);
      } catch (e) {
        console.error('Error aplicant delta ts=', d.ts, e);
        // marcar per a revisió
      }
    }
    console.log('Aplicació completada. Estat reconstruït en ydoc.');
    // Opcional: crear nou snapshot i guardar-lo
    const newState = Y.encodeStateAsUpdate(ydoc);
    const newHash = await sha256(newState);
    // guardar snapshot nou a IDB
    const db = await openDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction('crdt-snapshots', 'readwrite');
      const store = tx.objectStore('crdt-snapshots');
      const entry = { ts: Date.now(), blob: newState, meta: { hash: newHash } };
      const r = store.add(entry);
      r.onsuccess = () => { db.close(); resolve(true); };
      r.onerror = (e) => { db.close(); reject(e); };
    });
    console.log('Nou snapshot creat i emmagatzemat amb hash', newHash);
  } catch (err) {
    console.error('Error durant la reconstrucció amb Yjs', err);
  }
})();
