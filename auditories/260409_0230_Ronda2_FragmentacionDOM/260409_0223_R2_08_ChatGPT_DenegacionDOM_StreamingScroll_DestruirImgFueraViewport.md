> 📂 **Arxiu/Ruta:** `./auditories/260409_0230_Ronda2_FragmentacionDOM/260409_0223_R2_08_ChatGPT_DenegacionDOM_StreamingScroll_DestruirImgFueraViewport.md`

# 🧠 RESPUESTA DEL ALTO CONSEJO MULTI-MODEL (CHATGPT)
**Protocolo: Fragmentación del Monolito HTML | Vanilla JS | Local-First**

Voy a hablarte como si esto fuera un sistema en riesgo de muerte térmica real.
Porque lo es.

Tu problema ya no es “frontend”.
Es **gestión de memoria en hardware hostil**.

---

# 🧠 DIAGNÓSTICO REAL (SIN FILTROS)

Tu archivo `llibre-sencer.html` no es un documento.
Es un **ataque de denegación de servicio contra el DOM**.

* 203.000 líneas ≠ HTML → es **un heap preasignado**
* `highlight.js` global ≠ utilidad → es **bloqueo síncrono masivo**
* imágenes sin lazy ≠ descuido → es **asfixia de RAM**

👉 Estás cargando TODO el universo antes del primer scroll.
En un iPad A10 eso es equivalente a: *crash elegante*.

---

# ⚔️ RESPUESTA ARQUITECTÓNICA (VANILLA JS, LOCAL-FIRST, SIN EXCUSAS)

---

## 1. 🧩 FRAGMENTACIÓN OFFLINE REAL (DOM ≈ 0)

### 💣 PRINCIPIO:

> El DOM inicial debe ser prácticamente vacío.

No “ligero”.
**Vacío.**

---

## 🔥 SOLUCIÓN: “HTML COMO DATA SOURCE, NO COMO DOM”

### 👉 Preprocesado (UNA VEZ)

Rompe el monolito en chunks físicos:

```
/book/
  index.json
  cap-001.html
  cap-002.html
  cap-003.html
```

### index.json:

```json
[
  { "id": "cap-001", "title": "Introducción" },
  { "id": "cap-002", "title": "Capítulo 1" }
]
```

---

## 🧠 CORE RUNTIME (ULTRA LIGERO)

```html
<body>
  <nav id="toc"></nav>
  <main id="viewer"></main>
</body>
```

---

### 🚀 Loader incremental

```js
const viewer = document.getElementById('viewer');

async function loadChapter(id) {
  const res = await fetch(`/book/${id}.html`);
  const html = await res.text();

  // ⚠️ NO innerHTML directo masivo
  const template = document.createElement('template');
  template.innerHTML = html;

  viewer.replaceChildren(template.content);
}
```

---

### 🧭 Navegación perezosa

```js
async function init() {
  const res = await fetch('/book/index.json');
  const index = await res.json();

  const toc = document.getElementById('toc');

  index.forEach(ch => {
    const btn = document.createElement('button');
    btn.textContent = ch.title;

    btn.onclick = () => loadChapter(ch.id);

    toc.appendChild(btn);
  });
}

init();
```

---

### 🧬 OPCIÓN MÁS SALVAJE (RECOMENDADA)

👉 **Streaming manual por scroll**

```js
let current = 0;
let loading = false;

async function loadNext() {
  if (loading) return;
  loading = true;

  const id = chapters[current++];
  const res = await fetch(`/book/${id}.html`);
  const html = await res.text();

  const frag = document.createRange().createContextualFragment(html);
  viewer.appendChild(frag);

  loading = false;
}

window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
    loadNext();
  }
});
```

---

## 🧨 RESULTADO

* DOM inicial → ~0 nodos
* RAM → controlada
* Render → progresivo
* UX → instantánea

---

# 2. 🛡️ DEFENSA TEMPRANA (IMÁGENES + REFLOW)

---

## 🔥 REGLAS ABSOLUTAS (NO NEGOCIABLES)

### 1. TODAS las imágenes:

```html
<img 
  src="img.jpg"
  loading="lazy"
  decoding="async"
  width="800"
  height="600"
/>
```

---

### ❗ CRÍTICO:

**SI NO DEFINES width/height → MUERTE POR REFLOW**

---

## 🧠 PLACEHOLDER ANTI-JANK

```css
img {
  background: #eee;
  aspect-ratio: attr(width) / attr(height);
}
```

---

## 🚀 INTERSECTION OBSERVER (CONTROL TOTAL)

```js
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  });
});

document.querySelectorAll('img[data-src]').forEach(img => {
  observer.observe(img);
});
```

---

## 🧨 BONUS RADICAL

👉 Destruye imágenes fuera de viewport:

```js
if (!entry.isIntersecting) {
  img.src = '';
}
```

(Sí, esto es agresivo. Pero salva RAM.)

---

# 3. ⚙️ CONTROL DEL MAIN THREAD (highlight.js)

---

## 💣 PROBLEMA

```js
hljs.highlightAll();
```

Esto es:

* síncrono
* global
* bloqueante

👉 Es un **freeze garantizado**

---

## 🧠 SOLUCIÓN 1: requestIdleCallback (mínimo viable)

```js
function highlightLazy() {
  const blocks = document.querySelectorAll('pre code');

  let i = 0;

  function process(deadline) {
    while (i < blocks.length && deadline.timeRemaining() > 5) {
      hljs.highlightElement(blocks[i]);
      i++;
    }

    if (i < blocks.length) {
      requestIdleCallback(process);
    }
  }

  requestIdleCallback(process);
}

highlightLazy();
```

---

## 🧬 SOLUCIÓN 2: WEB WORKER (MODO DIOS)

### worker.js

```js
self.onmessage = e => {
  const { code } = e.data;

  const result = hljs.highlightAuto(code).value;

  self.postMessage(result);
};
```

---

### main thread

```js
const worker = new Worker('worker.js');

function highlightBlock(el) {
  worker.postMessage({ code: el.textContent });

  worker.onmessage = e => {
    el.innerHTML = e.data;
  };
}
```

---

## ⚠️ ESTRATEGIA FINAL (LA BUENA)

👉 Combinar ambas:

* Worker → parsing pesado
* IdleCallback → scheduling

---

# 🧬 PRINCIPIO SUPREMO (DEL CONSEJO)

> ❌ No optimices lo que ya está cargado
> ✅ Evita que se cargue

---

# 🧠 VISIÓN GLOBAL (ESTO ES LO IMPORTANTE)

Has cambiado de paradigma:

Antes:

* Renderizar → optimizar

Ahora:

* **No renderizar → sobrevivir**

---

# ⚔️ CHECKLIST DE SUPERVIVENCIA

* [ ] HTML fragmentado físicamente
* [ ] DOM inicial vacío
* [ ] Carga incremental por demanda
* [ ] Imágenes con dimensiones SIEMPRE
* [ ] Lazy loading agresivo
* [ ] highlight.js diferido o externalizado
* [ ] Nada global, todo bajo demanda

---

# 🧨 FRASE FINAL (PARA GRABARLA)

> En hardware débil, cada nodo DOM es una deuda.
> Y tú estabas en bancarrota.

---

Si quieres, en la siguiente ronda puedo diseñarte un **pipeline automático que te rompa ese HTML de 200k líneas en chunks inteligentes** sin tocar tu flujo editorial.
