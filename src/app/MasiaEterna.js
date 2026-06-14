// src/app/MasiaEterna.js
// ==================================================
// 🎭 ORQUESTRADOR DE LA MASIA — EL COR DE TOT
// Autor: Gemini + Copilot · Mecànics de Precisió
// Funció: Connectar, vigilar i fer que tot vage fi
// ==================================================
import * as Y from 'yjs';
import { RhizomeManagerV3 } from '../services/rhizomeManagerV3.js';
import { IndexadorLocal } from '../services/IndexadorLocal.js';
import { SospLock } from '../services/SospLock.js';
export class MasiaEterna {
  #yDoc;
  #rhizome;
  #indexador;
  #estat = 'iniciant';
  #lock = new SospLock();
  constructor() {
    this.#yDoc = new Y.Doc();

    // Configura RhizomeManager amb el format de Kimi
    this.#rhizome = new RhizomeManagerV3({
      dbName: 'masia-rhizome-v3',
      cryptoKey: 'demo-key',
      // Açò s'hauria d'inicialitzar correctament
      worker: window.rhizomeWorker,
      // O inicialitzar el worker ací
      opfsStore: null,
      // S'ha d'instanciar l'OPFSStore
      onStateChange: () => {},
      onError: e => console.error(e)
    });
    this.#indexador = new IndexadorLocal();
    // No l'iniciem en el constructor per a evitar condicions de carrera,
    // ho fem manualment cridant iniciar()
  }
  async iniciar() {
    this.#estat = 'carregant';

    // ⚡ PARAL·LELITZEM: Carreguem dades i memòria a la vegada
    await Promise.all([this.#rhizome.init(), this.#indexador.iniciar()]);

    // 🧵 CONNECTEM ESDEVENIMENTS: Quan canvia alguna cosa, actualitzem memòria
    this.#yDoc.on('update', (delta, origen) => {
      if (origen === 'local') this.processarCanviLocal(delta);
    });
    this.#estat = 'llesta';
  }
  async processarCanviLocal(delta) {
    await this.#lock.agafar();
    try {
      // 1. Extraiem el contingut nou
      const textNou = this.#extreureTextDeDelta(delta);
      if (!textNou) return;

      // 2. Generem vector i guardem a memòria (Worker intern)
      requestIdleCallback(async () => {
        const vector = await this.#generarVectorLocal(textNou);
        await this.#indexador.afegirEntrada(`msg_${Date.now()}`, textNou, vector, this.calcularPes(textNou));
      });
    } finally {
      this.#lock.alliberar();
    }
  }
  #extreureTextDeDelta(delta) {
    // Implementació simplificada
    return "text de prova";
  }
  async #generarVectorLocal(textNou) {
    // Generació d'embeddings simulada
    return new Float32Array(384).fill(0.1);
  }
  calcularPes(text) {
    // 📏 Pes segons longitud, paraules clau i emoció (senzill i efectiu)
    let pes = 3; // Base
    if (text.length > 20) pes += 1;
    if (text.length > 100) pes += 2;
    if (/important|urgent|recorda|mai|sempre/.test(text)) pes += 3;
    return Math.min(pes, 10); // Màxim 10
  }

  // 📤 ACCÉS PÚBLIC PER A LA INTERFÍCIE
  getEstat() {
    return this.#estat;
  }
  getDocument() {
    return this.#yDoc;
  }
  cercarMemoria(frase) {
    return this.#indexador.cercar(frase);
  }
}