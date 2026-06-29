// Pseudocodi extret de l'auditoria de Mistral Vibe (Ronda 12)
// Conservat per a la implementació de l'arquitectura de Sóc de Poble

// ============================================
// 🏗️ GOVERNOR D'ASYNC - SÓC DE POBLE (V25 FINAL)
// Cervell centralitzat per orquestrar les 15 Lleis Asíncrones
// ============================================

// --- Dependències (Mock per a l'exemple) ---
const Y = { 
  js: { toJSON: () => ({}), sync: () => Promise.resolve() },
  provider: { connect: () => {}, disconnect: () => {}, sync: () => {} }
};
const OPFS = { writeFile: () => Promise.resolve(), deleteFile: () => Promise.resolve() };
const IndexedDB = { open: () => Promise.resolve(), exportAll: () => Promise.resolve({}) };
const WebRTC = { pauseDeltas: () => {}, resumeDeltas: () => {} };

// ============================================
// 🔧 CONFIGURACIÓ INICIAL
// ============================================
const CONFIG = {
  PRIORITATS: {
    CRITIC: 0,      
    ALTA: 1,        
    MITJANA: 2,    
    BAIXA: 3        
  },
  TIMEOUTS: {
    SOSP_LOCK: 10000,
    QUIESCE: 30000,
    KEEPALIVE: 25 * 24 * 60 * 60 * 1000,
    WORKER: 5000
  },
  LIMITS: {
    MAX_DEPTH_AUTOPOIESI: 3,
    MAX_PODA_PROPOSTES: 10,
    MAX_RAM_MB: 400,
    BATCH_SIZE: 50 
  }
};

// ============================================
// 🧠 GOVERNOR D'ASYNC (Classe Principal)
// ============================================
class AsyncGovernor {
  constructor() {
    this.taskQueue = []; 
    this.activeTasks = new Map(); 
    this.mutex = new WorkerMutex(); 
    this.quiesceManager = new QuiesceManager(); 
    this.keepalive = new IOS15Keepalive(); 
    this.jitter = new JitterManager(); 
    this.timeoutManager = new TimeoutManager(); 
    this.autopoiesi = new AutopoiesiManager(); 
    this.handshake = new HandshakeStateMachine(); 
    
    this.init();
  }

  init() {
    console.log("🚀 Governor d'Async inicialitzat.");
    this.keepalive.init(); 
    this.scheduleJitter(); 
  }

  async enqueueTask(nom, fn, prioritat = CONFIG.PRIORITATS.BAIXA) {
    const task = { nom, fn, prioritat };
    this.taskQueue.push(task);
    this.taskQueue.sort((a, b) => a.prioritat - b.prioritat); 
    console.log(`⏳ Tasca "${nom}" afegida a la cua (Prioritat: ${prioritat}).`);
    await this.processQueue();
  }

  async processQueue() {
    if (this.taskQueue.length === 0 || this.activeTasks.size >= 2) return;
    
    const task = this.taskQueue.shift();
    if (!task) return;
    
    console.log(`▶️ Processant tasca: "${task.nom}".`);
    this.activeTasks.set(task.nom, task.fn());
    
    try {
      await this.activeTasks.get(task.nom);
      console.log(`✅ Tasca "${task.nom}" completada.`);
    } catch (err) {
      console.error(`❌ Tasca "${task.nom}" fallida:`, err.message);
    } finally {
      this.activeTasks.delete(task.nom);
      this.processQueue(); 
    }
  }

  async snapshotLock() {
    await this.mutex.acquire('SnapshotLock');
    try {
      console.log("📸 Snapshot Lock: Bloquejant escriptura UI per Verema.");
      document.body.style.pointerEvents = 'none';
      await Y.js.sync(); 
    } finally {
      document.body.style.pointerEvents = 'auto';
      this.mutex.release();
      console.log("🔓 Snapshot Lock: Escriptura UI desbloquejada.");
    }
  }

  async quiesce() {
    await this.enqueueTask('Quiesce', async () => {
      await this.quiesceManager.quiesce();
    }, CONFIG.PRIORITATS.CRITIC);
  }

  async triggerKeepalive() {
    await this.enqueueTask('Keepalive', async () => {
      await this.keepalive.ping();
    }, CONFIG.PRIORITATS.ALTA);
  }

  async runAutopoiesi() {
    await this.enqueueTask('Autopoiesi', async () => {
      await this.autopoiesi.run();
    }, CONFIG.PRIORITATS.MITJANA);
  }

  async runVerema() {
    await this.enqueueTask('Verema', async () => {
      await this.mutex.acquire('Verema');
      try {
        console.log("🍇 Verema: Iniciant tancament mensual CRDT.");
        const data = Y.js.toJSON();
        await OPFS.writeFile('/verema.json', data);
      } finally {
        this.mutex.release();
      }
    }, CONFIG.PRIORITATS.ALTA);
  }

  async lockSOSP(reason) {
    await this.enqueueTask('SOSP_LOCK', async () => {
      await this.timeoutManager.withTimeout(
        SOSP_LOCK.set('LOCKED', reason),
        CONFIG.TIMEOUTS.SOSP_LOCK
      );
    }, CONFIG.PRIORITATS.CRITIC);
  }

  scheduleJitter() {
    this.jitter.scheduleWorkers();
  }

  async startHandshake() {
    await this.enqueueTask('Handshake', async () => {
      await this.handshake.startSync();
    }, CONFIG.PRIORITATS.BAIXA);
  }
}

