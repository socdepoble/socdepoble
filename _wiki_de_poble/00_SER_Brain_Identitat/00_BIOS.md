---
estat: "arxivat"
tipus: "document"
description: "Conserva la BIOS històrica i redirigix l'arrencada de l'agent cap al Reflex i les fonts d'autoritat reals."
---
# BIOS històrica — redirecció vigent

Esta pàgina conserva el nom de l'antiga BIOS perquè els enllaços no es trenquen,
però **ja no és el punt d'entrada executable**. Les ordres antigues
`node scripts/tallafocs.cjs`, `guardrail_escriptura.js`,
`validate_knowledge.cjs` i `build_incremental.cjs` no formen un preflight vàlid
en [[el_projecte|el projecte]] actual. Tampoc hi ha una pila activa basada en `idb-keyval`,
Y.js o WebRTC.

## Arrencada actual

1. Llegir `AGENTS.md`, `.agents/AGENTS.md`,
   `.agents/PROTOCOL_PETORRETA.md` i la Skill de workflow.
2. Localitzar codi, proves i documents estrictament relacionats amb la tasca.
3. Abans de qualsevol efecte lateral, completar `reflex_petorreta.mjs open`,
   crear Petorreta + manifest al bootstrap reservat i executar `seal`.
4. Fer dry-run, aplicar només l'operació autoritzada, verificar i consumir el
   rebut corresponent.

Les fonts mecàniques són [[00_arquitectura_tecnica_unificada]],
`scripts/schema.json`, l'Autoneteja v2, els tests i els hooks/CI quan estiguen
versionats. La frase «Sóc de Poble!» és un recordatori cultural, no una clau
d'escriptura.

## Llegat útil

Es conserven tres idees de l'antiga BIOS: protegir l'humà de treball mecànic,
preferir solucions simples i verificables, i aturar una operació quan la prova
no pot demostrar seguretat. La resta queda subordinada a [[02_GENOTIP]] i a
les fonts d'autoritat actuals.


## Taxonomia
- **Categoria:** [[Identitat]]
- **Etiquetes:** [[Graf]]
