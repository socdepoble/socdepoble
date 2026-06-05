// =============================================
// MASIA CORE ENGINE – Versió Polida i a Prova d'Òxid
// Tot el que hem forjat hui, net i fort
// =============================================

class MasiaCore {
    constructor() {
        this.flags = null;
        this.crdt = window.masiaCRDT || null;
        this.backoff = window.ExponentialBackoff ? new window.ExponentialBackoff(8, 1000) : null;
        this.sincro = window.sincroWebRTC || null;
    }

    async iniciaTot() {
        if (!this.backoff) {
            console.warn("ExponentialBackoff no carregat. Iniciant sense ell.");
            await this._iniciaInterior();
            return;
        }

        await this.backoff.executaAmbBackoff(async () => {
            await this._iniciaInterior();
        });
    }

    async _iniciaInterior() {
        if (window.masiaFlags) {
            this.flags = await window.masiaFlags.carregaFlags();
        }
        
        if (window.iniciaIndexedDB) {
            await window.iniciaIndexedDB();
        }
        
        if (this.flags && this.flags.activa_sincro && this.sincro) {
            await this.sincro.iniciaConnexioComAHost();
        }
        
        console.log("🔥 Masía Core iniciat amb Trellat");
    }

    // Mètodes compartits
    async publicaCanvi(tipus, dades) {
        if (this.crdt) {
            // Adaptació de crida segons la classe original
            this.crdt.actualitzaMur(dades.id || Date.now(), dades.contingut, 'jo');
        }
        
        if (this.sincro && this.sincro.dataChannel && this.sincro.dataChannel.readyState === 'open') {
            this.sincro.dataChannel.send(JSON.stringify({ tipus, dades }));
        }
    }
}

// Instància global
if (typeof window !== 'undefined') {
    window.masiaCore = new MasiaCore();

    // Auto-inici
    document.addEventListener('DOMContentLoaded', () => {
        window.masiaCore.iniciaTot();
    });
}
