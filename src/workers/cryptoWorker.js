const DB_NAME = 'BunkerCryptoDB';
const STORE_NAME = 'keys';
const KEY_PATH = 'masterKey_AESGCM';

// Internal function to open IndexedDB
async function getIDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Store key
async function storeKeyInIDB(key) {
  const db = await getIDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(key, KEY_PATH);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Retrieve key
async function getKeyFromIDB() {
  const db = await getIDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(KEY_PATH);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

// Generate new key and store it
async function generateKey() {
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    false, // extractable: false -> Sandbox Bunker
    ['encrypt', 'decrypt']
  );
  await storeKeyInIDB(key);
  return true; // Return success, never the key
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

const usedNonces = new Set();
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
    
    // Respond back to caller
    self.postMessage({ id, type: 'SUCCESS', result }, transfer);
  } catch (error) {
    self.postMessage({ id, type: 'ERROR', error: error.message || error.toString() });
  }
});
