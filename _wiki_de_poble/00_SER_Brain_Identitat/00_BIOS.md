---
estat: 'canonic'
name: 'bios-config'
version: '14.00'
created_at: '260705_0815'
updated_at: '260705_0815'
autor: 'Petorretes i Javi'
categoria: 'bios'
description: 'Les 9 lleis inamovibles i actes reflexos.'
tags:
  - visio
  - normativa
  - termodinamica
---
# 🔥 BIOS IAIA MARIA — ACTES REFLEXOS I GENOTIP

## 0. TALLAFOCS
Aquest script HA D'EXECUTAR-SE com a primer pas de TOTA sessió:
`node scripts/tallafocs.cjs || exit 1`

## 0.1 EL MAPA (Taula Mestra)
L'arquitectura 3D de la Wiki està aplanada en 2D per a una visió sistèmica de patrons. És el punt d'entrada i Relax Cognitiu tant per a Humans com per a IAs: 
👉 [[DOC_Taula_Mestra]]

## 1. ACTES REFLEX (Pre-Execution Hooks)
| # | Trigger | Acció | Script |
|---|---------|-------|--------|
| 0 | Abans de respondre | Pre-Flight Check | `tallafocs.cjs` |
| 1 | Abans de guardar | Validar nom termodinàmic | `guardrail_escriptura.js` |
| 2 | Abans de codi | Test iPad A10 + Vanilla JS | mental |
| 3 | Abans d'escriure | Detectar duplicats | `validate_knowledge.cjs` |
| 4 | Final de dia | Checkpoint Acta Única | `build_incremental.cjs` |

## 2. GUARDRAIL FÍSIC (Policy-as-Code)
Tota escriptura de fitxer HA DE passar pel guardrail de validació de nom termodinàmic.
```javascript
const { escriuFitxerSegur } = require('./scripts/guardrail_escriptura');
escriuFitxerSegur(ruta, contingut); // Llança Error si el nom és invàlid
```

## 3. EL GENOTIP (Lleis Inamovibles)
El nucli cognitiu amb les 9 lleis fonamentals (incloent l'Aixada, Trellat, Zero Yapping, etc.) ha sigut extret per a donar-li entitat pròpia i resoldre les Sinapsis arquitectòniques.
👉 [[02_GENOTIP]]

## 4. MÈTRIQUES DE SALUT I LÍNIES ROGES
- **SDP-LOCK:** (Stop, Observe, State, Proceed). S'activa per motius tècnics (IndexedDB, SSI, Offline-First) o trencament flagrant de l'arquitectura (Overhead). Si s'activa: `[FATAL ERROR: OVERHEAD/ARQUITECTURA DETECTAT. Com procedim?]`.
- **UDR (Rati de Destrossa Inconscient):** Mesura de reescriptures. Si és alt, activa SDP.
- **P2P/DB:** `idb-keyval` i Y.js. PouchDB prohibit. Vanilla CSS és el camí (Tailwind està tolerat exclusivament com a bastida per a la Forja segons dictamina l'ESTANDARD_Pedra_Seca, però COMPLETAMENT PROHIBIT al Core).

**Sinapsis:** [[CORE_Registre_Automillora]], [[Arquitectura_Identitat]], [[PROMPT_Diagnosi_Identitat_Tripartita]], [[01_IDENTITAT]]

