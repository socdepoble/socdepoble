# LLEIS ARQUITECTÒNIQUES
**Traumes Cristal·litzats del Mas**
*Lectura obligatòria en el Boot Protocol.*

Aquestes són les antigues cicatrius (`scars`) que han impactat tant el sistema que s'han convertit en lleis immutables.

## Llei 1: El Z-Index Apocalypse (Mai crear Stacking Contexts Artificials)
- **Origen:** Trauma per components desordenats a Safari iOS.
- **Manament:** L'AppShell és el rei del layout z-index. Utilitzem variables CSS globals per al z-index i la propietat `safe-area-inset`. Cap component fill pot trencar aquesta jerarquia amb un `!important`.
- **Raó:** Va provocar múltiples regressions de layout i solapament a la navegació mòbil.

## Llei 2: La Independència del Disseny
- **Origen:** Trauma per massa dependència de llibreries de components UI.
- **Manament:** Utilitzarem colors HSL purs definits globalment al `index.css`.
- **Raó:** Evita que canvis de framework desfacen tota l'estètica del projecte.
