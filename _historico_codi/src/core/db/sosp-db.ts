// SOSP_Biblioteconomia_DB - Càmera Cuirassada (IndexedDB Natiu - Zero Dependències)
// Optimitzat per a iPad A10: Transaccions atòmiques i emmagatzematge separat.

const DB_NAME = 'SOSP_Biblioteconomia_DB';
const DB_VERSION = 1;

// Noms de les 3 taules dictades pel Protocol
const STORE_META = 'llibres_meta';
const STORE_CHUNKS = 'llibres_chunks';
const STORE_ASSETS = 'llibres_assets';

let dbInstance: IDBDatabase | null = null;

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (dbInstance) return resolve(dbInstance);

    // Utilitzem globalThis.indexedDB per compatibilitat amb WebWorker i Finestra Principal
    const indexedDB = globalThis.indexedDB || (globalThis as any).webkitIndexedDB || (globalThis as any).mozIndexedDB;
    if (!indexedDB) {
      return reject(new Error('IndexedDB no suportat en aquest entorn.'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('[SOSP DB] Error inicialitzant IndexedDB', event);
      reject(new Error('No s\'ha pogut obrir la base de dades local.'));
    };

    request.onsuccess = (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // 1. Taula de Llibres (Meta)
      if (!db.objectStoreNames.contains(STORE_META)) {
        db.createObjectStore(STORE_META, { keyPath: 'id' });
      }

      // 2. Taula de Chunks (Capítols processats pel Worker)
      if (!db.objectStoreNames.contains(STORE_CHUNKS)) {
        db.createObjectStore(STORE_CHUNKS, { keyPath: 'id' });
      }

      // 3. Taula d'Assets (Imatges i fonts)
      if (!db.objectStoreNames.contains(STORE_ASSETS)) {
        db.createObjectStore(STORE_ASSETS, { keyPath: 'id' });
      }
    };
  });
};

// ==========================================
// API D'ESCRIPTURA I LECTURA (Càmera Cuirassada)
// ==========================================

export const sospDb = {
  // META
  async saveBookMeta(meta: any): Promise<void> {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_META, 'readwrite');
      tx.objectStore(STORE_META).put(meta);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  async getBookMeta(id: string): Promise<any | undefined> {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_META, 'readonly');
      const req = tx.objectStore(STORE_META).get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },

  async getAllBooksMeta(): Promise<any[]> {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_META, 'readonly');
      const req = tx.objectStore(STORE_META).getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },

  // CHUNKS
  async saveChunk(id: string, html: string): Promise<void> {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_CHUNKS, 'readwrite');
      tx.objectStore(STORE_CHUNKS).put({ id, html });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  async getChunk(id: string): Promise<string | undefined> {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_CHUNKS, 'readonly');
      const req = tx.objectStore(STORE_CHUNKS).get(id);
      req.onsuccess = () => resolve(req.result ? req.result.html : undefined);
      req.onerror = () => reject(req.error);
    });
  },

  // Neteja total d'un llibre
  async deleteBook(bookId: string): Promise<void> {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_META, STORE_CHUNKS, STORE_ASSETS], 'readwrite');
      
      tx.objectStore(STORE_META).delete(bookId);
      
      // Neteja manual iterant per prefix
      const chunkStore = tx.objectStore(STORE_CHUNKS);
      const reqChunks = chunkStore.openCursor();
      reqChunks.onsuccess = (e) => {
        const cursor = (e.target as IDBRequest).result as IDBCursorWithValue;
        if (cursor) {
          if (cursor.key.toString().startsWith(`epub_${bookId}`)) {
            cursor.delete();
          }
          cursor.continue();
        }
      };

      const assetStore = tx.objectStore(STORE_ASSETS);
      const reqAssets = assetStore.openCursor();
      reqAssets.onsuccess = (e) => {
        const cursor = (e.target as IDBRequest).result as IDBCursorWithValue;
        if (cursor) {
          if (cursor.key.toString().startsWith(`epub_${bookId}`)) {
            cursor.delete();
          }
          cursor.continue();
        }
      };

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
};
