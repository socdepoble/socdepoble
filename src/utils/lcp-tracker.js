// src/utils/lcp-tracker.js
// Mesura real del LCP en Safari iOS. S'inicialitza una vegada.
// En producció, envia les mètriques a Umami (l'analítica existent del projecte).

let lcpEntry = null;
let observer = null;
export function iniciarLcpTracker() {
  if (typeof PerformanceObserver === 'undefined') return;
  if (!PerformanceObserver.supportedEntryTypes?.includes('largest-contentful-paint')) return;
  try {
    observer = new PerformanceObserver(list => {
      // Sempre prenem l'última entrada: el LCP es pot actualitzar múltiples vegades
      const entries = list.getEntries();
      lcpEntry = entries[entries.length - 1];
    });

    // buffered: true captura les entrades que ja han passat abans del subscribe
    observer.observe({
      type: 'largest-contentful-paint',
      buffered: true
    });

    // Confirma el LCP en interacció (com fa Google CrUX)
    const confirmar = () => {
      observer?.disconnect();
      if (lcpEntry) {
        const lcp = lcpEntry.startTime;
        console.info(`[LCP] ${lcp.toFixed(0)}ms · element: ${lcpEntry.element?.tagName ?? 'desconegut'}`);

        // Marca de rendiment per a DevTools
        performance.mark('sdp-lcp-confirmed', {
          startTime: lcp
        });

        // Avisa si supera l'objectiu
        if (lcp > 1000) {
          console.warn(`[LCP] ⚠️ ${lcp.toFixed(0)}ms > 1000ms · l'Uelo de Bancal nota el retard`);
        }

        // Envia a Umami si és disponible i la connexió és bona
        if (navigator.onLine && window.umami) {
          window.umami.track('lcp', {
            value: Math.round(lcp),
            device: 'ios-pwa'
          });
        }
      }
      ['pointerdown', 'keydown'].forEach(e => document.removeEventListener(e, confirmar));
    };
    ['pointerdown', 'keydown'].forEach(e => document.addEventListener(e, confirmar, {
      once: true
    }));
  } catch (err) {
    console.warn('[LCP Tracker] No disponible:', err.message);
  }
}