// core/crdt_or_set.js
class ORSet {
    constructor(replicaId) {
        this.replicaId = replicaId;
        this.adds = new Map();    // elementId → Set<{ts, replica, data}>
        this.removes = new Map(); // elementId → Set<{ts, replica}>
    }

    add(elementId, contingut) {
        if (!this.adds.has(elementId)) this.adds.set(elementId, new Set());
        this.adds.get(elementId).add({
            timestamp: Date.now(),
            replica: this.replicaId,
            data: contingut
        });
    }

    remove(elementId) {
        if (!this.removes.has(elementId)) this.removes.set(elementId, new Set());
        this.removes.get(elementId).add({
            timestamp: Date.now(),
            replica: this.replicaId
        });
    }

    merge(remote) {
        // Fusionem Adds
        this._mergeMaps(this.adds, remote.adds);
        // Fusionem Removes
        this._mergeMaps(this.removes, remote.removes);
        
        return this.netejaElementsEliminats();
    }

    _mergeMaps(target, source) {
        if (!source) return;
        source.forEach((sourceSet, elementId) => {
            if (!target.has(elementId)) target.set(elementId, new Set());
            sourceSet.forEach(item => {
                // Evitem duplicats exactes
                const exists = Array.from(target.get(elementId)).some(t => t.timestamp === item.timestamp && t.replica === item.replica);
                if (!exists) target.get(elementId).add(item);
            });
        });
    }

    netejaElementsEliminats() {
        const vius = new Map();

        this.adds.forEach((addsSet, elementId) => {
            if (addsSet.size === 0) return;
            const latestAdd = this._getLatest(addsSet);
            const latestRemove = this.removes.has(elementId) && this.removes.get(elementId).size > 0 ? 
                                 this._getLatest(this.removes.get(elementId)) : null;

            // Resolució de conflicte matemàtica
            if (!latestRemove) {
                vius.set(elementId, latestAdd.data);
            } else if (latestAdd.timestamp > latestRemove.timestamp) {
                vius.set(elementId, latestAdd.data);
            } else if (latestAdd.timestamp === latestRemove.timestamp) {
                // Empat de temps → guanya replicaId més alt (ordre lexicogràfic)
                if (latestAdd.replica > latestRemove.replica) {
                    vius.set(elementId, latestAdd.data);
                }
            }
            // Si el remove és més recent, l'element es considera esborrat i no s'afig a 'vius'
        });

        return vius;
    }

    _getLatest(set) {
        let latest = null;
        set.forEach(item => {
            if (!latest || item.timestamp > latest.timestamp || 
               (item.timestamp === latest.timestamp && item.replica > latest.replica)) {
                latest = item;
            }
        });
        return latest;
    }
}

if (typeof window !== 'undefined') {
    window.ORSet = ORSet;
}
