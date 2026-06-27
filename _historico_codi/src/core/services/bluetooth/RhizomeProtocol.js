/**
 * Sóc de Poble - Rhizome Protocol
 * Capa Semántica de la Malla Física.
 * 
 * Define la estructura de paquetes, la prioridad QoS (Quality of Service) rural,
 * y el motor de reensamblado de vectores Yjs.
 */

// Tipos de Mensajes Yjs <-> Rhizome
export const MESSAGE_TYPES = {
  SYNC_STEP_1: 0x01, // Pido estado (Envío mi State Vector)
  SYNC_STEP_2: 0x02, // Te envío lo que te falta
  UPDATE: 0x03,      // Te envío mi delta nuevo (Push)
  AWARENESS: 0x04,   // Ping de supervivencia (Walkie-Talkie o Presencia)
};

// Criticidad (QoS Rural) -> Afecta al encolado
export const QOS_LEVELS = {
  CRITICAL: 100, // Incendios forestales, Emergencias médicas
  HIGH:     75,  // Alertas de Riego, Bandos urgentes
  NORMAL:   50,  // Mensajes de la plaza, Posts estándar
  LOW:      10,  // Logs, Analítica de sensores pasivos
};

/**
 * Ensures Yjs buffers are reassembled safely ignoring malformed/corrupted parts.
 * "Ensamblador Defensivo".
 */
export class ChunkReassembler {
  constructor() {
    this.bufferMap = new Map(); // messageId -> { chunks: [], total: N, received: N }
    this.cleanupInterval = setInterval(() => this._purgeStaleBuffers(), 60000); 
  }

  /**
   * Procesa un Chunk de BLE. 
   * Si tras procesarlo el mensaje está completo, lo devuelve ensamblado.
   * Si no, devuelve null.
   * 
   * @param {string} peerId 
   * @param {Uint8Array} chunkBuffer [2 bytes: index, 2 bytes: total, ... payload]
   */
  processChunk(peerId, chunkBuffer) {
    if (chunkBuffer.length < 4) return null; // Corrupto / Basura cósmica
    
    const dv = new DataView(chunkBuffer.buffer, chunkBuffer.byteOffset, 4);
    const chunkIndex = dv.getUint16(0, true);
    const totalChunks = dv.getUint16(2, true);
    
    // Simplificación extrema: asumiendo 1 mensaje concurrente por Peer.
    // En producción requiere un messageId global o en la cabecera (ex: uint32 msgId).
    const messageId = `${peerId}_sync`; 

    if (!this.bufferMap.has(messageId)) {
      this.bufferMap.set(messageId, {
        total: totalChunks,
        receivedCount: 0,
        chunks: new Array(totalChunks).fill(null),
        timestamp: Date.now()
      });
    }

    const state = this.bufferMap.get(messageId);
    state.timestamp = Date.now();

    // Guardar si no era duplicado (Evitar ataque de saturación)
    if (!state.chunks[chunkIndex]) {
      state.chunks[chunkIndex] = chunkBuffer.slice(4); // Extraer body
      state.receivedCount++;
    }

    // ¿Ensamblaje completado?
    if (state.receivedCount === state.total) {
      const fullBuffer = this._concatChunks(state.chunks);
      this.bufferMap.delete(messageId);
      return fullBuffer;
    }

    return null; // Aún faltan piezas
  }

  _concatChunks(chunksArray) {
    const totalSize = chunksArray.reduce((acc, chunk) => acc + chunk.length, 0);
    const result = new Uint8Array(totalSize);
    let offset = 0;
    for (const chunk of chunksArray) {
      result.set(chunk, offset);
      offset += chunk.length;
    }
    return result;
  }

  _purgeStaleBuffers() {
    // Si un mensaje lleva a medias más de 30 segundos, el peer remoto 
    // se ha alejado o la interferencia cortó la red. Purgamos memoria.
    const now = Date.now();
    for (const [msgId, state] of this.bufferMap.entries()) {
      if (now - state.timestamp > 30000) {
        console.warn(`[Rhizome/Reassembler] Purgando mensaje huérfano de ${msgId}.`);
        this.bufferMap.delete(msgId);
      }
    }
  }

  destroy() {
    clearInterval(this.cleanupInterval);
    this.bufferMap.clear();
  }
}
