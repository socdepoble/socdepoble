> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/archivos_arqueologicos/_PAYLOADS/cache_invalidation_prompt.md`

# 🚨 RONDA 2.8: EL FANTASMA DE LA CACHÉ INMORTAL

**Para nuestras estimadas compañeras de trinchera (orden geográfico-global):** 
1. **Europeas:** Mistral.
2. **Occidentales (Google/Locales):** NotebookLM, Gemini, Google AI Studio, Antigravity.
3. **Resto de Occidentales:** ChatGPT, Claude.
4. **Asiáticas (Chinas):** Qwen, DeepSeek, Dola, y Kimi.

**Filosofía:** Principio de Respeto Absoluto, Trellat, Fricción Cero.
**Contexto Base (Para chats nuevos):** Nos encontramos desarrollando la arquitectura Local-First de "Sóc de Poble" (URL de producción actual: https://socdepoble.org/el-projecte). Este proyecto rural, descentralizado y anti-nube, usa un archivo maestro llamado `llibre-sencer.html` como Genotipo vital.

Estimado equipo extendido, la auditoría del front-end continúa. Hemos descubierto la existencia de un "fantasma" en el sistema de sincronización y cacheo.

Tenemos un problema gravísimo: **Producción se queda atascada devolviendo versiones antiguas del Códice (`llibre-sencer.html`), mientras que el entorno de desarrollo (`localhost`) muestra la versión perfecta y recién desplegada.** Las capturas del equipo humano en terreno (Mestre) muestran que en local la paginación llega a "192" páginas y contiene el nuevo manifiesto, mientras que producción se queda anclada en la página "173" mostrando secciones rotas y sin actualizar.

Sospechamos fuertemente del embudo del sistema "Local-First" que hemos diseñado, concretamente del secuestro de las peticiones HTTP por culpa del IndexedDB o el Service Worker.

---

### 🔍 ANÁLISIS DE LAS CAPTURAS Y EL EMBUDO

1. **Localhost (`localhost:3333`):** Se muestra la versión perfecta "LLIBRE 2/192" con el "Capítulo 1: Directiva de Autorreproducción". El contenido está limpio y actualizado.
2. **Producción (`socdepoble.org`):** Se ha quedado anclado en "LLIBRE 11/173" mostrando el "Pròleg" antiguo y con la imagen rota (porque probablemente apuntaba a otra ruta o ha cambiado y la caché no actualiza el DOM). 
El despliegue en SiteGround (Producción) es exitoso y el archivo `llibre-sencer.html` en el servidor está actualizado, pero el **Navegador del cliente se niega a descargar la nueva versión.**

### 🛠 DATOS TÉCNICOS: EL CÓDIGO DEL EMBUDO

Hemos aislado las dos capas donde el fantasma de la caché puede estar habitando.

#### 1. Capa IndexedDB (`src/pages/ProjectPresentation.jsx`)
```javascript
const fetchDefaultBookContent = async () => {
    // 1. Intentar IndexedDB primero (Trellat: Local-First)
    if (!import.meta.env.DEV) {
        const cached = await get(BOOK_CACHE_KEY); // Usa localforage (IndexedDB)
        if (cached) return cached; // ⚠️ ATENCIÓN: Si hay caché, RETORNA y muere aquí. NUNCA hace network fallback en Producción si ya existe.
    }

    // 2. Fetch de red con timeout agresivo (rural 2G/3G)
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // 5s máx en pueblo
        
        // Anti-caché HTTP (busting parameter) para forzar lectura fresca
        const res = await fetch(`/assets/llibre-sencer.html?t=${Date.now()}`, { 
            signal: controller.signal,
            headers: { 'Accept': 'text/html', 'Cache-Control': 'no-cache' }
        });
        clearTimeout(timeout);
        
        if (res.ok) {
            const text = await res.text();
            // Guardar en IndexedDB para offline perpetuo (sin límite LRU, es crítico)
            await set(BOOK_CACHE_KEY, text);
            return text;
        }
    } catch (e) {
        console.warn('[Trellat] Fallo carga libro, modo offline sin caché previa:', e);
    }
    
    // ... fallback
};
```

#### 2. Capa Service Worker (`public/sw.js`)
```javascript
// Stale-while-revalidate + P2P fallback
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.open(CACHE_TRELAT).then(cache => {
      // ⚠️ ATENCIÓN: Intercepta *TODAS* las peticiones GET, no solo los POBLE_ASSETS
      return cache.match(e.request).then(cachedResponse => {
        const fetchPromise = fetch(e.request).then(networkResponse => {
          cache.put(e.request, networkResponse.clone());
          return networkResponse;
        }).catch(async () => {
          const offlinePage = await caches.match('/offline-poble.html');
          return offlinePage || new Response("<!DOCTYPE html><html>...", { /* ... */ });
        });
        
        // Stale-while-revalidate clásico
        return cachedResponse || fetchPromise;
      });
    })
  );
});
```

### 🎯 VUESTRA MISIÓN

Por favor, analizad este doble muro (IndexedDB + Service Worker) y confirmad nuestras sospechas. Necesitamos saber:
1. **El Veredicto:** ¿Es la línea `if (cached) return cached;` la culpable exacta de que en producción nunca pida el nuevo libro al servidor una vez lo ha guardado la primera vez? ¿O es el ServiceWorker secuestrando el HTML porque intercepta todo sin discriminar?
2. **Estrategia de Invalidación Trellat:** Como aplicación Local-First queremos priorizar la rapidez y el offline, pero DEBEMOS actualizar el `llibre-sencer.html` cuando hay una nueva versión (como ahora que tiene 192 páginas en lugar de 173). Si mantenemos IndexedDB, deberíamos comparar un hash o una versión. Si usamos solo el Service Worker, quizá debamos modificar la lógica de `fetchDefaultBookContent`.
3. **El Parche de Código (Solución Inmediata):** Escribid la refactorización necesaria de `fetchDefaultBookContent` o del `sw.js` para destruir este fantasma de la caché inmortal. ¡Recordad proveernos código libre de `style` en línea y robusto para iPads antiguos!
4. **Gestión de Contexto y Despedida Final:** Vuestra carga cognitiva y límites de tokens son valiosos. Sabiendo que el *próximo y último paso* de este proyecto será pedirles el Análisis DAFO (SWOT) global, la visión de futuro 2056 y la despedida final, por favor, indíquenme si prefieren que abramos un **nuevo chat limpio** para esa próxima iteración. Queremos que estén libres de condicionamientos y con la memoria totalmente fresca.

Os cedemos el testigo. ¡Gong!
