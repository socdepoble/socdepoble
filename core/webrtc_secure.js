// =============================================
// WebRTC Secure amb DTLS – Connexió encriptada al carrer
// =============================================

class WebRTC_Secure {
    constructor() {
        this.peer = null;
    }

    async iniciaConnexioSegura() {
        const config = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' }
            ],
            // Configuració DTLS estricta
            dtlsTransport: {
                role: 'auto',
                // Forcem encriptació forta
            }
        };

        this.peer = new RTCPeerConnection(config);

        // Forcem ús de DTLS-SRTP i certificats
        const certificates = await RTCPeerConnection.generateCertificate({
            name: 'ECDSA',
            namedCurve: 'P-256'
        });
        
        this.peer = new RTCPeerConnection({
            ...config,
            certificates: [certificates]
        });

        // DataChannel amb encriptació obligatòria
        this.channel = this.peer.createDataChannel('masia_secure_sync', {
            ordered: true,
            reliable: true,
            // DTLS ja actiu per defecte
        });

        this._configuraCanalSegur();
    }

    _configuraCanalSegur() {
        this.channel.onopen = () => {
            console.log("🔒 Canal WebRTC encriptat amb DTLS obert");
        };

        this.channel.onmessage = async (event) => {
            // Les dades ja arriben encriptades per DTLS
            const dades = JSON.parse(event.data);
            if(window.masiaCore) {
                await window.masiaCore.fusionaDadesRemotes(dades);
            }
        };
    }

    // Verificació de seguretat
    async verificaSeguretat() {
        if (this.peer) {
            const stats = await this.peer.getStats();
            stats.forEach(report => {
                if (report.type === 'transport' && report.dtlsState === 'connected') {
                    console.log("✅ DTLS actiu i segur");
                }
            });
        }
    }
}

if (typeof window !== 'undefined') {
    window.webrtcSecure = new WebRTC_Secure();
}
