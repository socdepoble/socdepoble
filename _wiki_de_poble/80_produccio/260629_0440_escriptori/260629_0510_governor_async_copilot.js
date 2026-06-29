// Pseudocodi extret de l'auditoria de Copilot (Ronda 11) - GOVERNOR D'ASYNC
// Conservat per a la implementació de l'arquitectura de Sóc de Poble

// governor.js
// Esquelet integrat del Governor d'Async per Sóc de Poble
// Exporta una instància única: Governor

// ---------- Dependències mínimes helpers ----------
const sleep = ms => new Promise(r => setTimeout(r, ms));
const jitter = (baseMs, jitterMs) => baseMs + Math.floor(Math.random() * jitterMs);

// Simple IndexedDB helper (promises)
const idb = {
  async get(dbName, store, key) {
    return new Promise((res, rej) => {
      const req = indexedDB.open(dbName);
      req.onerror = () => rej(req.error);
      req.onsuccess = () => {
        const db = req.result;
        const tx = db.transaction(store, 'readonly');
        const st = tx.objectStore(store);
        const r = st.get(key);
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
      };
    });
  },
  async put(dbName, store, key, value) {
    return new Promise((res, rej) => {
      const req = indexedDB.open(dbName);
      req.onerror = () => rej(req.error);
      req.onsuccess = () => {
        const db = req.result;
        const tx = db.transaction(store, 'readwrite');
        const st = tx.objectStore(store);
        const r = st.put(value, key);
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
      };
    });
  },
  async del(dbName, store, key) {
    return new Promise((res, rej) => {
      const req = indexedDB.open(dbName);
      req.onerror = () => rej(req.error);
      req.onsuccess = () => {
        const db = req.result;
        const tx = db.transaction(store, 'readwrite');
        const st = tx.objectStore(store);
        const r = st.delete(key);
        r.onsuccess = () => res();
        r.onerror = () => rej(r.error);
      };
    });
  }
};

// ---------- GlobalMutex (lease) ----------
class GlobalMutex {
  constructor(name, opts = {}) {
    this.name = name;
    this.channel = new BroadcastChannel(`sdp-mutex-${name}`);
    this.leaseKey = `sdp-mutex-lease-${name}`;
    this.leaseTtlMs = opts.leaseTtlMs || 15000;
    this.renewIntervalMs = opts.renewIntervalMs || 5000;
    this.ownerId = opts.ownerId || crypto.randomUUID();
    this._renewTimer = null;
  }

  async tryAcquire() {
    const now = Date.now();
    const lease = await idb.get('sdp-mutex-db', 'leases', this.leaseKey).catch(()=>null);
    if (!lease || lease.expiresAt < now) {
      const newLease = { owner: this.ownerId, expiresAt: now + this.leaseTtlMs };
      await idb.put('sdp-mutex-db', 'leases', this.leaseKey, newLease);
      this.channel.postMessage({ type: 'lease-acquired', owner: this.ownerId });
      this._startRenew();
      return true;
    }
    return false;
  }

  async release() {
    const lease = await idb.get('sdp-mutex-db', 'leases', this.leaseKey).catch(()=>null);
    if (lease && lease.owner === this.ownerId) {
      await idb.del('sdp-mutex-db', 'leases', this.leaseKey);
      this.channel.postMessage({ type: 'lease-released', owner: this.ownerId });
    }
    this._stopRenew();
  }

  _startRenew() {
    if (this._renewTimer) return;
    this._renewTimer = setInterval(async () => {
      const now = Date.now();
      await idb.put('sdp-mutex-db', 'leases', this.leaseKey, { owner: this.ownerId, expiresAt: now + this.leaseTtlMs }).catch(()=>{});
    }, this.renewIntervalMs);
  }

  _stopRenew() {
    if (this._renewTimer) clearInterval(this._renewTimer);
    this._renewTimer = null;
  }
}

// ---------- withTimeout wrapper ----------
function withTimeout(promiseFactory, ms, onTimeout = ()=>{}) {
  return new Promise((resolve, reject) => {
    const abortController = new AbortController();
    let finished = false;
    const timeout = setTimeout(() => {
      if (finished) return;
      onTimeout();
      finished = true;
      abortController.abort();
      reject(new Error('SOSP_LOCK timeout'));
    }, ms);

    promiseFactory({ signal: abortController.signal })
      .then(res => {
        if (finished) return;
        finished = true;
        clearTimeout(timeout);
        resolve(res);
      })
      .catch(err => {
        if (finished) return;
        finished = true;
        clearTimeout(timeout);
        reject(err);
      });
  });
}

// ---------- QuiesceManager ----------
class QuiesceManager {
  constructor({ telemetry }) {
    this.telemetry = telemetry;
    this.state = 'RUNNING';
    this.quiesceTokenKey = 'sdp-quiesce-token';
  }

  async acquireToken(id, timeoutMs = 10000) {
    const now = Date.now();
    const token = await idb.get('sdp-quiesce-db', 'tokens', this.quiesceTokenKey).catch(()=>null);
    if (!token || token.expiresAt < now) {
      await idb.put('sdp-quiesce-db', 'tokens', this.quiesceTokenKey, { owner: id, expiresAt: now + timeoutMs });
      return true;
    }
    return false;
  }

  async releaseToken(id) {
    const token = await idb.get('sdp-quiesce-db', 'tokens', this.quiesceTokenKey).catch(()=>null);
    if (token && token.owner === id) {
      await idb.del('sdp-quiesce-db', 'tokens', this.quiesceTokenKey);
    }
  }

