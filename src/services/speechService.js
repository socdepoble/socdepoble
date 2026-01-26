import { logger } from '../utils/logger';

class SpeechService {
    constructor() {
        this.recognition = null;
        this.isSupported = false;

        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                this.recognition = new SpeechRecognition();
                this.isSupported = true;

                // Configuración optimitzada per a valencià/català
                this.recognition.continuous = false;
                this.recognition.interimResults = true;
                this.recognition.lang = 'ca-ES';
            }
        }
    }

    /**
     * Inicia l'escolta i retorna una promesa amb el text transcrit.
     * @param {string} langCode - Codi d'idioma de l'app (va, es, gl, eu, en, fr, de, it)
     */
    listen(langCode = 'va') {
        if (!this.isSupported) {
            return Promise.reject('El reconeixement de veu no és compatible amb aquest navegador.');
        }

        // Mapeig de codis APP a codis BCP 47 (Speech Recognition)
        const langMap = {
            'va': 'ca-ES',
            'es': 'es-ES',
            'gl': 'gl-ES',
            'eu': 'eu-ES',
            'en': 'en-US',
            'fr': 'fr-FR',
            'de': 'de-DE',
            'it': 'it-IT'
        };

        this.recognition.lang = langMap[langCode] || 'ca-ES';
        logger.log(`[SpeechService] Escoltant en: ${this.recognition.lang}`);

        return new Promise((resolve, reject) => {
            let finalTranscript = '';

            this.recognition.onresult = (event) => {
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }

                // Podríem enviar esdeveniments de "interim" si volguérem feedback visual en temps real
            };

            this.recognition.onend = () => {
                if (finalTranscript) {
                    resolve(finalTranscript);
                } else {
                    reject('No s\'ha detectat cap veu.');
                }
            };

            this.recognition.onerror = (event) => {
                logger.error('[SpeechService] Error:', event.error);
                reject(event.error);
            };

            this.recognition.start();
        });
    }

    /**
     * Atura l'escolta manualment.
     */
    stop() {
        if (this.recognition) {
            this.recognition.stop();
        }
    }
}

export const speechService = new SpeechService();
