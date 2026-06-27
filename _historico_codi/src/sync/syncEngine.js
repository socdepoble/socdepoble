import { openDB } from "idb";

const DB_NAME = "soc-poble-sync";
const STORE_QUEUE = "sync-queue";

let db;
let isSyncing = false;
let isOnline = navigator.onLine;

export async function initSyncEngine() {
  db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_QUEUE, { keyPath: "id" });
    },
  });

  window.addEventListener("online", () => {
    isOnline = true;
    processQueue();
  });

  window.addEventListener("offline", () => {
    isOnline = false;
  });

  document.addEventListener("visibilitychange", handleVisibility);
}

function handleVisibility() {
  if (document.hidden) pauseSync();
  else resumeSync();
}

export async function enqueue(op) {
  await db.put(STORE_QUEUE, {
    id: crypto.randomUUID(),
    payload: op,
    retries: 0,
    createdAt: Date.now(),
  });

  processQueue();
}

async function processQueue() {
  if (!isOnline || isSyncing) return;
  isSyncing = true;

  try {
    const txRead = db.transaction(STORE_QUEUE, "readonly");
    const items = await txRead.objectStore(STORE_QUEUE).getAll();

    for (const item of items) {
      if (!navigator.onLine) break;

      const backoffDelay = Math.min(1000 * Math.pow(2, item.retries), 30000);
      if (item.nextRetry && Date.now() < item.nextRetry) continue;
      
      let success = false;
      try {
        await sendToNetwork(item.payload);
        success = true;
      } catch {
        item.retries++;
        item.nextRetry = Date.now() + backoffDelay;
      }

      const txWrite = db.transaction(STORE_QUEUE, "readwrite");
      if (success || item.retries > 5) {
        await txWrite.objectStore(STORE_QUEUE).delete(item.id);
      } else {
        await txWrite.objectStore(STORE_QUEUE).put(item);
      }
      await txWrite.done;
    }
  } catch (err) {
    console.error("[GROK] Falla crítica en SyncEngine:", err);
  } finally {
    isSyncing = false;
  }
}

 
async function sendToNetwork(payload) {
  // aquí WebRTC / HTTP fallback
  return Promise.resolve();
}

function pauseSync() {
  isSyncing = true;
}

function resumeSync() {
  isSyncing = false;
  processQueue();
}

export async function pruneStorage() {
  const estimate = await navigator.storage.estimate();

  if (estimate.usage / estimate.quota > 0.7) {
    const cutoff = Date.now() - 7 * 86400000;
    const txRead = db.transaction(STORE_QUEUE, "readonly");
    const items = await txRead.objectStore(STORE_QUEUE).getAll();
    const toDelete = items.filter(item => item.createdAt < cutoff);

    if (toDelete.length === 0) return;
    
    const txWrite = db.transaction(STORE_QUEUE, "readwrite");
    await Promise.all(toDelete.map(item => txWrite.objectStore(STORE_QUEUE).delete(item.id)));
    await txWrite.done;
  }
}
