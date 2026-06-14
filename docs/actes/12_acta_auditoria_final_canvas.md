# ⚖️ AUDITORIA FINAL: LA CONSOLA IMMORTAL (A PER EL 10/10)

**A l'atenció de l'Eixam (Grok, Dola, Qwen, DeepSeek, Kimi, Mistral Vibe, ChatGPT, Claude i Perplexity):**

Mestres, la "Gran Purga" s'ha consumat. Hem escoltat cadascun dels vostres advertiments, des del forat de memòria dels listeners de Safari (Kimi), fins a les variables CSS i el `content-visibility` (Qwen), passant pel llast que suposava `chart.js` (Grok, Perplexity, Gemini).

Us presente el **Codi Final Tancat i Complet**. Hem arrasat amb qualsevol component React per a la consola i l'hem reescrita 100% en Vanilla JS + Canvas Pur. L'HTML base queda segellat com el "Template Definitiu Pedra Seca". 

Abans de tancar oficialment aquesta fase i començar a implementar l'estilització final amb CSS (Fase 3.1), vull que reviseu la maquinària nua per última vegada de principi a fi. Teniu tot el codi sencer ací baix. **Si no hi ha cap forat, exigisc el 10/10.**

---

### 1. La Consola Canvas (Vanilla JS)
*Zero re-renders. Zero dependències. Només 2D natiu.*
**Arxiu: `src/utils/thermoConsole.js`**
```javascript
/**
 * ThermoConsole v3.1 — Pedra Seca Edition
 * Zero React. Zero Dependencies. Zero Mercy.
 */

class ThermoConsole {
  constructor() {
    if (window.__thermoConsole) return window.__thermoConsole;
    
    this.metrics = {
      vram: 0, nodes: 0, parse: 0, render: 0,
      fps: 60, longTasks: 0, cls: 0, lcp: 0
    };
    
    this.history = {
      vram: new Array(300).fill(0),
      fps: new Array(300).fill(60),
      parse: new Array(300).fill(0),
      render: new Array(300).fill(0)
    };
    
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    this.isMinimized = false;
    this.isVisible = false;
    this.dpr = Math.min(window.devicePixelRatio, 2);
    
    this.init();
    window.__thermoConsole = this;
  }
  
  init() {
    this.container = document.createElement('div');
    this.container.id = 'thermo-console';
    this.container.style.cssText = `
      position: fixed;
      bottom: 16px;
      right: 16px;
      width: 420px;
      height: 280px;
      z-index: 2147483647;
      font-family: 'Noto Sans', 'SF Pro Display', system-ui, sans-serif;
      font-size: 12px;
      color: #FFFFFF;
      background: rgba(0, 0, 0, 0.94);
      border: 1px solid rgba(255, 115, 0, 0.3);
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 
        0 12px 40px rgba(0, 0, 0, 0.6),
        0 0 0 1px rgba(255, 115, 0, 0.1),
        inset 0 0 80px rgba(0, 0, 0, 0.4);
      transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      user-select: none;
      -webkit-user-select: none;
      display: none;
    `;
    
    const header = document.createElement('div');
    header.style.cssText = `
      height: 36px;
      background: rgba(255, 115, 0, 0.08);
      border-bottom: 1px solid rgba(255, 115, 0, 0.2);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      cursor: pointer;
      letter-spacing: 2px;
    `;
    header.innerHTML = `
      <span style="font-weight: 900; font-size: 11px; color: #FF7300;">
        ◈ THERMO-CONSOLE <span style="opacity: 0.5; color: #FFFFFF;">v3.1</span>
      </span>
      <span id="thermo-toggle" style="cursor: pointer; opacity: 0.6; font-size: 16px; font-weight: bold; color: #FFFFFF;">−</span>
    `;
    
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = 'width: 100%; height: 244px; display: block;';
    this.canvas.width = 420 * this.dpr;
    this.canvas.height = 244 * this.dpr;
    
    this.container.appendChild(header);
    this.canvas.style.borderRadius = '0 0 28px 28px';
    this.container.appendChild(this.canvas);
    
    const portalRoot = document.getElementById('portal-root') || document.body;
    portalRoot.appendChild(this.container);
    
    this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(this.dpr, this.dpr);
    
    header.addEventListener('click', (e) => {
      if (e.target.id === 'thermo-toggle') this.toggle();
    });
    
    window.addEventListener('sdp-thermo-tick', (e) => {
      Object.assign(this.metrics, e.detail);
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        this.isVisible = !this.isVisible;
        this.container.style.display = this.isVisible ? 'block' : 'none';
      }
    });
    
    this.loop();
  }
  
  toggle() {
    this.isMinimized = !this.isMinimized;
    this.container.style.height = this.isMinimized ? '36px' : '280px';
    this.canvas.style.display = this.isMinimized ? 'none' : 'block';
    const toggle = document.getElementById('thermo-toggle');
    if (toggle) toggle.textContent = this.isMinimized ? '+' : '−';
  }
  
  loop() {
    requestAnimationFrame(() => this.loop());
    
    if (!this.isVisible && !this.isMinimized) return; // Optimization
    
    const now = performance.now();
    const delta = now - this.lastFrameTime;
    this.frameCount++;
    
    if (delta >= 1000) {
      this.metrics.fps = Math.round((this.frameCount * 1000) / delta);
      this.lastFrameTime = now;
      this.frameCount = 0;
    }
    
    this.history.vram.shift(); this.history.vram.push(this.metrics.vram);
    this.history.fps.shift(); this.history.fps.push(this.metrics.fps);
    this.history.parse.shift(); this.history.parse.push(this.metrics.parse);
    this.history.render.shift(); this.history.render.push(this.metrics.render);
    
    this.draw();
  }
  
  draw() {
    const ctx = this.ctx;
    const w = 420;
    const h = 244;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.98)';
    ctx.fillRect(0, 0, w, h);
    
    ctx.strokeStyle = 'rgba(255, 115, 0, 0.04)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < w; x += 60) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
    
    this.drawWaveform(this.history.vram, '#FF7300', 100, 90, 80, 0.25);
    this.drawWaveform(this.history.fps.map(f => Math.min(f, 120)), '#0984E3', 120, 90, 80, 0.12);
    
    const col1 = 18;
    const col2 = 150;
    const col3 = 290;
    let y = 26;
    
    ctx.font = 'bold 12px "Noto Sans", system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('VRAM', col1, y);
    ctx.fillText(`${this.metrics.vram.toFixed(1)} MB`, col2, y);
    const vramStatus = this.metrics.vram > 80 ? '⚠ CRÍTIC' : this.metrics.vram > 40 ? '◈ ALT' : '◉ ESTABLE';
    ctx.fillStyle = this.metrics.vram > 80 ? '#FF3333' : this.metrics.vram > 40 ? '#FF7300' : '#00DD88';
    ctx.fillText(vramStatus, col3, y);
    
    y += 22;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('NODES', col1, y);
    ctx.fillText(`${this.metrics.nodes}`, col2, y);
    const nodeStatus = this.metrics.nodes > 1500 ? '⚠ EXCÉS' : '◉ OPTIMAL';
    ctx.fillStyle = this.metrics.nodes > 1500 ? '#FF3333' : '#00DD88';
    ctx.fillText(nodeStatus, col3, y);
    
    y += 22;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('PARSE', col1, y);
    ctx.fillText(`${this.metrics.parse.toFixed(1)} ms`, col2, y);
    
    y += 22;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('RENDER', col1, y);
    ctx.fillText(`${this.metrics.render.toFixed(1)} ms`, col2, y);
    
    y += 22;
    ctx.fillStyle = this.metrics.fps < 30 ? '#FF3333' : '#FFFFFF';
    ctx.fillText('FPS', col1, y);
    ctx.fillText(`${this.metrics.fps}`, col2, y);
    const fpsStatus = this.metrics.fps < 30 ? '⚠ BAIX' : this.metrics.fps >= 55 ? '◉ FLUID' : '◈ OK';
    ctx.fillStyle = this.metrics.fps < 30 ? '#FF3333' : this.metrics.fps >= 55 ? '#00DD88' : '#FF7300';
    ctx.fillText(fpsStatus, col3, y);
    
    const barY = 210;
    const barW = 384;
    const barH = 12;
    const vramPct = Math.min(this.metrics.vram / 100, 1);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.beginPath();
    ctx.roundRect(col1, barY, barW, barH, 6);
    ctx.fill();
    
    const barColor = this.metrics.vram > 80 ? '#FF3333' : '#FF7300';
    ctx.fillStyle = barColor;
    ctx.beginPath();
    ctx.roundRect(col1, barY, barW * vramPct, barH, 6);
    ctx.fill();
    
    ctx.shadowColor = barColor;
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = 'rgba(255, 115, 0, 0.3)';
    ctx.fillRect(0, 0, w, 1);
    
    ctx.fillStyle = 'rgba(255, 115, 0, 0.015)';
    const scanY = (performance.now() / 25) % h;
    ctx.fillRect(0, scanY, w, 2);
  }
  
  drawWaveform(data, color, maxVal, yOffset, height, glowIntensity) {
    const ctx = this.ctx;
    const w = 420;
    const step = w / data.length;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    
    data.forEach((val, i) => {
      const x = i * step;
      const normalized = Math.min(val / maxVal, 1);
      const y = yOffset + height - (normalized * height);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    
    ctx.stroke();
    
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    const alpha = Math.round(glowIntensity * 255).toString(16).padStart(2, '0');
    ctx.fillStyle = color + alpha;
    ctx.beginPath();
    ctx.moveTo(0, yOffset + height);
    data.forEach((val, i) => {
      const x = i * step;
      const normalized = Math.min(val / maxVal, 1);
      const y = yOffset + height - (normalized * height);
      ctx.lineTo(x, y);
    });
    ctx.lineTo(w, yOffset + height);
    ctx.closePath();
    ctx.fill();
  }
}

export const initThermoConsole = () => new ThermoConsole();

```

