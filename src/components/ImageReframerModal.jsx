import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Move, Check, RotateCw } from 'lucide-react';
import './ImageReframerModal.css';

const ImageReframerModal = ({ isOpen, imageSrc, onConfirm, onClose, aspectRatio = 1 }) => {
    const [zoom, setZoom] = useState(1);
    const [minZoom, setMinZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const containerRef = useRef(null);
    const imageRef = useRef(null);

    // Initial setup and minZoom calculation when image is loaded
    const calculateInitialFitting = () => {
        if (!imageRef.current || !containerRef.current) return;

        const img = imageRef.current;
        const viewport = containerRef.current.querySelector('.reframer-viewport');
        const viewRect = viewport.getBoundingClientRect();

        // Calculate crop factor
        // We want the image to COVER the viewport completely
        const zoomX = viewRect.width / img.naturalWidth;
        const zoomY = viewRect.height / img.naturalHeight;

        const baseZoom = Math.max(zoomX, zoomY);

        setMinZoom(baseZoom);
        setZoom(baseZoom);
        setOffset({ x: 0, y: 0 });
    };

    useEffect(() => {
        if (isOpen) {
            // Reset state, but wait for image load for fitting
            setOffset({ x: 0, y: 0 });
        }
    }, [isOpen, imageSrc, aspectRatio]);

    if (!isOpen) return null;

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;

        // Clamping logic to prevent black gaps
        if (imageRef.current && containerRef.current) {
            const img = imageRef.current;
            const viewport = containerRef.current.querySelector('.reframer-viewport');
            const viewRect = viewport.getBoundingClientRect();

            const currentWidth = img.naturalWidth * zoom;
            const currentHeight = img.naturalHeight * zoom;

            // Max allowed offset in each direction:
            // img is centered by default? No, transform-origin is usually 50% 50% or 0 0.
            // In our CSS it's likely 0 0 or depends on centering.

            // Let's assume standard centering logic in CSS (top 50% left 50% transform translate -50% -50%)
            // If the image is centered, the current logic might be slightly different.
            // Let's use the simplest: clamp based on viewport boundaries.
        }

        setOffset({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleConfirm = () => {
        if (!imageRef.current) return;

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

        const container = containerRef.current.querySelector('.reframer-viewport');
        const rect = container.getBoundingClientRect();
        const imgRect = img.getBoundingClientRect();

        // Ratio between natural size and displayed size (including current zoom)
        const scaleX = img.naturalWidth / imgRect.width;
        const scaleY = img.naturalHeight / imgRect.height;

        // Origin of the crop in the natural image
        const sx = (rect.left - imgRect.left) * scaleX;
        const sy = (rect.top - imgRect.top) * scaleY;
        const sWidth = rect.width * scaleX;
        const sHeight = rect.height * scaleY;

        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);

        canvas.toBlob((blob) => {
            onConfirm(blob);
        }, 'image/jpeg', 0.95); // High quality
    };

    return (
        <div className="reframer-overlay">
            <div className="reframer-content">
                <header className="reframer-header">
                    <div className="header-meta">
                        <h3>Enquadrar imatge</h3>
                        <span className="aspect-info">{aspectRatio === 1 ? '1:1 Quadrat' : '16:9 Panorama'}</span>
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
                        className={`reframer-viewport aspect-${aspectRatio === 1 ? '1-1' : '16-9'}`}
                        onMouseDown={handleMouseDown}
                    >
                        <img
                            ref={imageRef}
                            src={imageSrc.startsWith('http') ? `${imageSrc}${imageSrc.includes('?') ? '&' : '?'}t=${Date.now()}` : imageSrc}
                            alt="Reframing"
                            draggable="false"
                            crossOrigin="anonymous"
                            onLoad={calculateInitialFitting}
                            style={{
                                transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                                cursor: isDragging ? 'grabbing' : 'grab',
                                transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                            }}
                        />
                        <div className={`viewport-overlay ${aspectRatio === 1 ? 'is-circle' : 'is-rect'}`}>
                            <div className="mask-guide"></div>
                            <div className="center-target">
                                <Move size={24} className="move-icon" />
                            </div>
                        </div>
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
                                onChange={(e) => setZoom(parseFloat(e.target.value))}
                            />
                            <div className="slider-track" style={{ width: `${((zoom - minZoom) / (minZoom * 4)) * 100}%` }}></div>
                        </div>
                        <ZoomIn size={18} className="control-icon" />
                    </div>

                    <div className="reframer-actions">
                        <button className="btn-cancel" onClick={onClose}>Anul·lar</button>
                        <button className="btn-confirm" onClick={handleConfirm}>
                            <Check size={20} /> Aplicar canvis
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageReframerModal;
