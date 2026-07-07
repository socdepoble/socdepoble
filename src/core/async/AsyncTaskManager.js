/**
 * AsyncTaskManager.js
 * El Singleton central que orquestra les tasques en background.
 * Manté l'iPad A10 lliure de Jetsam Crashes en posar en cua i vigilar les tasques pesades.
 */
import { TaskPriority } from './AsyncTask.js';

class AsyncTaskManagerClass {
  constructor() {
    this.queue = [];
    this.taskMeta = new WeakMap(); // Metadades desacoblades (Perplexity GC fix)
    this.isProcessing = false;
    this.emergencyMode = false;
    this.currentTask = null; // Seguiment de Tasca Fantasma (Auditoria Gemini)
    this.batteryManager = null;
    this.initVisibilityListener();
    this.recoverFromStorage();
    this.initBatteryManager();
    this.initStoragePersistence();
  }

  /**
   * Intenta garantir que Safari no esborre les dades locals després de 7 dies.
   * L'èxit d'açò depèn sovint de si l'app està instal·lada com a PWA.
   */
  async initStoragePersistence() {
    if (navigator.storage && navigator.storage.persist) {
      try {
        const isPersisted = await navigator.storage.persist();
        console.log(`🚜 [AsyncTaskManager] Storage Persist: ${isPersisted ? 'Granted' : 'Denied (Requires PWA install)'}`);
      } catch (e) {}
    }
  }

  /**
   * Cacheja el BatteryManager per no demanar-lo a cada tasca.
   */
  async initBatteryManager() {
    if ('getBattery' in navigator) {
      try {
        this.batteryManager = await navigator.getBattery();
        this.batteryManager.addEventListener('chargingchange', () => {
          if (this.batteryManager.charging && !this.isProcessing) {
             console.log('🚜 [AsyncTaskManager] S\'ha connectat la bateria. Despertant cua...');
             this.scheduleNext();
          }
        });
      } catch (e) {}
    }
  }

  /**
   * Intenta recuperar les tasques crítiques que es van guardar en un emergencyAbort (Jetsam).
   */
  recoverFromStorage() {
    try {
      const saved = sessionStorage.getItem('sdp_async_queue');
      if (saved) {
        const snapshot = JSON.parse(saved);
        this.pendingRecovery = snapshot.tasks || [];
        sessionStorage.removeItem('sdp_async_queue');
        console.warn(`🚜 [AsyncTaskManager] Ressuscitant ${this.pendingRecovery.length} tasques de l'ombra (Protocol Kimi v2)...`);
        
        // Com que les funcions (closures) no es poden serialitzar, emetem un esdeveniment
        // perquè els serveis originals (ex: syncService) les puguen reconstruir.
        window.dispatchEvent(new CustomEvent('sosp:queue:recovered', { detail: this.pendingRecovery }));
        this.pendingRecovery = null; // Evitem fuites de memòria (Auditoria ChatGPT)
      }
    } catch (e) {
      console.error('🚜 [AsyncTaskManager] Error recuperant dades de l\'ombra:', e);
    }
  }

  /**
   * Posa en cua una tasca i retorna una Promesa que es resoldrà quan acabe.
   * Rebutja automàticament si la cua està saturada per evitar OOM (Excepte CRITICAL).
   * @param {AsyncTask} task 
   * @returns {Promise<any>}
   */
  enqueue(task) {
    const MAX_QUEUE_SIZE = 50;
    if (this.queue.length >= MAX_QUEUE_SIZE && task.priority !== TaskPriority.CRITICAL) {
      return Promise.reject(new Error('Cua plena: allibera recursos o espera (Thermodynamic Backoff)'));
    }

    return new Promise((resolve, reject) => {
      const maxQueueTime = task.maxQueueTime || 120000; // 2 minuts per defecte
      const expiryTimer = setTimeout(() => {
        const idx = this.queue.indexOf(task);
        if (idx !== -1) {
          this.queue.splice(idx, 1);
          console.error(`🚜 [AsyncTaskManager] Tasca caducada a la cua: ${task.name}`);
          reject(new Error(`Tasca caducada a la cua (>${maxQueueTime}ms)`));
          this.taskMeta.delete(task);
        }
      }, maxQueueTime);
      
      // Guardem les metadades desacoblades per no embrutar l'objecte original
      this.taskMeta.set(task, { resolvePromise: resolve, rejectPromise: reject, expiryTimer });

      const idx = this.queue.findIndex(t => t.priority > task.priority);
      if (idx === -1) {
        this.queue.push(task);
      } else {
        this.queue.splice(idx, 0, task);
      }
      
      if (!this.isProcessing) {
        this.scheduleNext();
      }
    });
  }

