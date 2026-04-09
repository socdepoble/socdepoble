> 📂 **Arxiu/Ruta:** `./auditories/260409_0230_Ronda2_FragmentacionDOM/260409_0225_R2_11_Copilot_VirtualScroll_Storage_vs_IndexedDB_DefensaReflow.md`

# 🧠 RESPUESTA DEL ALTO CONSEJO MULTI-MODEL (COPILOT)
**Protocolo: Fragmentación del Monolito HTML | Vanilla JS | Local-First**

### Estrategia resumida (atributos clave)

| **Área** | **Objetivo** | **Técnica propuesta | **Impacto** |
|---|---:|---|---:|
| **Fragmentación Offline** | DOM inicial ≈ 0 | **HTML por fragmentos + manifest JSON + virtual-scroll / paginación on-demand** | Reduce DOM a lo visible; memoria ≪ |
| **Imágenes y UI** | Evitar reflows y carga masiva | **`loading="lazy"`, `width/height` o `aspect-ratio` placeholders, `srcset`/AVIF/WEBP** | Evita CLS; baja transferencia inicial |
| **Control Main Thread** | No bloquear UI por `hljs` | **Defer con `requestIdleCallback` + chunking; WebWorker para highlight si es posible** | Jank mínimo; interacción fluida |
| **Offline / PWA** | Sin backend, persistencia local | **Cache Storage + IndexedDB para fragments y blobs** | Lectura instantánea; funciona offline |

---

### 1. Paginación / Fragmentación Offline (Vanilla JS, PWA sin servidor)

**Idea brutal:** no metas 200k líneas en el DOM. Mantén un *manifest* (JSON) que describa el documento en **fragmentos secuenciales** (capítulos/tomos). Al inicio sólo inyectas el *shell* y el primer fragmento mínimo. El resto se carga desde Cache/IndexedDB o desde la red cuando el usuario lo pida o se aproxime por scroll.

**Flujo:**
1. Preprocesa `llibre-sencer.html` en build: genera `manifest.json` con lista de fragmentos `[{id, title, offset, size, url}]`.
2. En la PWA, durante `install` del service worker cacheas `manifest.json` y los fragmentos HTML (o los guardas en IndexedDB como blobs).
3. En la página, render inicial = shell + TOC + contenedor vacío `#reader`.
4. Al pedir capítulo (click o scroll near-bottom) `fetchFragment(id)` lee de Cache/IndexedDB y `innerHTML` sólo del fragmento.

**Código mínimo (cliente):**

```html
<div id="reader" aria-live="polite"></div>
<nav id="toc"></nav>
<script type="module">
const PAGE_BUFFER = 1; // cuántos fragmentos prefetch
async function loadManifest(){
  const res = await fetch('/manifest.json');
  return res.json();
}
async function fetchFragment(id){
  // intenta cache primero (service worker + Cache API) o IndexedDB
  const res = await fetch(`/fragments/${id}.html`);
  if(!res.ok) throw new Error('no fragment');
  return res.text();
}
function injectFragment(html){
  const container = document.getElementById('reader');
  const frag = document.createElement('div');
  frag.className = 'fragment';
  frag.innerHTML = html;
  container.appendChild(frag);
  // after inject: init lazy images, code highlighting scheduling, etc.
}
(async function init(){
  const manifest = await loadManifest();
  const toc = document.getElementById('toc');
  manifest.forEach(m => {
    const btn = document.createElement('button');
    btn.textContent = m.title;
    btn.onclick = async () => {
      const html = await fetchFragment(m.id);
      injectFragment(html);
    };
    toc.appendChild(btn);
  });
  // load first fragment
  const first = manifest[0];
  injectFragment(await fetchFragment(first.id));
})();
</script>
```

**Optimización adicional:** **virtual-scroll** para listas largas dentro de cada fragmento (si hay índices, comentarios, entradas repetidas). Renderiza sólo los nodos visibles y usa un *spacer* para mantener la altura total. Esta técnica mantiene el DOM constante independientemente del tamaño total.

---

### 2. Defensa Temprana: imágenes y prevención de Layout Reflow (CLS)

**Reglas absolutas (aplicar en todo el HTML):**
- **Siempre** declara `width` y `height` en `<img>` o usa `aspect-ratio` en CSS para reservar espacio antes de la carga. Esto elimina CLS.
- Usa **`loading="lazy"`** para todas las imágenes *below-the-fold*; para portadas críticas usa `loading="eager"` y versiones optimizadas.
- Sirve múltiples formatos con `<picture>` + `srcset` (AVIF/WebP fallback) para reducir bytes.  
- **Placeholder ligero**: usa un tiny inline SVG o un CSS background con el mismo ratio (blur-up opcional) — **no** cargues la imagen real hasta que sea necesaria.  
- **Evita reflows**: anima sólo `transform` y `opacity`. No cambies `width/height` dinámicamente después de la carga.

**Ejemplo de markup robusto:**

