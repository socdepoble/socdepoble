// core/coap_iot_bridge.js
class CoAP_IoT_Bridge {
    constructor() {
        this.sensors = new Map();
    }

    async connectaSensor() {
        // CoAP client (usant llibreria coap o fetch amb proxy)
        try {
            const response = await fetch('coap://192.168.1.50/horta/humitat', {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });

            const data = await response.json();
            
            // Guardem a CRDT i IndexedDB
            if(window.masiaCRDT) {
                window.masiaCRDT.actualitzaSensor(data.sensorId, {
                    humitat: data.valor,
                    timestamp: Date.now()
                });
            }

            console.log(`📡 Sensor d'humitat rebut: ${data.valor}%`);
        } catch(e) {
            console.log("Error connectant a sensor CoAP", e.message);
        }
    }

    publicaAlertaBaixaHumitat(sensorId) {
        // Notificació al Mur i al xat del poble
        if(window.masiaCore) {
            window.masiaCore.publicaCanvi('alerta_horta', {
                sensor: sensorId,
                missatge: "Atenció: humitat baixa a l'olivera 3"
            });
        }
    }
}

if (typeof window !== 'undefined') {
    window.coapBridge = new CoAP_IoT_Bridge();
}
