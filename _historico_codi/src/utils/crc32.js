/**
 * Implementació manual de CRC-32 (Zero-dependencies)
 * Optimitzada per strings i Uint8Arrays.
 * @param {Uint8Array|string} strOrBytes
 * @returns {number} Unsigned 32-bit integer crc32
 */
export function crc32(strOrBytes) {
  let bytes = strOrBytes;
  if (typeof strOrBytes === 'string') {
    bytes = new TextEncoder().encode(strOrBytes);
  } else if (strOrBytes instanceof ArrayBuffer) {
    bytes = new Uint8Array(strOrBytes);
  }
  
  let crc = 0 ^ (-1);
  for (let i = 0; i < bytes.length; i++) {
    crc ^= bytes[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ ((crc & 1) ? 0xEDB88320 : 0);
    }
  }
  return (crc ^ (-1)) >>> 0;
}
