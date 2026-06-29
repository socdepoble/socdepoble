---
name: seguretat-dades
description: 'Lògica GDPR, xifratge en repòs i esborrat complet (Dret a l''Oblit).'
authority: Consell de les 11 IAs
version: V21
created_at: '260628_0525'
updated_at: '260628_1618'
---
# 🔐 SKILL: Seguretat de Dades i GDPR

## 1. Dret a l'Oblit (Purga Absoluta)
Quan un usuari sol·licita l'esborrat de les seues dades:
- **Local:** S'executa `indexedDB.deleteDatabase()` i s'esborren tots els registres OPFS associats.
- **Distribuït (CRDT):** S'emet una transacció especial (Tombstone d'Oblit) que sobrescriu les dades personals amb nuls o hashes buits abans d'enviar-ho a la xarxa, garantint que la resta de *peers* destrueixen la informació en la següent sincronització.

## 2. Xifratge Local en Repòs
Tot i ser dades del poble, l'iPad podria ser robat.
- Els continguts sensibles de l'IndexedDB estaran xifrats mitjançant l'API Web Crypto.
- La clau d'encriptació es derivarà d'un PIN curt o PIN biomètric usant `PBKDF2`.

## 3. Consentiment Invisible (Trellat GDPR)
Sense banners de cookies molestos. Si s'utilitza una *skill* que guarda dades, s'informa en el mateix context ("Aquesta foto es guardarà al teu dispositiu"). El disseny ha de respectar la privacitat per defecte.

- [[00_index|Índex Central]]
