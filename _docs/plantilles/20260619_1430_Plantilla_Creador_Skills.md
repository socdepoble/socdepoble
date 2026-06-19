# Creador de Skills Antigravity (La Fàbrica)
**Categoria:** Plantilla
**Data:** 2026-06-19
**Hora:** 14:30

---

![Logo Sóc de Poble](/assets/master/logo_socdepoble_white_full.png)

## MISSIÓ DEL PROTOCOL
Estandarditzar com es construeixen i es documenten les noves "Skills" (protocols automatitzats) per a moure el sistema the "conversa" a "fàbrica 10x".

## 1. ESTRUCTURA DE FITXERS
Tota Skill the la Masia ha de viure a: `/_SKILLS/<00_nom_termodinamic>/`

- `SKILL.md`: La lògica i instruccions mestres (Nom the fitxer innegociable per a Antigravity).
- `/recursos`: Fitxers de suport (JSON, MD, Imatges).
- `/scripts`: Scripts d'automatització (si cal).

## 2. FORMAT DEL SKILL.md (YAML)
Cada document ha de començar amb:
```yaml
name: "Nom the la Skill"
description: "Descripció concisa en tercera persona (màx 220 caràcters)."
trigger: "/skill <nom>"
version: "1.0"
```

## 3. WORKFLOW D'EXECUCIÓ
1. **Planificació:** Definir l'objectiu i els passos.
2. **Validació:** Verificar si els inputs són suficients (Trellat check).
3. **Execució:** Realitzar la tasca aplicant les regles the la marca.
4. **Entrega:** Resultat en format net (HTML/MD termodinàmic).

---
_Bategant amb Sóc de Poble! © 2026_
