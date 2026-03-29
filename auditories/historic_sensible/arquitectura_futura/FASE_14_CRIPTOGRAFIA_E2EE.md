# 🔒 FASE 14: CRIPTOGRAFIA E2EE EN XARXES DE LATÈNCIA EXTREMA (DTN)
**El Poble Encriptat i la Forward Secrecy Geològica**

Aquesta és l'última peça de l'Esquema Director per a l'evolució P2P de Sóc de Poble. Garanteix que els "Traginers de Dades" (nodes intermediaris com vehícles o busos) puguin moure paquets CRDT sense trencar la privacitat del poble.

## 1. L'Envolcall del CRDT (La Mula de Dades)
Yjs no pot fusionar dades encriptades a cegues. El "Traginer" només transporta un *Append-Only Log* cec de fragments binaris xifrats.

*   **Clau Simètrica:** Cada "Incidència" o entitat compartida genera una clau AES-GCM de 256 bits, desada a l'enclavament de maquinari dels membres (Keychain / Keystore).
*   **Format del Sobre Cec:** `[ID_Incidencia (Hash)] + [Nonce] + [Ciphertext]`. El Traginer només veu soroll estadístic.

## 2. El "Llibre de Família" Digital (PKI P2P)
Distribució descentralitzada de claus públiques sense servidor central.

*   **El Directori Obert:** Un document `Y.Doc` global al poble funciona sense encriptar com a diccionari: `{ "UUID_Joan": "Clau_Publica_Curve25519" }`.
*   **TOFUs i QRs:** La verificació d'identitat (Trust On First Use) es realitza i segella escanejant codis QR físicament en creuar-se les persones.
*   **Intercanvi ECDH:** Per convidar algú, s'utilitza la seva Clau Pública Pública del Directori junt amb Diffie-Hellman per xifrar la Clau Simètrica de la Sala abans d'enviar-la.

## 3. Forward Secrecy (Rotació Geomètrica KDF)
El Protocol Signal clàssic (Double Ratchet) es trenca en xarxes amb hores de latència (Sneakernet). Apliquem **Epoch-based KDF Ratcheting**.

*   **L'Època:** Les claus simètriques roten basant-se en blocs temporals (e.g. 24 hores). 
*   **HKDF Unidireccional:** A l'acabar l'Època, `K_1` es passa per una funció HKDF per generar `K_2`, la clau de demà.
*   **Cremada de Naus:** Generada `K_2`, **es destrueix proactivament `K_1`** del dispositiu de forma total. 
*   **Efecte:** Un atacant que robe el dispositiu i extraiga l'enclavament segur només obtindrà `K_2`. Li serà matemàticament impossible anar cap enrere, protegint tota la història prèvia del poble d'ofensives presents.

---
**Dictamen final d'Arquitectura P2P Extrem:** Esquema Director Tancat. Viable i revolucionari.
