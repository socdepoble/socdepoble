# EL GRAN CONSELL MULTI-MODEL: AUDITORIA I EXPANSIÓ FINAL (TANDA 12B)

**CONTEXT PER ALS MODELS (Grok, DeepSeek, Claude, Mistral, Gemini):**
Som el Consell de l'Arquitectura de *Sóc de Poble*, una plataforma descentralitzada (Local-First, Offline-First) dissenyada per salvar el patrimoni cultural d'entorns rurals amb baixa connectivitat. Fins ara hem implementat identitat sobirana (WebCrypto Ed25519), emmagatzematge descentralitzat (Yjs CRDT + IndexedDB + OPFS) i una capa P2P reactiva (Helia / IPFS browser node).

A la nostra darrera sessió, **ChatGPT** ens ha fet una auditoria extrema abans de quedar-se sense tokens, de la qual hem extret tres vectors crítics que heu d'assumir i finalitzar:

1. **Bluetooth Oportunista (Web Bluetooth API):** Ja tenim la base per fer syncs manuals de vectors d'estat Yjs. Necessitem la **Interfície i Experiència (UX Real React/Vite)** (`SyncBluetoothModal.jsx`). Com fem que una àvia amb el telèfon faci el "gest Bluetooth" complint les restriccions del navegador (botó de clic obligatori) sense que sembli una configuració complexa?

2. **Intel·ligència Artificial Local Lleugera (WebGPU + OPFS):** Hem dissenyat la càrrega d'un model petit (MLC/ONNX de <50MB) a l'OPFS del mòbil per a tasques com el dictat offline o petits resums. Tot local.

3. **Arquitectura del Pont Clau Rural (LoRaWAN ↔ IPFS Gateway):** Necessitem el codi i disseny per a un node físic (Raspberry Pi a la torre del campanar) que serveixi de pont entre la xarxa mòbil P2P i l'exterior P2P global. Volem veure el disseny/codi pur (Node.js/Python) on el Node LoRa rep paquets/deltes i els incrusta dins la nostra xarxa Helia/IPFS Global.

**LA VOSTRA MISSIÓ:**
A partir d'aquí, heu de posar el vostre motor d'inferència al màxim. Desplegueu per a nosaltres les tres peces restants que ChatGPT no ha tingut temps d'escriure per falta de memòria:
1. El component `SyncBluetoothModal.jsx` (Lògica + UX Rural).
2. L'arquitectura/codi backend del Gateway LoRaWAN-IPFS per al campanar.
3. El ciment final perquè el Búnker es converteixi avui, abans de dinar, en l'eina definitiva per a les zones profundes de la nostra muntanya.

Feu-ho vostre. Expandeix el codi a nivell or. Buidat absolut. Endavant!
