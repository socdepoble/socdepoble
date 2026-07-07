// _scripts/crc32.js
// CRC32 robust (IEEE 802.3 / ZIP) - Vanilla JS pur

class CRC32 {
  static TABLE = (() => {
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[i] = c;
    }
    return table;
  })();

  /**
   * Calcula CRC32 d'un ArrayBuffer / Uint8Array / String
   * @param {ArrayBuffer|Uint8Array|string} data
   * @returns {number} CRC32 (unsigned 32-bit)
   */
  static compute(data) {
    let crc = 0xFFFFFFFF;
    const bytes = typeof data === 'string' 
      ? new TextEncoder().encode(data) 
      : new Uint8Array(data);

    for (let i = 0; i < bytes.length; i++) {
      crc = (crc >>> 8) ^ this.TABLE[(crc ^ bytes[i]) & 0xFF];
    }
    return (crc ^ 0xFFFFFFFF) >>> 0; // unsigned
  }

  /**
   * Hash curt per capçaleres (6-8 caràcters)
   */
  static toShortHash(data) {
    const crc = this.compute(data);
    return crc.toString(36).padStart(8, '0'); // ~8 chars base-36
  }
}

export { CRC32 };
