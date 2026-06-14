# ARQUITECTURA SÓC DE POBLE (PEDRA SECA)

## 1. Design System: Pedra Seca ("OLED Brutalism")
L'estètica "Pedra Seca" naix de la necessitat de construir interfícies robustes, ràpides, i orgàniques per al medi rural, maximitzant l'eficiència energètica en dispositius mòbils (com l'iPad A10).

### Colors Canònics
- **OLED Black (`#000000`)**: El fons principal mai serà gris trencat. Ha de ser negre pur per apagar físicament els píxels a les pantalles OLED i estalviar bateria. La profunditat es crea amb vores translúcides (`rgba(255,255,255,0.05)`).
- **Taronja Corporatiu (`#FF7300`)**: Color d'accent principal, botons primaris i estats crítics o d'estrès a la Consola Termodinàmica.
- **Blau Protocol (`#0984E3`)**: Color secundari, utilitzat per a dades neutres, mètriques estabilitzades i accions protocol·làries.
- **Blanc Pur (`#FFFFFF`)**: Estrictament reservat per a textos principals i valors numèrics. Llum pura que contrasta amb el negre sòlid.

### Geometria i Tipografia
- **Tipografia Principal**: `Noto Sans`. La robustesa del text demana l'ús de `font-weight: 900` per a títols, creant jerarquies imponents i llegibles sota qualsevol condició lumínica.
- **Geometria**: 
  - `28px` per als radis de frontera principals (Contenidors, Targetes, Gauges).
  - `18px` per als elements secundaris interns (Inputs, Panells interns).
  - Aquesta gramàtica de radis estableix un patró visual fàcilment recognoscible ("Sóc de Poble").

### Interaccions de Gravetat (GPU Acceleration)
Les interaccions d'estat com el `:hover` no han de modificar colors de fons (això consumeix cicles CPU innecessaris i provoca *paint thrashing*). 
En lloc d'això, l'element sencer levita aprofitant l'acceleració per maquinari (GPU):
- Levitar: `transform: translateY(-2px)`
- Prémer: `transform: translateY(0) scale(0.95)`
Totes les transicions s'apliquen únicament sobre propietats de baix cost de renderitzat (`transform`, `opacity`).

## 2. Zero Overhead (El Motor Vivent)
L'arquitectura Sóc de Poble es defineix com termodinàmicament pura.

### 2.1 El Sandbox Natiu (`<template>`)
L'ús de `DOMParser` ha estat bandejat completament per evitar peticions de xarxa fantasma (*Network Bombs*). Qualsevol codi HTML en brut injectat serà validat i muntat en memòria utilitzant el tag estàndard `<template>`. Aquesta estratègia permet la manipulació total i la injecció de polítiques agressives (`loading="lazy"`, `decoding="async"`) en C++ abans que el navegador intente descarregar els actius.

### 2.2 Telemetria Termodinàmica (Passiva O(1))
El control del *Heap* (VRAM i Node Count) es gestiona exclusivament a través de **Event Delegation** passiva. Aquesta telemetria no desperta la CPU de forma intermitent en cicles `requestAnimationFrame`, sinó que només escolta esdeveniments atòmics (`html-chunk-rendered`, imatges finalment completades en temps de descàrrega) per actualitzar l'estat a la Consola de manera transparent i asíncrona a 60 FPS garantits.

### 2.3 Contenció GPU (`content-visibility` i `contain`)
La contenció s'aplica de forma tàctica per aïllar els àmbits d'avaluació CSS i *layout*.
Les capes globals (`.overlay-layer`) mantenen un repòs de render zero. Propietats costoses com `will-change: transform, opacity` s'invoquen **només i exclusivament** quan l'element entra en estat actiu (`.active`), assegurant que la memòria gràfica no es desangre mantenint capes modals amagades o fora de focus. La resistència tàctil a iOS (el *Rubber-banding*) s'evita globalment mitjançant `overscroll-behavior-y: none`.

*«La Masia està construïda en roca sòlida.»*
