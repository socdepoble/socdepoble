// =============================================
// Sincronització WebRTC – Masía Virtual
// Dos mòbils passant l'històric pel carrer
// =============================================

class SincroWebRTC_Masia {
    constructor() {
        this.peer = null;
        this.dataChannel = null;
        this.replicaId = `mobil_${Date.now()}`;
    }

    async iniciaConnexioComAHost() {
        this.peer = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
        
        this.dataChannel = this.peer.createDataChannel('masia_sync', { ordered: true });
        this._configuraChannel();

        const offer = await this.peer.createOffer();
        await this.peer.setLocalDescription(offer);
        
        // Espera candidates i genera QR
        this.peer.onicecandidate = (e) => {
            if (!e.candidate) this._generaQRPerEscanejar();
        };
    }

    _generaQRPerEscanejar() {
        // Mètode stub que s'omplirà més endavant amb la implementació del handshake QR
        console.log("Generant codi QR per a WebRTC...", this.peer.localDescription);
    }

    _configuraChannel() {
        this.dataChannel.onopen = () => console.log("🔗 Connexió WebRTC oberta entre veïns");
        
        this.dataChannel.onmessage = async (event) => {
            const dadesRemotes = JSON.parse(event.data);
            await this._fusionaDadesRemotes(dadesRemotes);
        };
    }

    async _fusionaDadesRemotes(dadesRemotes) {
        const locals = await this._carregaDadesLocals();
        
        // Flags + CRDT + Mur
        if(window.masiaFlags) {
            await window.masiaFlags.guardaFlags(dadesRemotes.flags);
        }
        if(window.masiaCRDT) {
            window.masiaCRDT.mergeFromRemote(dadesRemotes.crdt);
        }
        
        if(window.ConflictResolver) {
            const conflicteResolt = await window.ConflictResolver.resolConflicte(locals.mur, dadesRemotes.mur);
        }
        
        console.log("✅ Històric fusionat correctament entre dos mòbils");
    }

    async _carregaDadesLocals() {
        return {
            flags: window.masiaFlags ? await window.masiaFlags.carregaFlags() : {},
            crdt: window.masiaCRDT ? window.masiaCRDT.exportaEstat() : {},
            mur: await this._llegeixMurDeIndexedDB()
        };
    }

    async _llegeixMurDeIndexedDB() {
        // Stub per a llegir el mur des de IndexedDB
        return [];
    }
}

if (typeof window !== 'undefined') {
    window.sincroWebRTC = new SincroWebRTC_Masia();
}
