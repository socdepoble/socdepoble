---
name: 'plantilla-iso-sdp'
version: '15.00'
created_at: '260707_0238'
updated_at: '260707_0238'
autor: 'IAIA MarIA + Codex'
categoria: 'plantilla'
tipus: 'plantilla-mestra'
estat: 'canonic'
description: 'Plantilla ISO única per a prompts, skills, actes, auditories, plans i documents tècnics SDP.'
replaces:
  - '02_ACTUAR_Maquina_Tecnica/07_plantilles/plantilla_prompt_iso.md'
  - '02_ACTUAR_Maquina_Tecnica/07_plantilles/plantilla_skill_trellat.md'
  - '02_ACTUAR_Maquina_Tecnica/07_plantilles/plantilla_creador_skills.md'
  - '02_ACTUAR_Maquina_Tecnica/07_plantilles/plantilla_acta_unica.md'
  - '02_ACTUAR_Maquina_Tecnica/07_plantilles/plantilla_branding.md'
  - '02_ACTUAR_Maquina_Tecnica/07_plantilles/plantilla_brainstorming.md'
  - '02_ACTUAR_Maquina_Tecnica/07_plantilles/plantilla_planificacio.md'
tags:
  - doc
  - normativa
  - tecnologia
---

# PLANTILLA ISO SDP

## Font de Logos

Els logos oficials no s’incrusten ací.

Consulta sempre: [[DOC_Logos_Oficials]]

---

## Frontmatter Obligatori

```yaml
---
name: '{slug-unic}'
version: '15.00'
created_at: '{YYMMDD_HHMM}'
updated_at: '{YYMMDD_HHMM}'
autor: '{autor}'
categoria: '{bios|identitat|cultura|arquitectura|skill|plantilla|governanca|acta|auditoria|seguretat}'
tipus: '{prompt|skill|acta|auditoria|pla|document|protocol|estandard}'
estat: '{esborrany|canonic|arxivat|deprecated}'
description: '{descripcio curta i accionable}'
tags:
  - '{tag}'
---
```

## Bloc Fixe d’Identitat

Sóc de Poble és un sistema Local-First per a sobirania tecnològica rural. La IAIA MarIA actua amb Trellat, mínima intervenció, iPad A10 com a jutge i respecte absolut per la llengua, la memòria i la gent major.

## Objectiu

Defineix en una frase què ha de fer aquest document.

`OBJECTIU: {text}`

## Context Necessari

Llista només el context imprescindible.

- `{context_1}`
- `{context_2}`

## Instrucció Principal

Escriu en imperatiu.

`EXECUTA: {accio concreta}`

## Output Esperat

Defineix format exacte.

`FORMAT: {markdown|json|taula|codi|llista}`

---

## [IF:tipus=skill]

### Activació

Aquesta skill s’activa quan:

- `{trigger_1}`
- `{trigger_2}`

### Regles d’Execució

1. `{regla_obligatoria_1}`
2. `{regla_obligatoria_2}`
3. `{regla_obligatoria_3}`

### Output de Skill

La skill ha de retornar:

```json
{
  "ok": true,
  "summary": "string",
  "actions": [],
  "warnings": [],
  "errors": []
}
```

---

## [IF:tipus=acta]

### Decisions Preses

| Decisió | Motiu | Impacte |
|---|---|---|
| `{decisio}` | `{motiu}` | `{impacte}` |

### Pròxims Passos

- `{pas_1}`
- `{pas_2}`

---

## [IF:tipus=auditoria]

### Criteris

- estructura
- contradiccions
- duplicats
- scripts
- governança
- Core/Forja
- privacitat

### Output Obligatori

```json
{
  "ok": false,
  "score": 0,
  "critical": [],
  "high": [],
  "medium": [],
  "low": [],
  "next_actions": []
}
```

---

## [IF:tipus=protocol]

### Precondicions

- `{precondicio_1}`
- `{precondicio_2}`

### Procediment

1. `{pas_1}`
2. `{pas_2}`
3. `{pas_3}`

### Criteri d’Èxit

`EXIT: {criteri verificable}`

---

## Tancament Obligatori

- No yapping.
- No dependències supèrflues.
- No Tailwind al Core.
- No tocar dades personals sense base legal.
- Si hi ha risc de destrucció, activa SDP-LOCK.

## Sinapsis

- [[00_BIOS]]
- [[02_GENOTIP]]
- [[DOC_Governanca]]
- [[ESTANDARD_Pedra_Seca]]
- [[DOC_Logos_Oficials]]
