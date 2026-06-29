// Pseudocodi extret de l'auditoria de Deepseek (Ronda 11)
// Conservat per a la implementació de l'arquitectura de Sóc de Poble

// ==========================================
// src/core/governor/Governor.js
// ==========================================
import { acquireMutex, releaseMutex } from './mutex.js';
import { atomicSwap } from './quiesce.js';
import { initKeepalive } from './keepalive.js';
import { scheduleWorkerTask } from './jitter.js';
import { withTimeout } from './timeout.js';
import { runAutopoiesis } from '../autopoiesis/autopoiesis.js';
import { checkAndRunGC } from '../crdt/gc.js';

class AsyncGovernor {
  constructor() {
    this.state = {
      mode: 'normal', // 'normal' | 'mas-cau' | 'degradat'
      isAutopoiesisRunning: false,
      isQuiesceActive: false,
      pendingTasks: [], 
      taskCounter: 0,
    };

    initKeepalive();
    this._setupListeners();
    this._startQueueProcessor();
  }

  enqueueTask(fn, priority = 'normal', timeout = 10000) {
    return new Promise((resolve, reject) => {
      const id = this.taskCounter++;
      this.state.pendingTasks.push({ id, priority, fn, timeout, resolve, reject });
      this.state.pendingTasks.sort((a, b) => {
        const order = { high: 0, normal: 1, low: 2 };
        return order[a.priority] - order[b.priority];
      });
    });
  }

  async runSyncCycle() {
    if (this.state.mode === 'mas-cau') return;

    const locked = await acquireMutex('sync');
    if (!locked) {
      console.warn('[Governor] Mutex ocupat, ajornant sync cycle.');
      return;
    }

    try {
      this.state.isQuiesceActive = true;
      const result = await withTimeout(
        atomicSwap('app_data', await this._collectSnapshot()),
        15000,
        { fallback: true }
      );
      if (result.fallback) {
        throw new Error('Quiesce timeout');
      }
      this.state.isQuiesceActive = false;

      await checkAndRunGC();
      scheduleWorkerTask(() => this.runSyncCycle(), 24 * 3600 * 1000); 
    } catch (err) {
      console.error('[Governor] Sync cycle fallit:', err);
      this._activateMasCau('sync_failure');
    } finally {
      await releaseMutex();
    }
  }

  async runAutopoiesis() {
    if (this.state.isAutopoiesisRunning || this.state.mode === 'mas-cau') return;

    const locked = await acquireMutex('autopoiesi');
    if (!locked) return;

    this.state.isAutopoiesisRunning = true;
    try {
      const result = await withTimeout(
        runAutopoiesis({ maxDepth: 3, maxProposals: 5 }),
        30000,
        { fallback: true }
      );
      if (result.fallback) {
        throw new Error('Autopoiesi timeout');
      }
    } catch (err) {
      console.error('[Governor] Autopoiesi fallida:', err);
      this._activateMasCau('autopoiesis_failure');
    } finally {
      this.state.isAutopoiesisRunning = false;
      await releaseMutex();
    }
  }

  _activateMasCau(reason) {
    if (this.state.mode === 'mas-cau') return;
    this.state.mode = 'mas-cau';
    document.documentElement.classList.add('mas-cau-mode');
    window.dispatchEvent(new CustomEvent('sosp-lock-triggered', { detail: { reason } }));
    console.error(`[Governor] Mas Cau activat per: ${reason}`);
  }

  releaseMasCau(authKey) {
    if (authKey !== 'MASTER_BYPASS') return false;
    this.state.mode = 'normal';
    document.documentElement.classList.remove('mas-cau-mode');
    window.dispatchEvent(new CustomEvent('sosp-lock-released'));
    return true;
  }

