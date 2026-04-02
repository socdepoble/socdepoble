import { createHelia } from 'helia';
import { webSockets } from '@libp2p/websockets';
import { webRTC } from '@libp2p/webrtc';
import { webTransport } from '@libp2p/webtransport';
import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';
import { mplex } from '@libp2p/mplex';
import { bootstrap } from '@libp2p/bootstrap';
import { unixfs } from '@helia/unixfs';
import { CID } from 'multiformats/cid';
import { webCryptoService } from './webCryptoService';
import { logger } from '../utils/logger';
import { rhizomeManager } from './rhizomeManager';

let heliaNode = null;
let fs = null;

export const ipfsManager = {
    async init() {
        if (heliaNode) return heliaNode;

        logger.info('[IPFS] Iniciant Helia Node (browser + WebRTC)...');
        heliaNode = await createHelia({
            libp2p: {
                transports: [webRTC(), webTransport(), webSockets()],
                connectionEncryption: [noise()],
                streamMuxers: [yamux(), mplex()],
                peerDiscovery: [bootstrap({ list: [ 
                    // Afegir els bootstrap nodes de la xarxa IPFS oficial o de Sóc de Poble
                    // '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDuBkBgBAigJZU5xkU...'
                ] })],
                connectionManager: { maxConnections: 50, minConnections: 5 },
                relay: { enabled: true, hop: { enabled: true } }
            },
            // Persistent datastore per a Capacitor (IndexedDB wrapper ja existeix)
            datastore: await import('helia').then(m => m.memoryDatastore()), // o custom IndexedDB si volem persistència extra
            blockstore: await import('helia').then(m => m.memoryBlockstore())
        });

        fs = unixfs(heliaNode);
        logger.info('[IPFS] Helia Node llest – PeerID:', heliaNode.libp2p.peerId.toString());

        // Escoltem la xarxa Rhizome per a propagació P2P
        heliaNode.libp2p.addEventListener('peer:connect', () => {
            logger.debug('[IPFS] Nou peer WebRTC connectat a la plaça');
        });

        // Receptor de WebRTC (PubSub de Helia)
        if (heliaNode.libp2p.services && heliaNode.libp2p.services.pubsub) {
            heliaNode.libp2p.services.pubsub.addEventListener('message', async (evt) => {
                try {
                    const payload = JSON.parse(new TextDecoder().decode(evt.detail.data));
                    // Abans d'aplicar qualsevol delta
                    const isValid = await webCryptoService.verifyIncomingPayload(payload);
                    if (!isValid) {
                        logger.debug('[SECURITY] Delta maliciós descartat silenciosament');
                        return; // NO s'aplica mai al CRDT
                    }
                    if (payload.update) {
                        rhizomeManager.hydrateOffgridDeltas([new Uint8Array(payload.update)]);
                    }
                } catch {
                    // Silenciós
                }
            });
        }

        return heliaNode;
    },

    /**
     * Publica un delta CRDT signat a IPFS (no bloqueja mai)
     */
    async publishCRDTUpdate(update, abortSignal) {
        if (!heliaNode) await this.init(abortSignal);

        const ac = abortSignal || new AbortController().signal;

        try {
            // 1. Signem amb la identitat sobirana Ed25519
            const privateKey = await rhizomeManager.getMyPrivateKey();
            if (!privateKey) {
                logger.warn('[IPFS] Sense clau privada, ignorant publicació a l\'arquitu.');
                return null;
            }

            const signature = await webCryptoService.sign(update, privateKey);
            const publicKey = await rhizomeManager.getMyPublicKey();

            const payload = {
                update: Array.from(update), // Uint8Array → array per JSON
                signature: Array.from(signature),
                publicKey: Array.from(await webCryptoService.exportPublicKey(publicKey)),
                timestamp: Date.now(),
                source: 'soc-de-poble-rhizome'
            };

            // 2. Afegim a Helia (UnixFS) → CID immutable
            const cid = await fs.addBytes(new TextEncoder().encode(JSON.stringify(payload)), { signal: ac });

            logger.info(`[IPFS] Delta publicat → CID: ${cid.toString()}`);

            // 3. Guardem el CID dins del mateix CRDT (per a recuperació futura)
            rhizomeManager.yDoc.getText('ipfs-cids').push([cid.toString()]);

            // 4. Si tenim connexió → pinning automàtic (veure funció següent)
            if (navigator.onLine) {
                await this.pinToService(cid, ac);
            }

            return cid;
        } catch (err) {
            if (err.name !== 'AbortError') logger.error('[IPFS] Error publicant:', err);
            throw err;
        }
    },

    /**
     * Pinning automàtic quan hi ha xarxa (Pinata + fallback Web3.Storage)
     */
    async pinToService(cid, abortSignal) {
        const ac = abortSignal || new AbortController().signal;
        const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;
        const WEB3_STORAGE_TOKEN = import.meta.env.VITE_WEB3_STORAGE_TOKEN;

        if (!PINATA_JWT && !WEB3_STORAGE_TOKEN) {
            logger.warn('[IPFS] Sense token de pinning – només P2P local');
            return;
        }

        try {
            // Prioritat: Pinata (més ràpid per a comunitat rural)
            if (PINATA_JWT) {
                await fetch('https://api.pinata.cloud/pinning/pinByHash', {
                    method: 'POST',
                    signal: ac,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${PINATA_JWT}`
                    },
                    body: JSON.stringify({
                        hashToPin: cid.toString(),
                        pinataMetadata: { name: `soc-de-poble-event-${Date.now()}` }
                    })
                });
                logger.info(`[IPFS] Pinnat a Pinata: ${cid}`);
            } else if (WEB3_STORAGE_TOKEN) {
                // Fallback Web3.Storage / Storacha via POST
                await fetch('https://api.web3.storage/pins', {
                    method: 'POST',
                    signal: ac,
                    headers: { 
                        'Authorization': `Bearer ${WEB3_STORAGE_TOKEN}`,
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify({ cid: cid.toString(), name: `soc-de-poble-${Date.now()}` })
                });
                logger.info(`[IPFS/Filecoin] Pinnat eternament a Filecoin via Storacha: ${cid}`);
            }
        } catch (err) {
            if (err.name !== 'AbortError') logger.warn('[IPFS] Pinning fallit (però CID ja està a la malla P2P)');
        }
    },

    /**
     * Garbage Collection – Neteja intel·ligent (reference counting de Helia)
     */
    async gc(oldCIDsToKeep = 50) {
        if (!heliaNode) return;
        try {
            // Helia ja usa reference counting intern → només netegem CIDs antics del CRDT
            const allCIDs = rhizomeManager.yDoc.getText('ipfs-cids').toArray();
            if (allCIDs.length > oldCIDsToKeep) {
                const toPrune = allCIDs.slice(0, allCIDs.length - oldCIDsToKeep);
                rhizomeManager.yDoc.getText('ipfs-cids').delete(0, toPrune.length);
                logger.info(`[IPFS] GC: ${toPrune.length} CIDs antics eliminats del CRDT`);
            }
            // Helia GC natiu (elimina blocs no referenciats)
            await heliaNode.gc();
        } catch {
            logger.debug('[IPFS] GC suau – res a netejar');
        }
    },

    getNode: () => heliaNode
};
