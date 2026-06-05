// =============================================
// Handshake QR WebRTC – Connexió directa al carrer
// =============================================
/* global QRCode */

class WebRTC_QR_Handshake {
    constructor() {
        this.peer = null;
        this.channel = null;
    }

    // === Telèfon A (genera QR) ===
    async iniciaComAHost() {
        this.peer = new RTCPeerConnection({ 
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] 
        });

        this.channel = this.peer.createDataChannel('masia_full_sync', { ordered: true, reliable: true });
        this._configuraChannel();

        const offer = await this.peer.createOffer();
        await this.peer.setLocalDescription(offer);

        this.peer.onicecandidate = (e) => {
            if (!e.candidate) this._generaQR();
        };
    }

    _generaQR() {
        const payload = {
            type: 'offer',
            sdp: this.peer.localDescription.sdp,
            replicaId: `mobil_${Date.now()}`,
            timestamp: Date.now()
        };

        // Usa llibreria qrcode.js
        const qrContainer = document.getElementById('qr_container');
        if(qrContainer && typeof QRCode !== 'undefined') {
            QRCode.toCanvas(qrContainer, JSON.stringify(payload), { width: 320 }, (error) => {
                if (!error) console.log("📱 QR generat per al veí");
            });
        } else {
            console.log("Generaria aquest QR:", JSON.stringify(payload));
        }
    }

    // === Telèfon B (escaneja QR) ===
    async connectaDesdeQR(textQR) {
        const payload = JSON.parse(textQR);
        this.peer = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });

        await this.peer.setRemoteDescription({ type: 'offer', sdp: payload.sdp });

        const answer = await this.peer.createAnswer();
        await this.peer.setLocalDescription(answer);

        this.peer.ondatachannel = (event) => {
            this.channel = event.channel;
            this._configuraChannel();
        };

        // Genera QR de resposta per al Telèfon A
        this._generaAnswerQR();
    }

    _generaAnswerQR() {
        console.log("Generant QR de resposta (Answer)...");
    }

    _configuraChannel() {
        this.channel.onopen = () => {
            console.log("✅ Connexió WebRTC establerta – passant històric");
            this._enviaHistoricComplet();
        };

        this.channel.onmessage = async (event) => {
            const dades = JSON.parse(event.data);
            if(window.masiaCore && window.masiaCore.fusionaDadesRemotes) {
                await window.masiaCore.fusionaDadesRemotes(dades);
            } else {
                console.log("Dades rebudes per WebRTC", dades);
            }
        };
    }

    async _enviaHistoricComplet() {
        if(window.masiaCore && window.masiaCore.preparaHistoricComplet) {
            const historic = await window.masiaCore.preparaHistoricComplet();
            this.channel.send(JSON.stringify(historic));
        }
    }
}

if (typeof window !== 'undefined') {
    window.webrtcQR = new WebRTC_QR_Handshake();
}
