// src/core/utils/eventBus.js
// El "Tauler d'Anuncis" del Mas (Native EventTarget Pub-Sub)
// Creat pel Consell de les Petorretes (Qwen) per a trencar cicles completament.

class TaulerDAnuncis extends EventTarget {}
export const taulerDAnuncis = new TaulerDAnuncis();
export const emetre = (nom, dades) => {
  taulerDAnuncis.dispatchEvent(new CustomEvent(nom, {
    detail: dades
  }));
};
export const escoltar = (nom, callback) => {
  taulerDAnuncis.addEventListener(nom, e => callback(e.detail));
};