---
name: mas-cau
description: "Protocol d'emergència per a situacions de caiguda massiva de servidors (SOSP-LOCK 3) i persistència de búnquer."
authority: "Consell de les 11 IAs"
version: "V21"
---
# 🚨 SKILL: Protocol El Mas Cau (Búnquer)

Quan Supabase cau o no hi ha xarxa durant setmanes al poble, el Mas no cau, sinó que es tanca en mode Búnquer.

## 1. Detecció de la Caiguda
- Si els *WebSockets* capta error `502`, `503` o `TIMEOUT` sostingut (més de 5 minuts).
- S'activa automàticament el **SOSP-LOCK de Nivell 2 o 3**.

## 2. Mode Búnquer (UI)
- L'indicador de xarxa canvia a "Tancat a casa" (icona de la llar de foc).
- S'amaga qualsevol indici de càrrega contínua (spinners) que provoque ansietat.
- Els usuaris poden continuar escrivint missatges, creant contingut i guardant accions que s'acumularan localment.

## 3. Peer-to-Peer Salvavides
Com a prevenció per apagades llargues, els CRDT s'intentaran sincronitzar usant la xarxa local (Wi-Fi o Bluetooth si WebRTC està habilitat localment) de dispositiu a dispositiu quan els llauradors es troben físicament, esquivant el servidor caigut.
