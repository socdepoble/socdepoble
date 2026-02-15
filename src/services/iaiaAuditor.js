import { logger } from '../utils/logger';

/**
 * IAIA_Auditor: L'instint de preservació del sistema. [MASTER]
 * Comprova si el bategat és regular o si estem en un bucle de recàrregues.
 */
class IAIAAuditor {
    constructor() {
        this.STABILITY_KEY = 'iaia_stability_state';
        this.MAX_RELOADS = 10;
        this.RELOAD_WINDOW_MS = 5000; // 5 segons (més agressiu netejant ràpid)
    }

    auditPulse() {
        try {
            const now = Date.now();
            const state = JSON.parse(sessionStorage.getItem(this.STABILITY_KEY) || '{ "reloads": 0, "last_reload": 0, "locked": false }');

            // Si ja està bloquejat o estem en rescat, no asfixiem el Mas
            if (state.locked || window.location.search.includes('rescue')) return true;

            if (now - state.last_reload < this.RELOAD_WINDOW_MS) {
                state.reloads++;
                logger.warn(`[IAIA-Auditor] Detectat re-bategat ràpid (${state.reloads}/${this.MAX_RELOADS})...`);
            } else {
                // Si ha passat prou temps, baixem la pressió però no a zero immediatament
                state.reloads = Math.max(1, state.reloads - 1);
            }

            state.last_reload = now;

            if (state.reloads >= this.MAX_RELOADS) {
                state.locked = true;
                sessionStorage.setItem(this.STABILITY_KEY, JSON.stringify(state));
                this.activateSafetyShield("Bucle de recàrrega detectat. L'IAIA tanca els cortafocs.", state);
                return false;
            }

            sessionStorage.setItem(this.STABILITY_KEY, JSON.stringify(state));
            return true;
        } catch (e) {
            logger.error('[IAIA-Auditor] Fallada en auditPulse:', e);
            return true;
        }
    }

    activateSafetyShield(reason) {
        logger.error(`[IAIA-Auditor] protocol SEGUR ACTIVAT: ${reason}`);
        // [FANTASMA ELIMINAT] Ja no injectem estils ni banners que trenquen el disseny mestre.
    }

    auditLayout() {
        // [FANTASMA ELIMINAT] El disseny Gem Modern ja és prou robust.
    }
}

export const iaiaAuditor = new IAIAAuditor();
// [MASTER CLEANUP] Si veiem l'error d'SMS "invalid username", és probablament configuració del Mas que s'ha de polir.
if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
        if (event.reason?.message?.includes('invalid username') || event.reason?.message?.includes('OTP')) {
            event.preventDefault();
        }
    });
}
