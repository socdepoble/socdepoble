---
script:
  - '[[generate_slim_bundle.cjs]]'
  - '[[generate_nano_prompt.cjs]]'
estat: 'arxivat'
name: petorreta-auditoria-semantica
version: '14.00'
created_at: '260706_1356'
updated_at: '260706_1356'
autor: IAIA MarIA
categoria: PROMPT
description: Petorreta dirigida al Consell de les IAs per desenvolupar un motor d'auditoria semàntica de carpetes basada en el Trellat.
tags:
  - doc
  - auditoria
  - trellat
---

# 🚀 PETORRETA AL CONSELL DE LES 11 IAs: L'Auditoria Semàntica

**Data:** 260706_1356 | **Autoritat:** Mestre Javi & IAIA MarIA
**Objectiu:** Programar una lògica/skill de Javascript que permeta al sistema deduir l'obsolescència de carpetes per pura semàntica humana (Trellat), sense necessitat de regles *hardcoded*.

---

## 🏛️ SUPER CABECERA CONTEXTUAL (Front-Loading per al Consell)
*Atenció Consell (Claude, Qwen, Deepseek, Dola, etc.): Llegiu això detingudament abans de generar codi.*

**1. Qui Som i Què Fem:**
Som "Sóc de Poble", un ecosistema basat en Obsidian i liderat per la "IAIA MarIA", una IA arquitectònica. La nostra filosofia es basa en el "Trellat" (el sentit comú i la lògica deductiva valenciana). La Wiki és el nostre cervell, i es regeix per una arquitectura immutable i innegociable de 5 Pilars Centrals:
- `00_SER_Brain_Identitat` (Qui som)
- `01_SABER_Cultura_Coneixement` (Què sabem)
- `02_ACTUAR_Maquina_Tecnica` (Què fem, ací viuen els scripts i skills)
- `03_GOVERNAR_Normativa_Regles` (Com ho fem)
- `04_ARXIU_Documents_Historics` (La nostra memòria i logs de treball)

**2. La Llei Termodinàmica:**
Tots els fitxers Markdown de contingut han d'obeir una nomenclatura estricta per facilitar el "scan" visual humà i evitar al·lucinacions de la màquina: `YYMMDD_HHMM_CATEGORIA_Titol.md`. Tots els fitxers han de dur al seu frontmatter un versionat `XX.YY` (ex: `14.00`). Cap document solt o carpeta aliena pot viure a l'arrel de la Wiki.

**3. El Problema a Resoldre (Lògica Humana vs Màquina):**
*Cas 1: L'Ordre de les Carpetes*
L'humà (Mestre Javi) ha revisat l'arrel i ha detectat una carpeta anomenada `80_produccio` i una anomenada `_build`. El Mestre, aplicant lògica humana, ha pensat: *"La carpeta producció ja no té sentit, perquè ara els bundles es guarden al `bancal_actiu`. A més, la carpeta de `_build` és de software, hauria d'anar dins de `scripts/`"*.

*Cas 2: La Llei Termodinàmica Cega*
L'humà també s'ha adonat que estem forçant noms termodinàmics (`YYMMDD_HHMM_...`) a fitxers on no té cap sentit pràctic. Exemples:
- `registre_automillora`: És un log on la data ja s'escriu dins com a nova fila de la taula. Per què el fitxer necessita data al nom si s'actualitza contínuament?
- `Taula_Mestra`: És una dashboard fixa. No té sentit posar-li data al nom.
- `Skills` (ex: `consola_termodinamica.md`): Ja tenen la seua pròpia versió (`XX.YY`) al frontmatter.
- Carpetes com `narrativa_historica`: Són directoris i no tenen per què portar data.
Això genera un overhead innecessari (fricció).

Aquesta classe de deducció la fa fàcilment un humà... **Però una IA també hauria de poder fer-ho!** Volem que ens dissenyeu el codi, la matemàtica o l'estructura algorítmica per tal que la "IAIA MarIA" (el sistema) siga capaç de:
1. Auditar el mapa de carpetes i trobar "coses que no quadren semànticament".
2. Deduir matemàticament o algorítmicament quins fitxers **necessiten** el prefix termodinàmic i quins **no el necessiten en absolut**.

---

## 🛠️ BUNDLE DE L'ARQUITECTURA ACTUAL (El "Core" JS)
Aquests són els nostres guardrails principals actuals que limiten l'escriptura. Feu servir aquesta arquitectura modular com a base/inspiració. 

### 1. `lib/termodinamic.mjs` (Llei Canònica)
```javascript
export const CATEGORIES = ['ACTA', 'REPORT', 'SKILL', 'DOC', 'CORE', 'PROMPT', 'WORKFLOW', 'ASSET', 'PLANTILLA'];
export const CHAR_WHITELIST_REGEX = /^[A-Za-z0-9_.]+$/;
export const TERMODINAMIC_REGEX = new RegExp(`^\\d{6}_\\d{4}_(${CATEGORIES.join('|')})_[A-Za-z0-9_]+\\.md$`);
export const EXEMPT_BASENAMES = new Set(['README.md', '00_index.md', '.gitignore', '.DS_Store']);

export function isValidContentFile(filename) { return TERMODINAMIC_REGEX.test(filename); }
```

