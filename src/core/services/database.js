import { openDB } from 'idb';

class IndexedDBProvider {
    constructor(name) {
        this.dbName = name;
    }

    async getDB() {
        return openDB(this.dbName, 2, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('rhizome')) {
                    db.createObjectStore('rhizome', { keyPath: 'key' });
                }
            }
        });
    }

    async put(key, value) {
        const db = await this.getDB();
        await db.put('rhizome', { key, value });
    }

    async get(key) {
        const db = await this.getDB();
        const record = await db.get('rhizome', key);
        return record?.value || null;
    }

    async delete(key) {
        const db = await this.getDB();
        await db.delete('rhizome', key);
    }

    /**
     * [Protocol LRU Paranoia]
     * Limpia entradas antiguas de media en IndexedDB para no asfixiar dispositivos de gama baja.
     */
    async enforceLRUMediaPolicy(maxItems = 100) {
        try {
            const db = await this.getDB();
            const tx = db.transaction('rhizome', 'readwrite');
            const store = tx.objectStore('rhizome');
            const allKeys = await store.getAllKeys();
            
            // Fila de medias
            const mediaKeys = allKeys.filter(k => typeof k === 'string' && (k.startsWith('media_') || k.startsWith('ipfs_')));
            
            if (mediaKeys.length > maxItems) {
                const records = await Promise.all(
                    mediaKeys.map(async key => {
                        const val = await store.get(key);
                        return { key, ts: val?.timestamp || 0 };
                    })
                );
                
                // Ordenar más viejos primero
                records.sort((a, b) => a.ts - b.ts);
                
                const toDeleteCount = records.length - maxItems;
                const toDelete = records.slice(0, toDeleteCount);
                
                for (const item of toDelete) {
                    await store.delete(item.key);
                }
                await tx.done;
                return toDeleteCount;
            }
        } catch (e) {
            console.error('[IDB Paranoia] Error enforcing LRU limit:', e);
        }
        return 0;
    }
}

export { IndexedDBProvider };

