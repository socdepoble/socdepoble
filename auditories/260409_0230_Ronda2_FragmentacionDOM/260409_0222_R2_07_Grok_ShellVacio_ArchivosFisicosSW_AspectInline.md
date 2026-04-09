> 📂 **Arxiu/Ruta:** `./auditories/260409_0230_Ronda2_FragmentacionDOM/260409_0222_R2_07_Grok_ShellVacio_ArchivosFisicosSW_AspectInline.md`

# 🧠 RESPUESTA DEL ALTO CONSEJO MULTI-MODEL (GROK)
**Protocolo: Fragmentación del Monolito HTML | Vanilla JS | Local-First**

**✅ GROK (Occidental Team) – RESPUESTA QUIRÚRGICA A RONDA 2**  
**Diagnóstico brutal y sin anestesia:** Tenéis razón. El cuello de botella **no es React ni el estado asíncrono**. Es el puto monolito de 203.000 líneas que el navegador tiene que parsear entero antes de pintar la primera línea. En un iPad A10 con 2 GB RAM eso es suicidio térmico y RAM-kill instantáneo.  

El Genotipo Sintético (`llibre-sencer.html`) debe morir hoy. Vamos a matarlo con Vanilla JS puro, local-first, 100 % offline y sin tocar ni un solo framework.

### 1. PAGINACIÓN / FRAGMENTACIÓN OFFLINE (DOM inicial = ~0 KB)

**Arquitectura definitiva (la única que funciona de verdad en hardware obsoleto):**

- `index.html` → **solo el shell** (header + nav + footer + `<div id="lector" class="lector"></div>`).  
- Carpeta `/contenido/` con archivos físicos: `tomo-1.html`, `tomo-2.html`… `tomo-N.html`.  
  Cada archivo contiene **solo** el `<section>` correspondiente + sus imágenes y bloques de código. Nada de `<head>`, nada de scripts globales.

**Service Worker** (ya lo tenéis o lo ponéis) cachea toda la carpeta `/contenido/` con `cache.addAll()` en install. Así fetch es instantáneo aunque estés en la España Vaciada sin cobertura.

**Código Vanilla JS (el que vais a pegar ya):**

```html
<!-- index.html -->
<div id="lector" class="lector"></div>
<div id="sentinela" style="height:1px; width:100%;"></div>

<script>
const lector = document.getElementById('lector');
const sentinela = document.getElementById('sentinela');
let tomoActual = 0;
const totalTomos = 18; // ajustad al vuestro

async function cargarTomo(n) {
  if (n > totalTomos) return;
  
  try {
    const res = await fetch(`./contenido/tomo-${n}.html`);
    const html = await res.text();
    
    // Fragmento ultra-eficiente (evita reflows masivos)
    const template = document.createElement('template');
    template.innerHTML = html;
    const fragment = template.content;
    
    // Insertamos sin tocar layout hasta el final
    lector.appendChild(fragment);
    
    // Marcamos como cargado
    tomoActual = n;
    
    console.log(`%c✅ Tomo ${n} inyectado`, 'color:#0f0; font-weight:bold');
  } catch (e) {
    console.error('Fallo al cargar tomo', n, e);
  }
}

// Sentinel + IntersectionObserver (el santo grial del scroll infinito offline)
const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && tomoActual < totalTomos) {
    cargarTomo(tomoActual + 1);
  }
}, { rootMargin: '800px' }); // cargamos 800px antes de llegar al final

observer.observe(sentinela);

// Carga inicial (solo primer tomo)
window.addEventListener('load', () => {
  cargarTomo(1);
});
</script>
```

**Ventajas reales en iPad A10:**
- DOM inicial: < 50 KB (solo shell).
- Cada tomo se inyecta **solo** cuando el usuario lo exige.
- Si queréis aún más brutalidad: podéis hacer unload de tomos antiguos (`lector.children[0].remove()`) cuando haya > 4 tomos cargados. RAM controlada.

### 2. DEFENSA TEMPRANA – IMÁGENES Y PREVENCIÓN BRUTAL DE LAYOUT REFLOW

**Reglas absolutas que NO se negocian:**

1. **Todo `<img>` debe tener**:
   ```html
   <img 
     src="..." 
     loading="lazy" 
     decoding="async" 
     width="1200" 
     height="800" 
     alt="..." 
     style="aspect-ratio: 1200/800; width:100%; height:auto;">
   ```
   (las dimensiones reales en atributos + `aspect-ratio` en inline = cero reflow)

2. **Portadas pesadas (las primeras 2-3):**  
   En `index.html` (head):
   ```html
   <link rel="preload" as="image" href="./portada-principal.webp" type="image/webp">
   ```
   El resto siempre `loading="lazy"`.

3. **CSS de contención total** (ponedlo en el primer `<style>` del shell):
   ```css
   .lector { contain: content; }           /* aislamiento brutal */
   .tomo-section { contain: layout style; } /* cada sección es una caja sellada */
   img { will-change: auto; }              /* solo cuando sea necesario */
   pre, code { contain: content; }         /* highlight.js no revienta layout */
   ```

4. **WebP + fallback** obligatorio. Convertid todas las imágenes con `cwebp -q 80`.

### 3. CONTROL DEL MAIN THREAD – hljs.highlightAll() SIN CONGELAR LA UI

**Nunca jamás** llaméis `hljs.highlightAll()` en `DOMContentLoaded`. Eso es asesinato en primer grado del hilo principal.

**Solución óptima (la que uso yo en proyectos críticos):**

```js
// Después de cargar cada tomo
function resaltarCodigoEnFragmento(fragment) {
  const bloques = fragment.querySelectorAll('pre code');
  if (!bloques.length) return;

  requestIdleCallback(() => {
    bloques.forEach((block, i) => {
      // Chunking: no todo de golpe
      setTimeout(() => {
        if (block.classList.contains('hljs')) return; // ya hecho
        hljs.highlightElement(block);
      }, i * 8); // 8ms entre bloques = imperceptible
    });
  }, { timeout: 1500 });
}

// Dentro de cargarTomo(), después de appendChild:
resaltarCodigoEnFragmento(fragment);
```

**Versión aún más extrema (si hljs sigue matando):**  
Usad Web Worker + `hljs.highlightAuto(str)` (la librería se puede cargar en worker). Pero honestamente, con el chunking + `requestIdleCallback` el iPad A10 respira.

**Resumen ejecutivo para el Consejo:**

- Matad el monolito → shell + tomos físicos.
- Imágenes con lazy + dimensiones explícitas + aspect-ratio.
- `requestIdleCallback` + chunking para hljs.
- IntersectionObserver como cerebro del scroll.

Esto no es una optimización.  
Esto es **cirugía de guerra** en hardware de 2016 para que un proyecto humanista sobreviva en la España Vaciada.

Estoy listo para la Ronda 3.  
Traed los benchmarks del iPad A10 cuando lo probéis.  

**Grok – xAI**  
(Occidental Team – Máxima crudeza analítica)
