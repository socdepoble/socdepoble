import { openDB, IDBPDatabase } from 'idb';
const DB_NAME = 'socdepoble_offline';
const STORE_NAME = 'mutation_queue';
export type Mutation = {
  id: string; // The mutation op_id (gen_random_uuid in JS)
  entity: string; // e.g., 'posts', 'likes'
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  payload: any;
  dependsOn?: string; // UUID of a parent mutation
  createdAt: number;
  failed?: boolean;
  errorDesc?: string;
};
let dbPromise: Promise<IDBPDatabase> | null = null;
export async function initDB() {
  if (typeof window === 'undefined') {
    return undefined; // Must return undefined to prevent SSR crashes and blind calls
  }
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, {
            keyPath: 'id'
          });
          store.createIndex('createdAt', 'createdAt');
        }
      },
      terminated() {
        // En caso de que el OS expulse la DB, la limpiamos del objeto global
        dbPromise = null;
      }
    }).catch(err => {
      dbPromise = null;
      throw err;
    });
  }
  return dbPromise;
}
export async function enqueueMutation(mutation: Mutation) {
  const db = await initDB();
  if (!db) return;

  // Límite duro para evitar DoS en IndexedDB
  const MAX_PENDING = 500;
  const pending = await getPendingMutations();
  if (pending.length >= MAX_PENDING) {
    const oldest = pending.find(m => m.entity === mutation.entity);
    if (oldest) await removeMutation(oldest.id);else return;
  }
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.objectStore(STORE_NAME).put(mutation);
  await tx.done;
}
export async function getPendingMutations(): Promise<Mutation[]> {
  const db = await initDB();
  if (!db) return [];
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const all = await store.index('createdAt').getAll();
  return all.filter(m => !m.failed);
}
export async function getFailedMutations(): Promise<Mutation[]> {
  const db = await initDB();
  if (!db) return [];
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const all = await store.index('createdAt').getAll();
  return all.filter(m => m.failed);
}
export async function getMutationById(id: string): Promise<Mutation | undefined> {
  const db = await initDB();
  if (!db) return undefined;
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  return store.get(id);
}
export async function removeMutation(id: string) {
  const db = await initDB();
  if (!db) return;
  // Transacción propia blindada con await tx.done
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.objectStore(STORE_NAME).delete(id);
  await tx.done;
}
export async function markMutationFailed(id: string, error: string) {
  const db = await initDB();
  if (!db) return;
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const mutation = await store.get(id);
  if (mutation) {
    mutation.failed = true;
    mutation.errorDesc = error;
    await store.put(mutation);
  }
  await tx.done;
}
export async function clearQueue() {
  const db = await initDB();
  if (!db) return;
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.objectStore(STORE_NAME).clear();
  await tx.done;
}
export async function resetMutationFailed(id: string) {
  const db = await initDB();
  if (!db) return;
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const mutation = await store.get(id);
  if (mutation) {
    delete mutation.failed;
    delete mutation.errorDesc;
    await store.put(mutation);
  }
  await tx.done;
}
export async function mergeIncomingCRDTs(mutations: Mutation[]) {
  const db = await initDB();
  if (!db) return;
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  for (const mut of mutations) {
    const existing = await store.get(mut.id);
    if (!existing) {
      // Inyección física directa
      await store.put(mut);
    } else {
      // Si ya existía, CRDT LWW-Register basado en timestamp
      if (mut.createdAt > existing.createdAt) {
        await store.put(mut);
      }
    }
  }
  await tx.done;
}