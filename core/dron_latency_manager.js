// core/dron_latency_manager.js
class DronLatencyManager {
    constructor() {
        this.velocitatDronKmH = 50;
        this.tempsTransmissioDescargaMs = 30000; // 30 segons estimats
        this.tempsDespertarSensorMs = 15000;    // 15 segons
    }

    calculaTempsEstimats(distanciaKm) {
        const tempsVolAnadaTornadaMinuts = (distanciaKm * 2 / this.velocitatDronKmH) * 60;
        const totalEstimatsMinuts = Math.round(
            (this.tempsDespertarSensorMs + (tempsVolAnadaTornadaMinuts * 60000) + this.tempsTransmissioDescargaMs) / 60000
        );

        return {
            tempsEsperaSensorSecs: this.tempsDespertarSensorMs / 1000,
            tempsVolAnadaTornadaMinuts: Math.round(tempsVolAnadaTornadaMinuts),
            tempsDescargaSecs: this.tempsTransmissioDescargaMs / 1000,
            totalEstimatsMinuts: totalEstimatsMinuts
        };
    }

    async monitoraMissioEnTempsReal(distanciaKm) {
        const estimacio = this.calculaTempsEstimats(distanciaKm);
        
        if (window.masiaCRDT) {
            window.masiaCRDT.actualitzaMur(
                `dron_missio_${Date.now()}`, 
                `🚁 Dron en vol - dades de la zona a ${distanciaKm}km esperades en aprox. ${estimacio.totalEstimatsMinuts} minuts.`, 
                'Sistema_Masía'
            );
        }
        
        console.log(`[Latència Dron] Temps estimat total: ${estimacio.totalEstimatsMinuts} minuts per a tancar el cicle.`);
    }
}

if (typeof window !== 'undefined') {
    window.dronLatencyManager = new DronLatencyManager();
}
