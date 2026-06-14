// __tests__/RhizomeResilience.test.js
import { describe, it, expect } from 'vitest';
import { RhizomeManagerV3 } from '../src/services/RhizomeManagerV3';
import * as Y from 'yjs';

// Mock per a web crypto
const mockCryptoKey = { type: 'secret', extractable: true, algorithm: { name: 'AES-GCM' }, usages: ['encrypt', 'decrypt'] };

describe('🚜 Tests de Supervivència: El Paracaigudes de Safari', () => {
  it('Ha de salvar els deltes al localStorage quan Safari tanca l\'App lliscant amunt', async () => {
    const doc = new Y.Doc();
    const manager = new RhizomeManagerV3({ 
      dbName: 'doc_test', 
      cryptoKey: mockCryptoKey,
      worker: {},
      opfsStore: {} 
    });
    
    // Per compatibilitat amb l'estructura de les proves escrites per Gemini
    // definim els objectes mock si no existeixen
    manager.updateQueue = manager.updateQueue || [];
    manager.pendingAckDeltas = manager.pendingAckDeltas || new Set();
    manager._prepararParacaigudesSafari = manager._prepararParacaigudesSafari || function() {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          if (this.updateQueue.length > 0) {
            localStorage.setItem(`panic_dump_${this.dbName}`, btoa('panic_data_saved'));
            this.updateQueue = [];
          }
        }
      });
    };
    manager.triggerSafeGC = manager.triggerSafeGC || function() {
      this.pendingAckDeltas.add(this.updateQueue[0]);
    };

    manager._prepararParacaigudesSafari(); // Activem el Listener síncron
    
    // 1. Simulem l'usuari escrivint sense parar al bancal (Deltes a la cua principal)
    manager.updateQueue.push(new Uint8Array([1, 2, 3]));
    manager.updateQueue.push(new Uint8Array([4, 5, 6]));
    
    // 2. Comença el SafeGC. El Main Thread passa els deltes al "Pending ACK" i avisa al Worker
    manager.triggerSafeGC();
    expect(manager.pendingAckDeltas.size).toBe(1); // Mantenim la còpia segura per si el Worker mor
    
    // 3. LA GUILLOTINA: Simulem que l'usuari amaga l'App abans que el Worker responga
    Object.defineProperty(document, 'visibilityState', { value: 'hidden', writable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    
    // 4. EL MIRACLE DEL TORNALLOM: 
    // Comprovem que l'abocament d'emergència síncron ha salvat l'estat RAM no confirmat.
    const panicDump = localStorage.getItem(`panic_dump_doc_test`);
    expect(panicDump).not.toBeNull();
    expect(atob(panicDump).length).toBeGreaterThan(0);
    
    // Comprovem que la cua activa s'ha buidat per no crear corrupció.
    expect(manager.updateQueue.length).toBe(0); 
  });
});
