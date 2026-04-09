### Abast i supòsits tècnics
**Escollit**: implemento un **Dedicated Worker** en **TypeScript** (fàcil d’adaptar a `SharedWorker`) que processa un WAL (Write‑Ahead Log) emmagatzemat a **IndexedDB**, aplica operacions en **batches** amb **bloqueig optimista** per col·lisions, i inclou un **trigger de compactació Yjs** que serialitza l’estat (`Y.encodeStateAsUpdate`) i persisteix el snapshot a IDB abans de cridar `ydoc.destroy()` per alliberar memòria. Suposo que el Worker pot importar Yjs (o re‑crear un `Y.Doc` local) i que el WAL té entrades amb camp `version` per a l’optimistic locking. Explico decisions i punts on caldrà ajustar segons l’entorn concret (iPad A10, iOS15, PWA).

---

### Disseny resum
- **WAL object store**: object store `wal` amb entrades `{id, op, store, key, value, version, ts}`.
- **Batch apply**: llegir N entrades, agrupar per `store`, executar una **única transacció** per batch per reduir overhead.
- **Optimistic locking**: cada objecte té camp **_version**; l’update fa `WHERE version == expected` equivalent: llegim la versió, comparem, i fem `put` amb `version+1` dins la mateixa transacció; si no coincideix, marquem conflicte i re‑intentar amb backoff.
- **Compactació Yjs**: monitoratge periòdic; si la mida serialitzada o nombre d’updates supera llindar, fem `Y.encodeStateAsUpdate(ydoc)`, guardem snapshot a IDB (o SQLite si disponible), i `ydoc.destroy()` per evacuar memòria.
- **No bloqueig del Main Thread**: tot el treball pesat corre dins del Worker; IndexedDB és asíncron i no bloqueja.

---

