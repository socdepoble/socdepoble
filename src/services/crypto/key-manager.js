// src/services/crypto/key-manager.js
// Derivació PBKDF2 per wrap/unwrap de CryptoKey, export/import i OPFS write/read fallback to IndexedDB.
// Usage: call createAndStoreKey(passphrase, label) to create a new AES-GCM key and store wrapped key.

async function deriveWrapKey(passphrase, salt, iterations = 200_000) {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey('raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({
    name: 'PBKDF2',
    salt: salt,
    iterations,
    hash: 'SHA-256'
  }, baseKey, {
    name: 'AES-GCM',
    length: 256
  }, true, ['encrypt', 'decrypt']);
}
export async function createCryptoKey() {
  return crypto.subtle.generateKey({
    name: 'AES-GCM',
    length: 256
  }, true, ['encrypt', 'decrypt']);
}
export async function exportRawKey(cryptoKey) {
  return new Uint8Array(await crypto.subtle.exportKey('raw', cryptoKey));
}
export async function wrapKeyForBackup(cryptoKey, passphrase) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const wrapKey = await deriveWrapKey(passphrase, salt);
  const raw = await exportRawKey(cryptoKey);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const wrapped = await crypto.subtle.encrypt({
    name: 'AES-GCM',
    iv
  }, wrapKey, raw);

  // package: salt (16) + iv (12) + wrapped
  const wrappedArr = new Uint8Array(16 + 12 + wrapped.byteLength);
  wrappedArr.set(salt, 0);
  wrappedArr.set(iv, 16);
  wrappedArr.set(new Uint8Array(wrapped), 28);
  return wrappedArr.buffer; // ArrayBuffer to store or download
}
export async function unwrapKeyFromBackup(wrappedBuffer, passphrase) {
  const wrappedArr = new Uint8Array(wrappedBuffer);
  const salt = wrappedArr.slice(0, 16);
  const iv = wrappedArr.slice(16, 28);
  const cipher = wrappedArr.slice(28);
  const wrapKey = await deriveWrapKey(passphrase, salt);
  const raw = await crypto.subtle.decrypt({
    name: 'AES-GCM',
    iv
  }, wrapKey, cipher);
  return crypto.subtle.importKey('raw', raw, 'AES-GCM', true, ['encrypt', 'decrypt']);
}

// OPFS write/read (if available) else fallback to IndexedDB
export async function writeBackupToOPFS(filename, arrayBuffer) {
  if (navigator.storage && navigator.storage.getDirectory) {
    const root = await navigator.storage.getDirectory();
    const fh = await root.getFileHandle(filename, {
      create: true
    });
    const writable = await fh.createWritable();
    await writable.write(arrayBuffer);
    await writable.close();
    return true;
  } else {
    // fallback to IndexedDB
    const dbReq = indexedDB.open('rhizome-keys', 1);
    dbReq.onupgradeneeded = () => {
      const db = dbReq.result;
      if (!db.objectStoreNames.contains('keys')) db.createObjectStore('keys', {
        keyPath: 'label'
      });
    };
    await new Promise(r => dbReq.onsuccess = r);
    const db = dbReq.result;
    return new Promise((resolve, reject) => {
      const tx = db.transaction('keys', 'readwrite');
      const store = tx.objectStore('keys');
      const put = store.put({
        label: filename,
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
}
export async function readBackupFromOPFS(filename) {
  if (navigator.storage && navigator.storage.getDirectory) {
    const root = await navigator.storage.getDirectory();
    try {
      const fh = await root.getFileHandle(filename);
      const file = await fh.getFile();
      return await file.arrayBuffer();
    } catch (e) {
      return null;
    }
  } else {
    const dbReq = indexedDB.open('rhizome-keys', 1);
    await new Promise(r => dbReq.onsuccess = r);
    const db = dbReq.result;
    return new Promise((resolve, reject) => {
      if (!db.objectStoreNames.contains('keys')) {
        db.close();
        return resolve(null);
      }
      const tx = db.transaction('keys', 'readonly');
      const store = tx.objectStore('keys');
      const get = store.get(filename);
      get.onsuccess = () => {
        db.close();
        if (!get.result) return resolve(null);
        resolve(get.result.blob);
      };
      get.onerror = e => {
        db.close();
        reject(e);
      };
    });
  }
}

// High-level helpers
export async function createAndStoreKey(passphrase, label = `key-${Date.now()}`) {
  const key = await createCryptoKey();
  const wrapped = await wrapKeyForBackup(key, passphrase);
  await writeBackupToOPFS(label, wrapped);
  return {
    label,
    key
  };
}
export async function restoreKeyFromBackup(passphrase, label) {
  const buf = await readBackupFromOPFS(label);
  if (!buf) throw new Error('Backup not found');
  const key = await unwrapKeyFromBackup(buf, passphrase);
  return key;
}