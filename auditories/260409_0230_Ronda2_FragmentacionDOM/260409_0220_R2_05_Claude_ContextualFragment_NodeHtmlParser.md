> 📂 **Arxiu/Ruta:** `./auditories/260409_0230_Ronda2_FragmentacionDOM/260409_0220_R2_05_Claude_ContextualFragment_NodeHtmlParser.md`

# 🧠 RESPUESTA DEL ALTO CONSEJO MULTI-MODEL (CLAUDE)
**Protocolo: Fragmentación del Monolito HTML | Vanilla JS | Local-First**

Ignorando el encuadre del "Consejo" — aquí va la respuesta técnica directa.

---

## 1. Fragmentación del DOM — Arquitectura "Chunk-on-Demand"

La estrategia es convertir el monolito en un **shell HTML vacío** que carga fragmentos HTML externos bajo demanda. Sin servidor, sin framework.

**Estructura de archivos resultante:**
```
/
├── index.html          ← shell (~50 líneas, carga instantánea)
├── chunks/
│   ├── manifest.json   ← índice de secciones
│   ├── chunk-001.html  ← artículos 1-10
│   ├── chunk-002.html  ← artículos 11-20
│   └── ...
└── sw.js               ← Service Worker que precachea chunks en idle
```

**El shell `index.html` — núcleo del sistema:**
```html
<div id="content-host"></div>
<div id="sentinel"></div> <!-- IntersectionObserver lo vigila -->

<script type="module" src="loader.js"></script>
```

**`loader.js` — el motor:**
```javascript
const manifest = await fetch('./chunks/manifest.json').then(r => r.json());
// manifest = [
//   { id: "prefaci", title: "Prefaci del Mestre", chunk: "chunk-001.html" },
//   { id: "capitol-1", title: "Capitol 1", chunk: "chunk-002.html" },
//   ...
// ]

let loadedChunks = new Set();
let currentChunkIndex = 0;
const host = document.getElementById('content-host');
const sentinel = document.getElementById('sentinel');

async function loadNextChunk() {
  if (currentChunkIndex >= manifest.length) return;
  const entry = manifest[currentChunkIndex++];
  if (loadedChunks.has(entry.chunk)) return;

  const html = await fetch(`./chunks/${entry.chunk}`).then(r => r.text());
  
  // Inserción segura sin parsear el DOM entero
  const fragment = document.createRange().createContextualFragment(html);
  host.insertBefore(fragment, sentinel);
  loadedChunks.add(entry.chunk);

  // Diferir highlight del chunk recién insertado
  scheduleHighlight(entry.chunk);
}

// Cargar primer chunk inmediatamente
await loadNextChunk();

// Cargar siguiente cuando el sentinel sea visible
const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) loadNextChunk();
}, { rootMargin: '800px' }); // precarga con 800px de antelación

observer.observe(sentinel);
```

**Script de build para trocear el monolito** (Node.js, ejecutado una sola vez):
```javascript
// split.mjs — parte el HTML original en chunks
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { parse } from 'node-html-parser'; // npm i node-html-parser

const dom = parse(readFileSync('llibre-sencer.html', 'utf8'));
const articles = dom.querySelectorAll('article');
const CHUNK_SIZE = 8; // artículos por chunk — ajustar según tamaño medio
const manifest = [];

mkdirSync('./chunks', { recursive: true });

for (let i = 0; i < articles.length; i += CHUNK_SIZE) {
  const slice = articles.slice(i, i + CHUNK_SIZE);
  const chunkName = `chunk-${String(i/CHUNK_SIZE + 1).padStart(3,'0')}.html`;
  writeFileSync(`./chunks/${chunkName}`, slice.map(a => a.outerHTML).join('\n'));
  manifest.push({
    id: slice[0].id,
    title: slice[0].querySelector('h2')?.text?.slice(0, 60) ?? chunkName,
    chunk: chunkName
  });
}

writeFileSync('./chunks/manifest.json', JSON.stringify(manifest, null, 2));
console.log(`${Math.ceil(articles.length / CHUNK_SIZE)} chunks generados.`);
```

