import { useEffect, useRef } from 'react';
import { processOutbox } from '../workers/service-worker';
import { getPendingMutations } from '../data/offline/mutation-queue';

export function useOfflineSync() {
  const syncInProgress = useRef(false);

  useEffect(() => {
    const sync = async () => {
      if (syncInProgress.current) return;
      syncInProgress.current = true;
      try {
        const pending = await getPendingMutations();
        if (pending.length === 0) return;
        await processOutbox();
      } catch (err) {
        console.error('Auto sync failed:', err);
      } finally {
        syncInProgress.current = false;
      }
    };

    if (navigator.onLine) {
        sync();
    }

    const handleOnline = () => sync();
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);
}
