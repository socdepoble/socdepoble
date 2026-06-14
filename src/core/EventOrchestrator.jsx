import { useEffect, useRef } from 'react';
import { SOSPStore } from '../stores/SOSPStore';
import { SDP, verifyEvent } from '../lib/eventBus';
import { performanceMonitor } from '../lib/performanceMonitor';

const EVENT_REGISTRY = {
  [SDP.ADD_CART]: (detail) => {
    if (!detail?.entityId) return;
    SOSPStore.actions.cart.add(detail);
  },
  [SDP.SHARE]: async (detail) => {
    const url = detail?.sourceUrl || window.location.href;
    const title = detail?.entityTitle || 'Sóc de Poble';
    if (navigator.share) {
      try { await navigator.share({ title, text: "Fes un cop d'ull a això!", url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      SOSPStore.actions.ui.toast('Enllaç copiat al porta-retalls', 'success');
    }
  },
  [SDP.CONNECT]: (detail) => {
    if (!detail?.entityId) return;
    SOSPStore.actions.connection.request(detail.entityId, detail.entityType || 'post');
  },
  [SDP.TRANSLATE]: (detail) => {
    SOSPStore.actions.modal.open('translate', { itemId: detail?.entityId, title: detail?.entityTitle, triggerId: detail?.triggerId });
  },
  [SDP.COMMENT]: (detail) => {
    SOSPStore.actions.modal.open('comment', { itemId: detail?.entityId, title: detail?.entityTitle, triggerId: detail?.triggerId });
  }
};

const EventOrchestrator = () => {
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    performanceMonitor.start();

    const controller = new AbortController();
    const { signal } = controller;

    const throttleMap = new Map();
    const THROTTLE_MS = 50;

    // Hidratació garantida: assegurem que el Store està viu abans del primer event
    SOSPStore.init().catch(err => console.error('[SDP] Error hidratant Store:', err));

    // Inicialitzar Ledger en mode desenvolupament
    if (import.meta.env.DEV) {
      window.__SDP_LEDGER__ = window.__SDP_LEDGER__ || [];
    }

    Object.entries(EVENT_REGISTRY).forEach(([eventName, handler]) => {
      window.addEventListener(eventName, async (e) => {
        if (signal.aborted) return;
        
        const detail = e.detail;

        // 1. Validació origen
        if (!detail?._requeued && !verifyEvent(detail, eventName)) {
          console.warn(`[SDP] Event rebutjat: signatura invàlida per a ${eventName}`);
          return;
        }

        // 2. Throttle segur amb autodestrucció (zero timers)
        const nowMs = performance.now();
        const throttleKey = `${eventName}-${detail?.entityId || 'global'}`;
        if (nowMs - (throttleMap.get(throttleKey) || 0) < THROTTLE_MS) return;
        throttleMap.set(throttleKey, nowMs);

        // Neteja del throttle O(1) asíncrona sense bucles
        setTimeout(() => throttleMap.delete(throttleKey), THROTTLE_MS);

        // 3. Descart d'events caducats
        const nowUnix = Date.now();
        const MAX_EVENT_AGE_MS = 2000;
        if (!detail?._requeued && detail?.ts && (nowUnix - detail.ts) > MAX_EVENT_AGE_MS) {
          console.warn(`[SDP] Event ${eventName} descartat per antiguitat (>2s)`);
          return;
        }

        // 4. Event Ledger (mode DEV)
        if (import.meta.env.DEV) {
          window.__SDP_LEDGER__.push({ type: eventName, payload: detail, time: performance.now() });
          if (window.__SDP_LEDGER__.length > 100) window.__SDP_LEDGER__.shift();
        }

        // 5. Wrap de Seguretat (Kimi)
        try {
          await handler(detail);
        } catch (err) {
          console.error(`[SDP] Fallada en processar ${eventName}:`, err);
          SOSPStore.actions.ui.toast('Hi ha hagut un error inesperat.', 'error');
        }
      }, { signal });
    });

    return () => {
      performanceMonitor.stop();
      controller.abort();
      throttleMap.clear();
      mountedRef.current = false;
    };
  }, []);

  return null;
};

export default EventOrchestrator;
