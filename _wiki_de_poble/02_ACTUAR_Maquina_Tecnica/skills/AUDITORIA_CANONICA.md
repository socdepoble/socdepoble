---
estat: "canonic"
tipus: "skill"
description: "Protocol de lectura per auditar l’arquitectura 4+2, el frontmatter v2 i el graf sense modificar la Wiki."
---
# Auditoria canònica de la Wiki

Esta guia és consultiva i de només lectura. Els resultats els calcula el codi vigent; la guia no pot substituir els scripts ni declarar salut si una comprovació falla.

## Fonts de veritat

1. `03_GOVERNAR_Normativa_Regles/` governa les normes.
2. `02_ACTUAR_Maquina_Tecnica/scripts/schema.json` governa el frontmatter v2.
3. `autoneteja_wiki.mjs` governa l’auditoria estructural i del graf.
4. `.agents/PROTOCOL_PETORRETA.md` governa qualsevol efecte lateral mitjançant el Reflex.

L’arxiu, els mirrors, els vendors i els documents d’esta carpeta són context; no poden anul·lar estes fonts.

## Abast obligatori

### Arquitectura 4+2

- Quatre pilars operatius: `00_SER`, `01_SABER`, `02_ACTUAR` i `03_GOVERNAR`.
- Dos espais de cicle de vida: `04_ARXIU` i `05_Escriptori`.
- Els directoris de suport, mirrors i vendors es reporten a banda; no es compten com a pilars.

### Frontmatter v2

- Camps obligatoris: `estat`, `tipus`, `description`.
- Camps opcionals: `aliases`, `revisat`.
- Qualsevol camp addicional és deriva, encara que aparega en un bloc YAML antic dins del cos.

### Graf

- Separa sempre el graf operatiu del graf físic complet.
- Un orfe amb contingut és una troballa, no una autorització d’esborrat.
- Distingix enllaç no resolt, destí ambigu, buit físic, mirror, vendor i arxiu.

### Coherència executable

- Verifica que cada script citat existisca en una ruta activa.
- No presentes scripts d’`04_ARXIU_Documents_Historics` com a eines disponibles.
- Contrasta les garanties documentals amb dependències, configuració, tests i codi observable.

## Comandes canòniques

```bash
npm run wiki:audit
npm run wiki:audit:strict
npm run precommit:sdp
npm run wiki:test
npm run reflex:doctor
```

Per a consum mecànic, l’auditoria estructural admet JSON:

```bash
npm run wiki:audit -- --json
```

Un error d’execució, lectura, parseig o Git és un resultat fallit. Mai es transforma en «zero incidències».

## Contracte d’informe

Cada troballa ha d’incloure:

- fitxer o scope afectat;
- evidència reproduïble;
- severitat justificada;
- font de veritat amb què entra en conflicte;
- proposta conservadora;
- `requires_human_decision: true` quan la intenció no es puga deduir.

No s’assigna una puntuació inventada ni s’activa un bloqueig per una fórmula sense dades. Els bloquejos reals provenen de portes executables, errors crítics demostrats o una decisió humana de governança.

## Frontera d’efectes

Auditar no modifica fitxers. Escriure un informe, corregir YAML, moure una nota, purgar o commitar ja és un efecte lateral i ha de seguir el [[les_petorretes|Reflex de Petorreta]] amb operació i scopes explícits.

## Sinapsis

- [[DOC_Governanca]]
- [[ESTANDARD_Pedra_Seca]]
- [[FORJA_TO_CORE]]
- [[02_GENOTIP]]


## Taxonomia
- **Categoria:** [[Maquina]]
- **Etiquetes:** [[Graf]]