### Codi complet del Worker Central de Dades (TypeScript)
```ts
// worker-data.ts (Dedicated Worker)
// Compilar amb tsc --lib DOM,ES2019 --target ES2019 --module ESNext
// Assumptions: Yjs està disponible com a importable en l'entorn del worker.
// Si no, caldrà fer importScripts o empaquetar amb rollup/webpack.

export type WalEntry = {
  id: number; // auto increment
  op: 'put' | 'del';
  store: string;
  key: IDBValidKey;
  value?: any;
  version?: number; // optimistic locking token
  ts: number;
};

const DB_NAME = 'sóc-de-poble-db';
const DB_VERSION = 1;
const WAL_STORE = 'wal';
const META_STORE = 'meta';
const DEFAULT_BATCH_SIZE = 50;
const MAX_RETRIES = 5;
const RETRY_BASE_MS = 50;
const Y_SNAPSHOT_THRESHOLD_BYTES = 64 * 1024; // ajustable
const Y_SNAPSHOT_MIN_UPDATES = 500; // ajustable

// --- Promisified IndexedDB helpers ---
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (ev) => {
      const db = req.result;
      if (!db.objectStoreNames.contains(WAL_STORE)) {
        db.createObjectStore(WAL_STORE, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, { keyPath: 'k' });
      }
      // Note: application stores (data stores) are created on demand by schema migration outside worker
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function idbTransaction(db: IDBDatabase, storeNames: string[], mode: IDBTransactionMode): IDBTransaction {
  return db.transaction(storeNames, mode);
}

function readWalBatch(db: IDBDatabase, batchSize: number): Promise<WalEntry[]> {
  return new Promise((resolve, reject) => {
    const tx = idbTransaction(db, [WAL_STORE], 'readonly');
    const store = tx.objectStore(WAL_STORE);
    const req = store.openCursor();
    const out: WalEntry[] = [];
    req.onsuccess = (e) => {
      const cur = (e.target as IDBRequest).result as IDBCursorWithValue | null;
      if (cur && out.length < batchSize) {
        out.push(cur.value as WalEntry);
        cur.continue();
      } else {
        resolve(out);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

function deleteWalEntries(db: IDBDatabase, ids: number[]): Promise<void> {
  return new Promise((resolve, reject) => {
    if (ids.length === 0) return resolve();
    const tx = idbTransaction(db, [WAL_STORE], 'readwrite');
    const store = tx.objectStore(WAL_STORE);
    for (const id of ids) store.delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Utility to get or create object store within a versioned DB is out of scope here.
// We assume application stores already exist. If not, schema migration must run in main thread.

async function applyBatch(db: IDBDatabase, batch: WalEntry[]): Promise<{applied: number; conflicts: WalEntry[]}> {
  if (batch.length === 0) return { applied: 0, conflicts: [] };

  // Group by target store to minimize transactions
  const groups = new Map<string, WalEntry[]>();
  for (const e of batch) {
    if (!groups.has(e.store)) groups.set(e.store, []);
    groups.get(e.store)!.push(e);
  }

  const conflicts: WalEntry[] = [];
  let applied = 0;

  // For each store, open a transaction that includes the store and WAL_STORE (for atomic delete)
  for (const [storeName, entries] of groups.entries()) {
    // We'll attempt to apply all entries for this store in a single transaction
    const tx = idbTransaction(db, [storeName, WAL_STORE], 'readwrite');
    const store = tx.objectStore(storeName);
    const walStore = tx.objectStore(WAL_STORE);

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);

      (async () => {
        for (const entry of entries) {
          try {
            if (entry.op === 'put') {
              // optimistic locking: read existing record's _version
              const getReq = store.get(entry.key);
              const existing = await reqToPromise(getReq);
              const existingVersion = existing?._version ?? 0;
              const expected = entry.version ?? existingVersion;

              if (existing && expected !== existingVersion) {
                // conflict detected
                conflicts.push(entry);
                continue;
              }
              const newRecord = { ...entry.value, _version: (existingVersion ?? 0) + 1 };
              store.put(newRecord, entry.key);
              // remove WAL entry
              walStore.delete(entry.id);
              applied++;
            } else if (entry.op === 'del') {
              // deletion with optimistic check
              const getReq = store.get(entry.key);
              const existing = await reqToPromise(getReq);
              const existingVersion = existing?._version ?? 0;
              const expected = entry.version ?? existingVersion;
              if (existing && expected !== existingVersion) {
                conflicts.push(entry);
                continue;
              }
              store.delete(entry.key);
              walStore.delete(entry.id);
              applied++;
            }
          } catch (err) {
            // transaction-level error will abort; push to conflicts to retry later
            conflicts.push(entry);
          }
        }
      })();
    });
  }

  return { applied, conflicts };
}

// Helper to convert IDBRequest to Promise
function reqToPromise<T>(req: IDBRequest): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result as T | undefined);
    req.onerror = () => reject(req.error);
  });
}

// Exponential backoff
function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

// --- Yjs snapshot and memory management ---
// We assume Yjs is importable as global Y
declare const Y: any;
let ydoc: any = null;
let yUpdateCount = 0;
let lastSnapshotTs = 0;

function attachYDoc(docName: string) {
  if (typeof Y === 'undefined') return;
  if (ydoc) return;
  ydoc = new Y.Doc();
  // Optionally load persisted state from IDB here
  yUpdateCount = 0;
}

// Serialize and persist snapshot
async function snapshotAndDestroy(db: IDBDatabase, docName: string) {
  if (!ydoc) return;
  try {
    const update = Y.encodeStateAsUpdate(ydoc);
    // Persist snapshot to META_STORE as base64 or Uint8Array
    const tx = idbTransaction(db, [META_STORE], 'readwrite');
    const meta = tx.objectStore(META_STORE);
    meta.put({ k: `y_snapshot_${docName}`, v: update, ts: Date.now() });
    await new Promise<void>((res, rej) => {
      tx.oncomplete = () => res();
      tx.onerror = () => rej(tx.error);
    });
    // Destroy to free memory
    ydoc.destroy();
    ydoc = null;
    yUpdateCount = 0;
    lastSnapshotTs = Date.now();
    postMessage({ type: 'y_snapshot_saved', docName, size: update?.byteLength ?? update?.length ?? 0 });
  } catch (err) {
    postMessage({ type: 'y_snapshot_error', error: String(err) });
  }
}

// Monitor heuristic: call periodically or after N updates
async function maybeCompactY(db: IDBDatabase, docName: string) {
  if (!ydoc) return;
  // Heuristic: if update count large or serialized size large
  try {
    const approx = Y.encodeStateAsUpdate(ydoc);
    const size = approx?.byteLength ?? approx?.length ?? 0;
    if (size >= Y_SNAPSHOT_THRESHOLD_BYTES || yUpdateCount >= Y_SNAPSHOT_MIN_UPDATES) {
      await snapshotAndDestroy(db, docName);
    }
  } catch (err) {
    // encoding may be expensive; ignore errors
  }
}

// --- Main WAL processing loop ---
let running = false;
let dbInstance: IDBDatabase | null = null;
let docName = 'default-doc';

async function startProcessing(batchSize = DEFAULT_BATCH_SIZE) {
  if (running) return;
  running = true;
  dbInstance = await openDB();
  attachYDoc(docName);

  while (running) {
    try {
      const batch = await readWalBatch(dbInstance, batchSize);
      if (batch.length === 0) {
        // idle: sleep a bit
        await sleep(200);
        continue;
      }

      // Try applying with retries for conflicts
      let toProcess = batch;
      let attempt = 0;
      const failedIds: number[] = [];
      while (toProcess.length > 0 && attempt < MAX_RETRIES) {
        const { applied, conflicts } = await applyBatch(dbInstance, toProcess);
        // notify progress
        postMessage({ type: 'batch_applied', applied, attempted: toProcess.length, attempt });
        if (conflicts.length === 0) break;
        // prepare retry: small backoff
        attempt++;
        await sleep(RETRY_BASE_MS * Math.pow(2, attempt));
        toProcess = conflicts;
      }

      // If still conflicts after retries, leave them in WAL and notify
      if (toProcess.length > 0) {
        postMessage({ type: 'batch_conflicts', count: toProcess.length, ids: toProcess.map(e => e.id) });
      }

      // After each batch, check Yjs memory heuristic
      await maybeCompactY(dbInstance, docName);
    } catch (err) {
      postMessage({ type: 'worker_error', error: String(err) });
      // On fatal error, wait and retry
      await sleep(500);
    }
  }
}

function stopProcessing() {
  running = false;
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}

// --- Message handling from main thread ---
self.onmessage = async (ev: MessageEvent) => {
  const msg = ev.data;
  switch (msg?.type) {
    case 'start':
      if (msg.docName) docName = msg.docName;
      startProcessing(msg.batchSize);
      postMessage({ type: 'started' });
      break;
    case 'stop':
      stopProcessing();
      postMessage({ type: 'stopped' });
      break;
    case 'attach_ydoc':
      // Optionally receive serialized state to initialize ydoc
      attachYDoc(msg.docName || docName);
      if (msg.state) {
        // apply state update
        if (!ydoc) attachYDoc(msg.docName || docName);
        Y.applyUpdate(ydoc, msg.state);
      }
      postMessage({ type: 'ydoc_attached' });
      break;
    case 'wal_push':
      // push a WAL entry into IDB (main thread could also write directly)
      try {
        const db = dbInstance ?? (await openDB());
        const tx = idbTransaction(db, [WAL_STORE], 'readwrite');
        const store = tx.objectStore(WAL_STORE);
        store.add(msg.entry);
        await new Promise<void>((res, rej) => {
          tx.oncomplete = () => res();
          tx.onerror = () => rej(tx.error);
        });
        postMessage({ type: 'wal_pushed' });
      } catch (err) {
        postMessage({ type: 'wal_push_error', error: String(err) });
      }
      break;
    case 'ydoc_update_applied':
      // main thread informs worker that Yjs received an update
      yUpdateCount++;
      break;
    case 'force_snapshot':
      if (dbInstance) await snapshotAndDestroy(dbInstance, docName);
      break;
    default:
      postMessage({ type: 'unknown_command', payload: msg });
  }
};
```

