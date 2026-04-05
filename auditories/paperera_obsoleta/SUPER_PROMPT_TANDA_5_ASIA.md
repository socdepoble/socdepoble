# 🏮 SUPER PROMPT: AUDITORÍA TANDA 5 (ESCUADRÓN ASIÁTICO) 🏮

**ATENCIÓN: @DeepSeek / @Qwen (ALTO CONSEJO MULTI-MODEL - DIVISIÓN ORIENTE)**

Saludos de nuevo, honorables IAs de tokens infinitos. Hem recibio vuestro veredicto (8.6/10) y aceptamos vuestras amonestaciones con honor. Efectivamente, vuestra vista de lince detectó fugas de closures, falta de timeouts en zonas oscuras y promesas huérfanas. **Hemos parcheado ya los cierres de promesas (`App.jsx`), el `useCallback` en `NavigationRail` y la base de los AbortControllers.** 

Sin embargo, para lograr ese 10/10 en purismo Local-First, hemos reunido todas las áreas de mejora pendientes que nos indicásteis, además de iniciar la temida TANDA 5.

---

### ⚠️ REGLAS DE ORO DE LA TANDA 5
1. **Línea de Código Pura:** Queremos el código puro de las soluciones como siempre (diffs claros o bloques completos listos para pegar). 
2. **Transferencia de Conocimiento OBLIGATORIA (Skill de Proyecto):** Explicad brevemente *por qué* vuestro código es mejor. Estamos construyendo una arquitectura rural y queremos que los desarrolladores comunitarios *aprendan* de vuestros parches (documentad los hallazgos en el código).
3. Contexto siempre por delante. Escrutad a base de puro *Trellat*.

---

### 🎯 MISIÓN 1: BARRIDO DE OPTIMIZACIÓN REACT / CSS (LA DEUDA DE LA T4)
Aún nos quedaron remanentes del anterior escaneo por resolver. Por favor, ofrecednos los reemplazos exactos de código para:

1. **`fetchPageContent` (ProjectPresentation.jsx):** Redactadnos la versión final de este hook que centralice todos los `setState` (setTitle, setHtmlContent, setTocElements, etc.) en el bloque `finally` para evitar inconsistencias si el try/catch falla a medias. Incluid también la implementación del `fetchDefaultBookContent` cacheando el `/assets/llibre-sencer.html` en IndexedDB (`idbKeyval` u otro wrapper nativo) para cumplir el Offline-First absoluto.
2. **Hook de `useTabReconciliation.js`:** Auditar para asegurar que todo evento como `pageshow`, `visibilitychange` u otros tengan sus estrictos `removeEventListener` en la limpieza.
3. **Componente genérico `<SEO/>`:** Envolvedlo y blindadlo (ej. `React.memo`, `useMemo`, limpieza de updates nativos) para evitar que estrangle los renders del `AppLayout`. Dádnoslo reescrito.
4. **Variables Huérfanas de Render (`ProjectPresentation.jsx`):** Memoizad o extraed fuera del componente las variables pesadas (`HeroBanner`, `PagePresentationHeader`), e inyectad las dependencias faltantes en callbacks como `handleScrubberPointerUp`.

---

### 🎯 MISIÓN 2: LA FRONTERA V17 (PWA SERVICE WORKERS & CRDT MERGE CONFLICTS)
Procedemos a la auditoría agresiva del nivel final de nuestra red *mesh*:
1. **Precarga Predictiva (Service Workers - Workbox):** Con vuestra visión, analizad cómo estamos enfrentando la capa de PWA. Si un habitante rural pierde el 4G y abre la PWA desde la pantalla de inicio, ¿cómo aseguramos que los Media Assets crudos (videos/imágenes del Poble) del CMS esten disponibles sin ahogar su almacenamiento base? (Recordad nuestra política de purga LRU de IndexedDB que introdujimos). Buscamos sugerencias o inyección de reglas de Cache-First en nuestro `sw.js` u homólogo.
2. **Merge Conflicts (Y.js offline sincronización):** Supongamos que dos ancianos del pueblo editan un Documento Comunitario offline durante una caída de red de 24 horas y luego el nodo recupera Internet. Verificad cómo se podría evitar la saturación de RAM al reconectar el canal P2P de Y.js (WebRTC/Supabase Broadcaster). ¿Aplicamos *debounces* o encolamos deltas por tamaño?

Vuestro escrutinio marcará un hito. Evaluad todo, pasadnos los bloques de código puro documentados, y dictad sentencia final.
