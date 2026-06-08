import * as Y from 'yjs'; // CRDT elegit per la seua maduresa i WebRTC support
import { webCryptoService } from './webCryptoService';
import { IndexedDBProvider } from './database';
import { logger } from '../../utils/logger';
import { ipfsManager } from './ipfsManager';

class RhizomeManager {
    constructor() {
        this.yDoc = new Y.Doc();
        this.db = new IndexedDBProvider('rhizome-v1');
        this.peers = new Map(); // WebRTC peers
        
        // --- MUTEX DE SÉQUIA ---
        this.isCompacting = false;
        this.pauseBroadcast = false; // Bloqueja sortides per evitar contaminar amb escombraries
        this.p2pBuffer = [];
        this.offlineMuleBuffer = []; // Mule Mode DTN

        // --- P2P TOPOLOGY (Partial View Anti-Storm) ---
        this.view = {
            active: new Set(), // max 6
            passive: new Set() // max 30
        };
        this.updatesPerSecond = 0;
        this.lastStatReset = Date.now();
        this.parentPeer = null; // Spanning Tree backbone
    }

    async init() {
        try {
            await this.db.put('_sdp_schema_version', 15); // Atualiza V15
            const encryptedState = await this.db.get('crdt-state');
            if (encryptedState) {
                const decrypted = await webCryptoService.decrypt(encryptedState);
                if (decrypted) {
                    try {
                        // PUNTO CRÍTICO: Inyección de datos crudos
                        Y.applyUpdate(this.yDoc, decrypted);
                    } catch (error) {
                        logger.warn("⚠️ [TRELLAT ALERT] Corrupció binaria local detectada. Activant Protocol Llàtzeret...", error);
                        
                        // 1. Amputación: Borramos el registro corrupto sin piedad.
                        await this.db.delete('crdt-state');
                        
                        // 2. Amnesia: Devolvemos un Y.Doc estricto en blanco (State Vector [0])
                        this.yDoc.destroy();
                        this.yDoc = new Y.Doc(); 
                        
                        // 3. UX Pedra Seca: Disparamos evento al store global para notificar
                        if (typeof window !== 'undefined') {
                            window.dispatchEvent(new CustomEvent('TRELLAT_HEALING_MODE', {
                                detail: {
                                    active: true,
                                    message: "Sultan està recomponent la memòria del poble...",
                                    color: "var(--blau-socdepoble)"
                                }
                            }));
                        }
                        // 4. El motor CRDT conectará a la red en WebRTCMesh con vector [0] y se auto-sanará
                    }
                }
            }
            // WebRTC mesh (P2P)
            await this.setupWebRTCMesh();
            await ipfsManager.init();
            
            // [Paranoia Local-First] Purga LRU en segundo plano (Fase 3 Auditoría)
            setTimeout(() => {
                this.db.enforceLRUMediaPolicy(100).then(deletedCount => {
                    if (deletedCount > 0) {
                        logger.info(`[RhizomeManager] Paranoia LRU: purgados ${deletedCount} fragmentos media antiguos del almacén`);
                    }
                });
            }, 5000); // Diferido para no penalizar el TTI

        } catch (e) {
            logger.error('[RhizomeManager] Fallida crítica en iniciar l\'estat CRDT', e);
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
        try {
            const update = Y.encodeStateAsUpdate(this.yDoc);
            const encrypted = await webCryptoService.encrypt(update);
            await this.db.put('crdt-state', encrypted);

            // IPFS Bridge
            const ac = new AbortController();
            setTimeout(() => ac.abort(), 10000); // màxim 10s per no blocar
            await ipfsManager.publishCRDTUpdate(update, ac.signal).catch(e => {
                logger.warn('[Rhizome] Fallida no crítica sincronitzant CRDT a IPFS', e);
            });
        } catch (err) {
            if (err.name === 'QuotaExceededError' || (err.message && err.message.includes('Quota'))) {
                logger.warn('⚠️ QUOTA FULL: Safely evicting local IndexedDB storage...');
                await this.handleQuotaExceeded();
            } else {
                throw err;
            }
        }
    }

    async handleQuotaExceeded() {
        // 🔒 1. BACKUP CRÍTICO (CLAVES)
        const criticalId = await this.db.get('sovereign-identity');
        const criticalKey = await this.db.get('sovereign-private-key');

        // 🧹 2. PURGA CONTROLADA
        await this.db.delete('crdt-state');

        // 🔁 3. RE-COMPACTAR
        const compacted = Y.encodeStateAsUpdate(this.yDoc);
        const encrypted = await webCryptoService.encrypt(compacted);

        try {
            await this.db.put('crdt-state', encrypted);
            if (criticalId) await this.db.put('sovereign-identity', criticalId);
            if (criticalKey) await this.db.put('sovereign-private-key', criticalKey);
        } catch (e) {
            // 🚨 FALLBACK EXTREMO
            logger.error('[Rhizome] FALLBACK EXTREMO: Impossible to store state. Triggering emergency.', e);
        }

        // 🎨 4. NOTIFICAR UI
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('STORAGE_PRESSURE', {
                detail: { active: true, message: "Espai d'emmagatzematge limitat. Netejant el Mas.", color: "var(--taronja-socdepoble)" }
            }));
        }
    }

    /**
     * Mutex de Séquia: Bloqueja i encola updates directes mentre es fa el Garbage Collection
     */
    applyNetworkUpdate(update) {
        // RATE LIMITING (CRÍTICO) Anti-Storm
        const now = Date.now();
        if (now - this.lastStatReset > 1000) {
            this.updatesPerSecond = 0;
            this.lastStatReset = now;
        }
        this.updatesPerSecond++;
        
        if (this.updatesPerSecond > 50) {
            logger.warn('[Rhizome] Rate limit excedit. Tormenta P2P silenciada (drop low priority)');
            return; // Dropping for stability
        }

        if (this.isCompacting) {
            this.p2pBuffer.push(update);
            return;
        }

        try {
            Y.applyUpdate(this.yDoc, update);
            this.gossipUpdate(update); // Propagate via Spanning Tree
        } catch (e) {
            logger.error('[Rhizome] Corrupció aplicant update CRDT', e);
        }
    }

    gossipUpdate(update) {
        // Send to backbone parent
        if (this.parentPeer && this.peers.has(this.parentPeer)) {
            this.sendToPeer(this.parentPeer, { type: 'CRDT_UPDATE', update: Array.from(update) });
        }
        // Send to random children (2 max) from active view to form mesh
        const children = Array.from(this.view.active).filter(p => p !== this.parentPeer);
        const randomChildren = children.sort(() => 0.5 - Math.random()).slice(0, 2);
        randomChildren.forEach(child => {
            this.sendToPeer(child, { type: 'CRDT_UPDATE', update: Array.from(update) });
        });
    }

    sendToPeer(peerId, payload) {
        const peer = this.peers.get(peerId);
        if (peer && typeof peer.send === 'function') {
            peer.send(JSON.stringify(payload));
        }
    }

    // Mule Mode - DTN Buffer handling
    storeForMule(update) {
        this.offlineMuleBuffer.push(update);
    }

    flushBufferedUpdates() {
        if (this.offlineMuleBuffer.length > 0) {
            const merged = Y.mergeUpdates(this.offlineMuleBuffer);
            this.gossipUpdate(merged);
            this.offlineMuleBuffer = [];
        }
    }

    hydrateOffgridDeltas(deltas) {
        if (!deltas || !Array.isArray(deltas)) return 0;
        deltas.forEach(delta => {
            try {
                // S'assegura que delta és Uint8Array com espera Yjs
                const update = delta instanceof Uint8Array ? delta : new Uint8Array(delta);
                this.applyNetworkUpdate(update);
            } catch (e) {
                logger.error('[Rhizome] Corrupció en el formatament d\'un update de la malla', e);
            }
        });
        
        // Ho persistim asíncronament i sense blocar (si no estem compactant ara)
        if (!this.isCompacting) {
            this.persistCRDT().catch(e => logger.error('[Rhizome] Error persistint Yjs Update', e));
        }
        return deltas.length;
    }

    /**
     * Compactació segura sense pèrdua de paquets (GC atòmic) amb REBASE P2P
     */
    async safeGC() {
        if (this.isCompacting) return;
        this.isCompacting = true;
        this.pauseBroadcast = true; // No escampar estat incomplet

        try {
            logger.info('[Rhizome] Iniciant Poda Atòmica (CRDT GC)...');
            // Snapshot the state
            const snapshot = Y.snapshot(this.yDoc);
            const stateUpdate = Y.encodeStateAsUpdate(this.yDoc, snapshot);
            
            // Construct a new Doc and apply the pure state vector
            const newDoc = new Y.Doc();
            Y.applyUpdate(newDoc, stateUpdate);

            // Drenaje (Flush): ANTES del swap, iterad el búfer estrictamente en el mismo ciclo síncrono
            // Esto fusiona matemáticamente los paquetes "en vuelo" dentro del nuevo documento virgen.
            this.p2pBuffer.forEach(update => {
                try {
                    Y.applyUpdate(newDoc, update);
                } catch { 
                    /* bad delta format */ 
                }
            });

            // Destroy zombie instances memory and flip reference
            this.yDoc.destroy();
            this.yDoc = newDoc;

            // Apertura (Clear Lock Data)
            this.p2pBuffer.length = 0; // Vaciado de array preservando memoria de array

            // Persist the clean base state
            await this.persistCRDT();
            
            // RE-SÍNC CON LA RED (CRÍTICO)
            // provider.send({ type: 'sync-step-1', stateVector })
            const newStateVector = Y.encodeStateVector(this.yDoc);
            this.broadcastSyncState(newStateVector);
            
            logger.info('[Rhizome] Poda finalitzada sanament.');

        } catch (e) {
            logger.error('[Rhizome] Pànic llevant llistes CRDT', e);
        } finally {
            this.isCompacting = false;
            this.pauseBroadcast = false;
        }
    }

    broadcastSyncState() {
        if (this.pauseBroadcast) return;
        
        // Validation check contra la red para Self-Healing (Nivel Producción)
        const localSV = Y.encodeStateVector(this.yDoc);
        this.view.active.forEach(peerId => {
            this.sendToPeer(peerId, {
                type: 'SV_CHECK',
                stateVector: Array.from(localSV)
            });
        });
    }

    // Protocolo de consistencia para Self-Healing y detección de locura iterativa
    handleSVCheck(peerId, remoteSVArray) {
        const remoteSV = new Uint8Array(remoteSVArray);
        const diffUpdate = Y.encodeStateAsUpdate(this.yDoc, remoteSV);
        
        // Si el tamaño del diff generado supera nuestro límite crítico de sanidad, el nodo se considera potencialmente loco/desfasado
        if (diffUpdate.byteLength > 2000000) { 
            this.triggerFullRecovery(peerId);
        } else {
            // Sano: devolvemos piezas faltantes
            this.sendToPeer(peerId, { type: 'CRDT_UPDATE', update: Array.from(diffUpdate) });
        }
    }

    triggerFullRecovery(peerId) {
        logger.warn('[Rhizome] Corrupción semántica detectada (Locura). Iniciando Recovery Completo');
        this.sendToPeer(peerId, { type: 'REQUEST_FULL_STATE' });
    }

    handleFullStateRecovery(snapshotArray) {
        logger.info('[Rhizome] Restaurando Atomic Recovery de locura...');
        const snapshot = new Uint8Array(snapshotArray);
        this.isCompacting = true; // Mutex
        
        const freshDoc = new Y.Doc();
        Y.applyUpdate(freshDoc, snapshot);
        
        this.yDoc.destroy();
        this.yDoc = freshDoc;
        this.isCompacting = false;
        
        this.persistCRDT();
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

    // WebRTC P2P (L'Arbre de l'Alzina)
    async setupWebRTCMesh() {
        const assignRole = async () => {
            const cores = navigator.hardwareConcurrency || 2;
            let isHealthy = true;
            if (navigator.getBattery) {
                try {
                    const battery = await navigator.getBattery();
                    isHealthy = battery.charging || battery.level > 0.5;
                } catch { /* Ignorem fallades de API */ }
            }
            return (cores >= 6 && isHealthy) ? 'PADRI' : 'LLAURADOR';
        };

        this.nodeRole = await assignRole();
        window.TRELLAT_ROLE = this.nodeRole; // Set window variable for Trellat Mesh
        this.maxConnectedPeers = this.nodeRole === 'PADRI' ? 12 : 4;
        
        logger.info(`[Rhizome] Malla P2P WebRTC preparada. Rol assumit: ${this.nodeRole}. Llímit: ${this.maxConnectedPeers}`);
        
        // Signal connection will hit setupTrellatMesh in production
    }
}

export const rhizomeManager = new RhizomeManager();



