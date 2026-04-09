> 📂 **Arxiu/Ruta:** `./docs/ADR-001-trellat-sync-federation.md`

# ADR-001: Trellat Sync – Federació CRDT + P2P per a Memòria Oral Rural

**Data:** 04/04/2026  
**Estat:** Aprovat  
**Context:** Necessitat de sincronització de manifests entre micropobles sense servidor central ni dependència cloud, per a garantir la sobirania digital i la supervivència a llarg termini de la memòria oral.

**Decisió:**
- **CRDT:** Ús de Yjs (amb extensió per a signatures Ed25519) per a la resolució de conflictes sense un node central.
- **Xarxa P2P:** libp2p + Helia (implementació IPFS en JS per a l'any 2026).
- **Relay opcional:** Supabase Edge Function (només per a la descoberta inicial i com a fallback opcional per a gossiping entre firewalls).
- **Signatures:** Ed25519 (mitjançant `noble-ed25519` o equivalent en W3C WebCrypto API) per a cada manifest emès per un Ajuntament o Comunitat.
- **Emmagatzematge:** IndexedDB per sub-estats en clients + repositori IPFS local.
- **Sistema de Fitxers Multimèdia:** Integració Web3 per a emmagatzematge descentralitzat de pistes d'àudio (Whisper local), de manera que l'streaming d'àudio en xarxes mesh es pot fer de forma P2P a gran velocitat sense requerir ample de banda d'un servidor extern.

**Conseqüències:**
- Dades 100% sobiranes, només surten de la comunitat si hi ha consentiment criptogràfic explícit.
- Funciona offline sense limitacions arquitectòniques severes.
- Escalable a 100+ nodes (o milers de nodes rurals) sense cost addicional d'infraestructura (model *Zero-Cloud Cost* assoleble per a la major part del pes en trànsit multimèdia).
- Interoperable de fàbrica amb estratègies com l'Europeana Data Space and ECHOES.

**Alternatives rebutjades:** 
- Supabase Realtime pur: Rebutjat per no suportar models purament descentralitzats, requerint instàncies asimètriques amb internet constant.
- Firebase: Rebutjat per manca de sobirania geogràfica, opacitat i models vendor lock-in incompatibles amb Nivel Dios.
