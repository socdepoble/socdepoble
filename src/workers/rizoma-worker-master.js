/**
 * rizoma-worker-master.js
 *
 * Worker mestre que integra:
 *  - inicialització Yjs + fallback persistence a IndexedDB
 *  - persistència chunked i xifrat AES-GCM
 *  - garbage collection (mantenir N snapshots)
 *  - re-xifrat (rotació de clau) en background amb swap segur
 *  - tests d'estrès i utilitats de control
 *  - connexions Mesh WebRTC i Bluetooth
 *
 * Comentaris i missatges en valencià estricte.
 */

// IMPORTANT: Aquest fitxer assumeix llibreries globals si s'importa cru, però es compila amb esbuild
// importScripts('/libs/yjs.js', '/libs/y-indexeddb.js');

const LOG_PREFIX = '[rizoma-worker-master]';

// Estat intern
let ydoc = null;
let persistence = null;
let dbNameGlobal = 'sdp-db';
let storeNameGlobal = 'y-store';
let batchQueue = [];
let batchTimer = null;
const BATCH_MS = 120;
const BATCH_MAX = 200;

// Variables criptogràfiques
let aesKey = null; // Clau actual CryptoKey
let pendingAesKey = null; // Nova clau durant rotació
let activeKeyId = null;

// ==========================================
// 1. UTILITATS CRIPTOGRÀFIQUES
// ==========================================
const hexToBuf = hex => new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
const bufToHex = buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
async function encryptChunk(data, key) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({
    name: "AES-GCM",
    iv
  }, key, data);
  const result = new Uint8Array(iv.length + encrypted.byteLength);
  result.set(iv, 0);
  result.set(new Uint8Array(encrypted), iv.length);
  return result;
}
async function decryptChunk(encryptedData, key) {
  const iv = encryptedData.slice(0, 12);
  const data = encryptedData.slice(12);
  return await crypto.subtle.decrypt({
    name: "AES-GCM",
    iv
  }, key, data);
}

// ==========================================
// 2. FALLBACK MANUAL A INDEXEDDB (Chunked)
// ==========================================
const FALLBACK_DB_NAME = 'sdp-y-fallback';
const CHUNK_SIZE = 256 * 1024; // 256 KB per chunk
const GC_KEEP_LAST = 3;
function openFallbackDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(FALLBACK_DB_NAME, 1);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('y-snapshots')) {
        db.createObjectStore('y-snapshots');
      }
      if (!db.objectStoreNames.contains('y-meta')) {
        db.createObjectStore('y-meta');
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// ... La resta de les implementacions detallades per Copilot i Grok estaran ací.
// Això estableix l'esquelet per a la integració real segons l'auditoria.