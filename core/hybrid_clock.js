// core/hybrid_clock.js
class HybridLogicalClock {
    constructor(replicaId) {
        this.replicaId = replicaId;
        this.logicalTime = 0;
        this.lastPhysicalTime = Date.now();
        this.maxDriftAllowed = 300000; // 5 minuts màxim de desfasament acceptat
        this.observedClocks = new Map(); // replicaId → última hora vista
    }

    getTimestamp() {
        let now = Date.now();
        
        // Protecció contra rellotge boig (futur)
        if (now > this.lastPhysicalTime + this.maxDriftAllowed) {
            console.warn(`⚠️ Rellotge del dispositiu massa avançat. Corregint...`);
            now = this.lastPhysicalTime + 1000; // Forcem un avanç lent
        }

        if (now > this.lastPhysicalTime) {
            this.logicalTime = Math.max(this.logicalTime, now);
        } else {
            this.logicalTime++;
        }

        this.lastPhysicalTime = now;

        return {
            physical: now,
            logical: this.logicalTime,
            replica: this.replicaId,
            version: this.logicalTime
        };
    }

    mergeRemote(remoteTs) {
        // Protecció contra timestamps del futur remots
        if (remoteTs.physical > Date.now() + this.maxDriftAllowed) {
            console.warn(`🚫 Timestamp del futur rebut de ${remoteTs.replica}. Ignorant.`);
            return;
        }

        this.logicalTime = Math.max(this.logicalTime, remoteTs.logical) + 1;
        this.lastPhysicalTime = Math.max(this.lastPhysicalTime, remoteTs.physical);

        // Registre de rellotges observats (per auditories)
        this.observedClocks.set(remoteTs.replica, remoteTs.physical);
    }

    // Auditoria periòdica
    getInformeSalutRellotges() {
        const driftArray = Array.from(this.observedClocks.values()).map(t => Math.abs(t - Date.now()));
        const maxDrift = driftArray.length > 0 ? Math.max(...driftArray) : 0;
        return {
            estat: maxDrift < this.maxDriftAllowed ? "sà" : "desfasat",
            maxDriftObservat: maxDrift
        };
    }
}

if (typeof window !== 'undefined') {
    window.hybridClock = new HybridLogicalClock(`node_${Math.random().toString(36).substr(2, 6)}`);
}
