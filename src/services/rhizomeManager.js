import * as Y from 'yjs'; // CRDT elegit per la seua maduresa i WebRTC support
import { webCryptoService } from './webCryptoService';
import { IndexedDBProvider } from './database';
import { logger } from '../utils/logger';
import { ipfsManager } from './ipfsManager';

class RhizomeManager {
    constructor() {
        this.yDoc = new Y.Doc();
        this.db = new IndexedDBProvider('rhizome-v1');
        this.peers = new Map(); // WebRTC peers
    }

    async init() {
        try {
            const encryptedState = await this.db.get('crdt-state');
            if (encryptedState) {
                const decrypted = await webCryptoService.decrypt(encryptedState);
                if (decrypted) {
                    Y.applyUpdate(this.yDoc, decrypted);
                }
            }
            // WebRTC mesh (P2P)
            this.setupWebRTCMesh();
            await ipfsManager.init();
        } catch (e) {
            logger.error('[RhizomeManager] Fallida en iniciar l\'estat CRDT', e);
        }
    }

    async storeSovereignIdentity(identity, privateKey) {
        if (!identity || !privateKey) return;
        
        // Guardem la CryptoKey nativa en IndexedDB (suporta Structured Clone i és segur a nivell d'OS)
        await this.db.put('sovereign-private-key', privateKey);
        
        const encrypted = await webCryptoService.encryptWithKeyPair(identity, privateKey);
        await this.db.put('sovereign-identity', encrypted);
        this.yDoc.getMap('identities').set(identity.id, identity);
        await this.persistCRDT();
    }

    async getSovereignIdentity() {
        const encrypted = await this.db.get('sovereign-identity');
        if (!encrypted) return null;
        return webCryptoService.decrypt(encrypted);
    }

    async getMyPrivateKey() {
        // Recuperem la CryptoKey nativa guardada per storeSovereignIdentity
        const privateKey = await this.db.get('sovereign-private-key');
        if (privateKey) return privateKey;

        // Fallback porsi hi havia alguna versió vella
        const encryptedKeyPair = await this.db.get('sovereign-identity');
        if (!encryptedKeyPair) return null;
        const decrypted = await webCryptoService.decrypt(encryptedKeyPair);
        return decrypted?.privateKey;
    }

    async getMyPublicKey() {
        const identity = await this.getSovereignIdentity();
        return identity?.publicKey;
    }

    async persistCRDT() {
        const update = Y.encodeStateAsUpdate(this.yDoc);
        const encrypted = await webCryptoService.encrypt(update);
        await this.db.put('crdt-state', encrypted);

        // IPFS Bridge
        const ac = new AbortController();
        setTimeout(() => ac.abort(), 10000); // màxim 10s per no blocar
        await ipfsManager.publishCRDTUpdate(update, ac.signal).catch(e => {
            logger.warn('[Rhizome] Fallida no crítica sincronitzant CRDT a IPFS', e);
        });
    }

    hydrateOffgridDeltas(deltas) {
        if (!deltas || !Array.isArray(deltas)) return 0;
        deltas.forEach(delta => {
            try {
                // S'assegura que delta és Uint8Array com espera Yjs
                const update = delta instanceof Uint8Array ? delta : new Uint8Array(delta);
                Y.applyUpdate(this.yDoc, update);
            } catch (e) {
                logger.error('[Rhizome] Corrupció en la hidratació de deltes CRDT', e);
            }
        });
        
        // Ho persistim asíncronament i sense blocar
        this.persistCRDT().catch(e => logger.error('[Rhizome] Error persistint Yjs Update', e));
        return deltas.length;
    }

    clearSensitiveData() {
        try {
            this.yDoc.getMap('identities').clear();
            this.db.delete('sovereign-identity');
            this.db.delete('sovereign-private-key');
        } catch (e) {
            logger.warn('[RhizomeManager] Error netejant la dada local', e);
        }
    }

    // WebRTC P2P
    setupWebRTCMesh() {
        // TODO: A reomplir per Grok en la Tanda 3 amb WebRTC o simple-peer i Y-WebRTC
        // Quan es connecta un peer, sincronitzem this.yDoc via data channels
        logger.info('[Rhizome] Malla P2P WebRTC preparada per a la plaça del poble');
    }
}

export const rhizomeManager = new RhizomeManager();
