---
name: 'successio-lazaro-execucio'
version: '15.00'
created_at: '260707_0238'
updated_at: '260707_0238'
autor: 'IAIA MarIA + Codex'
categoria: 'skill'
tipus: 'protocol-execucio'
estat: 'canonic'
description: 'Protocol tècnic de successió, reconstrucció i continuïtat operativa del Mas.'
replaces:
  - '01_SABER_Cultura_Coneixement/codex_huma/Arquitectura_Protocol_Lazaro.md'
  - '02_ACTUAR_Maquina_Tecnica/skills/sagramental_dels_morts.md'
tags:
  - execucio
script: ''
---

# Successió Lázaro Execució

## Objectiu

Garantir que Sóc de Poble pot ser llegit, reconstruït i mantingut si el Mestre Javi desapareix temporalment, hi ha pèrdua de context o cal reconstruir el sistema des de fragments.

## Activadors

- 90 dies d’inactivitat absoluta del Mestre.
- Pèrdua greu de repositori o entorn.
- Trencament de memòria IA.
- Necessitat de reconstrucció manual.
- Auditoria de continuïtat.

## Nivells

| Nivell | Estat | Acció |
|---|---|---|
| 0 | Normal | Cap acció. |
| 1 | Observació | Només lectura i inventari. |
| 2 | Conservació | Correccions no destructives: enllaços, metadades, índexs. |
| 3 | Reconstrucció | Protocol Lázaro amb aprovació dual. |
| 4 | Llegat | Aturar evolució i documentar per humans futurs. |

## Procediment Lázaro

1. Localitza `00_core_wiki/00_INDEX.md`.
2. Llig `00_BIOS`, `02_GENOTIP` i `DOC_Governanca`.
3. Reconstrueix el mapa de pilars.
4. Escaneja fitxers crítics.
5. Genera inventari JSON.
6. Detecta buits i contradiccions.
7. Prioritza lectura humana abans que automatització.
8. Només escriu si el nivell ho permet.

## Prohibicions

- No refactoritzar per gust.
- No introduir dependències noves.
- No alterar identitat.
- No esborrar memòria històrica.
- No activar bypass sense aprovació dual.
- No enviar dades personals a IAs externes.

## Output Obligatori

```json
{
  "ok": true,
  "level": 1,
  "mode": "observacio|conservacio|reconstruccio|llegat",
  "inventory": [],
  "missing": [],
  "actions": [],
  "requires_human": []
}
```

## Reversió

Tota acció de successió ha de ser reversible.

Si el Mestre torna, es desactiva el mode llegat i es genera acta de reconciliació.

## Sinapsis

- [[02_GENOTIP]]
- [[DOC_Governanca]]
- [[LLEI_05_Privacitat]]
- [[00_index]]
