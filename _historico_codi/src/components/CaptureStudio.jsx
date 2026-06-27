import { useState, useRef, useEffect, useCallback } from 'react';
import cameraService from '../core/services/CameraService';
import hapticService from '../core/services/hapticService';
import { logger } from '../utils/logger';
import './CaptureStudio.css';

const CaptureStudio = ({ isOpen, onClose, onCapture, mode = 'photo' }) => {
    const videoRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const [capturedMedia, setCapturedMedia] = useState(null); // { type: 'photo'|'video', url: string }
    const [loading, setLoading] = useState(true);
    const [facingMode, setFacingMode] = useState('user');

    const stopCamera = useCallback(() => {
        cameraService.stopStream();
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    }, []);

    const initCamera = useCallback(async () => {
        setLoading(true);
        try {
            const newStream = await cameraService.startStream({ facingMode });
            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
            }
        } catch (error) {
            logger.error('[CaptureStudio] Error iniciant càmera:', error);
        } finally {
            setLoading(false);
        }
    }, [facingMode]);

    useEffect(() => {
        if (isOpen) {
            initCamera();
        } else {
            stopCamera();
        }
        return () => stopCamera();
    }, [isOpen, initCamera, stopCamera]);

    const toggleCamera = () => {
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
        hapticService.batec();
    };

    const takePhoto = () => {
        const dataUrl = cameraService.capturePhoto(videoRef.current);
        if (dataUrl) {
            setCapturedMedia({ type: 'photo', url: dataUrl });
            hapticService.notifyAIReady();
        }
    };

    const startVideo = () => {
        cameraService.startRecording();
        setIsRecording(true);
        hapticService.batec();
    };

    const stopVideo = async () => {
        setIsRecording(false);
        const videoBlob = await cameraService.stopRecording();
        if (videoBlob) {
            const url = URL.createObjectURL(videoBlob);
            setCapturedMedia({ type: 'video', url, blob: videoBlob });
            hapticService.notifySuccess();
        }
    };

    const handleConfirm = () => {
        onCapture(capturedMedia);
        onClose();
    };

    const handleRetake = () => {
        if (capturedMedia?.type === 'video' && capturedMedia.url) {
            URL.revokeObjectURL(capturedMedia.url);
        }
        setCapturedMedia(null);
        hapticService.batec();
    };

    if (!isOpen) return null;

    return (
        <div className="capture-studio-overlay">
            <div className="capture-studio-container">
                <header className="capture-header">
                    <button className="icon-btn" onClick={onClose}><X size={24} /></button>
                    <div className="capture-title">ESTUDI BATEGAT</div>
                    <button className="icon-btn" onClick={toggleCamera}><RefreshCcw size={24} /></button>
                </header>

                <div className="camera-view-port">
                    {!capturedMedia ? (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className={`live-video ${facingMode === 'user' ? 'mirror' : ''}`}
                        />
                    ) : (
                        <div className="preview-container">
                            {capturedMedia.type === 'photo' ? (
                                <img src={capturedMedia.url} alt="Captured" className="media-preview" />
                            ) : (
                                <video src={capturedMedia.url} autoPlay loop playsInline className="media-preview" />
                            )}
                        </div>
                    )}

                    {loading && <div className="camera-loading">🏺</div>}

                    {isRecording && (
                        <div className="recording-indicator">
                            <div className="red-dot"></div>
                            <span>GRAVANT BATEGAT...</span>
                        </div>
                    )}
                </div>

                <footer className="capture-footer">
                    {!capturedMedia ? (
                        <div className="capture-controls">
                            {mode === 'all' || mode === 'photo' ? (
                                <button className="capture-btn photo-btn" onClick={takePhoto}>
                                    <div className="inner-circle"></div>
                                </button>
                            ) : null}

                            {(mode === 'all' || mode === 'video') && (
                                <button
                                    className={`capture-btn video-btn ${isRecording ? 'recording' : ''}`}
                                    onClick={isRecording ? stopVideo : startVideo}
                                >
                                    {isRecording ? <Square fill="currentColor" size={24} /> : <Video size={32} />}
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="confirm-controls">
                            <button className="studio-btn secondary" onClick={handleRetake}>
                                <RefreshCcw size={20} /> REPETIR
                            </button>
                            <button className="studio-btn primary-batec" onClick={handleConfirm}>
                                <Check size={20} /> CONFIRMAR
                            </button>
                        </div>
                    )}
                </footer>
            </div>
        </div>
    );
};

export default CaptureStudio;
