import { logger } from '../../utils/logger';
import { rhizomeDb } from '../db-core';
import { peritext } from './peritext';

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
    }

    /**
     * Registra una operació local i la persisteix a RhizomeDB.
     */
    async applyLocal(docId, opType, value) {
        const snapshot = await rhizomeDb.getSnapshot(docId);
        const lastOpId = snapshot ? snapshot.lastOpId : null;

        const op = {
            id: `${this.nodeId}-${Date.now()}-${this.opCounter++}`,
            docId,
            type: opType,
            value,
            dependsOn: lastOpId ? [lastOpId] : [],
            timestamp: Date.now(),
            author: this.nodeId
        };

        await rhizomeDb.saveOperation(op);

        // Recalculem l'estat (Amnèsic)
        const ops = await rhizomeDb.getOperations(docId);
        const newState = this._calculateState(ops);

        await rhizomeDb.saveSnapshot(docId, newState, op.id);

        return op;
    }

    /**
     * Fusiona operacions remotes.
     */
    async merge(docId, remoteOps) {
        const start = performance.now();
        logger.log(`[EgWalker] Iniciant fusió Rhizome per a ${docId}...`);

        const localOps = await rhizomeDb.getOperations(docId);
        const localIds = new Set(localOps.map(o => o.id));

        const newOps = remoteOps.filter(op => !localIds.has(op.id));
        if (newOps.length === 0) return (await this.getState(docId))?.data;

        for (const op of newOps) {
            await rhizomeDb.saveOperation(op);
        }

        const allOps = await rhizomeDb.getOperations(docId);
        const newState = this._calculateState(allOps);

        const lastOpId = allOps.length > 0 ? allOps[allOps.length - 1].id : null;
        await rhizomeDb.saveSnapshot(docId, newState, lastOpId);

        const end = performance.now();
        logger.log(`[EgWalker] Rhizome Sync completat en ${(end - start).toFixed(2)}ms.`);

        return newState;
    }

    /**
     * Poda de Versió Crítica (Garbage Collection).
     * [FLASH] Neteja l'estat intern i purga metadades per estalviar RAM i Disc.
     */
    async prune(docId) {
        const ops = await rhizomeDb.getOperations(docId);
        if (ops.length < 100) return; // Límit conservador per a "Versió Crítica"

        logger.log(`[EgWalker] EXECUTANT GARBAGE COLLECTION (Versió Crítica) per a ${docId}...`);

        // 1. Assegurem que tenim un snapshot fresc de l'estat actual
        const allOps = await rhizomeDb.getOperations(docId);
        const currentState = this._calculateState(allOps);
        const lastOpId = allOps.length > 0 ? allOps[allOps.length - 1].id : null;

        await rhizomeDb.saveSnapshot(docId, currentState, lastOpId);

        // 2. Purguem les operacions antigues de la DB
        // Conservem les últimes 20 per a permetre fusions concurrents de branques curtes
        await rhizomeDb.purgeOperations(docId, 20);

        // 3. Forcem l'alliberament de qualsevol cache efímer (Amnèsia de RAM)
        logger.log(`[EgWalker] Sistema purgat. Estat actual preservat com a Snapshot Crític.`);
    }

    async getState(docId) {
        return await rhizomeDb.getSnapshot(docId);
    }

    /**
     * Lògica de càlcul d'estat (Sense conflictes).
     * Ara integra Peritext per a la fusió de spans de text ric.
     */
    _calculateState(graph) {
        if (graph.length === 0) return { content: '', spans: [] };

        let state = {};
        let spans = [];
        let deletedIds = new Set(); // Conjunt de tombstones

        // Ordenem per causalitat i timestamp
        const sortedGraph = [...graph].sort((a, b) => {
            if (a.dependsOn.includes(b.id)) return 1;
            if (b.dependsOn.includes(a.id)) return -1;
            return a.timestamp - b.timestamp;
        });

        sortedGraph.forEach(op => {
            if (op.type === 'edit') {
                if (typeof op.value === 'object') {
                    // Si el valor té un ID i no està esborrat
                    if (op.value.id && deletedIds.has(op.value.id)) return;
                    state = { ...state, ...op.value };
                } else {
                    state = op.value;
                }
            } else if (op.type === 'delete') {
                // Registrem el tombstone
                deletedIds.add(op.value);

                // Si l'estat és un objecte, intentem treure la clau/id
                if (typeof state === 'object' && state[op.value]) {
                    const newState = { ...state };
                    delete newState[op.value];
                    state = newState;
                }
            } else if (op.type === 'format') {
                // Usem Peritext per a fusionar els spans de forma resilient
                spans = peritext.mergeSpans(spans, [op.value]);
            } else if (op.type === 'snapshot') {
                state = op.value.content || op.value;
                spans = op.value.spans || [];
            }
        });

        // Si l'estat és un objecte, li injectem els spans (si té descripció)
        if (typeof state === 'object' && state.description) {
            return { ...state, spans, _deleted: Array.from(deletedIds) };
        }

        return typeof state === 'string' ? { content: state, spans } : state;
    }
}

export const egWalker = new EgWalker();

