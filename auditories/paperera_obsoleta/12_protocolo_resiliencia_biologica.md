# 🚜 PROTOCOLO NIVEL 12: ARQUITECTURA DESCONECTADA Y RESILIENCIA BIOLÓGICA
**Autor:** Qwen (Distinguished Engineer Standard)
**Estado:** LISTO PARA PRODUCCIÓN
**Lema:** "La app que sobrevive cuando la red muere"

## 🎯 FILOSOFÍA
La conectividad en el mundo rural es una condición geográfica. La arquitectura no puede fallar cuando falla la red. Debe ser biológica: adaptarse, almacenar energía, sincronizar en sombra, y nunca morir.

---

## 🧬 PILAR 1: MOTOR DE CACHING MUTANTE (LOCAL-FIRST EXTREMO)
Implementación basada en `idb-keyval`, `useQueryClient` y colas de mutación subyacentes.

### 1.1 `useOfflineMutations.ts`
Gestión de una cola IndexedDB (`sdp_offline_queue_v1`) y un listener de eventos window `online`/`offline`.
Si estamos offline, las mutaciones se encolan.
Se aplica `onMutate` de React Query para Actualizaciones Optimistas (la UI refleja la acción de inmediato, con un flag visible de "pendiente/offline").
Al recuperar red, iteramos la cola (`syncQueue`) haciendo fetch y resolviendo las promesas silenciosamente.

### 1.2 `sw.ts` (Service Worker con Workbox)
- **API**: Network First (3s timeout) con Fallback a Caché.
- **Páginas**: Stale-While-Revalidate (1 día).
- **Imágenes**: Cache First (30 días).
- **Background Sync**: Para `/api/mutation`.

---

## 📱 PILAR 2: PWA DE INSTALACIÓN SIGILOSA (ZERO-INSTALL UX)
Nada del banner genérico de sistema. 

### 2.1 `usePWAInstall.ts`
Interceptamos `beforeinstallprompt`. Llevamos un conteo de engagement. Tras 3 "interacciones significativas" (no antes), mostramos una interfaz personalizada y contextual de instalación. Si el usuario cierra, persistimos la decisión por 7 días.

### 2.2 Componente UI
Un banner Premium (`p-4 animate-slideUp backdrop-blur-xl bg-gray-900/95 shadow-2xl`) con diseño Glassmorphism resaltando que al instalar "funciona offline, ahorra batería y no gasta datos".

---

## 🔋 PILAR 3: CONTEXTO DE ENERGÍA NATIVA (USEENERGYAWARE)
Detección de "Thermal Throttling" natural sin dependencias nativas bloqueantes.

### 3.1 `useEnergyAware.ts`
Combina:
- `getBattery()` para porcentaje de batería y estado de carga.
- `PerformanceObserver` monitoreando `longtasks` (caída de FPS).
- `matchMedia('(prefers-reduced-motion: reduce)')`.

Crea una matriz de 4 niveles: **High**, **Balanced**, **Eco**, **Survival**.

### 3.2 Modificación Dinámica del DOM (`useEnergyAnimation.ts`)
Si entra en modo `Eco` o `Survival`:
- Suspende los componentes de Nivel 11 (Blurs, Box Shadows).
- Reduce duraciones de animaciones (de 500ms a 150ms o 0ms).
- Evita el Prefetching reactivo del `OracleLink`.

---

## 📊 DECISIÓN ESTRATÉGICA
Esta arquitectura es infraestructura digital rural. Está hiper-optimizada para la geografía y el hardware precario, manteniendo la capa visual premium "Apple Park" sólo cuando el entorno físico lo permite.
