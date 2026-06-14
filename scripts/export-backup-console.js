// scripts/export-backup-console.js
// Exporta tots els snapshots i deltas com a objecte per descarregar
(async function exportRhizomeBackup() {
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
  const snapshots = await getAll('crdt-snapshots');
  const deltas = await getAll('crdt-deltas');
  const payload = { snapshots, deltas, exportedAt: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rhizome-backup-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  console.log('Export iniciat. Fitxer generat.');
})();
