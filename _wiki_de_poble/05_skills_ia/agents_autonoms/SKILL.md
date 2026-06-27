---
name: agents-autonoms
description: "Directrius per a futurs agents asíncrons (Web Workers)."
tags: [futur, agents, asincron, web-workers]
authority: "Consell de les 11 IAs"
version: "V21"
---
# SKILL: Agents Autònoms de Fons (Workers)

Sóc de Poble aprofitarà els Web Workers per a tindre agents "dormits" o en segon pla que cuiden del Mas sense asfixiar el fil principal de la UI.

## 1. Patró de Treballador Incansable
Els agents encarregats de fer tasques feixugues (com comprimir el diari de bord, o compactar tombstones CRDT) han de viure estrictament dins de Web Workers.

## 2. Termodinàmica
Cap agent autònom pot gastar més del 5% del pressupost de bateria de l'usuari. Si la tasca és massa pesada, l'agent s'atura i espera a que el dispositiu estiga endollat a la xarxa elèctrica. Açò és el Trellat aplicat a l'autonomia.

## 3. Silenci Operatiu
Aquests agents no obrin bafarades, ni parlen amb l'usuari a no ser que el Mas estiga a punt de caure (Master Bypass letal o SOSP-LOCK crític). La seua presència només es nota perquè tot funciona millor.


---

## 🔗 Sinapsi Arquitectònica

- [[05_skills_ia/futur_adaptacio/SKILL|futur_adaptacio]]
- [[05_skills_ia/rag_wiki/SKILL|rag_wiki]]
