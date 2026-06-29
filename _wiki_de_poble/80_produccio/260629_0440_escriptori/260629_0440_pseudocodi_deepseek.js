// Pseudocodi extret de l'auditoria de Deepseek (Ronda 11)
// Conservat per a la implementació de l'arquitectura de Sóc de Poble

// Punt 2 – Jitter per a Web Workers (Thundering Herd)
export function scheduleWorkerTask(taskFn, baseDelay = 0) {
  const jitter = Math.floor(Math.random() * 60000); // fins a 1 minut
  const delay = baseDelay + jitter;
  setTimeout(() => {
    taskFn();
  }, delay);
}

// Punt 4 – Regulador de cabal (sub-batching de 50 events)
const BATCH_SIZE = 50;
const MAX_QUEUE_BYTES = 200 * 1024; // 200KB

export async function processQueue(queue) {
  const totalBytes = new Blob(queue).size;
  if (totalBytes > MAX_QUEUE_BYTES) {
    for (let i = 0; i < queue.length; i += BATCH_SIZE) {
      const subBatch = queue.slice(i, i + BATCH_SIZE);
      await processSubBatch(subBatch);
      await new Promise(r => requestIdleCallback(r));
    }
  } else {
    await processSubBatch(queue);
  }
}

// Punt 8 – Protocol Quiesce (Swap Atòmic)
import { set, get, del } from 'idb-keyval';

export async function atomicSwap(key, newData) {
  await set(`${key}_tmp`, newData);
  if (window.__YJS_PROVIDER__) {
    window.__YJS_PROVIDER__.pauseSync();
  }
  const tmp = await get(`${key}_tmp`);
  await set(key, tmp);
  await del(`${key}_tmp`);
  if (window.__YJS_PROVIDER__) {
    window.__YJS_PROVIDER__.resumeSync();
  }
}

// Punt 11 – Timeouts anti-deadlock (Promise.race)
export function withTimeout(promise, ms = 10000, fallback = null) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('TIMEOUT')), ms);
  });
  return Promise.race([promise, timeout])
    .catch(err => {
      if (err.message === 'TIMEOUT') {
        console.warn('[TIMEOUT] Execució bloquejada, retornant fallback');
        return fallback;
      }
      throw err;
    });
}

// Punt 13 – GC oportunista de Tombstones (400MB)
const RAM_THRESHOLD = 400 * 1024 * 1024; // 400MB

export async function checkAndRunGC() {
  if (!window.performance?.memory) return;
  const used = window.performance.memory.usedJSHeapSize;
  if (used > RAM_THRESHOLD && window.__YJS_DOC__) {
    console.warn('[GC OPORTUNISTA] RAM alta, netejant tombstones');
    await new Promise(resolve => {
      window.__YJS_DOC__.gc();
      resolve();
    });
    await set('__last_gc', Date.now());
  }
}

// Punt 15 – Mutex Global de Workers (Semàfor simple)
const MUTEX_KEY = '__sdp_worker_mutex';

export async function acquireMutex(taskType) {
  const now = Date.now();
  const lock = await get(MUTEX_KEY);
  if (lock && (now - lock.timestamp < 60000)) {
    return false;
  }
  await set(MUTEX_KEY, { task: taskType, timestamp: now });
  return true;
}

export async function releaseMutex() {
  await del(MUTEX_KEY);
}


// Enllaç orgànic per netejar el graf: [[00_index_escriptori]]
