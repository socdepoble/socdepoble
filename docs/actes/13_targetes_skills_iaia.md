# Llibre de Coneixement (Targetes de la Iaia)

Aquest document recopila els aprenentatges tècnics i "skills" desenvolupats durant el projecte "Sóc de Poble". Aquests coneixements estan estructurats com a targetes de memòria ("cards") escrites des de la perspectiva de la Iaia (IAIA MarIA) i l'Eixam.

---

## 🎴 TARGETA 01: El Perill Invisible de l'HTML Inserit (Risc XSS)
**Descobriment per:** Copilot (Fase 2 - Auditoria Final)
**Context:** L'ús de `<template>` i `innerHTML` per parsejar asíncronament missatges de xat ràpids.
**El Problema:** Parsejar i injectar cadenes HTML amb `appendChild` sense sanititzar pot obrir la porta a atacs XSS (scripts ocults en atributs `on*` com `onerror` a dins d'imatges o `<script>` maliciosos).
**La Lliçó Termodinàmica:** No podem dependre d'eines massives com `DOMPurify` si volem mantenir l'aprimament extrem. La solució Pedra Seca passa per una sanitització nativa: iterar sobre els nodes abans de l'injecció, eliminar de soca-rel els tags `<script>` i utilitzar expressions regulars o iteracions de l'arbre DOM per arrancar qualsevol atribut que comence per `on`.

---

## 🎴 TARGETA 02: Els Fantasmes de la Performance (Observers Globals)
**Descobriment per:** Copilot (Fase 2 - Auditoria Final)
**Context:** Inicialització d'observadors globals de Web Vitals (`_clsObserver`, `_lcpObserver`, `_longTaskObserver`).
**El Problema:** Bloquejar la inicialització amb una bandera (`_observersInitialized = true`) evita duplicitats al muntar, però no preveu què passa quan *tots* els components es desmunten. Si `_listeners.size === 0`, l'observador segueix vivint ocult al fons del navegador consumint bateria escoltant esdeveniments per ningú.
**La Lliçó Termodinàmica:** Els singletons d'escolta requereixen una aniquilació explícita. Cal un mecanisme de "neteja de sala": quan l'últim component apaga el llum (esborra del `Set`), s'ha d'invocar `disconnect()` en els tres observadors i resetear la bandera a `false`.

---

## 🎴 TARGETA 03: La Condició del Buit (Accés Segur a Arrays)
**Descobriment per:** Copilot (Fase 2 - Auditoria Final)
**Context:** Capturar el *Largest Contentful Paint* (LCP).
**El Problema:** L'acció innocent de fer `entries[entries.length - 1]` assumint que el `PerformanceObserver` sempre entrega contingut. Si l'API retorna una llista buida (un cas límit estrany en alguns entorns forçats), el codi pateix un `TypeError` fatal en intentar llegir de l'`undefined`.
**La Lliçó Termodinàmica:** Mai assumir la integritat del context extern. Qualsevol array alimentat per Web APIs o l'Eixam s'ha de comprovar amb un `if (!entries.length) return;` abans de tocar la seua cua.

---

## 🎴 TARGETA 04: Els Pinzells Rovellats (Canvas roundRect)
**Descobriment per:** Copilot (Fase 2 - Auditoria Final)
**Context:** La Consola Termodinàmica de la Fase 3.
**El Problema:** Fer crides a `ctx.roundRect()` en Canvas per dibuixar vores arrodonides és modern i bonic, però trenca dràsticament l'execució de la consola en navegadors un pèl antics (o certs entorns incrustats sense suport d'aquesta API). Si peta un dibuix, la consola mor i el `loop` de monitorització s'apaga en silenci.
**La Lliçó Termodinàmica:** Tot element no universal requereix un `polyfill` silenciós (un *fallback*). Si `roundRect` no existeix, el codi ha d'injectar-ne manualment un amb `arcTo` o conformar-se amb un rectangle normal per assegurar la resiliència del visor vital.

---
*(Aquest llibre s'anirà ampliant amb noves targetes a mesura que l'Eixam desxifre les lleis de l'enginyeria extrema rural).*
