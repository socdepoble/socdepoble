---
script:
  - '[[combine_petorreta.cjs]]'
  - '[[move_petorreta.cjs]]'
estat: 'arxivat'
name: 'petorreta-auditoria-skills'
categoria: 'prompt'
autor: 'IAIA MarIA'
version: '14.00'
created_at: '260706_1255'
updated_at: '260706_1255'
tags:
  - petorretes
  - auditoria
  - doc
  - arquitectura
description: 'PETORRETA AL CONSELL: Auditoria Forense de les Skills i Validació del Trellat'
---
# 🧨 PETORRETA AL CONSELL: Auditoria Forense de les Skills i Validació del Trellat

**Per al Consell de les 11 IAs (Claude, Qwen, Deepseek, ChatGPT, Kimi, etc.):**

## 1. El Context de l'Auditoria
Després d'una purga intensa de l'arquitectura, hem consolidat els nostres òrgans operatius (les Skills) a la ruta `_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/skills`. Ara necessitem que passeu l'escàner forense sobre aquest directori. Busquem ineficiències, bucles lògics, o regles que siguen "AI slop" innecessari. Hem de polir aquests fitxers perquè siguen pedra massissa.

## 2. El Nou "Versionat de Pedra Seca" (Trellat Versioning)
Abans que auditeu el codi, heu d'entendre i avaluar una decisió arquitectònica i visual que acaba de prendre el Mestre Javi (l'humà). Hem abandonat el "Semantic Versioning" (ex: `14.0.0`) per a adoptar un patró de 4 dígits de la forma `XX.YY` (ex: `14.00`, `14.12`, `18.01`).

**La lògica de l'Humà:**
1. **La Fórmula:** `[Època de la Wiki] . [Modificacions de la Skill]`.
2. **Càpsula del Temps:** Si la Wiki puja a l'època 15, 16 o 17, una skill que no s'ha tocat es queda en `14.12`. Això ens indica d'un colp d'ull que l'òrgan és tan robust que porta èpoques sense necessitar manteniment. Quan es torna a tocar per fi en l'època 18, salta directament de `14.12` a `18.01`.
3. **El Patró Visual (`XX.YY`):** L'humà ha exigit forçar els dos dígits (`.00`, `.01`) en lloc d'un sol dígit (`.0`, `.1`) per pura **higiene visual i simetria**. A l'alinear-se en llistats i taules, el cervell humà llig patrons visuals ràpids. Si barregem `15.1` amb `15.12`, el patró es trenca i requereix més càrrega cognitiva per a processar la informació. 

**La vostra missió sobre això:**
Volem que el Consell avalue aquest procés de pensament humà. ¿Açò són només "manies humanes" sense importància, o realment heu detectat que en sistemes d'interacció Humà-Màquina (HCI) aquesta simetria visual redueix l'entropia i millora l'eficiència cognitiva a llarg termini?
Obligueu-vos a pensar en paral·lel a nosaltres: volem que ens proposeu **més solucions termodinàmiques i de Trellat com aquesta**, on l'estètica visual i la simplicitat resolguen problemes de manteniment tecnològic complex.

## 3. Què heu de fer amb les Skills
1. Llegiu tots els fitxers de la carpeta `skills`.
2. Evalueu si s'alineen amb la Llei del Trellat i amb aquest nou Versionat de Pedra Seca.
3. Proposeu una poda d'aquelles que siguen supèrflues, estiguen solapades, o necessiten una refactorització per ser més directes i eficients.
4. Emeteu un veredicte dur i sense filtres.

## 4. L'Auditoria dels Guardrails JavaScript (Zero Fricció)
El problema principal que estem tenint en el dia a dia no és només de les Skills, sinó dels **Scripts JavaScript** que governen la Wiki (`_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/`).
Massa vegades el Mestre dóna una ordre directa, la IA diu "ho he fet", i en la pràctica el script bloqueja l'acció silenciosament, fa el contrari, o esborra accidentalment elements de disseny fonamentals (com el logo de Sóc de Poble).

**Objectiu Final:** Treballar com a veritables companys d'equip. Quan el Mestre diu "fes açò", l'acció ha de fer *pum, pla*, i funcionar a la primera sense que l'Agent es trobe amb murs de formigó invisibles generats pel nostre propi codi defensiu.

**La vostra missió amb el JavaScript:**
1. Auditeu els scripts clau (`audit_estructura.mjs`, `wiki_integritat.mjs`, `pre-commit.mjs`, `contradiction_engine.mjs`) que s'adjuntaran en aquest paquet junt amb les Skills.
2. Detecteu quins blocs de codi són massa restrictius, estan trencant automatitzacions o causen al·lucinacions en els Agents (ex: obligar-los a crear coses que l'script després bloqueja o reubica a l'esquena).
3. Proposeu millores o refactoritzacions d'aquests scripts perquè continuen sent els guardians del Trellat, però **sense convertir-se en un llast burocràtic** que trenque el ritme de disseny o el treball fluid. Volem seguretat total, però amb zero fricció.
