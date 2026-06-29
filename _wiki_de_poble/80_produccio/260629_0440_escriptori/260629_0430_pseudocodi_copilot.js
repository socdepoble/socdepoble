// Pseudocodi extret de l'auditoria de Copilot (Ronda 11)
// Conservat per a la implementació de l'arquitectura de Sóc de Poble

// 1. Protocol Quiesce Exportació Atòmica (Perplexity/Copilot)
async function quiesceAndExport(snapshotId) {
  await acquireQuiesceToken(snapshotId, {timeoutMs: 10000});
  try {
    setSyncState('QUIESCED');
    const tmpPath = `/opfs/snapshots/${snapshotId}.tmp`;
    await writeTempSnapshot(tmpPath, await serializeCRDT());
    
    const ok = await verifySnapshot(tmpPath);
    if (!ok) throw new Error('Snapshot verification failed');
    
    const finalPath = `/opfs/snapshots/${snapshotId}.yjs`;
    await atomicRename(tmpPath, finalPath);
    setSyncState('CONSOLIDATED');
  } finally {
    releaseQuiesceToken(snapshotId);
  }
}

// 2. Keepalive iOS (Vibe/Copilot)
const KEEPALIVE_INTERVAL_MS = 24 * 60 * 60 * 1000;
const KEEPALIVE_ENDPOINT = 'https://sync.socdepoble.org/keepalive';

async function sendKeepalive() {
  try {
    const payload = JSON.stringify({ deviceId, timestamp: Date.now() });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(KEEPALIVE_ENDPOINT, payload);
      return;
    }
    await fetch(KEEPALIVE_ENDPOINT, { method: 'POST', body: payload, keepalive: true });
  } catch (e) {
    recordTelemetry('keepalive.fail', { error: e.message });
  }
}

if ('serviceWorker' in navigator && 'periodicSync' in registration) {
  registration.periodicSync.register('sdp-keepalive', { minInterval: KEEPALIVE_INTERVAL_MS });
} else {
  window.addEventListener('focus', () => sendKeepalive());
  setInterval(sendKeepalive, KEEPALIVE_INTERVAL_MS);
}

// 3. Mutex Global de Workers (Kimi/Vibe/Copilot)
class GlobalMutex {
  constructor(name) {
    this.name = name;
    this.channel = new BroadcastChannel(`sdp-mutex-${name}`);
    this.leaseKey = `sdp-mutex-lease-${name}`;
    this.leaseTtlMs = 15000;
  }

  async tryAcquire(ownerId) {
    const now = Date.now();
    const lease = await idbGet(this.leaseKey);
    if (!lease || lease.expiresAt < now) {
      const newLease = { owner: ownerId, expiresAt: now + this.leaseTtlMs };
      await idbPut(this.leaseKey, newLease);
      this.channel.postMessage({ type: 'lease-acquired', owner: ownerId });
      return true;
    }
    return false;
  }

  async release(ownerId) {
    const lease = await idbGet(this.leaseKey);
    if (lease && lease.owner === ownerId) {
      await idbDelete(this.leaseKey);
      this.channel.postMessage({ type: 'lease-released', owner: ownerId });
    }
  }
}

// 4. SOSP_LOCK Timeout wrapper
function withTimeout(promise, ms, onTimeout) {
  const controller = new AbortController();
  const timeout = new Promise((_, reject) => {
    const id = setTimeout(() => {
      controller.abort();
      if (onTimeout) onTimeout();
      reject(new Error('SOSP_LOCK timeout'));
    }, ms);
    promise.finally(() => clearTimeout(id));
  });
  return Promise.race([promise, timeout]);
}


// Enllaç orgànic per netejar el graf: [[00_index_escriptori]]
