import { useEffect, useRef, useState, useCallback } from 'react';
import { supabaseService } from '../services/supabaseService';

export function useWorkerOrchestrator() {
  const workerRef = useRef(null);
  const [syncState, setSyncState] = useState(navigator.onLine ? 'online' : 'offline');
  const [pendingCount, setPendingCount] = useState(0);

  // Inicialitzar el Web Worker dedicat a PowerSync
  useEffect(() => {
    // Es recomana instanciar el worker amb el motor Vite
    workerRef.current = new Worker(new URL('../workers/syncWorker.js', import.meta.url), {
      type: 'module',
    });

    const w = workerRef.current;

    w.onmessage = (e) => {
      const { type, payload } = e.data;
      switch (type) {
        case 'SYNC_STATE_CHANGED':
          setSyncState(payload.status);
          break;
        case 'SYNC_PROGRESS':
          setPendingCount(payload.count);
          break;
        case 'SYNC_ERROR':
          console.error('[WorkerOrchestrator] Error en la freqüència de Sincronització:', payload.error);
          setSyncState('error');
          break;
        default:
          break;
      }
    };

    return () => {
      w.terminate();
    };
  }, []);

  // Monitoritzar la xarxa (Crua veritat rural)
  useEffect(() => {
    const handleOnline = () => {
      setSyncState('connecting');
      workerRef.current?.postMessage({
        type: 'HEARTBEAT_NETWORK',
        payload: { isOnline: true },
      });
    };

    const handleOffline = () => {
      setSyncState('offline');
      workerRef.current?.postMessage({
        type: 'HEARTBEAT_NETWORK',
        payload: { isOnline: false },
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Estat inicial del navegador
    if (navigator.onLine) {
      handleOnline();
    } else {
      handleOffline();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Monitoritzar els canvis d'Autenticació Suprema de Supabase (Refresc JWT al vol)
  useEffect(() => {
    const checkToken = async () => {
      try {
        const { data: { session } } = await supabaseService.supabase.auth.getSession();
        if (session?.access_token) {
          workerRef.current?.postMessage({
            type: 'HEARTBEAT_AUTH',
            payload: { token: session.access_token },
          });
        }
      } catch (err) {
        console.debug('WorkerOrchestrator no pot llegir sessió inicial:', err);
      }
    };
    
    checkToken();

    const { data: { subscription } } = supabaseService.supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.access_token) {
          workerRef.current?.postMessage({
            type: 'HEARTBEAT_AUTH',
            payload: { token: session.access_token },
          });
        } else if (event === 'SIGNED_OUT') {
          workerRef.current?.postMessage({ type: 'HEARTBEAT_AUTH_KILL' });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const triggerManualSync = useCallback(() => {
    workerRef.current?.postMessage({ type: 'MANUAL_SYNC_TRIGGER' });
  }, []);

  return {
    syncState,
    pendingCount,
    triggerManualSync
  };
}
