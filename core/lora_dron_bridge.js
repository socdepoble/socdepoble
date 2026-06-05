// core/lora_dron_bridge.js
class LoRaDronBridge {
    constructor() {
        this.dronActiu = false;
    }

    async iniciaVigilanciaDron(ruta) {
        this.dronActiu = true;
        
        // Simulació / connexió real via Meshtastic o LoRa directe
        console.log(`🚁 Dron enlairat per la partida de Dalt`);

        // Rebem telemetria periòdica
        setInterval(async () => {
            if(!this.dronActiu) return;

            const telemetria = await this.obteDadesDron();
            
            if (window.masiaCore) {
                window.masiaCore.publicaCanvi('dron_vigilancia', {
                    posicio: telemetria.gps,
                    imatges: telemetria.detections, // senglars, humitat, etc.
                    bateria: telemetria.bateria
                });
            }
        }, 8000);
    }

    aturarVigilancia() {
        this.dronActiu = false;
        console.log("🚁 Dron aterrat.");
    }

    async obteDadesDron() {
        // En realitat ve via LoRa / Meshtastic
        return {
            gps: { lat: 38.6, lon: -0.1 }, // Simulat
            detections: ["2 senglars", "humitat baixa zona 4"],
            bateria: 68
        };
    }

    // El dron pot fer de repetidor mesh
    actuaComRepetidor() {
        console.log("🚁 Dron actuant com a node mesh mòbil per expandir l'abast de l'Horta.");
        // Reenvia paquets de sensors llunyans
    }
}

if (typeof window !== 'undefined') {
    window.loraDron = new LoRaDronBridge();
}
