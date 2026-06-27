// _scripts/lz77-compressor.js
// LZ77 simple des de zero (sense dependències) per WebSocket

class LZ77 {
  static compress(input) {
    const data = typeof input === 'string' ? new TextEncoder().encode(input) : new Uint8Array(input);
    const output = [];
    let i = 0;
    while (i < data.length) {
      let bestLength = 0;
      let bestOffset = 0;
      for (let j = Math.max(0, i - 4096); j < i; j++) { // finestra de 4KB
        let length = 0;
        while (length < 255 && i + length < data.length && data[j + length] === data[i + length]) {
          length++;
        }
        if (length > bestLength) {
          bestLength = length;
          bestOffset = i - j;
        }
      }
      if (bestLength >= 3) {
        output.push(0); // flag literal
        output.push(bestOffset & 0xFF);
        output.push((bestOffset >> 8) & 0xFF);
        output.push(bestLength);
        i += bestLength;
      } else {
        output.push(1); // literal byte
        output.push(data[i]);
        i++;
      }
    }
    return new Uint8Array(output).buffer;
  }

  static decompress(compressed) {
    const data = new Uint8Array(compressed);
    const output = [];
    let i = 0;
    while (i < data.length) {
      const flag = data[i++];
      if (flag === 1) { // literal
        output.push(data[i++]);
      } else if (flag === 0) { // reference
        const offset = data[i] | (data[i + 1] << 8);
        const length = data[i + 2];
        i += 3;
        const start = output.length - offset;
        for (let k = 0; k < length; k++) {
          output.push(output[start + k]);
        }
      }
    }
    return new Uint8Array(output).buffer;
  }
}

export { LZ77 };
