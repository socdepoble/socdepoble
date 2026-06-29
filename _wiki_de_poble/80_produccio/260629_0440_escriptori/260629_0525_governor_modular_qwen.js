// Pseudocodi extret de l'auditoria de Qwen (Ronda 12)
// Conservat per a la implementació de l'arquitectura de Sóc de Poble

// ==========================================
// src/core/async/AsyncGovernor.js
// ==========================================
import { BancalMutex } from './BancalMutex.js';
import { QuiesceProtocol } from './QuiesceProtocol.js';
import { IOSKeepalive } from './IOSKeepalive.js';
import { JitterScheduler } from './JitterScheduler.js';
import { TimeoutGuard } from './TimeoutGuard.js';

export class AsyncGovernor {
  constructor() {
    this.mutex = new BancalMutex();
    this.quiesce = new QuiesceProtocol();
    this.keepalive = new IOSKeepalive();
    this.jitter = new JitterScheduler();
    this.timeout = new TimeoutGuard();
    
    // Cues de prioritat (0 = crítica, 1 = alta, 2 = normal, 3 = baixa)
    this.queues = {
      0: [], // Crític: Verema, SOSP-LOCK
      1: [], // Alt: Sincronització CRDT
      2: [], // Normal: Autopoiesi, Handshake
      3: []  // Baixa: Logs, estadístiques
    };
    
    this.isProcessing = false;
    this.currentPriority = null;
  }

  async schedule(taskId, taskFn, priority = 2, resource = 'GLOBAL', timeoutMs = 30000) {
    const task = { id: taskId, fn: taskFn, priority, resource, timeoutMs, timestamp: Date.now() };
    this.queues[priority].push(task);
    console.log(`[GOVERNOR] Tasca ${taskId} afegida a prioritat ${priority}`);
    if (!this.isProcessing) {
      this._processQueue();
    }
  }

  async _processQueue() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    while (this._hasPendingTasks()) {
      const task = this._getNextTask();
      if (!task) break;

      this.currentPriority = task.priority;
      console.log(`[GOVERNOR] Executant tasca ${task.id} (prioritat ${task.priority})`);

      try {
        if (task.priority > 0) {
          await this.jitter.applyJitter(task.id);
        }
        await this.mutex.acquire(task.resource, task.timeoutMs);
        await this.timeout.withTimeout(task.fn(), task.timeoutMs, `Tasca ${task.id} ha excedit el timeout`);
        this.mutex.release(task.resource);
        console.log(`[GOVERNOR] Tasca ${task.id} completada`);
      } catch (error) {
        console.error(`[GOVERNOR] Error en tasca ${task.id}:`, error);
        this.mutex.release(task.resource);
        if (task.priority === 0) {
          window.dispatchEvent(new CustomEvent('sdp-governor-critical-failure', {
            detail: { taskId: task.id, error: error.message }
          }));
        }
      }
    }
    this.isProcessing = false;
    this.currentPriority = null;
  }

  _getNextTask() {
    for (let priority = 0; priority <= 3; priority++) {
      if (this.queues[priority].length > 0) {
        return this.queues[priority].shift();
      }
    }
    return null;
  }

  _hasPendingTasks() {
    return Object.values(this.queues).some(queue => queue.length > 0);
  }

  async enterQuiesce() {
    await this.quiesce.enterQuiesce();
    console.log('[GOVERNOR] Mode Quiesce activat');
  }

  async exitQuiesce() {
    await this.quiesce.exitQuiesce();
    console.log('[GOVERNOR] Mode Quiesce desactivat');
  }

  async initKeepalive() {
    await this.keepalive.check();
    console.log('[GOVERNOR] Keepalive iOS inicialitzat');
  }

  getStatus() {
    return {
      isProcessing: this.isProcessing,
      currentPriority: this.currentPriority,
      queueSizes: {
        critical: this.queues[0].length,
        high: this.queues[1].length,
        normal: this.queues[2].length,
        low: this.queues[3].length
      },
      mutexLocked: this.mutex.getLockedResources()
    };
  }
}
export const asyncGovernor = new AsyncGovernor();

// ==========================================
// src/core/async/BancalMutex.js
// ==========================================
export class BancalMutex {
  constructor() {
    this._locks = new Map();
  }
  async acquire(resource, timeoutMs = 5000) {
    const start = Date.now();
    while (this._locks.has(resource)) {
      if (Date.now() - start > timeoutMs) {
        throw new Error(`[MUTEX] Recurs '${resource}' ocupat. Timeout superat.`);
      }
      await new Promise(r => setTimeout(r, 100));
    }
    this._locks.set(resource, true);
    return true;
  }
  release(resource) {
    this._locks.delete(resource);
  }
  getLockedResources() {
    return Array.from(this._locks.keys());
  }
}

