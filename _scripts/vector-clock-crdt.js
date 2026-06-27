// _scripts/vector-clock-crdt.js
// CRDT amb Vector Clocks per resolució avançada de conflictes (Sóc de Poble)
// Més robust que LWW per entorns multi-replica rural

class VectorClock {
  constructor(replicaId) {
    this.clock = {};
    this.replicaId = replicaId || `replica-${Math.random().toString(36).slice(2)}`;
    this.clock[this.replicaId] = 0;
  }

  increment() {
    this.clock[this.replicaId] = (this.clock[this.replicaId] || 0) + 1;
    return this;
  }

  merge(other) {
    const merged = new VectorClock(this.replicaId);
    merged.clock = { ...this.clock };
    for (const [id, ts] of Object.entries(other.clock)) {
      merged.clock[id] = Math.max(merged.clock[id] || 0, ts);
    }
    return merged;
  }

  compare(other) {
    let thisDominates = true;
    let otherDominates = true;
    const allIds = new Set([...Object.keys(this.clock), ...Object.keys(other.clock)]);
    for (const id of allIds) {
      const t1 = this.clock[id] || 0;
      const t2 = other.clock[id] || 0;
      if (t1 < t2) thisDominates = false;
      if (t2 < t1) otherDominates = false;
    }
    if (thisDominates && otherDominates) return 0; // equal or concurrent
    if (thisDominates) return 1;
    if (otherDominates) return -1;
    return 0; // concurrent
  }
}

class VectorCRDTStore {
  constructor(dbName = 'socdepoble-vector-crdt') {
    this.dbName = dbName;
    this.db = null;
    this.vectorClock = new VectorClock();
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
        console.log('✅ Vector Clock CRDT IndexedDB inicialitzat');
        resolve();
      };
      request.onerror = (event) => reject(event.target.error);
    });
  }

  async set(key, value) {
    this.vectorClock.increment();
    const entry = {
      key,
      value,
      vectorClock: { ...this.vectorClock.clock },
      timestamp: Date.now()
    };
    return this._put(entry);
  }

  async get(key) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('crdt', 'readonly');
      const store = tx.objectStore('crdt');
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ? req.result : null);
      req.onerror = () => reject(req.error);
    });
  }

  async _put(entry) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('crdt', 'readwrite');
      const store = tx.objectStore('crdt');
      const req = store.put(entry);
      req.onsuccess = () => resolve(entry);
      req.onerror = () => reject(req.error);
    });
  }

  async mergeRemote(remoteEntries) {
    for (const remote of remoteEntries) {
      const local = await this.get(remote.key);
      let winner;
      if (!local) {
        winner = remote;
      } else {
        const localVC = new VectorClock().merge({clock: local.vectorClock});
        const remoteVC = new VectorClock().merge({clock: remote.vectorClock});
        const cmp = localVC.compare(remoteVC);
        if (cmp === 1) {
          winner = local;
        } else if (cmp === -1) {
          winner = remote;
        } else {
          console.warn(`⚠️ Conflicte concurrent detectat per clau ${remote.key}. Resolució manual recomanada.`);
          winner = remote; // o implementa merge custom (ex: array de versions)
        }
      }
      await this._put(winner);
    }
    console.log('🔄 Merge Vector Clock CRDT completat');
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

export { VectorCRDTStore, VectorClock };
