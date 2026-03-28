// El Worker usa WebCrypto, no cal importar l'antic node:crypto
// Aquest fitxer és per utilitzar amb la webcrypto en local/PWA client!

export async function generateUserKey() {
  const key = await window.crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true, // extractable
    ['encrypt', 'decrypt']
  );
  
  const rawKey = await window.crypto.subtle.exportKey('raw', key);
  const keyBase64 = btoa(String.fromCharCode(...new Uint8Array(rawKey)));
  
  // Guardem a localStorage (podria moure's a sessionStorage/TrustZone depenent de rígiditat)
  localStorage.setItem('user_crypto_key_AESGCM', keyBase64);
  return key;
}

export async function getUserKey() {
  const keyBase64 = localStorage.getItem('user_crypto_key_AESGCM');
  if (!keyBase64) return null;
  const rawKey = Uint8Array.from(atob(keyBase64), c => c.charCodeAt(0));
  return await window.crypto.subtle.importKey(
    'raw',
    rawKey,
    { name: 'AES-GCM' },
    true,
    ['encrypt', 'decrypt']
  );
}

export async function encryptBlob(blob, key) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const plaintext = await blob.arrayBuffer();
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    plaintext
  );
  
  const encrypted = new Uint8Array(iv.length + ciphertext.byteLength);
  encrypted.set(iv);
  encrypted.set(new Uint8Array(ciphertext), iv.length);
  return new Blob([encrypted], { type: 'application/octet-stream' });
}

export async function decryptBlob(encryptedBlob, key) {
  const data = await encryptedBlob.arrayBuffer();
  const iv = new Uint8Array(data.slice(0, 12));
  const ciphertext = data.slice(12);
  const plaintext = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );
  return new Blob([plaintext], { type: 'image/jpeg' });
}
