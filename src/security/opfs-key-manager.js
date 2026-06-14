// src/security/opfs-key-manager.js
// OPFS + IndexedDB fallback key manager.
// Exports: initKeyManager, createAndStoreWrappingKey, wrapAndStoreKey, unwrapKeyFromStore, getCryptoKeyForWorker
// Usage: await initKeyManager(); await createAndStoreWrappingKey('master-key', passphrase);
// Then wrap app AES key or retrieve and unwrap when needed.

const KEY_DB = 'rhizome-keys';
const KEY_STORE = 'keys';
const OPFS_FILENAME_PREFIX = 'rhz-key-';
async function hasOPFS() {
  return !!(navigator.storage && navigator.storage.getDirectory);
}
async function openKeyDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(KEY_DB, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(KEY_STORE)) db.createObjectStore(KEY_STORE, {
        keyPath: 'label'
      });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function writeToOPFS(filename, arrayBuffer) {
  const root = await navigator.storage.getDirectory();
  const fh = await root.getFileHandle(filename, {
    create: true
  });
  const writable = await fh.createWritable();
  await writable.write(arrayBuffer);
  await writable.close();
  return true;
}
async function readFromOPFS(filename) {
  const root = await navigator.storage.getDirectory();
  const fh = await root.getFileHandle(filename);
  const file = await fh.getFile();
  return await file.arrayBuffer();
}
async function writeToIDB(label, arrayBuffer) {
  const db = await openKeyDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(KEY_STORE, 'readwrite');
    const store = tx.objectStore(KEY_STORE);
    const put = store.put({
      label,
      blob: arrayBuffer,
      ts: Date.now()
    });
    put.onsuccess = () => {
      db.close();
      resolve(true);
    };
    put.onerror = e => {
      db.close();
      reject(e);
    };
  });
}
async function readFromIDB(label) {
  const db = await openKeyDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(KEY_STORE, 'readonly');
    const store = tx.objectStore(KEY_STORE);
    const get = store.get(label);
    get.onsuccess = () => {
      db.close();
      resolve(get.result ? get.result.blob : null);
    };
    get.onerror = e => {
      db.close();
      reject(e);
    };
  });
}

// PBKDF2 derive wrap key
async function deriveWrapKey(passphrase, saltBytes, iterations = 200000) {
  const enc = new TextEncoder();
  const base = await crypto.subtle.importKey('raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({
    name: 'PBKDF2',
    salt: saltBytes,
    iterations,
    hash: 'SHA-256'
  }, base, {
    name: 'AES-GCM',
    length: 256
  }, true, ['encrypt', 'decrypt']);
}

// create AES-GCM key to use for data (e.g., CRDT blobs)
export async function createDataKey() {
  return crypto.subtle.generateKey({
    name: 'AES-GCM',
    length: 256
  }, true, ['encrypt', 'decrypt']);
}

// export raw key bytes
async function exportRawKey(key) {
  return new Uint8Array(await crypto.subtle.exportKey('raw', key));
}

// import raw key bytes
async function importRawKey(raw) {
  return crypto.subtle.importKey('raw', raw, 'AES-GCM', true, ['encrypt', 'decrypt']);
}

// create and store a wrapping key derived from passphrase and store salt in metadata
export async function createAndStoreWrappingKey(label, passphrase) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const wrapKey = await deriveWrapKey(passphrase, salt);
  // export wrapKey raw for storage? we keep only salt; wrapKey is derived on demand
  const meta = {
    salt: Array.from(salt),
    iterations: 200000
  };
  // store meta in OPFS or IDB as JSON
  const payload = new TextEncoder().encode(JSON.stringify(meta));
  const filename = OPFS_FILENAME_PREFIX + label + '.meta';
  if (await hasOPFS()) {
    await writeToOPFS(filename, payload);
  } else {
    await writeToIDB(label + '.meta', payload.buffer);
  }
  return meta;
}

