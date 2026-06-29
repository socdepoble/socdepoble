// Pseudocodi extret de l'auditoria de Perplexity (Ronda 11)
// Conservat per a la implementació de l'arquitectura de Sóc de Poble

// 1. Quiesce + swap atòmic
let quiescing = false;
let epoch = 0;

async function quiesceSwap(exportFn, commitFn, rollbackFn) {
  if (quiescing) return false;
  quiescing = true;
  const myEpoch = ++epoch;

  try {
    await freezeIncomingDeltas(myEpoch);
    const tmp = await exportFn();          
    await commitFn(tmp, myEpoch);          
    await thawIncomingDeltas(myEpoch);
    return true;
  } catch (err) {
    await rollbackFn?.(err, myEpoch);
    await thawIncomingDeltas(myEpoch);
    throw err;
  } finally {
    quiescing = false;
  }
}

// 2. Keepalive iOS
let keepaliveTimer = null;

function startIOSKeepalive(sendPing) {
  stopIOSKeepalive();
  keepaliveTimer = setInterval(async () => {
    try {
      if (document.visibilityState === 'visible') {
        await sendPing();
      }
    } catch {}
  }, 25 * 24 * 60 * 60 * 1000); // abans dels 30 dies
}

function stopIOSKeepalive() {
  if (keepaliveTimer) clearInterval(keepaliveTimer);
  keepaliveTimer = null;
}

// 3. Mutex global de workers
class Mutex {
  constructor() { this.busy = false; this.queue = []; }
  async lock() {
    if (!this.busy) return (this.busy = true, this.unlock.bind(this));
    return new Promise(resolve => this.queue.push(resolve));
  }
  unlock() {
    const next = this.queue.shift();
    if (next) next(this.unlock.bind(this));
    else this.busy = false;
  }
}

const workersMutex = new Mutex();

async function runExclusive(task) {
  const unlock = await workersMutex.lock();
  try { return await task(); }
  finally { unlock(); }
}

// 4. Timeout anti-deadlock
async function withTimeout(promise, ms, label = 'operation') {
  let t;
  const timeout = new Promise((_, reject) => {
    t = setTimeout(() => reject(new Error(`${label} timeout`)), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(t);
  }
}


// Enllaç orgànic per netejar el graf: [[00_index_escriptori]]
