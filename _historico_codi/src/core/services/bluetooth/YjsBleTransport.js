import * as Y from 'yjs';
import { bluetoothManager } from './BluetoothManager.js';
import { ChunkReassembler } from './RhizomeProtocol.js';

/**
 * Sóc de Poble - Cepa "YjsBleTransport"
 * 
 * CORE DIRECTIVE: DTN Yjs CHUNKING
 * Este Provider se conecta al Documento Yjs raíz. Cuando ocurren mutaciones locales,
 * las extrae, las codifica a Uint8Array (Codificación Binaria V2 de Yjs), las *corta* agresivamente
 * para matar el problema del MTU limitado del Bluetooth, y encola la emisión.
 * 
 * MTU BLE seguro: 20 Bytes (Standard 4.0), 512 Bytes (BLE 5).
 * Por seguridad rural, asumimos 256 bytes con cabecera Rhizome -> 200 Bytes payload puro.
 */

const MAX_PAYLOAD_SIZE = 200; // Defensivo. Mejor lento y seguro que un paquete corrupto en el campo.

export class YjsBleTransport {
  constructor(doc, roomName = 'soc-de-poble-global') {
    this.doc = doc;
    this.roomName = roomName;
    this.isSynced = false;
    this.syncedPeers = new Set();
    
    // Cola Delay-Tolerant (DTN): Almacena Deltas codificados hasta que haya un dispositivo conectado.
    this.dtnQueue = []; 

    // Fragment Buffer temporal para ensamblar paquetes recibidos (peerId -> { totalChunks: N, received: [], etc })
    this.reassembler = new ChunkReassembler();

    // Arrancador
    this._connect();
  }

  _connect() {
    console.log('[Rhizome] YjsBleTransport Acoplado al Documento Raíz.');
    
    // 1. Escuchar Mutaciones Locales del Usuario
    this.doc.on('updateV2', this._handleLocalUpdate.bind(this));

    // 2. Escuchar Peticiones del Manager Bluetooth (Deltas Entrantes o Conexiones Nuevas)
    bluetoothManager.subscribe((event) => {
      if (event.type === 'peer_connected') {
        this._handlePeerConnected(event.data);
      } else if (event.type === 'data_received') {
        this._handlePeerData(event.data.peerId, event.data.payload);
      }
    });
  }

  /**
   * Cuando el usuario escribe el campo o muta un estado local,
   * Yjs lanza este update codificado en Uint8Array.
   */
  _handleLocalUpdate(update, origin) {
    // Evitar eco si el update vino de nosotros mismos inyectando lo que recibimos del Bluetooth.
    if (origin === this) return;

    // 1. Encola el delta en el cajón de "Pendientes DTN"
    // 2. Si hay Peers Conectados *ahora mismo*, iniciar el vaciado de cola (flushing).
    
    this.dtnQueue.push(update);
    console.log(`[Rhizome/DTN] Nuevo Vector Vectorial almacenado. Cola: ${this.dtnQueue.length} deltas.`);

    if (bluetoothManager.connectedPeers.size > 0) {
      this._flushDtnQueue();
    }
  }

  /**
   * Un nuevo vecino acaba de entrar en cobertura.
   * Debemos soltar nuestra cola de actualizaciones y enviarle nuestro "State Vector" para
   * forzar que él nos devuelva las partes que nos falten (Protocolo Sync Step 1).
   */
  _handlePeerConnected(peerId) {
    console.log(`[Rhizome/Yjs] Vecino ${peerId} detectado. Iniciando Sincronización StateVector.`);
    
    // Yjs protocol: Calcular el Estado que Yo Tengo (State Vector)
    const stateVector = Y.encodeStateVector(this.doc);
    
    // Envolverlo en un mensaje Rhizome de tipo "SYNC_STEP_1"
    const message = this._wrapSync1(stateVector);

    this._sendToPeerSafe(peerId, message);
    
    // Si teníamos cola pendiente, la vaciamos
    this._flushDtnQueue();
  }

