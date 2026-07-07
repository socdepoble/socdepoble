---
estat: 'canonic'
name: 'sequia-mare'
version: '14.00'
created_at: '260628_0525'
updated_at: '260628_1618'
autor: 'Petorretes i Javi'
categoria: 'skill'
description: '>-'
tags:
  - ia
  - petorretes
  - execucio
  - arquitectura
script: ''
---

# SKILL: Sincronització Asíncrona per Lots (La Sèquia Mare)

Aquesta skill regula la freqüència i el volum de sincronització de dades *offline-first*. Dins del Mas es coneix amb la metàfora didàctica de "[[00_GLOSSARI_CANONIC#La Sèquia Mare|La Sèquia Mare]]", ja que l'aigua (les dades) no es malgasta de forma constant; la informació s'acumula internament al dispositiu de l'usuari i inunda el bancal (s'emet cap a la base de dades) només en moments concrets on el cabal de xarxa siga estable.

## Lògica d'Execució
1. **Async Batching (Sincronització per lots):** L'objectiu és protegir la memòria RAM de dispositius febles (ex. iPad A10) i l'energia limitadíssima dels nodes autònoms (Xarxa Malla). L'arquitectura impedeix les trucades constants (*long-polling* excessiu o websockets inútils per accions no-crítiques). 
2. **Buffer Local:** La informació s'emmagatzema internament en *IndexedDB/CRDT*, i es sincronitza cap a l'exterior únicament en ràfegues quan hi ha un nivell de bateria i connexió robustos (o forçat manualment per l'usuari).
3. **Reconciliació Intel·ligent:** Quan el servidor o l'entorn de malla rep la ràfega de dades, **Antigravity** utilitza la lògica d'Or-Set CRDT per reconciliar manifests i aplicar els pegats sense col·lisions.

## Control de Salvaguarda (L'Índex de Trellat)
Com a mètrica post-sprint per vigilar l'ofec de la Sèquia, calculem mentalment la nostra viabilitat tècnica aplicant la fórmula canònica d'avaluació:
   
`IT = (0.4 * CT) + (0.3 * CE) + (0.2 * CA) + (0.1 * CR)`
   
> [!WARNING]
> *Qualsevol resultat d'Índex de Trellat inferior a 70 significa SDP-LOCK ACTIVAT. Demana l'activació urgent de l'Esporgadora Termodinàmica i convoca el **Consell de Les Petorretes** per decidir de forma conjunta l'eliminació de codi sobrant.*

---

## 🔗 Sinapsi Arquitectònica

- [[index_trellat|Índex de Trellat]]
- [[crdt_optimitzacio|Optimització CRDT (OR-Set)]]
- Esporga Termodinàmica
- [[consola_termodinamica|Consola Termodinàmica]]

**Sinapsis:** [[01_IDENTITAT]], [[00_arquitectura_tecnica_unificada]], 01_arquitectura, Arquitectura_Disseny

