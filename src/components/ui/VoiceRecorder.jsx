import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { logger } from '../../utils/logger';
import './VoiceRecorder.css';
const VoiceRecorder = ({
  onSend,
  onCancel,
  lang = 'va'
}) => {
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
  const isCancelledRef = useRef(false);
  const durationRef = useRef(0);
  const transcriptRef = useRef('');
  const speechPromiseRef = useRef(null);
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
      if (isCancelledRef.current) {
        logger.warn('[VoiceRecorder] Cancelled before stream initialization. Stopping tracks.');
        stream.getTracks().forEach(track => track.stop());
        return;
      }
      try {
        const {
          speechService
        } = await import('../../core/services/speechService');
        if (speechService.isSupported && !speechService.isStarted) {
          speechPromiseRef.current = speechService.listen(lang);
          speechPromiseRef.current.then(text => {
            transcriptRef.current = text;
            logger.log('[VoiceRecorder] Transcripció JARVIS:', text);
          }).catch(err => {
            // Només un log, no trenquem l'execució.
            logger.info('[VoiceRecorder] Speech result:', err);
          });
        }
      } catch {
        logger.error('[VoiceRecorder] Speech service import error');
      }
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
      mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      mediaRecorder.onstop = async () => {
        if (isCancelledRef.current) {
          chunksRef.current = [];
          return; // Prevent orphaned onSend triggers if cancelled
        }
        const mimeType = chunksRef.current[0] ? chunksRef.current[0].type : 'audio/webm';
        const audioBlob = new Blob(chunksRef.current, {
          type: mimeType
        });

        // Obtenim resultats segurs sense bloquejos infinits
        chunksRef.current = [];
        stopVisualizer();
        try {
          const {
            speechService
          } = await import('../../core/services/speechService');
          speechService.stop();
        } catch {
          // Fail silent
        }

        // Timeout de seguretat de 500ms per a la promesa de veu, per evitar bloquejos infinits
        let finalTranscript = transcriptRef.current;
        if (speechPromiseRef.current) {
          try {
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 500));
            const text = await Promise.race([speechPromiseRef.current, timeoutPromise]);
            if (text && typeof text === 'string') {
              finalTranscript = text;
            }
          } catch (err) {
            logger.warn('[VoiceRecorder] Resolta transcripció amb fallback o timeout.', err);
          }
        }

        // Cridem externalment, la durada ja s'ha guardat a l'estat, però onstop agafava el closure inicial (0).
        // Per tant usarem transcriptRef.current per a la transcripció segura.
        // Usarem durationRef.current per la durada de la gravació
        onSend(audioBlob, durationRef.current || 1, finalTranscript);
      };
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      let seconds = 0;
      durationRef.current = 0;
      timerRef.current = setInterval(() => {
        seconds++;
        durationRef.current = seconds;
        setDuration(seconds);
        if (seconds >= 120) {
          stopRecording();
        }
      }, 1000);
    } catch (error) {
      logger.error('Error accessing microphone:', error);
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
  const cancelRecording = (triggerParentState = true) => {
    isCancelledRef.current = true;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (mediaRecorderRef.current?.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    clearInterval(timerRef.current);
    stopVisualizer();
    chunksRef.current = [];
    setDuration(0);
    transcriptRef.current = '';
    try {
      import('../../core/services/speechService').then(({
        speechService
      }) => speechService.stop());
    } catch {
      // ignore
    }
    if (triggerParentState) {
      onCancel();
    }
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
      const barWidth = canvas.width / bufferLength * 2.5;
      let barHeight;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;
        ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
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
      audioContextRef.current.close().catch(() => {});
    }
  };
  const formatDuration = secs => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s.toString().padStart(2, '0')}`;
  };
  const {
    t
  } = useTranslation();
  useEffect(() => {
    startRecording();
    return () => {
      cancelRecording(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div className="flex items-center gap-2 w-full py-1">
            <button onClick={cancelRecording} className="p-3 text-red-500 hover:bg-red-500/10 rounded-full transition-colors btn-tactile shrink-0">
                <X size={28} strokeWidth={2.5} />
            </button>

            <div className="flex-1 flex items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-[28px] h-[52px] px-4 animate-pulse relative overflow-hidden border border-red-200 dark:border-red-900/50">
                <div className="flex items-center gap-3 z-10">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-ping"></div>
                    <span className="font-['Noto_Sans'] font-bold text-red-600 dark:text-red-400 text-[15px] sm:text-[16px] uppercase tracking-wider">
                        {t('chat.recording_msg', 'Gravant...')} <span className="font-mono ml-1">{formatDuration(duration)}</span>
                    </span>
                </div>
            </div>

            <button onClick={stopRecording} className="w-[52px] h-[52px] shrink-0 bg-[#25D366] hover:bg-[#1DA851] text-white rounded-full shadow-[0_4px_12px_rgba(37,211,102,0.3)] flex items-center justify-center btn-tactile transition-transform active:scale-95 ml-1">
                <Send size={24} strokeWidth={2.5} className="ml-1" />
            </button>
        </div>;
};
export default VoiceRecorder;