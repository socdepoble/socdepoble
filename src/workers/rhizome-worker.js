// 👷‍♂️ AQUEST CODI S'EXECUTA EN UN FIL SEPARAT (Web Worker)
// S'encarrega d'agrupar i comprimir els deltes de Yjs per a no bloquejar el fil principal (React).

import * as Y from 'yjs';
self.onmessage = async e => {
  const {
    accio,
    id,
    deltes,
    configuracio,
    estatActual
  } = e.data;
  try {
    switch (accio) {
      // ⚡ PROCESSAR BLOC: Merge + Compress
      case 'PROCESSAR_BLOC':
        {
          // 1. Convertir ArrayBuffers a Uint8Arrays per a Yjs
          const updates = deltes.map(buf => new Uint8Array(buf));

          // 2. FUSIONAR ELS DELTES (La feina pesada en Wasm/C sota el capó de Yjs)
          const merged = Y.mergeUpdates(updates);
          let dadesPerGuardar;
          let esComprimit = false;

          // 3. COMPRIMIR NOMÉS SI CONVÉ (Regla de pes: ex. 1KB)
          const MINIM = configuracio?.MINIM_MIDA_PER_COMPRIMIR || 1024;
          if (merged.byteLength > MINIM) {
            const stream = new Blob([merged]).stream();
            const comprimitStream = stream.pipeThrough(new CompressionStream('gzip'));
            dadesPerGuardar = await new Response(comprimitStream).arrayBuffer();
            esComprimit = true;
          } else {
            dadesPerGuardar = merged.buffer; // Guardem l'ArrayBuffer tal qual
          }

          // Enviem el resultat al fil principal com a Transferable Object
          self.postMessage({
            tipus: 'BLOC_PROCESSAT',
            id,
            dades: {
              dadesComprimides: dadesPerGuardar,
              esComprimit
            }
          }, [dadesPerGuardar]); // La màgia del Transferable

          break;
        }

      // 📦 CREAR SNAPSHOT: Només comprimir estat sencer
      case 'CREAR_SNAPSHOT':
        {
          const updateArray = new Uint8Array(estatActual);
          const stream = new Blob([updateArray]).stream();
          const comprimitStream = stream.pipeThrough(new CompressionStream('gzip'));
          const dadesComprimides = await new Response(comprimitStream).arrayBuffer();
          self.postMessage({
            tipus: 'SNAPSHOT_CREAT',
            id,
            dades: {
              dadesComprimides
            }
          }, [dadesComprimides]);
          break;
        }
      default:
        console.warn('[RhizomeWorker] Acció no reconeguda:', accio);
    }
  } catch (err) {
    self.postMessage({
      error: err.message,
      tipus: 'ERROR',
      id
    });
  }
};