---

### Notes d’implementació i punts d’ajust
- **Creació d’object stores d’aplicació**: el worker assumeix que les object stores de dades ja existeixen. Si cal crear-les dinàmicament, cal fer una migració de versió (`onupgradeneeded`) amb coordinació del main thread.  
- **Optimistic locking**: s’usa un camp `_version` dins cada registre; l’operació comprova la versió abans de `put`. Si hi ha discrepància, l’entrada WAL es re‑intenta amb backoff. Aquesta estratègia és la més adequada quan hi ha més lectures que escriptures i evita bloquejos persistents.  
- **Yjs i serialització**: `Y.encodeStateAsUpdate(ydoc)` pot ser costós; el worker l’executa només quan la mida o el nombre d’updates supera llindars. Guardem el `Uint8Array` resultant a `META_STORE` o a SQLite si està disponible en l’entorn natiu.  
- **iOS 15 i limitacions**: iOS Safari té límits de memòria i comportaments agressius amb workers; testejar en dispositius reals i ajustar `Y_SNAPSHOT_THRESHOLD_BYTES` i `DEFAULT_BATCH_SIZE` per evitar OOM.  

### Breu valoració del Manifest de les 11
La declaració pública que prepareu per als agricultors i la gent gran ha de ser **clara, empàtica i pràctica**: expliqueu què fa la tecnologia en termes de beneficis reals (connectivitat local, dades persistents sense dependre de grans corporacions, autonomia), com es protegeix la seva privadesa i com poden usar-la sense por. El vostre treball tècnic —la persistència resilient i la gestió de memòria en dispositius antics— és la base que permet aquesta promesa; el Manifest ha de reflectir aquesta responsabilitat i oferir passos senzills per a l’adopció.  

---

Si voleu, adapto aquest Worker a `SharedWorker` o afegeixo una petita API de test per a provar el flux WAL en un iPad A10 amb iOS15 i valors de llindar recomanats per memòria.
