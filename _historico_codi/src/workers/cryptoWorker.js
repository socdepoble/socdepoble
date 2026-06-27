const DB_NAME = 'BunkerCryptoDB';
const STORE_NAME = 'keys';
const KEY_PATH = 'masterKey_AESGCM';
const CHECKSUM_PATH = 'masterKey_Checksum';
// NOTA DE SEGURIDAD: Este string no necesita ser secreto.
// La seguridad viene de que AES-GCM con clave incorrecta falla la autenticación,
// no de que el atacante desconozca el plaintext esperado.
const INTEGRITY_PAYLOAD = "SOC_DE_POBLE_BUNKER_V12_INTEGRITY";
const DTN_STORE = 'dtn_mailbox';

// Internal function to open IndexedDB
async function getIDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 2);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
      if (!db.objectStoreNames.contains(DTN_STORE)) {
        const store = db.createObjectStore(DTN_STORE, { keyPath: 'packetId' });
        store.createIndex('expiresAt', 'expiresAt', { unique: false });
        store.createIndex('recipientId', 'recipientId', { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// === CLAUDE FASE 4: Enmascaramiento Anti Side-Channel por Paralelismo ===
async function secureCryptoOp(opPromiseFunc) {
  const minMs = 20;
  const maxMs = 80;
  const targetMs = minMs + Math.random() * (maxMs - minMs);
  
  // Ambos en paralelo: la operación no puede terminar antes del target
  const [result] = await Promise.all([
      opPromiseFunc(),
      new Promise(resolve => setTimeout(resolve, targetMs))
  ]);
  
  return result;
}

// === GROK FASE 3: Monitorización de Cuota Anti-DoS ===
async function checkQuota() {
  if (navigator.storage && navigator.storage.estimate) {
    const estimate = await navigator.storage.estimate();
    if (estimate.usage && estimate.quota) {
      const ratio = estimate.usage / estimate.quota;
      const overLimit = ratio > 0.80 || estimate.usage > 150 * 1024 * 1024;

      if (overLimit) {
        self.postMessage({ type: 'STORAGE_CRITICAL', ratio, usage: estimate.usage });
        // No lanzar excepción a menos que sea absolutamente crítico (>95%)
        if (ratio > 0.95) throw new Error("QUOTA_EXCEEDED_EMERGENCY");
      }
    }
  }
}

async function deleteKeyFromIDB() {
  const db = await getIDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(KEY_PATH);
    store.delete(CHECKSUM_PATH);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Store key + Checksum
async function storeKeyInIDB(key) {
  await checkQuota(); // Protect against OPFS/IDB flooding before storing the key

  // Cifrar el payload conocido para generar el Checksum (Tag de autenticidad integrado en AES-GCM)
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encodedPayload = new TextEncoder().encode(INTEGRITY_PAYLOAD);
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encodedPayload
  );
  
  const checksumBlob = new Uint8Array(iv.length + ciphertext.byteLength);
  checksumBlob.set(iv);
  checksumBlob.set(new Uint8Array(ciphertext), iv.length);

  const db = await getIDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(key, KEY_PATH);
    store.put(checksumBlob.buffer, CHECKSUM_PATH);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// === GROK FASE 3: Checksum y Versionado de IndexedDB (Anti-Envenenamiento) ===
// Retrieve key and validate its integrity against XSS poisoning
async function getKeyFromIDB() {
  const db = await getIDB();
  
  const { key, checksum } = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    
    // Obtenemos clave y checksum de la misma transacción sincrónica atómica
    const keyReq = store.get(KEY_PATH);
    const checksumReq = store.get(CHECKSUM_PATH);
    
    Promise.all([
      new Promise(r => { keyReq.onsuccess = e => r(e.target.result); }),
      new Promise(r => { checksumReq.onsuccess = e => r(e.target.result); })
    ]).then(([keyResult, checksumResult]) => {
      resolve({ key: keyResult, checksum: checksumResult });
    }).catch(reject);
    
    tx.onerror = () => reject(tx.error);
  });

  if (!key) return null;

  if (!checksum) {
    console.warn("[BUNKER] 🚨 INTEGRITY CHECK FAILED (NO CHECKSUM). Purging Bunker!");
    await deleteKeyFromIDB();
    return null;
  }

  // Verificar la Integridad descifrando el checksum con la clave extraída
  try {
    const data = new Uint8Array(checksum);
    const iv = data.slice(0, 12);
    const ciphertext = data.slice(12);
    
    const plaintextBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );
    
    const plaintext = new TextDecoder().decode(plaintextBuffer);
    if (plaintext !== INTEGRITY_PAYLOAD) {
      throw new Error("Mismatched Payload");
    }
  } catch (error) {
    console.error("[BUNKER] 🚨 POISONED_DB_CHECKSUM_FAILED. Clave manipulada. Purging Bunker!", error);
    await deleteKeyFromIDB();
    return null;
  }

  return key;
}

// Generate new key and store it
async function generateKey() {
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    false, // extractable: false -> Sandbox Bunker absoluto
    ['encrypt', 'decrypt']
  );
  await storeKeyInIDB(key);
  return true; // Return success, never the key parameter itself
}

