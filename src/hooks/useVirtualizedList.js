import { useRef, useEffect, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
const DEFAULT_ESTIMATED_HEIGHT = 80;
const DEFAULT_OVERSCAN = 5;
const MAX_NODES_SAFE = 500; // Límit de l'iPad A10 (2018)
const LUPA_EVENT = 'pedra-seca-lupa-change';

/**
 * Hook de virtualització defensiva.
 * 
 * CONTRACTE STRICTE:
 * - El renderItem ha de retornar un element amb margin: 0.
 * - L'espaiat entre elements és responsabilitat del contenidor (gap).
 * - Cap item pot usar getComputedStyle en el seu render.
 */
export function useVirtualizedList({
  items,
  scrollRef,
  estimatedHeight = DEFAULT_ESTIMATED_HEIGHT,
  overscan = DEFAULT_OVERSCAN,
  getItemId,
  onMeasureError,
  lupaSync = true,
  // Activa re-mesura automàtica en canvi de Lupa
  onEndReached,
  // Callback quan s'aproxima al final
  endReachedThreshold = 200 // Px abans del final per a disparar
}) {
  const isLupaChanging = useRef(false);
  const endReachedFired = useRef(false);
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: useCallback(() => estimatedHeight, [estimatedHeight]),
    overscan,
    /**
     * Mesura d'element amb validació defensiva.
     * PROHIBIT: getComputedStyle, offsetHeight (força reflow síncron).
     * PERMÉS: getBoundingClientRect NOMÉS si l'element està connectat al DOM.
     */
    measureElement: useCallback(element => {
      if (!element || !element.isConnected) {
        return estimatedHeight;
      }
      try {
        const rect = element.getBoundingClientRect();
        // Defensa contra elements col·lapsats o fora de layout
        if (rect.height === 0) return estimatedHeight;
        return rect.height;
      } catch (err) {
        if (onMeasureError) onMeasureError(err, element);
        return estimatedHeight;
      }
    }, [estimatedHeight, onMeasureError]),
    getItemKey: useCallback(index => {
      return getItemId ? getItemId(items[index], index) : `item-${index}`;
    }, [items, getItemId])
  });

  // ─────────────────────────────────────────
  // SINCRONITZACIÓ MODE LUPA (Tèrmica)
  // ─────────────────────────────────────────
  useEffect(() => {
    if (!lupaSync) return;
    let rafId = null;
    let secondRafId = null;
    const handleLupaChange = e => {
      // CRÍTIC: No mesurar en el mateix frame del canvi de font-size.
      // Esperem dos requestAnimationFrame per a deixar que WebKit
      // estabilitze el layout després de l'escalat de l'arrel.
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(secondRafId);
      rafId = requestAnimationFrame(() => {
        secondRafId = requestAnimationFrame(() => {
          isLupaChanging.current = false;
          // Invalidació total de la cache d'altures
          virtualizer.measure();
        });
      });
    };
    window.addEventListener(LUPA_EVENT, handleLupaChange);
    return () => {
      window.removeEventListener(LUPA_EVENT, handleLupaChange);
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(secondRafId);
    };
  }, [virtualizer, lupaSync]);

  // ─────────────────────────────────────────
  // DETECCIÓ DE FINAL DE LLISTA (Paginació)
  // ─────────────────────────────────────────
  useEffect(() => {
    if (!onEndReached || !scrollRef.current) return;
    const scrollEl = scrollRef.current;
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const {
          scrollTop,
          scrollHeight,
          clientHeight
        } = scrollEl;
        const remaining = scrollHeight - scrollTop - clientHeight;
        if (remaining < endReachedThreshold && !endReachedFired.current) {
          endReachedFired.current = true;
          onEndReached();
        } else if (remaining >= endReachedThreshold) {
          endReachedFired.current = false;
        }
        ticking = false;
      });
    };
    scrollEl.addEventListener('scroll', handleScroll, {
      passive: true
    });
    return () => scrollEl.removeEventListener('scroll', handleScroll);
  }, [onEndReached, endReachedThreshold]);

  // ─────────────────────────────────────────
  // AUDITORIA TÈRMICA (Dev Mode)
  // ─────────────────────────────────────────
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    const checkThermalState = () => {
      const virtualItems = virtualizer.getVirtualItems();
      if (virtualItems.length > MAX_NODES_SAFE) {
        console.warn(`%c[PedraSeca] ALERTA TÈRMICA%c\n` + `El virtualitzador renderitza ${virtualItems.length} nodes actius.\n` + `Límit segur A10: ${MAX_NODES_SAFE}.\n` + `Redueix 'overscan' o revisa 'estimatedHeight'.`, 'background:#dc2626;color:#fff;font-weight:bold;', 'color:#92400e;');
      }
    };

    // Comprovar després de cada mesura
    const unsub = virtualizer.subscribe(checkThermalState);
    return () => unsub();
  }, [virtualizer]);
  return virtualizer;
}