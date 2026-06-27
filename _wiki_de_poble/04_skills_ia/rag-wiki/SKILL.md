---
name: rag-wiki
description: "Cerca semàntica a la Wiki (Edge AI) per a Sóc de Poble."
tags: [futur, rag, edge-ai, cerca-semantica]
authority: "Consell de les 11 IAs"
version: "V21"
---
# SKILL: Cerca Semàntica i RAG (Retrieval-Augmented Generation)

La Wiki de Sóc de Poble es convertirà en el corpus de coneixement d'un sistema RAG descentralitzat (Edge RAG).

## 1. Vectorització Local
- Utilitzarem embeddings ultra-lleugers al navegador per indexar els markdown de `_wiki_de_poble/`.
- La base de dades vectorial (ex: PGlite o un wrapper sobre OPFS) estarà 100% offline.
- Açò permetrà que la recerca a la Wiki trobe respostes semàntiques ("Com era allò del color del botó?") en comptes de coincidències exactes.

## 2. Seguretat del Coneixement
- El sistema RAG només pot llegir la Wiki. Tota modificació passa pels processos oficials i per la "Sèquia Mare" amb revisió humana/CRDT.
- La "Veritat en Dos Miralls" es manté: si el RAG diu una cosa i la Wiki una altra, el RAG està al·lucinant. La Wiki (Markdown) sempre té raó.


---

## 🔗 Sinapsi Arquitectònica

- [[SKILL|futur-adaptacio/SKILL]]
- [[AGENTS|agents-autonoms/SKILL]]
