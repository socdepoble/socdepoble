// _scripts/delta-vector-crdt.js
// Delta State Replication per Vector Clocks (envia només canvis)

class DeltaVectorClock {
  constructor(replicaId) {
    this.replicaId = replicaId || `delta-${Math.random().toString(36).slice(2)}`;
    this.clock = { [this.replicaId]: 0 };
    this.lastSent = {}; // Per calcular deltas
  }

  increment() {
    this.clock[this.replicaId] = (this.clock[this.replicaId] || 0) + 1;
    return this;
  }

  // Genera delta (només increments des de l'últim enviament)
  getDelta() {
    const delta = {};
    for (const [id, ts] of Object.entries(this.clock)) {
      if (!this.lastSent[id] || ts > this.lastSent[id]) {
        delta[id] = ts;
      }
    }
    this.lastSent = { ...this.clock };
    return delta;
  }

  mergeDelta(delta) {
    for (const [id, ts] of Object.entries(delta)) {
      this.clock[id] = Math.max(this.clock[id] || 0, ts);
    }
    return this;
  }

  compare(otherClock) {
    // mateixa lògica que abans
    let thisD = true, otherD = true;
    const ids = new Set([...Object.keys(this.clock), ...Object.keys(otherClock)]);
    for (const id of ids) {
      const t1 = this.clock[id] || 0;
      const t2 = otherClock[id] || 0;
      if (t1 < t2) thisD = false;
      if (t2 < t1) otherD = false;
    }
    return thisD && otherD ? 0 : (thisD ? 1 : -1);
  }
}

export { DeltaVectorClock };