// Encrypt payload (ArrayBuffer)
async function encryptData(plainBuffer) {
  const key = await getKeyFromIDB();
  if (!key) throw new Error("No master key found in Bunker.");
  
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    plainBuffer
  );
  
  // Combine IV and Ciphertext
  const encrypted = new Uint8Array(iv.length + ciphertext.byteLength);
  encrypted.set(iv);
  encrypted.set(new Uint8Array(ciphertext), iv.length);
  return encrypted.buffer; // Returning ArrayBuffer via structured clone
}

// Decrypt payload (ArrayBuffer)
async function decryptData(encryptedBuffer) {
  const key = await getKeyFromIDB();
  if (!key) throw new Error("No master key found in Bunker.");
  
  const data = new Uint8Array(encryptedBuffer);
  const iv = data.slice(0, 12);
  const ciphertext = data.slice(12);
  
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );
  
  return plaintext; // Return ArrayBuffer
}

// === CLAUDE FASE 7: Rotación de Clave Maestra ===
const KEY_ROTATION_INTERVAL_MS = 30 * 24 * 60 * 60 * 1000; // 30 días

async function checkKeyRotation() {
  try {
    const db = await getIDB();
    const meta = await new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get('keyMetadata');
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    });
    
    const now = Date.now();

    if (!meta || (now - meta.createdAt) > KEY_ROTATION_INTERVAL_MS) {
      // Generar y sobrescribir la clave (IDB)
      await generateKey();

      // Notificar al hilo principal para re-cifrar datos con clave nueva
      self.postMessage({ type: 'KEY_ROTATED', timestamp: now });
      
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put({ createdAt: now, version: (meta?.version || 0) + 1 }, 'keyMetadata');
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    }
  } catch (err) {
    console.error("[BUNKER] Error en rotación de claves:", err);
  }
}

// Ejecutar la comprobación silenciosa al inicio del Worker
checkKeyRotation();

class BoundedNonceSet {
  #set = new Set()
  #queue = []
  #maxSize

  constructor(maxSize = 10000) {
    this.#maxSize = maxSize
  }

  has(nonce) { return this.#set.has(nonce) }

  add(nonce) {
    if (this.#queue.length >= this.#maxSize) {
      const oldest = this.#queue.shift()
      this.#set.delete(oldest)
    }
    this.#set.add(nonce)
    this.#queue.push(nonce)
  }
}

const usedNonces = new BoundedNonceSet(10000);
const ALLOWED_OPS = ['GENERATE_KEY', 'HAS_KEY', 'ENCRYPT', 'DECRYPT'];

// Listen for commands
self.addEventListener('message', async (e) => {
  const { id, type, payload, nonce } = e.data;
  
  // Validació estricta (Claude Audit V12) - Rebutjar operacions no esperades
  if (!ALLOWED_OPS.includes(type)) {
    self.postMessage({ id, type: 'ERROR', error: 'OP_NOT_ALLOWED', nonce });
    return;
  }
  
  // Validació Anti-Replay: Verificar que el nonce és fresc
  if (!nonce || usedNonces.has(nonce)) {
    self.postMessage({ id, type: 'ERROR', error: 'REPLAY_DETECTED', nonce });
    return;
  }
  usedNonces.add(nonce);
  
  try {
    let result;
    let transfer = [];
    
    // Todos los comandos se encierran en un secureCryptoOp para inyectar latencia aleatoria y evitar Timing Attacks
    await secureCryptoOp(async () => {
      switch (type) {
        case 'GENERATE_KEY':
          result = await generateKey();
          break;
        case 'HAS_KEY': {
          const k = await getKeyFromIDB();
          result = !!k;
          break;
        }
        case 'ENCRYPT':
          result = await encryptData(payload); // payload is ArrayBuffer
          transfer.push(result);
          break;
        case 'DECRYPT':
          result = await decryptData(payload); // payload is ArrayBuffer
          transfer.push(result);
          break;
        default:
          throw new Error('Unknown command type: ' + type);
      }
    });
    
    // Respond back to caller
    self.postMessage({ id, type: 'SUCCESS', result }, transfer);
  } catch (error) {
    self.postMessage({ id, type: 'ERROR', error: error.message || error.toString() });
  }
});
