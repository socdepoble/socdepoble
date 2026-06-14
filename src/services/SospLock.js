// src/services/SospLock.js
// 🧱 SOSP-LOCK: El pany segur. Només una operació crítica a la vegada.

export class SospLock {
  #bloquejat = false;
  #cua = [];
  async agafar() {
    if (this.#bloquejat) return new Promise(res => this.#cua.push(res));
    this.#bloquejat = true;
  }
  alliberar() {
    this.#bloquejat = false;
    const seguent = this.#cua.shift();
    if (seguent) seguent();
  }
}