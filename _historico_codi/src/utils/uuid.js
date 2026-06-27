/**
 * Helper per generar UUIDv4
 */
export function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

/**
 * Converteix un UUID string en 16 bytes (Uint8Array)
 * @param {string} uuidStr - UUID ex: '123e4567-e89b-12d3-a456-426614174000'
 */
export function uuidToBytes(uuidStr) {
  const hex = uuidStr.replace(/-/g, '');
  const bytes = new Uint8Array(16);
  if (hex.length !== 32) {
    return bytes; // blank if invalid
  }
  for (let i = 0; i < 16; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}
