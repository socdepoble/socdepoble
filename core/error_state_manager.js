// =============================================
// Error & State Manager – Elegància i Resistència
// =============================================

class MasiaStateManager {
    constructor() {
        this.estatActual = 'sana'; // sana | degradat | offline | conflicte
        this.errorsPendents = [];
    }

    registraError(modul, error, gravetat = 'baixa') {
        const errorEntry = {
            modul,
            missatge: error.message || error,
            timestamp: Date.now(),
            gravetat
        };

        this.errorsPendents.push(errorEntry);
        
        // Gestió silenciosa segons Trellat
        if (gravetat === 'alta') {
            console.error(`⚠️ ${modul}: ${error.message}`);
            // Només notifiquem a IAIA MarIA, no a l'usuari normal
            if(window.iaiaMarIA && window.iaiaMarIA.notificaErrorSilencios) {
                window.iaiaMarIA.notificaErrorSilencios(errorEntry);
            }
        } else {
            // Errors menors desapareixen sols
            setTimeout(() => this.errorsPendents.shift(), 30000);
        }
    }

    async recuperaEstat() {
        if (this.estatActual === 'degradat') {
            if(window.masiaCore && window.masiaCore.backoff) {
                await window.masiaCore.backoff.executaAmbBackoff(async () => {
                    if(window.masiaFlags) await window.masiaFlags.carregaFlags();
                    this.estatActual = 'sana';
                });
            }
        }
    }

    // Estat global visible (per a debug IAIA)
    getInformeSalut() {
        return {
            estat: this.estatActual,
            errorsPendents: this.errorsPendents.length,
            ultimaAuditoria: new Date().toISOString()
        };
    }
}

// Integració global
if (typeof window !== 'undefined') {
    window.masiaState = new MasiaStateManager();
}
