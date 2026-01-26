import React, { useState, useRef, useEffect } from 'react';
import { Mic, X, Send, Square } from 'lucide-react';
import './VoiceRecorder.css';

const VoiceRecorder = ({ onSend, onCancel, lang = 'va' }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [duration, setDuration] = useState(0);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);
    const canvasRef = useRef(null);
    const animationFrameRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef = useRef(null);

    const [transcript, setTranscript] = useState('');

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Projecte JARVIS: Iniciar reconeixement de veu paral·lel
            try {
                const { speechService } = await import('../services/speechService');
                if (speechService.isSupported) {
                    // Passem el codi de llengua rebut per prop (va, es, gl, etc.)
                    speechService.listen(lang).then(text => {
                        setTranscript(text);
                        logger.log('[VoiceRecorder] Transcripció JARVIS:', text);
                    }).catch(err => logger.error('[VoiceRecorder] Speech error:', err));
                }
            } catch (e) {
                logger.error('[VoiceRecorder] Speech service import error:', e);
            }

            // Audio Context for visualizer
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            analyser.fftSize = 256;

            audioContextRef.current = audioContext;
            analyserRef.current = analyser;
            sourceRef.current = source;

            drawVisualizer();

            const mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const recordedDuration = duration;
                chunksRef.current = [];
                stopVisualizer();

                // Projecte JARVIS: Aturar reconeixement si encara està actiu
                try {
                    const { speechService } = await import('../services/speechService');
                    speechService.stop();
                } catch (e) { }

                // Passem el blob, la durada i la transcripció (Projecte JARVIS)
                onSend(audioBlob, recordedDuration, transcript);
            };

            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.start();
            setIsRecording(true);

            // Timer
            let seconds = 0;
            timerRef.current = setInterval(() => {
                seconds++;
                setDuration(seconds);
                if (seconds >= 120) { // Max 2 minutes
                    stopRecording();
                }
            }, 1000);

        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('No es pot accedir al micròfon. Comprova els permisos.');
            onCancel();
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            clearInterval(timerRef.current);
            setIsRecording(false);
        }
    };

    const cancelRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop(); // Stop recording
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop()); // Release mic
        }
        clearInterval(timerRef.current);
        stopVisualizer();
        chunksRef.current = [];
        setDuration(0);
        onCancel();
    };

    const drawVisualizer = () => {
        if (!analyserRef.current || !canvasRef.current) return;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const draw = () => {
            animationFrameRef.current = requestAnimationFrame(draw);
            analyserRef.current.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2;
                ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`; // Red-ish
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
        };

        draw();
    };

    const stopVisualizer = () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }
    };

    const formatDuration = (secs) => {
        const mins = Math.floor(secs / 60);
        const s = secs % 60;
        return `${mins}:${s.toString().padStart(2, '0')}`;
    };

    // Auto-start on mount if desired, but user interaction is safer.
    // We assume parent rendered this because user clicked Mic.
    // Trigger start immediately.
    useEffect(() => {
        startRecording();
        return () => {
            cancelRecording(); // Cleanup on unmount
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="voice-recorder-container" style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '0 10px' }}>
            <button onClick={cancelRecording} className="btn-cancel-voice" style={{ color: '#ef4444', background: 'none', border: 'none', padding: '8px' }}>
                <X size={24} />
            </button>

            <div className="recording-visualizer" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="recording-dot" style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444', animation: 'pulse 1s infinite' }}></div>
                <span style={{ fontFamily: 'monospace', fontSize: '14px' }}>{formatDuration(duration)}</span>
                <canvas ref={canvasRef} width={100} height={30} style={{ height: '30px', width: '100px' }}></canvas>
            </div>

            <button onClick={stopRecording} className="btn-send-voice" style={{ backgroundColor: '#25D366', color: 'white', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }}>
                <Send size={20} />
            </button>
        </div>
    );
};

export default VoiceRecorder;
