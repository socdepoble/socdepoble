import { logger } from '../utils/logger';

/**
 * ForensicService: El vigilant del bategat.
 * Captura errors crítics i els prepara per a que l'IAIA els reporte al Mestre.
 */
class ForensicService {
    constructor() {
        this.STORAGE_KEY = 'sp_forensic_reports';
        if (typeof window !== 'undefined') {
            window.__SILENCE_FORENSIC__ = window.location.hostname === 'localhost';
        }
    }

    reportCrash(data) {
        const reports = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
        const newReport = {
            id: crypto.randomUUID(),
            ...data,
            reported_at: new Date().toISOString()
        };

        reports.push(newReport);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reports.slice(-10))); // Guardem els darrers 10

        logger.log('[Forensic] Report bategat al sistema:', newReport.id);

        // [PROTOCOLO PREGONER - BATEGAT AUTOMÀTIC]
        // Si estem en local, enviem l'error al Pregoner de l'Antigravity (Port 9001)
        if (typeof window !== 'undefined' && 
            (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') &&
            !window.__SILENCE_FORENSIC__
        ) {
            fetch('http://localhost:9001', {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newReport)
            }).catch(() => {
                // Sileci total si el pregoner no està viu
            });
        }

        // [IAIA ALERT TRIGGER]
        window.dispatchEvent(new CustomEvent('iaia-forensic-alert', { detail: newReport }));
    }

    getLatestReports() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    }

    clearReports() {
        localStorage.removeItem(this.STORAGE_KEY);
    }
}

const forensicService = new ForensicService();
export default forensicService;
