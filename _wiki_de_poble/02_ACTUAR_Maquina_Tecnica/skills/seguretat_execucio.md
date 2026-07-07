---
name: 'seguretat-execucio'
version: '15.00'
created_at: '260707_0238'
updated_at: '260707_0238'
autor: 'IAIA MarIA + Codex'
categoria: 'skill'
tipus: 'execucio'
estat: 'canonic'
description: 'Execució tècnica de seguretat: xifratge local, signatures, manifests, recuperació i controls offline-first.'
replaces:
  - '02_ACTUAR_Maquina_Tecnica/DOC_Seguretat.md'
  - 'Part tècnica de 02_ACTUAR_Maquina_Tecnica/skills/seguretat_dades.md'
tags:
  - normativa
  - tecnologia
script:
  - '[[cerrojo_absoluto.cjs]]'
  - '[[escriptura-protegida.cjs]]'
---

# Seguretat Execució

## Objectiu

Executar la seguretat tècnica del Mas sense barrejar compliance legal. La llei viu a [[LLEI_05_Privacitat]]. Ací només hi ha mecanismes.

## 1. Xifratge Local

Les dades sensibles en IndexedDB o OPFS han d’estar xifrades amb Web Crypto.

- Derivació: `PBKDF2` o mecanisme superior disponible.
- Clau: PIN local, biometria o secret equivalent.
- Prohibit guardar claus en text pla.
- Prohibit logs amb dades sensibles.

## 2. Manifests Signats

Tot manifest de build o sincronització ha d’incloure:

- `BUILD_ID`
- hash de contingut
- data de generació
- signatura Ed25519 quan aplique
- versió mínima compatible

El client només accepta manifests vàlids.

## 3. Circuit Breaker

Si hi ha corrupció, mismatch de manifest, error de xifratge o caiguda de sincronització:

1. atura sync
2. conserva estat local
3. mostra missatge tranquil
4. registra error tècnic
5. activa recuperació si cal

## 4. Recuperació

La recuperació usa snapshots OPFS quan existisquen.

Ordre:

1. validar snapshot
2. desxifrar localment
3. restaurar IndexedDB
4. reconciliar CRDT
5. registrar acta tècnica sense dades personals

## 5. Relació amb Privacitat

Aquest document no decideix base legal.

Si una acció toca dades personals, consulta:

`[[LLEI_05_Privacitat]]`

## Output de la Skill

```json
{
  "ok": true,
  "action": "encrypt|sign|recover|break",
  "warnings": [],
  "errors": []
}
```

## Sinapsis

- [[LLEI_05_Privacitat]]
- [[backup_recovery]]
- [[self_repair]]
- [[DOC_Governanca]]
