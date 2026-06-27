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
- Utilitzarem Cerca Difusa (Fuzzy Search) ultra-lleugera en comptes de bases de dades vectorials pesades o PGLite per protegir la memòria RAM de l'iPad A10.

## 2. Seguretat del Coneixement
- El sistema RAG només pot llegir la Wiki. Tota modificació passa pels processos oficials i per la "Sèquia Mare" amb revisió humana/CRDT.
- La "Veritat en Dos Miralls" es manté: si el RAG diu una cosa i la Wiki una altra, el RAG està al·lucinant. La Wiki (Markdown) sempre té raó.


---

## 🔗 Sinapsi Arquitectònica

- [[05_skills_ia/futur_adaptacio/SKILL|futur_adaptacio]]
- [[05_skills_ia/agents_autonoms/SKILL|agents_autonoms]]
