---
tags: [arquitectura, mesh, offline, crdt]
aliases: [Arquitectura V19, Xarxa Malla]
---
# Arquitectura Resilient V19 (L'Edat de Ferro de la Masía)

Aquesta "Skill" defineix la infraestructura de comunicació que garanteix la supervivència i operativitat de *Sóc de Poble* quan no hi ha internet ni cobertura mòbil, elevant-ho des d'una simple PWA a un **Sistema Operatiu d'Horta**.

## 1. Topologia de Xarxa Malla (Mesh i Drons)
La Masía no depèn d'antenes 4G/5G comercials. L'estructura de nodes funciona en tres capes físiques:
1. **Nodes de Butxaca (Usuaris):** iPads i mòbils antics usant WebRTC i Bluetooth LE per intercanviar dades físicament a la plaça.
2. **Nodes Repetidors Fixos (Teulades):** Dispositius amb maquinari **Meshtastic / LoRaWAN** (900MHz, molt llarg abast) alimentats per plaques solars. Propaguen la informació de poble a poble (P2P de llarga distància).
3. **Mules Aèries (Drons):** Protocol de "Mula de Dades Voladora" on un dron passa sobre l'horta, envia una ràfega de recollida de paquets (Handshake de despertador), bolca dades i se'n va. Codi referència: `dron_link_protocol.js`.

## 2. Motor de Fusió Massiva i Rellotges Híbrids (CRDT)
Sincronitzar milers d'accions desordenades de telèfons offline fa explotar qualsevol servidor convencional.
- **Lògica CRDT (OR-Set):** Utilitzem conjunts *Observed-Remove* per als missatges del Mur i Xats. Les dades es poden afegir i esborrar localment i la fusió és resolt automàticament sense conflictes.
- **Rellotges Lògics Híbrids (Hybrid Clocks):** Si la bateria d'un telèfon s'esgota i la seua data s'endarrereix 5 dies, les hores es trenquen. Ho resolem usant un comptador de *Rellotge Lògic* (que augmenta amb cada esdeveniment) més que dependre només del temps de la màquina local (`hybrid_clock.js`).
- **Fusió per Lots (Batching):** El `MassiveFusionEngine` carrega els canvis en blocs de 500 esdeveniments deixant respirar el processador 10ms entre lots, per a no bloquejar la interfície d'usuari dels mòbils de 2GB de RAM.

## 3. L'Àncora Satel·litària (Vies d'Últim Recurs)
A la masia cal saber demanar auxili a l'exterior quan cau el pont principal:
- **Iridium / Starlink Gateway:** Només un node escollit criptogràficament de la Xarxa pot encendre la connexió Starlink.
- La comunicació es xifra usant algoritmes asimètrics post-quàntics, i la clau s'activa via *Threshold Signatures* (L'Ull del Mestre).

## 4. Xifratge i Rotació de Claus Offline
Sóc de Poble posseeix una fortalesa de "Confiança Zero" (Zero-Trust):
- **Rotació amb "Grace Period":** Si la contrasenya del poble es veu compromesa, la clau mestra de xarxa trenada canvia. Però es manté un *Període de Gràcia* per a que les iaies i la maquinària offline no es queden penjades, usant el protocol de `key_rotation.js`.
- **Privacitat Homomòrfica Lleugera:** Implementem sistemes com el *Paillier Lleuger* per a operacions col·lectives (ex: votacions al poble, recompte de sensors d'aigua) sense que cap node sàpiga què ha contestat cada usuari.
