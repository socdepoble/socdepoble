// core/lorawan_bridge.js
class LoRaWAN_Bridge {
    constructor() {
        this.gatewayUrl = 'http://192.168.1.50:8080'; // Gateway local
    }

    async escoltaSensors() {
        try {
            // Polling o webhook des del gateway
            const resposta = await fetch(`${this.gatewayUrl}/sensors`);
            const dades = await resposta.json();

            dades.forEach(sensor => {
                if(window.masiaCRDT) {
                    window.masiaCRDT.actualitzaSensor(sensor.devEUI, {
                        humitat: sensor.humitat,
                        temperatura: sensor.temperatura,
                        bateria: sensor.bateria,
                        timestamp: Date.now()
                    });
                }

                if (sensor.humitat < 20) {
                    if(window.coapBridge) {
                        window.coapBridge.publicaAlertaBaixaHumitat(sensor.devEUI);
                    }
                }
            });
        } catch (e) {
            if(window.masiaState) {
                window.masiaState.registraError('LoRaWAN', e, 'baixa');
            }
        }
    }

    // Enviar comanda a un sensor remot (ex: activar reg)
    async enviaComanda(devEUI, comanda) {
        await fetch(`${this.gatewayUrl}/downlink`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                devEUI: devEUI,
                payload: comanda // ex: "REG_30min"
            })
        });
    }
}

if (typeof window !== 'undefined') {
    window.lorawanBridge = new LoRaWAN_Bridge();
}
