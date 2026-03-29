import React, { useEffect, useState } from 'react';
import { usePowerSync } from '@powersync/react';
import { WifiOff, AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * WaitingForBackend - Fallback Boundary per indicar falta de connexió al servidor o errors persistents de Sync.
 * Ens mostrem només si Powersync ens diu que està connectant per problemes fora de local i hi ha canvis pendents
 * que no podem pujar.
 */
export function WaitingForBackend({ children }) {
  const powerSync = usePowerSync();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [hasPending, setHasPending] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    let unsubscribe = () => {};
    if (powerSync) {
        // Polling o event de pendent
        const checkPending = async () => {
            try {
                const status = powerSync.currentStatus;
                // Si la cua te elements, es que hi ha canvis pendents.
                const hasPendingData = status?.hasPendingData || false;
                setHasPending(hasPendingData);
            } catch (err) {
                console.debug('[WaitingForBackend] Error checking pending:', err);
            }
        };
        
        // Utilitzar els events del powerSync sdk per subsciure
        unsubscribe = powerSync.registerListener({
            statusChanged: (status) => {
                setHasPending(status.hasPendingData);
                // Utilitzar status per fallbacks de localStorage en cas d'error dur de desconnexió per hores
                if (status.lastSyncedAt) {
                    localStorage.setItem('sp_last_synced_at', status.lastSyncedAt.toISOString());
                }
            }
        });
        
        checkPending();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (unsubscribe) unsubscribe();
    };
  }, [powerSync]);

  return (
    <>
      {children}
      {isOffline && hasPending && (
        <div className="fixed bottom-[80px] left-1/2 -translate-x-1/2 z-50 bg-[#F97316] text-white px-4 py-2 rounded-full shadow-lg border border-white/20 flex items-center space-x-2 animate-bounce-subtle pointer-events-none">
          <WifiOff size={16} />
          <span className="text-xs font-bold whitespace-nowrap">Guardat en local. Esperant cobertura...</span>
        </div>
      )}
    </>
  );
}
