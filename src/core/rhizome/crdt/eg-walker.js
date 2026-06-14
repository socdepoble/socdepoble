import { logger } from '../../../utils/logger';
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
      while (refined) {
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
    });
  }

  /**
   * Poda de Versió Crítica (Garbage Collection).
   * [FLASH] Neteja l'estat intern i purga metadades per estalviar RAM i Disc.
   */
  async prune(docId) {
    return this._runWithDocLock(docId, async () => {
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
    });
  }
  async getState(docId) {
    return await rhizomeDb.getSnapshot(docId);
  }

  /**
   * Lògica de càlcul d'estat (Sense conflictes).
   * Ara integra Peritext per a la fusió de spans de text ric.
   */
  _calculateState(graph) {
    if (graph.length === 0) return {
      content: '',
      spans: []
    };
    let state = {};
    let spans = [];
    let deletedIds = new Set(); // Conjunt de tombstones

    // Ordenem per causalitat, temps i un tie-break determinista per node/op
    const sortedGraph = [...graph].sort((a, b) => {
      if (a.dependsOn.includes(b.id)) return 1;
      if (b.dependsOn.includes(a.id)) return -1;
      const timeDiff = a.timestamp - b.timestamp;
      if (timeDiff !== 0) return timeDiff;
      const aNode = a.author || a.nodeId || '';
      const bNode = b.author || b.nodeId || '';
      const nodeDiff = aNode.localeCompare(bNode);
      if (nodeDiff !== 0) return nodeDiff;
      return (a.id || '').localeCompare(b.id || '');
    });
    sortedGraph.forEach(op => {
      if (op.type === 'edit') {
        if (typeof op.value === 'object') {
          // Si el valor té un ID i no està esborrat
          if (op.value.id && deletedIds.has(op.value.id)) return;
          state = {
            ...state,
            ...op.value
          };
        } else {
          state = op.value;
        }
      } else if (op.type === 'delete') {
        // Registrem el tombstone
        deletedIds.add(op.value);

        // Si l'estat és un objecte, intentem treure la clau/id
        if (typeof state === 'object' && state[op.value]) {
          const newState = {
            ...state
          };
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
      return {
        ...state,
        spans,
        _deleted: Array.from(deletedIds)
      };
    }
    return typeof state === 'string' ? {
      content: state,
      spans
    } : state;
  }
}
export const egWalker = new EgWalker();