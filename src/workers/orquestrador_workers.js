/**
 * ORQUESTRADOR DE WEB WORKERS (El Nucli Asíncron)
 * 
 * Aquest gestor evita que la UI s'ofegue movent processos pesats
 * com la sincronització de Y.js (CRDT), indexació o processament d'imatges
 * fóra del fil principal (Main Thread). 
 * 
 * Especialment dissenyat per no col·lapsar iPads de 2GB de RAM (A10).
 */

class WorkerOrchestrator {
  constructor() {
    this.workers = new Map();
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;
    
    // Aquí es registrarien els Workers quan siga el moment.
    // Ex: this.workers.set('rhizome', new Worker(new URL('./rhizome-worker.js', import.meta.url)));
    
    this.isInitialized = true;
    console.log('[Orquestrador Workers] Termodinàmica protegida: Preparat per delegar.');
  }

  postMessage(workerName, message) {
    const worker = this.workers.get(workerName);
    if (worker) {
      worker.postMessage(message);
    } else {
      console.warn(`[Orquestrador Workers] Intent d'enviament a un worker no existent: ${workerName}`);
    }
  }

  terminateAll() {
    for (const [name, worker] of this.workers.entries()) {
      worker.terminate();
      console.log(`[Orquestrador Workers] Worker ${name} terminat.`);
    }
    this.workers.clear();
    this.isInitialized = false;
  }
}

export const orchestrator = new WorkerOrchestrator();
