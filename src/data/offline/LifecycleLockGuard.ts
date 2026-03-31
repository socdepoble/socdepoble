export class LifecycleLockGuard {
  private abortController: AbortController | null = null;
  private isProcessing = false;

  constructor() {
    this.attachVitalSensors();
  }

  private attachVitalSensors() {
    // EL ANTÍDOTO: Escuchamos el "Grito de Muerte" del Sistema Operativo
    const executeEuthanasia = () => {
      if (this.abortController && this.isProcessing) {
        console.warn('🧊 [OS LIFECYCLE] Congelación inminente detectada. Abortando Lock atómicamente...');
        // navigator.locks respeta la señal. Libera el candado al instante a nivel de motor C++
        this.abortController.abort(new Error('OS_FREEZE_EVICTION')); 
        this.abortController = null;
        this.isProcessing = false;
      }
    };

    const executeResurrection = () => {
      console.log('☀️ [OS LIFECYCLE] Descongelación del SO. Restaurando sensores...');
      // Disparamos evento para re-evaluar la cola offline si despertamos con red
      if (typeof navigator !== 'undefined') {
        navigator.serviceWorker?.controller?.postMessage({ type: 'EVALUATE_QUEUE' });
      }
    };

    if (typeof document !== 'undefined') {
      // 1. Page Lifecycle API nativa (Se dispara milisegundos antes de suspender la CPU)
      document.addEventListener('freeze', executeEuthanasia, { capture: true });
      document.addEventListener('resume', executeResurrection, { capture: true });
      
      // 3. Suspensión blanda (El abuelo cambia de la app a WhatsApp)
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') executeEuthanasia();
        else executeResurrection();
      });
    }
    
    if (typeof window !== 'undefined') {
      // 2. Fallback letal para iOS Safari (se dispara justo antes de pasar al BFCache)
      window.addEventListener('pagehide', (e) => { if (!e.persisted) executeEuthanasia(); }, { capture: true });
    }
  }

  public async acquireSafeLease(taskName: string, task: () => Promise<void>) {
    this.abortController = new AbortController();
    this.isProcessing = true;
    try {
      // Delegamos la exclusión y la cancelación al Sistema Operativo
      if (typeof navigator !== 'undefined' && navigator.locks) {
        await navigator.locks.request(
          taskName, 
          { mode: 'exclusive', signal: this.abortController.signal }, 
          async () => { await task(); }
        );
      } else {
        await task();
      }
    } catch (err: any) {
      if (err.name === 'AbortError' || err.message === 'OS_FREEZE_EVICTION') {
        console.log(`🔓 Lock [${taskName}] cedido pacíficamente ante la suspensión del dispositivo.`);
      } else throw err;
    } finally {
      this.isProcessing = false;
    }
  }
}
export const systemLock = new LifecycleLockGuard();
