// core/massive_fusion_engine.js
class MassiveFusionEngine {
    constructor() {
        this.batchSize = 500; // Processa per lots per no saturar la memòria
    }

    async fusionaNodeRemot(remoteData, progressCallback = null) {
        console.log(`🔄 Iniciant fusió massiva de ${remoteData.totalEvents || 'múltiples'} events...`);

        let processed = 0;
        const events = remoteData.events || [];

        // Processa per lots per evitar que la UI es congele (molt important en dispositius vells)
        for (let i = 0; i < events.length; i += this.batchSize) {
            const batch = events.slice(i, i + this.batchSize);
            
            await this._processaBatch(batch);
            
            processed += batch.length;
            if (progressCallback) progressCallback(Math.round((processed / events.length) * 100));
            
            // Dona aire al navegador (cedeix el control a l'event loop)
            await this._espera(10);
        }

        // Fusió final de les estructures CRDT globals
        await this._fusionaEstatGlobal(remoteData);

        console.log("✅ Fusió massiva completada amb èxit després de la tempesta");
        return true;
    }

    async _processaBatch(batch) {
        for (const event of batch) {
            switch (event.tipus) {
                case 'comentari':
                    if (window.masiaORSet) {
                        window.masiaORSet.add(event.id, event.contingut);
                        if (event.action === 'remove') {
                            window.masiaORSet.remove(event.id);
                        }
                    }
                    break;
                    
                case 'assistencia':
                    // Assumim que tenim el GCounter
                    if (window.masiaGCounter) {
                        window.masiaGCounter.incrementa(event.valor);
                    }
                    break;
                    
                case 'sensor':
                    if (window.masiaCRDT) {
                        window.masiaCRDT.actualitzaSensor(event.sensorId, event.dades);
                    }
                    break;
            }
        }
    }

    async _fusionaEstatGlobal(remoteData) {
        // Fusió matemàtica OR-Set per resoldre conflictes
        if (remoteData.orSet && window.masiaORSet) {
            window.masiaORSet.merge(remoteData.orSet);
        }
        
        // Neteja i consolidació final de paquets resilients
        if (window.packetResilience && window.packetResilience.netejaCuaPendent) {
            await window.packetResilience.netejaCuaPendent();
        }
    }

    _espera(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

if (typeof window !== 'undefined') {
    window.massiveFusion = new MassiveFusionEngine();
}