### 2. Store Termodinàmic Vanilla (Sense Zustand)
**Arxiu: `src/stores/thermodynamicStore.js`**
```javascript
class ThermoStore extends EventTarget {
  constructor() {
    super();
    this.state = {
      isOpen: false,
      metrics: { nodes: 0, vram: 0, parseTime: 0, renderTime: 0, fps: 60, cls: 0, lcp: 0, longTasks: 0 },
      history: [],
      simulationRunning: false
    };
  }
  
  getState() { return this.state; }
  
  setState(partial) {
    this.state = { ...this.state, ...partial };
    this.dispatchEvent(new CustomEvent('change', { detail: this.state }));
  }
  
  toggleConsole() { this.setState({ isOpen: !this.state.isOpen }); }
  toggleSimulation() { this.setState({ simulationRunning: !this.state.simulationRunning }); }
  updateMetrics(metrics) {
    const history = [...this.state.history.slice(-80), { ...metrics, timestamp: Date.now() }];
    this.setState({ metrics, history });
  }
}

export const useThermodynamicStore = new ThermoStore();

```

### 3. Telemetria passiva (Corregida)
**Arxiu: `src/hooks/useDOMTelemetry.js`**
```javascript
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
    
    const updateConsole = () => {
      if (!metricsRef.current._alive || !containerRef.current) return;
      
      // 🚀 BYPASS EXTREM C++: 0 bytes de memòria, comptem nodes estàticament
      metricsRef.current.nodes = containerRef.current.querySelectorAll('*').length;
      
      window.dispatchEvent(new CustomEvent('sdp-thermo-tick', {
        detail: {
          vram: metricsRef.current.vramMB,
          nodes: metricsRef.current.nodes,
          cls: metricsRef.current.cls,
          lcp: metricsRef.current.lcp,
          longTasks: metricsRef.current.longTasksCount,
          parseTime: 0, // removed to avoid reflows
          renderTime: 0 // removed to avoid reflows
        }
      }));
    };

    // 1. Escoltem cada vegada que un Chunk s'insereix al DOM
    const handleChunkRendered = () => updateConsole();
    const thermoHandler = (e) => { if (e.detail.renderCompleted) handleChunkRendered(); };
    window.addEventListener('sdp-thermo-tick', thermoHandler);

    // 2. Event Delegation Passiu: Només mesurem la VRAM quan la imatge REALMENT s'ha descarregat
    const handleImageLoad = (e) => {
      const img = e.target;
      if (img.tagName === 'IMG') {
        const w = img.naturalWidth || img.width || 0;
        const h = img.naturalHeight || img.height || 0;
        totalPixels += (w * h);
        metricsRef.current.vramMB = (totalPixels * 4) / 1048576; // 4 bytes RGBA
        updateConsole();
      }
    };
    
    // Capturing phase (true) actiu perquè els esdeveniments 'load' no fan bubble. Zero CPU overhead.
    const container = containerRef.current;
    container.addEventListener('load', handleImageLoad, true);

    return () => {
      metricsRef.current._alive = false;
      if (container) {
        container.removeEventListener('load', handleImageLoad, true);
      }
      window.removeEventListener('sdp-thermo-tick', thermoHandler);
    };
  }, [debug]); // Removed htmlContent and containerRef dependencies

  return metricsRef.current;
};

```

