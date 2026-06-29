// Pseudocodi extret de l'auditoria de Qwen (Ronda 12) - Resposta 2
// Conservat per a la implementació de l'arquitectura de Sóc de Poble

/**
 * @file AsyncGovernor.js
 * @description Cervell centralitzat del Mas Virtual. Orquestra les 16 Lleis Asíncrones
 * garantint la supervivència termodinàmica de l'iPad A10 (Llei del Trellat).
 */

import { bancalMutex } from './BancalMutex.js';
import { QuiesceProtocol } from './QuiesceProtocol.js';
import { checkIOSSurvival } from '../ios/SurvivalCounter.js';
import { withTimeout } from '../security/TimeoutLock.js';

export const PRIORITAT = Object.freeze({
  CRITICA: 0, // Poda d'emergència, Keepalive iOS, SOSP-LOCK
  ALTA: 1,    // Verema CRDT (mensual), Swap Atòmic
  NORMAL: 2,  // Sincronització WebRTC, Autopoiesi
  BAIXA: 3    // GC Oportunista, Jitter de fons
});

export const ESTAT_GLB = Object.freeze({
  LLIURE: 'LLIURE',
  QUIESCE: 'QUIESCE', // Llei 8: Swap Atòmic actiu
  CAU: 'CAU'          // Llei 7: Mode supervivència (RAM > 500MB o bateria < 10%)
});

class AsyncGovernor {
  constructor() {
    this.cues = new Map([
      [PRIORITAT.CRITICA, []],
      [PRIORITAT.ALTA, []],
      [PRIORITAT.NORMAL, []],
      [PRIORITAT.BAIXA, []]
    ]);
    this.estat = ESTAT_GLB.LLIURE;
    this.motorEnMarxa = false;
    
    // Llei 6: Limitador de Recursivitat (Autopoiesi)
    this.profunditat = new Map(); 
    // Llei 12: Filtre Anti-Bombardeig (màx propostes per sessió)
    this.propostesSessio = 0; 
    this.LIMIT_PROPOSTES = 5;
    this.MAX_RECURSIVITAT = 3;
    
    // Llei 13: Llindar Termodinàmic
    this.LLINDAR_RAM_MB = 500;
    
    // Fallback per a navegadors que no suporten requestIdleCallback (iOS antic)
    this.requestIdle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
  }

  async arrencar() {
    if (navigator.storage?.persist) {
      const persistit = await navigator.storage.persist();
      console.log(`[GOVERNOR] Persistència nativa iOS: ${persistit ? 'Blindada' : 'Denegada'}`);
    }
    await checkIOSSurvival(); 
    this._iniciarMotor();
  }

  validarMaquinari() {
    const ramEstimada = navigator.deviceMemory || 4; 
    if (ramEstimada < 2) {
      console.warn('[GOVERNOR] VETAT: Dispositiu amb <2GB RAM. WebNN prohibit.');
      return false;
    }
    return true;
  }

  aplicarJitter(baseMs) {
    const jitter = Math.floor(Math.random() * 300000); 
    return baseMs + jitter;
  }

  potRecorrer(tascaId, profunditatActual) {
    if (profunditatActual >= this.MAX_RECURSIVITAT) {
      console.warn(`[GOVERNOR] Recursivitat tallada a ${tascaId}. Màxim ${this.MAX_RECURSIVITAT}.`);
      return false;
    }
    return true;
  }

  potProposarPoda() {
    if (this.propostesSessio >= this.LIMIT_PROPOSTES) {
      console.warn('[GOVERNOR] Filtre Anti-Bombardeig: Sessió saturada de propostes.');
      return false;
    }
    this.propostesSessio++;
    return true;
  }

  async encuar(tasca, prioritat = PRIORITAT.NORMAL) {
    if (this.estat === ESTAT_GLB.QUIESCE && prioritat > PRIORITAT.CRITICA) {
      console.log(`[GOVERNOR] Tasca ${tasca.nom} rebutjada: Estem en QUIESCE.`);
      return;
    }
    
    if (this.estat === ESTAT_GLB.CAU && prioritat > PRIORITAT.CRITICA) {
      console.log(`[GOVERNOR] Tasca ${tasca.nom} descartada: Mode Mas Cau actiu.`);
      return;
    }

    this.cues.get(prioritat).push(tasca);
    if (!this.motorEnMarxa) this._iniciarMotor();
  }

  async processarLot(eventArray, funcioExecucio) {
    const MIDA_LOT = 50;
    for (let i = 0; i < eventArray.length; i += MIDA_LOT) {
      const lot = eventArray.slice(i, i + MIDA_LOT);
      await funcioExecucio(lot);
      await new Promise(resolve => setTimeout(resolve, 0)); 
    }
  }

  async avaluarEstatCritic(usMemoriaMB, diesSenseObrir) {
    if (diesSenseObrir >= 20 || usMemoriaMB > this.LLINDAR_RAM_MB) {
      console.warn('[GOVERNOR] CRÍTIC: Activant Mode Mas Cau i Poda Autònoma.');
      this.estat = ESTAT_GLB.CAU;
      await this.encuar({
        nom: 'PODA_EMERGENCIA_AUTONOMA',
        executar: async () => { /* Lògica de poda forçada */ }
      }, PRIORITAT.CRITICA);
    }
  }

  async _iniciarMotor() {
    if (this.motorEnMarxa) return;
    this.motorEnMarxa = true;

    const processarCua = async (deadline) => {
      for (const [prio, cua] of this.cues.entries()) {
        if (cua.length > 0 && (deadline.timeRemaining() > 0 || deadline.didTimeout)) {
          const tasca = cua.shift();
          
          if (tasca.recurs) {
            await bancalMutex.acquire(tasca.recurs);
          }

          try {
            const tempsExecucio = tasca.prioritat === PRIORITAT.CRITICA ? 10000 : 30000;
            await withTimeout(tasca.executar(), tempsExecucio, `Timeout a ${tasca.nom}`);
          } catch (err) {
            console.error(`[GOVERNOR] Error a ${tasca.nom}:`, err);
          } finally {
            if (tasca.recurs) bancalMutex.release(tasca.recurs);
          }
          break; 
        }
      }

      const teFeina = Array.from(this.cues.values()).some(cua => cua.length > 0);
      if (teFeina) {
        this.requestIdle(processarCua, { timeout: 1000 });
      } else {
        this.motorEnMarxa = false;
      }
    };

    this.requestIdle(processarCua, { timeout: 1000 });
  }
}

export const governor = new AsyncGovernor();


// Enllaç orgànic per netejar el graf: [[00_index_escriptori]]
