---
name: sequia-mare
description: >-
  Motor d'Async Batching (Sincronització per lots offline-first). També conegut
  metafòricament com La Sèquia Mare.
authority: Consell de les 11 IAs
version: V22
tags:
  - crdt_offline
  - trellat
created_at: '260628_0525'
updated_at: '260628_1618'
---

# SKILL: Sincronització Asíncrona per Lots (La Sèquia Mare)

Aquesta skill regula la freqüència i el volum de sincronització de dades *offline-first*. Dins del Mas es coneix amb la metàfora didàctica de "La Sèquia Mare", ja que l'aigua (les dades) no es malgasta de forma constant; la informació s'acumula internament al dispositiu de l'usuari i inunda el bancal (s'emet cap a la base de dades) només en moments concrets on el cabal de xarxa siga estable.

## Lògica d'Execució
1. **Async Batching (Sincronització per lots):** L'objectiu és protegir la memòria RAM de dispositius febles (ex. iPad A10) i l'energia limitadíssima dels nodes autònoms (Xarxa Malla). L'arquitectura impedeix les trucades constants (*long-polling* excessiu o websockets inútils per accions no-crítiques). 
2. **Buffer Local i Gallets d'Activació:** La informació s'emmagatzema internament en *IndexedDB/CRDT*, i es sincronitza cap a l'exterior únicament en ràfegues quan es compleixen aquestes condicions: **Bateria > 20%** i **Connexió estable**, o quan siga forçat manualment per l'usuari.
3. **Reconciliació Intel·ligent:** Quan el servidor o l'entorn de malla rep la ràfega de dades, **[[01_identitat_iaia/antigravity|Antigravity]]** utilitza la lògica d'Or-Set CRDT per reconciliar manifests i aplicar els pegats sense col·lisions.

## Control de Salvaguarda (L'Índex de Trellat)
Com a mètrica post-sprint per vigilar l'ofec de la Sèquia, **es consultarà l'Índex de Trellat (IT) proporcionat per la Consola Termodinàmica**.

> [!WARNING]
> *Qualsevol resultat d'Índex de Trellat inferior a 70 o si la bateria del dispositiu baixa del 20% significa SDP-LOCK ACTIVAT per a la Sèquia Mare. La sincronització s'aturarà i les dades s'acumularan exclusivament en local (Buffer) fins que el tractor recupere energia o estabilitat de xarxa.*
> **Sincronització d'Emergència (Override):** Malgrat el bloqueig per bateria (<20%), es mostrarà un avís informatiu o una icona de bateria baixa. L'usuari podrà clicar aquest avís per **forçar la sincronització manualment** en cas de necessitat humana real, prioritzant l'enviament de missatges per damunt del consum d'energia.

---

## 🔗 Sinapsi Arquitectònica

- [[05_skills_ia/index_trellat/SKILL|Índex de Trellat]]
- [[05_skills_ia/crdt_optimitzacio/SKILL|Optimització CRDT (OR-Set)]]
- [[05_skills_ia/esporga_termodinamica/SKILL|Esporga Termodinàmica]]
- [[05_skills_ia/consola_termodinamica/SKILL|Consola Termodinàmica]]

- [[00_index|Índex Central]]
