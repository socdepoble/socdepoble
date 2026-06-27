import { logger } from '../../utils/logger';

/**
 * CameraService
 * Gestiona el flux multimèdia per a captures de foto i vídeo.
 * Sobirania visual Tier GOD.
 */
class CameraService {
    constructor() {
        this.stream = null;
        this.mediaRecorder = null;
        this.recordedChunks = [];
    }

    /**
     * Activa la càmera i el micròfon
     */
    async startStream(videoOptions = { facingMode: 'user' }, audio = true) {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: videoOptions,
                audio: audio
            });
            return this.stream;
        } catch (error) {
            logger.error('[CameraService] Error iniciant stream:', error);
            throw error;
        }
    }

    /**
     * Atura tots els bategats multimèdia
     */
    stopStream() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
    }

    /**
     * Captura una foto des del stream actual
     */
    capturePhoto(videoElement) {
        if (!videoElement || !this.stream) return null;

        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        return canvas.toDataURL('image/jpeg', 0.85);
    }

    /**
     * Inicia la gravació de vídeo
     */
    startRecording() {
        if (!this.stream) return;

        this.recordedChunks = [];
        this.mediaRecorder = new MediaRecorder(this.stream, {
            mimeType: 'video/webm;codecs=vp8,opus'
        });

        this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                this.recordedChunks.push(event.data);
            }
        };

        this.mediaRecorder.start();
        logger.log('[CameraService] Gravació iniciada');
    }

    /**
     * Atura la gravació i retorna el Blob de vídeo
     */
    stopRecording() {
        return new Promise((resolve) => {
            if (!this.mediaRecorder) return resolve(null);

            this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
                resolve(blob);
            };

            this.mediaRecorder.stop();
            logger.log('[CameraService] Gravació aturada');
        });
    }
}

export const cameraService = new CameraService();
export default cameraService;
