/**
 * ---
 * doc_id: SDP-CORE-GOV-001
 * doc_type: "CORE_ARCHITECTURE_CODE"
 * authoring_agent: "Dola i l'Eixam Sencer (Antigravity / Gemini)"
 * version_semver: 1.0.0
 * owner: Consell de la Petorreta
 * domain: global
 * subdomain: architecture
 * locale: ca-valencia
 * objective: Governor únic d'Asincronia que orquestra les 16 lleis de la Pedra Seca.
 * scope: Producció (src/core/)
 * hash_sha256: PENDENT_DE_COMPILACIO_FINAL
 * skills_vinculades: 
 *   - sagramental_dels_morts/SKILL
 *   - autopoiesi_termodinamica/SKILL
 *   - backup_recovery/SKILL
 *   - consola_termodinamica/SKILL
 *   - error_boundaries/SKILL
 * ---
 */

/**
 * 🧠 AsyncGovernor - Governador Únic d'Asincronia del Mas
 * Orquestra TOTS els mecanismes de la Ronda 11. SINGLETON.
 * Evita col·lisions de RAM, Jetsam iOS, deadlocks i corrupcions.
 * Compatible iOS 15+, OPFS, Y.js, idb-keyval, Web Workers.
 * @author Consell de les 11 Petorretes
 * @version V25 Ronda 11
 */
import { get, set, del } from 'idb-keyval';
import * as Y from 'yjs';

const LOCK_NAME = 'sdp:mas:async:mutex';
const MAX_RAM_PESAT = 100 * 1024 * 1024;   // >100MB = procés pesat
const LIMI_RAM_JETSAM  = 1.2 * 1024 * 1024 * 1024; // 1,2GB límit dur A10
const LIMI_GC = 400 * 1024 * 1024;           // >400MB → neteja tombstones
const TIMEOUT_CRITIC = 10_000;                // 10s Vibe
const PROFUNDITAT_MAX = 3;                    // Kimi
const JITTER_MAX_MIN = 15;                    // Copilot/Dola
const KEEPALIVE_DIAS = 7;                     // Perplexity, renova abans 30

class AsyncGovernor {
  static #instancia = null;

