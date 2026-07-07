---
estat: 'canonic'
name:
  - auto_auditoria_forense
version: '14.00'
created_at: '260628_0000'
updated_at: '260628_0000'
autor: 'Tripartició Cognitiva'
categoria: 'skill'
description: '>-'
tags:
  - ia
  - petorretes
  - auditoria
  - termodinamica
script:
  - '[[auto_audit_skills.cjs]]'
---
# SKILL: Auto-Auditoria Forense

Aquesta SKILL actua com l'inspector intern que avalua de manera periòdica l'estat global del codi, la coherència de la Wiki i els enllaços interns per previndre l'entropia abans no ocórrega.

## 1. Objectiu Principal
- Mantenir el Mas (la base de codi i la Wiki) lliure de dependències trencades i paradoxes.
- Fomentar la mètrica de Salut i Trellat general.

## 2. Regles d'Execució
1. S'activa automàticament per generar reports d'estat si es detecten molts canvis arquitectònics.
2. Treballa colze a colze amb el script de `wiki-integrity.js`.

## 3. Limitacions en Pedra Seca (A10)
- No s'executa en calent de forma síncrona per no col·lapsar la CPU. Es processa en asíncron (background).

---
## 🔗 Sinapsi Arquitectònica
- [[contradiction_engine|Contradiction Engine]]
- Wiki Integrity

**Sinapsis:** [[01_IDENTITAT]], [[CORE_Registre_Automillora]], Arquitectura_L_Ecosistema, 260629_0200_SKILL_plantilla_suprema

