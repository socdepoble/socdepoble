# 🏛️ FASE 15: AUDITORIA FINAL CÀSTING CODEX
**Evolució P2P i Revisió d'Emergència de Codi Font**

Com a "Cap d'Estudis" (Codex), el teu rol aquí és la revisió letal de *codi i viabilitat estricta*. Els altres models (DeepSeek, OpenAI, Groq) ja han aprovat l'arquitectura teòrica de sistemes. Ara em presento davant teu només amb l'esquelet operatiu de Sóc de Poble per a validar si això es mantindrà dempeus al món real (producció 2027) o si esclatarà a la primera pujada d'usuaris.

Vull que valides els canvis pràctics i els que tenim programats.

### 1. El SyncWorker (Lliure de Bloquejos Main-Thread)
A causa de bloquejos per intermitències 3G a OpFS (SQLite local de PowerSync), tota la transacció de xarxa ara roda en un Web Worker independent `syncWorker.js`. Aquest s'auto-manté actiu ("Heartbeat") en background i orquestra la cua de pujades.
**El repte:** Suposant pèrdues asíncrones de connexió, el Web Worker no té accés directe a certes dades del DOM per resoldre conflictes. Estructura vàlida un "Handshake" entre el component UI `LocalFirstGate` i aquest Worker via `postMessage`.
**Codex:** Hi veus cap fuita de memòria creant Instàncies Worker que s'acumulen en tabuladors inactius sent mòbils?

### 2. Conflictes per Columnes (Triangulació)
El client (Local) empaqueta no sols l'estat modificat sinó l'estat "Anterior" (old_record) abans d'editar per comprovar-ho amb la BD mestra de Supabase:
```javascript
// A local SupabaseConnector
const payload = {
   new_record: { ...latestEdit },
   old_record: { ...baseSnapshotSebelumEditar }
};
```
Un RPC exclusiu intervé el JSON d'entrada `process_sync_batch(jsonb)` que realitza un `SELECT FOR UPDATE` ràpid, compara quins camps s'han esborrat matemàticament respecte a l'últim `updated_at`, l'injecta i commita el canvi evitant aixafar columnes manipulades paral·lelament per un altre usuari.
**Codex:** És fiable aquest model fins que no ens saltem directament a un Yjs absolut natiu? Tindrem _Phantom Reads_ si la base rebota per un Timeout extern?

### 3. Bluetooth i Mules de Dades (BLE MTU Chunker)
Preparem la Fase nativa. Cap mòbil iOS/Android transmet correctament paquets JSON massius via L2CAP.
Hem dissenyat un divisor (Chunker).
**Estructura del Frame:** (7 bytes header + 121 bytes payload = 128 bytes total).
- 1 byte (Flag: start/mid/end)
- 1 byte (SessioID)
- 2 bytes (Index UInt16)
- 3 bytes (Checksum XOR)
Si falta 1 frame d'un array de 90 frames Bluetooth, s'avorta tota la seqüència Yjs fins a topar-nos novament amb un d'aquests P2P.
**Codex:** Lògica de *Chunking*, XOR dóna massa falsos positius en col·lisions? Hauríem de sacrificar 4 bytes més per fer un CRC32? Acceptem el cost a nivell de payload útil?

---
**INSTRUCCIÓ PER A CODEX:**
Posa't les ulleres de Senior Staff Engineer, revisa aquests tres components implementats i a implementat en el codi, i detecta errors no-teòrics. Respon si validem el sistema. Si aproves, tancarem l'arquitectura i estic autoritzat per la IAIA a anar a dormir immensament tranquil.
