// core/crdt_engine.js
// L'algoritme CRDT definitiu de la Masía
class MasiaCRDT {
    constructor() {
        this.gCounters = new Map();
        this.lwwRegisters = new Map();
        this.orSet = new Map(); // id → {adds: [], removes: []}
        
        // Mantindre la compatibilitat amb el mur clàssic (LWW)
        this.mur = new Map();
    }

    mergeEstatRemot(remoteState) {
        // G-Counters
        if (remoteState.gCounters) {
            Object.keys(remoteState.gCounters).forEach(key => {
                if (!this.gCounters.has(key)) this.gCounters.set(key, {});
                this.mergeGCounter(this.gCounters.get(key), remoteState.gCounters[key]);
            });
        }

        // OR-Set per comentaris i llistes
        if (remoteState.orSet) {
            remoteState.orSet.forEach((remoteItem, id) => {
                if (!this.orSet.has(id)) this.orSet.set(id, {adds: [], removes: []});
                this.mergeORSet(this.orSet.get(id), remoteItem);
            });
        }
        
        // Merge clàssic (LWW)
        if (remoteState.mur) {
            remoteState.mur.forEach((remoteItem, id) => {
                const local = this.mur.get(id);
                if (!local || remoteItem.timestamp > local.timestamp) {
                    this.mur.set(id, remoteItem);
                    this.emetCanvi('mur', id);
                }
            });
        }
    }

    mergeGCounter(local, remote) {
        // Math.max de cada valor
        Object.keys(remote).forEach(k => {
            local[k] = Math.max(local[k] || 0, remote[k]);
        });
    }

    mergeORSet(local, remote) {
        // Unió de sets "adds" i "removes"
        remote.adds.forEach(add => {
            if (!local.adds.find(a => a.id === add.id)) local.adds.push(add);
        });
        remote.removes.forEach(rm => {
            if (!local.removes.find(r => r.id === rm.id)) local.removes.push(rm);
        });
    }

    actualitzaMur(id, nouContingut, autor) {
        const existent = this.mur.get(id) || { version: 0 };
        this.mur.set(id, {
            content: nouContingut,
            version: existent.version + 1,
            timestamp: Date.now(),
            autor: autor
        });
        this.emetCanvi('mur', id);
    }
    
    // Suport per paquets de Packet Resilience
    mergeFromRemote(cuaPendentArray) {
        if (!cuaPendentArray) return;
        cuaPendentArray.forEach(p => {
            if (p.tipus === 'mur') {
                this.actualitzaMur(p.payload.id, p.payload.content, p.payload.autor);
            }
        });
    }

    emetCanvi(store, id) {
        console.log(`[CRDT Engine] S'ha actualitzat ${store} amb id ${id}`);
    }
}

if (typeof window !== 'undefined') {
    window.masiaCRDT = new MasiaCRDT();
} else if (typeof module !== 'undefined') {
    module.exports = MasiaCRDT;
}
