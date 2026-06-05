// core/mqtt_sn_bridge.js
// Broker MQTT-SN local (usant mqtt o llibreria especialitzada)
class MQTT_SN_Bridge {
    constructor() {
        this.client = null;
        this.mqtt = typeof require !== 'undefined' ? require('mqtt') : null;
    }

    async connectaSN() {
        if (!this.mqtt) {
            console.warn("Llibreria MQTT no disponible per a MQTT-SN bridge");
            return;
        }

        // Connexió a gateway MQTT-SN (que parla amb nodes LoRa/Meshtastic)
        this.client = this.mqtt.connect('mqtt://192.168.1.50:1884', { // Port típic MQTT-SN
            clientId: `masia_gateway_${Math.random().toString(16).substr(2, 8)}`,
            keepalive: 300, // Més tolerant
            reconnectPeriod: 5000 // Controlat per backoff
        });

        this.client.on('connect', () => {
            console.log("Connectat a gateway MQTT-SN");
            this.client.subscribe('masia/poble/la_torre/sensor/+/+');
            this.client.subscribe('masia/poble/la_torre/dron/#');
        });

        this.client.on('message', (topic, message) => {
            try {
                const dades = JSON.parse(message.toString());
                const parts = topic.split('/');
                
                if (parts.includes('sensor') && window.masiaCRDT) {
                    window.masiaCRDT.actualitzaSensor(parts[4], dades);
                } else if (parts.includes('dron') && window.loraDron) {
                    window.loraDron.processaTelemetria(dades);
                }
            } catch (e) {
                console.error("Error processant missatge MQTT-SN", e);
            }
        });
    }

    publicaSN(tema, dades) {
        if (this.client) {
            // QoS 1 per confirmació
            this.client.publish(`masia/poble/la_torre/${tema}`, JSON.stringify(dades), { qos: 1 }); 
        }
    }
}

if (typeof window !== 'undefined') {
    window.mqttSNBridge = new MQTT_SN_Bridge();
} else if (typeof module !== 'undefined') {
    module.exports = MQTT_SN_Bridge;
}