  _setupListeners() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.enqueueTask(async () => {
          if (window.__YJS_PROVIDER__) {
            window.__YJS_PROVIDER__.connect();
            window.__YJS_PROVIDER__.sync();
          }
        }, 'high', 5000);
      }
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('[Governor] Unhandled rejection:', event.reason);
      if (event.reason?.message?.includes('TIMEOUT')) {
        this._activateMasCau('timeout_critical');
      }
    });
  }

  _startQueueProcessor() {
    const process = () => {
      if (this.state.mode === 'mas-cau') {
        const tasks = this.state.pendingTasks.filter(t => t.priority === 'high');
        if (tasks.length === 0) {
          requestIdleCallback(process);
          return;
        }
        this.state.pendingTasks = tasks;
      }

      if (this.state.pendingTasks.length === 0) {
        requestIdleCallback(process);
        return;
      }

      const task = this.state.pendingTasks.shift();
      withTimeout(task.fn(), task.timeout, null)
        .then(result => task.resolve(result))
        .catch(err => {
          console.error('[Governor] Tasca fallida:', err);
          task.reject(err);
          if (task.priority === 'high') {
            this._activateMasCau('critical_task_failure');
          }
        })
        .finally(() => {
          requestIdleCallback(process);
        });
    };

    requestIdleCallback(process);
  }

  async _collectSnapshot() {
    return { timestamp: Date.now(), data: 'snapshot' };
  }
}

export const governor = new AsyncGovernor();

// ==========================================
// src/core/governor/mutex.js
// ==========================================
import { get, set, del } from 'idb-keyval';
const MUTEX_KEY = '__sdp_mutex';
export async function acquireMutex(taskType) {
  const now = Date.now();
  const lock = await get(MUTEX_KEY);
  if (lock && (now - lock.timestamp < 60000)) {
    return false; // ocupat
  }
  await set(MUTEX_KEY, { task: taskType, timestamp: now });
  return true;
}
export async function releaseMutex() {
  await del(MUTEX_KEY);
}

// ==========================================
// src/core/governor/quiesce.js
// ==========================================
export async function atomicSwap(key, newData) {
  await set(`${key}_tmp`, newData);
  if (window.__YJS_PROVIDER__) {
    window.__YJS_PROVIDER__.pauseSync?.();
  }
  const tmp = await get(`${key}_tmp`);
  if (!tmp) throw new Error('Swap failed');
  await set(key, tmp);
  await del(`${key}_tmp`);
  if (window.__YJS_PROVIDER__) {
    window.__YJS_PROVIDER__.resumeSync?.();
  }
  return true;
}

// ==========================================
// src/core/governor/keepalive.js
// ==========================================
const INTERVAL = 25 * 24 * 60 * 60 * 1000; // 25 dies
export function initKeepalive() {
  setInterval(async () => {
    await navigator.storage?.persist?.();
    await set('__keepalive_mark', Date.now());
    if (navigator.onLine) {
      try { await fetch('/keepalive-ping', { cache: 'no-store' }); } catch (_) {}
    }
  }, INTERVAL);
}

// ==========================================
// src/core/governor/jitter.js
// ==========================================
export function scheduleWorkerTask(fn, baseDelay = 0) {
  const jitter = Math.floor(Math.random() * 60000);
  setTimeout(fn, baseDelay + jitter);
}

// ==========================================
// src/core/governor/timeout.js
// ==========================================
export function withTimeout(promise, ms = 10000, fallback = null) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('TIMEOUT')), ms);
  });
  return Promise.race([promise, timeout]).catch(err => {
    if (err.message === 'TIMEOUT') return fallback;
    throw err;
  });
}

// ==========================================
// src/core/crdt/gc.js
// ==========================================
const THRESHOLD = 400 * 1024 * 1024;
export async function checkAndRunGC() {
  if (!window.performance?.memory) return;
  const used = window.performance.memory.usedJSHeapSize;
  if (used > THRESHOLD && window.__YJS_DOC__) {
    console.warn('[GC] Neteja oportunista de tombstones');
    window.__YJS_DOC__.gc();
    await set('__last_gc', Date.now());
  }
}

// ==========================================
// src/core/autopoiesis/autopoiesis.js
// ==========================================
export async function runAutopoiesis({ maxDepth = 3, maxProposals = 5 } = {}) {
  console.log(`[Autopoiesi] Executant amb profunditat ${maxDepth} i màxim ${maxProposals} propostes`);
  return { proposals: [], status: 'ok' };
}


// Enllaç orgànic per netejar el graf: [[00_index_escriptori]]
