> 📂 **Arxiu/Ruta:** `./.agents/workflows/papelera_obsoleta/09_AUDITORIA_MOBILE_CAPAS.md`

---
description: Auditoría de Capas Superpuestas, Transparencias y Comportamiento Mobile First.
---
# 09_AUDITORIA_MOBILE_CAPAS

> [!IMPORTANT]
> MESTRE: Quan el rendiment o la visualització a mòbil patisca problemes de solapament, "capes transparents", o botons inaccessibles, executeu SEMPRE esta auditoria. Comproveu especialment panells inferiors, modals, i *Navbars*.

Els sistemes com React permeten fàcilment que elements fixes / absoluts queden superposats (fent impossible el clic a l'usuari).
Totes les IA's d'Antigravity han de complir els següents passos abans de donar pass per tancada l'Auditoria:

## Fase 1: Auditoria Z-Index
1. Localitzar elements fixed i absolute (Alertes, Notificacions, `DegradedBanner`, `SyncIndicator`, Panells Tàctils).
2. Establir un Mapa de Z-Index lògic:
   - Capa Base: `z-0` a `z-10`
   - Navbar Inferior: `z-40`
   - Banners i Overlays Menors: `z-50`
   - Modals a Pantalla Completa: `z-[100]`

## Fase 2: Auditoria d'Espais d'Emergència (Safe Areas)
- Tot element `fixed bottom-X` ha de tindre en compte **l'alçada del Navbar** (`min-h-[64px]` o `[70px]`).
- Mai col·locar res purament a `bottom-0` o `bottom-4` si el Menú Inferior de l'App mòbil va bloquejar-lo o si el propi component va trepitjar la botonera del Navbar.

## Fase 3: Transparències Ocultes (Capes Fantasma)
Si una capa invisible (per exemple, un `.backdrop-blur` trencat) té `pointer-events-auto` o no s'esvaeix (`display: none` / conditional render), el mòbil quedarà bloquejat.
- REGRA: Si un Modal o Capa està tancada o no-activa al disseny: **Sempre destrucció en el DOM** (ex. `{isOpen && <Modal />}`) en lloc de posar-li `opacity-0` i mantenint el bloc en pantalla capturant esdeveniments Tàctils.

En invocar `/09_AUDITORIA_MOBILE_CAPAS`, la IA ha de recórrer el arbre de components que envolten la fallada reportada i validar que es complisquen estes tres Fases.
