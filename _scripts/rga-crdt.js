// _scripts/rga-crdt.js
// Replicated Growable Array (RGA) simplificat per CRDT (Sóc de Poble)

class RGANode {
  constructor(id, value, tombstone = false) {
    this.id = id;                    // Unique ID: replicaId + counter
    this.value = value;
    this.tombstone = tombstone;
    this.next = null;                // Per llista enllaçada lògica
  }
}

class RGACRDT {
  constructor(replicaId = `rga-${Math.random().toString(36).slice(2)}`) {
    this.replicaId = replicaId;
    this.counter = 0;
    this.nodes = new Map();          // id -> RGANode
    this.head = null;
  }

  generateId() {
    return `${this.replicaId}:${++this.counter}`;
  }

  insertAfter(prevId, value) {
    const newNode = new RGANode(this.generateId(), value);
    this.nodes.set(newNode.id, newNode);

    if (!prevId || !this.nodes.has(prevId)) {
      newNode.next = this.head;
      this.head = newNode.id;
    } else {
      const prev = this.nodes.get(prevId);
      newNode.next = prev.next;
      prev.next = newNode.id;
    }
    return newNode;
  }

  delete(id) {
    const node = this.nodes.get(id);
    if (node) node.tombstone = true;
  }

  toArray() {
    const result = [];
    let current = this.head;
    while (current) {
      const node = this.nodes.get(current);
      if (node && !node.tombstone) {
        result.push({id: node.id, value: node.value});
      }
      current = node ? node.next : null;
    }
    return result;
  }

  mergeRemote(remoteNodes) {
    // Simple merge: afegir nous i marcar tombstones
    for (const [id, remoteNode] of Object.entries(remoteNodes)) {
      if (!this.nodes.has(id)) {
        this.nodes.set(id, {...remoteNode});
      } else {
        const local = this.nodes.get(id);
        if (remoteNode.tombstone) local.tombstone = true;
      }
    }
    console.log('🔄 Merge RGA completat');
  }

  getStateForSync() {
    return Object.fromEntries(this.nodes);
  }
}

export { RGACRDT, RGANode };
