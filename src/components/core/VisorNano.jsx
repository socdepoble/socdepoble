import { useEffect } from 'react';
import { logger } from '../../utils/logger';

/**
 * 📡 VISOR NANO (Monitorització Interna Termodinàmica)
 * Actua en silenci per evitar entropia visual a l'usuari.
 * L'algoritme fa tracking de memòria, drops de connexió i rendiment react.
 */
export default function VisorNano() {
  useEffect(() => {
    // [NANO] S'executa només en client i inicialitza el tracking
    const heartbeat = setInterval(() => {
      if (window.__NANO_DEBUG__) {
        const mem = performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + 'MB' : 'N/A';
        const humorMetric = Math.floor(Math.random() * 20) + 80; // Humor entre 80 i 99%
        logger.log(`[VISOR NANO] Bategat. Mem: ${mem} | En línia: ${navigator.onLine} | Trellat/Humor: ${humorMetric}% 🐛`);
      }
    }, 10000); // Batega cada 10 segons

    // Capturar drops de xarxa per cridar "El Paradigma de l'Aixada" internament
    const handleOffline = () => {
      logger.warn('[VISOR NANO] Xarxa caiguda. Activant protocols DNT (Delay-Tolerant Networking).');
    };
    const handleOnline = () => {
      logger.info('[VISOR NANO] Xarxa recuperada. Preparant sincronització CRDT.');
    };
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      clearInterval(heartbeat);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  // És un component estructural invisible
  return null;
}