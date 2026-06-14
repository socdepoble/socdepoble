import { useEffect, useRef } from 'react';

const IS_DEV = process.env.NODE_ENV === 'development';

let _clsObserver = null;
let _lcpObserver = null;
let _longTaskObserver = null;
let _observersInitialized = false;
const _listeners = new Set();

export const useDOMTelemetry = (containerRef, htmlContent, debug = IS_DEV) => {
  const metricsRef = useRef({ 
    cls: 0, lcp: 0, longTasksCount: 0, 
    vramMB: 0, nodes: 0, _alive: true 
  });

  // Observers de Core Web Vitals
  useEffect(() => {
    if (!_observersInitialized && typeof PerformanceObserver !== 'undefined') {
      try {
        _clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              _listeners.forEach(ref => { if (ref.current._alive) ref.current.cls += entry.value; });
            }
          }
        });
        _clsObserver.observe({ type: 'layout-shift', buffered: true });

        _lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          _listeners.forEach(ref => {
            if (ref.current._alive) ref.current.lcp = lastEntry.renderTime || lastEntry.loadTime || lastEntry.startTime;
          });
        });
        _lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

        if (PerformanceObserver.supportedEntryTypes && PerformanceObserver.supportedEntryTypes.includes('longtask')) {
          _longTaskObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              _listeners.forEach(ref => {
                if (ref.current._alive) {
                  ref.current.longTasksCount++;
                }
              });
            }
          });
          _longTaskObserver.observe({ type: 'longtask', buffered: true });
        }
        _observersInitialized = true;
      } catch (e) {
        console.warn('PerformanceObserver no suportat', e);
      }
    }
    
    _listeners.add(metricsRef);
    return () => {
      _listeners.delete(metricsRef);
    };
  }, []);

  // El Cor de la Telemetria Termodinàmica
  useEffect(() => {
    if (!containerRef.current || !debug) return;
    
    metricsRef.current._alive = true;
    let totalPixels = 0;
    let lastNodeCount = 0;
    
    const updateConsole = () => {
      if (!metricsRef.current._alive || !containerRef.current) return;
      
      const now = performance.now();
      if (now - lastNodeCount > 250) {
        metricsRef.current.nodes = containerRef.current.getElementsByTagName('*').length;
        lastNodeCount = now;
      }
      
      window.dispatchEvent(new CustomEvent('sdp-thermo-tick', {
        detail: {
          vram: metricsRef.current.vramMB,
          nodes: metricsRef.current.nodes,
          cls: metricsRef.current.cls,
          lcp: metricsRef.current.lcp,
          longTasks: metricsRef.current.longTasksCount,
          renderCompleted: false
        }
      }));
    };

    const handleChunkRendered = () => updateConsole();
    const thermoHandler = (e) => { 
      if (e.detail && e.detail.renderCompleted) handleChunkRendered(); 
    };
    window.addEventListener('sdp-thermo-tick', thermoHandler);

    const seenImages = new WeakSet();
    
    // Event Delegation Passiu per calcular VRAM de les imatges carregades
    const handleImageLoad = (e) => {
      const img = e.target;
      if (!img || img.tagName !== 'IMG' || !containerRef.current?.contains(img)) return;
      
      if (!seenImages.has(img)) {
        seenImages.add(img);
        const w = img.naturalWidth || img.width || 0;
        const h = img.naturalHeight || img.height || 0;
        totalPixels += (w * h);
        metricsRef.current.vramMB = (totalPixels * 4) / 1048576; // 4 bytes/pixel, a MB
        updateConsole();
      }
    };
    
    const container = containerRef.current;
    const metrics = metricsRef.current;
    // Ús de capturing phase (true) perquè els load d'img no fan bombolla cap amunt
    container.addEventListener('load', handleImageLoad, true);

    return () => {
      metrics._alive = false;
      if (container) {
        container.removeEventListener('load', handleImageLoad, true);
      }
      window.removeEventListener('sdp-thermo-tick', thermoHandler);
    };
  }, [debug, htmlContent, containerRef]);

const pendingBuffers = new Map();
let seqNoCounter = 1;
const MAX_RETRIES = 3;
const ACK_TIMEOUT_MS = 2000;

