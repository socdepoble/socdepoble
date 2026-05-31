import * as Y from 'yjs';


const tsunamiQueue = [];
let isProcessing = false;
const TIME_BUDGET_MS = 12; // Presupuesto de 12ms (deja ~4ms libres para pintar a 60fps)

// API Macro-Task ultrarrápida
const channel = typeof MessageChannel !== 'undefined' ? new MessageChannel() : null;
if (channel) {
    channel.port1.onmessage = () => processChunk();
}

export const queueTsunamiUpdate = (ydoc, updateBin, sourcePeerId) => {
  tsunamiQueue.push({ ydoc, updateBin, sourcePeerId });
  if (!isProcessing) {
    isProcessing = true;
    if (channel) {
        channel.port2.postMessage(null); // Despierta el Slicer
    } else {
        setTimeout(processChunk, 0); // fallback legacy
    }
  }
};

const processChunk = () => {
  if (tsunamiQueue.length === 0) {
    isProcessing = false;
    return;
  }

  const deadline = performance.now() + TIME_BUDGET_MS;
  const currentDoc = tsunamiQueue[0].ydoc;

  // 🛡️ EL ESCUDO: transact absorbe las mutaciones. Cero render-storms en UI.
  Y.transact(currentDoc, () => {
    while (tsunamiQueue.length > 0 && performance.now() < deadline) {
      if (tsunamiQueue[0].ydoc !== currentDoc) break; // Cambio de documento, cede tick

      const { updateBin, sourcePeerId } = tsunamiQueue.shift();
      try {
        Y.applyUpdate(currentDoc, updateBin, 'tsunami-slicer');
        

      } catch (e) {
        console.warn("[TRELLAT] Delta P2P corrupte evadit.", e);
      }
    }
  }, 'tsunami-slicer');

  if (tsunamiQueue.length > 0) {
    // ⏱️ YIELD: Presupuesto agotado. Cedemos el Event Loop al navegador 
    // para pintar el DOM, capturar gestos táctiles y seguir descomprimiendo.
    if (channel) channel.port2.postMessage(null);
    else setTimeout(processChunk, 0);
  } else {
    isProcessing = false;
  }
};
