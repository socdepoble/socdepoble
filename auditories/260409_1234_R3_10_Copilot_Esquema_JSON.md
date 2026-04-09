### Esquema JSON complet per a **IndexedDB** (preparat per a multithreading / workers)

#### Principis bàsics
- **Object stores** separats per responsabilitat: `wal`, `shards`, `snapshots`, `shardIndex`, `lightSummaries`, `locks`, `audit`.
- **Access concurrència:** operacions d’escriptura i aplicació de WAL fetes per un **Worker** (Dedicated Worker o SharedWorker). UI usa `postMessage` / `BroadcastChannel` per coordinar.  
- **Transaccions curtes:** evitar transaccions llargues; fer append-only al WAL i marcar aplicat en transaccions petites.
- **Versionat:** `dbVersion` i migracions explícites.  
- **Integritat:** checksums (crc32) i signatures opcionals per a cada entrada WAL i snapshot.

---

#### Esquema (JSON) — stores i indexes

```json
{
  "name": "socdepoble-db",
  "version": 7,
  "objectStores": [
    {
      "name": "wal",
      "keyPath": "id",
      "autoIncrement": false,
      "indexes": [
        {"name":"byShardSeq","keyPath":["shard","seq"],"unique":true},
        {"name":"applied","keyPath":"applied","unique":false},
        {"name":"ts","keyPath":"ts","unique":false}
      ]
    },
    {
      "name": "shards",
      "keyPath": "shard",
      "autoIncrement": false,
      "indexes": [
        {"name":"lastSeq","keyPath":"meta.lastSeq","unique":false},
        {"name":"inMemory","keyPath":"meta.inMemory","unique":false}
      ]
    },
    {
      "name": "snapshots",
      "keyPath": "snapshotId",
      "autoIncrement": false,
      "indexes": [
        {"name":"shard","keyPath":"shard","unique":false},
        {"name":"ts","keyPath":"ts","unique":false}
      ]
    },
    {
      "name": "shardIndex",
      "keyPath": "id",
      "autoIncrement": false,
      "indexes": [
        {"name":"byShard","keyPath":"shard","unique":true}
      ]
    },
    {
      "name": "lightSummaries",
      "keyPath": "shard",
      "autoIncrement": false,
      "indexes": [
        {"name":"lastTouched","keyPath":"lastTouched","unique":false}
      ]
    },
    {
      "name": "locks",
      "keyPath": "resource",
      "autoIncrement": false
    },
    {
      "name": "audit",
      "keyPath": "auditId",
      "autoIncrement": false,
      "indexes": [
        {"name":"byMsgId","keyPath":"msgId","unique":false},
        {"name":"byTs","keyPath":"ts","unique":false}
      ]
    }
  ]
}
```

---

#### Estructures de dades (detall per store)

- **WAL entry (object store `wal`)**
```ts
interface WalEntry {
  id: string;                 // uuid v4
  shard: string;              // ex: "conversations"
  seq: number;                // monotònic per shard
  updateB64: string;          // Yjs update codificat base64
  ts: number;                 // epoch ms
  applied: boolean;           // false fins aplicar
  crc32?: string;             // integritat
  deviceId?: string;
  userId?: string;
  meta?: Record<string,string>;
}
```

- **Shard record (object store `shards`)**
```ts
interface ShardRecord {
  shard: string;              // keyPath
  meta: {
    lastSeq: number;
    lastSnapshotTs?: number;
    snapshotSizeBytes?: number;
    inMemory: boolean;
    memoryLastTouchedTs?: number;
    estimatedMemoryBytes?: number;
  };
  // opcional: small bootstrap state (head hash)
  headHash?: string;
}
```

- **Snapshot (object store `snapshots`)**
```ts
interface Snapshot {
  snapshotId: string;         // uuid
  shard: string;
  ts: number;
  stateB64: string;           // encodeStateAsUpdate -> base64
  sizeBytes: number;
  crc32?: string;
}
```

- **Light summary (object store `lightSummaries`)**
```ts
interface LightSummary {
  shard: string;
  lastTouched: number;
  preview: string;            // text preview, last message, counts
  counts: { messages?: number; contacts?: number; forms?: number };
}
```

- **Locks (object store `locks`)**
```ts
interface Lock {
  resource: string;           // ex: "wal-apply-conversations"
  owner: string;              // workerId
  ts: number;                 // acquired at
  ttl: number;                // ms
}
```

- **Audit (object store `audit`)**
```ts
interface Audit {
  auditId: string;
  msgId?: string;
  action: string;
  actor?: string;
  ts: number;
  hash?: string;
  note?: string;
}
```

---

#### Patrons de concurrència i multithreading

1. **Worker central d’aplicació WAL**
   - Un **SharedWorker** o **Dedicated Worker** s’encarrega d’aplicar WAL. UI només append al `wal` i notifica worker via `postMessage` o `BroadcastChannel`.
