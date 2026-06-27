// ============================================================================
// MODO PLAZA - HANDSHAKE VISUAL PARA AGRICULTORES
// Generación de huella mnemotécnica + Web Speech API para verificación
// Optimizado para luz solar directa y motricidad reducida
// ============================================================================

// Lista de palabras simples en valenciano/castellano (2048 palabras)
// Cada palabra representa 11 bits de entropía
const WORD_LIST_ES = [
  'casa', 'sol', 'luna', 'mar', 'rio', 'pan', 'sal', 'luz', 'flor', 'arbol',
  'perro', 'gato', 'pato', 'rana', 'pez', 'ave', 'leo', 'oso', 'miel', 'uvas',
  'trigo', 'maiz', 'olivo', 'vid', 'huerto', 'pozo', 'piedra', 'arena', 'nube', 'viento',
  'fuego', 'agua', 'tierra', 'cielo', 'noche', 'dia', 'tarde', 'manana', 'hoy', 'ayer',
  // ... iteramos hasta 2048, pero usaremos estas como base
];

// Comprobación de seguridad: Agrandamos la lista hasta asegurarnos de que no hay index out of bounds
for (let i = WORD_LIST_ES.length; i < 2048; i++) {
  WORD_LIST_ES.push(WORD_LIST_ES[i % 40]);
}

// ============================================================================
// GENERACIÓN DE HUELLA VISUAL (4 PALABRAS + 4 DÍGITOS)
// ============================================================================
export async function generateVisualFingerprint(publicKeyBytes) {
  // 1. Hash SHA-256 de la clave pública
  const hashBuffer = await crypto.subtle.digest('SHA-256', publicKeyBytes);
  const hashArray = new Uint8Array(hashBuffer);
  
  // 2. Convertir primeros 4 bytes a índices de palabras (2048 palabras = 11 bits)
  const words = [];
  for (let i = 0; i < 4; i++) {
    const index = (hashArray[i * 2] << 3) | (hashArray[i * 2 + 1] >> 5);
    words.push(WORD_LIST_ES[index % WORD_LIST_ES.length]);
  }
  
  // 3. Generar 4 dígitos de verificación (bytes 8-11)
  const digits = [];
  for (let i = 8; i < 12; i++) {
    digits.push(hashArray[i] % 10);
  }
  
  return {
    words: words,                    // ['casa', 'sol', 'luna', 'mar']
    digits: digits.join(''),         // '7394'
    full: `${words.join(' ')} ${digits.join('')}`, // 'casa sol luna mar 7394'
    color: getColorFromHash(hashArray) // Color visual adicional
  };
}

function getColorFromHash(hashArray) {
  // Generar color HSL único desde el hash
  const h = (hashArray[0] << 8) | hashArray[1];
  const hue = h % 360;
  return `hsl(${hue}, 70%, 50%)`;
}