---

## 2. Defensa de Imágenes — Reglas Absolutas Anti-Reflow

El reflow ocurre cuando el navegador no sabe el tamaño de una imagen antes de cargarla. La solución es doble: **dimensiones declaradas + contenedor con aspect-ratio reservado**.

**Regla CSS global — reserva espacio antes de cargar:**
```css
/* Toda imagen en contenido tiene su espacio reservado */
.content img {
  width: 100%;
  height: auto;
  aspect-ratio: 16/9; /* fallback hasta que cargue */
  object-fit: cover;
  background: #e7e5e4; /* placeholder visual */
  display: block;
}

/* Eliminar el placeholder una vez cargada */
.content img.loaded {
  aspect-ratio: auto;
  background: none;
}
```

**JS — marcar imágenes como cargadas y aplicar lazy:**
```javascript
// Al insertar cada chunk, ejecutar esto sobre sus imágenes
function hardenImages(container) {
  container.querySelectorAll('img').forEach(img => {
    // Lazy loading nativo
    img.loading = 'lazy';
    img.decoding = 'async';
    
    // Si no tiene dimensiones declaradas, forzar aspect-ratio container
    if (!img.width && !img.height) {
      img.setAttribute('width', '800');
      img.setAttribute('height', '450');
    }
    
    img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
  });
}
```

**Las 3 imágenes hero del `<section#hero>` son el caso especial** — están above the fold y NO deben ser lazy. Pero sí necesitan dimensiones explícitas en el HTML:
```html
<!-- ANTES (causa reflow) -->
<img src="/assets/infographics/presentacio.jpg" class="w-full h-auto rounded-[2rem]">

<!-- DESPUÉS (dimensiones reales del archivo) -->
<img src="/assets/infographics/presentacio.jpg" 
     width="1200" height="675"
     class="w-full h-auto rounded-[2rem]"
     fetchpriority="high">
```

---

## 3. Control del Main Thread — highlight.js sin congelar

`hljs.highlightAll()` es síncrono y bloqueante. La solución es procesar los bloques de código en lotes durante los períodos en que el navegador está ocioso.

```javascript
// highlighter.js — procesamiento diferido por lotes
function scheduleHighlight(chunkId) {
  // Seleccionar solo los bloques del chunk recién cargado
  const blocks = document.querySelectorAll(
    `[data-chunk="${chunkId}"] pre code:not(.hljs)`
  );
  
  if (blocks.length === 0) return;
  
  // Convertir NodeList en array para procesarlo por lotes
  const queue = Array.from(blocks);
  
  function processChunk(deadline) {
    // Procesar bloques mientras quede tiempo en el frame idle
    while (queue.length > 0 && deadline.timeRemaining() > 2) {
      hljs.highlightElement(queue.shift());
    }
    
    // Si quedan bloques, re-encolar para el siguiente período idle
    if (queue.length > 0) {
      requestIdleCallback(processChunk, { timeout: 3000 });
    }
  }
  
  requestIdleCallback(processChunk, { timeout: 3000 });
}
```

**Fallback para Safari** (que no implementa `requestIdleCallback`):
```javascript
window.requestIdleCallback = window.requestIdleCallback || function(cb) {
  return setTimeout(() => cb({ timeRemaining: () => 50, didTimeout: false }), 200);
};
```

---

## Orden de implementación recomendado

El impacto mayor con el menor esfuerzo va en este orden:

**1º** → Ejecutar `split.mjs` y convertir el monolito en chunks (elimina el 90% del problema de RAM de golpe).

**2º** → Aplicar el CSS anti-reflow a imágenes (10 líneas, impacto inmediato en estabilidad visual).

**3º** → Integrar `scheduleHighlight` en el loader (elimina los congelamientos de UI al navegar).

El Service Worker de precarga en idle lo dejaría para una fase posterior — primero valida que el sistema de chunks funciona en el iPad real antes de añadir complejidad.
