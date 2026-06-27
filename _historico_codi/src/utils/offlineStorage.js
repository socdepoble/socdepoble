import { openDB } from 'idb';

const DB_NAME = 'sdp-offline-v1';
const STORE_NAME = 'epub-blobs';
const MAX_TOTAL_BYTES = 300 * 1024 * 1024; // 300MB límit total per a iPad A10

export const OfflineDocManager = {
  async init() {
    return openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'url' });
          store.createIndex('lastAccessed', 'lastAccessed');
          store.createIndex('size', 'size');
        }
      },
    });
  },

  async store(url, blob, metadata = {}) {
    try {
      const db = await this.init();
      const estimate = await navigator.storage?.estimate?.() || { usage: 0, quota: MAX_TOTAL_BYTES };
      
      // Quota guard: si s'apropa al límit (ja siga per estimate global o pel nostres límit dur), evicció LRU abans d'insertar
      if ((estimate.usage || 0) + blob.size > MAX_TOTAL_BYTES) {
        await this._evictOldest(db, blob.size);
      }
      
      await db.put(STORE_NAME, {
        url,
        blob,
        size: blob.size,
        lastAccessed: Date.now(),
        ...metadata,
      });
      console.log(`[OfflineDocManager] Guardat a memòria freda: ${url} (${(blob.size/1024/1024).toFixed(2)} MB)`);
    } catch (error) {
      console.warn('[OfflineDocManager] Error gestionant emmagatzematge Offline:', error);
    }
  },

  async retrieve(url) {
    try {
      const db = await this.init();
      const record = await db.get(STORE_NAME, url);
      if (record) {
        // Actualitzem l'ús per a l'evicció LRU
        await db.put(STORE_NAME, { ...record, lastAccessed: Date.now() });
        console.log(`[OfflineDocManager] Recuperat de memòria freda IDB: ${url}`);
        return record.blob;
      }
      return null;
    } catch (error) {
       console.warn('[OfflineDocManager] Error recuperant dades d\'IDB:', error);
       return null;
    }
  },

  async _evictOldest(db, neededBytes) {
    console.warn(`[OfflineDocManager] Evicció disparada. Necessitem recuperar ${(neededBytes/1024/1024).toFixed(2)} MB`);
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('lastAccessed');
    let cursor = await index.openCursor();
    let freed = 0;
    
    while (cursor && freed < neededBytes) {
      const record = cursor.value;
      await store.delete(record.url);
      freed += record.size;
      cursor = await cursor.continue();
    }
    await tx.done;
  },

  async getUsage() {
    try {
      const db = await this.init();
      const all = await db.getAll(STORE_NAME);
      return {
        totalBytes: all.reduce((sum, r) => sum + r.size, 0),
        count: all.length,
        estimate: await navigator.storage?.estimate?.() || null,
      };
    } catch (error) {
       return { totalBytes: 0, count: 0, estimate: null };
    }
  },
};
