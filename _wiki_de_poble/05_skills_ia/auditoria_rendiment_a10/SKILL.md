---
name: auditoria-rendiment-a10
description: Mètrica i vigilància de la termodinàmica física en dispositius antics (iPad A10).
authority: Consell de les 11 IAs
version: V1
created_at: 260629_0215
updated_at: 260629_0215
---

# 📈 SKILL: Auditoria de Rendiment A10

## Objectiu
Aquesta habilitat vigila que cap modificació de codi o estructura no puga ofegar els recursos físics (CPU/RAM) dels dispositius objectiu de Sóc de Poble (com l'iPad A10 antic).

## Normes
1. **Límit de RAM**: Màxim de 1.2GB en execució contínua. Més d'això obliga a Garbage Collection (Tombstones de Y.js).
2. **Límit de CPU**: Operacions asíncrones llargues han de desviar-se a Web Workers. L'activitat del main thread ha de mantenir-se per sota de 16ms/frame per evitar "Jank".
3. **Mètriques FPS**: Controlar que l'interfície estiga sobre 30 FPS constants.


---
## 🔗 Veure també
- [[00_index|Índex Central]]
