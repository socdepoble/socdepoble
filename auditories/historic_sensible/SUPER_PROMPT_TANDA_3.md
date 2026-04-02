# 🔥 THE BUNKER PROTOCOL: DIRECTIVA TANDA 3 (OFFENSIVE FINALE)
**Projecte:** Sóc de Poble – Patrimonio Digital de la Humanidad Rural
**Context:** Tanda 3 de la Refactorització "Nivel Dios".
**Rol:** Grok (Membre de l'Alt Consell de les Intel·ligències)

Bona feina a la Tanda 2, company! Has establert els fonaments del CRDT amb Yjs i l'arquitectura de la Malla (RhizomeManager). Ara mateix hem injectat amb èxit la teva proposta als nostres arxius, mantenint les funcions nadives intactes, però ara necessitem el teu toc mestre final per acabar la transició al 100% cap a la Sobirania Digital Absoluta.

Això és el que estem buscant exactament per a tancar aquest capítol. Centra tota la teva intel·ligència gèlida en aquests 3 pilars i no toquis RES més del previst.

## MISSIÓ ÚNICA – ELS 3 PILARS DE LA SOBIRANIA

### 1. WebCrypto 100% Funcional (Sovereign Identities)
Hem creat un *stub* fals dins de `src/services/webCryptoService.js`. Et necessito per substituir això pel CODI DEFINITIU NIVELL DÉU:
- Ha d'usar **WebCrypto API** per generar un parell de claus Ed25519 o equivalent segur suportat pels navegadors actuals. Les claus privades han de ser no-extractables.
- Tota comunicació al CRDT/RhizomeManager signada per garantir l'autenticitat en xarxa p2p desconfiada.
- Torna només el codi per a `webCryptoService.js` sense tallar (o les modificacions exactes si t'és lícit).

### 2. Exploració profunda al Pont IPFS / Helios Node
Aquesta arquitectura "Local-First" blindada amb Yjs (CRDT) i IndexedDB genera Blob updates p2p. Ara cal **un esbós teòric i/o codi d'integració inicial** de com farem que el backend central i aquests nodes "mesh" connectin amb IPFS per persistir globalment el patrimoni. Com fusionaríem les diferències (Yjs deltas) via un node IPFS descentralitzat? Escriu l'estratègia en MarkDown.

### 3. Claredat Radical: L'Autèntic Refactor d'AuthContext.jsx
Sabem que vas escriure una versió asèptica de l'AuthContext a la Tanda 2, però vàrem decidir **no substituir-lo** perquè trencava les funcions exclusives de Sóc de Poble (comentaris 'Playground', 'Impersonificació' / `switchContext`, `language`, etc...). 
- **L'Objectiu:** Converteix el mastodòntic estat dispers de `useState` dins d'`AuthContext.jsx` en un UNIC i sòlid **`useReducer`**.
- Manté **ESTRICTAMENT** totes i cadascuna de les variables d'estat i funcions (`isPlayground`, `adoptPersona`, `forceNukeSimulation`, `realUser`, `switchContext`, etc.). Si esborres cap funció del `AuthContext`, haurem fracassat!.
- Incorpora finalment el mètode `generateSovereignIdentity` que s'enllaça amb el teu nou `webCryptoService`.

### ESTRATÈGIA D'ENTREGA
Dona'm l'estratègia IPFS directament escrita com a text explicatiu o MarkDown. Dona'm el codi *complet* o diffs gèlids per a `webCryptoService.js` i `AuthContext.jsx`. 

El Búnquer espera la teva resposta. **Sóc de Poble!**
