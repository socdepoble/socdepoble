import React from 'react';
import ReactDOM from 'react-dom';

// ============================================================
// SISTEMA LRU (Least Recently Used)
// ============================================================

export class LRUCache {
  constructor(maxSize) {
    this.maxSize = maxSize;
    this.cache = new Map(); // Map preserva orden de inserción
    this.accessTimestamps = new Map();
  }

  touch(key) {
    if (this.cache.has(key)) {
      // Mover al final (más reciente)
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      this.accessTimestamps.set(key, Date.now());
    }
  }

  touchRange(start, end) {
    for (let i = start; i <= end; i++) {
      this.touch(i);
    }
  }

  set(key, value) {
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      // Evict el más antiguo (primero del Map)
      const firstKey = this.cache.keys().next().value;
      this.evict(firstKey);
    }
    this.cache.set(key, value);
    this.accessTimestamps.set(key, Date.now());
  }

  evict(key) {
    const element = this.cache.get(key);
    if (element) {
      // Destrucción agresiva de recursos
      this.destroyElement(element);
    }
    this.cache.delete(key);
    this.accessTimestamps.delete(key);
  }

  destroyElement(element) {
    if (!element) return;
    
    // Liberar imágenes explícitamente (iPad A10 retiene en GPU)
    const images = element.querySelectorAll('img');
    images.forEach(img => {
      img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // Pixel transparente 1x1
      img.onload = null;
      img.onerror = null;
    });

    // Pausar videos y liberar buffers
    const videos = element.querySelectorAll('video');
    videos.forEach(vid => {
      vid.pause();
      vid.src = '';
      vid.load(); // Forzar liberación de memoria
    });

    // Limpiar canvas
    const canvases = element.querySelectorAll('canvas');
    canvases.forEach(cvs => {
      const ctx = cvs.getContext('2d');
      ctx?.clearRect(0, 0, cvs.width, cvs.height);
    });

    // Remover listeners para evitar memory leaks
    element.replaceWith(element.cloneNode(false));
  }

  clear() {
    for (const [key] of this.cache) {
      this.evict(key);
    }
  }

  get size() {
    return this.cache.size;
  }
}


// ============================================================
// INSECT MEMORY MANAGER v2.0 - SÓC DE POBLE
// "Piensa como insecto: sin cerebro, solo reflejos y supervivencia"
// Objetivo: Sobrevivir en iPad A10 (2GB RAM) con feeds infinitos
// ============================================================

/**
 * CONFIGURACIÓN DE SUPERVIVENCIA
 * Ajustado para iPad A10: conservador y agresivo
 */
const MEMORY_CONFIG = {
  MAX_HEAP_MB: 180,           // Límite duro antes de purga masiva
  WARNING_HEAP_MB: 150,       // Umbral de alerta amarilla
  POOL_SIZE: 8,               // Máximo elementos DOM reutilizables
  BUFFER_ITEMS: 2,            // Items extra arriba/abajo del viewport
  ITEM_ESTIMATED_KB: 512,     // Estimación conservadora por item
  CLEANUP_INTERVAL_MS: 30000, // GC periódico cada 30s
  FORCE_GC_THRESHOLD: 0.85    // 85% de memoria = purga total
};

/**
 * Hook React: useInsectMemory
 * Virtualización extrema + LRU + Gestión de presión de memoria
 */
