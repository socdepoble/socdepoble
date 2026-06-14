// src/hooks/useProgressiveRestore.js
// Restauració en 3 fases. Cap fase bloqueja la fase anterior.
//
// Fase 0 (T=0ms):    React munta, llista buida, skeleton CSS visible
// Fase 1 (T<100ms):  Llegim LcpCache → primers 5 posts (sense Y.js)
// Fase 2 (T<500ms):  Y.Doc restaurat completament, feed complet
// Fase 3 (idle):     Comprovació d'integritat, GC si cal

import { useState, useEffect, useRef, useCallback } from 'react';
import { llegirLcpCache } from '../services/LcpCache';
export const FASE = Object.freeze({
  SKELETON: 0,
  LCP: 1,
  // primers posts visibles, LCP element al DOM
  COMPLET: 2,
  // Y.Doc restaurat, feed síncron amb CRDT
  ERROR: 3
});
export function useProgressiveRestore(rhizomeManager) {
  const [fase, setFase] = useState(FASE.SKELETON);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const initRef = useRef(false);

  // ── Fase 1: LCP Cache (< 100ms) ─────────────────────────────
  const fase1 = useCallback(async () => {
    const cached = await llegirLcpCache();
    if (cached.length > 0) {
      setPosts(cached);
      setFase(FASE.LCP);
      // Marca de rendiment per al PerformanceObserver
      if (typeof performance !== 'undefined') {
        performance.mark('sdp-lcp-phase1');
      }
    }
  }, []);

  // ── Fase 2: Y.Doc complet (requestIdleCallback o setTimeout) ─
  const fase2 = useCallback(async () => {
    if (!rhizomeManager) return;
    try {
      // utilitzem init() que és el que tenim en RhizomeManagerV3
      await rhizomeManager.init();
      import('../core/services/ipfsManager.js').then(m => m.ipfsManager.init());
      // El RhizomeManager notifica via callback quan l'estat és llest.
      // Aquí assumim que l'store Zustand/Context s'actualitza via Y.js.
      // setPosts no cal: la subscripció Y.js actualitzarà l'store global.
      setFase(FASE.COMPLET);
      if (typeof performance !== 'undefined') {
        performance.mark('sdp-lcp-phase2');
        // Mesura total des de navigationStart
        performance.measure('sdp-full-restore', {
          start: 'navigationStart',
          end: 'sdp-lcp-phase2'
        });
      }
    } catch (err) {
      console.error('[useProgressiveRestore] Fase 2:', err.message);
      setError(err.message);
      setFase(FASE.ERROR);
    }
  }, [rhizomeManager]);
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    // Fase 1: immediata (pròxim microtask, no bloqueja el primer paint)
    Promise.resolve().then(fase1);

    // Fase 2: quan el navegador tingui temps mort (màx 2s d'espera)
    if (typeof requestIdleCallback !== 'undefined') {
      const id = requestIdleCallback(fase2, {
        timeout: 2000
      });
      return () => cancelIdleCallback(id);
    } else {
      // Safari < 16 no té requestIdleCallback: setTimeout(0) com a fallback
      const id = setTimeout(fase2, 0);
      return () => clearTimeout(id);
    }
  }, [fase1, fase2]);
  return {
    posts,
    fase,
    error,
    estaCarregant: fase < FASE.COMPLET
  };
}