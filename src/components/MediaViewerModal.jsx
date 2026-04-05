import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import './MediaViewerModal.css';

/**
 * MediaViewerModal - Una experiència immersiva per a veure mitjans a gran escala.
 * Ara amb suport per a carrusel d'imatges amb navegació completa.
 */
const MediaViewerModal = ({ isOpen, onClose, src, title, type = 'image', images = [], onNavigate }) => {
    const hasCarousel = images && images.length > 1 && type === 'image';
    
    // Initialize currentIndex correctly based on the incoming src
    const initialIndex = hasCarousel ? Math.max(0, images.findIndex(img => img === src)) : 0;
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [prevSrc, setPrevSrc] = useState(src);

    // Derived state pattern per a sincronitzar l'índex quan s'obri amb un src nou
    if (src !== prevSrc) {
        setPrevSrc(src);
        if (hasCarousel) {
            const idx = images.findIndex(img => img === src);
            if (idx !== -1) setCurrentIndex(idx);
        }
    }

    const handleNext = useCallback((e) => {
        if (e) e.stopPropagation();
        if (hasCarousel) {
            const nextIdx = (currentIndex + 1) % images.length;
            setCurrentIndex(nextIdx);
            if (onNavigate) onNavigate(images[nextIdx]);
        }
    }, [currentIndex, images, hasCarousel, onNavigate]);

    const handlePrev = useCallback((e) => {
        if (e) e.stopPropagation();
        if (hasCarousel) {
            const prevIdx = (currentIndex - 1 + images.length) % images.length;
            setCurrentIndex(prevIdx);
            if (onNavigate) onNavigate(images[prevIdx]);
        }
    }, [currentIndex, images, hasCarousel, onNavigate]);

    // Ancoratge de seguretat per fixar el scroll del cos quan el modal està obert
    useEffect(() => {
        if (isOpen) {
            const originalStyle = window.getComputedStyle(document.body).overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = originalStyle;
            };
        }
    }, [isOpen]);

    // Netegem event listeners de teclat
    useEffect(() => {
        if (!isOpen) return;
        
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
            if (hasCarousel) {
                if (e.key === 'ArrowRight') handleNext();
                if (e.key === 'ArrowLeft') handlePrev();
            }
        };
        
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, hasCarousel, handleNext, handlePrev]);

    if (!isOpen) return null;

    const currentSrc = hasCarousel ? images[currentIndex] : src;

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = currentSrc;
        link.download = `socdepoble-${title || 'imatge'}${hasCarousel ? `-${currentIndex + 1}` : ''}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const modalContent = (
        <div className="media-viewer-overlay" onClick={onClose}>
            <div className="media-viewer-toolbar" onClick={(e) => e.stopPropagation()}>
                <div className="toolbar-left">
                    <span className="viewer-title">{title} {hasCarousel && <span className="text-[var(--theme-accent-primary)] opacity-80 text-[10px] md:text-sm ml-2 font-mono" style={{verticalAlign: 'middle'}}>({currentIndex + 1} / {images.length})</span>}</span>
                </div>
                <div className="toolbar-right">
                    {type === 'image' && (
                        <button className="toolbar-btn" onClick={handleDownload} title="Descarregar">
                            <Download size={24} strokeWidth={2.5} />
                        </button>
                    )}
                    <button className="toolbar-btn close" onClick={onClose} title="Tancar">
                        <X size={24} strokeWidth={2.5} />
                    </button>
                </div>
            </div>

            <div className="media-viewer-content" onClick={(e) => e.stopPropagation()}>
                {hasCarousel && (
                    <button className="nav-arrow nav-left" onClick={handlePrev} title="Anterior" aria-label="Imatge Anterior">
                        <ChevronLeft size={36} />
                    </button>
                )}

                {type === 'image' && (
                    <img
                        src={currentSrc}
                        alt={title}
                        className="viewer-main-media"
                        draggable="true"
                        onDragStart={(e) => {
                            e.dataTransfer.setData('text/uri-list', currentSrc);
                            e.dataTransfer.setData('text/plain', currentSrc);
                        }}
                    />
                )}
                
                {hasCarousel && (
                    <button className="nav-arrow nav-right" onClick={handleNext} title="Següent" aria-label="Imatge Següent">
                        <ChevronRight size={36} />
                    </button>
                )}

                {type === 'map' && src && (
                    <iframe
                        src={src}
                        className="viewer-main-iframe"
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Mapa interactiu local"
                    ></iframe>
                )}
            </div>
            
            <div className="media-viewer-footer" onClick={(e) => e.stopPropagation()}>
                {type === 'image' ? (hasCarousel ? 'Usa les fletxes de navegació. Clic fora per tancar.' : 'Mantín per desa o copia. Clic fora per tancar.') : 'Navega lliurement pel mapa local.'}
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default MediaViewerModal;