export function useInsectMemory(containerRef, items, itemHeight, renderItem) {
  // Estado mínimo indispensable (no guardar items completos aquí)
  const [visibleRange, setVisibleRange] = React.useState({ start: 0, end: 0 });
  const [pressure, setPressure] = React.useState('normal'); // normal | warning | critical
  
  // Refs mutables para evitar re-renders (performance en A10)
  const poolRef = React.useRef(new Map());      // DOM elements reciclables
  const lruRef = React.useRef(new LRUCache(50)); // Últimos 50 items vistos
  const observerRef = React.useRef(null);
  const pressureCheckRef = React.useRef(null);

  // ============================================================
  // FASE 1: VIRTUALIZACIÓN CON INTERSECTION OBSERVER
  // ============================================================
  
  React.useEffect(() => {
    if (!containerRef.current) return;

    // Estrategia: Solo observar "sentinelas" cada N items, no todos
    const container = containerRef.current;
    const sentinelGap = Math.max(1, Math.floor(items.length / 20)); // Max 20 sentineles
    
    // Crear sentineles virtuales (divs vacíos livianos)
    const sentinels = [];
    for (let i = 0; i < items.length; i += sentinelGap) {
      const sentinel = document.createElement('div');
      sentinel.dataset.index = i;
      sentinel.style.height = '1px';
      sentinel.style.position = 'absolute';
      sentinel.style.top = `${i * itemHeight}px`;
      container.appendChild(sentinel);
      sentinels.push(sentinel);
    }

    // Observer ultra-ligero: solo detecta entrada/salida de viewport
    observerRef.current = new IntersectionObserver(
      (entries) => {
        let minIndex = Infinity;
        let maxIndex = -1;
        
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.dataset.index);
            minIndex = Math.min(minIndex, idx);
            maxIndex = Math.max(maxIndex, idx);
          }
        });

        if (maxIndex >= 0) {
          // Expandir rango con buffer
          const start = Math.max(0, minIndex - MEMORY_CONFIG.BUFFER_ITEMS * sentinelGap);
          const end = Math.min(items.length - 1, maxIndex + MEMORY_CONFIG.BUFFER_ITEMS * sentinelGap);
          
          setVisibleRange({ start, end });
          lruRef.current.touchRange(start, end); // Marcar como recientemente usados
        }
      },
      {
        root: container,
        rootMargin: `${itemHeight * MEMORY_CONFIG.BUFFER_ITEMS}px 0px`,
        threshold: 0
      }
    );

    sentinels.forEach(s => observerRef.current.observe(s));

    return () => {
      sentinels.forEach(s => s.remove());
      observerRef.current?.disconnect();
    };
  }, [items.length, itemHeight, containerRef]);

  // ============================================================
  // FASE 2: SISTEMA LRU (Referencia a la clase global)
  // ============================================================
  // El caché LRU ahora se define fuera del hook para evitar re-certificaciones

  // ============================================================
  // FASE 3: MONITOR DE PRESIÓN DE MEMORIA (Memory Pressure)
  // ============================================================
  
  const emergencyPurge = React.useCallback(() => {
    // Fase 1: Vaciar LRU completamente excepto visibles actuales
    const visibleKeys = new Set();
    for (let i = visibleRange.start; i <= visibleRange.end; i++) {
      visibleKeys.add(i);
    }
    
    for (const [key] of lruRef.current.cache) {
      if (!visibleKeys.has(key)) {
        lruRef.current.evict(key);
      }
    }

    // Fase 2: Forzar GC del navegador
    if (window.gc) window.gc(); 
    
    // Fase 3: Reducir calidad de imágenes global
    document.body.classList.add('memory-critical');
    
    // Notificar a componentes hijos
    window.dispatchEvent(new CustomEvent('insect:emergency', {
      detail: { remaining: visibleKeys.size, purged: lruRef.current.size }
    }));
  }, [visibleRange]);

  const checkMemoryPressure = React.useCallback(() => {
    // En iPad A10, usar heurísticas ya que performance.memory es limitado
    const estimatedMB = lruRef.current.size * MEMORY_CONFIG.ITEM_ESTIMATED_KB / 1024;
    
    // Heurística adicional: tiempo de respuesta del DOM
    const start = performance.now();
    document.body.offsetHeight; // Forzar layout
    const layoutTime = performance.now() - start;
    
    let newPressure = 'normal';
    
    if (estimatedMB > MEMORY_CONFIG.MAX_HEAP_MB || layoutTime > 16) {
      newPressure = 'critical';
    } else if (estimatedMB > MEMORY_CONFIG.WARNING_HEAP_MB || layoutTime > 8) {
      newPressure = 'warning';
    }

    if (newPressure !== pressure) {
      setPressure(newPressure);
      
      if (newPressure === 'critical') {
        // PURGA DE EMERGENCIA
        emergencyPurge();
      } else if (newPressure === 'warning') {
        // Reducir buffer proactivamente
        //lruRef.current.evictLRU(Math.floor(lruRef.current.size * 0.3)); // Sacar 30%
      }
    }
  }, [pressure, emergencyPurge]);

  // GC periódico
  React.useEffect(() => {
    pressureCheckRef.current = setInterval(checkMemoryPressure, MEMORY_CONFIG.CLEANUP_INTERVAL_MS);
    return () => clearInterval(pressureCheckRef.current);
  }, [checkMemoryPressure]);

  // ============================================================
  // FASE 4: RENDERIZADO CON RECICLAJE DE POOL
  // ============================================================
  
  const getVisibleItems = React.useCallback(() => {
    const { start, end } = visibleRange;
    const visible = [];
    
    for (let i = start; i <= end && i < items.length; i++) {
      // Reutilizar del pool si existe
      let element = poolRef.current.get(i);
      
      if (!element) {
        // Crear nuevo o reciclar del pool
        if (poolRef.current.size >= MEMORY_CONFIG.POOL_SIZE) {
          // Reciclar el más antiguo fuera de rango visible
          for (const [key, el] of poolRef.current) {
            if (key < start || key > end) {
              element = el;
              poolRef.current.delete(key);
              // Limpiar para reutilización
              element.innerHTML = '';
              element.className = 'insect-item';
              break;
            }
          }
        }
        
        if (!element) {
          element = document.createElement('div');
          element.className = 'insect-item';
        }
        
        // Renderizar contenido
        element.style.position = 'absolute';
        element.style.top = `${i * itemHeight}px`;
        element.style.height = `${itemHeight}px`;
        element.style.width = '100%';
        element.dataset.index = i;
        
        // Inyectar contenido React via portal o render directo
        const content = renderItem(items[i], i);
        if (typeof content === 'string') {
          element.innerHTML = content;
        } else {
          // Para React elements, usar un contenedor y render
          // OJO: React.Portal requiere renderizar React nodes
        }
        
        poolRef.current.set(i, element);
        lruRef.current.set(i, element);
      }
      
      visible.push({ index: i, element });
    }
    
    return visible;
  }, [visibleRange, items, itemHeight, renderItem]);

  return {
    visibleItems: getVisibleItems(),
    pressure
  };
}

