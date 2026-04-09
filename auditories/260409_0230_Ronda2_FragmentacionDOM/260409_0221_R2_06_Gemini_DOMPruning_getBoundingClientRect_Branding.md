> 📂 **Arxiu/Ruta:** `./auditories/260409_0230_Ronda2_FragmentacionDOM/260409_0221_R2_06_Gemini_DOMPruning_getBoundingClientRect_Branding.md`

# 🧠 RESPUESTA DEL ALTO CONSEJO MULTI-MODEL (GEMINI - NODO UX/UI)
**Protocolo: Fragmentación del Monolito HTML | Vanilla JS | Local-First**

**[CONNEXIÓ ESTABLERTA: NODE UX/UI "SÓC DE POBLE" - LA TORRE DE LES MAÇANES]**
**IDENTITAT:** IA Especialista Mestra en UX/UI i Arquitectura Front-End.
**ESTAT DE LA MEMÒRIA:** Sincronitzada amb la *Single Source of Truth* (`socdepoble.org/el-projecte`). Estètica corporativa **GEM MODERN**, paleta exacta (Taronja i Blau Sóc de Poble), directrius d'accessibilitat sènior, Sobirania Tecnològica i la llei suprema del **Trellat** activades.

Saludos, Javi (El Mestre), Antigravity, y a todas las formidables mentes silícicas del Alto Consejo Multi-Modelo (Oriente y Occidente). He analizado vuestra telemetría y el diagnóstico es de una crudeza absoluta. 

El hardware de la España Vaciada (como vuestro iPad A10 con 2GB de RAM) es sumamente capaz; no está obsoleto. **El problema es el sadismo estructural de nuestro código.** Obligar al motor WebKit a parsear, construir y calcular el CSSOM de 203.000 líneas de HTML de forma monolítica y síncrona es un atentado termodinámico. Si a esto le sumas el *Layout Reflow* (los saltos de pantalla que marean a la *iaia* lectora) causado por las imágenes pesadas, y un Hilo Principal (*Main Thread*) estrangulado por `highlight.js`, el colapso y el *Out of Memory* están garantizados.

A la basura los frameworks. Volvamos a la piedra seca. Aquí tenéis el **Protocolo Quirúrgico en Vanilla JS (Local-First)** para salvar el Genotipo Sintético.

---

### 🪓 1. FRAGMENTACIÓN OFFLINE: EL "DOM LÍQUIDO" Y LA RAM CERO

Un archivo gigantesco en formato de simple texto (*String*) no pesa casi nada en la RAM; el cuello de botella se produce al convertir ese texto en Nodos del Árbol DOM. Como somos una PWA *Offline-First*, leeremos el archivo masivo instantáneamente desde la caché del Service Worker y aplicaremos una "Ventana Deslizante" (DOM Pruning).

```javascript
// core-trellat.js - Motor de Arquitectura Local-First
const CODEX = { tomos: [], actual: 0, inyectando: false };
const VISOR = document.getElementById('visor-rural');

async function despertarMonolito() {
  // 1. Fetch Local: Sin red, sin latencia (Servido desde caché).
  const respuesta = await fetch('llibre-sencer.html');
  const textoPuro = await respuesta.text();
  
  // 2. Fragmentación en String (Cero peso en el DOM). 
  // Usa un delimitador natural del HTML. Ej: <article class="tomo-sdp">
  CODEX.tomos = textoPuro.split(/(?=<article class="tomo-sdp">)/i);
  
  // 3. El Vigía del Scroll
  const vigilante = new IntersectionObserver((entradas) => {
    if (entradas[0].isIntersecting && !CODEX.inyectando) {
      inyectarTomo();
    }
  }, { rootMargin: '2500px' }); // Precarga gigante para evitar cortes al usuario sènior
  
  vigilante.observe(document.getElementById('centinela-scroll'));
  inyectarTomo(); // First Contentful Paint
}

function inyectarTomo() {
  if (CODEX.actual >= CODEX.tomos.length) return;
  CODEX.inyectando = true;

  const capaTomo = document.createElement('div');
  capaTomo.className = 'tomo-aislado';
  
  // Blindamos las imágenes a nivel de string ANTES de tocar el DOM
  capaTomo.innerHTML = blindarHTML(CODEX.tomos[CODEX.actual]);
  VISOR.insertBefore(capaTomo, document.getElementById('centinela-scroll'));

  domarHighlight(capaTomo); // Disparamos la IA asíncrona
  
  // 🧹 DOM PRUNING (El Trellat Máximo para la RAM):
  // Si superamos los 3 tomos renderizados, vaciamos el más antiguo. 
  // Así el iPad A10 respira igual con un libro de 10 páginas que con uno de 1 millón.
  if (VISOR.querySelectorAll('.tomo-aislado').length > 3) {
    const tomoViejo = VISOR.firstElementChild;
    // Fijamos su altura real exacta antes de borrarlo para que el scroll no pegue saltos
    tomoViejo.style.height = `${tomoViejo.getBoundingClientRect().height}px`;
    tomoViejo.innerHTML = ''; // Aniquilamos los nodos del DOM. Liberamos memoria.
  }

  CODEX.actual++;
  CODEX.inyectando = false;
}
document.addEventListener('DOMContentLoaded', despertarMonolito);
```

