/**
 * AsyncTask.js
 * Encapsula una tasca asíncrona per a l'AsyncTaskManager.
 * Inclou pes termodinàmic, prioritats i capacitats d'avortament (AbortController).
 */

export const TaskPriority = {
  CRITICAL: 1, // Guardat OPFS (Amnèsia prevention)
  HIGH: 2,     // Sincronització Sèquia Mare
  NORMAL: 3,   // Tasques de fons regulars
  LOW: 4       // Verema (Y.js compacting) / WebNN
};

export class AsyncTask {
  /**
   * @param {Object} options
   * @param {string} options.id - Identificador únic de la tasca
   * @param {string} options.name - Nom llegible
   * @param {number} options.priority - Prioritat (TaskPriority)
   * @param {Function} options.execute - Funció asíncrona a executar. Rep el signal de l'AbortController.
   * @param {Function} [options.fallback] - Funció a executar si la tasca falla o és avortada.
   * @param {Object} [options.thermoCost] - Pes de la tasca { ram: 'low'|'high', battery: 'low'|'high' }
   * @param {number} [options.timeout] - Temps màxim en ms (Watchdog). Per defecte 5000ms.
   */
  constructor({
    id,
    name,
    priority = TaskPriority.NORMAL,
    execute,
    fallback = null,
    thermoCost = { ram: 'low', battery: 'low' },
    timeout = 5000
  }) {
    this.id = id || crypto.randomUUID();
    this.name = name;
    this.priority = priority;
    this.executeFn = execute;
    this.fallbackFn = fallback;
    this.thermoCost = thermoCost;
    this.timeout = timeout;
    
    this.abortController = new AbortController();
    this.status = 'pending'; // pending, running, completed, aborted, failed
    this.createdAt = Date.now();
  }

  async run() {
    this.status = 'running';
    try {
      const result = await this.executeFn(this.abortController.signal);
      this.status = 'completed';
      return result;
    } catch (error) {
      if (this.abortController.signal.aborted) {
        this.status = 'aborted';
        console.warn(`🚜 [AsyncTask] Tasca avortada per l'AsyncTaskManager: ${this.name}`);
      } else {
        this.status = 'failed';
        console.error(`🚜 [AsyncTask] Error executant tasca ${this.name}:`, error);
      }
      
      if (this.fallbackFn) {
        try {
          await this.fallbackFn(error);
        } catch (fallbackError) {
          console.error(`🚜 [AsyncTask] Error al fallback de la tasca ${this.name}:`, fallbackError);
        }
      }
      throw error;
    }
  }

  abort(reason = 'Termodinàmica extrema / Watchdog') {
    if (this.status === 'pending' || this.status === 'running') {
      this.abortController.abort(reason);
      this.status = 'aborted';
    }
  }
}
