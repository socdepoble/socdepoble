// src/logger-ultimate.js
// Logger "Ultimate" per Socdepoble
// - Xifra el buffer local amb una clau derivada (PBKDF2 + AES-GCM)
// - Envia logs en batches i aplica compressió (CompressionStream gzip) si està disponible
// - API plug-and-play: init({ passphrase, endpoint, ... }), captureConsole(), captureErrors(), captureSWMessages(registration), flushNow(), purgeLocal(), getBuffer()
// - Escric en valencià i amb cura per a dispositius antics (iPad A10 / WKWebView)
// Nota: cal cridar logger.init(...) abans d'usar altres mètodes que depenguen de la clau.

const STORAGE_KEY = 'pwa_logger_ultimate_v1';
const DEFAULTS = {
  verbose: false,
  endpoint: null,
  flushInterval: 30_000,
  maxBuffer: 1000,
  batchSize: 100,
  pbkdf2: {
    iterations: 150_000,
    hash: 'SHA-256'
  },
  aes: {
    name: 'AES-GCM',
    length: 256
  },
  saltBytes: 16,
  ivBytes: 12,
  sendWhenOnlineOnly: true
};
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
function toBase64(buf) {
  let binary = '';
  const bytes = new Uint8Array(buf);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
  }
  return btoa(binary);
}
function fromBase64(b64) {
  const binary = atob(b64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}
function randBytes(n) {
  const b = new Uint8Array(n);
  crypto.getRandomValues(b);
  return b.buffer;
}

// Deriva una clau CryptoKey a partir d'una passphrase i salt
async function deriveKeyFromPassphrase(passphrase, salt, iterations, hash) {
  const baseKey = await crypto.subtle.importKey('raw', textEncoder.encode(passphrase), {
    name: 'PBKDF2'
  }, false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey({
    name: 'PBKDF2',
    salt,
    iterations,
    hash
  }, baseKey, {
    name: DEFAULTS.aes.name,
    length: DEFAULTS.aes.length
  }, false, ['encrypt', 'decrypt']);
  return key;
}

// Xifra un Uint8Array amb AES-GCM i retorna objecte amb iv i ciphertext (ArrayBuffer)
async function aesGcmEncrypt(key, plaintextUint8) {
  const iv = randBytes(DEFAULTS.ivBytes);
  const ct = await crypto.subtle.encrypt({
    name: DEFAULTS.aes.name,
    iv: new Uint8Array(iv)
  }, key, plaintextUint8);
  return {
    iv: iv,
    ciphertext: ct
  };
}

// Desxifra AES-GCM
async function aesGcmDecrypt(key, ivBuf, ciphertextBuf) {
  const plain = await crypto.subtle.decrypt({
    name: DEFAULTS.aes.name,
    iv: new Uint8Array(ivBuf)
  }, key, ciphertextBuf);
  return new Uint8Array(plain);
}

// Compressió: si CompressionStream està disponible, retorna Uint8Array gzip; si no, retorna UTF-8 bytes (sense compressió)
async function compressMaybeUint8(dataUint8) {
  if (typeof CompressionStream === 'function') {
    try {
      const cs = new CompressionStream('gzip');
      const inStream = new Blob([dataUint8]).stream();
      const compressedStream = inStream.pipeThrough(cs);
      const reader = compressedStream.getReader();
      const chunks = [];
      let total = 0;
      while (true) {
        const _readRes = await reader.read();
        const done = _readRes.done;
        const value = _readRes.value;
        if (done) break;
        chunks.push(value);
        total += value.length;
      }
      const out = new Uint8Array(total);
      let offset = 0;
      for (const c of chunks) {
        out.set(c, offset);
        offset += c.length;
      }
      return {
        bytes: out,
        compressed: true
      };
    } catch (e) {
      // fallback to no compression
    }
  }
  // fallback: no compress
  return {
    bytes: new Uint8Array(dataUint8),
    compressed: false
  };
}

// Decompressió: si CompressionStream i gunzip suportat, intentar descomprimir; si no, retornar original
async function decompressMaybeUint8(bytes, wasCompressed) {
  if (!wasCompressed) return bytes;
  if (typeof DecompressionStream === 'function') {
    try {
      const ds = new DecompressionStream('gzip');
      const inStream = new Blob([bytes]).stream();
      const decompressedStream = inStream.pipeThrough(ds);
      const reader = decompressedStream.getReader();
      const chunks = [];
      let total = 0;
      while (true) {
        const _readRes = await reader.read();
        const done = _readRes.done;
        const value = _readRes.value;
        if (done) break;
        chunks.push(value);
        total += value.length;
      }
      const out = new Uint8Array(total);
      let offset = 0;
      for (const c of chunks) {
        out.set(c, offset);
        offset += c.length;
      }
      return out;
    } catch (e) {
      // fallback
    }
  }
  // fallback: assume bytes are raw UTF-8
  return bytes;
}

// Helpers per emmagatzemar objecte xifrat a localStorage
function storeEncryptedObject(obj) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch (e) {}
}
function readEncryptedObject() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

// Convertir array d'entrades a Uint8Array (JSON)
function entriesToUint8(entries) {
  const s = JSON.stringify(entries);
  return textEncoder.encode(s);
}
function uint8ToEntries(u8) {
  const s = textDecoder.decode(u8);
  return JSON.parse(s);
}

// Logger intern
let cfg = {
  ...DEFAULTS
};
let cryptoKey = null; // CryptoKey derivada
let initialized = false;
let flushTimer = null;
let originalConsole = {};
let swMessageHandler = null;
let errorHandler = null;
let rejectionHandler = null;

// Llegeix i desxifra buffer local; si no existeix retorna []
async function readBufferDecrypted() {
  const stored = readEncryptedObject();
  if (!stored) return [];
  try {
    const salt = fromBase64(stored.salt);
    const iv = fromBase64(stored.iv);
    const ciphertext = fromBase64(stored.data);
    // si no tenim la clau, no podem desxifrar
    if (!cryptoKey) throw new Error('No crypto key');
    const plainUint8 = await aesGcmDecrypt(cryptoKey, salt ? iv : iv, ciphertext);
    // plainUint8 pot ser gzip o no; el flag stored.compressed indica si estava comprimit abans d'encriptar
    const decompressed = await decompressMaybeUint8(plainUint8, stored.compressed);
    const entries = uint8ToEntries(decompressed);
    if (!Array.isArray(entries)) return [];
    return entries;
  } catch (e) {
    // si no podem desxifrar, purguem per evitar bloquejos
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {/* no-op */}
    return [];
  }
}

// Xifra i escriu buffer
async function writeBufferEncrypted(entries) {
  if (!cryptoKey) throw new Error('No crypto key');
  const plainUint8 = entriesToUint8(entries);
  // compress opcional abans d'encriptar per estalviar espai local
  const _compRes = await compressMaybeUint8(plainUint8);
  const compressedBytes = _compRes.bytes;
  const compressed = _compRes.compressed;
  const _encRes = await aesGcmEncrypt(cryptoKey, compressedBytes.buffer);
  const iv = _encRes.iv;
  const ciphertext = _encRes.ciphertext;
  const payload = {
    salt: toBase64(cryptoKey.__saltBuf || new Uint8Array(0)),
    // __saltBuf assignat a la clau en init
    iv: toBase64(iv),
    data: toBase64(ciphertext),
    compressed: compressed
  };
  storeEncryptedObject(payload);
}

// Afegir una entrada al buffer (llegeix, afegeix, escriu)
async function pushLogEntry(entry) {
  if (!initialized) return;
  try {
    const buf = await readBufferDecrypted();
    buf.push(entry);
    // mantenir mida
    if (buf.length > cfg.maxBuffer) buf.splice(0, buf.length - cfg.maxBuffer);
    await writeBufferEncrypted(buf);
  } catch (e) {}
}

// Compressar i enviar un batch (retorna true si enviat)
async function sendBatchToServer(batch) {
  if (!cfg.endpoint) return false;
  if (cfg.sendWhenOnlineOnly && typeof navigator !== 'undefined' && !navigator.onLine) return false;
  try {
    const payloadJson = JSON.stringify({
      logs: batch
    });
    const payloadUint8 = textEncoder.encode(payloadJson);
    const _compRes = await compressMaybeUint8(payloadUint8);
    const compressedBytes = _compRes.bytes;
    const compressed = _compRes.compressed;
    const headers = {
      'Content-Type': 'application/json'
    };
    if (compressed) headers['Content-Encoding'] = 'gzip';
    const res = await fetch(cfg.endpoint, {
      method: 'POST',
      headers,
      body: compressed ? compressedBytes : payloadJson
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

// Auto-flush: envia batches fins esgotar buffer o fallar
async function flushBufferedBatches() {
  if (!initialized) return false;
  try {
    const buf = await readBufferDecrypted();
    if (!buf.length) return true;
    let idx = 0;
    while (idx < buf.length) {
      const batch = buf.slice(idx, idx + cfg.batchSize);
      const ok = await sendBatchToServer(batch);
      if (!ok) return false; // si falla, aturem i reintentar després
      idx += cfg.batchSize;
    }
    // si tot ok, purguem local
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {/* no-op */}
    return true;
  } catch (e) {
    return false;
  }
}

// API públic
const logger = {
  // options: { passphrase, endpoint, verbose, flushInterval, maxBuffer, batchSize }
  async init(options = {}) {
    cfg = {
      ...cfg,
      ...options
    };
    if (!cfg.passphrase) {
      throw new Error('logger.init requereix passphrase per a xifrar el buffer local');
    }
    // Generem salt i deriveKey; si ja hi ha objecte emmagatzemat, reutilitzem salt existent per poder desxifrar
    const existing = readEncryptedObject();
    let saltBuf;
    if (existing && existing.salt) {
      saltBuf = fromBase64(existing.salt);
    } else {
      saltBuf = randBytes(cfg.saltBytes);
    }
    // Derivem clau
    cryptoKey = await deriveKeyFromPassphrase(cfg.passphrase, saltBuf, cfg.pbkdf2.iterations, cfg.pbkdf2.hash);
    // Guardem salt en la clau per escriure després (no està exposat fora)
    cryptoKey.__saltBuf = saltBuf;
    initialized = true;

    // Auto-flush timer
    if (flushTimer) clearInterval(flushTimer);
    flushTimer = setInterval(() => {
      flushBufferedBatches().catch(() => {});
    }, cfg.flushInterval);

    // Log d'inici
    await pushLogEntry({
      ts: new Date().toISOString(),
      level: 'info',
      tag: 'logger.init',
      cfg: {
        verbose: cfg.verbose,
        endpoint: cfg.endpoint ? '[REDACTED]' : null
      }
    });
    return true;
  },
  // Captura console.* i emmagatzema entrades; manté comportament original
  captureConsole() {
    if (typeof console === 'undefined') return;
    ['log', 'info', 'warn', 'error', 'debug'].forEach(m => {
      if (!console[m]) return;
      originalConsole[m] = console[m].bind(console);
      console[m] = function (...args) {
        try {
          const level = m === 'warn' || m === 'error' ? m : 'info';
          if (cfg.verbose || level === 'warn' || level === 'error') {
            pushLogEntry({
              ts: new Date().toISOString(),
              level,
              tag: 'console.' + m,
              args
            });
          }
        } catch (e) {/* no-op */}
        originalConsole[m].apply(console, args);
      };
    });
  },
  restoreConsole() {
    Object.keys(originalConsole).forEach(k => {
      console[k] = originalConsole[k];
    });
  },
  // Captura errors globals
  captureErrors() {
    if (typeof window === 'undefined') return;
    errorHandler = ev => {
      try {
        pushLogEntry({
          ts: new Date().toISOString(),
          level: 'error',
          tag: 'window.error',
          message: ev.message,
          filename: ev.filename,
          lineno: ev.lineno,
          colno: ev.colno,
          stack: ev.error && ev.error.stack
        });
      } catch (e) {/* no-op */}
    };
    rejectionHandler = ev => {
      try {
        pushLogEntry({
          ts: new Date().toISOString(),
          level: 'error',
          tag: 'unhandledrejection',
          reason: ev.reason
        });
      } catch (e) {/* no-op */}
    };
    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', rejectionHandler);
  },
  stopCaptureErrors() {
    if (typeof window === 'undefined') return;
    if (errorHandler) window.removeEventListener('error', errorHandler);
    if (rejectionHandler) window.removeEventListener('unhandledrejection', rejectionHandler);
  },
  // Captura missatges del Service Worker
  captureSWMessages(registration) {
    if (typeof navigator === 'undefined' || !navigator.serviceWorker) return;
    swMessageHandler = ev => {
      try {
        pushLogEntry({
          ts: new Date().toISOString(),
          level: 'info',
          tag: 'sw.message',
          data: ev.data
        });
      } catch (e) {/* no-op */}
    };
    navigator.serviceWorker.addEventListener('message', swMessageHandler);
    if (registration && registration.addEventListener) {
      try {
        registration.addEventListener('updatefound', () => {
          pushLogEntry({
            ts: new Date().toISOString(),
            level: 'info',
            tag: 'sw.updatefound'
          });
        });
      } catch (e) {/* no-op */}
    }
  },
  stopCaptureSWMessages() {
    if (typeof navigator === 'undefined' || !navigator.serviceWorker) return;
    if (swMessageHandler) navigator.serviceWorker.removeEventListener('message', swMessageHandler);
    swMessageHandler = null;
  },
  // Envia ara mateix (intenta enviar tots els batches)
  async flushNow() {
    if (!initialized) throw new Error('logger no inicialitzat');
    return await flushBufferedBatches();
  },
  // Purga local (esborra localStorage)
  purgeLocal() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {/* no-op */}
  },
  // Obté buffer actual (desxifrat) per a UI; retorna array d'entrades
  async getBuffer() {
    if (!initialized) throw new Error('logger no inicialitzat');
    return await readBufferDecrypted();
  },
  // API de logging manual
  info(tag, obj = {}) {
    pushLogEntry({
      ts: new Date().toISOString(),
      level: 'info',
      tag,
      ...obj
    });
  },
  warn(tag, obj = {}) {
    pushLogEntry({
      ts: new Date().toISOString(),
      level: 'warn',
      tag,
      ...obj
    });
  },
  error(tag, obj = {}) {
    pushLogEntry({
      ts: new Date().toISOString(),
      level: 'error',
      tag,
      ...obj
    });
  },
  // Atura el logger i neteja listeners
  shutdown() {
    if (flushTimer) {
      clearInterval(flushTimer);
      flushTimer = null;
    }
    logger.restoreConsole();
    logger.stopCaptureErrors();
    logger.stopCaptureSWMessages();
    cryptoKey = null;
    initialized = false;
  }
};
export default logger;