// _scripts/lz77-dict-compressor.js
// LZ77 amb diccionari + hash per detectar inconsistències de versió

const SHARED_DICTIONARY = new TextEncoder().encode(
  "bancal horta iaia masero rentonar socdepoble valencia poble CRDT offline indexeddb vectorclock delta lww pwa rural audit lighthouse axe websocket binary lz77"
);

class LZ77Dict {
  static simpleHash(buffer) {
    let hash = 0;
    const data = new Uint8Array(buffer);
    for (let i = 0; i < data.length; i++) {
      hash = (hash * 31 + data[i]) >>> 0; // Murmur-like simple, 32-bit
    }
    return hash.toString(36).padStart(8, '0'); // ~8 chars, curt i DNS/WS friendly
  }

  static getDictionaryHash(dict = SHARED_DICTIONARY) {
    return this.simpleHash(dict);
  }

  static compress(input, dict = SHARED_DICTIONARY) {
    const dictHash = this.getDictionaryHash(dict);
    let data = typeof input === 'string' ? new TextEncoder().encode(input) : new Uint8Array(input);
    
    const combined = new Uint8Array(dict.length + data.length);
    combined.set(dict, 0);
    combined.set(data, dict.length);
    
    const output = [];
    // Capçalera: hash del diccionari (8 chars en ASCII)
    const hashBytes = new TextEncoder().encode(dictHash);
    output.push(...hashBytes); // 8 bytes de hash

    let i = dict.length;
    while (i < combined.length) {
      let bestLength = 0;
      let bestOffset = 0;
      for (let j = Math.max(0, i - 4096); j < i; j++) {
        let length = 0;
        while (length < 255 && i + length < combined.length && combined[j + length] === combined[i + length]) {
          length++;
        }
        if (length > bestLength) {
          bestLength = length;
          bestOffset = i - j;
        }
      }
      if (bestLength >= 3) {
        output.push(0); // reference
        output.push(bestOffset & 0xFF);
        output.push((bestOffset >> 8) & 0xFF);
        output.push(bestLength);
        i += bestLength;
      } else {
        output.push(1); // literal
        output.push(combined[i]);
        i++;
      }
    }
    return new Uint8Array(output).buffer;
  }

  static decompress(compressed) {
    const data = new Uint8Array(compressed);
    let i = 0;
    
    // Llegir hash del diccionari (8 bytes)
    if (data.length < 8) return new Uint8Array(0).buffer; // corrupte
    const receivedHash = new TextDecoder().decode(data.slice(0, 8));
    i = 8;
    
    // TODO: Comparar amb el hash local. Si no coincideix, usar mode sense diccionari o alertar.
    console.log(`📦 Diccionari rebut amb hash: ${receivedHash}`);

    const output = [];
    while (i < data.length) {
      try {
        const flag = data[i++];
        if (flag === 1) {
          if (i < data.length) output.push(data[i++]);
        } else if (flag === 0) {
          if (i + 2 >= data.length) break;
          const offset = data[i] | (data[i + 1] << 8);
          const length = data[i + 2];
          i += 3;
          const start = output.length - offset;
          for (let k = 0; k < length; k++) {
            if (start + k >= 0 && start + k < output.length) {
              output.push(output[start + k]);
            }
          }
        }
      } catch (e) {
        console.warn('⚠️ LZ77 truncat - recuperant partial');
        break;
      }
    }
    return new Uint8Array(output).buffer;
  }
}

export { LZ77Dict };
