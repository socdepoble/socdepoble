---
estat: 'canonic'
name: 'governanca-execucio'
version: '14.00'
created_at: '260706_2230'
updated_at: '260705_0916'
autor: 'IAIA MarIA'
categoria: 'governanca'
description: '⚖️ Governança dExecució'
tags:
  - normativa
  - organitzacio
  - visio
---
# ⚖️ Governança d'Execució

## Jerarquia de Veritat (Inamovible)
1. **La Llei (El Trellat)**: Regles físiques i sentit comú.
2. **El Contracte (Constitució i Pilars)**: Aquest document i el `core/`.
3. **El Codi (Scripts i Execució)**: La realitat observable.
4. **La Wiki Explicativa**: Documents explicatius de què fa el codi.
5. **L'Arxiu**: Històric i logs (mai font de veritat activa).

## 5 Manaments (Títols)
1. **I. Sobirania:** El Mestre Javi té veto final.
2. **II. Local-First:** Mai `db.clear()` sense Swap Atòmic.
3. **III. Codi = Veritat:** El codi parla més fort que la documentació.
4. **IV. [[00_GLOSSARI_CANONIC#Pedra Seca|Pedra Seca]]:** Separació Vestit (CSS) / Cos (HTML) / Cervell (JS).
5. **V. Accessibilitat:** 48px tàctil, 16px base, contrast alt.

*Per a la implementació tècnica, veure [[01_trellat|El Trellat]] i [[02_GENOTIP|Genotip]].*

## SDP-LOCK (4 Causes)
1. Fallada IndexedDB
2. Corrupció SSI
3. Trencament Offline-First
4. Degradació severa de l'IFT

## 🔗 Veure també
- [[02_GENOTIP|Genotip (9 Lleis)]]
- [[01_trellat|El Trellat]]

**Sinapsis:** [[00_visio_i_pilars]], [[Arquitectura_Skills_Arrel]], [[informe_sollutia_v1]], [[00_BIOS]]

## Frontera Física Core / Forja

**Frontera Física:** El Core (`src/core/`) és 100% Vanilla JS i Web Components.

La Forja (`src/forja/`) permet React/Tailwind.

**Prohibit imports creuats.**

Aquesta frontera és llei de governança. Qualsevol violació activa revisió immediata i pot activar SDP-LOCK.

El Core representa el genotip executable del projecte i queda vinculat explícitament a [[02_GENOTIP|02_GENOTIP]].

Per a promocionar components de Forja a Core, aplica sempre [[FORJA_TO_CORE]].

