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

        this.docQueues.set(docId, nextTask.catch(() => {})); // Evitem que un error trenqui la cua
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
     * Fusiona operacions remotes amb bloqueig d'atomicitat.
     */
    async merge(docId, remoteOps) {
        return this._runWithDocLock(docId, async () => {
            const start = performance.now();
            logger.log(`[EgWalker] Iniciant fusió Rhizome per a ${docId}...`);

            const localOps = await rhizomeDb.getOperations(docId);
            const localIds = new Set(localOps.map(o => o.id));

            const newOps = remoteOps.filter(op => !localIds.has(op.id));
            if (newOps.length === 0) return (await this.getState(docId))?.data;

            await rhizomeDb.saveOperationsBatch(newOps);

            const allOps = await rhizomeDb.getOperations(docId);
            const newState = this._calculateState(allOps);

            const lastOpId = allOps.length > 0 ? allOps[allOps.length - 1].id : null;
            await rhizomeDb.saveSnapshot(docId, newState.data, lastOpId, newState.vectorClock);

            const end = performance.now();
            logger.log(`[EgWalker] Rhizome Sync completat en ${(end - start).toFixed(2)}ms.`);

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

