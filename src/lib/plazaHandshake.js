// src/lib/plazaHandshake.js

// Wordlist en valenciano/castellano — 256 palabras comunes del campo
const PLAZA_WORDS = [
  'casa', 'sol', 'riu', 'lluna', 'camp', 'flor', 'arbre', 'pedra',
  'porta', 'forn', 'pluja', 'vent', 'foc', 'terra', 'mar', 'cel',
  'herba', 'gra', 'oli', 'vi', 'taronja', 'llimo', 'pou', 'sequia',
  'mula', 'gall', 'ovella', 'cabra', 'abella', 'colom', 'conill', 'llebre',
  'alba', 'vespre', 'nit', 'mati', 'hivern', 'estiu', 'tardor', 'primavera',
  'clau', 'ferro', 'fusta', 'pedra', 'corda', 'sac', 'cistell', 'cantir',
]
// Extender hasta 256 por simplificación del script
for(let i = PLAZA_WORDS.length; i < 256; i++) {
    PLAZA_WORDS.push(PLAZA_WORDS[i % 48]);
}

/**
 * Genera el Safety Number visual: 4 palabras + código de 6 dígitos
 * Ambos lados deben generar el MISMO resultado dado los mismos inputs.
 * 
 * @param {Uint8Array} myPublicKey   — clave pública Ed25519 local
 * @param {Uint8Array} theirPublicKey — clave pública Ed25519 del peer
 * @returns {{ words: string[], code: string, raw: Uint8Array }}
 */
export async function generateSafetyPhrase(myPublicKey, theirPublicKey) {
  // Orden canónico: lexicográfico — garantiza mismo resultado en ambos lados
  const [keyA, keyB] = [myPublicKey, theirPublicKey]
    .map(k => Array.from(k).map(b => b.toString(16).padStart(2, '0')).join(''))
    .sort()

  const combined = new TextEncoder().encode(keyA + keyB)

  // 5 rondas de SHA-256 — coste de fuerza bruta × 5
  let hash = combined
  for (let i = 0; i < 5; i++) {
    hash = new Uint8Array(await crypto.subtle.digest('SHA-256', hash))
  }

  // 4 palabras: cada una indexada por un byte (256 palabras = 1 byte perfecto)
  const words = [hash[0], hash[8], hash[16], hash[24]]
    .map(idx => PLAZA_WORDS[idx % PLAZA_WORDS.length])

  // Código de 6 dígitos para verificación rápida sin hablar
  const view = new DataView(hash.buffer)
  const code = (view.getUint32(0) % 1_000_000).toString().padStart(6, '0')

  return { words, code, raw: hash }
}

/**
 * Derivar clave de sesión P2P a partir del Safety Hash compartido
 * usando HKDF — clave efímera que muere cuando se cierra el DataChannel
 * 
 * @param {Uint8Array} safetyHash — output.raw de generateSafetyPhrase
 * @param {Uint8Array} sessionSalt — nonce único de la sesión
 * @returns {CryptoKey} — AES-GCM 256 bits, non-extractable, solo para esta sesión
 */
export async function deriveSessionKey(safetyHash, sessionSalt) {
  // Importar el hash como material de clave HKDF
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    safetyHash,
    { name: 'HKDF' },
    false,
    ['deriveKey']
  )

  // Derivar clave AES-GCM de sesión
  return crypto.subtle.deriveKey(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt: sessionSalt,                              // nonce único por sesión
      info: new TextEncoder().encode('soc-de-poble-p2p-session-v1'),
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,   // NON-EXTRACTABLE — muere con el Worker
    ['encrypt', 'decrypt']
  )
}

/**
 * Web Speech API — leer las palabras en voz alta automáticamente
 * Accesibilidad: el móvil lee las palabras, el vecino no necesita leer
 */
export function speakSafetyPhrase(words, lang = 'ca-ES') {
  if (!('speechSynthesis' in self && 'SpeechSynthesisUtterance' in self)) {
    // Web Speech no disponible en Workers — delegar al hilo principal
    self.postMessage({ type: 'SPEAK_WORDS', words, lang })
    return
  }
  const text = `Paraules de seguretat: ${words.join(', ')}`
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  utterance.rate = 0.8   // más lento para personas mayores
  speechSynthesis.speak(utterance)
}
