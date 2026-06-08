/**
 * FÀÇANA DE SINCRONITZACIÓ (SyncPort & Scheduler)
 * Cumpleix amb l'Acció Atòmica 2 de l'Auditoria dels 12 Savis.
 * 
 * Separa la capa de negoci i la UI de la complexitat del motor CRDT / PowerSync.
 * Implementa el `ReconciliationScheduler` (Backpressure / Token-bucket) per 
 * evitar "La Tempesta de Fusió" (Merge Storm).
 */

class ReconciliationScheduler {
    constructor(batchSize = 50, frameTimeMs = 300) {
        this.queue = [];
        this.isProcessing = false;
        this.BATCH_SIZE = batchSize; // Mutacions per lot
        this.FRAME_TIME_MS = frameTimeMs; // Pausa per deixar respirar el Main Thread (iPad A10)
    }

    /**
     * Afig una mutació CRDT a la cua de processament.
     */
    enqueue(operation) {
        this.queue.push(operation);
        if (!this.isProcessing) {
            this.processQueue();
        }
    }

    /**
     * Processa la cua en lots, alliberant el fil principal amb setTimeout.
     */
    async processQueue() {
        if (this.queue.length === 0) {
            this.isProcessing = false;
            return;
        }

        this.isProcessing = true;
        const batch = this.queue.splice(0, this.BATCH_SIZE);

        // Simulació de l'aplicació del lot CRDT a PowerSync / Y.js / SQLite
        try {
            await this._applyBatch(batch);
        } catch (error) {
            console.error('[SyncPort] Error applying CRDT batch:', error);
            // Implementar backoff o posar a la cua d'errors
        }

        // Deixem respirar el navegador (16ms = 1 frame, o frameTimeMs especificat)
        setTimeout(() => {
            this.processQueue();
        }, this.FRAME_TIME_MS);
    }

    async _applyBatch(batch) {
        // Aci es faria la inserció en la DB local (PowerSync / wa-sqlite)
        // Per exemple: await powerSync.executeBatch(...)
        if (process.env.NODE_ENV === 'development') {
            console.log(`[SyncPort] Scheduler: Batch aplicat (${batch.length} operacions). En cua: ${this.queue.length}`);
        }
        return Promise.resolve();
    }
}

export const syncScheduler = new ReconciliationScheduler();

export const SyncPort = {
    /**
     * Tota operació de pujada (push) ha de passar per ací.
     */
    pushMutation: (domain, payload) => {
        syncScheduler.enqueue({ domain, type: 'UPSERT', payload, timestamp: Date.now() });
    },

    /**
     * Llista per obrir el Conflicte de l'usuari manualment.
     */
    flagConflict: (localState, remoteState) => {
        sessionStorage.setItem('sdp_conflict_data', JSON.stringify({ localState, remoteState }));
        window.dispatchEvent(new CustomEvent('sdp:conflict-detected'));
    }
};

export default SyncPort;