  /**
   * Implementa el 'Quiesce' i el 'Jitter'.
   */
  scheduleNext() {
    if (this.queue.length === 0 || this.emergencyMode) return;

    this.isProcessing = true;

    // Jitter: evitem el 'Thundering Herd' amb un xicotet retard aleatori (50 - 300ms)
    const jitter = Math.floor(Math.random() * 250) + 50;

    setTimeout(() => {
      // Quiesce: esperem que el Main Thread estiga lliure
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => this.processNext(), { timeout: 2000 });
      } else {
        setTimeout(() => this.processNext(), 0);
      }
    }, jitter);
  }

  /**
   * Executa la tasca amb Watchdog i comprovació termodinàmica.
   */
  async processNext() {
    if (this.emergencyMode) return; // Evitem carrera de condicions si s'activa l'abort
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }

    const task = this.queue[0]; // Agafem la més prioritària
    
    // 1. Validació Termodinàmica
    const canRun = await this.checkThermodynamics(task);
    if (!canRun) {
      task.retries = (task.retries || 0) + 1;
      
      if (task.retries >= 3 || this.queue.length >= 50) {
        console.error(`🚜 [AsyncTaskManager] Circuit Breaker activat per a: ${task.name}. Rebutjant promesa.`);
        this.queue.shift();
        this.isProcessing = false;
        
        const meta = this.taskMeta.get(task);
        if (meta && meta.expiryTimer) clearTimeout(meta.expiryTimer);
        if (meta && meta.rejectPromise) meta.rejectPromise(new Error('Thermodynamic Backoff'));
        this.taskMeta.delete(task);
      } else {
        console.warn(`🚜 [AsyncTaskManager] Tasca posposada per Termodinàmica: ${task.name} (Retries: ${task.retries})`);
        this.queue.shift();
        this.queue.push(task);
        this.isProcessing = false;
      }
      
      // Retardem la pròxima avaluació
      setTimeout(() => this.scheduleNext(), 5000);
      return;
    }

    // Llevem la tasca de la cua ja que l'anem a executar
    this.queue.shift();
    const meta = this.taskMeta.get(task);
    if (meta && meta.expiryTimer) clearTimeout(meta.expiryTimer);

    // 2. Watchdog
    const watchdogTimer = setTimeout(() => {
      task.abort('Watchdog Timeout (>' + task.timeout + 'ms)');
      this.throwTaronjaAlert(`La tasca "${task.name}" estava ofegant el Mas i ha sigut avortada.`);
    }, task.timeout);

    this.currentTask = task; // Ancorar la tasca fantasma (Gemini)

    try {
      console.log(`🚜 [AsyncTaskManager] Executant tasca: ${task.name} (Prioritat: ${task.priority})`);
      const res = await task.run();
      if (meta && meta.resolvePromise) meta.resolvePromise(res);
    } catch (error) {
      // Error gestionat per la pròpia tasca i el seu fallback, però deixem rastre per a l'auditoria
      console.error(`🚜 [AsyncTaskManager] Error intern executant la tasca ${task.name}:`, error);
      if (meta && meta.rejectPromise) meta.rejectPromise(error);
    } finally {
      this.currentTask = null; // Alliberar la tasca fantasma
      this.taskMeta.delete(task);
      clearTimeout(watchdogTimer);
      // Continuem amb la següent tasca
      this.scheduleNext();
    }
  }

  /**
   * Avalua si el dispositiu pot assumir la tasca actual.
   * @param {AsyncTask} task 
   * @returns {Promise<boolean>}
   */
  async checkThermodynamics(task) {
    // Tasques crítiques (OPFS) s'executen sempre
    if (task.priority === TaskPriority.CRITICAL) return true;

    // Comprovació de Bateria (usant la instància cachejada)
    if (this.batteryManager) {
      try {
        const level = this.batteryManager.level * 100;
        const charging = this.batteryManager.charging;
        
        if (!charging && level < 20 && task.thermoCost.battery === 'high') {
          return false; // Bateria baixa i desendollat
        }
      } catch (e) {
        // Ignorem errors
      }
    }

    // Comprovació de RAM (aproximada per deviceMemory, no sempre exacta però orientativa)
    if ('deviceMemory' in navigator) {
      const memory = navigator.deviceMemory; // en GB
      // Si estem en un A10 antic (sovint marcat com a 2GB o menys per a web)
      if (memory <= 2 && task.thermoCost.ram === 'high') {
        // Podríem afegir més heurístiques ací, però de moment:
        // Si és RAM high, només permetem executar-la si no estem en battery saving
        // i potser llançaríem sub-batching. Per simplificar, la deixem passar
        // però sota estricte Watchdog.
      }
    }

    return true;
  }

  /**
   * Llença un esdeveniment a la UI per mostrar l'Avisador Efímer Taronja.
   * La carcassa de React (Sollutia) ha d'escoltar aquest 'CustomEvent'.
   */
  throwTaronjaAlert(message) {
    const event = new CustomEvent('sosp:alert:taronja', {
      detail: { message }
    });
    window.dispatchEvent(event);
  }

  /**
   * Detecta quan l'usuari amaga l'aplicació (minimitza Safari).
   * Dispara una escriptura atòmica d'emergència per no perdre dades si iOS fa un Jetsam Crash.
   */
  initVisibilityListener() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        console.warn('🚜 [AsyncTaskManager] Safari enviat a fons. Abortant operacions I/O asíncrones per evitar corrupció...');
        this.emergencyAbort();
      } else {
        this.emergencyMode = false;
        this.scheduleNext();
      }
    });
  }

  /**
   * Força la cancel·lació de les operacions I/O asíncrones per protegir la Base de Dades (iOS Safari).
   * Genera un snapshot a sessionStorage abans de morir per a una resurrecció futura.
   */
  emergencyAbort() {
    this.emergencyMode = true;
    
    // 1. Fem snapshot de la cua amb metadades per garantir la resurrecció (Copilot)
    try {
      const queueSnapshot = {
        timestamp: Date.now(),
        version: '1.0.0-SOSP',
        tasks: this.queue
          .filter(t => t.serialize)
          .map(t => ({
            id: t.id,
            name: t.name,
            priority: t.priority,
            payload: t.serialize()
          }))
      };
        
      if (queueSnapshot.tasks.length > 0) {
        sessionStorage.setItem('sdp_async_queue', JSON.stringify(queueSnapshot));
      }
    } catch (e) {
      // Ignorem errors d'I/O en emergency mode
    }
    
    // 2. Buidem la cua ràpidament i rebutgem les promeses per alliberar memòria
    while (this.queue.length > 0) {
      const task = this.queue.shift();
      const meta = this.taskMeta.get(task);
      if (meta && meta.expiryTimer) clearTimeout(meta.expiryTimer);
      if (meta && meta.rejectPromise) {
        meta.rejectPromise(new Error('App Hidden - Emergency Abort'));
      }
      this.taskMeta.delete(task);
      task.abort('Safari Hidden');
    }

    // 3. Matar la Tasca Fantasma "en vol" (Gemini)
    if (this.currentTask) {
      const meta = this.taskMeta.get(this.currentTask);
      if (meta && meta.rejectPromise) {
        meta.rejectPromise(new Error('App Hidden - Emergency Abort (Ghost Task)'));
      }
      this.taskMeta.delete(this.currentTask);
      this.currentTask.abort('Safari Hidden (Ghost Task)');
      this.currentTask = null;
    }
  }
}

// Exportem el Singleton
export const AsyncTaskManager = new AsyncTaskManagerClass();
