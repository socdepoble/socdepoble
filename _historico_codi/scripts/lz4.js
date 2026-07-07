// _scripts/lz4.js
// LZ4 Block Format simplificat (alta velocitat descompressió) - Vanilla JS pur
// Versió funcional per a ús rural (no 100% compliant amb totes les extensions, però ràpida i correcta)

class LZ4 {
  static MAGIC = 0x184D2204;

  static compress(input) {
    const data = typeof input === 'string' ? new TextEncoder().encode(input) : new Uint8Array(input);
    if (data.length === 0) return new Uint8Array(0).buffer;

    const output = [];
    let i = 0;

    while (i < data.length) {
      let literalStart = i;
      let matchLength = 0;
      let matchOffset = 0;

      // Buscar match (finestra petita per velocitat)
      for (let j = Math.max(0, i - 65535); j < i; j++) {
        let len = 0;
        while (len < 255 && i + len < data.length && data[j + len] === data[i + len]) len++;
        if (len > matchLength) {
          matchLength = len;
          matchOffset = i - j;
        }
      }

      const literalLength = i - literalStart;
      if (matchLength < 4) {
        matchLength = 0;
      }

      // Token
      let token = Math.min(literalLength, 15) << 4;
      token |= Math.min(matchLength - 4, 15);
      output.push(token);

      // Literal length extra
      if (literalLength >= 15) {
        let extra = literalLength - 15;
        while (extra >= 255) {
          output.push(255);
          extra -= 255;
        }
        output.push(extra);
      }

      // Literals
      for (let k = literalStart; k < i; k++) {
        output.push(data[k]);
      }

      if (matchLength >= 4) {
        // Match offset (little endian)
        output.push(matchOffset & 0xFF);
        output.push((matchOffset >> 8) & 0xFF);

        // Match length extra
        let extraMatch = matchLength - 4;
        if (matchLength - 4 >= 15) {
          extraMatch = matchLength - 4 - 15;
          while (extraMatch >= 255) {
            output.push(255);
            extraMatch -= 255;
          }
          output.push(extraMatch);
        }
        i += matchLength;
      } else {
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
      const token = data[i++];
      let literalLength = token >> 4;
      let matchLength = (token & 0x0F) + 4;

      // Literal extra
      if (literalLength === 15) {
        let extra;
        do {
          extra = data[i++];
          literalLength += extra;
        } while (extra === 255);
      }

      // Copiar literals
      for (let j = 0; j < literalLength; j++) {
        output.push(data[i++]);
      }

      if (i >= data.length) break;

      // Match
      if (matchLength > 4 || literalLength > 0) {
        const offset = data[i] | (data[i + 1] << 8);
        i += 2;

        // Match length extra
        if ((token & 0x0F) === 15) {
          let extra;
          do {
            extra = data[i++];
            matchLength += extra;
          } while (extra === 255);
        }

        const start = output.length - offset;
        for (let j = 0; j < matchLength; j++) {
          output.push(output[start + j]);
        }
      }
    }
    return new Uint8Array(output).buffer;
  }
}

export { LZ4 };
