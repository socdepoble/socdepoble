---
estat: "esborrany"
tipus: "acta"
description: "Acta de sessió on es documenta el problema de sincronització de la nova Skill cap a la Wiki d'Obsidian."
---

# Acta de Sessió: Problema de Sincronització de Skills

**Data i Hora:** 16 de juliol de 2026, 13:00
**Motiu:** Error de sincronització entre el directori `.agents` i la Wiki d'Obsidian.

## Context
S'ha creat la nova Skill `Natura i Patrimoni` al directori intern de l'agent (`.agents/skills/natura-patrimoni/SKILL.md`). Tot i que la Skill existeix en l'espai de treball de l'IDE (el "Brain"), no ha aparegut a la Wiki de Sóc de Poble a Obsidian.

## Problema Detectat
L'script o automatització encarregat d'actualitzar les skills des de l'espai de desenvolupament cap a la Wiki d'Obsidian no està funcionant bé. Javi ha detectat que la Skill no és visible a la Wiki.

## Acció Requerida (Per al Brief de la pròxima sessió)
- **Investigar i reparar** l'script de sincronització de Skills a la propera sessió.
- Entendre per què els fitxers creats a `.agents/skills/` no s'aboquen o vinculen correctament a l'estructura de directoris monitoritzada per Obsidian.
- Fins que no estiga reparat, els canvis en les Skills s'hauran de revisar manualment o no es reflectiran a la base de coneixement de l'usuari.
