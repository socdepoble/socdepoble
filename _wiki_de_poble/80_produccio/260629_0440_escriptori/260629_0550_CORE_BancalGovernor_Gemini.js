// Pseudocodi extret de l'auditoria de Gemini (Ronda 12)
// Conservat per a la implementació de l'arquitectura de Sóc de Poble

/**
 * 🚜 SÓC DE POBLE: BancalGovernor.js (El Cervell Asíncron del Mas)
 * Orquestrador Termodinàmic Centralitzat per a l'arquitectura Pedra Seca.
 * Unifica Mutex Global, Timeouts, Quiesce, Jitter, UI States i l'Escut d'iOS.
 * @version V25.Final (Ronda 11)
 */

import { set } from 'idb-keyval';
// import * as Y from 'yjs'; // Per al Snapshot Lock i encodeStateAsUpdate

export const PRIORITAT = {
  CRITICA: 0,      // SOSP-LOCK, UI Events, Recuperació d'errors (Passen primer)
  XARXA: 1,        // Sincronització WebRTC (Sèquia Mare), Handshake QR
  VEREMA: 2,       // Compactació CRDT mensual i Swap Atòmic
  FONS: 3          // Autopoiesi, Poda Semàntica (Es pot vetar si falta RAM)
};

class AsyncBancalGovernor {
  constructor() {
    this.cuaTasques = [];
    this.processant = false;
    this.sospLockActiu = false; // Bloqueig absolut (Mas Cau)
    this.hardwareVeto = false;  // Actiu si RAM < 2GB
    this.quiesceActiu = false;  // Actiu durant la Verema (Pausa xarxa)
    this.propostesAutopoiesi = 0;
    this.MAX_AUTOPOIESI_SESSIO = 3;
    this.webrtcProvider = null; // Referència a la Sèquia Mare
  }

  // ======================================================================
  // 1. INICIALITZACIÓ I ESCUT D'AMNÈSIA (Lleis 3, 9 i 10)
  // ======================================================================
  async arrancarMotor(webrtcProviderContext) {
    console.log("🚜 [GOVERNOR] Donant contacte al Mestre d'Aigües...");
    this.webrtcProvider = webrtcProviderContext;

    // Llei 3: Bloqueig Físic Edge AI (Vetar ofec en A10)
    const ram = navigator.deviceMemory || 2;
    if (ram < 2) {
      console.warn("⚠️ [GOVERNOR] Dispositiu humil (RAM < 2GB). Mode Bancal Extrem. WebNN vetat.");
      this.hardwareVeto = true;
      document.documentElement.classList.add('low-ram-mode'); // Condiciona CSS
    }

    await this._blindarContraLlopApple();
  }

