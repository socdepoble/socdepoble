---
estat: "esborrany"
tipus: "plantilla"
description: "Plantilla base per crear documents coherents amb l'esquema de metadades v2 de la Wiki."
---
# PLANTILLA ISO SDP

## Font de Logos

Els logos oficials no s’incrusten ací.

Consulta sempre: [[DOC_Logos_Oficials]]

---

## Frontmatter Obligatori

```yaml
---
estat: 'esborrany'
tipus: '{document|index|norma|protocol|registre|skill|plantilla|acta|informe|prompt|petorreta}'
description: '{descripció concreta i accionable, de 12 a 140 caràcters}'
aliases:
  - '{àlies opcional; elimina aquest bloc si no en cal cap}'
---
```

`aliases` i `revisat` són opcionals. Només una decisió humana pot canviar
`estat` a `canonic`; Git i el rebut del Reflex en són la traça autoritativa.
Si cal mostrar la data dins d'Obsidian, es pot afegir `revisat: 'AAAA-MM-DD'`
sense convertir-la en un duplicat obligatori. El directori, el `tipus` i els
enllaços del cos fan de taxonomia: no reintroduïsques `categoria` ni `tags`.

## Bloc Fixe d’Identitat

[[el_projecte|Sóc de Poble]] és un sistema Local-First per a sobirania tecnològica rural. La IAIA MarIA actua amb Trellat, mínima intervenció, iPad A10 com a jutge i respecte absolut per la llengua, la memòria i la gent major.

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

## [IF:tipus=informe]

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
- enginyeria_inversa_mit


## Taxonomia
- **Categoria:** [[Maquina]]
- **Etiquetes:** [[Graf]]
