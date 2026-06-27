import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * 🌪️ HOOK IAIA VOZ (Prototipo Funcional V13)
 * Módulo de detección de capacidades y transcripción offline/online.
 * Para este PoC, implementamos el Web Speech API nativo con detección
 * y mockeamos el pipeline de WebGPU.
 */
export const useIAIAVoz = () => {
    const [status, setStatus] = useState('idle'); // idle | loading | ready | listening | processing | error
    const [transcript, setTranscript] = useState('');
    const [strategy, setStrategy] = useState(null);
    const recognitionRef = useRef(null);

    // ── Instanciar Web Speech API si el PC/Móvil es antiguo y lo admite
    const initialize = useCallback(async () => {
        if (status === 'loading') return;
        setStatus('loading');
        
        // Simular un chequeo de WebGPU para el SandBox
        await new Promise(resolve => setTimeout(resolve, 800));

        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SR) {
            recognitionRef.current = new SR();
            recognitionRef.current.lang = 'ca-ES'; // Valencià/Català
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            
            recognitionRef.current.onresult = (event) => {
                const finalTranscript = Array.from(event.results)
                    .map(r => r[0].transcript)
                    .join('');
                setTranscript(finalTranscript.trim());
            };

            recognitionRef.current.onend = () => {
                setStatus('ready');
            };

            recognitionRef.current.onerror = (e) => {
                console.error('[IAIA Voz] Error:', e.error);
                if(e.error !== 'no-speech') setStatus('error');
            };

            setStrategy('web-speech');
            setStatus('ready');
        } else {
            console.warn('[IAIA Voz] Web Speech API no soportada en este navegador. Cayendo a fallback (SIMULADO)');
            setStrategy('record-and-queue');
            setStatus('ready');
        }
    }, [status]);

    const startListening = useCallback(async () => {
        if (status !== 'ready' && status !== 'idle') return;
        if (status === 'idle') {
            await initialize();
        }
        
        setTranscript('');
        setStatus('listening');

        if (recognitionRef.current) {
            try {
                recognitionRef.current.start();
            } catch {
                // Ya estaba iniciado
            }
        }
    }, [status, initialize]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setStatus(prev => prev === 'listening' ? 'processing' : prev);
        
        // Simulamos un delay de procesado cognitivo local
        setTimeout(() => {
            setStatus('ready');
        }, 600);
    }, []);

    // Desmontar
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    return { 
        status, 
        transcript, 
        strategy, 
        initialize, 
        startListening, 
        stopListening 
    };
};
