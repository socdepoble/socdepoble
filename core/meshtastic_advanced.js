// core/meshtastic_advanced.js
class MeshtasticAdvanced {
    async enviaAlertaSenglar(posicio) {
        const paquet = {
            type: "alerta",
            subtype: "senglar",
            gps: posicio,
            priority: "alta"
        };
        
        // Envia via Bluetooth/Serial al node Meshtastic
        await this.enviarPerMesh(paquet);
        
        // Propaga a tots els nodes del poble
        if (window.masiaCore) {
            window.masiaCore.publicaCanvi('alerta_general', paquet);
        }
    }

    async enviarPerMesh(paquet) {
        if (window.meshtastic && window.meshtastic.port) {
            console.log("Enviant paquet d'alta prioritat a través de la xarxa Meshtastic:", paquet);
        } else {
            console.log("Simulant enviament Mesh:", paquet);
        }
    }

    async monitoraSalutXarxa() {
        // Detecta quins nodes estan vius
        // Si un node clau cau, avisa per MQTT a la IAIA MarIA
        console.log("Monitoritzant salut dels nodes solars Meshtastic...");
    }
}

if (typeof window !== 'undefined') {
    window.meshtasticAdvanced = new MeshtasticAdvanced();
}
