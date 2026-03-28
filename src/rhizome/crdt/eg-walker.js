import { logger } from '../../utils/logger';
import { rhizomeDb } from '../db-core';
import { peritext } from './peritext';
import { VectorClock } from './vectorClock';

/**
 * EgWalker: Event Graph Walker Synchronization Engine v3.0 [MASTER/FLASH]
 * 
 * Filosofia:
 * 1. Persistència Real: Utilitza RhizomeDB (SQLite/OPFS) enlloc de localStorage.
 * 2. Amnèsia de RAM: No manté el graf en memòria, només l'estat actual calculat.
 * 3. Peritext Ready: L'estat ara suporta spans per a format de text rich.
 */
class EgWalker {
    constructor(nodeId = 'village-cell-' + Math.random().toString(36).substring(7)) {
        this.nodeId = nodeId;
        this.opCounter = 0;
        this.docQueues = new Map(); // Cues per a garantir atomicitat per document
        this.causalBuffer = new Map(); // Buffer de retenció CRDT (Protocol OMEGA-4)
    }

    /**
     * Garantix que les operacions sobre un document s'executen de forma seqüencial (Atomic Swap).
     */
    async _runWithDocLock(docId, task) {
        if (!this.docQueues.has(docId)) {
            this.docQueues.set(docId, Promise.resolve());
        }

        const previousTask = this.docQueues.get(docId);
        const nextTask = (async () => {
            await previousTask;
            try {
                return await task();
            } catch (err) {
                logger.error(`[EgWalker] Error en tasca bloquejada per a ${docId}:`, err);
                throw err;
            }
        })();

        const safeTask = nextTask.catch(() => {});
        this.docQueues.set(docId, safeTask); 
        
        // [GC OMEGA-3] Alliberem el pany de memòria quan es resol la cua completa
        safeTask.finally(() => {
            if (this.docQueues.get(docId) === safeTask) {
                this.docQueues.delete(docId);
            }
        });

        return nextTask;
    }

    /**
     * Registra una operació local i la persisteix a RhizomeDB.
     */
    async applyLocal(docId, opType, value) {
        return this._runWithDocLock(docId, async () => {
            const snapshot = await rhizomeDb.getSnapshot(docId);
            const lastOpId = snapshot ? snapshot.lastOpId : null;
            let lastClock = snapshot?.vectorClock ? VectorClock.fromJSON(snapshot.vectorClock) : new VectorClock();
            const newClock = lastClock.increment(this.nodeId);

            const op = {
                id: `${this.nodeId}-${Date.now()}-${this.opCounter++}`,
                docId,
                type: opType,
                value,
                dependsOn: lastOpId ? [lastOpId] : [],
                timestamp: Date.now(),
                author: this.nodeId,
                vectorClock: newClock.toJSON()
            };

            await rhizomeDb.saveOperation(op);

            const ops = await rhizomeDb.getOperations(docId);
            const newState = this._calculateState(ops);

            await rhizomeDb.saveSnapshot(docId, newState.data, op.id, newState.vectorClock);
            return op;
        });
    }

    /**
     * [FIX OMEGA-4] Fusiona operacions remotes aplicant Validació Causal Estricta.
     * Reté operacions orfes al CausalBuffer fins que arribe la història prèvia.
     */
    async merge(docId, remoteOps) {
        return this._runWithDocLock(docId, async () => {
            const start = performance.now();
            logger.log(`[EgWalker] Iniciant fusió Rhizome (amb Causal Buffer) per a ${docId}...`);

            const localOps = await rhizomeDb.getOperations(docId);
            const localIds = new Set(localOps.map(o => o.id));

            // Afegim les operacions pendents de l'historial temporal
            const queuedOps = this.causalBuffer.get(docId) || [];
            const combinedOps = [...remoteOps, ...queuedOps];
            
            // Netejem aquest docId per reavaluar en bloc
            this.causalBuffer.set(docId, []);

            const validNewOps = [];
            const missingDependencies = [];

            // 1. Filtrar primari sobre Causalitat (Causal Buffer Entry)
            for (const op of combinedOps) {
                if (localIds.has(op.id)) continue;
                
                let isCausallyValid = true;
                if (op.dependsOn && Array.isArray(op.dependsOn)) {
                    for (const depId of op.dependsOn) {
                        if (!localIds.has(depId) && !validNewOps.some(v => v.id === depId)) {
                            isCausallyValid = false;
                            break;
                        }
                    }
                }

                if (isCausallyValid) {
                    validNewOps.push(op);
                } else {
                    missingDependencies.push(op);
                }
            }

            // 2. Resolució en Cascata (Fix Point Algorithm)
            // Una operació recentment validada pot complir dependències d'una de retinguda.
            let refined = true;
            while(refined) {
                 refined = false;
                 for (let i = missingDependencies.length - 1; i >= 0; i--) {
                      const op = missingDependencies[i];
                      let isValid = true;
                      for (const depId of op.dependsOn || []) {
                           if (!localIds.has(depId) && !validNewOps.some(v => v.id === depId)) {
                               isValid = false;
                               break;
                           }
                      }
                      if (isValid) {
                          validNewOps.push(op);
                          missingDependencies.splice(i, 1);
                          refined = true; // Hem des-encallat una peça, iterem de nou
                      }
                 }
            }

            // 3. Captivitat dels Òrfens (Buffer Persistance)
            if (missingDependencies.length > 0) {
                 logger.warn(`[EgWalker] Òrfens Causals (${missingDependencies.length}). Retinguts temporalment fins l'arribada d'antecedents per a ${docId}.`);
                 this.causalBuffer.set(docId, missingDependencies);
            }

            // 4. Ingesta i Consolidació de l'Estat Purificat
            if (validNewOps.length === 0) return (await this.getState(docId))?.data;

            await rhizomeDb.saveOperationsBatch(validNewOps);

            const allOps = await rhizomeDb.getOperations(docId);
            const newState = this._calculateState(allOps);

            const lastOpId = allOps.length > 0 ? allOps[allOps.length - 1].id : null;
            await rhizomeDb.saveSnapshot(docId, newState.data, lastOpId, newState.vectorClock);

            const end = performance.now();
            logger.log(`[EgWalker] Rhizome Sync (Causal Estricte) completat en ${(end - start).toFixed(2)}ms.`);

            return newState.data;
        });
    }

