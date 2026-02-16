import { useState, useEffect, useCallback } from 'react';
import { logger } from '../utils/logger';

export const useTextToSpeech = () => {
    // Initialize state from window if available to avoid setState in Effect
    const [isSupported] = useState(() => 'speechSynthesis' in window);
    const [isPlaying, setIsPlaying] = useState(false);
    const [voice, setVoice] = useState(null);

    useEffect(() => {
        if (isSupported) {
            const loadVoices = () => {
                const voices = window.speechSynthesis.getVoices();
                const preferredVoice = voices.find(v =>
                    v.lang.includes('ca') || 
                    v.lang.includes('es-ES') || 
                    v.lang.includes('es')
                );
                setVoice(preferredVoice || voices[0]);
            };

            loadVoices();
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, [isSupported]);

    const speak = useCallback((text, lang = 'ca-ES') => {
        if (!isSupported || !text) return;

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voice;
        utterance.lang = lang;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = (err) => {
            logger.error('[TTS] Error:', err);
            setIsPlaying(false);
        };

        window.speechSynthesis.speak(utterance);
    }, [isSupported, voice]);

    const stop = useCallback(() => {
        if (isSupported) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
        }
    }, [isSupported]);

    return {
        isSupported,
        isPlaying,
        speak,
        stop
    };
};