2. **Locking optimistic + TTL**
   - Worker intenta adquirir lock `locks` per shard amb `put` en transacció curta; si existeix i no caduca, reintenta amb backoff.
3. **Append-only UI**
   - UI **mai** aplica updates directament al `Y.Doc` global; escriu WAL i actualitza `lightSummaries` per a render immediat.
4. **Batch apply**
   - Worker llegeix `wal` per `shard` en batches (p. ex. 50 entrades), mergea updates i fa `Y.applyUpdate` en memòria, després marca `applied=true` en transacció curta.
5. **Evacuació segura**
   - Quan worker detecta memòria alta, escriu `shards[shard].meta.inMemory=false`, serialitza `encodeStateAsUpdate` a `snapshots` (si hi ha temps), fa `ydoc.destroy()` i elimina referències en memòria.

---

#### API d’accés (pseudocodi, patterns)

```ts
// UI thread: append WAL
async function appendWal(shard, updateUint8Array, meta) {
  const entry = {
    id: uuid(),
    shard,
    seq: await nextSeq(shard),
    updateB64: btoa(String.fromCharCode(...updateUint8Array)),
    ts: Date.now(),
    applied: false,
    meta
  };
  await idb.transaction(['wal','lightSummaries'],'readwrite', tx => {
    tx.objectStore('wal').put(entry);
    tx.objectStore('lightSummaries').put({ shard, lastTouched: Date.now(), preview: meta.preview, counts: meta.counts });
  });
  broadcast('wal-appended', { shard, id: entry.id });
}

// Worker: apply batch
async function workerApplyLoop() {
  while(true) {
    const shards = await idb.getAllShardsToProcess();
    for (const shard of shards) {
      if (!acquireLock(`wal-apply-${shard}`)) continue;
      const entries = await idb.readWalUnapplied(shard, 50);
      if (entries.length === 0) { releaseLock(...); continue; }
      const updates = entries.map(e => base64ToUint8(e.updateB64));
      const merged = mergeUpdates(updates);
      Y.applyUpdate(shardDocs[shard], merged);
      await idb.markApplied(entries.map(e=>e.id));
      releaseLock(...);
    }
    await sleep(200); // backoff
  }
}
```

---

#### Estratègia de compactació i snapshots nocturns
- **Trigger:** dispositiu en càrrega i inactiu o cron nocturn (configurable).  
- **Pasos:**  
  1. Worker bloqueja shard.  
  2. `encodeStateAsUpdate` -> `stateB64`.  
  3. Escriu `snapshots` amb `snapshotId`, `ts`, `stateB64`.  
  4. Trunca `wal` fins `lastSeq` (safe point).  
  5. Marca `shard.meta.lastSnapshotTs`.  
- **Nota:** fer compactació incremental per evitar picos de memòria: serialitzar en chunks i escriure a `snapshots` per parts.

---

### Arquitectura del **Wrapper natiu** (Capacitor / Swift) amb **CoreBluetooth** i **Codec2 WASM** per a fragmentació BLE

#### Objectiu
- Proporcionar **background reliability** (State Restoration), processament de Codec2 eficient i fragmentació/reassemblatge robust per MTU variables, amb persistència immediata i integritat.

---

#### Components principals (arquitectura)

1. **App Shell (Capacitor)**
   - WebView + UI; exposa API JS per a gravar, enviar i rebre missatges.
   - Plugin natiu `SDPVoicePlugin` (Swift) que encapsula tota la lògica BLE i codec.

2. **SDPVoicePlugin (Swift)**
   - **CoreBluetooth Manager** (CBCentralManager / CBPeripheralManager) amb `UIBackgroundModes: bluetooth-central, bluetooth-peripheral, audio`.
   - **Codec2 Engine**: WASM runtime embegut o binding a llibreria C si disponible (preferible: libcodec2 compilada per iOS).
   - **Chunker / Reassembler**: gestiona headers, seq, CRC, timeouts.
   - **Persistence Layer**: SQLite (WAL mode) o Realm per a cues i fragments; exposa API per a worker JS.
   - **Queue Manager**: priorització, retransmissions, backoff, dedup.
   - **State Restoration Handler**: implementa `centralManager(_:willRestoreState:)` i `peripheralManager(_:willRestoreState:)`.
   - **Security Module**: signatures, device keys, optional secure element usage.

3. **Worker Thread(s)**
   - **Audio capture thread**: baixa latència per a PCM.
   - **Codec thread**: encode/decode (WASM or native C) fora del main thread.
   - **BLE IO thread**: encola notifies/writes.

4. **Bridge JS ↔ Native**
   - Capacitor plugin exposa promeses i events: `recordSnippet()`, `sendSnippet()`, `onSnippetReceived`, `getQueueStatus()`.

5. **Optional Node External (ESP32)**
   - Actua com relay/antenna si no es vol confiar en background iOS; comunica amb iPad via BLE o Wi‑Fi local i amb la xarxa via WebSocket.

