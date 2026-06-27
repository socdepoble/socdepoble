import { deflate, inflate } from "pako";

export function compressUpdate(update) {
  return deflate(update); // Comprime array de bytes Yjs
}

export function decompressUpdate(data) {
  return inflate(data); // Descomprime de vuelta a Yjs
}
