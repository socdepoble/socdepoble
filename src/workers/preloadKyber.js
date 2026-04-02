// src/workers/preloadKyber.js – Worker silencioso para precompilar WASM
let kyberModule = null;

async function load() {
  if (kyberModule) return kyberModule;
  const { default: init, ml_kem_768_keygen, ml_kem_768_encapsulate, ml_kem_768_decapsulate } 
    = await import('https://unpkg.com/@dashlane/pqc-kem-kyber768-wasm@1.0.0/web/index.js');
  await init();
  kyberModule = { ml_kem_768_keygen, ml_kem_768_encapsulate, ml_kem_768_decapsulate };
  return kyberModule;
}

self.onmessage = async (e) => {
  const { id, type, payload } = e.data;
  try {
    const kyber = await load();
    let result;
    switch (type) {
      case 'KEYGEN':
        result = kyber.ml_kem_768_keygen();
        break;
      case 'ENCAPSULATE':
        result = kyber.ml_kem_768_encapsulate(payload.theirPub);
        break;
      case 'DECAPSULATE':
        result = kyber.ml_kem_768_decapsulate(payload.ciphertext, payload.mySecret);
        break;
      default:
        throw new Error('Unknown kyber op');
    }
    self.postMessage({ id, type: 'SUCCESS', result });
  } catch (error) {
    self.postMessage({ id, type: 'ERROR', error: error.message });
  }
};
