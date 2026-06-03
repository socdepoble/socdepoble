// health-sentinel.js — vigilància contínua de la PWA

const HEALTH_CHECK_INTERVAL = 30000; // 30 segons
const WORKER_HEARTBEAT_TIMEOUT = 5000; // 5s per a detectar worker encallat

// Estat global de salut
let healthState = {
  idbOk: true,
  swOk: true,
  workerOk: true,
  memoryPressure: false,
  lastError: null,
};

// 1. Comprovació d'IndexedDB
async function checkIndexedDB() {
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open('health-check-db', 1);
      req.onupgradeneeded = () => req.result.createObjectStore('test');
      req.onsuccess = () => {
        req.result.close();
        indexedDB.deleteDatabase('health-check-db');
        resolve(true);
      };
      req.onerror = () => resolve(false);
      setTimeout(() => resolve(false), 2000); // Circuit breaker
    } catch (e) {
      resolve(false);
    }
  });
}

// 2. Comprovació del Service Worker
async function checkServiceWorker() {
  if (!('serviceWorker' in navigator)) return true;
  const reg = await navigator.serviceWorker.getRegistration();
  return !!(reg && reg.active);
}

// 3. Heartbeat del db-worker
function startWorkerHeartbeat(worker) {
  let lastPong = Date.now();
  worker.onmessage = (e) => {
    if (e.data.type === 'pong') {
      lastPong = Date.now();
    }
  };
  setInterval(() => {
    worker.postMessage({ type: 'ping' });
    const now = Date.now();
    if (now - lastPong > WORKER_HEARTBEAT_TIMEOUT) {
      healthState.workerOk = false;
      console.warn('Health Sentinel: worker no respon. Intentant reinici...');
      worker.terminate();
      window.dispatchEvent(new CustomEvent('worker-failed'));
    } else {
      healthState.workerOk = true;
    }
  }, HEALTH_CHECK_INTERVAL);
}

// 4. Monitor de memòria
function checkMemory() {
  if (performance && performance.memory) {
    const { usedJSHeapSize, jsHeapSizeLimit } = performance.memory;
    const usageRatio = usedJSHeapSize / jsHeapSizeLimit;
    if (usageRatio > 0.85) {
      healthState.memoryPressure = true;
      console.warn('Health Sentinel: pressió de memòria alta (>85%). Considera netejar.');
    } else {
      healthState.memoryPressure = false;
    }
  }
}

// 5. Captura global d'errors no gestionats
window.addEventListener('error', (event) => {
  healthState.lastError = {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    timestamp: Date.now(),
  };
  emitSevereDiagnostic(event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  healthState.lastError = {
    message: event.reason?.message || String(event.reason),
    timestamp: Date.now(),
  };
  emitSevereDiagnostic(event.reason);
});

// AUTOREPARACIÓ: errors menors
async function attemptAutoRepair(issue) {
  if (issue === 'cache-corruption') {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      console.log('Health Sentinel: memòria cau corrupta esborrada. Refrescant...');
      if (!window.__SP_LOOP_BREAKER__?.isLooping()) {
        window.location.reload(true);
      } else {
        console.error('[HealthSentinel] Recàrrega bloquejada per bucle. Esperant intervenció.');
      }
    } catch (e) {}
  }
}

// DIAGNÒSTIC GREU
function emitSevereDiagnostic(error) {
  const diagnostic = {
    error: error?.stack || error?.message,
    userAgent: navigator.userAgent,
    healthState: { ...healthState },
    timestamp: new Date().toISOString(),
    buildId: window.__APP_HASH__ || 'desconegut',
  };
  showDiagnosticModal(diagnostic);
}

function showDiagnosticModal(diag) {
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#fff;border:2px solid red;padding:16px;max-width:360px;z-index:999999;font-family:system-ui;font-size:14px;';
  modal.innerHTML = `
    <h3 style="margin:0 0 8px">⚠️ Diagnòstic de Salut</h3>
    <p>Ha ocorregut un error greu. Codi de diagnòstic: <b>${diag.buildId}-${diag.timestamp}</b></p>
    <button id="health-copy">Copiar diagnòstic</button>
    <button id="health-dismiss">Tancar</button>
  `;
  document.body.appendChild(modal);
  document.getElementById('health-copy').onclick = () => {
    navigator.clipboard.writeText(JSON.stringify(diag, null, 2));
  };
  document.getElementById('health-dismiss').onclick = () => modal.remove();
}

// INICI DEL SENTINEL
export async function startHealthSentinel(workerInstance) {
  const idbOk = await checkIndexedDB();
  const swOk = await checkServiceWorker();
  if (!idbOk) healthState.idbOk = false;
  if (!swOk) healthState.swOk = false;

  if (workerInstance) {
    startWorkerHeartbeat(workerInstance);
  }

  setInterval(async () => {
    healthState.idbOk = await checkIndexedDB();
    healthState.swOk = await checkServiceWorker();
    checkMemory();

    if (!healthState.idbOk) console.warn('Health Sentinel: IndexedDB inaccessible.');
  }, HEALTH_CHECK_INTERVAL);

  window.addEventListener('cache-corruption', () => {
    attemptAutoRepair('cache-corruption');
  });

  return healthState;
}
