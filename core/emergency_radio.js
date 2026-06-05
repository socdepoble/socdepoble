// core/emergency_radio.js
// =============================================
// Ràdio Masía: Walkie-Talkie i Broadcast d'Emergència
// =============================================

class EmergencyRadio {
    constructor() {
        this.modeEmergenciaActiu = false;
        this.audioContext = null;
    }

    async enviaNotaVeus(missatgeVeusBlob) {
        if (!this.modeEmergenciaActiu) {
            console.warn("La ràdio d'emergència no està activa.");
            return;
        }

        console.log("🎙️ Encodificant i preparant nota de veu per a Mesh...");
        
        const paquet = {
            type: "veu_emergencia",
            from: window.masiaCore ? window.masiaCore.userId : "vei_desconegut",
            audioData: await this._compressAudio(missatgeVeusBlob), 
            timestamp: window.hybridClock ? window.hybridClock.getTimestamp() : Date.now(),
            priority: "alta"
        };
        
        // S'envia com un missatge de text però amb el payload d'àudio codificat
        if (window.meshtasticBridge) {
            await window.meshtasticBridge.enviarPaquetBroadcast(paquet);
            console.log("📻 Nota de veu emesa a tots els nodes propers.");
        }
    }

    activaModeRadioEmergencia() {
        this.modeEmergenciaActiu = true;
        console.log("📻 RÀDIO MASÍA ACTIVADA – MODE CATÀSTROFE");
        
        // Prepara el context d'àudio
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Reprodueix automàticament els fluxos entrants
        this._escoltaBroadcast();
    }

    async _escoltaBroadcast() {
        console.log("🎧 Escoltant les freqüències Mesh i LoRa...");
        // Simulació de receptor: quan arribe un paquet 'veu_emergencia' per la xarxa:
        // window.addEventListener('mesh_audio_received', this._reprodueixAudio.bind(this));
    }

    async _compressAudio(blob) {
        // En una implementació real, s'ha d'utilitzar Opus per reduir l'àudio a la mínima expressió (kbps)
        // per poder passar-lo a través dels enllaços de banda estreta (LoRa/Meshtastic).
        return "base64_encoded_opus_data_simulated"; 
    }

    _reprodueixAudio(event) {
        console.log(`🔊 Reproduint missatge d'emergència de: ${event.detail.from}`);
        // Descodifica i reprodueix l'àudio
    }
}

if (typeof window !== 'undefined') {
    window.emergencyRadio = new EmergencyRadio();
}