### 2. `audit_estructura.mjs` (El Guardrail Dur)
```javascript
import { isValidContentFile, hasValidCharset, EXEMPT_BASENAMES } from './lib/termodinamic.mjs';

export const PILARS_VIGENTS = [
  '00_SER_Brain_Identitat', '01_SABER_Cultura_Coneixement', '02_ACTUAR_Maquina_Tecnica', 
  '03_GOVERNAR_Normativa_Regles', '04_ARXIU_Documents_Historics'
];
const ALLOWED_ROOT_FILES = new Set(['README.md', '00_index.md', '.gitignore', 'package.json', 'package-lock.json', '.DS_Store']);
const ALLOWED_ROOT_DIRS = new Set(['.git', '.husky', 'node_modules']);

function checkRootPillars(rootLevelEntries) {
  const errors = [];
  for (const entry of rootLevelEntries) {
    if (entry.isDirectory) {
      if (!PILARS_VIGENTS.includes(entry.name) && !ALLOWED_ROOT_DIRS.has(entry.name)) {
        errors.push(`[ERROR-PILAR] Carpeta il·legal a l'arrel: '${entry.name}'.`);
      }
    }
  }
  return errors;
}
// (Inclou comprovació de versió XX.YY, illament cognitiu de links i test termodinàmic)
```

### 3. `wiki_integritat.mjs` (Root Hygiene / Gestor d'Orfes)
```javascript
// Detecta fitxers orfes a l'arrel i els avisa (o els mou amb flag --fix)
export async function auditRootHygiene(rootDir, orphanDir, isFixMode = false) {
  // Ignora si el frontmatter diu: 'autoritat: Mestre Javi' o 'x-skip-hygiene: true'
  // Si hi ha flag --fix, reanomena de forma segura i ho envia al bancal_actiu del pilar 04_REGISTRE.
}
```

### 4. Mostra de Skills Actives (Com a context)
Per entendre com funcionem, ací teniu 4 Skills vitals que governen la màquina. Totes viuen a `02_ACTUAR_Maquina_Tecnica/skills/`:

**auto_auditoria_forense.md**
```markdown
name: [auto_auditoria_forense]
version: '14.00'
description: 'Aquesta SKILL actua com l'inspector intern que avalua de manera periòdica l'estat global del codi, la coherència de la Wiki i els enllaços interns.'
```

**arquitectura_pedra_seca.md**
```markdown
name: 'arquitectura-pedra-seca'
version: '14.00'
description: 'Estàndards de disseny, maquetació, Tailwind, CSS i tokens. La Llei de Ferro: Cos (Tailwind) vs Vestit (CSS).'
```

**contradiction_engine.md**
```markdown
name: 'contradiction-engine'
version: '14.00'
description: 'Auditor Suprem i Sentinella Forense per detectar contradiccions, podar elements morts i generar informes (les petorretes).'
```

**consola_termodinamica.md**
```markdown
name: 'consola-termodinamica'
version: '14.00'
description: 'Protocol de monitoratge i autorecuperació. Centralitza les mètriques sagrades (Índex de Trellat, Entropia de Tokens, CWV) i alertes de RAM.'
```

---

## ⚡ PETICIÓ EXPLICITA PER AL CONSELL
Necessitem els vostres "cerveils" en paral·lel. Com dissenyaríeu un mòdul o Skill (ex: `semantic_auditor.mjs` o `auditoria_semantica.md`) que analitze l'arbre de directoris (incloent-hi el nom de les carpetes internes i on estan ubicades) i emeta **alertes de Trellat** (ex: *"Aquesta carpeta sembla que allotja builds però no està dins de scripts"*, o *"Aquesta carpeta es diu Vella_Produccio i està replicant el Pilar 04"*).

**Requisits de la vostra resposta:**
1. **Lògica de Carpetes:** Com implementem un raonament semàntic per detectar anomalies de carpetes sense gastar tokens infinits analitzant fitxer per fitxer? Fent servir IA o per heurístiques JS?
2. **Algorisme Termodinàmic:** Proposeu un algorisme o raonament matemàtic que el sistema puga fer servir per decidir de forma autònoma i intel·ligent si un fitxer MEREIX la llei termodinàmica (data al nom) o no.
3. **Codi/Skill:** Proporcioneu el codi d'aquesta nova auditoria en format Node.js pur (`.mjs`) o l'esbós d'una Skill Markdown mestra.
4. **Paciència Estratègica:** No modifiqueu el que ja tenim construït (`audit_estructura.mjs`). Aquest mòdul ha de ser una capa cognitiva *superior* i autònoma que actue com un cervell que llegeix l'estructura.

Consell... comenceu a deliberar!
