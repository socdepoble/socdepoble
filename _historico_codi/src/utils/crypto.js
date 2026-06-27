/**
 * Sóc de Poble - Tecnologia Lliure per a Comunitats Rurals
 * 
 * Llicència: Creative Commons BY-SA 4.0
 * 
 * Mòdul de Seguretat Criptogràfica (PBKDF2 + AES-GCM)
 * Dissenyat per no emmagatzemar mai claus en text pla al disc.
 */

const PBKDF2_ITERATIONS = 100000;
const HASH = 'SHA-256';
const KEY_LEN = 256;

/**
 * Deriva una clau AES-GCM a partir d'una contrasenya i un salt de Supabase.
 * @param {string} password - Contrasenya de l'usuari (o PIN de l'App)
 * @param {Uint8Array} salt - Salt associat a l'usuari (rebut del backend)
 * @returns {Promise<CryptoKey>} Clau AES-GCM en memòria
 */
export async function deriveKeyFromPassword(password, salt) {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  // Importar el password com a material base
  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  // Derivar la clau final
  const derivedKey = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: PBKDF2_ITERATIONS,
      hash: HASH,
    },
    baseKey,
    { name: 'AES-GCM', length: KEY_LEN },
    false, // CRÍTIC: false per evitar que el JavaScript pugui exportar l'AES Key maliciosament!
    ['encrypt', 'decrypt']
  );

  return derivedKey;
}
