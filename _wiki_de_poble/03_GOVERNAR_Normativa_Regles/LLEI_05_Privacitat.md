---
name: 'llei-05-privacitat'
version: '15.00'
created_at: '260707_0238'
updated_at: '260707_0238'
autor: 'IAIA MarIA + Codex'
categoria: 'governanca'
tipus: 'llei'
estat: 'canonic'
description: 'Llei de privacitat, consentiment, dret d’oblit i tractament de dades personals.'
replaces:
  - 'Fragments legals de 02_ACTUAR_Maquina_Tecnica/skills/seguretat_dades.md'
tags:
  - normativa
  - governanca
---

# LLEI 05 Privacitat

## 1. Principi

La privacitat és per defecte.

Sóc de Poble no recull, sincronitza, exposa ni conserva dades personals sense necessitat clara, context comprensible i base legítima.

## 2. Consentiment Invisible però Real

No es faran banners inútils.

El consentiment s’explica en el moment exacte de l’acció:

- “Aquesta foto es guardarà al teu dispositiu.”
- “Aquest missatge es compartirà amb el grup del poble.”
- “Aquesta dada quedarà només en local.”
- “Aquesta dada se sincronitzarà quan torne la connexió.”

Si la persona no pot entendre-ho, el flux està mal dissenyat.

## 3. Dret d’Oblit

Quan una persona demana l’esborrat:

1. S’elimina la dada local.
2. S’elimina qualsevol còpia OPFS vinculada.
3. Es genera una ordre de purga per a sincronització.
4. En CRDT, les dades personals no poden quedar llegibles dins tombstones.
5. Es registra l’acció sense conservar el contingut eliminat.

## 4. Minimització

Només es guarden les dades estrictament necessàries.

Prohibit guardar:

- dades “per si de cas”
- identificadors personals no justificats
- ubicacions precises sense necessitat
- converses privades en logs d’auditoria
- dades sensibles dins prompts enviats a IAs externes

## 5. Dades de Gent Major

Qualsevol flux per a gent major ha de ser:

- explícit
- reversible
- llegible
- sense engany visual
- sense caselles premarcades
- sense patrons foscos

## 6. Sortida a IAs Externes

Abans d’enviar context a una IA externa:

1. elimina dades personals
2. elimina telèfons, adreces i identificadors
3. substitueix noms per rols si no són necessaris
4. adjunta només el fragment imprescindible
5. registra que s’ha fet anonimització

## 7. SDP-LOCK Legal

Activa SDP-LOCK si:

- hi ha dades personals sense base clara
- es vol enviar informació sensible a una IA externa
- es detecta una còpia no xifrada
- es demana una purga destructiva sense confirmació
- hi ha contradicció entre tècnica i privacitat

## Sinapsis

- [[DOC_Governanca]]
- [[seguretat_execucio]]
- [[02_GENOTIP]]