// ==========================================
// src/core/async/QuiesceProtocol.js
// ==========================================
export class QuiesceProtocol {
  constructor() {
    this._isQuiesced = false;
    this._pendingDeltas = [];
  }
  async enterQuiesce() {
    this._isQuiesced = true;
    this._pendingDeltas = [];
    await this._persistState(true);
  }
  async queueDelta(delta) {
    if (this._isQuiesced) {
      this._pendingDeltas.push(delta);
      return;
    }
    await this._sendDelta(delta);
  }
  async exitQuiesce() {
    this._isQuiesced = false;
    await this._persistState(false);
    for (const delta of this._pendingDeltas) {
      await this._sendDelta(delta);
    }
    this._pendingDeltas = [];
  }
  async _persistState(state) {
    const db = await this._openDB();
    const tx = db.transaction('governor', 'readwrite');
    tx.objectStore('governor').put({ key: 'quiesce_state', value: state });
  }
  async _openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('SDP_Governor', 1);
      request.onupgradeneeded = (event) => {
        event.target.result.createObjectStore('governor', { keyPath: 'key' });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  async _sendDelta(delta) {
    if (window.__YJS_PROVIDER__) {
      await window.__YJS_PROVIDER__.sendDelta(delta);
    }
  }
}

// ==========================================
// src/core/async/IOSKeepalive.js
// ==========================================
export class IOSKeepalive {
  constructor() {
    this.SURVIVAL_THRESHOLD_DAYS = 20;
    this.AMNESIA_THRESHOLD_DAYS = 30;
  }
  async check() {
    const lastOpened = await this._getLastOpened();
    const daysPassed = Math.floor((Date.now() - lastOpened) / (1000 * 60 * 60 * 24));
    await this._setLastOpened(Date.now());
    if (daysPassed >= this.SURVIVAL_THRESHOLD_DAYS) {
      const daysUntilAmnesia = this.AMNESIA_THRESHOLD_DAYS - daysPassed;
      window.dispatchEvent(new CustomEvent('sdp-avisador-efimer', {
        detail: {
          tipus: 'SUPERVIVENCIA',
          missatge: `Fa ${daysPassed} dies que no obrim el Mas. Apple esborrarà tot en ${daysUntilAmnesia} dies. Fes una còpia o sincronitza ara.`,
          persistencia: true
        }
      }));
    }
  }
  async _getLastOpened() {
    const db = await this._openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('keepalive', 'readonly');
      const request = tx.objectStore('keepalive').get('last_opened');
      request.onsuccess = () => resolve(request.result?.value || Date.now());
      request.onerror = () => reject(request.error);
    });
  }
  async _setLastOpened(timestamp) {
    const db = await this._openDB();
    const tx = db.transaction('keepalive', 'readwrite');
    tx.objectStore('keepalive').put({ key: 'last_opened', value: timestamp });
  }
  async _openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('SDP_Governor', 1);
      request.onupgradeneeded = (event) => {
        if (!event.target.result.objectStoreNames.contains('keepalive')) {
          event.target.result.createObjectStore('keepalive', { keyPath: 'key' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

// ==========================================
// src/core/async/JitterScheduler.js
// ==========================================
export class JitterScheduler {
  constructor() {
    this.maxJitterMs = 5000;
  }
  async applyJitter(taskId) {
    const jitterMs = Math.floor(Math.random() * this.maxJitterMs);
    console.log(`[JITTER] Tasca ${taskId} espera ${jitterMs}ms`);
    await new Promise(r => setTimeout(r, jitterMs));
  }
}

// ==========================================
// src/core/async/TimeoutGuard.js
// ==========================================
export class TimeoutGuard {
  async withTimeout(promise, ms, fallbackMsg = 'Temps esgotat') {
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error(`[TIMEOUT] ${fallbackMsg}`)), ms);
    });
    return Promise.race([
      promise.finally(() => clearTimeout(timeoutId)),
      timeoutPromise
    ]);
  }
}

// ==========================================
// src/workers/AutopoiesiWorker.js
// ==========================================
// self.addEventListener('message', async (event) => {
//   const { action, data } = event.data;
//   if (action === 'SCAN_WIKI') {
//     const proposals = await scanWikiForPruning(data.wikiPath);
//     self.postMessage({ action: 'PRUNING_PROPOSALS', proposals });
//   }
// });
// async function scanWikiForPruning(wikiPath) { return []; }


// Enllaç orgànic per netejar el graf: [[00_index_escriptori]]