---

#### GATT profile i característiques (proposta)

- **Service UUID:** `0000SDP0-0000-1000-8000-00805f9b34fb`
- **Characteristics**
  - `TX` (Notify) UUID `0000SDP1-...` — chunks outbound
  - `RX` (Write) UUID `0000SDP2-...` — chunks inbound (Write With Response)
  - `CTRL` (Write/Notify) UUID `0000SDP3-...` — control messages (ACKs, NACKs, ping)
  - `META` (Read) UUID `0000SDP4-...` — small JSON metadata (optional)

**MTU & fragmentation**
- Negociar MTU al connect (p. ex. 512). Si MTU menor, fragmentar a `mtu - headerSize - footerSize`.
- Implementar **sliding window** amb ACKs per chunk (CTRL) per `msgId`.

---

#### Paquet BLE (binari) — format compacte (repetició resumida)

- **Header (12 bytes)**
  - magic (2), version (1), shardId (1), msgId (4 truncated), chunkIdx (1), chunkCount (1), flags (1), hdrCrc8 (1)
- **Payload** up to `MTU - 12 - 2` bytes (crc16)
- **Footer (2 bytes)** crc16(payload)

---

#### Flux operatiu (seqüència resumida)

1. **Gravació**
   - UI demana `SDPVoicePlugin.recordSnippet(durationMs)`.
   - Audio thread captura PCM 8kHz mono.
2. **Encode**
   - PCM -> codec2.encode() (WASM o C) en codec thread.
3. **Chunking**
   - Frames empaquetats en chunks amb header i crc.
4. **Persistència**
   - Cada chunk escrit immediatament a SQLite (status: pending).
   - Metadata WAL entry creat (shard: "voice", seq: N).
5. **Transmit**
   - BLE write/notify per chunk amb sliding window.
   - Esperar ACKs; retransmetre si timeout.
6. **Reassembly al receptor**
   - Receptor escriu chunks a SQLite, quan rep tots els chunks valida CRC i decodifica.
   - Emmagatzema snippet complet i notifica UI via `onSnippetReceived`.
7. **Forwarding**
   - Si node amb Internet disponible, plugin empra WebSocket o DataChannel per pujar snippet al Nodo Llavador.

---

#### Background i State Restoration (iOS specifics)
- Declarar `UIBackgroundModes` per `bluetooth-central` i `audio` si cal.  
- Implementar `centralManager(_:willRestoreState:)` per recuperar perifèrics i reprendre transfers.  
- Dissenyar per a **ventanes curtes**: processar i persistir ràpidament (escriure a SQLite) i delegar treball pesat a la següent reactivació completa de l’app.  
- Evitar dependre d’execució contínua; el patró és **event-driven + persistència immediata**.

---

#### Seguretat i integritat
- **Device identity:** generar parell de claus ECDSA per dispositiu; signar metadades i msgId.  
- **Encrypt on transport:** opcional capa AES-GCM per payload si la xarxa ho requereix; claus derivades per proximity pairing.  
- **Audit trail:** cada snippet té hash i entrada `audit` a IndexedDB/SQLite.

---

#### Optimitzacions per A10 / 2GB
- **Codec2** a 2400 bps o 1200 bps per reduir CPU.  
- **Snippet curt:** 1–3 s per snippet.  
- **Batching d’IO:** escriure chunks en grups per reduir syscall overhead.  
- **Throttle BLE:** duty cycle i backoff per estalviar bateria.

---

#### Estratègia de desplegament i actualitzacions
- **Distribució:** MDM comunitari o sideloading signat amb certificat local.  
- **OTA plugin:** actualitzacions del plugin natiu via MDM o mecanisme de descàrrega segura signada.  
- **Fallback ESP32:** si no es pot instal·lar wrapper, desplegar ESP32 com a antena local que fa el heavy lifting (codec2, BLE relay, WebSocket).

---

### Notes operatives finals i checklist d’implementació ràpida

- **IndexedDB**
  - Implementar SharedWorker per a `wal` apply loop.
  - Instrumentar memòria i exposar `evictShard(shard)` via API.
  - Provar compactació incremental en dispositius A10 reals.

- **Wrapper natiu**
  - Prioritzar binding natiu a `libcodec2` (C) per rendiment; fallback WASM si no és possible.
  - Implementar GATT profile i test de fragmentació amb MTU 185, 247, 512.
  - Testar State Restoration en iOS 15 amb escenaris: reboot, app killed, background wake.

- **Seguretat**
  - Generar i rotar claus per dispositiu; signar snapshots i WAL checkpoints.

---

Si vols, ara et genero **(1)** l’esquema SQL/DDL per a la base SQLite del plugin natiu (queues, chunks, messages, audit) o **(2)** el codi Swift complet del `SDPVoicePlugin` (esquelet amb handlers CoreBluetooth, encode pipeline i persistència). Quina prefereixes primer?
