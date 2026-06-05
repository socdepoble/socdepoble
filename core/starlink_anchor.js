// core/starlink_anchor.js
// =============================================
// Àncora Satel·litària (Starlink / Espai Profund)
// =============================================

class StarlinkAnchor {
    constructor() {
        this.isActive = false;
        this.modeEmergenciaGlobal = false;
    }

    async activaModeEspacial() {
        this.isActive = true;
        this.modeEmergenciaGlobal = true;
        console.log("🌌 ÀNCORA STARLINK ACTIVADA – El poble torna a tenir accés a l'exterior");

        // Activa el pont entre la xarxa Mesh local i la connexió satel·litària
        await this.sincronitzaAmbMeshLocal();
        await this.sincronitzaAmbDrons();
    }

    async sincronitzaAmbMeshLocal() {
        console.log("🛰️ Sincronitzant estat del poble cap al satèl·lit...");
        // 1. Puja un resum agregat i xifrat de l'estat del poble (SOS, necessitats)
        const dadesCrítiques = this._recopilaDadesSOS();
        await this.enviaDadesCritiques(dadesCrítiques);
        
        // 2. Baixa informació externa vital
        await this._descarregaAvisosMeteorologics();
    }

    async sincronitzaAmbDrons() {
        console.log("🛰️ Enllaçant drons repetidors directament amb el gateway Starlink...");
        // Els drons passen a descarregar fotos i dades crítiques directament per pujar-les
    }

    async enviaDadesCritiques(dades) {
        if (!this.isActive) return;
        
        console.log("🚀 Pujant paquet d'emergència al núvol via satèl·lit...");
        // API d'enviament cap al router Starlink o Swarm
    }

    _recopilaDadesSOS() {
        return {
            poble_status: "Aïllat per tempesta",
            necessitats: "Subministrament elèctric tallat",
            timestamp: window.hybridClock ? window.hybridClock.getTimestamp() : Date.now()
        };
    }

    async _descarregaAvisosMeteorologics() {
        console.log("📥 Descarregant predicció externa...");
        if (window.masiaCRDT) {
            window.masiaCRDT.actualitzaMur(
                `meteo_${Date.now()}`, 
                "Avis Exterior: S'esperen pluges durant 12h més. Mantingueu-vos a recer.", 
                "Protecció Civil via Starlink"
            );
        }
    }
}

if (typeof window !== 'undefined') {
    window.starlinkAnchor = new StarlinkAnchor();
}
