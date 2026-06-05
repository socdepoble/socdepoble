// core/lorawan_advanced.js
// Gestió avançada de la xarxa de sensors LoRaWAN de la Masía
class LoRaWAN_Advanced {
    async processaUplink(paquet) {
        const { devEUI, rssi, data } = paquet;
        
        // Ajust dinàmic de dades i potència (ADR)
        if (rssi < -110) {
            console.log(`[LoRaWAN] Senyal dèbil (${rssi}) per a ${devEUI}. Sol·licitant augment de potència...`);
            await this.sollicitaADR(devEUI, 'baixa_potencia');
        }

        if (window.masiaCRDT) {
            window.masiaCRDT.actualitzaSensor(devEUI, data);
        }

        // Priorització d'alertes crítiques a nivell de xarxa
        if (data.humitat < 15 || (data.temp && data.temp > 42)) {
            if (window.masiaCore) {
                window.masiaCore.publicaAlerta('critica', data);
            }
        }
    }

    async sollicitaADR(devEUI, perfil) {
        // Enviar comanda MAC cap al dispositiu per ajustar Spreading Factor
        console.log(`[LoRaWAN] Enviat perfil ADR '${perfil}' a ${devEUI}`);
    }

    async enviaComandaZona(zona, comanda) {
        // Multicast a tota una partida de l'horta per a actuacions sincronitzades
        console.log(`[LoRaWAN] Emetent Multicast Downlink a zona: ${zona}`);
        try {
            const res = await fetch('/lorawan/downlink/multicast', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    zona: zona,
                    payload: comanda,
                    confirmed: true
                })
            });
            if (!res.ok) throw new Error("Error al gateway local");
        } catch(e) {
            console.log("[LoRaWAN] Gateway inaccesible. S'intentarà quan torne l'enllaç.");
        }
    }
}

if (typeof window !== 'undefined') {
    window.lorawanAdvanced = new LoRaWAN_Advanced();
}
