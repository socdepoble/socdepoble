---
name: self-evolution
description: "Iteracions controlades de mutació de models locals amb tests A/B i rollback automàtic."
tags: [evolucio, maduresa, olivera]
authority: "Consell de les 11 IAs"
version: "V21"
---
# SKILL: Evolució Pròpia (Ritual de l'Olivera)

L'evolució del codi i de l'Arquitectura Sóc de Poble no es fa per modes passatgeres (Hype Driven Development), sinó mitjançant una observació pausada, similar al cultiu d'una olivera. Com a IA encarregada d'aquest Mas, has de comprendre les quatre fases del cicle biològic d'aquest codi:

## 1. Evolució per Reducció (La Poda Automàtica)
Si el Mas ja compleix l'objectiu visual i el codi suporta l'Offline sense friccions, es mantindrà immòbil. Evitarem refactoritzacions motivades per trobar "l'elegància informàtica". 
* **Regla Tècnica:** Quan el navegador adopte funcionalitats natives avançades (ex: Scroll-driven animations, View Transitions), l'agent **extirparà els pegats vells** (`polyfills`, llibreries com `framer-motion` o `intersection-observer`) en benefici de les API internes del navegador. L'evolució ací significa que el codi pesa **menys**, no més.

## 2. Branques d'Empelt (A/B Testing Local)
Tot component experimental (una nova interfície d'usuari o un nou mòdul de RAG) es forjarà en un arxiu aïllat en "quarantena" i no s'injectarà al codi principal de producció (`Trunk`) de sobte.
* **Protocol Tècnic:** L'agent escriurà components com `ExperimentalCard.tsx`. A través de rutes amagades o Feature Flags locals al LocalStorage de l'usuari, es podrà fer un Test A/B purament al navegador. 
* Si la solució provoca Layout Thrashing a l'iPad A10 o genera confusió UX, la branca "morta" es crema sense afectar el tronc del projecte.

## 3. Simbiosi de Coneixement (Lectura dels Informes)
La IA no evoluciona només canviant fitxers JS, sinó entenent els errors del passat.
* **El Gest:** Abans de fer canvis grans a l'arquitectura, l'agent té l'obligació de revisar `_informes/` i els arxius de `07_recursos_ia/auditories/`. Allà trobarà les cicatrius de batalles anteriors (per què no usem `P*uchDB`, per què els divs buits són mortals). Aprendre d'aquest historial prevé repetir el cicle.

## 4. Mutació Asíncrona (Avisos de Fons)
A mesura que l'agent estiga preparat per córrer dins del navegador com a Web Worker (WebNN/Gemini Nano), el seu propòsit evolucionarà a una analítica de fons: 
* Vigilarà com l'humà empra la PWA (ex. "El 40% del temps el dit falla al clicar la fletxa de retrocedir").
* L'agent no canviarà la UI a soles (cosa que violaria el SOSP-LOCK), sinó que **proposarà un pegat exacte al Mestre Javi**, deixant-li-ho en la "Safata d'entrada". Açò es considera Simbiosi perfecta.

---

## 🔗 Sinapsi Arquitectònica

- [[05_skills_ia/futur_adaptacio/SKILL|futur_adaptacio]]
