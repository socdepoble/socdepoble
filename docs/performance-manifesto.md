# ⚖️ `performance-manifesto.md` — MANIFEST DE RENDIMENT I AUDITORIA (Pedra Seca V3.1)
*Document oficial · Versió 3.1 · Sóc de Poble*

> **Objectiu**: Garantir 60 FPS en iPad A10 i funcionament sense connexió. Qualsevol canvi que incomplisca aquestes lleis serà rebutjat automàticament.

---

## 1. LLEIS TERMODINÀMIQUES DE L'IPAD A10 (Zero Overhead)

### ❌ PROHIBICIONS ABSOLUTES
1. **Cap `backdrop-blur` innecessari**: Consumeix fins al 40% de la GPU. Només permès en overlays actius.
2. **Dependències NPM Supèrflues**: Prohibit Zustand, Chart.js o llibreries pesades quan Vanilla JS + Canvas o EventTarget natius són suficients.
3. **Re-renders de React innecessaris**: El DOM s'ha d'atacar directament per a mètriques o consoles (Bypass de React).
4. **Listeners infinits o penjats**: Prohibit usar `{once: true}` sense `AbortController` en l'event de descàrrega d'imatges.
5. **Animacions CPU**: Prohibit animar `width`, `height`, `margin` o `box-shadow`.
6. **`requestAnimationFrame` Zombis**: Un `requestAnimationFrame` MAI pot quedar rodant en un component que no està visible a la pantalla.
7. **Lectura directa del viewport en renderitzat**: Prohibit usar `window.innerWidth`, `window.innerHeight` o propietats síncrones als components de React. Tota adaptació a la pantalla es resol per CSS.
8. **Al·locacions de RAM inútils**: Prohibit usar `querySelectorAll` només per comptar. S'usa `getElementsByTagName('*').length` (Zero bytes de RAM assignats, lectura directa C++).

### ✅ OBLIGACIONS DE RENDIMENT
1. **OLED Brutalism**: Fons globals han de ser negre pur `#000000` per apagar el píxel i estalviar bateria.
2. **Acceleració GPU Controlada**: Elements interactius usen `transform: translateZ(0);` i les transicions de `box-shadow` es fan amb pseudo-elements modificant només l'`opacity`.
3. **Contenció del Layout**: Ús estricte de `contain: layout paint` en panells estructurals.
4. **Protecció contra l'efecte Goma iOS**: `overscroll-behavior-y: none` al body.
5. **Parseig Asíncron HTML**: Qualsevol injecció d'HTML extern ha de passar per `<template>` i processar-se per trossos (`Chunking`) aprofitant un wrapper segur de `requestIdleCallback` (`safeRequestIdleCallback`).

---

## 2. GESTIÓ D'ESTAT I MEMÒRIA

### 🧠 Estat Global i Telemetria
- **EventTarget Nadiu**: L'estat termodinàmic es gestiona heretant de `EventTarget` natiu del navegador, evitant dependències de tercers i Overhead de context de React.
- **Singletons i Event Delegation**: Múltiples components escolten la mateixa instància. S'aprofita la fase de captura (`true`) per a comptar imatges i descarregar mètriques sense *event bubbling*.

### 📦 Pressupost de Memòria
- El *JS Heap Size* no pot superar els **25 MB** (Límit de la Fase 2: 16.7 MB aconseguits).
- Neteja agressiva: Les matrius de nodes efímers (`state.nodes = []`) es purguen manualment per facilitar la tasca al *Garbage Collector* de V8.
- Limitacions `localStorage`: Màxim 5MB per preferències. Sense ús per persistir la telemetria efímera.

---

## 3. PROTOCOL D'AUDITORIA I CONTROL DE QUALITAT

### 🔍 Abans de desplegar
1. **Prova en maquinari real**: iPad A10 (2016) és l'únic referent vàlid.
2. **Mesura FPS**: Ha de ser estable a 60 FPS en tot moment, auditat amb la *Consola Termodinàmica*.
3. **Consola Termodinàmica**: Ha de ser Canvas 100% pur (Zero React), no afectar els FPS i apagar completament els cicles de CPU quan es tanca (`rafId = null`).
4. **Revisió de codi**: Confirmar l'existència de capes d'aïllament (`portal-root`).

### 📋 Llista de Comprovació Final (Pedra Seca V3.1)
- [ ] S'han eliminat els listeners penjats en desmuntar?
- [ ] La consola es deté quan no es veu al 100%?
- [ ] Hem evitat el `content-visibility: auto` innecessari al `main`?
- [ ] S'ha utilitzat només C++ estatic per comptar DOM?
- [ ] Funciona tot offline o ho farà en l'arquitectura Service Worker pendent?
