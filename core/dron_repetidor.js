// core/dron_repetidor.js
class DronRepetidor {
    constructor() {
        this.intervalActiu = null;
    }

    async iniciaMissio(zona) {
        console.log(`🚁 Enlairant dron repetidor cap a ${zona}`);
        
        // Connexió al node del dron
        await this.connectaNodeDron();
        
        // Mode repetidor actiu
        this.intervalActiu = setInterval(() => {
            this.recollirDadesDeSensorsPropers();
        }, 15000);
    }

    async connectaNodeDron() {
        console.log("🚁 Connectant amb el node LoRa/Meshtastic del dron...");
        // Simulació de connexió establerta
    }

    async recollirDadesDeSensorsPropers() {
        // Rep paquets via Mesh des de les zones fosques de l'horta
        const paquets = await this.llegeixMesh();
        paquets.forEach(p => {
            if(window.packetResilience) {
                window.packetResilience.guardaPaquetPendent('dron', p);
            }
        });
    }

    async llegeixMesh() {
        // Simulació de lectura de paquets a l'aire
        console.log("🚁 Recollint paquets de sensors propers...");
        return [
            { id: 'sensor_olivera_7', dades: { humitat: 12 }, timestamp: Date.now() }
        ];
    }

    async tornaIDescarga() {
        console.log("🚁 Dron tornant a base – descarregant dades");
        if (this.intervalActiu) {
            clearInterval(this.intervalActiu);
            this.intervalActiu = null;
        }
        if(window.packetResilience) {
            await window.packetResilience.sincronitzaDespresDeDesconnexio();
        }
    }
}

if (typeof window !== 'undefined') {
    window.dronRepetidor = new DronRepetidor();
}
