import { crc32 } from '../utils/crc32.js';
import { uuidToBytes } from '../utils/uuid.js';

// El RedTeam va indicar 32 bytes inicialment per error teòric, però els offsets
// dictaminen un buffer de 64 bytes reals abans del contingut binari.
const HEADER_SIZE = 64;

/**
 * Funció que envia chunk des d'IndexedDB sense carregar mai tot el blob a memòria.
 * Mode extrem tipus A10, control de fluxe amb RPC de JSON.
 * 
 * @param {WebSocket} ws El socket ja establert i negociat
 * @param {string} sessionId Sessio global d'exportació
 * @param {string} resourceId ID unívoc del recurs (per ex. una Imatge)
 * @param {Blob} blob Objecte binari pesat
 * @param {number} chunkIndex Index actual del paquet
 * @param {number} offset Posició actual de desplaçament
 * @param {number} chunkSize Tamany òptim per enviament WS (defecte 256KB)
 */
export async function sendBinaryChunk(
  ws,
  sessionId,
  resourceId,
  blob,
  chunkIndex,
  offset,
  chunkSize = 256 * 1024
) {
  const chunkBlob = blob.slice(offset, offset + chunkSize);
  const arrayBuffer = await chunkBlob.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);

  const header = new ArrayBuffer(HEADER_SIZE);
  const view = new DataView(header);

  // 0: Magic Header SDPB
  view.setUint32(0, 0x53445042, false);
  
  // 4: SessionID -> 16 bytes UUID
  const sessionBytes = uuidToBytes(sessionId);
  new Uint8Array(header, 4, 16).set(sessionBytes);
  
  // 20: ResourceID -> 16 bytes UUID
  const resBytes = uuidToBytes(resourceId);
  new Uint8Array(header, 20, 16).set(resBytes);

  // 36: Chunk Index
  view.setUint32(36, chunkIndex, false);
  
  // 40: Offset (64 bits per arxius grans)
  view.setBigUint64(40, BigInt(offset), false);
  
  // 48: Local Chunk Bytes Length
  view.setUint32(48, data.length, false);
  
  // 52: Total Blob Bytes
  view.setBigUint64(52, BigInt(blob.size), false);
  
  // 60: CRC32 per assegurar bit-rot i check de xarxa
  view.setUint32(60, crc32(data), false);

  // Concatenar Header + Data (Zero Còpies on Node environments si es fora possible, ací Uint8Array pre-allocat)
  const full = new Uint8Array(HEADER_SIZE + data.length);
  full.set(new Uint8Array(header), 0);
  full.set(data, HEADER_SIZE);

  // Fallback si el buffer del websocket està ofegat, backpressure clàssic.
  while (ws.bufferedAmount > 1024 * 1024) {
    await new Promise(r => setTimeout(r, 16)); // Alliberar loop
  }

  // Despatxar BINARY FRAME pur!
  ws.send(full);
}
