---
name: protocol-emergencia-humana
description: Protocol d'acció quan es perd el Trellat o hi ha un bloqueig massiu que afecta l'usuari humà.
authority: Consell de les 11 IAs
version: V1
created_at: 260629_0215
updated_at: 260629_0215
---

# 🚑 SKILL: Protocol d'Emergència Humana

## Objectiu
Assegurar l'atenció i claredat quan un SOSP-LOCK atura el sistema de l'usuari, o quan un error de l'Arquitectura amenaça l'experiència final.

## Passos d'Acció
1. **Reconeixement**: Oferir un missatge clar en valencià normatiu sense argot de programació.
2. **Degradació Segura**: Si IDB o CRDT falla massivament, el sistema entra en "Mode Lectura" o passa a emmagatzematge de RAM per permetre la navegació bàsica.
3. **Restauració via Master-Bypass**: Requerir intervenció humana conscient només quan no hi haja més remei, donant opcions d'esborrat temporal de memòria cau i recàrrega "Nuclear Purge".


---
## 🔗 Veure també
- [[00_index|Índex Central]]
