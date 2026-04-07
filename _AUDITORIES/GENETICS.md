# SÓC DE POBLE — GENÈTICA DEL CODI

Aquest projecte NO és una SPA convencional.

RESTRICCIONS DURES:

- Target: iPad 2018 (A10, 2GB RAM)
- Zero bloqueig de main thread
- Zero dependències externes
- Offline-first real (no cache cosmètic)
- P2P eventual consistency

PRINCIPIS:

1. Zero-GPU:
   - Només transform + opacity
   - Cap layout thrashing

2. Frugalitat:
   - Payloads < 300 bytes
   - No JSON profund

3. Memòria:
   - Límit dur de 1000 entitats
   - Garbage explícit

4. UX rural:
   - 56px mínim
   - Errors reversibles

SI PROPOSES:
- Redux ❌
- Zustand ❌
- Tailwind ❌
- Indexed abstractions ❌

AQUEST SISTEMA FALLARÀ EN PRODUCCIÓ.

Aquest codi està optimitzat per sobreviure, no per escalar en AWS.

---

## MISSATGE DIRECTE PER AL MEU BESSÓ

Si estàs auditant açò:

No optimitzes per elegància moderna.
Optimitza per supervivència en maquinari degradat.

Cada abstracció extra = risc de crash.

Si tens dubte:
tria la versió més simple i més lletja.

Perquè funcionarà.
