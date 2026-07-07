---
name: 'forja-to-core'
version: '15.00'
created_at: '260707_0238'
updated_at: '260707_0238'
autor: 'IAIA MarIA + Codex'
categoria: 'governanca'
tipus: 'protocol'
estat: 'canonic'
description: 'Protocol de promoció de components des de Forja cap al Core.'
tags:
  - execucio
  - tecnologia
---

# FORJA TO CORE

## Regla d’Or

Cap component entra al Core si no compleix tot:

1. passa test iPad A10
2. usa `--sp-*` en lloc de Tailwind estètic
3. és 100% Vanilla JS o Web Components purs
4. no importa React
5. no importa Tailwind
6. no depén de llibreries UI externes
7. no fa imports creuats des de `src/forja/`

## Frontera Física

El Core (`src/core/`) és 100% Vanilla JS i Web Components.

La Forja (`src/forja/`) permet React/Tailwind.

Prohibit imports creuats.

## Flux

1. Component naix en `src/forja/`.
2. Es valida funcionalment.
3. Es tradueix Tailwind a classes semàntiques `sp-*`.
4. Es reescriu React a Web Component o Vanilla JS.
5. Es passa `sdp lint`.
6. Es passa `sdp test --profile ipad-a10`.
7. Es mou a `src/core/`.
8. Es registra acta.

## Checklist

- [ ] Sense `bg-*`, `text-*`, `rounded-*`, `shadow-*`.
- [ ] Sense imports de React.
- [ ] Sense imports de Tailwind.
- [ ] Sense dependències UI.
- [ ] CSS amb tokens `--sp-*`.
- [ ] Touch target mínim 48px.
- [ ] Text base mínim 16px.
- [ ] Funciona offline.
- [ ] DOM semàntic.
- [ ] Test A10 superat.

## Output d’Homologació

```json
{
  "component": "string",
  "from": "src/forja/",
  "to": "src/core/",
  "a10": true,
  "vanilla": true,
  "tokens": true,
  "tailwind": false,
  "approved": true
}
```

## Sinapsis

- [[ESTANDARD_Pedra_Seca]]
- [[DOC_Governanca]]
- [[02_GENOTIP]]