function crc32(arrayBuffer) {
  const table = crc32.table || (crc32.table = (function() {
    const t = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
      t[i] = c >>> 0;
    }
    return t;
  })());
  const data = new Uint8Array(arrayBuffer);
  let crc = 0 ^ (-1);
  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ data[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

  // L'Ànima Digital (Termodinàmica de la Comunicació - TCU)
  useEffect(() => {
    if (!debug) return;

    let worker = null;
    try {
      worker = new Worker('/tcu.worker.js');
      worker.onmessage = (ev) => {
        const m = ev.data;
        if (!m || !m.type) return;
        if (m.type === 'ack' && m.id) {
          pendingBuffers.delete(m.id);
        } else if (m.type === 'nack' && m.id) {
          const p = pendingBuffers.get(m.id);
          if (p && p.retries < MAX_RETRIES) {
            p.retries++;
            p.ts = Date.now();
            setTimeout(() => {
              try { worker.postMessage({ type: 'buffer', id: m.id, seqNo: p.seqNo, crc: p.crc, buffer: p.buffer }); }
              catch (e) {}
            }, 100 * p.retries);
          } else {
            pendingBuffers.delete(m.id);
          }
        }
      };
    } catch (e) {
      console.warn('TCU Worker no disponible', e);
      return; // Llei de Degradació: Si falla el worker, aturem ací sense trencar res
    }

    // Double Ring-Buffer (Pool pre-al·locat de Float32Array) per no despertar el GC
    const tcuBuffers = [new Float32Array(4), new Float32Array(4)];
    let activeBuffer = 0;
    
    let scrollFriction = 0;
    let lastScrollY = window.scrollY;
    let lastScrollTime = performance.now();

    const onScroll = () => {
      const now = performance.now();
      const dy = Math.abs(window.scrollY - lastScrollY);
      const dt = now - lastScrollTime;
      
      if (dt > 0 && dt < 100) {
        const velocity = dy / dt;
        if (velocity > 8) { // "Scroll Thrashing" (dit ansiós)
          scrollFriction += 0.5;
          if (scrollFriction > 5) {
            document.body.classList.add('empathy-assist');
          }
        }
      }
      lastScrollY = window.scrollY;
      lastScrollTime = now;
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });

    // Detecció de "Keyboard Thrashing" (Esborrats compulsius) sense llegir el text (Zero-Text)
    const onKeyDown = (e) => {
      if (e.target && (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT')) {
        if (e.key === 'Backspace' || e.key === 'Delete') {
          scrollFriction += 1.0;
          if (scrollFriction > 5) {
            document.body.classList.add('empathy-assist');
          }
        }
      }
    };
    window.addEventListener('keydown', onKeyDown, { passive: true });

    // Tick de 4Hz (250ms) per la TCU
    const tcuInterval = setInterval(() => {
      if (!worker || !('requestIdleCallback' in window)) return;
      
      window.requestIdleCallback(() => {
        // 1. Extracció de densitat burocràtica
        let bureaucratic = 0;
        if (containerRef.current) {
          bureaucratic = containerRef.current.querySelectorAll('p').length * 0.1;
        }

        // 2. Llei APIs Volàtils (-1 si no existeix)
        let battery = -1;
        let network = -1;
        if (navigator.connection) {
           network = navigator.connection.effectiveType === '4g' ? 4 : 1;
        }

        // 3. Emplenar el Buffer actiu (Llei Zero-Text)
        const buffer = tcuBuffers[activeBuffer];
        buffer[0] = scrollFriction;
        buffer[1] = bureaucratic;
        buffer[2] = battery;
        buffer[3] = network;

        // 4. Copilot Handshake (CRC32, Pending Map)
        // Clonem el buffer per no fer 'transfer' i no perdre el pre-al·locat
        const bufferClone = new Float32Array(buffer);
        const id = 'b_' + (seqNoCounter++);
        const seqNo = seqNoCounter;
        const crc = crc32(bufferClone.buffer);
        
        pendingBuffers.set(id, { buffer: bufferClone.buffer, ts: Date.now(), retries: 0, seqNo, crc });
        
        try {
          worker.postMessage({ type: 'buffer', id, seqNo, crc, buffer: bufferClone.buffer });
        } catch (err) {}

        activeBuffer = (activeBuffer + 1) % 2;

        // Neteja de pendingMap (Timeouts)
        const nowTs = Date.now();
        for (const [pId, p] of pendingBuffers.entries()) {
          if (nowTs - p.ts > ACK_TIMEOUT_MS) {
            if (p.retries < MAX_RETRIES) {
              p.retries++;
              p.ts = nowTs;
              try { worker.postMessage({ type: 'buffer', id: pId, seqNo: p.seqNo, crc: p.crc, buffer: p.buffer }); } catch(e){}
            } else {
              pendingBuffers.delete(pId);
            }
          }
        }

        // 5. Refredar l'estrès
        scrollFriction *= 0.8;
        if (scrollFriction < 1) {
          document.body.classList.remove('empathy-assist');
        }
      }, { timeout: 50 });
    }, 250);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKeyDown);
      clearInterval(tcuInterval);
      if (worker) worker.terminate();
      document.body.classList.remove('empathy-assist');
    };
  }, [debug, containerRef]);

  return metricsRef;
};
