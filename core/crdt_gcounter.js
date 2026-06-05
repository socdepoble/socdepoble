// core/crdt_gcounter.js
class GCounter {
    constructor(replicaId) {
        this.replicaId = replicaId;           // Ex: "telefon_javi_01"
        this.counter = {};                    // replicaId → valor
    }

    // Incrementar (cada telèfon suma el seu)
    incrementa(valor = 1) {
        if (!this.counter[this.replicaId]) this.counter[this.replicaId] = 0;
        this.counter[this.replicaId] += valor;
        this.guardaEnIndexedDB();
    }

    // Merge amb un altre G-Counter (quan es connecten)
    merge(altreCounter) {
        const claus = new Set([...Object.keys(this.counter), ...Object.keys(altreCounter)]);
        
        claus.forEach(key => {
            this.counter[key] = Math.max(
                this.counter[key] || 0,
                altreCounter[key] || 0
            );
        });
        
        this.guardaEnIndexedDB();
        return this.getValorTotal();
    }

    // Valor total visible
    getValorTotal() {
        return Object.values(this.counter).reduce((a, b) => a + b, 0);
    }

    // Persistència
    async guardaEnIndexedDB() {
        if(typeof window !== 'undefined' && window.iniciaIndexedDB) {
            const db = await window.iniciaIndexedDB();
            const tx = db.transaction('crdt_state', 'readwrite');
            tx.objectStore('crdt_state').put({ tipus: 'gcounter_event', data: this.counter });
        }
    }

    static async carrega() {
        // ... càrrega des d'IndexedDB
    }
}

if (typeof window !== 'undefined') {
    window.GCounter = GCounter;
}
