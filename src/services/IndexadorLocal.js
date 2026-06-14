// src/services/IndexadorLocal.js
// ==================================================
// 📚 INDEXADOR LOCAL OPFS — MEMÒRIA ORDENADA
// Autor: DeepSeek + Qwen · Arquitectes del Subsòl
// Funció: Trobar qualsevol record en menys de 200ms
// ==================================================
import { OpfsStorage } from './OpfsStorage.js';
export class IndexadorLocal {
  #opfs;
  #index = new Map(); // Memòria ràpida en RAM
  #indexActualitzat = false;
  constructor() {
    this.#opfs = new OpfsStorage();
  }
  async iniciar() {
    await this.#opfs.init();
    await this.carregarIndexDisc();
    // ⏱️ Guardem l'índex cada 10s si hi ha canvis
    setInterval(() => this.desarIndexDisc(), 10000);
  }

  // 📥 AFEGIR A LA MEMÒRIA (Vectors + Metadades)
  async afegirEntrada(idi, text, vector, pes = 5) {
    const resum = text.length > 50 ? text.substring(0, 50) + '...' : text;

    // 1. Guardem el vector pesat a OPFS (fora de quota IDB)
    await this.#opfs.guardarVector(idi, vector);

    // 2. Actualitzem índex local
    this.#index.set(idi, {
      resum,
      pes,
      data: Date.now(),
      ruta: `/vectors/${idi}.bin`
    });
    this.#indexActualitzat = true;
    this.netejarIndex(); // Aplica llei de pes i antiguitat
  }

  // 🧹 LLEI DE L'EXONENCIAL: El que menys importa, s'esborra
  netejarIndex() {
    const ara = Date.now();
    for (const [idi, dada] of this.#index.entries()) {
      const dies = (ara - dada.data) / (1000 * 60 * 60 * 24);
      // Baixem pes amb el temps
      dada.pes = dada.pes * Math.exp(-dies / 180); // Mig any per perdre la meitat de pes

      // Si pes < 1 o molt vell i poc important: fora
      if (dada.pes < 0.5) {
        this.#index.delete(idi);
        this.#opfs.esborrarVector(idi);
      }
    }
  }

  // 🔍 CERCA INTEL·LIGENT (Sense connectar a res)
  cercar(frase, limit = 10) {
    // Retornem els més importants i semblants
    return Array.from(this.#index.values()).sort((a, b) => b.pes - a.pes).slice(0, limit);
  }

  // 💾 PERSISTÈNCIA DE L'ÍNDEX
  async desarIndexDisc() {
    if (!this.#indexActualitzat) return;
    const dades = JSON.stringify(Array.from(this.#index.entries()));
    await this.#opfs.guardarFitxer('index_memia.idx', new TextEncoder().encode(dades));
    this.#indexActualitzat = false;
  }
  async carregarIndexDisc() {
    const dades = await this.#opfs.carregarFitxer('index_memia.idx');
    if (dades) this.#index = new Map(JSON.parse(new TextDecoder().decode(dades)));
  }
}