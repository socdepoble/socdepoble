// core/performance_engine.js
// Gestió de rendiment adaptatiu per a mòbils vells a l'ombra d'una garrofera
class PerformanceEngine {
    constructor() {
        this.batchSize = 350;           // Mida del lot ajustada per a telèfons antics
        this.maxMemoryTarget = 45;      // Límit de memòria objectiu en MB
    }

    async fusionaAmbOptimitzacio(remoteData) {
        let processed = 0;
        const events = remoteData.events || [];
        
        console.log(`[Performance] Iniciant fusió de ${events.length} events amb batchSize ${this.batchSize}...`);

        // Neteja prèvia de memòria
        if (this._getMemoriaActual() > this.maxMemoryTarget) {
            await this._alliberaMemoria();
        }

        for (let i = 0; i < events.length; i += this.batchSize) {
            const batch = events.slice(i, i + this.batchSize);
            
            const start = performance.now();
            await this._processaBatchOptimitzat(batch);
            const durada = performance.now() - start;

            processed += batch.length;
            
            // Adaptive batching: reduïm si anem molt lents
            if (durada > 450) {
                this.batchSize = Math.max(150, this.batchSize - 50);
                console.warn(`[Performance] Lot lent (${Math.round(durada)}ms). Nou batchSize: ${this.batchSize}`);
            }
            
            // Dona aire al navegador vell
            await this._espera(8); 
        }
        
        console.log("[Performance] Fusió optimitzada finalitzada.");
    }

    async _processaBatchOptimitzat(batch) {
        // Processament lleuger sense bloquejar el fil principal massivament
        for (const ev of batch) {
            if (ev.tipus === 'comentari' && window.masiaORSet) {
                window.masiaORSet.add(ev.id, ev.contingut); // Operació ràpida a memòria
            }
        }
    }

    _getMemoriaActual() {
        // Estimació via performance.memory (només Chrome/Edge) o fallback conservador
        return (performance.memory ? performance.memory.usedJSHeapSize / 1048576 : 30);
    }

    async _alliberaMemoria() {
        // Força garbage collection indirecte pausant el fil
        console.log("[Performance] Pausant per permetre Garbage Collection...");
        await new Promise(resolve => setTimeout(resolve, 50));
    }

    _espera(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

if (typeof window !== 'undefined') {
    window.performanceEngine = new PerformanceEngine();
}
