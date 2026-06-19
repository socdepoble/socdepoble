---
doc_type: Universal_Core
timestamp: 2026-04-13 03:35
authoring_agent: IAIA_Sistema
context_anchors:
  - _etnografia_llibres
---
# 🧬 Proposta d'Arbre Genètic Positiu per al Repositori (versió 1.0.0)

*(Originat per la visió de la Petorreta Internacional - Agent Grok - i validat per l'Arquitecte Humà)*

### 1. Protocol d'Aprenentatge: «REGISTRE_D’EVOLUCIÓ_POSITIVA.md» (format ISO Positive)

En lloc de sub-directoris `issues/` o `bugs/`, creem una única estructura immutable i lliure d'ansietat:

```text
docs/
└── genetics/
    └── positive-evolution/
        ├── 2026-04-11_ZombieCache_Eradication.md
        ├── 2026-04-12_PostDetail_Refactor.md
        └── ...
```

**Plantilla exacta (d'ús obligatori):**

```markdown
---
prompt_id: SOSP-GENETICS-XXX
date: 2026-04-11
version_semver: 1.0.0
module: src/features/post/PostDetail
status: ANTICÒS_EVOLUTIU_ACTIU
---

# EVOLUCIÓ POSITIVA: [Nom curt i positiu]

## Situació inicial (sense judici)
- Descripció neutral del comportament anterior.

## Transformació realitzada
- Canvi concret aplicat (codi o configuració).
- Benefici quantificable (ex.: +40 % estabilitat en iPad A10, 0 % QuotaExceeded).

## Anticòs Evolutiu generat
- Regla permanent que hem après i que mai més es repetirà.
- Exemple: «Tota cache de fitxers > 4 MB ha d’incloure purgeOnQuotaError: true».

## Impacte en el Genotip Sintètic
- Com aquesta decisió reforça la resiliència del projecte per a les properes generacions.
```

Aquest format converteix mecànicament qualsevol error en un **anticòs** documentat, sense rastre de frustració ni paraules bèl·liques.

### 2. Reestructuració FSD amb Memòria Genètica

Modifiquem l’estructura Feature-Sliced Design actual afegint una capa de memòria **immutable** dins de cada slice:

```text
src/
├── features/
│   └── post/
│       └── PostDetail/
│           ├── api/
│           ├── model/
│           ├── ui/
│           ├── index.tsx
│           └── _genetic/                  ← Nova carpeta (no es toca mai)
│               ├── evolution.md           ← Registre positiu del mòdul
│               └── decisions.json         ← Llista d’ADRs en format JSON per a parsers futurs
└── docs/
    └── genetics/
        └── positive-evolution/            ← Registre global (enllaça als _genetic/ locals)
```

El fitxer `_genetic/evolution.md` sempre comença amb la plantilla de l’apartat 1.

Aquest protocol garanteix que, dins de 50 anys, qui obri el repositori trobe únicament claredat, aprenentatge i evolució ascendent, mai amargor ni caos. El sistema nerviós del projecte ja està dissenyat. Només cal aplicar-lo avui mateix cap al futur.
