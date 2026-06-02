import { useEffect } from 'react';

const CHECK_INTERVAL = 2 * 60 * 1000; // 2 minuts

export const useVersionWatchdog = () => {
  useEffect(() => {
    let intervalId;

    const checkVersion = async () => {
      // Només comprovem si tenim connexió
      if (!navigator.onLine) return;

      try {
        const res = await fetch('/version.json?t=' + Date.now(), { 
          method: 'HEAD', 
          cache: 'no-store',
          signal: AbortSignal.timeout(2000)
        });
        
        // Si el fetch passa, demanem la versió real
        if (res.ok) {
          const req = await fetch('/version.json?t=' + Date.now(), { cache: 'no-store' });
          const data = await req.json();
          
          const localVersion = localStorage.getItem('sdp_local_version');
          if (data.version && data.version !== localVersion) {
            console.info('[VersionWatchdog] Nova versió detectada en segon pla:', data.version);
            window.dispatchEvent(new CustomEvent('sdp:update-available', { detail: data }));
          }
        }
      } catch (err) {
        // Silenciós
      }
    };

    // Comprovació periòdica
    intervalId = setInterval(checkVersion, CHECK_INTERVAL);

    // Comprovació en tornar de BFCache o canvi de pestanya
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkVersion();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
};
