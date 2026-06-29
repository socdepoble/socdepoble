// Pseudocodi extret de l'auditoria de Kimi (Ronda 11)
// Conservat per a la implementació de l'arquitectura de Sóc de Poble

// 1. Perplexity - Protocol Quiesce (Punt 8)
const QUORUM_EPOCH = Symbol('quiesce-epoch');

export async function quiesceAndSwap(doc, opfsHandle) {
  const epoch = Date.now();
  doc[QUORUM_EPOCH] = epoch;
  
  const stateVector = Y.encodeStateAsUpdate(doc);
  const tmpHandle = await opfsHandle.getFileHandle(`mas_data_${epoch}.tmp`, { create: true });
  const writable = await tmpHandle.createWritable();
  await writable.write(stateVector);
  await writable.close();
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', stateVector);
  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0')).join('');
  
  const finalHandle = await opfsHandle.getFileHandle(`mas_data_${epoch}.yjs`, { create: true });
  const finalWritable = await finalHandle.createWritable();
  const tmpFile = await tmpHandle.getFile();
  await finalWritable.write(await tmpFile.arrayBuffer());
  await finalWritable.close();
  await opfsHandle.removeEntry(`mas_data_${epoch}.tmp`);
  
  Y.gc(doc);
  
  delete doc[QUORUM_EPOCH];
  
  return { epoch, hash: hashHex, size: stateVector.byteLength };
}

// 2. Vibe - Timeouts Anti-Deadlock + Degradació Elegant (Punt 11b)
const DEFAULT_TIMEOUT = 10000;

export function withTimeout(promise, ms = DEFAULT_TIMEOUT, label = 'operació') {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`[Timeout] ${label} excedí ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]);
}

export async function safeSOSPActivate(reason) {
  try {
    await withTimeout(SOSPLock.activate(reason), 10000, 'SOSP_LOCK activation');
  } catch (timeoutErr) {
    console.error('[SOSP] Deadlock detectat:', timeoutErr.message);
    enterReadOnlyMode();
    dispatchEvent(new CustomEvent('sosp-degraded', { 
      detail: { reason, fallback: 'read-only' } 
    }));
  }
}

function enterReadOnlyMode() {
  document.documentElement.classList.add('mas-cau-mode');
  document.querySelectorAll('[data-write]').forEach(el => {
    el.disabled = true;
    el.setAttribute('aria-label', 'Mode lectura: operació no disponible');
  });
}

// 3. Kimi - Mutex Global (Punt 15)
const MUTEX_KEY = 'sosp_mutex_state';

export const MutexGlobal = {
  BLOCS: {
    VEREMA: 'verema',
    AUTOPOIESI: 'autopoiesi',
    SINCRONITZACIO: 'sync',
    BACKUP: 'backup'
  },
  
  async acquire(blocType, timeoutMs = 30000) {
    const start = Date.now();
    while (true) {
      const current = await get(MUTEX_KEY);
      if (!current || current.state === 'free') {
        await set(MUTEX_KEY, { state: 'locked', owner: blocType, since: Date.now() });
        return true;
      }
      if (Date.now() - start > timeoutMs) {
        throw new Error(`[Mutex] Timeout esperant ${current.owner}`);
      }
      await new Promise(r => setTimeout(r, 100));
    }
  },
  
  async release(blocType) {
    const current = await get(MUTEX_KEY);
    if (current?.owner === blocType) {
      await set(MUTEX_KEY, { state: 'free', owner: null, since: null });
      return true;
    }
    return false;
  },
  
  async runExclusive(blocType, fn) {
    await this.acquire(blocType);
    try { return await fn(); } 
    finally { await this.release(blocType); }
  }
};


// Enllaç orgànic per netejar el graf: [[00_index_escriptori]]