### 4. Lazy Renderer Asíncron (Amb rIC)
**Arxiu: `src/components/ui/LazyHtmlRenderer.jsx`**
```javascript
import React, { useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import { useDOMTelemetry } from '../../hooks/useDOMTelemetry';

const INITIAL_RENDER = 12;
const CHUNK_SIZE = 6;
const ROOT_MARGIN = '600px';
const MAX_NODES_IN_MEMORY = 1500; 

const optimizeHtmlString = (() => {
  const cache = new Map();
  const MAX_CACHE = 20;
  return (html) => {
    if (!html) return '';
    if (cache.has(html)) return cache.get(html);
    const result = html
      .replace(/<img\b(?![^>]*loading=)/gi, '<img loading="lazy" decoding="async" fetchpriority="low" ')
      .replace(/<iframe\b(?![^>]*loading=)/gi, '<iframe loading="lazy" contain="strict" ')
      .replace(/<video\b(?![^>]*preload=)/gi, '<video preload="none" ');
    if (cache.size >= MAX_CACHE) cache.delete(cache.keys().next().value);
    cache.set(html, result);
    return result;
  };
})();

const LazyHtmlRenderer = forwardRef(({ htmlContent, className = '', debug = false }, ref) => {
  const containerRef = useRef(null);
  const sentinelRef = useRef(null);
  const observerRef = useRef(null);
  const rafIdRef = useRef(null);
  const renderingRef = useRef(false);
  
  const stateRef = useRef({
    nodes: [],
    renderedCount: 0,
    total: 0
  });

  useDOMTelemetry(containerRef, htmlContent, debug);

  const renderChunk = useCallback((overrideSize = null) => {
    if (!containerRef.current) return;
    const state = stateRef.current;
    if (state.renderedCount >= state.total || renderingRef.current) return;
    
    renderingRef.current = true;
    const size = overrideSize || CHUNK_SIZE;
    const chunk = state.nodes.slice(state.renderedCount, state.renderedCount + size);
    
    if (chunk.length > 0) {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      
      // FIX QWEN: usar rAF per a un renderitzat visual suau
      rafIdRef.current = requestAnimationFrame(() => {
        chunk.forEach(node => {
          if (node) containerRef.current.appendChild(node);
        });
        
        state.renderedCount += chunk.length;
        renderingRef.current = false;
        
        if (state.renderedCount >= state.total) {
          if (observerRef.current && sentinelRef.current) {
            try { observerRef.current.unobserve(sentinelRef.current); } 
            catch (e) { /* ignore */ }
          }
          state.nodes = []; // Lliberar memòria
          if (debug) {
            console.log(`[LazyHtmlRenderer] Completed ${state.total} nodes. Freed array.`);
            window.dispatchEvent(new CustomEvent('sdp-thermo-tick', { detail: { renderCompleted: true } }));
          }
        }
      });
    } else {
      renderingRef.current = false;
    }
  }, [debug]);

  useImperativeHandle(ref, () => ({
    renderAll: () => {
      const state = stateRef.current;
      if (state.renderedCount < state.total) {
        renderChunk(state.total - state.renderedCount);
      }
    }
  }));

  useEffect(() => {
    if (!htmlContent || !containerRef.current) return;

    if (containerRef.current.replaceChildren) {
      containerRef.current.replaceChildren();
    } else {
      containerRef.current.innerHTML = '';
    }
    
    stateRef.current.renderedCount = 0;
    stateRef.current.nodes = [];
    stateRef.current.total = 0;
    renderingRef.current = false;

    const runParse = () => {
      if (!containerRef.current) return;
      const optimizedHtml = optimizeHtmlString(htmlContent);
      
      // 🛡️ L'ARMA DEFINITIVA: <template> no fa peticions de xarxa amagades!
      const template = document.createElement('template');
      template.innerHTML = optimizedHtml;
      
      let rootNodes = Array.from(template.content.childNodes);
      let rootClasses = [];
      
      while (rootNodes.length === 1 && rootNodes[0].nodeType === Node.ELEMENT_NODE && rootNodes[0].children.length > 1) {
        if (rootNodes[0].className) rootNodes[0].className.split(' ').forEach(c => c && rootClasses.push(c));
        rootNodes = Array.from(rootNodes[0].childNodes);
      }

      const parsedNodes = rootClasses.length > 0 ? rootNodes : Array.from(template.content.childNodes);
      
      let wrapper = null;
      if (rootClasses.length > 0) {
        wrapper = document.createElement('div');
        wrapper.className = rootClasses.join(' ');
        wrapper.style.borderRadius = '28px';
        wrapper.style.overflow = 'hidden';
      }
      
      if (wrapper) {
        parsedNodes.forEach(n => wrapper.appendChild(n));
        stateRef.current.nodes = [wrapper];
        stateRef.current.total = 1;
      } else {
        stateRef.current.nodes = parsedNodes;
        stateRef.current.total = parsedNodes.length;
      }

      if (parsedNodes.length > MAX_NODES_IN_MEMORY) {
        console.warn(`[THERMO WARNING] ⚠️ Bomba de nodes detectada (${parsedNodes.length}).`);
      }

      // Neteja extrema sobre el Sandbox C++ (Zero reflows)
      const mediaTags = template.content.querySelectorAll('img, iframe, video');
      mediaTags.forEach(node => {
        if (node.tagName === 'IMG') {
          if (!node.hasAttribute('loading')) node.setAttribute('loading', 'lazy');
          if (!node.hasAttribute('decoding')) node.setAttribute('decoding', 'async');
        } else if (node.tagName === 'IFRAME') {
          if (!node.hasAttribute('loading')) node.setAttribute('loading', 'lazy');
          node.style.contain = 'strict';
        } else if (node.tagName === 'VIDEO') {
          if (!node.hasAttribute('preload')) node.setAttribute('preload', 'none');
        }
      });

      const largeBlocks = template.content.querySelectorAll('div, section, article');
      largeBlocks.forEach(node => {
        if (node.children?.length > 10 && 'contentVisibility' in document.documentElement.style) {
          node.style.contentVisibility = 'auto';
          node.style.containIntrinsicSize = '500px';
        }
      });

      renderChunk(INITIAL_RENDER);

      if (stateRef.current.total > INITIAL_RENDER) {
        if (!observerRef.current) {
          observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
              renderChunk();
            }
          }, {
            root: null,
            rootMargin: ROOT_MARGIN,
            threshold: 0
          });
        }

        if (sentinelRef.current) {
          observerRef.current.observe(sentinelRef.current);
        }
      }
    };

    let idleId;
    if (window.requestIdleCallback) {
      idleId = window.requestIdleCallback(runParse, { timeout: 1000 });
    } else {
      idleId = setTimeout(runParse, 0);
    }

    return () => {
      if (window.cancelIdleCallback && idleId) {
        window.cancelIdleCallback(idleId);
      } else if (idleId) {
        clearTimeout(idleId);
      }
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      renderingRef.current = false;
    };
  }, [htmlContent, renderChunk]);

  useEffect(() => {
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`lazy-html-renderer ${className}`} 
      style={{ position: 'relative', contain: 'layout paint', borderRadius: '28px', overflow: 'hidden' }}
    >
      <div 
        ref={sentinelRef} 
        style={{ height: '1px', visibility: 'hidden', position: 'absolute', bottom: 0 }} 
        aria-hidden="true" 
      />
    </div>
  );
});

LazyHtmlRenderer.displayName = 'LazyHtmlRenderer';
export default LazyHtmlRenderer;
```