  async quiesceAndExport(snapshotId, serializeCRDT, verifySnapshot, atomicRename) {
    const owner = crypto.randomUUID();
    const okAcquire = await this.acquireToken(owner, 20000);
    if (!okAcquire) throw new Error('Could not acquire quiesce token');

    try {
      this.state = 'QUIESCED';
      this.telemetry?.('quiesce.start', { snapshotId });
      const tmpPath = `/opfs/snapshots/${snapshotId}.tmp`;
      const data = await serializeCRDT();
      await writeToOPFS(tmpPath, data);
      const ok = await verifySnapshot(tmpPath);
      if (!ok) throw new Error('Snapshot verification failed');
      const finalPath = `/opfs/snapshots/${snapshotId}.yjs`;
      await atomicRename(tmpPath, finalPath);
      this.telemetry?.('quiesce.done', { snapshotId });
      this.state = 'CONSOLIDATED';
    } finally {
      await this.releaseToken(owner);
    }
  }
}

// Placeholder OPFS helpers
async function writeToOPFS(path, data) { await sleep(10); }
async function atomicRename(tmpPath, finalPath) { await sleep(10); }
async function verifySnapshot(tmpPath) { await sleep(10); return true; }

// ---------- Scheduler amb Jitter i Sub-batching ----------
class Scheduler {
  constructor({ telemetry }) {
    this.telemetry = telemetry;
    this.queues = { high: [], normal: [], low: [] };
    this.running = false;
  }

  schedule(taskFn, { priority = 'normal', delayMs = 0, baseJitterMs = 0 } = {}) {
    const runAt = Date.now() + delayMs + jitter(baseJitterMs, baseJitterMs);
    this.queues[priority].push({ taskFn, runAt });
    this._ensureLoop();
  }

  _ensureLoop() {
    if (this.running) return;
    this.running = true;
    (async () => {
      while (this._hasPending()) {
        const now = Date.now();
        for (const p of ['high','normal','low']) {
          const ready = this.queues[p].filter(t => t.runAt <= now).splice(0, 50); // sub-batching 50
          for (const item of ready) {
            try {
              await item.taskFn();
            } catch (e) {
              this.telemetry?.('scheduler.task.error', { error: e.message });
            }
          }
        }
        await sleep(200); 
      }
      this.running = false;
    })();
  }

  _hasPending() {
    return Object.values(this.queues).some(q => q.length > 0);
  }
}

// ---------- GC oportunista ----------
class GCTrigger {
  constructor({ thresholdBytes = 400 * 1024 * 1024, telemetry }) {
    this.threshold = thresholdBytes;
    this.telemetry = telemetry;
  }

  async checkAndRun(getYjsUsage, runGc) {
    const usage = await getYjsUsage();
    if (usage > this.threshold) {
      this.telemetry?.('gc.trigger', { usage });
      await runGc();
      this.telemetry?.('gc.done', { usageAfter: await getYjsUsage() });
    }
  }
}

// ---------- Keepalive ----------
class Keepalive {
  constructor({ endpoint, telemetry }) {
    this.endpoint = endpoint;
    this.telemetry = telemetry;
    this.intervalMs = 24 * 60 * 60 * 1000;
  }

  async send(deviceId) {
    const payload = JSON.stringify({ deviceId, ts: Date.now() });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(this.endpoint, payload);
        this.telemetry?.('keepalive.sent', {});
        return;
      }
      await fetch(this.endpoint, { method: 'POST', body: payload, keepalive: true });
      this.telemetry?.('keepalive.sent', {});
    } catch (e) {
      this.telemetry?.('keepalive.fail', { error: e.message });
    }
  }

  registerFallback(registration) {
    if (registration?.periodicSync) {
      registration.periodicSync.register('sdp-keepalive', { minInterval: this.intervalMs }).catch(()=>{});
    } else {
      window.addEventListener('focus', () => this.send(navigator.userAgent));
      setInterval(() => this.send(navigator.userAgent), this.intervalMs);
    }
  }
}

// ---------- Governor (orquestrador) ----------
class Governor {
  constructor({ telemetry = null } = {}) {
    this.telemetry = telemetry;
    this.mutex = new GlobalMutex('bancal-autopoiesi-verema');
    this.quiesce = new QuiesceManager({ telemetry });
    this.scheduler = new Scheduler({ telemetry });
    this.gc = new GCTrigger({ telemetry });
    this.keepalive = new Keepalive({ endpoint: '/keepalive', telemetry });
    this.deviceId = crypto.randomUUID();
  }

  async runCritical(fn, { timeoutMs = 10000, requireMutex = false } = {}) {
    if (requireMutex) {
      const acquired = await this.mutex.tryAcquire();
      if (!acquired) {
        this.telemetry?.('governor.mutex.fail', {});
        throw new Error('Could not acquire global mutex');
      }
    }

    try {
      return await withTimeout(({ signal }) => fn({ signal }), timeoutMs, () => {
        this.telemetry?.('governor.timeout', {});
      });
    } finally {
      if (requireMutex) await this.mutex.release();
    }
  }

  scheduleTask(fn, opts) {
    this.scheduler.schedule(fn, opts);
  }

  async requestQuiesce(snapshotId, serializeCRDT) {
    return this.quiesce.quiesceAndExport(snapshotId, serializeCRDT, verifySnapshot, atomicRename);
  }

  async periodicChecks(getYjsUsage, runGc) {
    await this.gc.checkAndRun(getYjsUsage, runGc);
  }

  startKeepalive(registration) {
    this.keepalive.registerFallback(registration);
  }

  onTelemetry(cb) {
    this.telemetry = cb;
  }
}

// Export singleton
export const GovernorInstance = new Governor({ telemetry: (k,d)=>console.log(k,d) });


// Enllaç orgànic per netejar el graf: [[00_index_escriptori]]
