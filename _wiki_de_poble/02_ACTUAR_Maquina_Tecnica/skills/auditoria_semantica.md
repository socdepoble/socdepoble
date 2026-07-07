---
estat: 'canonic'
name: 'auditoria-semantica'
version: '14.00'
created_at: '260706_2210'
updated_at: '260706_2210'
autor: 'Consell de les 11 Petorretes'
categoria: 'SKILL'
description: >
  Motor d'auditoria semàntica per detectar anomalies en carpetes i fitxers
  basat en lògica de Trellat (sense IA, només regles de negoci).
tags:
  - auditoria
  - trellat
  - tecnologia
  - doc
  - termodinamica
script:
  - '[[semantic_auditor.mjs]]'
  - '[[consolidar_etiquetes.js]]'
---

# 🔍 Auditoria Semàntica (Trellat Puri)

## 🎯 Objectiu
Detectar **anomalies de disseny** en l’estructura de carpetes i fitxers de la Wiki **sense analitzar contingut**,
usant només **patrons de noms, ubicacions i metadades** (frontmatter).

## 🧩 Components
1. **`semantic_auditor.mjs`**: Script principal per executar l’auditoria.
2. **Regles de Trellat**: Taules de decisions per a carpetes i fitxers (veure a sota).

## 📁 Regles per a Carpetes
| Patró de Nom       | Ubicació Esperada                     | Acció                     | Severitat  |
|--------------------|----------------------------------------|---------------------------|-------------|
| `*produccio*`, `*build*` | `02_ACTUAR_Maquina_Tecnica/scripts/` | `[AVÍS-PILAR]`           | ⚠️ Mitjana  |
| `*vella*`, `*old*`  | `90_arxiu_historic/`                   | `[AVÍS-PILAR]`           | ⚠️ Mitjana  |
| `*bancal*`         | `04_ARXIU_Documents_Historics/bancal_actiu/` | `[AVÍS-PILAR]`      | ⚠️ Mitjana  |
| Prefix `XX_` (no Pilar) | **ERROR** | `[FATAL]` + SDP-LOCK | ❌ Crítica |

## 📄 Regles per a Fitxers
| Tipus de Fitxer          | Necessita Termodinàmic? | Rao                                  |
|--------------------------|-------------------------|--------------------------------------|
| ACTA, REPORT, DOC, CORE  | ✅ Sí                   | Contingut estàtic amb data rellevant. |
| SKILL                    | ❌ No                   | Ja té versió `XX.YY` al frontmatter.  |
| Taula Mestra, Registres  | ❌ No                   | Contingut dinàmic.                   |
| Scripts (`.js`, `.cjs`)  | ❌ No                   | Codi, no contingut.                   |
| Assets (imatges, CSS)    | ❌ No                   | Fitxers estàtics.                    |

## 🚀 Ús
### Executar auditoria:
```bash
node _wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/semantic_auditor.mjs
```

## 🔗 Sinapsis
- [[00_BIOS]]
- audit_estructura.mjs
- contradiction_engine.mjs
