// _scripts/base64url.js
// Base64URL per màxima densitat en DNS/HTTP fallback (Vanilla JS pur)

const Base64URL = {
  // Base64URL: - i _ en lloc de + i /, sense padding
  encode(buffer) {
    const bytes = new Uint8Array(buffer);
    let encoded = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    
    for (let i = 0; i < bytes.length; i += 3) {
      const a = bytes[i];
      const b = bytes[i + 1] || 0;
      const c = bytes[i + 2] || 0;
      
      encoded += chars[a >> 2];
      encoded += chars[((a & 3) << 4) | (b >> 4)];
      encoded += chars[((b & 15) << 2) | (c >> 6)] || '';
      encoded += chars[c & 63] || '';
    }
    return encoded;
  },

  decode(str) {
    // Restaurar padding si cal (per alguns usos)
    let input = str.replace(/-/g, '+').replace(/_/g, '/');
    while (input.length % 4) input += '=';
    
    const decoded = [];
    let i = 0;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    
    while (i < input.length) {
      const enc1 = chars.indexOf(input[i++]);
      const enc2 = chars.indexOf(input[i++]);
      const enc3 = chars.indexOf(input[i++]);
      const enc4 = chars.indexOf(input[i++]);

      const chr1 = (enc1 << 2) | (enc2 >> 4);
      decoded.push(chr1);

      if (enc3 !== 64) {
        const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        decoded.push(chr2);
      }
      if (enc4 !== 64) {
        const chr3 = ((enc3 & 3) << 6) | enc4;
        decoded.push(chr3);
      }
    }
    return new Uint8Array(decoded).buffer;
  },

  // Trenca en segments DNS-safe (màxim 63 chars per label)
  toDnsLabels(encoded, maxLabel = 63) {
    const labels = [];
    for (let i = 0; i < encoded.length; i += maxLabel) {
      labels.push(encoded.slice(i, i + maxLabel));
    }
    return labels;
  }
};

export { Base64URL };