  constructor() {
    if (AsyncGovernor.#instancia) return AsyncGovernor.#instancia;
    AsyncGovernor.#instancia = this;

    this.estat = {
      actiu: null,
      cua: [],
      ocupat: false,
      uiBloquejada: false,
      quiesceActiu: false,
      masCau: false
    };

    this.prioritats = Object.freeze({
      SOSP:1, QUIESCE:2, KEEPALIVE:3, SEQUIA:4, VEREMA:5,
      AUTOPOIESI:6, GC:7, JITTER:8, CRIPTO:9, HANDSHAKE:10
    });

    this.#iniciarGarantiesBasiques();
    this.#buidarCuaEnSilici();
  }

  // ──────────────────────────────────────────────────────────
  // 🛡️ 0. GARANTIES QUE S'EXECUTEN A L'INSTANT (Vibe / Perplexity)
  // ──────────────────────────────────────────────────────────
  async #iniciarGarantiesBasiques() {
    // 🔹 Llei 10: Persistència forçada iOS
    if (navigator.storage?.persist) await navigator.storage.persist();
    // 🔹 Llei 9: Keepalive anti amnèsia 30 dies
    this.encuar('keepalive', this.prioritats.KEEPALIVE, 5_000_000, () => this.#keepaliveAmnesia());
    // 🔹 Llei 3: Bloqueig WebNN si <2GB
    const ram = await this.#ramDisponible();
    if (ram.total < 2 * 1024 ** 3) window.WEBNN_VETAT = true;
    // 🔹 Llei 11: Timeout universal
    window.PromiseAmbTempsLimit = this.#ambTimeout;
    // 🔹 Escolta events visibilitat
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') this.encuar('keepalive', this.prioritats.KEEPALIVE, 1_000_000, () => this.#keepaliveAmnesia());
    });
  }

  // ──────────────────────────────────────────────────────────
  // 🚦 1. MUTEX GLOBAL + CUA ORDENADA (Gemini / Bancal Budget)
  // ──────────────────────────────────────────────────────────
  async encuar(nom, prioritat, pesRam, fn, opts = {}) {
    const tasca = { id: crypto.randomUUID(), nom, prioritat, pesRam, fn, opts, ts: Date.now() };

    // 🛑 SOSP-LOCK: si ja estem en mode casa crema, només acceptem més SOSP
    if (this.estat.masCau && prioritat !== 1) return { ocupat:true, rao:'mas-cau' };

    // 📊 Bancal Budget: comprovem recursos abans ni d'encuar
    const pressupost = await this.#avaluarRecursos(tasca);
    if (!pressupost.ok) return { denegat:true, ...pressupost };

    // ➕ Afegim i reordenem per prioritat, després data
    this.estat.cua.push(tasca);
    this.estat.cua.sort((a,b) => a.prioritat - b.prioritat || a.ts - b.ts);

    this.#canviarEstatUI('PENDENT', tasca);
    if (!this.estat.ocupat) queueMicrotask(() => this.#buidarCuaEnSilici());
    return { encuat:true, id:tasca.id };
  }

  async #buidarCuaEnSilici() {
    if (this.estat.ocupat || this.estat.cua.length === 0) return;
    this.estat.ocupat = true;

    // Agafem el més prioritari
    const tasca = this.estat.cua.shift();
    this.estat.actiu = tasca;

    // 🚫 MUTEX EXCLUSIU: si és pesat o marcat com a incompatible, prenem el lock del sistema
    const usaLockSistema = tasca.pesRam > MAX_RAM_PESAT || tasca.opts.bloquejaUI;

    try {
      await (usaLockSistema
        ? navigator.locks.request(LOCK_NAME, { ifAvailable:true }, async lock => {
            if (!lock) throw new Error('MUTEX OCUPAT');
            return this.#executarTasca(tasca);
          })
        : this.#executarTasca(tasca));

    } catch (err) {
      console.error(`[Governor] ${tasca.nom} falla:`, err);
      this.#canviarEstatUI('ERROR', tasca, err.message);
    } finally {
      this.estat.actiu = null;
      this.estat.ocupat = false;
      this.estat.uiBloquejada = false;
      document.documentElement.classList.remove('mas-ui-bloquejada');
      // Següent torn
      setTimeout(() => this.#buidarCuaEnSilici(), 12); // 12ms = respir fil principal
    }
  }

  async #executarTasca(tasca) {
    const { nom, fn, opts } = tasca;

    if (opts.bloquejaUI) {
      this.estat.uiBloquejada = true;
      document.documentElement.classList.add('mas-ui-bloquejada');
    }

    if (nom.startsWith('quiesce')) {
      this.estat.quiesceActiu = true;
      window.__YJS_PROVIDER__?.pauseIncoming?.();
    }

    this.#canviarEstatUI('SINCRONITZANT', tasca);

    const resultat = await this.#ambTimeout(fn(), TIMEOUT_CRITIC, nom);

    if (await this.#ramYjs() > LIMI_GC) Y.gc(window.__YJS_DOC__);

    window.PROFUNDITAT_MAX = PROFUNDITAT_MAX;

    this.#canviarEstatUI('CONSOLIDAT', tasca);
    return resultat;
  }

  // ──────────────────────────────────────────────────────────
  // ⏳ 2. EINES CORE
  // ──────────────────────────────────────────────────────────
  #ambTimeout(promesa, ms, nom='') {
    return Promise.race([
      promesa,
      new Promise((_,rej) => setTimeout(() => rej(new Error(`⏳ TIMEOUT 10s: ${nom}`)), ms))
    ]);
  }

  async #avaluarRecursos(tasca) {
    const ram = await this.#ramDisponible();
    if (ram.lliure < tasca.pesRam + 150_000_000) return { ok:false, rao:'RAM_INSUFICIENT' };
    if (ram.lliure > LIMI_RAM_JETSAM) return { ok:false, rao:'PRE_JETSAM', accio:'GC_IMMEDIAT' };
    const bat = await navigator.getBattery?.() || { level:1, charging:true };
    if (bat.level < 0.2 && !bat.charging && tasca.prioritat > 3) return { ok:false, rao:'BAT_BAIXA' };
    return { ok:true };
  }

  async #ramDisponible() {
    const mem = performance.memory || {};
    const estimat = mem.jsHeapSizeLimit || (navigator.userAgent.includes('iPad') ? 2e9 : 4e9);
    return { total: estimat, lliure: Math.max(0, estimat - (mem.usedJSHeapSize||0)) };
  }

  #ramYjs() {
    return window.__YJS_DOC__ ? window.__YJS_DOC__.store.getState().length : 0;
  }

  // ──────────────────────────────────────────────────────────
  // 🩺 3. LLEIS ESPECIALITZADES DINS EL GOVERNADOR
  // ──────────────────────────────────────────────────────────
  async #keepaliveAmnesia() { 
    const clau = 'ping_antiamnesia';
    const ara = Date.now();
    const darrer = await get(clau) || 0;
    if (ara - darrer < KEEPALIVE_DIAS * 86400_000) return;
    await set(clau, ara);
    const root = await navigator.storage.getDirectory();
    const fh = await root.getFileHandle('.keepalive', { create:true });
    const w = await fh.createSyncAccessHandle();
    w.write(new TextEncoder().encode(String(ara)), { at:0 });
    w.flush(); w.close();
  }

  jitter(baseMinuts = 60) {
    return (baseMinuts + Math.random() * JITTER_MAX_MIN) * 60_000;
  }

  separarEnLots(events, MAX=50, MAX_B=200*1024) {
    const lots=[], bl = new Blob;
    let i=0;
    while(i<events.length){
      const lot=[]; let b=0;
      while(i<events.length && lot.length<MAX && b<MAX_B){
        const e=events[i++]; lot.push(e);
        b += new Blob([JSON.stringify(e)]).size;
      }
      lots.push(lot);
    }
    return lots;
  }

  async sospLock(actiu, motiu='') {
    if (actiu) {
      this.estat.masCau = true;
      this.estat.cua = this.estat.cua.filter(t => t.prioritat === 1);
      document.documentElement.classList.add('mas-cau-mode');
      window.__YJS_PROVIDER__?.disconnect?.();
      await set('SOSP_LOCK', { actiu:true, motiu, ts:Date.now() });
    } else {
      this.estat.masCau = false;
      document.documentElement.classList.remove('mas-cau-mode');
      await del('SOSP_LOCK');
    }
  }

  // ──────────────────────────────────────────────────────────
  // 📡 4. SUBSCRIPCIONS UI (zero acoblament)
  // ──────────────────────────────────────────────────────────
  #canviarEstatUI(estat, tasca, info='') {
    window.dispatchEvent(new CustomEvent('mas:async', {
      detail: { estat, tasca, info, cua: [...this.estat.cua] }
    }));
  }
  on(fn){ window.addEventListener('mas:async', e => fn(e.detail)); }
}

export const asyncGov = Object.freeze(new AsyncGovernor());
export default asyncGov;


// Enllaç orgànic per netejar el graf: [[00_index_escriptori]]