// ============================================================
// COMPONENTE REACT: InfiniteFeed (Uso del Hook)
// ============================================================

export function InfiniteFeed({ items, renderItem, itemHeight = 200 }) {
  const containerRef = React.useRef(null);
  
  const { visibleItems, pressure } = useInsectMemory(
    containerRef,
    items,
    itemHeight,
    renderItem
  );

  const containerClass = `insect-feed ${pressure === 'critical' ? 'emergency-mode' : ''}`;

  return (
    <div 
      ref={containerRef}
      className={containerClass}
      style={{ 
        height: '100vh', 
        overflowY: 'auto',
        position: 'relative',
        contain: 'strict'
      }}
    >
      <div 
        style={{ 
          height: `${items.length * itemHeight}px`,
          position: 'relative'
        }} 
      />
      
      {/* Solo elementos visibles montados */}
      {visibleItems.map(({ index, element }) => {
        // Usamos ReactDOM.createPortal para inyectar React nodes en los elementos del DOM reciclados
        return ReactDOM.createPortal(
          renderItem(items[index], index),
          element,
          index
        );
      })}
    </div>
  );
}

// Inyectar CSS Dinámico
if (typeof document !== 'undefined') {
  const insectStyles = `
    .insect-feed {
      will-change: transform;
      transform: translateZ(0); 
    }
    .insect-item {
      contain: layout style paint; 
      content-visibility: auto; 
    }
    .emergency-mode .insect-item img {
      filter: blur(2px) grayscale(100%); 
      transform: scale(0.95);
    }
    .emergency-mode {
      --img-quality: low;
      pointer-events: none; 
    }
  `;
  const style = document.createElement('style');
  style.textContent = insectStyles;
  document.head.appendChild(style);
}
