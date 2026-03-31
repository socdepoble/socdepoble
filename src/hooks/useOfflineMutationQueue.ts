import { enqueueMutation, clearQueue } from '../data/offline/mutation-queue';
import { broadcastMutation } from '../data/broadcast';

export function useOfflineMutationQueue() {

  const addMutation = async (entity: string, action: 'CREATE' | 'UPDATE' | 'DELETE', payload: any) => {
    // FIX: Entropía extrema para evitar colisiones en IndexedDB si falla crypto.
    const generateSafeFallbackId = () => `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Use standard crypto if available locally to generate consistent tempIds
    const tempId = payload.uuid || payload.id || (window.crypto && crypto.randomUUID ? crypto.randomUUID() : generateSafeFallbackId());
    
    // 1. Build outbox mutation
    const mutation = {
      id: tempId,
      entity,
      action,
      payload: { ...payload, uuid: tempId },
      createdAt: Date.now()
    };

    // 2. Persist to IndexedDB Outbox
    await enqueueMutation(mutation);

    // 3. Broadcast for optimistic UI in other tabs
    if (entity === 'posts' && action === 'CREATE') {
      broadcastMutation({ type: 'POST_CREATED', payload: { tempId, post: mutation.payload }});
    }

    // 4. Force Background Sync immediately (if online/supported)
    try {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({ type: 'SYNC_MUTATIONS' });
      } else if (navigator.serviceWorker && 'controller' in navigator.serviceWorker) {
        // Fallback or explicit SW registration triggering if needed
        navigator.serviceWorker.ready.then((reg: any) => {
          if (reg.sync) {
            reg.sync.register('sync-mutations').catch(console.warn);
          }
        });
      }
    } catch (e) {
      console.warn('Background sync trigger failed, leaving in queue', e);
    }

    return tempId;
  };

  // Useful for debug / cleanup
  const resetQueue = async () => {
    await clearQueue();
  }

  return { addMutation, resetQueue };
}
