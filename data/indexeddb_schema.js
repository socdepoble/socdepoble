// data/indexeddb_schema.js
const DB_NAME = 'masia_db';
const DB_VERSION = 4;

const schemas = {
    mur: { 
        keyPath: 'id', 
        indexes: ['poble', 'timestamp', 'autor'] 
    },
    xat: { 
        keyPath: 'missatge_id', 
        indexes: ['conversacio_id', 'timestamp'] 
    },
    mercat: { 
        keyPath: 'anunci_id', 
        indexes: ['poble', 'categoria', 'preu'] 
    },
    flags: { 
        keyPath: 'clau' 
    },
    crdt_state: { 
        keyPath: 'tipus' 
    }
};

async function iniciaIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            Object.keys(schemas).forEach(storeName => {
                if (!db.objectStoreNames.contains(storeName)) {
                    const store = db.createObjectStore(storeName, schemas[storeName]);
                    if (schemas[storeName].indexes) {
                        schemas[storeName].indexes.forEach(idx => {
                            store.createIndex(idx, idx, { unique: false });
                        });
                    }
                }
            });
        };
        
        request.onsuccess = () => {
            console.log("🔥 IndexedDB 'masia_db' iniciada correctament.");
            resolve(request.result);
        };
        request.onerror = (e) => {
            console.error("❌ Error iniciant IndexedDB", e);
            reject(e);
        };
    });
}

if (typeof window !== 'undefined') {
    window.iniciaIndexedDB = iniciaIndexedDB;
}
