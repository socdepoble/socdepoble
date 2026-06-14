// src/workers/rhizome.worker.js

// === ZERO DEPENDENCIES (PUR, només Web APIs + fflate) ===
import { compressSync, decompressSync } from 'fflate';

// === PROTOCOL DE MISSATGERIA (PACK | UNPACK | SYNC) ===
const MESSAGE_TYPES = {
  PACK: 'PACK',
  // Main → Worker: comprime + xifra
  UNPACK: 'UNPACK',
  // Worker → Main: descomprime + decrypta
  SYNC: 'SYNC',
  // Worker → Main: sync complet
  ERROR: 'ERROR' // Worker → Main: error
};

// === RHIZOMEWORKER (Principal) ===
self.onmessage = async event => {
  const {
    type,
    payload,
    id
  } = event.data;
  try {
    let result;
    if (type === MESSAGE_TYPES.PACK) {
      result = await pack(payload);
      self.postMessage({
        type: MESSAGE_TYPES.PACK,
        id,
        ...result
      });
    } else if (type === MESSAGE_TYPES.UNPACK) {
      result = await unpack(payload);
      self.postMessage({
        type: MESSAGE_TYPES.UNPACK,
        id,
        ...result
      });
    } else if (type === MESSAGE_TYPES.SYNC) {
      result = await sync(payload);
      self.postMessage({
        type: MESSAGE_TYPES.SYNC,
        id,
        ...result
      });
    } else {
      throw new Error(`Unknown message type: ${type}`);
    }
  } catch (error) {
    self.postMessage({
      type: MESSAGE_TYPES.ERROR,
      id,
      error: error.message
    });
  }
};

// === PACK: Comprime + Xifra (Main → Worker) ===
async function pack(payload) {
  // payload.update: Uint8Array amb el delta o estat de Yjs
  // payload.keyHex: String hexadecimal o ArrayBuffer de la clau AES

  // 1. COMPRESS (fflate, LZO, 60-70% reducció)
  // use compressSync for fastest deflate (level 1)
  const compressed = compressSync(payload.update, {
    level: 1
  });

  // 2. ENCRYPT (AES-GCM, Web Crypto)
  const key = await importKey(payload.keyHex);

  // Generate random IV
  const iv = self.crypto.getRandomValues(new Uint8Array(12));
  const encryptedBuffer = await self.crypto.subtle.encrypt({
    name: 'AES-GCM',
    iv
  }, key, compressed);

  // Concatenate IV + Ciphertext
  const encrypted = new Uint8Array(iv.length + encryptedBuffer.byteLength);
  encrypted.set(iv, 0);
  encrypted.set(new Uint8Array(encryptedBuffer), iv.length);
  return {
    packed: encrypted
  };
}

// === UNPACK: Descomprime + Decrypta (Worker → Main) ===
async function unpack(payload) {
  // payload.packed: Uint8Array amb IV + Ciphertext
  // payload.keyHex: Clau AES

  const packed = payload.packed;
  if (packed.length < 12) throw new Error("Dades xifrades massa curtes");

  // Extraure IV i Ciphertext
  const iv = packed.slice(0, 12);
  const ciphertext = packed.slice(12);

  // 1. DECRYPT (AES-GCM, Web Crypto)
  const key = await importKey(payload.keyHex);
  let decryptedBuffer;
  try {
    decryptedBuffer = await self.crypto.subtle.decrypt({
      name: 'AES-GCM',
      iv
    }, key, ciphertext);
  } catch (e) {
    throw new Error("Error desxifrant l'estat. Clau incorrecta o dades corrompudes.");
  }
  const decrypted = new Uint8Array(decryptedBuffer);

  // 2. DECOMPRESS (fflate)
  const decompressed = decompressSync(decrypted);
  return {
    update: decompressed
  };
}

// === SYNC: Simulació de sincronització pesada en 2nd pla ===
async function sync(payload) {
  // Simula un processament pesat per fusionar deltas sense bloquejar el Main Thread
  // En la realitat ací es podria carregar un document Yjs sencer i fer el merge
  return {
    status: 'synced',
    timestamp: Date.now()
  };
}

// === UTILITATS CRYPTO ===
async function importKey(keyData) {
  let rawKey;
  if (typeof keyData === 'string') {
    // Hex to Uint8Array
    rawKey = new Uint8Array(keyData.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
  } else {
    rawKey = keyData;
  }
  return await self.crypto.subtle.importKey('raw', rawKey, {
    name: 'AES-GCM',
    length: 256
  }, false, ['encrypt', 'decrypt']);
}