---
name: media-optimitzacio-edge
description: Estratègia per a reduir el pes de la càrrega multimèdia abans d'entrar a la xarxa malla.
authority: Consell de les 11 IAs
version: V1
created_at: 260629_0215
updated_at: 260629_0215
---

# 📸 SKILL: Optimització Multimèdia Edge

## Objectiu
Garantir que les imatges i vídeos compartits al Mas no ofeguen l'anell CRDT ni ocupen l'espai vital de l'OPFS dels dispositius antics.

## Normes
1. Tota imatge ha de ser comprimida **en local** abans de ser afegida a la cua de sincronització (WebP, max 800px d'ample).
2. Es prioritzen l'ús de Canvas API per a fer l'escalat al client.
3. L'objectiu termodinàmic per blob multimèdia és de 200KB.
4. **Soft Warning i Tolerància a la Frustració:** Si, després de comprimir una imatge (ex: una foto panoràmica de les festes), el pes supera els 200KB (arribant fins a 500KB o 1MB), **l'aplicació permetrà la pujada**. Es vetarà només en casos extrems (més de 2MB en WebP), però mai es bloquejarà sistemàticament una imatge d'ús normal. L'objectiu és l'alegria humana per damunt de la puresa tècnica.


---
## 🔗 Veure també
- [[00_index|Índex Central]]
