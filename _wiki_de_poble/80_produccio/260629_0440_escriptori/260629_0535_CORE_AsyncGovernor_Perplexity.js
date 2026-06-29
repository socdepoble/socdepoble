// Pseudocodi extret de l'auditoria de Perplexity (Ronda 12)
// Conservat per a la implementació de l'arquitectura de Sóc de Poble

// async-governor.js

export class AsyncGovernor {
  constructor(opts = {}) {
    this.maxWorkers = opts.maxWorkers ?? 2;
    this.jitterMs = opts.jitterMs ?? [250, 2500];
    this.uiTimeoutMs = opts.uiTimeoutMs ?? 10000;
    this.keepaliveMs = opts.keepaliveMs ?? 25 * 24 * 60 * 60 * 1000;
    this.queue = [];
    this.running = new Map();
    this.locked = false;
    this.quiescing = false;
    this.epoch = 0;
    this.workerBudget = 0;
    this.keepaliveTimer = null;
  }

  start() {
    this.installVisibilityHooks();
    this.startKeepalive();
  }

  stop() {
    this.stopKeepalive();
    this.uninstallVisibilityHooks();
  }

  enqueue(type, task, meta = {}) {
    const job = {
      id: crypto.randomUUID(),
      type,
      task,
      meta,
      priority: meta.priority ?? 0,
      createdAt: Date.now(),
      state: 'pending'
    };
    this.queue.push(job);
    this.queue.sort((a, b) => b.priority - a.priority || a.createdAt - b.createdAt);
    queueMicrotask(() => this.pump());
    return job.id;
  }

  async pump() {
    if (this.locked || this.quiescing) return;

    while (this.queue.length && this.running.size < this.maxWorkers && !this.quiescing) {
      const job = this.queue.shift();
      this.running.set(job.id, job);

      const delay = this.getJitter(job);
      job.state = 'scheduled';

      setTimeout(async () => {
        try {
          job.state = 'running';
          const result = await this.runJob(job);
          job.state = 'done';
          job.result = result;
        } catch (err) {
          job.state = 'failed';
          job.error = err;
          if (job.type === 'ui' && this.shouldEnterMasCau(err)) {
            this.enterMasCauMode(err);
          }
        } finally {
          this.running.delete(job.id);
          if (!this.quiescing) queueMicrotask(() => this.pump());
        }
      }, delay);
    }
  }

  getJitter(job) {
    if (job.meta.noJitter) return 0;
    const [min, max] = this.jitterMs;
    return Math.floor(min + Math.random() * (max - min));
  }

  async runJob(job) {
    switch (job.type) {
      case 'verema':
        return this.runWithMutex(() => this.withQuiesce(job.task));
      case 'autopoiesi':
        return this.runWithMutex(() => this.withTimeout(job.task(), this.uiTimeoutMs, 'autopoiesi'));
      case 'sync':
        return this.runWithMutex(() => this.withTimeout(job.task(), this.uiTimeoutMs, 'sync'));
      case 'ui':
        return this.withTimeout(job.task(), this.uiTimeoutMs, 'ui');
      case 'keepalive':
        return this.withTimeout(job.task(), 5000, 'keepalive');
      default:
        return job.task();
    }
  }

  async runWithMutex(fn) {
    if (this.locked) return false;
    this.locked = true;
    try {
      return await fn();
    } finally {
      this.locked = false;
    }
  }

  async withQuiesce(fn) {
    if (this.quiescing) return false;
    this.quiescing = true;
    const myEpoch = ++this.epoch;

    try {
      await this.freezeIncomingDeltas(myEpoch);
      const result = await fn({ epoch: myEpoch });
      await this.flushPendingDeltas(myEpoch);
      return result;
    } finally {
      await this.thawIncomingDeltas(myEpoch);
      this.quiescing = false;
    }
  }

  async freezeIncomingDeltas(epoch) {
    window.dispatchEvent(new CustomEvent('gov-quiesce-start', { detail: { epoch } }));
    if (window.YJSPROVIDER?.disconnect) window.YJSPROVIDER.disconnect();
  }

  async flushPendingDeltas(epoch) {
    window.dispatchEvent(new CustomEvent('gov-quiesce-flush', { detail: { epoch } }));
  }

  async thawIncomingDeltas(epoch) {
    if (window.YJSPROVIDER?.connect) window.YJSPROVIDER.connect();
    window.dispatchEvent(new CustomEvent('gov-quiesce-end', { detail: { epoch } }));
  }

  withTimeout(promise, ms, label) {
    let t;
    const timeout = new Promise((_, reject) => {
      t = setTimeout(() => reject(new Error(`${label} timeout`)), ms);
    });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(t));
  }

  shouldEnterMasCau(err) {
    return String(err?.message || err).includes('timeout');
  }

  enterMasCauMode(err) {
    document.documentElement.classList.add('mas-cau-mode');
    window.dispatchEvent(new CustomEvent('mas-cau-mode', { detail: { error: String(err) } }));
  }

  installVisibilityHooks() {
    this._onVisibility = async () => {
      if (document.visibilityState === 'visible') {
        await this.startKeepalive();
        this.enqueue('sync', async () => {
          await navigator.storage?.persist?.();
          await window.YJSPROVIDER?.sync?.();
        }, { priority: 10, noJitter: true });
      } else {
        window.YJSPROVIDER?.disconnect?.();
      }
    };
    document.addEventListener('visibilitychange', this._onVisibility);
  }

  uninstallVisibilityHooks() {
    if (this._onVisibility) document.removeEventListener('visibilitychange', this._onVisibility);
  }

  startKeepalive() {
    this.stopKeepalive();
    this.keepaliveTimer = setInterval(() => {
      this.enqueue('keepalive', async () => {
        if (document.visibilityState === 'visible') {
          await navigator.storage?.persist?.();
        }
      }, { priority: -10, noJitter: true });
    }, this.keepaliveMs);
  }

  stopKeepalive() {
    if (this.keepaliveTimer) clearInterval(this.keepaliveTimer);
    this.keepaliveTimer = null;
  }

  async scheduleAutopoiesi(task) {
    return this.enqueue('autopoiesi', task, { priority: 3 });
  }

  async scheduleVerema(task) {
    return this.enqueue('verema', task, { priority: 10, noJitter: true });
  }

  async scheduleSync(task) {
    return this.enqueue('sync', task, { priority: 6 });
  }

  async scheduleUi(task) {
    return this.enqueue('ui', task, { priority: 8 });
  }
}

export const governor = new AsyncGovernor({
  maxWorkers: 2,
  uiTimeoutMs: 10000,
  keepaliveMs: 25 * 24 * 60 * 60 * 1000
});


// Enllaç orgànic per netejar el graf: [[00_index_escriptori]]
