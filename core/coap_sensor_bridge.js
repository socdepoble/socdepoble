// core/coap_sensor_bridge.js
// Asumim que es fa servir Node.js per al gateway o un bridge (ex. 'coap' npm package)
// Aquest fitxer està pensat per a l'entorn de Gateway/Servidor.

class CoAP_Sensor_Client {
    constructor() {
        this.coap = typeof require !== 'undefined' ? require('coap') : null;
    }

    async escoltaSensor(uri, sensorId) {
        if (!this.coap) {
            console.warn("Llibreria 'coap' no disponible, el bridge de sensors està simulat.");
            return;
        }

        const req = this.coap.request({
            hostname: uri,  // ex: '192.168.1.XX'
            pathname: `/horta/humitat/${sensorId}`,
            method: 'GET',
            observe: true   // Observació contínua (el sensor empenta els canvis)
        });

        req.on('response', (res) => {
            res.on('data', (data) => {
                const valor = parseFloat(data.toString());
                
                if (window.masiaCRDT) {
                    window.masiaCRDT.actualitzaSensor(sensorId, {
                        humitat: valor,
                        bateria: 92, // simulat o provinent del payload
                        timestamp: Date.now()
                    });
                }

                if (valor < 25 && window.masiaCore) {
                    window.masiaCore.publicaCanvi('alerta_horta', {
                        sensor: sensorId,
                        missatge: `Baixa humitat a ${sensorId}`
                    });
                }
            });
        });

        req.end();
    }
}

if (typeof window !== 'undefined') {
    window.coapSensorBridge = new CoAP_Sensor_Client();
} else if (typeof module !== 'undefined') {
    module.exports = CoAP_Sensor_Client;
}
