// src/lib/postQuantum.js
// V8.0 - Optimizacion WASM con Worker Dedicado

let kyberWorker = null;
let lastUsed = Date.now();
let cleanupTimer = null;

function maybeDestroyWorker() {
  if (cleanupTimer) clearTimeout(cleanupTimer);
  cleanupTimer = setTimeout(() => {
    if (Date.now() - lastUsed > 300000 && kyberWorker) { // 5 min
      kyberWorker.terminate();
      kyberWorker = null;
      console.log('[PQ] Kyber WASM worker terminado para liberar memoria');
    }
  }, 60000);
}

function getKyberWorker() {
  lastUsed = Date.now();
  if (!kyberWorker) {
    kyberWorker = new Worker(new URL('workers/preloadKyber.js', import.meta.url), { type: 'module' });
    maybeDestroyWorker();
  }
  return kyberWorker;
}

function kyberOp(type, payload) {
  return new Promise((resolve, reject) => {
    const id = crypto.randomUUID();
    const worker = getKyberWorker();
    const handler = (e) => {
      if (e.data.id === id) {
        worker.removeEventListener('message', handler);
        if (e.data.type === 'SUCCESS') resolve(e.data.result);
        else reject(new Error(e.data.error));
      }
    };
    worker.addEventListener('message', handler);
    worker.postMessage({ id, type, payload });
  });
}

/**
 * Esquema HÍBRIDO: X25519 (clásico) + ML-KEM-768 (post-cuántico)
 */
export async function hybridKeyGen() {
  const { publicKey: kyberPub, secretKey: kyberSec } = await kyberOp('KEYGEN');
  
  const x25519Pair = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'X25519' },
    false,
    ['deriveKey', 'deriveBits']
  );
  
  return { 
    kyber: { publicKey: kyberPub, secretKey: kyberSec }, 
    x25519: x25519Pair 
  };
}

export async function hybridEncapsulate(theirKyberPub, theirX25519Pub, myX25519Priv) {
  const { ciphertext: kyberCt, sharedSecret: kyberSS } = await kyberOp('ENCAPSULATE', { theirPub: theirKyberPub });
  
  const x25519Bits = await crypto.subtle.deriveBits(
    { name: 'ECDH', public: theirX25519Pub },
    myX25519Priv,
    256
  );
  
  const sessionKey = await combineSecrets(new Uint8Array(x25519Bits), kyberSS);
  return { kyberCiphertext: kyberCt, sessionKey };
}

export async function hybridDecapsulate(kyberCiphertext, myKyberSec, theirX25519Pub, myX25519Priv) {
  const kyberSS = await kyberOp('DECAPSULATE', { ciphertext: kyberCiphertext, mySecret: myKyberSec });
  
  const x25519Bits = await crypto.subtle.deriveBits(
    { name: 'ECDH', public: theirX25519Pub },
    myX25519Priv,
    256
  );
  
  return combineSecrets(new Uint8Array(x25519Bits), kyberSS);
}

async function combineSecrets(x25519Secret, kyberSecret) {
  const combined = new Uint8Array(x25519Secret.length + kyberSecret.length);
  combined.set(x25519Secret);
  combined.set(kyberSecret, x25519Secret.length);

  const keyMaterial = await crypto.subtle.importKey(
    'raw', combined, { name: 'HKDF' }, false, ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt: crypto.getRandomValues(new Uint8Array(32)),
      info: new TextEncoder().encode('soc-de-poble-hybrid-pq-v1'),
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}