```html
<picture>
  <source type="image/avif" srcset="/img/cover-800.avif 800w, /img/cover-400.avif 400w" />
  <source type="image/webp" srcset="/img/cover-800.webp 800w, /img/cover-400.webp 400w" />
  <img
    src="/img/cover-400.jpg"
    alt="Portada"
    width="800" height="450"
    loading="lazy"
    decoding="async"
    style="width:100%;height:auto;display:block;"
  />
</picture>
```

**Placeholder CSS pattern (ratio reserve):**

```css
.img-placeholder {
  width:100%;
  aspect-ratio: 16 / 9;
  background: linear-gradient(90deg,#eee,#ddd);
  overflow:hidden;
}
.img-placeholder img{ width:100%; height:100%; object-fit:cover; display:block; }
```

---

### 3. Control del Main Thread y `highlight.js` sin congelar UI

**Estrategia en dos niveles:**
1. **Preferir WebWorker**: highlight.js soporta ejecución en worker (o puedes usar la versión core y registrar lenguajes en worker). Si puedes, haz el parse/transform del código en un Worker y devuelve HTML ya resaltado; el main thread sólo hace `innerHTML`. Esto **saca** el trabajo pesado del hilo principal.
2. **Si no hay Worker posible**, usa `requestIdleCallback` con **chunking** y timeout para ejecutar `hljs.highlightAll()` en trozos, y con fallback a `setTimeout` si `requestIdleCallback` no existe. Usa `timeRemaining()` para limitar cada chunk y evitar jank.

**Patrón: WebWorker + main thread**

- **worker.js**
```js
importScripts('/libs/highlight.min.js'); // si lo puedes empaquetar
self.onmessage = async (e) => {
  const {id, codeHtml} = e.data;
  // highlight.js API en worker: highlightAuto o highlight
  const container = document.createElement('div');
  container.innerHTML = codeHtml;
  // run highlight on each <pre><code>
  self.postMessage({id, highlightedHtml: container.innerHTML});
};
```

- **main.js**
```js
const worker = new Worker('/worker.js');
worker.onmessage = (e) => {
  const {id, highlightedHtml} = e.data;
  document.querySelector(`#code-${id}`).innerHTML = highlightedHtml;
};
function scheduleHighlight(codeHtml, id){
  worker.postMessage({id, codeHtml});
}
```

**Patrón: requestIdleCallback + chunking (fallback):**

```js
const scheduleIdle = window.requestIdleCallback || function(cb){ return setTimeout(()=>cb({timeRemaining:()=>0}), 50); };

function highlightChunks(nodes){
  let i = 0;
  function work(deadline){
    while(i < nodes.length && (deadline.timeRemaining() > 0 || deadline.didTimeout)){
      const node = nodes[i++];
      try{ hljs.highlightElement(node); } catch(e){ /* degrade gracefully */ }
    }
    if(i < nodes.length) scheduleIdle(work, {timeout: 2000});
  }
  scheduleIdle(work, {timeout: 2000});
}
```

---

### 4. Offline-first: almacenar fragments y assets en PWA

**Recomendación:** usa **Cache Storage** para recursos estáticos (fragments HTML, CSS, imágenes optimizadas) y **IndexedDB** para blobs grandes o metadatos (manifest, progreso de lectura). El service worker debe servir fragments desde cache y actualizar en background.

**Puntos clave:**
- Cachea `manifest.json` y `fragments/*.html` en `install`.
- En `fetch` del SW, responde con `caches.match(request)` y fallback a network; si network responde, actualiza cache en background.
- Para grandes imágenes/medios, guarda blobs en IndexedDB si necesitas manipularlos o servirlos sin URL.

---

### 5. Checklist operativo (implementación inmediata)

- **Build step:** dividir `llibre-sencer.html` en `fragments/0001.html ...` + `manifest.json`.
- **PWA SW:** cachear manifest + fragments + shell; `fetch` handler offline-first.
- **Client:** shell + TOC + `#reader` vacío; `fetchFragment()` + `injectFragment()`.
- **Images:** audit masivo → añadir `width/height` o `aspect-ratio`; convertir a AVIF/WebP; `loading="lazy"`.
- **Code highlighting:** preferir WebWorker; si no, `requestIdleCallback` + chunking + fallback.
- **Memory guardrails:** limitar DOM nodes por fragmento; destruir fragmentos antiguos si el total de `.fragment` > N (ej. 3) para mantener DOM pequeño.
- **Telemetry:** medir `JS heap size`, `first-scroll time`, `CLS`, y `Long Tasks` para validar.

---

### 6. Ejemplo de arquitectura mínima (resumen técnico)

- **Build** → `split-html` → `manifest.json` + `fragments/`
- **Service Worker** → cache manifest + fragments; offline-first fetch
- **Client** → shell + lazy inject; virtual-scroll para listas; image placeholders
- **Highlight** → worker or idle-chunked
- **Storage** → Cache API para recursos; IndexedDB para blobs/metadata
