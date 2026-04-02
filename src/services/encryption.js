// El Worker usa WebCrypto, estem aïllant la clau privada d'IndexedDB en un Proxy Dedicated Worker.
// Aquest fitxer només és un client (proxy) i no toca la CryptoKey directament en el fil principal.

let worker = null;
let commandId = 0;
const pending = new Map();

function getWorker() {
  if (!worker) {
    // Inicialitzem el worker només quan se'l necessita
    worker = new Worker(new URL('../workers/cryptoWorker.js', import.meta.url), { type: 'module' });
    worker.addEventListener('message', (e) => {
      const { id, type, result, error } = e.data;
      if (pending.has(id)) {
        const { resolve, reject } = pending.get(id);
        pending.delete(id);
        if (type === 'SUCCESS') {
          resolve(result);
        } else {
          reject(new Error(error));
        }
      }
    });
  }
  return worker;
}

function sendCommand(type, payload, transfer = []) {
  return new Promise((resolve, reject) => {
    const id = ++commandId;
    pending.set(id, { resolve, reject });
    getWorker().postMessage({ id, type, payload }, transfer);
  });
}

export async function generateUserKey() {
  await sendCommand('GENERATE_KEY');
  return true; // No retornem la clau per blindar l'XSS al fil principal
}

export async function hasUserKey() {
  return await sendCommand('HAS_KEY');
}

// Mantenim l'antiga signatura temporalment per seguretat (encara que key ja no s'usa)
export async function getUserKey() {
  // Retorna un dummy si el codi antic expectava una clau, 
  // però actualment s'assumeix que només importa saber si existeix
  const hasKey = await hasUserKey();
  return hasKey ? "HIDDEN_IN_WORKER" : null;
}

export async function encryptBlob(blob) {
  const plainBuffer = await blob.arrayBuffer();
  // Transferim l'ArrayBuffer directament al worker (zero-copy overhead)
  const encryptedBuffer = await sendCommand('ENCRYPT', plainBuffer, [plainBuffer]);
  return new Blob([encryptedBuffer], { type: 'application/octet-stream' });
}

export async function decryptBlob(encryptedBlob) {
  const encryptedBuffer = await encryptedBlob.arrayBuffer();
  // Transferim l'ArrayBuffer (zero-copy overheadd)
  const decryptedBuffer = await sendCommand('DECRYPT', encryptedBuffer, [encryptedBuffer]);
  // Per defecte assumim image/jpeg en Sóc de Poble (així s'havia prefixat)
  return new Blob([decryptedBuffer], { type: 'image/jpeg' });
}
