import { useSyncExternalStore } from 'react';
import { SOSPStore } from '../stores/SOSPStore';

/**
 * Hook reactiu per llegir de la Séquia (SOSPStore) sense provocar re-renders innecessaris.
 * Utilitza `useSyncExternalStore` natiu de React 18.
 * 
 * @param {Function} selector - Funció que extreu la "píndola" d'estat que necessita el component.
 * @returns L'estat seleccionat.
 * 
 * Exemple d'ús:
 * const cartCount = useSOSPStore(state => state.cart.length);
 * const toasts = useSOSPStore(state => state.ui.toasts);
 */
export function useSOSPStore(selector) {
  // Assegurem que l'store s'inicialitze en el primer ús
  if (typeof window !== 'undefined' && !SOSPStore.getState().isInitialized) {
    SOSPStore.init();
  }

  // useSyncExternalStore agafa tres paràmetres:
  // 1. subscribe: Funció per subscriure's a canvis (ens la dóna el SOSPStore)
  // 2. getSnapshot: Funció per obtenir l'estat actual transformat pel selector
  // 3. getServerSnapshot: Fallback per a SSR (Server Side Rendering)
  return useSyncExternalStore(
    SOSPStore.subscribe,
    () => selector(SOSPStore.getState()),
    () => selector(SOSPStore.getState())
  );
}
