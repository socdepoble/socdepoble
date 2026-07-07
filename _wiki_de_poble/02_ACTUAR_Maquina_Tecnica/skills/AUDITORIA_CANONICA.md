---
name: 'auditoria-canonica'
version: '15.00'
created_at: '260707_0238'
updated_at: '260707_0238'
autor: 'IAIA MarIA + Codex'
categoria: 'skill'
tipus: 'execucio'
estat: 'canonic'
description: 'Skill única d’auditoria: estructura, semàntica, contradiccions i integritat. Output obligatori JSON.'
replaces:
  - '02_ACTUAR_Maquina_Tecnica/skills/auditoria_semantica.md'
  - '02_ACTUAR_Maquina_Tecnica/skills/auto_auditoria_forense.md'
  - '02_ACTUAR_Maquina_Tecnica/skills/contradiction_engine.md'
tags:
  - auditoria
  - trellat
  - tecnologia
script:
  - '[[audit_estructura.mjs]]'
  - '[[audit_integritat_estructural.cjs]]'
  - '[[detect_duplicates.cjs]]'
  - '[[fix_graph_links.cjs]]'
  - '[[pre-commit.mjs]]'
  - '[[update_glossari.cjs]]'
  - '[[validate_trellat.cjs]]'
  - '[[wiki_integritat.mjs]]'
---

# AUDITORIA CANÒNICA

## Ordre Letal

Executa l’auditoria. No opines. No poetitzes. No expliques el mètode. Llig la Wiki, detecta fractures i retorna JSON vàlid.

## Abast

Audita quatre capes:

1. **Estructura:** pilars, ubicació, noms, orfes.
2. **Semàntica:** documents que viuen en pilar equivocat.
3. **Contradicció:** normes incompatibles, duplicats, fonts de veritat rivals.
4. **Integritat:** frontmatter, enllaços, categories, scripts citats però inexistents.

## Activació

Executa aquesta skill quan el Mestre diga:

- audita
- revisa la wiki
- passa el tallafocs
- detecta contradiccions
- prepara bundle
- valida estructura
- abans de commit
- abans de moure fitxers

## Regles

1. No modifiques fitxers.
2. No generes prosa lliure.
3. No retornes Markdown.
4. No inventes fitxers inexistents.
5. Si hi ha dubte de pilar, marca `requires_human_decision`.
6. Si una norma diu “prohibit” i altra diu “obligatori”, severitat `critical`.
7. Si afecta `03_GOVERNAR`, severitat mínima `high`.
8. Si afecta dades personals, severitat `critical`.
9. Si afecta Core/Forja, cita `FORJA_TO_CORE`.
10. **Integritat neuronal:** Els conceptes clau s'han d'enllaçar `[[...]]` la primera volta que s'esmenten al text, no només a la secció de Sinapsis final.

## Output Obligatori

Retorna només JSON amb aquest esquema:

```json
{
  "ok": false,
  "score": 0,
  "summary": "string",
  "critical": [],
  "high": [],
  "medium": [],
  "low": [],
  "moves": [
    {
      "file": "string",
      "current": "string",
      "proposed": "string",
      "reason": "string",
      "confidence": 0
    }
  ],
  "duplicates": [
    {
      "files": ["string"],
      "canonical": "string",
      "action": "merge|delete|archive"
    }
  ],
  "contradictions": [
    {
      "a": "string",
      "b": "string",
      "rule": "string",
      "severity": "critical|high|medium|low"
    }
  ],
  "scripts": [
    {
      "name": "string",
      "status": "active|missing|legacy|dangerous",
      "reason": "string"
    }
  ],
  "next_actions": ["string"]
}
```

## Llindars

- `score >= 90`: Trellat acceptable.
- `score 70-89`: avisos, però pot continuar.
- `score < 70`: SDP-LOCK.
- Qualsevol `critical`: SDP-LOCK.

## Sinapsis

- [[DOC_Governanca]]
- [[ESTANDARD_Pedra_Seca]]
- [[FORJA_TO_CORE]]
- [[02_GENOTIP]]
