import { useState, useEffect, useRef } from 'react';

/**
 * [GATEKEEPER] OfflineGate
 * Proporciona context visual si no hi ha connexió a internet
 * i bloqueja funcionalitats segons les polítiques "LocalFirst".
 * En aquesta versió, afegim un Delay i PING real per a evitar falsos positius.
 */
export default function OfflineGate({ children }) {
  const [isOffline, setIsOffline] = useState(false);
  const checkTimeout = useRef(null);

  const verifyConnection = async () => {
    try {
      // Pinging a reliable 0-byte endpoint via no-cors to avoid CORS errors. 
      // If network works, promise completes (status 0). If network is actually down, fetch rejects.
      await fetch('https://clients3.google.com/generate_204', { 
        mode: 'no-cors', 
        cache: 'no-store'
      });
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      clearTimeout(checkTimeout.current);
      setIsOffline(false);
    };

    const handleOffline = () => {
      // Don't show immediately. Check first, and wait 2.5 seconds to avoid micro-cuts
      clearTimeout(checkTimeout.current);
      checkTimeout.current = setTimeout(async () => {
        const stillOnline = await verifyConnection();
        if (!stillOnline) {
          setIsOffline(true);
        } else {
          // False alarm
          setIsOffline(false);
        }
      }, 2500); 
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check (non-blocking)
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
        handleOffline();
    }

    return () => {
      clearTimeout(checkTimeout.current);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      {isOffline && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-max max-w-[90%] bg-red-600 text-white font-bold text-center text-[15px] py-3 px-6 rounded-[28px] shadow-lg z-dropdown animate-[bounce_2s_infinite]">
          Estàs fora de cobertura (Mode Offline actiu).
        </div>
      )}
      {children}
    </>
  );
}
