---
name: schema-migrations
description: "Migracions segures per a la base de dades local (IndexedDB i Y.js) sense corrompre l'estat offline."
authority: "Consell de les 11 IAs"
version: "V21"
---
# 🗄️ SKILL: Migracions d'Esquema (Local-First)

En una app Offline-First com Sóc de Poble, el codi canvia però les dades dels usuaris es queden al dispositiu. Açò requereix un tractament exquisit dels canvis d'estructura.

## 1. Migracions Y.js
Y.js és "schema-less" (no té esquema fix), però l'aplicació React espera formes concretes de dades.
- Mai esborrar camps obsolets; ignorar-los a la capa de lectura (UI) per evitar incompatibilitats entre dispositius que encara no han actualitzat la versió de l'app.
- Tota transformació de tipus de dades s'ha de fer creant un nou camp (ex: `date` de string a Unix epoch es guarda a `date_v2`), no sobreescrivint l'antic, per respectar el CRDT.

## 2. Migracions IndexedDB
Quan s'augmenta la versió de l'esquema d'`idb` o Dexie:
- Executar `backup-recovery/SKILL.md` per fer un snapshot just abans de la migració.
- Si la migració falla, revertir automàticament al snapshot i continuar usant el codi anterior.

## 3. Backward Compatibility Infinita
Totes les funcions que lligen dades de l'estat local han d'acceptar els formats de la V20, V21 i futures de manera transparent, assumint sempre valors per defecte si un camp no existeix.
