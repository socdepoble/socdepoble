// core/meshtastic_bridge.js
class MeshtasticBridge {
    constructor() {
        this.port = null; // Serial o Bluetooth
    }

    async connectaNodePrincipal() {
        // Connexió Bluetooth o USB al node gateway
        if (typeof navigator !== 'undefined' && navigator.serial) {
            try {
                this.port = await navigator.serial.requestPort();
                await this.port.open({ baudRate: 115200 });
                console.log("🔗 Node Meshtastic principal connectat");
            } catch (e) {
                console.log("Error connectant node Meshtastic", e);
            }
        } else {
            console.warn("API Serial no disponible, simularem connexió Meshtastic");
        }
    }

    async processaMissatgeMesh(paquet) {
        const { from, payload, hopCount } = paquet;
        
        // Decodifica i guarda a CRDT
        try {
            const dades = JSON.parse(atob(payload));
            if(window.masiaCRDT) {
                window.masiaCRDT.actualitzaSensor(from, dades);
            }
            
            if (hopCount > 4) {
                console.log(`⚠️ Ruta llarga detectada (${hopCount} salts)`);
            }
        } catch(e) {
            console.log("Error decodificant paquet Meshtastic", e);
        }
    }
}

if (typeof window !== 'undefined') {
    window.meshtastic = new MeshtasticBridge();
}
