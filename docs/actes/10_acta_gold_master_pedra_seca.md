---
titol: "Acta 10: Gold Master Pedra Seca i la Puresa Termodinàmica"
data: "14-06-2026"
autor: "Antigravity"
tags: ["arquitectura", "rendiment", "gpu", "sandbox", "vram"]
---

# ACTA 10: EL VERITABLE GOLD MASTER I LA PURESA TERMODINÀMICA

Aquesta acta documenta les lliçons sensibles i els principis d'enginyeria forjats durant l'auditoria final de la Fase 2 (Transició a Fase 3) de Sóc de Poble.

## 1. El Sandbox C++ (`<template>` vs `DOMParser`)
S'ha demostrat que `DOMParser` genera "bombes de xarxa" invisibles. En processar un *string* HTML que conté etiquetes `<img>` o `<iframe>`, el parser comença la descàrrega d'actius immediatament en memòria, anul·lant qualsevol intent posterior d'injectar `loading="lazy"`.
**Solució adoptada:** L'ús exclusiu del tag natiu `<template>`. L'assignació a `template.innerHTML` construeix els nodes en un Sandbox del C++ sense activar cap petició de xarxa, permetent modificar els atributs (`loading="lazy"`, `decoding="async"`) amb seguretat total abans de la injecció al DOM viu.

## 2. Telemetria d'Event Delegation Passiva
Mesurar el DOM i la VRAM a través de `requestAnimationFrame` i bucles `querySelectorAll` per a imatges és insostenible a gran escala.
**Solució adoptada:** Telemetria O(1) mitjançant *Event Delegation* passiu. S'escolta l'esdeveniment `load` en fase de captura (`true`) directament sobre el contenidor pare. Quan una imatge es carrega realment, es suma el seu cost en píxels (RGBA) a la VRAM total de manera atòmica i sense cost iteratiu per a la CPU.

## 3. L'OLED Brutalism (Zero GPU Leak)
L'ús indiscriminat de `will-change: transform, opacity` en capes inactives (com `.overlay-layer`) obliga la GPU a reservar megabytes de memòria per a l'optimització de components invisibles (modal, mapa).
**Solució adoptada:** El *Design System Pedra Seca* imposa que el color de fons siga negre pur (`#000000`) per estalviar energia apagant píxels, i restringeix la directiva `will-change` exclusivament a la classe `.active`. L'scroll innecessari es neutralitza amb `overscroll-behavior-y: none`.

*El sistema és resilient, autònom i brutalment ràpid. Estem preparats per a expandir.*
