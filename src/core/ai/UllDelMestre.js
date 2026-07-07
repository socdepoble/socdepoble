/**
 * UllDelMestre.js
 * Exploració de WebNN / Edge AI per al projecte Sóc de Poble.
 * S'executa sempre com a tasca de BAIXA PRIORITAT a través de l'AsyncTaskManager.
 */
import { AsyncTaskManager } from '../async/AsyncTaskManager.js';
import { AsyncTask, TaskPriority } from '../async/AsyncTask.js';

export class UllDelMestre {
  constructor() {
    this.isSupported = false;
    this.model = null;
  }

  /**
   * Comprova si el dispositiu suporta WebNN o WebGPU per a inferència local.
   */
  async checkSupport() {
    // Feature detect de WebNN (navigator.ml)
    if ('ml' in navigator) {
      this.isSupported = true;
      console.log("🚜 [UllDelMestre] L'A10 té una espurna de llum: WebNN està suportat.");
    } else {
      console.warn("🚜 [UllDelMestre] Sense WebNN. Usarem un fallback d'heurístiques simples.");
    }
  }

  /**
   * Tasca de prova per fer reconeixement d'imatges o text.
   * L'enviem a l'AsyncTaskManager per assegurar que no ofega el Main Thread.
   */
  scheduleInference(data) {
    const inferenceTask = new AsyncTask({
      id: `ull-inference-${Date.now()}`,
      name: `UllDelMestre Inferència (${data.type})`,
      priority: TaskPriority.LOW, // El més baix, la UI va primer
      thermoCost: { ram: 'high', battery: 'high' }, // Açò farà que es bloquegi si la bateria és baixa
      execute: async (signal) => {
        return await this._runInference(data, signal);
      },
      fallback: async (error) => {
        console.log("🚜 [UllDelMestre] Inferència fallida o avortada. Recorrent a etiquetatge manual.");
      },
      timeout: 10000 // Donem fins a 10 segons a l'A10 per fer la feina
    });

    AsyncTaskManager.enqueue(inferenceTask);
  }

  /**
   * Mètode intern d'inferència.
   */
  async _runInference(data, signal) {
    if (!this.isSupported) {
      // Simulem heurística simple si no hi ha WebNN
      await new Promise(resolve => setTimeout(resolve, 500));
      return { label: 'Desconegut', confidence: 0 };
    }

    // Ací aniria el codi real de WebNN per executar el model
    // if (signal.aborted) throw new Error("Avortat");
    
    // Simulem el treball pesat
    console.log("🚜 [UllDelMestre] Processant tensors...");
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (signal.aborted) {
      throw new Error("Avortat per Termodinàmica");
    }

    return { label: 'Tomaca de penjar', confidence: 0.89 };
  }
}

export const ullDelMestre = new UllDelMestre();