// wrap a data key and store wrapped blob + meta
export async function wrapAndStoreKey(label, dataCryptoKey, passphrase) {
  const saltMeta = await getMeta(label);
  const salt = saltMeta ? new Uint8Array(saltMeta.salt) : crypto.getRandomValues(new Uint8Array(16));
  const wrapKey = await deriveWrapKey(passphrase, salt);
  const raw = await exportRawKey(dataCryptoKey);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt({
    name: 'AES-GCM',
    iv
  }, wrapKey, raw);
  const wrapped = new Uint8Array(iv.byteLength + cipher.byteLength);
  wrapped.set(iv, 0);
  wrapped.set(new Uint8Array(cipher), iv.byteLength);
  const meta = {
    salt: Array.from(salt),
    ts: Date.now()
  };
  const packageBuf = JSON.stringify({
    meta
  }) + '::' + Array.from(wrapped).join(',');
  const filename = OPFS_FILENAME_PREFIX + label + '.wrapped';
  if (await hasOPFS()) {
    await writeToOPFS(filename, new TextEncoder().encode(packageBuf));
  } else {
    await writeToIDB(label + '.wrapped', new TextEncoder().encode(packageBuf).buffer);
  }
  return true;
}
async function getMeta(label) {
  const filename = OPFS_FILENAME_PREFIX + label + '.meta';
  try {
    if (await hasOPFS()) {
      const buf = await readFromOPFS(filename);
      return JSON.parse(new TextDecoder().decode(buf));
    } else {
      const b = await readFromIDB(label + '.meta');
      if (!b) return null;
      return JSON.parse(new TextDecoder().decode(b));
    }
  } catch (e) {
    return null;
  }
}
async function readWrapped(label) {
  const filename = OPFS_FILENAME_PREFIX + label + '.wrapped';
  try {
    if (await hasOPFS()) {
      const buf = await readFromOPFS(filename);
      return new TextDecoder().decode(buf);
    } else {
      const b = await readFromIDB(label + '.wrapped');
      if (!b) return null;
      return new TextDecoder().decode(b);
    }
  } catch (e) {
    return null;
  }
}

// unwrap stored key using passphrase
export async function unwrapKeyFromStore(label, passphrase) {
  const raw = await readWrapped(label);
  if (!raw) throw new Error('No wrapped key found');
  const [metaJson, wrappedCsv] = raw.split('::');
  const meta = JSON.parse(metaJson);
  const wrappedArr = wrappedCsv.split(',').map(n => parseInt(n, 10));
  const wrappedU8 = new Uint8Array(wrappedArr);
  const salt = new Uint8Array(meta.meta.salt || meta.salt || []);
  const wrapKey = await deriveWrapKey(passphrase, salt);
  const iv = wrappedU8.slice(0, 12);
  const cipher = wrappedU8.slice(12);
  const rawKey = await crypto.subtle.decrypt({
    name: 'AES-GCM',
    iv
  }, wrapKey, cipher);
  return importRawKey(new Uint8Array(rawKey));
}

// convenience: get CryptoKey for runtime (tries OPFS then KMS fetch fallback)
export async function getCryptoKeyForRuntime(label, {
  passphrase,
  kmsFetchFn
} = {}) {
  try {
    // try unwrap from OPFS/IDB
    if (passphrase) {
      const key = await unwrapKeyFromStore(label, passphrase);
      return key;
    }
  } catch (e) {
    console.warn('unwrapKeyFromStore failed', e);
  }
  // fallback: fetch wrapped key from KMS and unwrap locally
  if (typeof kmsFetchFn === 'function') {
    const wrappedPackage = await kmsFetchFn(label);
    if (!wrappedPackage) throw new Error('KMS returned no key');
    // wrappedPackage expected: { meta: { salt: [...], ts }, wrapped: [..] }
    const salt = new Uint8Array(wrappedPackage.meta.salt);
    const wrappedU8 = new Uint8Array(wrappedPackage.wrapped);
    const wrapKey = await deriveWrapKey(passphrase, salt);
    const iv = wrappedU8.slice(0, 12);
    const cipher = wrappedU8.slice(12);
    const rawKey = await crypto.subtle.decrypt({
      name: 'AES-GCM',
      iv
    }, wrapKey, cipher);
    return importRawKey(new Uint8Array(rawKey));
  }
  throw new Error('No method to obtain crypto key');
}

// init placeholder (no heavy work)
export async function initKeyManager() {
  return {
    hasOPFS: await hasOPFS()
  };
}