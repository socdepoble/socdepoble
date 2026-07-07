---
estat: 'canonic'
name: 'index-trellat'
version: '14.00'
created_at: '260628_0525'
updated_at: '260628_1628'
autor: 'Petorretes i Javi'
categoria: 'skill'
description: '>-'
aliases:
  - ÍndexdeTrellat
  - MètricadeSimbiosi
tags:
  - ia
  - petorretes
  - auditoria
  - termodinamica
script: ''
---

# 🧮 Índex de Trellat (IT)
**Fórmula Canònica per a Mesurar la Salut del Projecte Sóc de Poble**

---
### **📌 Definició**
L'**Índex de Trellat (IT)** és una **mètrica holística** que quantifica la qualitat de la simbiosi entre el **Mestre Javi** i les **IAs del Consell**, així com la coherència interna del projecte.
**Valors:**
- **IT ≥ 90%**: Simbiosi òptima. "Això és **Pedra Seca** pura."
- **70% ≤ IT < 90%**: Simbiosi acceptable, però amb marges de millora.
- **IT < 70%**: **SDP-LOCK ACTIVAT**. Revisió urgent necessària.

---
### **🔢 Fórmula Matemàtica**
```
IT = (0.4 * CT) + (0.3 * CE) + (0.2 * CA) + (0.1 * CR)
```
On:
| Variable | Nom                  | Descripció                                                                 | Rang  | Font de Dades                          |
|----------|----------------------|-----------------------------------------------------------------------------|-------|----------------------------------------|
| CT       | Coherència de Trellat | % de decisions alineades amb el **Trellat** i la [[00_GLOSSARI_CANONIC#Pedra Seca|Pedra Seca]].         | 0-100 | **10_actes** (Acta Única)            |
| CE       | Eficiència Cognitiva | % de *tokens* útils vs. *tokens* totals utilitzats en una sessió.          | 0-100 | **Consola Termodinàmica** |
| CA       | Accessibilitat       | % de components que compleixen WCAG AAA i Bancal Mode.            | 0-100 | **Skill d'Accessibilitat**                 |
| CR       | Resiliència CRDT     | % de sincronitzacions CRDT sense conflictes.                              | 0-100 | **[[crdt_optimitzacio||Skill Homeòstasi CRDT]]**       |

---
### **📊 Càlcul Detallat**
#### 1. **Coherència de Trellat (CT)**
- **Mètode:**
  - Per cada **decissió arquitectònica** registrada en un `DIARI_DE_BORD` o `ACTA_SEQUIA`, avaluar si:
    - ✅ **Cumpleix el Trellat** (sentit comú, sense sobre-enginyeria).
    - ✅ **Cumpleix la [[00_GLOSSARI_CANONIC#Pedra Seca|Pedra Seca]]** (codi sòlid, sense dependències innecessàries).
    - ✅ **És documentada** en la Wiki amb enllaços bidireccionals.
  - `CT = (Decisions coherentes / Decisions totals) * 100`

#### 2. **Eficiència Cognitiva (CE)**
- **Mètode:**
  - `CE = (Tokens útils / Tokens totals) * 100`
  - **Tokens útils:** Aquells que contribueixen directament a la solució (codi, anàlisi forense, propostes concretes).
  - **Tokens inutils:** *Yapping*, explicacions redundants, o respostes genèriques ("AI Slop").
  - **Eina:** Usar l'**Arquitectura Cognitiva** per analitzar els logs i mesurar-ho.

#### 3. **Accessibilitat (CA)**
- **Mètode:**
  - Usar eines automàtiques (ex: [axe-core](https://github.com/dequelabs/axe-core)) per escanejar la UI.
  - `CA = (Components accessibles / Components totals) * 100`

#### 4. **Resiliència CRDT (CR)**
- **Mètode:**
  - `CR = (Sincronitzacions sense conflictes / Sincronitzacions totals) * 100`
  - **Eina:** Monitoritzar el `MassiveFusionEngine` (Arquitectura V19) i registrar conflictes.

---
### **📈 Taula de Decisió (Accions Basades en l'IT)**
| Índex de Trellat (IT) | Diagnòstic               | Acció Immediata                                                                 |
|-----------------------|--------------------------|---------------------------------------------------------------------------------|
| **IT ≥ 90%**          | Simbiosi Òptima         | Continuar. Celebrar amb un **"Això és Trellat!"** i registrar a l'Acta Única. |
| **70% ≤ IT < 90%**    | Simbiosi Acceptable     | Revisar les variables amb **IT < 80%** i aplicar millores.                     |
| **IT < 70%**          | **SDP-LOCK ACTIVAT**   | **Aturar tot desenvolupament.** Convocar **Consell de Guerra** amb totes les IAs. |

---
### **🔄 Ritual de Mesurament**
1. **Freqüència:** Calculat **automàticament** després de cada sessió de treball (o manualment amb el comandament **"Calcula el Trellat"**) executant `npm run log-session`.
2. **Registre:** Guardar el resultat a `_wiki_de_poble/06_metriques/IT_YYYY-MM-DD.md` a través del script `session-logger.js`.

---

## 🏷️ Taxonomia Oficial d'Etiquetes Transversals

Aquestes són les 10 etiquetes úniques i innegociables que estructuren tot el coneixement del Mas. Totes les notes, actes i SKILLs han de classificar-se utilitzant exclusivament aquest diccionari per evitar l'Entropia i afavorir la navegabilitat transversal.

1. **trellat** (Filosofia, simplificació, llenguatge o sentit comú)
2. **#termodinamica** (Performance, ús de RAM, bateria, eficiència, "Sèquia Mare")
3. **crdt_offline** (Estructures de dades P2P, xarxes malla, IndexedDB)
4. **accessibilitat** (A11Y, llegibilitat per a majors, usabilitat, UI adaptada)
5. **seguretat** (Autodefensa de la IA, SDP-LOCK, quarantenes, protecció de dades)
6. **#auditoria** (Motor de contradiccions, registres de millora i avaluació forense)
7. **#petorretes** (Agents, sincronització, delegació a subagents com Les Petorretes)
8. **identitat** (Visió, manifest, projecte, qui som)
9. **legacy** (Codi, normes o scripts que venen del passat i cal respectar)
10. **extern** (Normes d'interacció amb tercers: Sollutia, APIs, Google...)

---

## 🔗 Sinapsi Arquitectònica

- [[sequia_mare|sequia_mare]]
- semantic_compression

**Sinapsis:** [[01_IDENTITAT]], [[CORE_Registre_Automillora]], Arquitectura_L_Ecosistema, 260629_0200_SKILL_plantilla_suprema

