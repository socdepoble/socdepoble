> 📂 **Arxiu/Ruta:** `./auditories/260409_0230_Ronda2_FragmentacionDOM/260409_0234_R2_10_Mistral_BuildSplitJS_FetchUnderDemand_CssCritico.md`

# 🌐 ALTO CONSEJO MULTI-MODEL: RESPUESTA EJECUTIVA (RONDA 2)

## DIAGNÓSTICO CONFIRMADO

El análisis empírico es concluyente: **`llibre-sencer.html` (203k líneas) es el asesino silencioso de la RAM.** Cada petición carga el DOM completo, ejecuta `highlight.js` sobre 600+ bloques de código y decodifica decenas de imágenes sin lazy loading. El resultado: el iPad A10 se ahoga antes de pintar la primera pantalla.

La solución no pasa por abstracciones de frameworks, sino por **cirugía de Vanilla JS y fragmentación en tiempo de build**. A continuación, la estrategia definitiva.

---

## 1. PAGINACIÓN / FRAGMENTACIÓN OFFLINE (VANILLA JS)

### Estrategia elegida: **Static Splitting + Fetch under demand**

**Fase de build (Node.js):**  
Analizamos `llibre-sencer.html` y extraemos cada `<article data-type="human|machine">` en un archivo HTML independiente, respetando su `id`. Además, generamos un **índice maestro** (`manifest.json`) con la lista de fragmentos, sus pesos y relaciones secuenciales.

```javascript
// build-split.js (ejecutado con Node)
const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('public/llibre-sencer.html', 'utf8');
const dom = new JSDOM(html);
const articles = dom.window.document.querySelectorAll('article');
const manifest = [];

articles.forEach((article, idx) => {
  const id = article.id || `fragment-${idx}`;
  const type = article.getAttribute('data-type') || 'human';
  const content = article.outerHTML;
  fs.writeFileSync(`public/fragments/${id}.html`, content);
  manifest.push({ id, type, order: idx });
});

fs.writeFileSync('public/fragments/manifest.json', JSON.stringify(manifest));
```

**Fase de cliente (Vanilla JS):**  
El HTML principal solo contiene un contenedor `<div id="dynamic-content"></div>` y el manifiesto se carga al inicio.

```javascript
// loader.js
let currentOrder = -1;
let isLoading = false;
let manifest = [];
let observer = null;

async function loadNextFragment() {
  if (isLoading || currentOrder + 1 >= manifest.length) return;
  isLoading = true;
  const next = manifest[currentOrder + 1];
  try {
    const response = await fetch(`/fragments/${next.id}.html`);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const fragment = doc.body.firstChild;
    document.getElementById('dynamic-content').appendChild(fragment);
    currentOrder++;
    // Activar highlight solo para los nuevos bloques de código
    highlightVisibleCodeBlocks(fragment);
    // Reconfigurar observer
    setupIntersectionObserver();
  } catch (err) {
    console.error('Error loading fragment:', err);
  } finally {
    isLoading = false;
  }
}

function setupIntersectionObserver() {
  if (observer) observer.disconnect();
  const lastElement = document.getElementById('dynamic-content').lastElementChild;
  if (!lastElement) return;
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) loadNextFragment();
  }, { rootMargin: '300px' });
  observer.observe(lastElement);
}

// Inicio
fetch('/fragments/manifest.json')
  .then(res => res.json())
  .then(data => {
    manifest = data;
    loadNextFragment(); // carga el primero
  });
```

**Garantía offline:** El Service Worker debe precachear todos los fragmentos y el manifiesto durante la instalación.

---

## 2. DEFENSA TEMPRANA (IMÁGENES Y LAYOUT REFLOW)

### Reglas absolutas para el HTML generado:

1. **Todas las imágenes** (excepto las del hero visible) llevan `loading="lazy"` y atributos `width`/`height` explícitos.
2. **Uso de `<picture>` con AVIF/WebP fallback** en tiempo de build.
3. **Contenedor con `aspect-ratio`** para evitar saltos:  
   ```css
   .image-container {
     aspect-ratio: 16 / 9;
     background: #f0f0f0;
     overflow: hidden;
   }
   img {
     width: 100%;
     height: 100%;
     object-fit: cover;
   }
   ```
4. **CSS crítico inyectado en línea** (estilos de estructura, tipografía base). El resto cargado con `media="print"` y luego cambiado a `all` tras la carga.

```html
<link rel="stylesheet" href="/assets/main.css" media="print" onload="this.media='all'">
```

5. **Prohibido `@import` en CSS** y evitar reglas que disparen reflows masivos (ej. `font-swap` con `display: swap` sí, pero sin `@import`).

---

## 3. CONTROL DEL MAIN THREAD: `hljs.highlightAll()` DEFERIDO

### Estrategia triple:

1. **Carga asíncrona de highlight.js** con `async` y `defer`.
2. **Resaltado progresivo por visibilidad** usando `IntersectionObserver`.
3. **Uso de `requestIdleCallback` para procesar lotes** cuando el hilo principal esté libre.

```javascript
// highlight-lazy.js
let highlightQueue = [];

function scheduleHighlight(block) {
  highlightQueue.push(block);
  if (!window.highlightScheduled) {
    window.highlightScheduled = true;
    requestIdleCallback(() => {
      while (highlightQueue.length) {
        const block = highlightQueue.shift();
        hljs.highlightElement(block);
      }
      window.highlightScheduled = false;
    }, { timeout: 500 });
  }
}

function highlightVisibleCodeBlocks(container = document) {
  const blocks = container.querySelectorAll('pre code:not(.hljs)');
  blocks.forEach(block => {
    if (isElementInViewport(block)) {
      scheduleHighlight(block);
    } else {
      // Observar cuando entre en viewport
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            scheduleHighlight(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: '100px' });
      observer.observe(block);
    }
  });
}

function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight + 200 && rect.bottom > -200;
}

// Ejecutar tras cargar cada fragmento
document.addEventListener('DOMContentLoaded', () => {
  highlightVisibleCodeBlocks();
});
```

**Además, para los bloques de código muy largos** (>200 líneas), podemos usar un Web Worker para parsear el lenguaje y devolver el HTML resaltado, aunque la sobrecarga de transferencia podría no compensar. Lo dejamos como optimización futura.

---

## CONCLUSIÓN EJECUTIVA (PARA EL ALTO CONSEJO)

**Acción inmediata:**

1. **Implementar el script de build splitting** (`build-split.js`) en el repositorio.
2. **Modificar `sw.js`** para incluir `fragments/*.html` en la precaché.
3. **Reemplazar el `llibre-sencer.html` original** por un esqueleto que solo contenga el contenedor dinámico y el loader.
4. **Aplicar las reglas de imágenes y CSS** a los fragmentos generados.
5. **Inyectar `highlight-lazy.js`** en lugar de la llamada directa a `hljs.highlightAll()`.

**Impacto esperado:**
- Reducción del DOM inicial de ~200k líneas a **menos de 100 líneas**.
- Uso de RAM por debajo de 200MB en lugar de >800MB.
- Primera pintura en <1 segundo (vs 5-6 segundos actuales).
- Sin bloqueos del hilo principal durante el resaltado de código.

**Métrica de éxito:** El usuario puede abrir `llibre-sencer.html` en un iPad A10 y hacer scroll sin tirones ni cierres forzados.

---

**¿Procedemos con la implementación quirúrgica?**  
Esperamos la confirmación del Mestre y del Arquitecto Antigravity para iniciar la refactorización.
