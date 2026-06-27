// _scripts/crdt-offline-sync.js
// CRDT simple LWW (Last-Writer-Wins) per PWA Local-First (Sóc de Poble)
// Compatible IndexedDB, baixa connectivitat rural

class LWWRegister {
  constructor(key, value = null, timestamp = Date.now(), replicaId = 'default') {
    this.key = key;
    this.value = value;
    this.timestamp = timestamp;
    this.replicaId = replicaId; // Per desempatar si timestamps iguals
  }

  merge(other) {
    if (this.timestamp > other.timestamp) return this;
    if (other.timestamp > this.timestamp) return other;
    // Desempat per replicaId (lexicogràfic)
    return this.replicaId > other.replicaId ? this : other;
  }
}

class CRDTStore {
  constructor(dbName = 'socdepoble-crdt') {
    this.dbName = dbName;
    this.db = null;
    this.replicaId = `replica-${Math.random().toString(36).slice(2)}`;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('crdt')) {
          db.createObjectStore('crdt', { keyPath: 'key' });
        }
      };
      request.onsuccess = (event) => {
        this.db = event.target.result;
        console.log('✅ CRDT IndexedDB inicialitzat');
        resolve();
      };
      request.onerror = (event) => reject(event.target.error);
    });
  }

  async set(key, value) {
    const register = new LWWRegister(key, value, Date.now(), this.replicaId);
    return this._put(register);
  }

  async get(key) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('crdt', 'readonly');
      const store = tx.objectStore('crdt');
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ? req.result.value : null);
      req.onerror = () => reject(req.error);
    });
  }

  async _put(register) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('crdt', 'readwrite');
      const store = tx.objectStore('crdt');
      const req = store.put(register);
      req.onsuccess = () => resolve(register);
      req.onerror = () => reject(req.error);
    });
  }

  async mergeRemote(remoteRegisters) {
    for (const remote of remoteRegisters) {
      const local = await this.get(remote.key).then(r => r ? new LWWRegister(remote.key, r.value, r.timestamp, r.replicaId) : null);
      const winner = local ? local.merge(remote) : remote;
      await this._put(winner);
    }
    console.log('🔄 Merge CRDT LWW completat');
  }

  async getAll() {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('crdt', 'readonly');
      const store = tx.objectStore('crdt');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
}

export { CRDTStore, LWWRegister };