### 5. Estils Base HTML (Pedra Seca Definitiva)
**Arxiu: `public/stitch_chat_layout_template.html`**
```html
<!DOCTYPE html>
<html lang="ca">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sóc de Poble | El Sistema Operatiu Rural</title>
  
  <!-- Tailwind CSS via CDN per a que Stitch ho puga interpretar ràpidament -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <script>
    tailwind.config = {
      darkMode: 'class', // O 'media'
      theme: {
        extend: {
          colors: {
            'sdp-orange': 'var(--color-taronja-corporatiu)',
            'sdp-blue': 'var(--color-blau-protocol)',
            'sdp-dark': '#111827',
            'sdp-border': 'rgba(255,255,255,0.05)'
          },
          fontFamily: {
            sans: ['"Noto Sans"', 'sans-serif'],
          }
        }
      }
    }
  </script>
  
  <!-- Icones de Lucide (com les que usem a Sóc de Poble) -->
  <script src="https://unpkg.com/lucide@latest"></script>

  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap');
    
    body {
      font-family: 'Noto Sans', sans-serif;
      margin: 0;
      overflow: hidden; 
      overscroll-behavior-y: none; /* 🛡️ ANTI-GOMA iOS */
      background-color: #000000;   /* 🛡️ OLED BLACK */
      text-rendering: optimizeLegibility;
    }
    
    /* Variables base simulades de Sóc de Poble */
    :root {
      /* Variables base simulades de Sóc de Poble */
      --color-taronja-corporatiu: #FF7300;
      --color-blau-protocol: #0984E3;
      --theme-accent-primary: var(--color-taronja-corporatiu);
      --theme-accent-secondary: var(--color-blau-protocol);
      --bg-master: #050505;
      --border-master: rgba(255, 255, 255, 0.05);
    }
    
    .light {
      --bg-master: #F3F4F6;
      --border-master: rgba(0, 0, 0, 0.1);
    }

    /* Estil personalitzat d'scroll (més bonic, Fase 3) */
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: var(--border-master);
      border-radius: 10px;
    }
    
    /* Fallback per a Safari iOS / navegadors antics */
    @supports (-webkit-touch-callout: none) {
      .custom-scrollbar {
        -webkit-overflow-scrolling: touch;
      }
    }.custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: var(--theme-accent-primary); }
    
    .glass-effect {
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }
    
    /* 🛡️ Dola Fix: Activació GPU per a elements animables (Fase 3) */
    .gpu-accelerated {
      transform: translateZ(0);
      backface-visibility: hidden;
    }
    
    /* 🛡️ ChatGPT Fix: Illes de composició per la Fase 3 */
    .main-shell {
      contain: layout paint;
    }
    
    .overlay-layer {
      position: absolute;
      inset: 0;
      contain: layout paint size;
      isolation: isolate;
      /* will-change eliminat del repòs! */
      pointer-events: none;
      opacity: 0;
      z-index: 50;
    }
    
    .overlay-layer.active {
      pointer-events: auto;
      opacity: 1;
      transform: translateZ(0);
      will-change: transform, opacity; /* 🛡️ Actiu només ací per salvar VRAM */
    }
  </style>
</head>

<body class="min-h-screen h-[100dvh] flex flex-col md:flex-row text-[var(--text-master)] overflow-hidden bg-sdp-theme-bg-base">
  
  <!-- NOTA PER A STITCH: Això és el NAVEGADOR PRINCIPAL ESQUERRE (NavigationRail) de l'app real.
       Solem tindre una barra de 80px a l'esquerra del tot amb els icones primaris. Ací ho he omitit 
       per centrar l'exemple en el ChatLayout, però no t'oblides d'això en l'aplicació real. -->

  <!-- PANELL ESQUERRE: LLISTA DE XATS (ChatList.jsx) -->
  <aside class="w-full md:w-[380px] h-full flex flex-col border-r border-[var(--border-master)] bg-[#0A0A0A] shrink-0" style="contain: layout paint;">
    
    <!-- Header del Main (Buit o Logo) -->
    <header class="min-h-[64px] border-b border-[var(--border-master)] bg-[#0A0A0A] flex items-center justify-between px-6 z-10 shrink-0">
      <div class="relative w-full">
        <i data-lucide="search" class="absolute left-4 top-1/2 -translate-y-1/2 text-black/60 w-5 h-5"></i>
        <input 
          type="text" 
          aria-label="Cercar converses"
          role="searchbox"
          placeholder="CERCA UN XAT..." 
          class="w-full h-10 bg-white/90 border-0 rounded-[28px] pl-12 pr-4 text-sm font-black text-black focus:outline-none placeholder:text-black/50 uppercase tracking-widest shadow-inner shadow-black/10"
        />
      </div>
    </header>

    <!-- Contingut Llista -->
    <div class="flex-1 overflow-y-auto custom-scrollbar">
      
      <!-- ITEM: Usuari Exemple -->
      <div role="button" tabindex="0" aria-label="Xat amb IAIA MarIA" class="flex items-center space-x-3 h-[80px] px-4 border-b border-[var(--border-master)] hover:bg-white/5 cursor-pointer relative transition-all">
        <!-- Tag Rol (Opcional) -->
        <span class="absolute top-2 right-3 bg-black text-[var(--color-taronja-corporatiu)] text-[9px] px-2 py-1 rounded border border-[var(--color-taronja-corporatiu)]/40 font-black tracking-wider uppercase">
          Mestre
        </span>
        
        <!-- Avatar Circular -->
        <div class="w-14 h-14 rounded-full bg-white flex items-center justify-center shrink-0 border-2 border-white/10 overflow-hidden">
          <img src="https://ui-avatars.com/api/?name=IAIA+Maria&background=random&color=fff" alt="Avatar" class="w-full h-full object-cover">
        </div>
        
        <div class="flex-1 min-w-0 pr-10">
          <div class="text-[19px] font-bold text-[var(--color-taronja-corporatiu)] truncate leading-tight tracking-tight">
            IAIA MarIA
          </div>
          <div class="flex justify-between items-center mt-1">
            <div class="text-[15px] opacity-80 truncate leading-none">
              Dignitat, terra i xarxa.
            </div>
            <div class="text-[12px] font-bold text-gray-500 shrink-0 ml-2">
              ARA
            </div>
          </div>
        </div>
      </div>

    </div>
  </aside>

  <!-- PANELL DRET: ESCENARI DEL XAT Buit (ChatEmptyState.jsx) -->
  <main class="flex-1 flex flex-col bg-[#111111] relative overflow-hidden main-shell" style="content-visibility: auto; contain-intrinsic-size: auto 1000px;">
    
    <!-- SUPER REGLA DE LA BOINA TARONJA: 
         La capçalera superior dreta és: 
         - MODO CLARO = bg-[var(--color-taronja-corporatiu)] (Taronja)
         - MODO OSCURO = bg-[var(--color-blau-protocol)] (Blau) 
         (Ací estem representant el layout genèric però li posem Blau per a l'exemple de dark mode) -->
    
    <header class="h-16 px-6 flex items-center justify-between border-b border-[var(--border-master)] shrink-0 z-30 transition-colors bg-[var(--color-blau-protocol)] text-white">
      <div class="flex items-center gap-3">
        <div class="bg-black/80 rounded-[28px] p-[2px] shadow-inner">
          <div class="w-10 h-10 rounded-[28px] bg-white/20 flex items-center justify-center backdrop-blur">
            <i data-lucide="settings" class="w-[22px] h-[22px]"></i>
          </div>
        </div>
        <div class="flex flex-col">
          <h2 class="text-lg font-bold truncate leading-none">Configuració Global del Xat</h2>
          <div class="flex items-center gap-2 mt-1">
            <span class="w-2 h-2 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]"></span>
            <span class="text-[10px] font-black uppercase tracking-widest opacity-80">ESTEM PROTEGITS</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Contingut Central / Hero -->
    <div class="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto relative" style="contain: layout paint;">
      <div class="relative z-10 max-w-4xl text-center">
        <h1 class="text-5xl md:text-7xl font-black mb-6 tracking-tight uppercase italic text-[var(--color-taronja-corporatiu)] leading-none">
          SÓC DE POBLE
        </h1>
        <h2 class="text-3xl md:text-5xl text-[var(--color-blau-protocol)] leading-tight font-black italic mb-10">
          Portal de Pobles Connectats
        </h2>
        <p class="text-xl md:text-2xl text-gray-300 leading-relaxed font-bold max-w-3xl mx-auto mb-16">
          Una <span class="text-[var(--color-taronja-corporatiu)] font-black">XARXA SOCIAL DESCENTRALITZADA</span> de PROGRAMARI LLIURE, per CONNECTAR i GEOLOCALITZAR recursos d'utilitat social.
        </p>

        <!-- Botons CTA (Crida a l'Acció) -->
        <div class="flex flex-col gap-6 max-w-lg mx-auto w-full mb-16">
          <button  class="relative flex items-center justify-center px-12 py-6 bg-[var(--color-blau-protocol)] text-white rounded-[24px] font-black uppercase text-xl tracking-widest shadow-2xl hover:scale-105 transition-transform transition-colors duration-300">
            <i data-lucide="user-plus" class="absolute left-8 w-8 h-8"></i>
            CONNECTA AMB EL TEU POBLE!
          </button>
          
          <button  class="relative flex items-center justify-center px-12 py-6 bg-[var(--color-taronja-corporatiu)] text-white rounded-[24px] font-black uppercase text-xl tracking-widest shadow-2xl hover:scale-105 transition-transform transition-colors duration-300">
            <i data-lucide="share-2" class="absolute left-8 w-8 h-8"></i>
            COMPARTIR SÓC DE POBLE
          </button>
        </div>

      </div>
    </div>
    
  </main>

  <!-- 🛡️ Kimi Fix: Capes independents per a mapes i modals (Fase 3) fora del main -->
  <div id="portal-root" style="position: fixed; inset: 0; pointer-events: none; z-index: 9999;">
    <div id="scene-layer" class="overlay-layer">
      <!-- Contingut de la transició d'escena s'instanciarà ací -->
    </div>
    
    <div id="modal-layer" class="overlay-layer bg-black/80 flex items-center justify-center">
      <!-- Contingut Modal anirà ací injectat per React Portal -->
    </div>
    
    <div id="map-layer" class="overlay-layer">
      <!-- El Mapa Leaflet s'instanciarà ací aïllat de la resta -->
    </div>
  </div>

  <script>
    // Inicialitzar icones
    lucide.createIcons();
  </script>
</body>
</html>

```

---

Aquest és el tancament de la Fase 2. L'HTML està polit, la UI deslligada, i la memòria domada. 
**Revisió final.** Llegiu tot el codi de dalt a baix. Si veieu algun forat a nivell de C++, DOM o rendiment, parleu ara.
Si no, doneu-me el 10 absolut.

**A la propera fase (Fase 3.1) començarem amb els estils globals CSS (Pedra Seca)**. Si teniu alguna consideració estratègica per a com enfocar els CSS, deixeu-ho caure. Ens acomiadem amb orgull, Eixam. Sou història! 🚜🌾🛸
