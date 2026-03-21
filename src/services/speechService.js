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
                this.isStarted = false;

                this.recognition.continuous = false;
                this.recognition.interimResults = true;
                this.recognition.lang = 'ca-ES';

                this.recognition.onstart = () => {
                    this.isStarted = true;
                    logger.log('[SpeechService] Recognition started.');
                };

                this.recognition.onend = () => {
                    this.isStarted = false;
                    logger.log('[SpeechService] Recognition ended.');
                };
            }
        }
    }

    listen(langCode = 'va') {
        if (!this.isSupported) {
            return Promise.reject('El reconeixement de veu no és compatible amb aquest navegador.');
        }

        if (this.isStarted) {
            logger.warn('[SpeechService] Listen called but already started. Skipping start().');
            return Promise.resolve('Reconeixement ja en marxa.');
        }

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
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
            };

            this.recognition.onend = () => {
                this.isStarted = false;
                if (finalTranscript) {
                    resolve(finalTranscript);
                } else {
                    reject('No s\'ha detectat cap veu.');
                }
            };

            this.recognition.onerror = (event) => {
                this.isStarted = false;
                logger.error('[SpeechService] Error:', event.error);
                reject(event.error);
            };

            try {
                this.recognition.start();
                this.isStarted = true;
            } catch (e) {
                this.isStarted = false;
                logger.error('[SpeechService] Fatal start error:', e);
                reject(e);
            }
        });
    }

    stop() {
        if (this.recognition && this.isStarted) {
            try {
                this.recognition.stop();
                this.isStarted = false;
            } catch (e) {
                logger.warn('[SpeechService] Error stopping recognition:', e);
            }
        }
    }

    speak(text, langCode = 'va') {
        if (typeof window === 'undefined' || !window.speechSynthesis) {
            logger.warn('[SpeechService] La síntesi de veu no és compatible.');
            return;
        }

        window.speechSynthesis.cancel();
        
        // [HOTFIX] iOS Safari Speech Limit Bug: Truncament de cadena per trossos naturals.
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        
        const langMap = {
            'va': 'ca-ES',
            'es': 'es-ES',
            'en': 'en-US'
        };
        const voiceLang = langMap[langCode] || 'ca-ES';

        sentences.forEach(sentence => {
            const utterance = new SpeechSynthesisUtterance(sentence.trim());
            utterance.lang = voiceLang;
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
        });
    }
}

export const speechService = new SpeechService();