  async _blindarContraLlopApple() {
    // Llei 10: Persistència Nativa Frontal (Sense demanar perdó)
    if (navigator.storage && navigator.storage.persist) {
      const concedit = await navigator.storage.persist().catch(() => false);
      console.log(`🛡️ [AMNÈSIA] Storage Safari: ${concedit ? 'BLINDAT' : 'DENEGAT (Ull viu)'}`);
    }

    // Llei 9: Keepalive silenciós (Reinicia els 30 dies d'Apple)
    const batecar = () => {
      this.encuarTasca('Ping_Keepalive', PRIORITAT.FONS, async () => {
        await set('sosp_batec_idb', Date.now());
        console.log("💓 [KEEPALIVE] Batec registrat. El Llop d'Apple torna a dormir.");
      });
    };

    batecar(); // Batec inicial
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') batecar();
    });
  }

  // ======================================================================
  // 2. MÀQUINA D'ESTATS UI I MAS-CAU (Lleis 5, 7 i 11)
  // ======================================================================
  _canviarEstatUI(nouEstat) {
    // Llei 5: Avisador Efímer per a la Iaia
    window.dispatchEvent(new CustomEvent('sdp-estat-xarxa', { detail: { estat: nouEstat } }));
  }

  activarMasCau(motiu) {
    if (this.sospLockActiu) return;
    this.sospLockActiu = true;
    console.error(`🚨 [SOSP-LOCK] MAS CAU ACTIVAT. Aturant sistema: ${motiu}`);
    document.documentElement.classList.add('mas-cau-mode');
    
    this.cuaTasques = []; // Purga de la cua
    this._canviarEstatUI('ERROR CRÍTIC: MAS CAU');
    
    // Tallem l'aigua de la Sèquia Mare per aïllar el pacient
    if (this.webrtcProvider) this.webrtcProvider.disconnect();
  }

  /** Llei 11: Timeouts Anti-Deadlock (La Guillotina) */
  async promesaAmbTrellat(promesaOriginal, msLimit = 15000, nomAccio = "Tasca") {
    let timeoutId;
    const cursaTemps = new Promise((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error(`[DEADLOCK] '${nomAccio}' ofegada als ${msLimit}ms.`)), msLimit);
    });
    
    try {
      // La primera promesa que acabe guanya (Resolució o Timeout)
      return await Promise.race([promesaOriginal, cursaTemps]);
    } finally {
      clearTimeout(timeoutId); // Alliberem el temporitzador
    }
  }

  // ======================================================================
  // 3. MOTOR DE CUES I JITTER (Lleis 2 i 12)
  // ======================================================================
  encuarTasca(nom, prioritat, funcioAsincrona, maxJitterMs = 0) {
    if (this.sospLockActiu) {
      return console.warn(`🛑 [GOVERNOR] SOSP-LOCK actiu. Tasca '${nom}' denegada.`);
    }

    // Llei 12: Filtre Anti-Bombardeig d'Autopoiesi
    if (nom.includes('Autopoiesi')) {
      if (this.hardwareVeto) {
        return console.log(`🚫 [VETO] Autopoiesi vetada per falta de RAM en iPad A10.`);
      }
      if (this.propostesAutopoiesi >= this.MAX_AUTOPOIESI_SESSIO) {
        return console.log(`🛑 [AUTOPOIESI] Límit assolit per sessió. El bancal descansa.`);
      }
      this.propostesAutopoiesi++;
    }

    // Llei 2: Jitter de Thundering Herd (0 a X ms de retard abans d'encuar)
    const retardMs = maxJitterMs > 0 ? Math.floor(Math.random() * maxJitterMs) : 0;
    
    if (retardMs > 0) {
      console.log(`⏳ [JITTER] '${nom}' escalonada en +${Math.round(retardMs/1000)}s`);
    }

    setTimeout(() => {
      this.cuaTasques.push({ nom, prioritat, executar: funcioAsincrona });
      // Ordenem la cua per prioritat (0 = Màxima urgència)
      this.cuaTasques.sort((a, b) => a.prioritat - b.prioritat);
      this._processarCua();
    }, retardMs);
  }

  // ======================================================================
  // 4. MUTEX GLOBAL I PROCESSAMENT (Llei 15)
  // ======================================================================
  async _processarCua() {
    if (this.processant || this.cuaTasques.length === 0) return;
    this.processant = true;
    this._canviarEstatUI('SINCRONITZANT');

    const executarTasques = async () => {
      while (this.cuaTasques.length > 0) {
        if (this.sospLockActiu) break;
        if (this.quiesceActiu) {
          console.log("🍷 [GOVERNOR] Verema en curs (Quiesce). Cua pausada.");
          break; // Sortim del bucle. S'auto-reprendrà en acabar el Quiesce.
        }

        const tasca = this.cuaTasques.shift();
        console.log(`⚙️ [GOVERNOR] Processant: ${tasca.nom}`);

        try {
          // Llei 11: Màxim 30 segons absoluts per a qualsevol Worker
          await this.promesaAmbTrellat(tasca.executar(), 30000, tasca.nom);
        } catch (error) {
          console.error(`🔥 [FATAL] Fallada a ${tasca.nom}:`, error.message);
          if (tasca.prioritat === PRIORITAT.CRITICA) this.activarMasCau(error.message);
        }

        // Llei 4 (Implícita): Regulador de Cabal. Respiració del Main Thread.
        // Deixem 50ms lliures entre tasques perquè l'iPad A10 pinte la UI a 60FPS.
        await new Promise(res => setTimeout(res, 50));
      }
    };

    // Llei 15: Mutex Global (Evita que diverses pestanyes sumen RAM). Safari 15.4+
    if (navigator.locks) {
      await navigator.locks.request('bancal_mutex_global', { mode: 'exclusive' }, executarTasques);
    } else {
      await executarTasques(); // Fallback per dispositius molt antics
    }

    this.processant = false;
    if (this.cuaTasques.length === 0 && !this.sospLockActiu) {
      this._canviarEstatUI('CONSOLIDAT');
    }
  }

  // ======================================================================
  // 5. PROTOCOL QUIESCE I SWAP ATÒMIC (Lleis 1 i 8)
  // ======================================================================
  async executarVeremaQuiesce(docYjs, nomFitxerFinal) {
    // S'encua amb Jitter d'1 minut per a no congelar només obrir l'App
    this.encuarTasca(`Verema_Quiesce_${nomFitxerFinal}`, PRIORITAT.VEREMA, async () => {
      this.quiesceActiu = true;
      console.log("🛑 [QUIESCE] Aturant Sèquia Mare per Consolidació Atòmica...");
      
      // Llei 1: Snapshot Lock (Aturem trànsit WebRTC P2P)
      if (this.webrtcProvider) this.webrtcProvider.disconnect();

      try {
        const estatPur = Y.encodeStateAsUpdate(docYjs);
        const opfsRoot = await navigator.storage.getDirectory();
        
        // 1. Escriptura a les fosques (fitxer .tmp)
        const fitxerTmp = await opfsRoot.getFileHandle(`${nomFitxerFinal}.tmp`, { create: true });
        const writableTmp = await fitxerTmp.createWritable();
        await writableTmp.write(estatPur);
        await writableTmp.close();

        // 2. Swap Atòmic (Reemplaçament robust a l'OPFS)
        const fitxerDefinitiu = await opfsRoot.getFileHandle(nomFitxerFinal, { create: true });
        const writableDef = await fitxerDefinitiu.createWritable();
        const tempBlob = await fitxerTmp.getFile();
        await writableDef.write(await tempBlob.arrayBuffer());
        await writableDef.close();
        
        // 3. Purgar cadàver temporal
        await opfsRoot.removeEntry(`${nomFitxerFinal}.tmp`);
        console.log(`✅ [QUIESCE] Pedra Seca consolidada: ${nomFitxerFinal}`);

      } catch (error) {
        console.error("🔥 [FATAL] Error al Swap Atòmic. L'Arxiu original està intacte.", error);
        throw error; // La guillotina del try-catch superior ho rematarà
      } finally {
        console.log("🌊 [QUIESCE] Relleu donat. Reconnectant WebRTC...");
        if (this.webrtcProvider) this.webrtcProvider.connect();
        
        this.quiesceActiu = false;
        this._processarCua(); // Disparem la cua que havia quedat bloquejada
      }
    }, 60000); 
  }
}

export const BancalGovernor = new AsyncBancalGovernor();


// Enllaç orgànic per netejar el graf: [[00_index_escriptori]]
