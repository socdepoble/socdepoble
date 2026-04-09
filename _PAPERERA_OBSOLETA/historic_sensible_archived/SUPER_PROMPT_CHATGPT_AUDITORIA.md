> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/historic_sensible_archived/SUPER_PROMPT_CHATGPT_AUDITORIA.md`

# Instrucció Mestra per a ChatGPT: EL BANC DE PROVES EXTREM I L'MVP (TANDA 10)

Has donat al clau perfectament. Ens agrada moltíssim aquesta visió aterrada i sense "venda de fum" basada en: **WebLLM + OPFS, Helia + IPFS, Bluetooth / LoRaWAN Gateways**.
El següent PROMPT li entregarà a ChatGPT la totalitat del nostre cor de sistema (les llibreries criptogràfiques i de mesh P2P que hem creat) i l'obligarà a auditar-les de forma sagnant i construir aquell "document d'arquitectura d'1 pàgina" i el "MVP de 90 dies".

Copia aquest prompt massiu (inclou el nostre codi font perquè l'analitzi) i envia-li al Xat de ChatGPT actiu:

---

> **SUPER PROMPT PER A CHATGPT (TANDA 10 - L'AUDITORIA EXTREMA I L'ARQUITECTURA MVP):**
> 
> "Estic totalment d'acord amb la teva visió d'aterrar l'arquitectura al món real (WebLLM + OPFS + WebGPU realistes, capes de Helia/IPFS sòlides i Bluetooth/LoRaWANGateways físics naturals). Res de NFTs per inèrcia, farem servir IPFS pinning i Filecoin per la persistència.
>
> Accepto la teva proposta: **vull aquest document d'arquitectura d'1 pàgina amb components, fluxos de dades, i un MVP de 90 dies.**
>
> Però abans, a 'Sóc de Poble' ja estem construint el Búnker i hem assolit la fase 1. Vull que llegeixis atentament el CORE actual de la nostra arquitectura (l'he enganxat sota). 
> **La teva missió:** Fes una AUDITORIA EXTREMA d'aquest codi. Destrueix-lo, busca-li el límit pràctic, digues-me per on pot petar a l'horta real, sigues sagnant però mantén l'empatia i recorda que ets part del nostre Alt Consell per salvar el patrimoni.
>
> Fes l'auditoria primer i, a continuació, lliura'm el Document MVP d'una pàgina que harmonitzi aquest codi amb la teva visió.
>
> Tria d'eines que actualment utilitzem al Codi Core:
> - WebCrypto API per a firmes Ed25519 (identitats sobiranes sense necessitat de clau a xarxa).
> - Yjs per CRDT i emmagatzematge IDB.
> - JS/Vite/React amb Workbox PWA avançat.
> 
> Aquí tens la sang del projecte:
>
> \`\`\`javascript
> // === 1. src/services/webCryptoService.js ===
> export const webCryptoService = {
>     async generateIdentity() {
>         const keyPair = await window.crypto.subtle.generateKey(
>             { name: 'Ed25519' }, true, ['sign', 'verify']
>         );
>         const exportedPublic = await window.crypto.subtle.exportKey('jwk', keyPair.publicKey);
>         return { keyPair, publicKeyJwk: exportedPublic, id: exportedPublic.x };
>     },
>     async signPayload(payload, privateKey) {
>         const encoder = new TextEncoder();
>         const data = encoder.encode(JSON.stringify(payload));
>         const signature = await window.crypto.subtle.sign({ name: 'Ed25519' }, privateKey, data);
>         return btoa(String.fromCharCode(...new Uint8Array(signature)));
>     },
>     async verifyIncomingPayload(payload, signatureBase64, publicKeyJwk) {
>         try {
>             const key = await window.crypto.subtle.importKey(
>                 'jwk', publicKeyJwk, { name: 'Ed25519' }, false, ['verify']
>             );
>             const signature = new Uint8Array(atob(signatureBase64).split('').map(c => c.charCodeAt(0)));
>             const encoder = new TextEncoder();
>             const data = encoder.encode(JSON.stringify(payload));
>             return await window.crypto.subtle.verify({ name: 'Ed25519' }, key, signature, data);
>         } catch { return false; }
>     }
> };
> 
> // === 2. src/services/ipfsManager.js ===
> import { createHelia } from 'helia';
> import { gossipsub } from '@chainsafe/libp2p-gossipsub';
> 
> class IPFSManager {
>     async init() {
>         this.node = await createHelia({
>             libp2p: { services: { pubsub: gossipsub() } }
>         });
>         this.node.libp2p.services.pubsub.addEventListener('message', async (message) => {
>             if (message.detail.topic === 'soc-de-poble-events') {
>                 const payload = JSON.parse(new TextDecoder().decode(message.detail.data));
>                 if (await webCryptoService.verifyIncomingPayload(payload.data, payload.signature, payload.pubKey)) {
>                     if (payload.data.update) {
>                         // Hydrate Yjs CRDT Delta Safely
>                     }
>                 }
>             }
>         });
>     }
> }
> export const ipfsManager = new IPFSManager();
> 
> // === 3. src/components/GlobalErrorBoundary.jsx ===
> // Error boundary amb 'Self-Healing' per purgar IndexedDB/Rhizome i netejar IDB en casos d'errors crítics (QuotaExceededError).
> \`\`\`
>
> Llança tota la teva capacitat d'auditoria. Com ho veus? El 'Búnker' és viable a llarg termini?"

---

Entrega-li tot això. El farà posar la lupa d'enginyer a les nostres bases de Helia i Autosanació IDB, generant-nos aquest disseny absolut d'MVP. Estem construint el sistema central de Sóc de Poble com mai abans. Endavant!
