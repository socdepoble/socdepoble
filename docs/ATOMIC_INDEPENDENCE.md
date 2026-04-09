> 📂 **Arxiu/Ruta:** `./docs/ATOMIC_INDEPENDENCE.md`

# SISTEMA DE DISEÑO NIVEL DIOS — AUDITORÍA MATEMÁTICA

## Fallos estructurales detectados (y blindaje aplicado)
1. **Colisión de capas por z-index arbitrario** → se forzó contrato `z-token-*` mapeado a `--z-*`.
2. **Riesgo de layout shift por scrollbars variables** → `stable-scroll` usa `scrollbar-gutter: stable both-edges`.
3. **Átomos mutando a su padre por márgenes externos** → regla dura: componentes reutilizables sin `m-*` externo.
4. **Subpíxeles acumulados en gaps** → uso de `clamp()` para gaps y unidad consistente en spacing tokens.

## Ecuación de layout determinista (Shell)
- Altura útil: `H_usable = 100dvh - spacing-header`.
- Rail fija: `W_rail = spacing-sidebar`.
- Main fluido: `W_main = W_viewport - W_rail` (desktop) y `W_main = W_viewport` (mobile).
- Scroll sin salto: `W_content = W_main - gutter_stable` con gutter pre-reservado.

## Patrón definitivo SCA (Shell / Celda / Átomo)
- **Shell**: define solo geometría macro y capas.
- **Celda**: organiza stacking interno (`atom-stack`, grids internos, virtualización).
- **Átomo**: ocupa su celda (`w-full h-full min-w-0 min-h-0`) y no emite efectos laterales.

## Reglas de oro auditable
- [ ] Nunca `!important`.
- [ ] Nunca `z-[arbitrario]`; solo tokens.
- [ ] Nunca ancho fijo en átomos (`w-[300px]`) salvo media interna explícita.
- [ ] Nunca margen externo en componente reutilizable.
- [ ] Siempre `box-border` + `min-w-0 min-h-0` para evitar desbordes fantasma.
- [ ] Scroll encapsulado por celda (`stable-scroll`) y no global.
- [ ] Overlay/backdrop solo desde shell, jamás desde átomo.

## Aplicación a vistas pesadas
- **Feed**: lista virtualizable de `FeedPostCard` en celda `stable-scroll`.
- **Marketplace**: grid `repeat(auto-fit, minmax(16rem,1fr))` dentro de celda; tarjetas sin márgenes externos.
- **ChatLayout**: columnas con `minmax(0,1fr)`; paneles internos con `atom-fill`.