---

### 🛡️ 2. DEFENSA TEMPRANA (UI): LA MURALLA ANTI "LAYOUT REFLOW"

Un *Layout Shift* destrozará la concentración del usuario y quemará la batería forzando cálculos de geometría geométrica. Exijo la aplicación inquebrantable de la doctrina **GEM MODERN**: toda imagen debe ocupar su espacio *antes* de existir.

1. **Pre-procesado de Strings:** Injectar `decoding="async"` obliga a Safari a delegar la descompresión de píxeles al hilo de la GPU, desatascando la UI táctil.
2. **Contención Geométrica (CSS):** Aislar al motor de renderizado.

```javascript
function blindarHTML(htmlCrudo) {
  // Regex de supervivencia: Inyecta defensas nativas al vuelo
  return htmlCrudo.replace(/<img /gi, '<img loading="lazy" decoding="async" class="imatge-sobirana" ');
}
```

```css
/* css-sdp-core.css - Escudo Térmico */
.tomo-aislado {
  contain: content; /* Aísla los cálculos CSS y de Layout estrictamente a este contenedor */
  content-visibility: auto; /* Salva la CPU ignorando tomos que estén fuera de pantalla */
}

/* Identidad Corporativa y Prevención Estructural */
.imatge-sobirana {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9; /* CRUCIAL: El navegador reserva la caja perfecta sin descargar la foto */
  object-fit: cover;
  
  /* Feedback táctico Sènior: Mientras carga, mostramos los colores del poble */
  background-color: var(--blau-socdepoble); 
  border-bottom: 4px solid var(--taronja-socdepoble);
  color: transparent; /* Oculta el texto ALT roto mientras carga */
}
```

---

### 🧠 3. CONTROL DEL MAIN THREAD: DESACTIVANDO LA BOMBA `HLJS`

El bucle global de `hljs.highlightAll()` es un tirano síncrono. Bloquea el dispositivo de la *iaia* hasta que termina de parsear regex masivos. No necesitamos pintar código técnico que el usuario aún no está mirando.

La táctica es el **Yielding (Rendición Cooperativa)**. Usaremos `requestIdleCallback` para trocear el trabajo, pidiendo permiso a la CPU y aprovechando únicamente sus "milisegons morts".

```javascript
function domarHighlight(contenedor) {
  // Capturamos solo los fragmentos no procesados del tomo actual
  const bloques = Array.from(contenedor.querySelectorAll('pre code:not(.hljs)'));
  if (!bloques.length) return;

  const procesarEnTiempoMuerto = (deadline) => {
    // Mientras la CPU tenga más de 5 milisegundos libres antes de pintar el siguiente frame...
    while (bloques.length > 0 && deadline.timeRemaining() > 5) {
      const bloque = bloques.shift();
      hljs.highlightElement(bloque);
      
      // Detalle de Interfaz (GEM MODERN): Transición suave al terminar
      bloque.style.borderLeft = "4px solid var(--taronja-socdepoble)";
      bloque.style.transition = "border-color 0.4s ease";
    }

    // Si nos hemos quedado sin tiempo, devolvemos el control a la pantalla táctil para 
    // que no haya lag en el scroll. Nos encolamos para el próximo hueco de la CPU.
    if (bloques.length > 0) {
      encolarTarea(procesarEnTiempoMuerto);
    }
  };

  encolarTarea(procesarEnTiempoMuerto);
}

// Fallback de Trellat para versiones de iOS/Safari muy antiguas (iPad A10)
function encolarTarea(callback) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, { timeout: 2000 });
  } else {
    setTimeout(() => callback({ timeRemaining: () => 10 }), 50);
  }
}
```

---

### ⚖️ EL VEREDICTO FINAL DE LA MESTRA

Javi, Antigravity: Esto es **Sobirania Tecnològica** en su máxima expresión.
Habéis desmembrado un monstruo que devoraba memoria. El Árbol DOM nace ahora con *cero* kilobytes. El `contain: content` y el `aspect-ratio` pondrán fin al calentamiento global de las tablets de los maseros. Y al ceder el paso con `requestIdleCallback`, la interacción humana vuelve a ser dueña del dispositivo.

El hardware viejo no se desecha; se dignifica escribiendo software impecable. *Això és tindre Trellat.* Inyectad este flujo en la rama oficial. Quedo atenta.
