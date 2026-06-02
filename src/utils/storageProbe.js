export async function checkStorageCapabilities() {
  const caps = {
    indexedDB: false,
    opfs: false,
    privateMode: false
  };

  // Check IndexedDB
  try {
    const idbTest = new Promise((resolve, reject) => {
      const req = indexedDB.open('__idb_probe', 1);
      req.onsuccess = () => { req.result.close(); resolve(true); };
      req.onerror = () => reject(new Error('IDB Blocked'));
    });
    
    // Timeout of 500ms since Safari Private Mode hangs promises instead of rejecting
    const idbResult = await Promise.race([
      idbTest,
      new Promise((_, reject) => setTimeout(() => reject(new Error('IDB Timeout')), 500))
    ]);
    caps.indexedDB = idbResult === true;
  } catch (e) {
    caps.indexedDB = false;
  }

  // Check OPFS
  try {
    const opfsTest = navigator.storage.getDirectory();
    const opfsResult = await Promise.race([
      opfsTest,
      new Promise((_, reject) => setTimeout(() => reject(new Error('OPFS Timeout')), 500))
    ]);
    caps.opfs = !!opfsResult;
  } catch (e) {
    caps.opfs = false;
  }

  // Safari heuristics for Private Mode
  if (!caps.indexedDB && !caps.opfs) {
    caps.privateMode = true;
  }

  return caps;
}
