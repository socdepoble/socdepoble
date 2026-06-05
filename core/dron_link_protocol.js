// core/dron_link_protocol.js
class DronLinkProtocol {
    async iniciaEnllaçDinamic() {
        // El dron emet beacon
        this.emeteixBeacon();
    }

    async gestionaConnexioSensor(sensorData) {
        if (sensorData.prioritat === 'alta') {
            // Prioritza alertes (senglars, humitat crítica)
            await this.transfereixBatchAltaPrioritat(sensorData);
        } else {
            await this.transfereixBatchNormal(sensorData);
        }

        // Confirmació i neteja de cua del sensor
        this.enviaConfirmacio(sensorData.devEUI);
    }

    async transfereixBatchAltaPrioritat(data) {
        console.log(`🚁 Transferint paquet CRÍTIC del sensor ${data.devEUI}:`, data.payload);
        if (window.packetResilience) {
            window.packetResilience.guardaPaquetPendent('dron_alta_prioritat', data);
        }
    }

    async transfereixBatchNormal(data) {
        console.log(`🚁 Transferint paquet normal del sensor ${data.devEUI}`);
        if (window.packetResilience) {
            window.packetResilience.guardaPaquetPendent('dron_normal', data);
        }
    }

    enviaConfirmacio(devEUI) {
        console.log(`🚁 Enviat ACK al sensor ${devEUI}. Pot tornar a dormir (Low-Power).`);
    }

    emeteixBeacon() {
        // Via LoRa / Meshtastic
        console.log("🚁 Beacon dron actiu – sensors de la partida, desperteu!");
    }
}

if (typeof window !== 'undefined') {
    window.dronLink = new DronLinkProtocol();
}
