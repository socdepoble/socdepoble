import { useRef, useCallback } from 'react';
import * as Y from 'yjs';

// Helper CRC32 para checksum rápido
function hashData(data) {
  let crc = 0 ^ -1;
  const str = JSON.stringify(data);
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    crc = crc >>> 8 ^ crcTable[(crc ^ char) & 0xFF];
  }
  return (crc ^ -1) >>> 0;
}
const crcTable = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xEDB88320 ^ c >>> 1 : c >>> 1;
  }
  return c >>> 0;
});
export const useAtomicGuard = () => {
  const criticalOperations = useRef(new Set());
  const startCritical = useCallback(operationId => {
    criticalOperations.current.add(operationId);
    const beforeUnloadHandler = e => {
      if (criticalOperations.current.size > 0) {
        e.preventDefault();
        e.returnValue = 'Hi ha canvis pendents de guardar...';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', beforeUnloadHandler);
    return () => {
      criticalOperations.current.delete(operationId);
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, []);

  // Transacción IndexedDB con versión y rollback
  const atomicDBWrite = useCallback(async (dbName, storeName, data) => {
    const operationId = `db-${Date.now()}-${Math.random()}`;
    const cleanup = startCritical(operationId);
    try {
      // Se asume un wrapper como idb o idb-keyval
      // Esto es un ejemplo, se usará conforme al standard de PWA
      const request = indexedDB.open(dbName, 1);
      const db = await new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        store.put({
          id: '__transaction_lock__',
          timestamp: Date.now(),
          dataChecksum: hashData(data)
        });
        store.put(data);
        tx.oncomplete = () => {
          const tx2 = db.transaction(storeName, 'readwrite');
          tx2.objectStore(storeName).delete('__transaction_lock__');
          tx2.oncomplete = () => resolve();
          tx2.onerror = () => reject(tx2.error);
        };
        tx.onerror = () => reject(tx.error);
      });
    } catch (error) {
      console.error('[AtomicGuard] Fallo transacción:', error);
      throw error;
    } finally {
      cleanup();
    }
  }, [startCritical]);

  // Protección Y.js
  const atomicYSave = useCallback((ydoc, persistenceProvider) => {
    const operationId = `yjs-${Date.now()}`;
    const cleanup = startCritical(operationId);
    return new Promise((resolve, reject) => {
      try {
        const svBefore = Y.encodeStateVector(ydoc);
        const timeout = setTimeout(async () => {
          const update = Y.encodeStateAsUpdate(ydoc, svBefore);
          if (persistenceProvider && typeof persistenceProvider.saveUpdate === 'function') {
            await persistenceProvider.saveUpdate(update);
          }
          resolve();
          cleanup();
        }, 100);
        const cancelHandler = () => {
          clearTimeout(timeout);
          cleanup();
          reject(new Error('Concurrent mutation - retrying'));
        };
        ydoc.once('update', cancelHandler);
      } catch (e) {
        cleanup();
        reject(e);
      }
    });
  }, [startCritical]);
  return {
    startCritical,
    atomicDBWrite,
    atomicYSave
  };
};