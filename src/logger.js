// logger.js
// Mòdul compacte i plug-and-play per activar mode verbose i enviar logs al servidor.
// Ús: import logger from './logger'; logger.init({ verbose: true, endpoint: '/api/logs' });
// Després: logger.captureConsole(); logger.captureErrors(); logger.captureSWMessages(registration);

const STORAGE_KEY = 'pwa_logger_buffer_v1';
function now() {
  return new Date().toISOString();
}
function readBuffer() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}
function writeBuffer(buf) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(buf));
  } catch (e) {/* no-op */}
}
const defaultConfig = {
  verbose: false,
  endpoint: null,
  // URL on which POST({ logs: [...] }) will be accepted
  flushInterval: 30_000,
  // ms
  maxBuffer: 500,
  sendWhenOnlineOnly: true
};
let cfg = {
  ...defaultConfig
};
let flushTimer = null;
let originalConsole = {};
let swMessageHandler = null;
let errorHandler = null;
let rejectionHandler = null;
function pushLog(entry) {
  const buf = readBuffer();
  buf.push(entry);
  // cap buffer
  if (buf.length > cfg.maxBuffer) buf.splice(0, buf.length - cfg.maxBuffer);
  writeBuffer(buf);
}
function makeEntry(level, payload = {}) {
  return {
    ts: now(),
    level,
    payload,
    ua: navigator.userAgent,
    href: typeof location !== 'undefined' && location.href ? location.href : null,
    online: typeof navigator !== 'undefined' ? navigator.onLine : null
  };
}
async function sendBuffered() {
  if (!cfg.endpoint) return false;
  if (cfg.sendWhenOnlineOnly && typeof navigator !== 'undefined' && !navigator.onLine) return false;
  const buf = readBuffer();
  if (!buf.length) return true;
  try {
    const res = await fetch(cfg.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        logs: buf
      })
    });
    if (res.ok) {
      // netegem buffer
      writeBuffer([]);
      return true;
    } else {
      // no acceptat, deixem per a reintentar
      return false;
    }
  } catch (e) {
    return false;
  }
}
function startAutoFlush() {
  stopAutoFlush();
  flushTimer = setInterval(() => {
    sendBuffered().catch(() => {});
  }, cfg.flushInterval);
}
function stopAutoFlush() {
  if (flushTimer) {
    clearInterval(flushTimer);
    flushTimer = null;
  }
}

// API públic
const logger = {
  init(options = {}) {
    cfg = {
      ...defaultConfig,
      ...options
    };
    // assegura valors
    if (!cfg.endpoint) cfg.endpoint = null;
    startAutoFlush();
    // log d'inici
    logger.info('logger.init', {
      cfg: {
        ...cfg,
        endpoint: cfg.endpoint ? '[REDACTED]' : null
      }
    });
    return cfg;
  },
  // Captura console.* i els emmagatzema. Manté el comportament original.
  captureConsole() {
    if (typeof console === 'undefined') return;
    ['log', 'info', 'warn', 'error', 'debug'].forEach(m => {
      if (!console[m]) return;
      originalConsole[m] = console[m].bind(console);
      console[m] = function (...args) {
        try {
          const level = m === 'warn' || m === 'error' ? m : 'info';
          const payload = {
            args
          };
          // si no verbose, només guardem warn/error
          if (cfg.verbose || level === 'warn' || level === 'error') {
            pushLog(makeEntry(level, payload));
          }
        } catch (e) {/* no-op */}
        originalConsole[m].apply(console, args);
      };
    });
  },
  // Restaura console original (opcional)
  restoreConsole() {
    Object.keys(originalConsole).forEach(k => {
      console[k] = originalConsole[k];
    });
  },
  // Captura errors globals i unhandledrejection
  captureErrors() {
    if (typeof window === 'undefined') return;
    errorHandler = ev => {
      try {
        const payload = {
          message: ev.message,
          filename: ev.filename,
          lineno: ev.lineno,
          colno: ev.colno,
          stack: ev.error && ev.error.stack
        };
        pushLog(makeEntry('error', {
          source: 'window.error',
          ...payload
        }));
      } catch (e) {}
    };
    rejectionHandler = ev => {
      try {
        pushLog(makeEntry('error', {
          source: 'unhandledrejection',
          reason: ev.reason
        }));
      } catch (e) {}
    };
    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', rejectionHandler);
  },
  stopCaptureErrors() {
    if (typeof window === 'undefined') return;
    if (errorHandler) window.removeEventListener('error', errorHandler);
    if (rejectionHandler) window.removeEventListener('unhandledrejection', rejectionHandler);
  },
  // Captura missatges del Service Worker (handshake, ready-to-activate, etc.)
  captureSWMessages(registration) {
    // registra listener global si no existeix
    if (typeof navigator === 'undefined' || !navigator.serviceWorker) return;
    // handler únic per evitar múltiples registres
    swMessageHandler = ev => {
      try {
        const data = ev.data || {};
        pushLog(makeEntry('info', {
          source: 'sw.message',
          data
        }));
      } catch (e) {}
    };
    navigator.serviceWorker.addEventListener('message', swMessageHandler);

    // si tenim registration, també podem escoltar events específics
    if (registration) {
      try {
        registration.addEventListener && registration.addEventListener('updatefound', () => {
          pushLog(makeEntry('info', {
            source: 'sw.updatefound'
          }));
        });
      } catch (e) {}
    }
  },
  stopCaptureSWMessages() {
    if (typeof navigator === 'undefined' || !navigator.serviceWorker) return;
    if (swMessageHandler) navigator.serviceWorker.removeEventListener('message', swMessageHandler);
    swMessageHandler = null;
  },
  // API de logging manual
  info(tag, obj = {}) {
    pushLog(makeEntry('info', {
      tag,
      ...obj
    }));
  },
  warn(tag, obj = {}) {
    pushLog(makeEntry('warn', {
      tag,
      ...obj
    }));
  },
  error(tag, obj = {}) {
    pushLog(makeEntry('error', {
      tag,
      ...obj
    }));
  },
  // Força enviament immediat (retorna Promise<boolean>)
  flushNow() {
    return sendBuffered();
  },
  // Neteja local del buffer
  purgeLocal() {
    writeBuffer([]);
  },
  // Obtenir buffer actual (per UI)
  getBuffer() {
    return readBuffer();
  },
  // Atura el logger (auto flush i listeners)
  shutdown() {
    stopAutoFlush();
    logger.restoreConsole();
    logger.stopCaptureErrors();
    logger.stopCaptureSWMessages();
  }
};
export default logger;