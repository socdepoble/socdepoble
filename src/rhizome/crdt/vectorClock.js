/**
 * VectorClock per a l'ordre causal en EgWalker.
 * Cada operació i snapshot porta un vector clock que permet comparar
 * relacions d'antecedència/concurrència.
 */
export class VectorClock {
  constructor(entries = {}) {
    // entries: { nodeId: counter }
    this.entries = entries;
  }

  /**
   * Retorna un nou vector clock amb el comptador del node actual incrementat.
   */
  increment(nodeId) {
    const newEntries = { ...this.entries };
    newEntries[nodeId] = (newEntries[nodeId] || 0) + 1;
    return new VectorClock(newEntries);
  }

  /**
   * Compara dos vector clocks.
   * @returns -1 si this < other, 0 si iguals, 1 si this > other, null si concurrents
   */
  compare(other) {
    let less = false;
    let greater = false;
    const allNodes = new Set([
      ...Object.keys(this.entries),
      ...Object.keys(other.entries)
    ]);

    for (const node of allNodes) {
      const a = this.entries[node] || 0;
      const b = other.entries[node] || 0;
      if (a < b) less = true;
      if (a > b) greater = true;
      if (less && greater) return null; // concurrents
    }

    if (less) return -1;
    if (greater) return 1;
    return 0;
  }

  /**
   * Fusiona dos vector clocks (pren el màxim de cada node).
   */
  merge(other) {
    const merged = { ...this.entries };
    for (const [node, count] of Object.entries(other.entries)) {
      merged[node] = Math.max(merged[node] || 0, count);
    }
    return new VectorClock(merged);
  }

  /**
   * Serialització per emmagatzemar a la base de dades.
   */
  toJSON() {
    return this.entries;
  }

  /**
   * Desserialització des de la base de dades.
   */
  static fromJSON(obj) {
    return new VectorClock(obj || {});
  }
}
