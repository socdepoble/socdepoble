import * as Y from 'yjs';

// 100 bytes és indestructible fins i tot per a mòbils Android antics (BLE 4.0)
const CHUNK_SIZE = 100; 
// 6 bytes originals + 1 byte de Checksum = 7
const HEADER_SIZE = 7;

// ==========================================
// 🧮 FUNCIONS DE CHECKSUM
// ==========================================
function calculateChecksum(data) {
  let checksum = 0;
  for (let i = 0; i < data.length; i++) {
    checksum ^= data[i];
  }
  return checksum;
}

// ==========================================
// 📤 1. EMISSOR (Talla i dispara)
// ==========================================
export async function enviarDeltaBLE(characteristic, updateBin) {
  const totalChunks = Math.ceil(updateBin.length / CHUNK_SIZE);
  const msgId = Math.floor(Math.random() * 65536); // ID de sessió únic (16 bits)

  console.log(`📡 [BLE] Trossejant Delta de ${updateBin.length}b en ${totalChunks} paquets (ID: ${msgId})...`);

  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, updateBin.length);
    const chunkData = updateBin.subarray(start, end);

    // Preparem la trama de memòria contigua: Capçalera (7b) + Payload
    const payload = new Uint8Array(HEADER_SIZE + chunkData.length);
    const view = new DataView(payload.buffer);
    
    view.setUint16(0, msgId, true);       // Byte 0-1: ID del Missatge (Little-endian)
    view.setUint16(2, totalChunks, true); // Byte 2-3: Total de Fragments
    view.setUint16(4, i, true);           // Byte 4-5: Índex actual
    
    // Calculem el checksum del fragment (payload)
    const checksum = calculateChecksum(chunkData);
    view.setUint8(6, checksum);           // Byte 6: Checksum (8 bits)

    payload.set(chunkData, HEADER_SIZE);

    // CRÍTIC: writeValueWithResponse força el xip remot a enviar un ACK a nivell hardware.
    // Això evita desbordar la cua de transmissió (TX) de la ràdio Bluetooth.
    if (characteristic.writeValueWithResponse) {
      await characteristic.writeValueWithResponse(payload);
    } else {
      await characteristic.writeValue(payload); // Fallback per APIs antigues
    }
  }
  console.log(`✅ [BLE] Transmissió completada amb èxit (ID: ${msgId}).`);
}

// ==========================================
// 📥 2. RECEPTOR (Buffer d'Acoblament Asíncron)
// ==========================================
const rxBuffers = new Map();

export function rebreDeltaBLE(event, ydoc) {
  const dataView = event.target.value; 
  if (dataView.byteLength < HEADER_SIZE) return; // Soroll atmosfèric

  const msgId = dataView.getUint16(0, true);
  const totalChunks = dataView.getUint16(2, true);
  const chunkIndex = dataView.getUint16(4, true);
  const receivedChecksum = dataView.getUint8(6);

  // Extraiem només l'ADN del CRDT, deixant enrere la capçalera
  const payload = new Uint8Array(dataView.buffer, dataView.byteOffset + HEADER_SIZE, dataView.byteLength - HEADER_SIZE);

  // 🛡 CHECKSUM VERIFICATION (Fissura A)
  const calculatedChecksum = calculateChecksum(payload);
  if (receivedChecksum !== calculatedChecksum) {
    console.error(`❌ [BLE] Corrupció detectada al chunk ${chunkIndex} (ID: ${msgId}). Drop payload.`);
    return; // Baixem l'escut, refusem la puré genètica
  }

  if (!rxBuffers.has(msgId)) {
    rxBuffers.set(msgId, new Array(totalChunks).fill(null));
  }

  const bufferArray = rxBuffers.get(msgId);
  bufferArray[chunkIndex] = payload;

  // Hem rebut totes les peces del trencaclosques?
  if (bufferArray.every(chunk => chunk !== null)) {
    console.log(`🧩 [BLE] Delta complet rebut (ID: ${msgId}). Reensamblant...`);
    
    const totalLength = bufferArray.reduce((acc, chunk) => acc + chunk.length, 0);
    const fullUpdate = new Uint8Array(totalLength);
    
    let offset = 0;
    for (const chunk of bufferArray) {
      fullUpdate.set(chunk, offset);
      offset += chunk.length;
    }

    rxBuffers.delete(msgId); // Buidem la RAM immediatament
    
    // 🧬 FUSIÓ CRDT: Injecció al document Yjs local
    try {
      Y.applyUpdate(ydoc, fullUpdate);
      console.log(`💾 [YJS] Llinatge genètic del poble suturat.`);
    } catch (err) {
      console.error(`❌ [YJS] Error crític aplicant el delta al document`, err);
    }
  }
}