// ============================================
// 🔒 WORKER MUTEX (Llei 15)
// ============================================
class WorkerMutex {
  constructor() {
    this.mutex = false;
    this.queue = [];
  }

  async acquire(workerName) {
    return new Promise((resolve) => {
      if (!this.mutex) {
        this.mutex = true;
        console.log(`🔒 ${workerName} ha adquirit el mutex.`);
        resolve();
      } else {
        this.queue.push({ workerName, resolve });
        console.log(`⏳ ${workerName} en cua.`);
      }
    });
  }

  release() {
    this.mutex = false;
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      console.log(`🔓 Alliberant mutex per ${next.workerName}.`);
      next.resolve();
      this.mutex = true;
    }
  }
}

// ============================================
// 🛑 PROTOCOL QUIESCE (Llei 8)
// ============================================
class QuiesceManager {
  async quiesce() {
    console.log("⏸️ Iniciant Protocol Quiesce...");
    const tempData = await this.exportToTemp();
    await OPFS.writeFile('/quiesce.tmp', tempData);
    WebRTC.pauseDeltas();
    await OPFS.writeFile('/consolidated.opfs', tempData);
    await OPFS.deleteFile('/quiesce.tmp');
    WebRTC.resumeDeltas();
    console.log("✅ Quiesce epoch completat.");
  }

  async exportToTemp() {
    return {
      crdt: Y.js.toJSON(),
      storage: await IndexedDB.exportAll(),
      timestamp: Date.now()
    };
  }
}

// ============================================
// 📱 KEEPALIVE IOS 15 (Llei 9)
// ============================================
class IOS15Keepalive {
  init() {
    if (navigator.storage?.persist) {
      navigator.storage.persist().catch(err => {
        console.error("⚠️ No s'ha pogut persistir l'emmagatzematge:", err);
      });
    }
    this.schedulePing();
  }

  schedulePing() {
    setInterval(async () => {
      try {
        await IndexedDB.open('SocDePobleDB');
        console.log("🔄 Ping Keepalive executat.");
      } catch (err) {
        console.error("❌ Ping Keepalive fallit:", err);
      }
    }, CONFIG.TIMEOUTS.KEEPALIVE);
  }

  async ping() {
    await IndexedDB.open('SocDePobleDB');
  }
}

// ============================================
// ⏳ JITTER MANAGER (Llei 2)
// ============================================
class JitterManager {
  scheduleWorkers() {
    const workers = [
      { nom: 'Autopoiesi', delay: this.getRandomDelay(0, 10) },
      { nom: 'Verema', delay: this.getRandomDelay(5, 15) },
      { nom: 'Sincronització', delay: this.getRandomDelay(10, 20) }
    ];
    workers.forEach(worker => {
      setTimeout(() => {
        console.log(`⏰ Worker "${worker.nom}" iniciat amb jitter de ${worker.delay} minuts.`);
      }, worker.delay * 60 * 1000);
    });
  }
  getRandomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

// ============================================
// ⏱️ TIMEOUT MANAGER (Llei 11)
// ============================================
class TimeoutManager {
  withTimeout(promise, timeoutMs) {
    return Promise.race([
      promise,
      new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error(`⏳ Timeout de ${timeoutMs}ms superat.`));
        }, timeoutMs);
      })
    ]);
  }
}

// ============================================
// 🌱 AUTOPOIESI MANAGER (Lleis 6, 12, 13)
// ============================================
class AutopoiesiManager {
  constructor() {
    this.depth = 0;
    this.podaPropostes = 0;
  }

  async run() {
    if (this.depth >= CONFIG.LIMITS.MAX_DEPTH_AUTOPOIESI) {
      console.warn("⚠️ Limit de recursivitat Autopoiesi assolit.");
      return;
    }
    
    this.depth++;
    console.log("🌱 Autopoiesi: Executant poda semàntica.");
    
    if (this.podaPropostes >= CONFIG.LIMITS.MAX_PODA_PROPOSTES) {
      console.warn("⚠️ Limit de propostes de poda assolit.");
      return;
    }
    
    this.podaPropostes++;
    if (this.getRAMUsage() > CONFIG.LIMITS.MAX_RAM_MB) {
      await this.gcOportunista();
    }
    this.depth--;
  }

  getRAMUsage() {
    return Math.floor(Math.random() * 500);
  }

  async gcOportunista() {
    console.log("🧹 GC Oportunista: Netejant tombstones CRDT.");
  }
}

// ============================================
// 🤝 HANDSHAKE STATE MACHINE (Llei 5)
// ============================================
class HandshakeStateMachine {
  constructor() {
    this.state = 'PENDENT';
    this.ui = document.getElementById('qr-status') || { textContent: '', className: '' };
  }

  async startSync() {
    this.updateUI('SINCRONITZANT');
    try {
      await this.syncWithPeer();
      this.updateUI('CONSOLIDAT');
    } catch (err) {
      this.updateUI('ERROR');
      console.error("❌ Sincronització fallida:", err);
    }
  }

  updateUI(state) {
    this.state = state;
    this.ui.textContent = state;
    this.ui.className = `status ${state.toLowerCase()}`;
    console.log(`🔄 Handshake: ${state}`);
  }

  async syncWithPeer() {
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

const governor = new AsyncGovernor();


// Enllaç orgànic per netejar el graf: [[00_index_escriptori]]
