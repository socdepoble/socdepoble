> 📂 **Arxiu/Ruta:** `./docs/PHASE6_GOD_TIER_PROTOCOL.md`

# FASE 6 — PROTOCOLO NIVEL DIOS (60 FPS + 10K NODOS)

## 1) Virtualización nativa para Feed/Chat
- Adoptar virtualización por ventana con overscan dinámico (base 8, subir a 14 en fling scroll).
- Render objetivo por frame: `visibleRows + overscan*2`.
- Para 10,000 mensajes: DOM vivo recomendado `< 120` nodos.
- Mantener altura estimada por fila para O(1) cálculo de offsets; reconciliar medidas reales en idle.

## 2) Pipeline de render 60fps
- Separar capas:
  - **Layout crítico:** shell/grid.
  - **Contenido pesado:** listas virtuales.
  - **FX glass:** contenedores parent, no repetidos por item.
- Limitar blur/backdrop en listas masivas (usar degradación adaptativa por batería/dispositivo).
- Presupuesto por frame: 16.6ms (JS < 6ms, Layout/Paint < 8ms, margen 2.6ms).

## 3) Capa universal de diseño
- Primitivas obligatorias: `UiButton`, `UiInput`, `UiText`, `UiSurface`.
- Tokens únicos de interacción: focus ring, radius, haptics, elevation.
- No usar clases ad-hoc para botones/inputs en vistas; solo variantes declarativas.

## 4) Próximos cuellos de botella
1. **GC churn** por objetos efímeros en render de listas.
   - Mitigar: memo por fila, callbacks estables, pooling de objetos de estilo.
2. **Portal z-bleed** en modales/toasts.
   - Mitigar: capa única de portales con z-index tokenizado.
3. **Layout thrashing** por lecturas/escrituras mezcladas.
   - Mitigar: `requestAnimationFrame` batching y `ResizeObserver` desacoplado.
4. **Backpressure de red/chat**.
   - Mitigar: colas por prioridad, chunking y flush incremental.

## 5) KPI obligatorios
- FPS p95 > 55 en móvil medio.
- Long tasks >50ms: 0 en interacción principal.
- Tiempo de commit React p95 < 12ms en listas activas.
- Memoria heap estable (sin crecimiento sostenido > 5 min scroll).
