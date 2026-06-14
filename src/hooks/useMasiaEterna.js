// src/hooks/useMasiaEterna.js
import { useEffect, useRef, useState } from 'react';
import { RhizomeManagerV3 } from '../services/rhizomeManagerV3';
export function useMasiaEterna(yDoc, docId, cryptoKey) {
  const [estat, setEstat] = useState('escalfant'); // escalfant | actiu | error
  const rhzRef = useRef(null);
  useEffect(() => {
    if (!docId || !cryptoKey || !yDoc) return;
    const arrancarTractor = async () => {
      try {
        const manager = new RhizomeManagerV3({
          dbName: docId,
          cryptoKey,
          worker: window.rhizomeWorker,
          opfsStore: window.opfsStore
        });

        // Per compatibilitat amb l'API imaginada per Gemini, afegim els mètodes si no existeixen
        manager.recuperarLlençolDeRescat = manager.recuperarLlençolDeRescat || async function () {};
        manager.connectarCellerVectors = manager.connectarCellerVectors || async function () {};
        manager.activarMemoriaEfimera = manager.activarMemoriaEfimera || function () {};
        rhzRef.current = manager;

        // 1. Instint de Supervivència: Hi ha un pànic dump d'ahir per processar?
        await manager.recuperarLlençolDeRescat();

        // 2. Llegim els fonaments del disc (IDB Snapshot + deltes residuals)
        await manager.init();

        // 3. Connectem el Celler de Vectors (OPFS) amb Picardia de Supervivència
        try {
          await manager.connectarCellerVectors();
        } catch (e) {
          console.warn("⚠️ Safari no ens deixa baixar al celler (OPFS bloquejat). Usem RAM temporal.");
          manager.activarMemoriaEfimera();
        }
        setEstat('actiu');
      } catch (err) {
        console.error("🔥 Error greu al motor. Cridant al mecànic...", err);
        setEstat('error'); // El "tractor s'ha calat"
      }
    };
    arrancarTractor();

    // EL SOSP-LOCK GLOBAL: La Picardia final per desactivar el Drag & Drop del SO
    // que ens generava events fantasmes i congelava el fil principal a l'iPad.
    const prevenirDnd = e => e.preventDefault();
    document.addEventListener('dragover', prevenirDnd);
    document.addEventListener('drop', prevenirDnd);
    return () => {
      document.removeEventListener('dragover', prevenirDnd);
      document.removeEventListener('drop', prevenirDnd);
      // Netegem memòria en tancar la parcel·la
      if (rhzRef.current) rhzRef.current.destroy();
    };
  }, [yDoc, docId, cryptoKey]);
  return {
    manager: rhzRef.current,
    estat
  };
}