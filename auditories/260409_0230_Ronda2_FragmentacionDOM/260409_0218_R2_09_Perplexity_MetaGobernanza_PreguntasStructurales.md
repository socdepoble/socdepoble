> 📂 **Arxiu/Ruta:** `./auditories/260409_0230_Ronda2_FragmentacionDOM/260409_0218_R2_09_Perplexity_MetaGobernanza_PreguntasStructurales.md`

# 🧠 RESPUESTA DEL ALTO CONSEJO MULTI-MODEL (PERPLEXITY)
**Protocolo: Fragmentación del Monolito HTML | Vanilla JS | Local-First**

Sí: el problema ya no es el framework; es el **peso inicial del documento** y el trabajo síncrono en el hilo principal. La solución correcta en Vanilla JS es convertir el HTML en una carga por trozos, proteger las imágenes desde el primer render y posponer el resaltado de código hasta que el navegador esté libre. [marco-c.github](https://marco-c.github.io/2018/10/16/using-requestidlecallback-for-long-running-computations.html)

## 1) Fragmentación offline

La estrategia más sólida es **no meter el libro entero en el DOM al arranque**. En su lugar, guarda cada tomo/sección como fragmentos HTML separados dentro del paquete PWA, renderiza solo un esqueleto mínimo y va inyectando bloques bajo demanda cuando el usuario pulsa “siguiente”, abre un índice o se acerca al final de la sección actual. [daltonwalsh](https://daltonwalsh.com/blog/dynamically-load-more-in-wordpress-with-js/)

Arquitectura práctica:
- `index.html` mínimo con shell, navegación y un contenedor vacío.
- Un `manifest` local y un `service worker` que cachee `index.html`, los fragmentos y assets.
- Un archivo de metadatos local tipo `chapters.json` que liste secciones, tamaños y rutas.
- Carga de cada bloque con `fetch()` sobre archivos locales cacheados, y `insertAdjacentHTML()` o `Range.createContextualFragment()` para insertar solo lo necesario. [designsystem.porsche](https://designsystem.porsche.com/v4/must-know/initialization/vanilla-js/)

Regla de oro: **un solo capítulo visible, un siguiente pre-cargado, y el resto fuera del DOM**. Si el libro es secuencial, usa paginación lineal; si el usuario salta con el índice, carga solo esa sección y conserva un historial de fragmentos ya visitados para no repintar de nuevo. [daltonwalsh](https://daltonwalsh.com/blog/dynamically-load-more-in-wordpress-with-js/)

## 2) Imágenes y reflow

Las imágenes pesadas deben seguir una política estricta: las de arriba del primer viewport se cargan normal, y todas las demás con `loading="lazy"`. Además, pon siempre `width` y `height` explícitos para reservar espacio y evitar Cumulative Layout Shift y reflows brutales. [web](https://web.dev/articles/browser-level-image-lazy-loading)

Reglas absolutas:
- Portada y hero: `fetchpriority="high"` si son críticas, sin lazy-loading. [web](https://web.dev/articles/browser-level-image-lazy-loading)
- Resto: `loading="lazy"` y dimensiones fijas siempre. [web](https://web.dev/articles/browser-level-image-lazy-loading)
- Usa `aspect-ratio` o contenedores con tamaño reservado para evitar saltos de layout. [web](https://web.dev/articles/browser-level-image-lazy-loading)
- No inserciones imágenes “sin hueco”; primero el contenedor, luego la imagen. [web](https://web.dev/articles/browser-level-image-lazy-loading)

Si quieres blindaje extra, añade `content-visibility: auto` en bloques largos fuera de pantalla y `contain-intrinsic-size` para reservar espacio. Eso ayuda a que el navegador no procese secciones enteras hasta que sean relevantes, reduciendo pintura y trabajo de layout.

## 3) Main thread y hljs

`hljs.highlightAll()` no debería ejecutarse en el arranque: es trabajo de baja prioridad y debe ir diferido. La opción más limpia aquí es usar `requestIdleCallback()` con `timeout`, y solo si no existe soporte, caer a `setTimeout()`. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)

Estrategia recomendada:
- Carga `highlight.js` solo cuando exista al menos un bloque de código visible o recién insertado.
- Resalta por lotes, no todo el documento de una vez.
- Lanza el resaltado en periodos de inactividad del navegador, no durante el primer paint. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)
- Si el volumen es enorme, procesa fragmentos por tandas; un Web Worker puede ayudar en cálculo puro, pero para DOM real el worker no pinta nada y no resuelve la parte visual por sí solo. [marco-c.github](https://marco-c.github.io/2018/10/16/using-requestidlecallback-for-long-running-computations.html)

Patrón base:
```js
function scheduleHighlight(root) {
  const run = () => {
    root.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));
  };
  if ('requestIdleCallback' in window) {
    requestIdleCallback(run, { timeout: 1500 });
  } else {
    setTimeout(run, 0);
  }
}
```

## Secuencia operativa

1. Arranca con HTML mínimo y sin el libro completo en el DOM.
2. Cachea todos los fragmentos en el service worker para que el modo offline funcione.
3. Carga el primer bloque, deja el resto fuera.
4. Pinta imágenes con dimensiones fijas y lazy-loading para todo lo secundario. [web](https://web.dev/articles/browser-level-image-lazy-loading)
5. Ejecuta resaltado de código solo cuando el navegador esté ocioso. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)
6. Pre-carga el siguiente fragmento mientras el usuario lee el actual, pero nunca todo a la vez. [designsystem.porsche](https://designsystem.porsche.com/v4/must-know/initialization/vanilla-js/)

## Decisión brutal

La prioridad arquitectónica es: **fragmentar el HTML antes que optimizar el framework**. Si el DOM pesa 0 al inicio, el iPad antiguo deja de morir por memoria y el resto de optimizaciones empieza a tener sentido. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)

La segunda prioridad es blindar imágenes y reflow, porque en documentos largos con muchas portadas el daño visual y de memoria es inmediato. La tercera es sacar `highlight.js` del arranque y convertirlo en una tarea de baja prioridad. [marco-c.github](https://marco-c.github.io/2018/10/16/using-requestidlecallback-for-long-running-computations.html)
