import React, { useState, useEffect } from 'react';

/**
 * [GATEKEEPER] OfflineGate
 * Proporciona context visual si no hi ha connexió a internet
 * i bloqueja funcionalitats segons les polítiques "LocalFirst".
 * En aquesta versió bàsica, només avisa visualment al top però deixa renderitzar.
 */
export default function OfflineGate({ children }) {
  const [isOffline, setIsOffline] = useState(() => 
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      {isOffline && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-max max-w-[90%] bg-red-600 text-white font-bold text-center text-[15px] py-3 px-6 rounded-[28px] shadow-lg z-[100] animate-[bounce_2s_infinite]">
          Estàs fora de cobertura (Mode Offline actiu).
        </div>
      )}
      {children}
    </>
  );
}
