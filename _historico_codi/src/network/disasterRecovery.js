const DB_NAME = "SocDePobleOffsetDB";
const STORE_NAME = "exportOffsets";

/**
 * Accesser per a la base de dades local.
 * Cap external dependency.
 */
function getDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "sessionId" });
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Guarda l'estat d'un resum de chunks per si cau el WS.
 * @param {string} sessionId 
 * @param {Record<string, number>} lastSentOffsetPerResource Map de assetId a offsets enviats i confirmats
 */
export async function saveResumeState(sessionId, lastSentOffsetPerResource) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORE_NAME], "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const data = {
      sessionId,
      offsets: lastSentOffsetPerResource,
      timestamp: Date.now()
    };
    const req = store.put(data);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

/**
 * Carrega els offsets per a reprendre the transferència.
 * @param {string} sessionId 
 * @returns {Promise<Record<string, number>|null>} 
 */
export async function loadResumeState(sessionId) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORE_NAME], "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(sessionId);
    req.onsuccess = () => resolve(req.result ? req.result.offsets : null);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Neteja l'estat quan l'exportació s'ha validat al 100%
 * @param {string} sessionId 
 */
export async function clearResumeState(sessionId) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORE_NAME], "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(sessionId);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
