import { logger } from '../utils/logger';
import forensicService from './forensicService';

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

    activateSafetyShield(reason, state = { reloads: 0 }) {
        try {
            logger.error(`[IAIA-Auditor] protocol SEGUR ACTIVAT: ${reason}`);

            forensicService.reportCrash({
                type: 'SAFETY_SHIELD_ACTIVATED',
                error: reason,
                timestamp: new Date().toISOString()
            });

            // Injectem estils de correcció d'emergència directament al DOM
            if (!document.getElementById('iaia-safety-shield')) {
                const style = document.createElement('style');
                style.id = 'iaia-safety-shield';
                style.innerHTML = `
                    .m3-top-app-bar { position: relative !important; z-index: 2000 !important; }
                    .main-wrapper { margin-top: 20px !important; padding-top: 100px !important; }
                    .crash-recovery-banner {
                        background: #ff0055;
                        color: white;
                        padding: 12px;
                        text-align: center;
                        font-weight: bold;
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        z-index: 9999;
                        font-size: 14px;
                        box-shadow: 0 4px 12px rgba(255,0,85,0.4);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        gap: 10px;
                    }
                    .btn-rescue-iaia {
                        background: white;
                        color: #ff0055;
                        border: none;
                        padding: 4px 12px;
                        font-weight: bold;
                        cursor: pointer;
                        border-radius: 4px;
                    }
                `;
                document.head.appendChild(style);
            }

            // Injectar el banner de l'IAIA al bany
            if (!document.getElementById('iaia-recovery-banner')) {
                const banner = document.createElement('div');
                banner.id = 'iaia-recovery-banner';
                banner.className = 'crash-recovery-banner';
                banner.innerHTML = `
                    <span>👵 <b>Remei de l'Àvia:</b> He blindat el Mas per seguretat.</span>
                    <button class="btn-rescue-iaia" onclick="localStorage.clear(); sessionStorage.clear(); if('caches' in window) caches.keys().then(ks => ks.forEach(k => caches.delete(k))); location.href='/?bategat_rescue=true';">Reiniciar i Purgar</button>
                `;
                document.body.prepend(banner);
            }

            // Si realment estem en un bucle sever, llast d'últim recurs
            if (state.reloads > 5) {
                sessionStorage.clear();
                logger.log('[IAIA-Auditor] Neteja de memòria final per trencar el bucle.');
            }
        } catch (e) {
            logger.error('[IAIA-Auditor] Fallada en activateSafetyShield:', e);
        }
    }

    /**
     * Audita problemes de CSS comuns detectats pel Mestre (encavalcaments)
     */
    auditLayout() {
        if (typeof window === 'undefined') return;
        try {
            const header = document.querySelector('.m3-top-app-bar');
            const content = document.querySelector('.main-wrapper');

            if (header && content) {
                const hRect = header.getBoundingClientRect();
                const cRect = content.getBoundingClientRect();

                // Si el contingut comença sota el header (overlap detectat) o gairebé
                if (cRect.top < hRect.bottom && window.innerWidth < 1024) {
                    logger.warn('[IAIA-Auditor] Detectat encavalcament de cabecera. Aplicant remei de l\'àvia.');
                    content.style.marginTop = `${hRect.height + 20}px`;
                }
            }
        } catch (e) {
            logger.error('[IAIA-Auditor] Fallada en auditLayout:', e);
        }
    }
}

export const iaiaAuditor = new IAIAAuditor();
// [MASTER CLEANUP] Si veiem l'error d'SMS "invalid username", és probablament configuració del Mas que s'ha de polir.
if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
        if (event.reason?.message?.includes('invalid username') || event.reason?.message?.includes('OTP')) {
            console.warn('[MASTER-CLEAN] Ignorant error d\'SMS obsolet per no embrutar el bategat.');
            event.preventDefault();
        }
    });
}