  /**
   * Recibe Raw Data del Bluetooth y lo reconstituye si está fragmentado.
   */
  _handlePeerData(peerId, payloadUint8Array) {
    // La función RhizomeProtocol desencapsula la cabecera del chunk.
    const fullBuffer = this.reassembler.processChunk(peerId, payloadUint8Array);
    
    if (fullBuffer) {
      // El ensamblador ha recompuesto el mensaje completo!
      const messageType = fullBuffer[0];
      const payload = fullBuffer.slice(1);
      
      try {
        if (messageType === 1) { // SYNC_STEP_1
          // Responder enviando la diferencia (Sync Step 2)
          const sync2 = Y.encodeStateAsUpdateV2(this.doc, payload);
          this._sendToPeerSafe(peerId, this._wrapSync2(sync2));
        } else if (messageType === 2 || messageType === 3) { 
          // UPDATE o SYNC_STEP_2: Aplicar a la BD local
          Y.applyUpdateV2(this.doc, payload, this);
          console.log('[Rhizome/Yjs] RX Delta Aplicado Correctamente.');
        }
      } catch (err) {
        console.error('[Rhizome/Yjs] Error Crítico al aplicar Delta del DTN:', err);
      }
    }
  }

  /**
   * Vacía la cola DTN a todos los peers activos.
   */
  _flushDtnQueue() {
    if (this.dtnQueue.length === 0) return;

    // En Sóc de Poble, si enviamos rápido morimos.
    // Chunking y retardo de propagación intencional.
    
    const update = this.dtnQueue.shift(); // Saca el más antiguo
    const message = this._wrapUpdate(update);

    for (const [peerId] of bluetoothManager.connectedPeers) {
      this._sendToPeerSafe(peerId, message);
    }

    // Seguir vaciando si queda
    if (this.dtnQueue.length > 0) {
      setTimeout(() => this._flushDtnQueue(), 200); // 200ms sleep termal entre Deltas masivos
    }
  }

  /**
   * El troceador (Chunker). Si el Payload pesa 1MB (fotos en Base64 etc), 
   * lo corta de 200 en 200 bytes.
   */
  async _sendToPeerSafe(peerId, fullMessageBytes) {
    const totalChunks = Math.ceil(fullMessageBytes.length / MAX_PAYLOAD_SIZE);
    
    for (let currentChunk = 0; currentChunk < totalChunks; currentChunk++) {
      const slice = fullMessageBytes.slice(
        currentChunk * MAX_PAYLOAD_SIZE, 
        (currentChunk + 1) * MAX_PAYLOAD_SIZE
      );
      
      // Añadir la Micro-Cabecera de Ensamblaje:
      const frameBuffer = this._buildChunkHeader(currentChunk, totalChunks, slice);
      
      try {
        await bluetoothManager.rawWrite(peerId, frameBuffer);
      } catch (err) {
        console.error('[Rhizome/Chunker] Muerte por fallo Bluetooth al emitir frame:', err);
        // El protocolo requiere retry local. Detenemos bucle en entorno real.
        break; 
      }
    }
  }

  // --- Capa de Mensajería Primitiva (RhizomeProtocol delegates) ---
  _wrapSync1(stateVector) {
    // Tipo de Mensaje 1 = Sync Step 1
    const buffer = new Uint8Array(stateVector.length + 1);
    buffer[0] = 1; 
    buffer.set(stateVector, 1);
    return buffer;
  }

  _wrapSync2(updateArray) {
    // Tipo de Mensaje 2 = Sync Step 2 (Response dif delta)
    const buffer = new Uint8Array(updateArray.length + 1);
    buffer[0] = 2;
    buffer.set(updateArray, 1);
    return buffer;
  }

  _wrapUpdate(updateArray) {
    // Tipo de Mensaje 3 = Delta Update (Push espontáneo local)
    const buffer = new Uint8Array(updateArray.length + 1);
    buffer[0] = 3;
    buffer.set(updateArray, 1);
    return buffer;
  }

  _buildChunkHeader(chunkIndex, totalChunks, payloadData) {
    // Cabecera súper cruda: 4 bytes (2 para Índice, 2 para Total).
    // Usar Uint16 para soportar hasta 65,535 trozos por mensaje (13 MB max total file).
    const header = new Uint8Array(4);
    const dv = new DataView(header.buffer);
    dv.setUint16(0, chunkIndex, true); // little-endian
    dv.setUint16(2, totalChunks, true);

    const frame = new Uint8Array(header.length + payloadData.length);
    frame.set(header);
    frame.set(payloadData, header.length);

    return frame;
  }

  destroy() {
    this.doc.off('updateV2', this._handleLocalUpdate);
    // Dettach BluetoothManager
  }
}
