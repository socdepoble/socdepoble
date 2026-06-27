const DB_NAME = 'SOSP_Trellat_DB';
const DB_VERSION = 1;
const STORE_NAME = 'bancals_drafts';

export const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const saveBlockToIDB = async (blockId, content, type) => {
    try {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            tx.objectStore(STORE_NAME).put({ 
                id: blockId, 
                content, 
                type, 
                updated_at: new Date().toISOString() 
            });
            tx.oncomplete = () => resolve(true);
            tx.onerror = () => reject(tx.error);
        });
    } catch (error) {
        console.error("[IAIA_Sistema] Hemorràgia fallida enterrant bancal:", error);
    }
};

export const removeBlockFromIDB = async (blockId) => {
    try {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            tx.objectStore(STORE_NAME).delete(blockId);
            tx.oncomplete = () => resolve(true);
            tx.onerror = () => reject(tx.error);
        });
    } catch (error) {
        // Fallback silenciós si el bloc no existia en disc
    }
};
