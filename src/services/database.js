import { openDB } from 'idb';

class IndexedDBProvider {
    constructor(name) {
        this.dbName = name;
    }

    async getDB() {
        return openDB(this.dbName, 1, {
            upgrade(db) {
                db.createObjectStore('rhizome', { keyPath: 'key' });
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
}

export { IndexedDBProvider };
