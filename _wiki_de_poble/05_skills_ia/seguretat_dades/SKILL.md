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

## 2. Transparència Local (Anti-Amnèsia)
Tot i tractar-se de dades d'usuari, s'evita expressament l'encriptació forçada (Web Crypto API) de la base de dades local.
- **Filosofia de l'Arxiu:** Sóc de Poble actua com un Obsidian o un bloc de notes físic; les dades viuen en obert al disc local (IndexedDB/OPFS) del dispositiu. 
- **Risc de Pèrdua:** Es prefereix el risc teòric que algú accedisca a l'iPad físicament, abans que el risc absolut que l'usuari oblide un PIN i perda els seus records per sempre. La seguretat recau en la **possessió física** de la tauleta.

## 3. Consentiment Invisible (Trellat GDPR)
Sense banners de cookies molestos. Si s'utilitza una *skill* que guarda dades, s'informa en el mateix context ("Aquesta foto es guardarà al teu dispositiu"). El disseny ha de respectar la privacitat per defecte.

- [[00_index|Índex Central]]
