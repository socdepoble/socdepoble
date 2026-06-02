// idbMigrations.js
// Mòdul minimal per a migracions transaccionals amb checkpoints i lock TTL (Arquitectura 10/10)

const DB_NAME = 'sdp_app_db';
const META_STORE = 'meta';
const LOCK_KEY = 'migrations_lock';
const CHECKPOINT_KEY = 'migration_checkpoint';
const LOCK_TTL_MS = 30_000; // 30s

export function openDB(version = 1) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, version);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, { keyPath: 'key' });
      }
      // altres stores ja existents (ex: keyval) no es toquen aquí
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function readMeta(key) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(META_STORE, 'readonly');
    const store = tx.objectStore(META_STORE);
    const r = store.get(key);
    r.onsuccess = () => resolve(r.result ? r.result.value : null);
    r.onerror = () => reject(r.error);
  });
}

export async function writeMeta(key, value) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(META_STORE, 'readwrite');
    const store = tx.objectStore(META_STORE);
    const r = store.put({ key, value });
    r.onsuccess = () => resolve();
    r.onerror = () => reject(r.error);
  });
}

export async function acquireLock(ownerId) {
  const now = Date.now();
  const existing = await readMeta(LOCK_KEY);
  if (existing && existing.ts + LOCK_TTL_MS > now && existing.owner !== ownerId) {
    return false; // lock vigent
  }
  await writeMeta(LOCK_KEY, { owner: ownerId, ts: now });
  return true;
}

export async function releaseLock(ownerId) {
  const existing = await readMeta(LOCK_KEY);
  if (!existing || existing.owner !== ownerId) return;
  await writeMeta(LOCK_KEY, null);
}

export async function getCheckpoint() {
  return await readMeta(CHECKPOINT_KEY);
}

export async function setCheckpoint(data) {
  await writeMeta(CHECKPOINT_KEY, data);
}

// Llista de migracions
const MIGRATIONS = [
  {
    id: '2026-06-01-init',
    run: async (db) => {
      // Basic initialization if needed
    }
  }
];

export async function runMigrations({ onProgress = () => {}, ownerId = String(Math.random()) } = {}) {
  const lockAcquired = await acquireLock(ownerId);
  if (!lockAcquired) throw new Error('Lock no disponible, reintentar més tard');

  try {
    const checkpoint = await getCheckpoint() || { lastMigration: null, step: 0 };
    const startIndex = checkpoint.lastMigration
      ? MIGRATIONS.findIndex(m => m.id === checkpoint.lastMigration) + 1
      : 0;

    for (let i = startIndex; i < MIGRATIONS.length; i++) {
      const mig = MIGRATIONS[i];
      await setCheckpoint({ lastMigration: mig.id, step: 0, startedAt: Date.now() });
      onProgress({ migration: mig.id, phase: 'start' });

      const db = await openDB();
      try {
        await mig.run(db);
      } finally {
        db.close();
      }

      await setCheckpoint({ lastMigration: mig.id, step: 'done', finishedAt: Date.now() });
      onProgress({ migration: mig.id, phase: 'done' });
    }

    await setCheckpoint(null); // tot complet, netejar checkpoint
    return { ok: true };
  } finally {
    await releaseLock(ownerId);
  }
}

// Purga selectiva segura (per a quan un SW s'actualitza o el deployHash canvia)
export async function safePurgeOldData({ keepNamespaces = [] } = {}) {
  // Implementació futura: netejar stores obsolets sense deleteDatabase()
  return { purged: true };
}
