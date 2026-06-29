---
description: "Document de l'arxiu històric: # \U0001F9F9 ACTA GENERAL DE SKILLS I DIRECTORI ARREL (La Gran Purga)  Aquest document certifica la neteja p..."
created_at: '260616_0520'
updated_at: '260628_1618'
---
# 🧹 ACTA GENERAL DE SKILLS I DIRECTORI ARREL (La Gran Purga)

Aquest document certifica la neteja profunda del caos mental acumulat durant els darrers 5 mesos (l'"ànsia de la màquina"), especialment a la carpeta de `_skills`, i estableix les regles de joc de la cimentació des de l'arrel.

## 1. La Purga de les "Skills" (El Cacao Mental)
La carpeta `_skills/tactical` s'havia convertit en un abocador de 65 protocols redundants, mal anomenats (amb zeros innecessaris com `000-el-llibre-d-anima`) i JSONs obsolets des de feia mesos. 
- **Acció presa**: Seguint l'ordre de "retir al monestir per reflexionar", **TOTA** la memòria de *skills* obsoletes (`tactical`, `domain`, `genotip`, etc.) ha estat moguda a `_docs/_revision/_skills` per a deixar el cervell del sistema net. 
- **El Trellat**: A partir d'ara, si cal una Skill nova, es crearà de forma quirúrgica, neta i exclusivament si el codi no pot viure sense ella.

## 2. L'Arrel del Mas (CONTRIBUTING.md i Rendiment)
L'arxiu `CONTRIBUTING.md` (conegut com a *Ghost Protocol / Pedra Seca V2*) estableix les lleis innegociables a l'hora de tocar codi, ja que anem a dispositius antics com l'iPad A10:
- **Zero God Objects**: L'estat d'un component (`Zustand`) només pertany a aquell component. Es destrueix en tancar-lo (`store.destroy()`). Prohibit clavar estats efímers (scrolls, modals) a l'arrel de l'app.
- **Zero Overhead (Cicle de Renderitzat)**: És obligatori passar pel `React DevTools Profiler`. Si un component s'actualitza múltiples vegades per segon, s'ha de traure de React i usar referències pures al DOM (`useRef()`).
- **Neteja del DOM**: Qualsevol PR ha d'assegurar l'absència de re-renders i de *memory leaks*.

## 3. Codi de Conducta
El `CODE_OF_CONDUCT.md` assenta la pau social: empatia, llenguatge inclusiu i tolerància zero a l'assetjament. Actuem "amb Trellat".

---
*Totes les eines, esborranys de skills, carpetes de core i velles lleis de la IA s'han posat oficialment **En Revisió**. Aquest és el punt zero abans de començar a produir la Targeta Universal.*


---
## 🔗 Veure també
- [[04_arquitectura_disseny/arquitectura_tecnica|Arquitectura Principal]]
