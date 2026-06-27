/**
 * convergenceAnalytics.js
 * 
 * MOTOR DE CONVERGÈNCIA: Psiquiatria Humana VS Psiquiatria de Màquina
 * Aquest motor s'encarrega d'analitzar patrons matemàtics compartits exclusivament
 * a nivell mental/psiquiàtric (cervell humà i cervell de silici).
 * 
 * Exemples de convergència: 
 * - Demència de Context (Màquina: Esborrat de RAM / Humà: Oblit d'esdeveniments).
 * - Ansietat/Bucle (Màquina: Inifinite loops, retards de xarxa / Humà: Clics repetitius per frustració).
 * - Sobrecàrrega Cognitiva (Màquina: FPS drop per saturació / Humà: Sortides abruptes de l'App).
 * 
 * Sóc de Poble: Trellat Algorítmic.
 */

class ConvergenceAnalytics {
    constructor() {
        // Dades Psiquiàtriques Humanes (Ansietat, Oblit, Confusió)
        this.psiquiatriaHumana = {
            frustrationClicks: 0, // Senyal d'ansietat/confusió
            contextLossEvents: 0, // Cops que el padrí perd el fil o oblida què anava a fer
            cognitiveOverloadExits: 0 // Abandó per excés d'informació visual
        };

        // Dades Psiquiàtriques de la Màquina (Saturació, Fuites, Demència)
        this.psiquiatriaMaquina = {
            infiniteLoopWarnings: 0, // Ansietat algorítmica
            ramContextLoss: 0, // Demència de memòria (comú en iPad A10)
            networkTimeouts: 0 // Aïllament / desconnexió de la xarxa neuronal
        };
    }

    /**
     * Registra un event psiquiàtric de l'usuari (des de src/features/psiquiatria-humana)
     */
    logPsiquiatriaHumana(type, value = 1) {
        if (this.psiquiatriaHumana[type] !== undefined) {
            this.psiquiatriaHumana[type] += value;
        }
        this._calculatePsychiatricConvergence();
    }

    /**
     * Registra un event psiquiàtric de la màquina (des de src/features/psiquiatria-maquina)
     */
    logPsiquiatriaMaquina(type, value = 1) {
        if (this.psiquiatriaMaquina[type] !== undefined) {
            this.psiquiatriaMaquina[type] += value;
        }
        this._calculatePsychiatricConvergence();
    }

    /**
     * Motor matemàtic relacional. 
     * Extreu correlacions entre la bogeria de la màquina i l'estrès de l'humà.
     */
    _calculatePsychiatricConvergence() {
        const totalMachineStress = Object.values(this.psiquiatriaMaquina).reduce((a, b) => a + b, 0);
        const totalHumanStress = Object.values(this.psiquiatriaHumana).reduce((a, b) => a + b, 0);

        if (totalMachineStress > 0 && totalHumanStress > 0) {
            // Ràtio de transferència d'estrès
            const ratio = (totalHumanStress / totalMachineStress).toFixed(3);
            
            console.groupCollapsed("🧠 [Sóc de Poble] Diagnòstic Psiquiàtric Creuat");
            console.log(`Índex de Correlació (Estrès Humà / Estrès Màquina): ${ratio}`);
            if (ratio > 2.0) {
                console.warn("⚠️ ALERTA PSIQUIÀTRICA: La màquina està sana però el disseny està generant ansietat o sobrecàrrega al padrí.");
            } else if (ratio < 0.5) {
                console.warn("⚠️ ALERTA PSIQUIÀTRICA: La màquina pateix demència o aïllament (xarxa trenada) i el disseny intenta amagar-ho.");
            } else {
                console.log("✅ EQUILIBRI DE TRELLAT: Ambdós cervells conviuen amb càrregues cognitives acceptables i proporcionals.");
            }
            console.groupEnd();
        }
    }

    // Exportar matriu psiquiàtrica completa
    exportPsychiatricMatrix() {
        return {
            menteHumana: this.psiquiatriaHumana,
            menteMaquina: this.psiquiatriaMaquina,
            timestamp: new Date().toISOString()
        };
    }
}

export const convergenceAnalytics = new ConvergenceAnalytics();
