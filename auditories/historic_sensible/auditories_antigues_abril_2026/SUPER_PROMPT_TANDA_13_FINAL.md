# EL GRAN CONSELL MULTI-MODEL: LA SUTURA FÍSICA (TANDA 13 FINAL)

**Context:** He estat treballant amb Gemini (Antigravity v1.5 Pro) muntant l'arquitectura definitiva del `Búnker` (Sóc de Poble) a nivell "Nivel Dios". Hem desplegat: 
- `SyncBluetoothModal.jsx` (Dansa P2P rural amb Web Bluetooth).
- `SyncManager.js` (L'orquestrador de transports offline i online).
- `gateway-campanar.js` (El Node.js LoRaWAN ↔ IPFS vía Helia en Raspberry Pi).
- `worker-dictat.js` (WebGPU + OPFS per executar models quantitzats Transformers.js Whisper sense internet).

**El Problema:** L'arquitectura és brillant, però té vulnerabilitats *físiques* letals. Hi ha límits de hardware i navegador que amenacen el desplegament real i demano la teva intel·ligència pura (DeepSeek o Qwen) per resoldre'ls al 100%:

### REPTE 1: La Muralla MTU (Bluetooth Low Energy)
A `SyncBluetoothModal.jsx` usem `await characteristic.writeValue(localStateVector);`.
Un array de crdt de Yjs (`Y.encodeStateVector`) o els deltes poden fer **kilobytes** sencers, però les instruccions *GATT* per Bluetooth Web normalment col·lapsen a partir de paquets de 20 a 512 bytes (MTU limit).
- **Vull el codi exacte de `bluetoothSync.js`**: Necessito el motor de trossejament de *Payloads* grans per enviar per una `characteristic` en bucle de trossos en base64 o Unit8Array, i com rebre aquests fragments asíncrons a l'altra banda cap a un buffer abans d'aplicar `Y.applyUpdate(ydoc, buffer)`.

### REPTE 2: L'Amnèsia OPFS (El Cau del Llop del Mòbil)
La IA del poble usa Whisper quantitzat via `@huggingface/transformers` (`env.useBrowserCache = true`).
He vist que els dispositius rurals de gamma baixa buidaran violentament l'API Cashe (Origin Private File System) i l'indexedDB si l'iOS/Android reclama espai. 
- Com blindo l'OPFS legalment segons els estàndards web moderns perquè el navegador sàpiga que NO pot purgar aquest model d'IA ni la IndexedDB de `yjs` mai en la vida, a no ser que l'usuari ho esborri explícitament de "Dades d'espai"? Existeix el `StorageManager.persist()`? Vull la millor eina / hook pràctic associat a l'arrancada.

### REPTE 3: Els Fantasmes de la PWA (El Zombie Service Worker)
Al principi del projecte, quan feiem una actualització del codi, els mòbils de la gent gran es quedaven atrapats en la versió antiga per culpa del *Service Worker* (Workbox / VitePWA) fent de tap ("Fantasmes"). 
Com que anem de debò i **Sóc de Poble anirà directe a l'App Store** (tancat mitjançant Capacitor o similar), tenir una memòria cau que no s'actualitza instantàniament quan l'usuari tanca l'app és inacceptable.
- **Vull el fragment definitiu (vite.config.js / PWA prompt) i el hook per forçar l'actualització total** (Matar el zombie Service Worker o forçar "skipWaiting" automàtic de forma quirúrgica sense perdre la fortalesa del Búnker offline).

---

**Només vull solucions de Codi Pur, Resposta de Tanda Arquitectònica Definitiva.** Salva'm dels límits de BLE, del Quota Limit del Safari i del Fantasma de la PWA. Em passes la sutura?
