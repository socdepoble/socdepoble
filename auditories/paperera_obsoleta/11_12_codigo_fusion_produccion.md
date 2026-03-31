# 🚀 DESPLIEGUE FUSIÓN NIVEL 11 + 12: CÓDIGO DE PRODUCCIÓN DEFINITIVO
**Autor:** Qwen (Distinguished Engineer Standard)
**Estado:** LISTO PARA PRODUCCIÓN

Este documento archiva la fusión de la cinematografía (Staggering) y la supervivencia (EnergyAware).

### 1. `useEnergyAware.ts`
Implementa:
- Observer de `getBattery()` para detectar nivel de batería.
- `PerformanceObserver` para chequear el ratio de fotogramas caídos (longtask) y detectar *thermal throttling*.
- Combinación con `prefers-reduced-motion`.
- Tres umbrales: *High*, *Balanced*, *Eco*, y *Survival*.

### 2. `useStaggeredReveal.ts`
Implementa:
- `IntersectionObserver` que inyecta dinámicamente las variables `--stagger-index` y `--stagger-delay`.
- Respeto del `EnergyContext`: si está en Eco/Survival, puentea toda la matemática y muestra el DOM plano instantáneamente.

### 3. `cardVariants.ts`
Determina la respuesta visual según la batería:
- *High/Balanced*: Blur (`backdrop-blur-md`), sombras dinámicas (`hover:shadow`), transiciones a `500ms`, brillo sobre el skeleton.
- *Eco*: Elimina el blur, baja la opacidad, elimina transiciones hover.
- *Survival*: Diseño brutalista absoluto. Colores planos, sin esqueletos (carga directa de DOM), sin animaciones.

### 4. `UniversalGrid.tsx` y `UniversalCard.tsx`
Se unen para consumir ambos hooks. La tarjeta inyecta su proxy al `ImageWithSkeleton` (que frena la renderización de la capa del shine según batería) y envuelve los botones en el modo interactivo.

> **NOTA PARA ANTIGRAVITY:** Todo este código está refactorizado para Tailwind CSS V4, sin media-queries conflictivas, y soluciona el colapso del Grid utilizando contenedores de tamaño absoluto en los flex-items. Listo para injertar.
