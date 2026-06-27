import { store } from './store.js'; // Dispatcher global (Zustand/Redux/Context)
import { evictLRU } from './pureLRU.js'; // Protocolo de Evicción de la Ronda 3

export const persistCRDTAtomic = async (db, docId, encryptedBin) => {
  try {
    // 🛡️ Transacción aislada EXCLUSIVA para el CRDT. 'idb-crypto' queda 100% a salvo.
    const tx = db.transaction('idb-crdt', 'readwrite');
    const crdtStore = tx.objectStore('idb-crdt');
    
    await new Promise((resolve, reject) => {
      const request = crdtStore.put(encryptedBin, docId);
      request.onsuccess = resolve;
      request.onerror = () => reject(request.error);
      tx.onabort = () => reject(tx.error);
    });
    
    await tx.done; // Exigimos confirmación nativa del controlador de disco flash
    return true;
    
  } catch (error) {
    if (error.name === 'QuotaExceededError' || error.name === 'UnknownError' || error.message?.toLowerCase().includes('quota')) {
      console.error("🚨 [TRELLAT CRÍTIC] El cabàs està ple! Evitant corrupció i salvant claus d'identitat.");
      
      // 1. Despliegue de Emergencia GEM MODERN (Inmutable, Alta Legibilidad Senior)
      if (store && store.dispatch) {
          store.dispatch({
            type: 'SYSTEM_EMERGENCY_UI',
            payload: {
              active: true,
              title: "El telèfon està ple!",
              message: "No podem guardar més records al Mas Digital. Has d'esborrar espai (fotos o vídeos) del teu mòbil per a continuar.",
              styles: {
                backgroundColor: "var(--taronja-socdepoble)",
                color: "var(--blau-socdepoble)",
                fontSize: "28px", // Geometría estricta GEM MODERN Infranqueable
                lineHeight: "1.4",
                padding: "28px",
                textAlign: "center"
              }
            }
          });
      }

      // 2. Forzar Protocolo LRU Agresivo (Amputa los docs más viejos en disco asíncronamente)
      if (typeof evictLRU === 'function') {
          evictLRU({ forceAggressive: true }).catch(console.error);
      }
      
      return false; // El guardado falló, pero la identidad en la red y la RAM sobreviven intactas
    }
    
    throw error; // Propagar fallos lógicos para accionar el Protocol Llàtzeret de la ronda anterior
  }
};
