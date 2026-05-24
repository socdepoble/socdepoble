import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import { createHelia } from 'helia';
import { unixfs } from '@helia/unixfs';
import { gossipsub } from '@chainsafe/libp2p-gossipsub';
import * as Y from 'yjs';
import zlib from 'zlib';

async function encendreSentinel() {
  console.log("🔔 [CAMPANAR] Despertant el Gateway LoRa ↔ IPFS...");

  // 1. INICIALITZAR NODE IPFS GLOBAL (Helia)
  const helia = await createHelia({
    libp2p: { services: { pubsub: gossipsub() } }
  });
  const fs = unixfs(helia);
  console.log(`🌍 [IPFS] Arrelat al món. Node ID: ${helia.libp2p.peerId.toString()}`);

  // Base de dades Mestra del Campanar (L'Arxiu de la Vall)
  const ydocCampanar = new Y.Doc();

  // 2. ESCOLTAR RÀDIO LoRa VIA UART
  // Nota: '/dev/ttyS0' sol ser el port sèrie HAT GPIO de la Raspberry Pi
  const port = new SerialPort({ path: '/dev/ttyS0', baudRate: 115200 });
  const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

  // Buffer per reensamblar els fragments de LoRa
  const bufferPaquets = new Map(); 

  console.log("📻 [LoRa] Escoltant ecos de la vall a 868MHz...");

  parser.on('data', async (linia) => {
    try {
      // Format esperat de la Bústia ESP32: LORA:MSG_ID:TOTAL_FRAGMENTS:INDEX:PAYLOAD_BASE64
      const regex = /^LORA:(.+):(\d+):(\d+):(.+)$/;
      const match = linia.trim().match(regex);
      if (!match) return;

      const [ , msgId, totalStr, indexStr, payload64 ] = match;
      const total = parseInt(totalStr, 10);
      const index = parseInt(indexStr, 10);

      if (!bufferPaquets.has(msgId)) {
        bufferPaquets.set(msgId, new Array(total));
      }
      bufferPaquets.get(msgId)[index] = payload64;

      const fragments = bufferPaquets.get(msgId);
      
      // Hem recollit tots els fragments del Delta aeri?
      if (fragments.filter(Boolean).length === total) {
        console.log(`📦 [LoRa] Delta sencer rebut (ID: ${msgId}). Acoblant...`);
        
        // 3. DESCOMPRIMIR I FUSIONAR (Zlib + Yjs)
        const compressedDelta = Buffer.from(fragments.join(''), 'base64');
        const rawDelta = zlib.inflateSync(compressedDelta);
        const updateBin = new Uint8Array(rawDelta);
        
        bufferPaquets.delete(msgId); // Alliberem RAM

        Y.applyUpdate(ydocCampanar, updateBin);
        console.log("🧬 [YJS] Llinatge genètic del poble actualitzat. Sense conflictes.");

        // 4. ETERNITAT: FIXAR A IPFS
        const estatComplet = Y.encodeStateAsUpdate(ydocCampanar);
        const cid = await fs.addBytes(estatComplet);
        console.log(`⚓ [IPFS] Patrimoni arrelat globalment. Nou CID: ${cid.toString()}`);

        // 5. RADIAR A LA DIÀSPORA
        // Avisem als arxius comarcals/universitats via PubSub
        try {
            await helia.libp2p.services.pubsub.publish(
              'soc-de-poble-diaspora',
              new TextEncoder().encode(JSON.stringify({
                tipus: 'nou_delta',
                origen: 'campanar-principal',
                cid: cid.toString()
              }))
            );
        } catch (e) {
            console.warn('⚠️ [IPFS] No s\'ha pogut publicar per PubSub a la Diàspora. Continuant...', e.message);
        }
      }
    } catch (err) {
      console.error('❌ [ERROR RÀDIO] Soroll atmosfèric o paquet corrupte:', err.message);
    }
  });
}

encendreSentinel().catch(err => {
    console.error("Fallo crític iniciant el Campanar:", err);
});
