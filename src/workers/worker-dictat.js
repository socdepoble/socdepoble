import { pipeline, env } from '@huggingface/transformers';

// CONFIGURACIÓ BÚNKER: 
// Forcem persistència massiva. El model no s'esborrarà fàcilment.
env.allowLocalModels = false; // Necessitem descarregar-lo d'HF el primer cop
env.useBrowserCache = true;   // Emmagatzema a la memòria cau OPFS del mòbil permanentment

let transcriptor = null;

self.onmessage = async (e) => {
  const { type, audioBlob } = e.data;

  if (type === 'INIT') {
    self.postMessage({ status: 'loading', msg: 'Despertant l\'Oracle del Poble...' });
    
    // Whisper-tiny quantitzat (q4): ~40MB. Càrrega fulgurant.
    try {
      transcriptor = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny', {
        device: navigator.gpu ? 'webgpu' : 'wasm', // Acceleració GPU local del telèfon!
        dtype: 'q4'
      });
      self.postMessage({ status: 'ready' });
    } catch (error) {
      console.error("No s'ha pogut carregar l'Oracle:", error);
      self.postMessage({ status: 'error', msg: 'Error de memòria' });
    }
  } 
  
  if (type === 'DICTAT' && transcriptor) {
    self.postMessage({ status: 'processing', msg: 'Escoltant la memòria...' });
    
    // Convertim el Blob del micròfon a URL per processar-lo
    const audioUrl = URL.createObjectURL(audioBlob);
    
    try {
      // Convertim veu pesada a text lleuger 100% OFFLINE i privat
      const result = await transcriptor(audioUrl, {
        language: 'catalan',
        task: 'transcribe',
        chunk_length_s: 30 // Trosseja automàticament històries molt llargues
      });

      // Aquest text s'injectarà al Yjs CRDT i viatjarà per Bluetooth/LoRa!
      self.postMessage({ status: 'success', text: result.text });
    } catch (error) {
      console.error("Error processant l'àudio:", error);
      self.postMessage({ status: 'error', msg: 'Error al transcriure' });
    } finally {
      URL.revokeObjectURL(audioUrl); // Alliberar memòria
    }
  }
};
