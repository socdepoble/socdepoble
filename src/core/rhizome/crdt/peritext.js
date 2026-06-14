/**
 * Peritext.js - Rich Text CRDT Layer [MASTER/FLASH]
 * Implements "Stable Anchors" for format preservation in offline rural environments.
 * 
 * Basat en: "Peritext: A General-Purpose Rich-Text CRDT" (Ink & Switch).
 */

import { logger } from '../../../utils/logger';
class Peritext {
  /**
   * Genera una àncora estable per a un caràcter o posició.
   * En Peritext, les àncores es lliguen a l'ID de l'operació que va inserir el caràcter.
   */
  createAnchor(opId, offset = 0, side = 'before') {
    return {
      opId,
      // ID de l'operació d'inserció del caràcter
      offset,
      // Offset relatiu si és un bloc
      side // 'before' o 'after' el caràcter
    };
  }

  /**
   * Defineix un interval de format (Mark).
   */
  createMark(startAnchor, endAnchor, type, value = true) {
    return {
      id: crypto.randomUUID(),
      start: startAnchor,
      end: endAnchor,
      type,
      // 'bold', 'italic', 'link', 'iaia-dict'
      value,
      timestamp: Date.now()
    };
  }

  /**
   * Resol la posició numèrica d'una àncora dins del text actual.
   * Aquesta és la clau de la resiliència: si el text es mou, l'àncora el segueix.
   */
  resolveAnchor(anchor, currentOperations) {
    // En una implementació completa, buscaríem l'operació 'opId' 
    // i calcularíem la seua posició actual sumant insercions posteriors.
    // Per al prototip v1, mapegem a la posició lògica guardada.
    const foundOp = currentOperations.find(op => op.id === anchor.opId);
    if (!foundOp) return 0;

    // Simulem el càlcul de posició real via Graph Walking (Eg-walker)
    return foundOp.index + (anchor.side === 'after' ? 1 : 0);
  }

  /**
   * Llei de la Intenció: Fusió de spans concurrents (Protocol Flash).
   */
  mergeSpans(localSpans, remoteSpans) {
    logger.log(`[Peritext] Fusionant ${remoteSpans.length} spans remots amb ${localSpans.length} locals...`);

    // Algoritme LWW (Last Write Wins)
    const combined = [...localSpans, ...remoteSpans];
    const unique = new Map();
    combined.forEach(span => {
      // Clau única basada en àncores per evitar duplicats semàntics
      const key = `${span.type}-${span.start.opId || span.start}-${span.end.opId || span.end}`;
      if (!unique.has(key) || unique.get(key).timestamp < span.timestamp) {
        unique.set(key, span);
      }
    });
    return Array.from(unique.values());
  }
}
export const peritext = new Peritext();