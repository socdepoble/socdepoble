---
name: index-trellat
description: "Fórmula matemàtica per avaluar la qualitat de la simbiosi humà-màquina en cada sessió. Basat en Trellat, eficiència termodinàmica i coherència arquitectònica."
tags: [mètrica, simbiosi, trellat, eficiència]
aliases: [Índex de Trellat, Mètrica de Simbiosi]
authority: "Consell de les 11 IAs"
version: "V21"
---

# 🧮 Índex de Trellat (IT)
**Fórmula Canònica per a Mesurar la Salut del Projecte Sóc de Poble**

---
### **📌 Definició**
L'**Índex de Trellat (IT)** és una **mètrica holística** que quantifica la qualitat de la simbiosi entre el **Mestre Javi** i les **IAs del Consell**, així com la coherència interna del projecte.
**Valors:**
- **IT ≥ 90%**: Simbiosi òptima. "Això és Pedra Seca pura."
- **70% ≤ IT < 90%**: Simbiosi acceptable, però amb marges de millora.
- **IT < 70%**: **SOSP-LOCK ACTIVAT**. Revisió urgent necessària.

---
### **🔢 Fórmula Matemàtica**
```
IT = (0.4 * CT) + (0.3 * CE) + (0.2 * CA) + (0.1 * CR)
```
On:
| Variable | Nom                  | Descripció                                                                 | Rang  | Font de Dades                          |
|----------|----------------------|-----------------------------------------------------------------------------|-------|----------------------------------------|
| CT       | Coherència de Trellat | % de decisions alineades amb el **Trellat** i la **Pedra Seca**.         | 0-100 | `ACTA_SEQUIA_YYYY-MM-DD.md`            |
| CE       | Eficiència Cognitiva | % de *tokens* útils vs. *tokens* totals utilitzats en una sessió.          | 0-100 | Logs de la IA (ex: `gemini/antigravity/`)|
| CA       | Accessibilitat       | % de components que compleixen **WCAG AAA** i **Bancal Mode**.            | 0-100 | `SKILL-a11y-trellat.md`                 |
| CR       | Resiliència CRDT     | % de sincronitzacions CRDT sense conflictes.                              | 0-100 | `SKILL-homeostasi_crdt.md` (Grok)       |

---
### **📊 Càlcul Detallat**
#### 1. **Coherència de Trellat (CT)**
- **Mètode:**
  - Per cada **decissió arquitectònica** registrada en un `DIARI_DE_BORD` o `ACTA_SEQUIA`, avaluar si:
    - ✅ **Cumpleix el Trellat** (sentit comú, sense sobre-enginyeria).
    - ✅ **Cumpleix la Pedra Seca** (codi sòlid, sense dependències innecessàries).
    - ✅ **És documentada** en la Wiki amb enllaços bidireccionals.
  - `CT = (Decisions coherentes / Decisions totals) * 100`

#### 2. **Eficiència Cognitiva (CE)**
- **Mètode:**
  - `CE = (Tokens útils / Tokens totals) * 100`
  - **Tokens útils:** Aquells que contribueixen directament a la solució (codi, anàlisi forense, propostes concretes).
  - **Tokens inutils:** *Yapping*, explicacions redundants, o respostes genèriques ("AI Slop").
  - **Eina:** Usar el **Compilador de Coherència** (Qwen) per analitzar els logs.

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
| **IT ≥ 90%**          | Simbiosi Òptima         | Continuar. Celebrar amb un **"Això és Trellat!"** i registrar a l'Acta de la Marmota. |
| **70% ≤ IT < 90%**    | Simbiosi Acceptable     | Revisar les variables amb **IT < 80%** i aplicar millores.                     |
| **IT < 70%**          | **SOSP-LOCK ACTIVAT**   | **Aturar tot desenvolupament.** Convocar **Consell de Guerra** amb totes les IAs. |

---
### **🔄 Ritual de Mesurament**
1. **Freqüència:** Calculat **automàticament** després de cada sessió de treball (o manualment amb el comandament **"Calcula el Trellat"**) executant `npm run log-session`.
2. **Registre:** Guardar el resultat a `_wiki_de_poble/06_metriques/IT_YYYY-MM-DD.md` a través del script `session-logger.js`.


---

## 🔗 Sinapsi Arquitectònica

- [[05_skills_ia/sequia_mare/SKILL|sequia_mare]]
- [[05_skills_ia/semantic_compression/SKILL|semantic_compression]]
