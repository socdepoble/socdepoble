import { APP_VERSION } from '../constants';
import { logger } from '../utils/logger';

/**
 * CloudErrorReporting: Envia errors crítics al panell de Google Cloud.
 * Basat en la documentació de Google Cloud Error Reporting API.
 */
class CloudErrorReporting {
    constructor() {
        // Aquests valors haurien de venir de variables d'entorn en producció real,
        // però els deixem preparats per a la configuració del Mestre.
        this.apiKey = import.meta.env.VITE_GCLOUD_API_KEY || '';
        this.projectId = import.meta.env.VITE_GCLOUD_PROJECT_ID || 'soc-de-poble';
        this.enabled = !!this.apiKey;
    }

    /**
     * Reporta un error al núvol de Google.
     * @param {Error|string} error L'error detectat.
     * @param {Object} context Metadades addicionals (ruta, usuari, etc.).
     */
    async report(error, context = {}) {
        if (!this.enabled) {
            // No alertem si no està configurat per no embrutar la consola
            return;
        }

        const message = error instanceof Error ? error.stack || error.message : String(error);
        const payload = {
            serviceContext: {
                service: 'soc-de-poble-web',
                version: APP_VERSION
            },
            message: message,
            context: {
                httpRequest: {
                    url: window.location.href,
                    userAgent: navigator.userAgent
                },
                user: context.userId || 'anonymous',
                ...context
            }
        };

        try {
            const url = `https://clouderrorreporting.googleapis.com/v1beta1/projects/${this.projectId}/events:report?key=${this.apiKey}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                logger.warn('[CloudError] Fallada en enviar report:', await response.text());
            }
        } catch (e) {
            logger.error('[CloudError] Error en el transport del report:', e);
        }
    }
}

export const cloudErrorReporting = new CloudErrorReporting();
