import { useState, useEffect } from 'react';

/**
 * Hook per detectar dispositius de gamma baixa (low-end) i ajustos de rendiment.
 * Utilitza l'API de memòria del dispositiu, concurrència del maquinari i tipus de connexió.
 */
export const useLowEndDevice = () => {
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      let lowMemory = false;
      let lowCores = false;
      let slowConnection = false;

      // Safe checks format per compatibilitat de navegadors
      if ('deviceMemory' in navigator) {
        lowMemory = navigator.deviceMemory < 4;
      }
      
      if ('hardwareConcurrency' in navigator) {
        lowCores = navigator.hardwareConcurrency < 4;
      }
      
      if ('connection' in navigator) {
        const connection = navigator.connection;
        slowConnection = connection.effectiveType === '2g' || connection.effectiveType === '3g';
      }

      setIsLowEnd(lowMemory || lowCores || slowConnection);
    };

    checkDevice();
    window.addEventListener('online', checkDevice);
    return () => window.removeEventListener('online', checkDevice);
  }, []);

  return isLowEnd;
};
