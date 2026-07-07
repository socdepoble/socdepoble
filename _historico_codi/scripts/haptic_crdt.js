/**
 * [HOMEÒSTASI FÍSICA] Embolcall Hàptic d'Ordre Superior per a CRDTs
 * Entorn: Exclusivament Main Thread (DOM / UI).
 * Objectiu: Garantir la percepció biològica de l'estat local a l'horta (Sol cegador / Mans aspres).
 */

const PatronsHaptics = {
  // Feature Detection defensiu. Evita col·lapses fatals en dispositius que no ho suporten (iOS antics).
  suportat: () => typeof navigator !== 'undefined' && 'vibrate' in navigator,
  
  // [Saó Òptima]: Un toc sec, aspre i atòmic de 40ms. (L'assentament de la pedra).
  exit: () => PatronsHaptics.suportat() && navigator.vibrate(40),
  
  // [Resolució ASI]: Batec asimètric (30ms-50ms-30ms). L'Agent ha resolt un conflicte LWW de fons.
  merge_conflicte: () => PatronsHaptics.suportat() && navigator.vibrate([30, 50, 30]),
  
  // [Fricció Estructural]: Impactes greus i pesats. Fallida de base de dades (Quota excedida, etc).
  error: () => PatronsHaptics.suportat() && navigator.vibrate([200, 100, 200, 100, 400])
};

/**
 * Patró Decorador (Wrapper) pur Vanilla JS.
 * @param {Function} funcioMutacioCRDT - La funció asíncrona original que muta l'IndexedDB.
 * @returns {Function} La mateixa funció, fortificada amb respostes tàctils.
 */
function embolcall_haptic_crdt(funcioMutacioCRDT) {
  return async function(...args) {
    try {
      // 1. Execució de la transacció a l'estat local
      const resultat = await funcioMutacioCRDT(...args);
      
      // 2. Avaluació del resultat (S'assumeix que la vostra lògica retorna si hi ha hagut merge)
      if (resultat && resultat.conflicte_asi_resolt) {
        PatronsHaptics.merge_conflicte();
      } else {
        PatronsHaptics.exit();
      }
      
      return resultat;

    } catch (error) {
      // 3. Resposta cinètica d'error fatal transmesa directament a la musculatura de l'usuari
      PatronsHaptics.error();
      
      console.error("[FRACTURA CRDT]: Desincronització estructural local.", error);
      
      // 4. Propagació de l'error cap a la UI o la subrutina de Reflexió Asíncrona
      throw error; 
    }
  };
}

// Exportar per a ús en mòduls
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PatronsHaptics, embolcall_haptic_crdt };
}
