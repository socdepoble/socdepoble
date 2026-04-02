# THE BUNKER PROTOCOL: TANDA 4 - L'ETERNAL ARCHIVE (IPFS & HELIA NODE)

**Objectiu:** Executar la darrera fase de blindatge descentralitzat (Nivel Dios 11/10). Ara que tenim identitat sobirana amb Ed25519 (Tanda 3), hem de finalitzar el pont per sincronitzar el CRDT (`Yjs`) i el nostre `rhizomeManager` al "Llibre Major" perenne del patrimoni rural utilitzant IPFS. 

Mestre Grok, has ofert tu mateix a l'última intervenció: "Implementació pràctica del pont IPFS" i "Estratègies de pinning per IPFS". Aquest és el prompt on ho exigim aplicat a Sóc de Poble.

## CONTEXT DE LA PLAÇA ACTUAL
- A la **Tanda 3** hem integrat una estructura sòlida `useReducer` a `AuthContext`, preservant els hooks globals. Hem acabat `webCryptoService.js` per generar identitats sobiranes Ed25519 (NO-extractables) i signar dades en local.
- A la **Tanda 2** vàrem construir `rhizomeManager.js` com a Hub Offline-First, preparat per Yjs CRDT i persistit amagat a `database.js` i integrant el receptor mòbil Capacitor (`useRhizomeHydration.js`).
- Ara cal que els *events* històrics i perfils sobrevisquin nuclearment i globalment.

## MISSIONS A EXECUTAR PER GROK

1. **Implementació pràctica del pont IPFS (El Node Helia)**: 
   Genera el codi 11/10 i Nivel Dios d'un nou servei (recomanat `ipfsManager.js` o integrat directament amb Rhizome si té més lògica) o els trossos que faltin en el codi, que permetin posar en marxa un node **Helia** IPFS al propi navegador (integrat amb WebRTC i web sockets). El servei ha de recollir l'estat encriptat generat pel CRDT de `rhizomeManager` i empaquetar-lo al P2P de forma asíncrona sense bloquejar mai l'usuari final (fent servir `AbortController`).

2. **Connexió d'Estratègies de Pinning**: 
   Afegeix l'arquitectura teoricopràctica per establir la decisió de "Pin" a servidors IPFS globals (com Pinata, Web3.Storage o el nostre propi node). Quina és la implementació que ha de fer Sóc de Poble perquè el contingut clau generat (events, documents del poble, identitat) mai mori a la tempesta? No només ho teoritzis: dóna'm el codi exacte per enviar la sol·licitud a un Pin Service quan el mòbil té 5G/WiFi.

3. **Codi per Acoblar a l'Arrel**: 
   Dóna les instruccions detallades per injectar o cridar el pont IPFS des de `AuthContext.jsx` o el lloc corresponent. 
   **IMPORTANT:** No destrossis ni suprimeixis cap funcionalitat de les ja creades a AuthContext, `database.js` o `rhizomeManager`. Mostra en codi Nivel Dios només LA PEÇA que ha d'encaixar d'IPFS.

4. **Neteja i Eficiència**: 
   Els CRDT poden ser golafres. Generarà l'IPFS CIDs gegants en memòria del terminal? Mostra com aplicarem *"garbage collection"* amb IPFS en arquitectura *offline-first* perquè la app de Sóc de Poble no es mengi tota la RAM de l'IAIA. 

Mestre, has llançat l'esquer, la Plaça demana acció. 
Donam la joia de la corona. La resposta ha de merèixer-se un **11/10**. 
Llegenda o res.