    /**
     * Poda de Versió Crítica (Garbage Collection).
     */
    async prune(docId) {
        return this._runWithDocLock(docId, async () => {
            const ops = await rhizomeDb.getOperations(docId);
            if (ops.length < 100) return;

            logger.log(`[EgWalker] EXECUTANT ATOMIC PRUNING ($Vcrit) per a ${docId}...`);

            const allOps = await rhizomeDb.getOperations(docId);
            const currentState = this._calculateState(allOps);
            const lastOpId = allOps.length > 0 ? allOps[allOps.length - 1].id : null;

            await rhizomeDb.saveSnapshot(docId, currentState.data, lastOpId, currentState.vectorClock);
            await rhizomeDb.purgeOperations(docId, 20);

            logger.log(`[EgWalker] Poda atòmica completada per a ${docId}.`);
        });
    }

    async getState(docId) {
        return await rhizomeDb.getSnapshot(docId);
    }

    /**
     * Lògica de càlcul d'estat DETERMINISTA (Lamport Tie-break).
     */
    _calculateState(graph) {
        if (graph.length === 0) return { data: { content: '', spans: [] }, vectorClock: new VectorClock() };

        let state = {};
        let spans = [];
        let deletedIds = new Set();
        let finalClock = new VectorClock();

        // Ordenem per Vector Clocks i determinisme (Lamport)
        const sortedGraph = [...graph].sort((a, b) => {
            const aClock = a.vectorClock ? VectorClock.fromJSON(a.vectorClock) : new VectorClock();
            const bClock = b.vectorClock ? VectorClock.fromJSON(b.vectorClock) : new VectorClock();
            const cmp = aClock.compare(bClock);
            if (cmp !== null && cmp !== 0) return cmp;

            // 2. Determinisme causal: Identitat -> Timestamp -> ID
            if (a.timestamp !== b.timestamp) return a.timestamp - b.timestamp;
            return a.id.localeCompare(b.id);
        });

        sortedGraph.forEach(op => {
            const opClock = op.vectorClock ? VectorClock.fromJSON(op.vectorClock) : new VectorClock();
            finalClock = finalClock.merge(opClock);

            if (op.type === 'edit') {
                if (typeof op.value === 'object') {
                    if (op.value.id && deletedIds.has(op.value.id)) return;
                    state = { ...state, ...op.value };
                } else {
                    state = op.value;
                }
            } else if (op.type === 'delete') {
                deletedIds.add(op.value);
                if (typeof state === 'object' && state[op.value]) {
                    const newState = { ...state };
                    delete newState[op.value];
                    state = newState;
                }
            } else if (op.type === 'format') {
                spans = peritext.mergeSpans(spans, [op.value]);
            } else if (op.type === 'snapshot') {
                state = op.value.content || op.value;
                spans = op.value.spans || [];
            }
        });

        let dataFinal;
        if (typeof state === 'object' && state.description) {
            dataFinal = { ...state, spans, _deleted: Array.from(deletedIds) };
        } else {
            dataFinal = typeof state === 'string' ? { content: state, spans } : state;
        }

        return { data: dataFinal, vectorClock: finalClock };
    }
}

export const egWalker = new EgWalker();

