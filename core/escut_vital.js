// core/escut_vital.js
// =============================================
// Escut Vital: Protecció per a la Gent Major
// Anticaigudes, Medicació, i Dead Man's Switch
// =============================================

class EscutVital {
    constructor() {
        this.ultimMoviment = Date.now();
    }

    // 1. Medicació – Recordatoris descentralitzats
    async programaMedicacio(iaiaId, medicaments) {
        const avis = {
            iaiaId,
            medicaments,
            hora: "08:30",
            repetitCada: "24h"
        };
        
        // Guardat local + sincronització Mesh per si s'ha d'avisar un familiar
        if (window.masiaCore) {
            await window.masiaCore.publicaCanvi('medicacio', avis);
        }
        
        // Recordatori local amb notificació visual/sonora
        this.programaAlarmaLocal(avis);
    }

    programaAlarmaLocal(avis) {
        console.log(`⏰ Alarma programada per a medicació: ${avis.medicaments}`);
    }

    // 2. Anticaigudes – Acceleròmetre + SOS silenciós
    iniciaMonitorCaigudes() {
        if (!window.DeviceMotionEvent) {
            console.warn("⚠️ Acceleròmetre no disponible en aquest dispositiu.");
            return;
        }
        
        console.log("🛡️ Monitor anticaigudes activat.");
        window.addEventListener('devicemotion', (event) => {
            const accel = event.accelerationIncludingGravity;
            if (!accel) return;
            
            const impacte = Math.sqrt(accel.x**2 + accel.y**2 + accel.z**2);
            
            if (impacte > 25) { // Llindar de cop fort (aproximat)
                console.warn("💥 Impacte fort detectat! Llençant SOS silenciós...");
                this.lansaSOSSilencios();
            }
            
            // Actualitzem temps d'últim moviment per al Dead Man's Switch
            this.ultimMoviment = Date.now();
        });
    }

    async lansaSOSSilencios() {
        const sos = {
            type: "caiguda",
            iaiaId: window.masiaCore ? window.masiaCore.userId : "iaia_desconeguda",
            timestamp: window.hybridClock ? window.hybridClock.getTimestamp() : Date.now(),
            gps: await this.getLastKnownPosition(),
            mode: "silencios"
        };
        
        // Intenta tots els canals d'emergència
        if (window.meshtasticBridge) await window.meshtasticBridge.enviarPaquetAltaPrioritat(sos);
        if (window.dronLink) await window.dronLink.sollicitaDron(sos); // Demana dron si cal
        if (window.emergencyRadio) await window.emergencyRadio.enviaNotaVeus("Caiguda detectada - ajudeu de forma automàtica");
    }

    async getLastKnownPosition() {
        return "Coordenades_Masia_Aproximades";
    }

    // 3. Dead Man's Switch – Inactivitat 24h
    iniciaDeadManSwitch() {
        console.log("⏱️ Dead Man's Switch activat (24h d'inactivitat).");
        setInterval(() => {
            const inactiu = (Date.now() - this.ultimMoviment) > 86400000; // 24 hores
            
            if (inactiu) {
                console.error("🚨 24 hores sense moviment detectat. Llançant alarma d'inactivitat!");
                this.lansaAlarmaInactivitat();
            }
        }, 3600000); // Comprova cada hora
    }

    async lansaAlarmaInactivitat() {
        const alerta = {
            type: "inactivitat_24h",
            iaiaId: window.masiaCore ? window.masiaCore.userId : "iaia_desconeguda",
            priority: "critica"
        };
        
        // Requereix signatures múltiples si cal, i emet a la ràdio
        if (window.thresholdSignature) {
            await window.thresholdSignature.signaAccioCritica("alarma_vital", alerta);
        }
        if (window.emergencyRadio) {
            await window.emergencyRadio.activaModeRadioEmergencia();
        }
    }
}

if (typeof window !== 'undefined') {
    window.escutVital = new EscutVital();
}
