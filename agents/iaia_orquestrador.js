class IAIA_MarIA {
    constructor() {
        this.flags = null;
        this.conflictResolver = null; // S'injectarà
    }

    async iniciaDia() {
        if(window.masiaFlags) {
            this.flags = await window.masiaFlags.carregaFlags();
        }
        
        // Auditoria automàtica
        if (this.flags && this.flags.activa_auditoria) {
            console.log("🧠 IAIA MarIA: Iniciant auditoria d'entropia.");
            // await detectaEntropiaRapida();
        }

        // Vigilància de conflictes
        this.vigilaConflictes();
    }

    async resolConflicteAutomatic(dadesLocal, dadesRemot) {
        if (!this.conflictResolver) return null;
        const resolucio = await this.conflictResolver.resolConflicte(
            dadesLocal, dadesRemot
        );
        
        // Pregunta a l'humà només en casos greus
        if (this.esConflicteGreu(resolucio)) {
            this.notificaHuma("Conflicte detectat al Mur. Revisa?");
        }
        
        return resolucio;
    }

    esConflicteGreu(resolucio) {
        // Lògica simple: si els dos tenen canvis crítics que no es poden mergar
        return resolucio && resolucio.requiresManualIntervention;
    }

    notificaHuma(msg) {
        console.warn(`[IAIA MarIA Avís] ${msg}`);
        // ací llançaríem un toast o una alerta de UI amigable
    }

    vigilaConflictes() {
        // Escolta canvis en IndexedDB i WebRTC (simulat amb events)
        window.addEventListener('storage', async (e) => {
            if (e.key.includes('mur') || e.key.includes('flags')) {
                console.log("🧠 IAIA MarIA detecta possible conflicte a l'emmagatzematge");
            }
        });
    }

    async canviaFlag(flag, valor) {
        if(window.canviaFeatureFlag) {
            return await window.canviaFeatureFlag(flag, valor);
        }
        return false;
    }
}

// Inicialització global segura per al frontend
if (typeof window !== 'undefined') {
    window.iaiaMarIA = new IAIA_MarIA();
}
