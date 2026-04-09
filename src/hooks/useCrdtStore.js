import { useSyncExternalStore, useRef, startTransition, useEffect } from 'react';

export function shallowEqual(objA, objB) {
  if (Object.is(objA, objB)) return true;
  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;
  for (let i = 0; i < keysA.length; i++) {
    if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || !Object.is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }
  return true;
}

// CRDTStore: Double Buffer + Versioning (Anti-storm)
class CRDTStore {
  constructor(ydoc) {
    this.ydoc = ydoc;
    this.listeners = new Set();
    this.version = 0;
    this.snapshot = this.computeSnapshot();
    this.pending = false;

    if (this.ydoc && typeof this.ydoc.on === 'function') {
      this.ydoc.on('update', this.onUpdate);
    }
  }

  onUpdate = () => {
    if (this.pending) return;
    this.pending = true;

    // requestAnimationFrame or microtask ensures batching
    queueMicrotask(() => {
      this.flush();
    });
  }

  flush() {
    this.pending = false;
    const nextSnapshot = this.computeSnapshot();

    // SOLO SI CAMBIA
    if (!shallowEqual(this.snapshot, nextSnapshot)) {
      this.snapshot = nextSnapshot;
      this.version++;
      
      startTransition(() => {
        this.listeners.forEach(l => l());
      });
    }
  }

  computeSnapshot() {
    if (!this.ydoc) return undefined;
    return this.ydoc.toJSON ? this.ydoc.toJSON() : this.ydoc;
  }

  getSnapshot = () => ({
    version: this.version,
    data: this.snapshot
  })

  subscribe = (cb) => {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  destroy() {
    if (this.ydoc && typeof this.ydoc.off === 'function') {
      this.ydoc.off('update', this.onUpdate);
    }
    this.listeners.clear();
  }
}

const storeCache = new Map();

function getOrCreateCRDTStore(doc) {
  if (!doc) return { subscribe: () => () => {}, getSnapshot: () => ({version: 0, data: undefined}), destroy: () => {} };
  
  if (!storeCache.has(doc)) {
     storeCache.set(doc, { store: new CRDTStore(doc), refCount: 0 });
  }
  return storeCache.get(doc);
}

export function useCrdtStore(doc, selector = (s) => s.data) {
  const cacheEntry = getOrCreateCRDTStore(doc);
  const store = cacheEntry.store || cacheEntry;
  const sliceRef = useRef();

  useEffect(() => {
      if (!doc) return;
      cacheEntry.refCount += 1;
      return () => {
          cacheEntry.refCount -= 1;
          if (cacheEntry.refCount <= 0) {
              cacheEntry.store.destroy();
              storeCache.delete(doc);
          }
      };
  }, [doc, cacheEntry]);

  return useSyncExternalStore(
    store.subscribe,
    () => {
      const globalSnapshot = store.getSnapshot();
      if (globalSnapshot.data === undefined) return undefined;
      
      const newSlice = selector(globalSnapshot);
      
      if (sliceRef.current !== undefined && shallowEqual(newSlice, sliceRef.current)) {
         return sliceRef.current;
      }
      
      sliceRef.current = newSlice;
      return newSlice;
    },
    () => {
      const snap = store.getSnapshot();
      return snap.data ? selector(snap) : undefined;
    }
  );
}
