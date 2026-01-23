import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Move, Check, RotateCw, Loader2 } from 'lucide-react';
import './ImageReframerModal.css';

const ImageReframerModal = ({ isOpen, imageSrc, onConfirm, onClose, aspectRatio = 1 }) => {
    const [zoom, setZoom] = useState(1);
    const [minZoom, setMinZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [hasFitted, setHasFitted] = useState(false);
    const lastSrc = useRef(null);
    const containerRef = useRef(null);
    const viewportRef = useRef(null);
    const imageRef = useRef(null);

    // Construct src with cache busting ONLY when source changes
    const finalSrc = React.useMemo(() => {
        if (!imageSrc?.startsWith('http')) return imageSrc;
        return `${imageSrc}${imageSrc.includes('?') ? '&' : '?'}v=1`;
    }, [imageSrc]);


    // Initial setup and minZoom calculation when image is loaded
    const calculateInitialFitting = () => {
        if (!imageRef.current || !viewportRef.current || hasFitted) {
            return;
        }

        const img = imageRef.current;
        const viewRect = viewportRef.current.getBoundingClientRect();

        if (img.naturalWidth === 0 || img.naturalHeight === 0) {
            console.log('[Reframer] Image loaded but dimensions are 0, waiting...');
            return;
        }

        // Calculate crop factor
        const zoomX = viewRect.width / img.naturalWidth;
        const zoomY = viewRect.height / img.naturalHeight;
        const baseZoom = Math.max(zoomX, zoomY);

        console.log(`[Reframer] Success! Fitted ${img.naturalWidth}x${img.naturalHeight} with zoom ${baseZoom}`);

        // State updates are batched, but we set fitted FIRST
        setHasFitted(true);
        setMinZoom(baseZoom);
        setZoom(baseZoom);
        setOffset({ x: 0, y: 0 });
        setIsLoading(false);
        setLoadError(false);
    };

    useEffect(() => {
        if (isOpen && lastSrc.current !== imageSrc) {
            console.log('[Reframer] Source changed or initialized:', imageSrc?.substring(0, 50) + '...');
            setIsLoading(true);
            setLoadError(false);
            setHasFitted(false);
            setOffset({ x: 0, y: 0 });
            setRetryCount(0);
            lastSrc.current = imageSrc;
        } else if (!isOpen) {
            lastSrc.current = null; // Clear on close to allow re-opening same image later
        }
    }, [isOpen, imageSrc]);

    if (!isOpen) return null;

    const handleImageError = () => {
        console.error('[Reframer] Error loading image:', imageSrc);
        if (retryCount < 1) {
            // Try once without crossOrigin if it fails (might be a CORS issue)
            setRetryCount(prev => prev + 1);
        } else {
            setIsLoading(false);
            setLoadError(true);
        }
    };

    const handleMouseDown = (e) => {
        if (isLoading || loadError) return;
        setIsDragging(true);
        setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;

        setOffset({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleConfirm = () => {
        if (!imageRef.current || isLoading || loadError) return;

        const canvas = document.createElement('canvas');
        const img = imageRef.current;

        // Target dimensions based on aspect ratio
        let targetWidth, targetHeight;
        if (aspectRatio === 1) {
            targetWidth = 800;
            targetHeight = 800;
        } else {
            targetWidth = 1920;
            targetHeight = 1080;
        }

        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        const container = viewportRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const imgRect = img.getBoundingClientRect();

        // Ratio between natural size and displayed size (including current zoom)
        // Note: we use rect.width/height which is the viewport
        const scaleX = img.naturalWidth / imgRect.width;
        const scaleY = img.naturalHeight / imgRect.height;

        // Origin of the crop in the natural image
        const sx = (rect.left - imgRect.left) * scaleX;
        const sy = (rect.top - imgRect.top) * scaleY;
        const sWidth = rect.width * scaleX;
        const sHeight = rect.height * scaleY;

        try {
            ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);
            canvas.toBlob((blob) => {
                if (blob) {
                    onConfirm(blob);
                } else {
                    alert('Error al generar la imatge retallada.');
                }
            }, 'image/jpeg', 0.95);
        } catch (err) {
            console.error('[Reframer] Canvas draw error (likely CORS):', err);
            alert('Error de seguretat al processar la imatge (CORS). Si us plau, prova amb una altra imatge o puja-la de nou.');
        }
    };


    return (
        <div className="reframer-overlay">
            <div className="reframer-content">
                <header className="reframer-header">
                    <div className="header-meta">
                        <h3>Enquadrar imatge</h3>
                        <span className="aspect-info">{aspectRatio === 1 ? '1:1 Quadrat' : 'Panorama'}</span>
                    </div>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </header>

                <div
                    className="reframer-viewport-container"
                    ref={containerRef}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    <div
                        ref={viewportRef}
                        className={`reframer-viewport aspect-${aspectRatio === 1 ? '1-1' : '16-9'}`}
                        onMouseDown={handleMouseDown}
                    >
                        {isLoading && !loadError && (
                            <div className="reframer-status-overlay">
                                <Loader2 className="animate-spin" size={32} />
                                <span>Carregant editor...</span>
                            </div>
                        )}

                        {loadError && (
                            <div className="reframer-status-overlay is-error">
                                <X size={32} />
                                <span>Error al carregar la imatge</span>
                                <button className="retry-btn" onClick={() => { setRetryCount(0); setIsLoading(true); setLoadError(false); }}>Tornar a provar</button>
                            </div>
                        )}

                        <img
                            ref={imageRef}
                            src={finalSrc}
                            alt="Reframing"
                            draggable="false"
                            crossOrigin={retryCount > 0 ? undefined : "anonymous"}
                            onLoad={calculateInitialFitting}
                            onError={handleImageError}
                            style={{
                                transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                                cursor: isDragging ? 'grabbing' : 'grab',
                                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                                opacity: isLoading || loadError ? 0 : 1
                            }}
                        />

                        {!isLoading && !loadError && (
                            <div className={`viewport-overlay ${aspectRatio === 1 ? 'is-circle' : 'is-rect'}`}>
                                <div className="mask-guide"></div>
                                <div className="center-target">
                                    <Move size={24} className="move-icon" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="reframer-controls">
                    <div className="zoom-section">
                        <ZoomOut size={18} className="control-icon" />
                        <div className="slider-wrapper">
                            <input
                                type="range"
                                min={minZoom}
                                max={minZoom * 5}
                                step="0.001"
                                value={zoom}
                                disabled={isLoading || loadError}
                                onChange={(e) => setZoom(parseFloat(e.target.value))}
                            />
                            <div className="slider-track" style={{ width: `${((zoom - minZoom) / (minZoom * 4 || 1)) * 100}%` }}></div>
                        </div>
                        <ZoomIn size={18} className="control-icon" />
                    </div>

                    <div className="reframer-actions">
                        <button className="btn-cancel" onClick={onClose}>Anul·lar</button>
                        <button
                            className="btn-confirm"
                            onClick={handleConfirm}
                            disabled={isLoading || loadError}
                        >
                            <Check size={20} /> Aplicar canvis
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default ImageReframerModal;
