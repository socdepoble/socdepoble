import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Maximize, ChevronLeft, ChevronRight, Share2, Download, Shield } from 'lucide-react';
import './ImageProjector.css';

const ImageProjector = ({ items, currentIndex, onClose, onNavigate }) => {
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const imgRef = useRef(null);
    const containerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });

    const currentItem = items[currentIndex];

    useEffect(() => {
        setZoom(1);
        setPosition({ x: 0, y: 0 });
    }, [currentIndex]);

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 4));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 1));
    const handleReset = () => {
        setZoom(1);
        setPosition({ x: 0, y: 0 });
    };

    const handleMouseDown = (e) => {
        if (zoom <= 1) return;
        setIsDragging(true);
        setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        setPosition({
            x: e.clientX - startPos.x,
            y: e.clientY - startPos.y
        });
    };

    const handleMouseUp = () => setIsDragging(false);

    // Touch Support (Simplified for agentic implementation)
    const handleTouchStart = (e) => {
        if (e.touches.length === 1 && zoom > 1) {
            setIsDragging(true);
            setStartPos({ x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y });
        }
    };

    const handleTouchMove = (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        setPosition({
            x: e.touches[0].clientX - startPos.x,
            y: e.touches[0].clientY - startPos.y
        });
    };

    if (!currentItem) return null;

    return (
        <div className="projector-overlay" onClick={onClose}>
            <div className="projector-toolbar" onClick={e => e.stopPropagation()}>
                <div className="projector-info">
                    <span className="projector-counter">{currentIndex + 1} / {items.length}</span>
                    <span className="projector-label">{currentItem.context || 'Multimedia'}</span>
                    {currentItem.permissions === 'private' && <Shield size={14} color="#ff4444" />}
                </div>
                <div className="projector-actions">
                    <button onClick={handleZoomOut} disabled={zoom <= 1}><ZoomOut size={20} /></button>
                    <button onClick={handleZoomIn} disabled={zoom >= 4}><ZoomIn size={20} /></button>
                    <button onClick={() => window.open(currentItem.asset.url, '_blank')} title="Mida Real">
                        <Maximize size={20} />
                    </button>
                    <button onClick={onClose} className="close-btn"><X size={24} /></button>
                </div>
            </div>

            <div
                className="projector-stage"
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
            >
                {currentIndex > 0 && (
                    <button className="nav-btn prev" onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex - 1); }}>
                        <ChevronLeft size={40} />
                    </button>
                )}

                <div
                    className="projector-media-container"
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                        transition: isDragging ? 'none' : 'transform 0.3s ease-out'
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    {currentItem.asset.mime_type?.startsWith('image/') ? (
                        <img
                            ref={imgRef}
                            src={currentItem.asset.url}
                            alt={currentItem.context}
                            draggable="false"
                        />
                    ) : (
                        <div className="unsupported-media">
                            <p>Visualització no disponible en aquest visor</p>
                        </div>
                    )}
                </div>

                {currentIndex < items.length - 1 && (
                    <button className="nav-btn next" onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex + 1); }}>
                        <ChevronRight size={40} />
                    </button>
                )}
            </div>

            <footer className="projector-footer" onClick={e => e.stopPropagation()}>
                <p className="projector-caption">{currentItem.description || t('media.no_caption') || 'Sense descripció'}</p>
                <div className="projector-meta">
                    {new Date(currentItem.created_at).toLocaleString()}
                </div>
            </footer>
        </div>
    );
};

export default ImageProjector;
