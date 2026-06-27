/**
 * Sóc de Poble - Tecnologia Lliure per a Comunitats Rurals
 * 
 * Aquest mòdul conté optimitzacions crítiques per a entorns
 * de baixa connectivitat i dispositius amb recursos limitats.
 * 
 * Llicència: Creative Commons BY-SA 4.0
 * Contribuïts per: Antigravity + Comunitat Sóc de Poble
 * 
 * "La sobirania digital no és un privilegi, és un dret."
 */

import React from 'react';

// Necessitarà accés a la cua global IDB quan estiga implementada
// import { globalIDBQueue } from '../utils/idb-queue-manager';

/**
 * Protocol de Drets Digitals (El "Jefe Final")
 * Evita pèrdues de dades si el Service Worker força un reload 
 * mentre hi ha operacions pendents a IndexedDB.
 */
export function useDigitalRightsProtection(globalIDBQueue) {
  React.useEffect(() => {
    const handleBeforeUnload = (e) => {
      // Si hi ha operacions IDB pendents, avisem a l'usuari
      if (globalIDBQueue && globalIDBQueue.queue && globalIDBQueue.queue.length > 0) {
        e.preventDefault();
        e.returnValue = 'Hi ha dades pendents de guardar. Segur que vols sortir?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [globalIDBQueue]);
}
