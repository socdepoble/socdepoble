import { useEffect, useRef, useCallback } from 'react';

const AntiTsunamiSync = () => {
  const syncQueue = useRef([]);
  const isSyncing = useRef(false);

  const processQueue = useCallback(function processQueueInternal() {
    if (isSyncing.current || syncQueue.current.length === 0) return;

    (window.requestIdleCallback || function(cb) { setTimeout(() => cb({ timeRemaining: () => 50 }), 1) })(() => {
      isSyncing.current = true;
      const batch = syncQueue.current.splice(0, 32); // 32 max
      
      // Sync batch
      batch.forEach(pacte => {
        // Mock IndexedDB insert
        // indexedDBInsert(pacte);
        // Garbage collect
        if (pacte.blobUrl) URL.revokeObjectURL(pacte.blobUrl);
      });

      isSyncing.current = false;
      if (syncQueue.current.length > 0) processQueueInternal();
    }, { timeout: 5000 });
  }, []);

  useEffect(() => {
    // Listener P2P incoming
    const handleIncoming = (e) => {
      syncQueue.current.push(e.detail);
      processQueue();
    };
    
    // Battery shield
    const pauseSync = () => {
      syncQueue.current = []; // Hard reset
    };

    window.addEventListener('pacte-incoming', handleIncoming);
    window.addEventListener('battery-low', pauseSync);

    return () => {
      window.removeEventListener('pacte-incoming', handleIncoming);
      window.removeEventListener('battery-low', pauseSync);
    };
  }, [processQueue]);

  return null; // Invisible
};

export default AntiTsunamiSync;
