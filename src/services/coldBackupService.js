export const PBKDF2_ITERATIONS = 150_000; // Cost suficiente para resistir brute-force de PIN
const BACKUP_VERSION = 1;

export async function exportColdBackup(privateKey, podId, userPin) {
  // 1. Exporta la clave del WebCrypto sandbox
  const keyData = await crypto.subtle.exportKey('pkcs8', privateKey);

  // 2. Material criptográfico único para este backup
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv   = crypto.getRandomValues(new Uint8Array(12));

  // 3. Deriva clave AES desde el PIN del usuario
  const pinKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(userPin),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  const aesKey = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    pinKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  // 4. Encripta
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    keyData
  );

  // 5. Empaqueta como JSON minimal
  const toB64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));

  return JSON.stringify({
    v:    BACKUP_VERSION,
    pod:  podId,
    salt: toB64(salt),
    iv:   toB64(iv),
    key:  toB64(encrypted),
    ts:   Date.now(),
  });
}

export async function importColdBackup(backupJson, userPin) {
  const { salt, iv, key } = JSON.parse(backupJson);

  const fromB64 = (s) => Uint8Array.from(atob(s), c => c.charCodeAt(0));

  const pinKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(userPin),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  const aesKey = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: fromB64(salt), iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    pinKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  // decrypt lanzará DOMException si el PIN es incorrecto
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromB64(iv) },
    aesKey,
    fromB64(key)
  );

  return crypto.subtle.importKey(
    'pkcs8',
    decrypted,
    { name: 'Ed25519' },
    true,
    ['sign']
  );
}

// Detección y uso de OPFS como almacenamiento primario de clave
export async function storeKeyWithBestMethod(keyBuffer) {
  if ('storage' in navigator && 'getDirectory' in navigator.storage) {
    try {
      const root  = await navigator.storage.getDirectory();
      const file  = await root.getFileHandle('pod.key', { create: true });
      const writer = await file.createWritable();
      await writer.write(keyBuffer);
      await writer.close();
      return 'opfs'; // Más durable en iOS
    } catch (err) {
        console.warn('[ColdBackup] Fallo al usar OPFS, usando fallback:', err);
    }
  }
  return 'idb'; // Se delega al caller manejar IDB (o ya está manejado allí)
}
