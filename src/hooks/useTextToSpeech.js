import { useState, useEffect, useCallback } from 'react';
import { logger } from '../utils/logger';

export const useTextToSpeech = () => {
    const [isSupported, setIsSupported] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [voice, setVoice] = useState(null);

    useEffect(() => {
        if ('speechSynthesis' in window) {
            setIsSupported(true);
            // Load voices
            const loadVoices = () => {
                const voices = window.speechSynthesis.getVoices();
                // Try to find a Spanish/Valencian voice
                const preferredVoice = voices.find(v =>
                    v.lang.includes('ca') || // Catalan/Valencian
                    v.lang.includes('es-ES') || // Spanish (Spain)
                    v.lang.includes('es')
                );
                setVoice(preferredVoice || voices[0]);
            };

            loadVoices();
            window.speechSynthesis.onvoiceschanged = loadVoices;
        } else {
            logger.warn('[TTS] Web Speech API not supported');
        }
    }, []);

    const speak = useCallback((text, lang = 'ca-ES') => {
        if (!isSupported || !text) return;

        // Cancel any current speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voice;
        utterance.lang = lang; // 'ca-ES' for Valencian, 'es-ES' for Spanish
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        utterance.onstart = () => {
            setIsPlaying(true);
            setIsPaused(false);
        };

        utterance.onend = () => {
            setIsPlaying(false);
            setIsPaused(false);
        };

        utterance.onerror = (err) => {
            logger.error('[TTS] Error:', err);
            setIsPlaying(false);
            setIsPaused(false);
        };

        window.speechSynthesis.speak(utterance);
    }, [isSupported, voice]);

    const stop = useCallback(() => {
        if (isSupported) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            setIsPaused(false);
        }
    }, [isSupported]);

    return {
        isSupported,
        isPlaying,
        speak,
        stop
    };
};
