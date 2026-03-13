import { logger } from '../utils/logger';

// Importem el worker com a URL lògic aïllat heretant CORS per defecte de la finestra
import RhizomeWorker from './rhizome.worker.js?worker&inline';

/**
 * RhizomeDB: Persistent SQLite + OPFS Layer [MASTER/FLASH]
 * 
 * Basat en l'auditoria v3.0: 
 * - Utilitza OPFS per a persistència real (no volàtil).
 * - Emmagatzema el graf d'operacions (Eg-walker).
 * - Suporta snapshots per a càrrega ràpida.
 */
class RhizomeDB {
    constructor() {
        this.worker = null;
        this.pendingRequests = new Map();
        this.initPromise = null;
    }

    /**
     * Inicialitza el motor SQLite amb suport OPFS.
     */
    async init() {
        if (this.initPromise) return this.initPromise;

        this.initPromise = (async () => {
            try {
                // Instanciem el worker inlined
                this.worker = new RhizomeWorker();

                this.worker.onmessage = (e) => this.handleWorkerMessage(e);

                return new Promise((resolve, reject) => {
                    this.sendToWorker('INIT', { origin: window.location.origin }, (res) => {
                        if (res.type === 'INIT_OK') {
                            logger.log('📡 RhizomeDB Proxy connectat al Worker');
                            resolve();
                        } else {
                            reject(new Error(res.payload));
                        }
                    });
                });
            } catch (err) {
                logger.error('❌ Error inicialitzant Rhizome Worker:', err);
                throw err;
            }
        })();

        return this.initPromise;
    }

    handleWorkerMessage(e) {
        const { id, type, payload } = e.data;

        if (type === 'LOG') { logger.log(payload); return; }
        if (type === 'DEBUG') { if (logger.debug) logger.debug(payload); return; }
        if (type === 'ERROR' && !id) { logger.error(payload); return; }

        if (!this.pendingRequests) {
            this.pendingRequests = new Map();
        }

        const callback = this.pendingRequests.get(id);
        if (callback) {
            this.pendingRequests.delete(id);
            callback(e.data);
        } else if (id) {
            logger.warn(`L'event amb ID ${id} enviat des del Worker no té callback registrats.`);
        }
    }

    sendToWorker(type, payload, callback) {
        if (!this.pendingRequests) {
            this.pendingRequests = new Map();
        }
        
        const id = Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
        
        if (callback) {
            this.pendingRequests.set(id, callback);
        }
        
        if (this.worker) {
            this.worker.postMessage({ id, type, payload });
        } else {
            logger.error('❌ Rhizome Worker no inicialitzat al intentar enviar:', type);
        }
    }

    async saveOperation(op) {
        await this.init();
        return new Promise((resolve, reject) => {
            this.sendToWorker('SAVE_OP', op, (res) => {
                if (res.type === 'ERROR') reject(new Error(res.payload));
                else resolve();
            });
        });
    }

    async getOperations(docId) {
        await this.init();
        return new Promise((resolve, reject) => {
            this.sendToWorker('GET_OPS', { docId }, (res) => {
                if (res.type === 'ERROR') reject(new Error(res.payload));
                else resolve(res.payload);
            });
        });
    }

    async saveSnapshot(docId, data, lastOpId) {
        await this.init();
        return new Promise((resolve, reject) => {
            this.sendToWorker('SAVE_SNAPSHOT', { docId, data, lastOpId }, (res) => {
                if (res.type === 'ERROR') reject(new Error(res.payload));
                else resolve();
            });
        });
    }

    async getSnapshot(docId) {
        await this.init();
        return new Promise((resolve, reject) => {
            this.sendToWorker('GET_SNAPSHOT', { docId }, (res) => {
                if (res.type === 'ERROR') reject(new Error(res.payload));
                else resolve(res.payload);
            });
        });
    }

    async purgeOperations(docId, keepLimit = 50) {
        await this.init();
        return new Promise((resolve, reject) => {
            this.sendToWorker('PURGE_OPS', { docId, keepLimit }, (res) => {
                if (res.type === 'ERROR') reject(new Error(res.payload));
                else resolve();
            });
        });
    }

    async getTrustScore(myDid, targetDid) {
        await this.init();
        return new Promise((resolve, reject) => {
            this.sendToWorker('GET_TRUST_SCORE', { myDid, targetDid }, (res) => {
                if (res.type === 'ERROR') reject(new Error(res.payload));
                else resolve(res.payload);
            });
        });
    }
}

export const rhizomeDb = new RhizomeDB();
