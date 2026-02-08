import initSqlJs from '@sqlite.org/sqlite-wasm';
import { logger } from '../utils/logger';

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
                // [BATEGAT 0ms] Deferim la inicialització pesada a un moment d'oci del navegador
                // per no competir amb la interactivitat de l'usuari (gestos de login).
                if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
                    await new Promise(resolve => window.requestIdleCallback(resolve, { timeout: 2000 }));
                } else {
                    await new Promise(resolve => setTimeout(resolve, 300));
                }
                // [BATEGAT 0ms] El worker s'encarrega d'esperar al moment d'oci
                this.worker = new Worker(
                    new URL('./rhizome.worker.js', import.meta.url),
                    { type: 'module' }
                );

                this.worker.onmessage = (e) => this.handleWorkerMessage(e);

                return new Promise((resolve, reject) => {
                    this.sendToWorker('INIT', null, (res) => {
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

        if (type === 'LOG') return logger.log(payload);
        if (type === 'DEBUG') return logger.debug ? logger.debug(payload) : null;
        if (type === 'ERROR' && !id) return logger.error(payload);

        if (!this.pendingRequests) {
            this.pendingRequests = new Map();
            return;
        }

        const callback = this.pendingRequests.get(id);
        if (callback) {
            this.pendingRequests.delete(id);
            callback(e.data);
        }
    }

    sendToWorker(type, payload, callback) {
        const id = Math.random().toString(36).substring(7);
        if (callback) {
            if (!this.pendingRequests) this.pendingRequests = new Map();
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
}

export const rhizomeDb = new RhizomeDB();
