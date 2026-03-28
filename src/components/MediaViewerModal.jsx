import React, { useEffect } from 'react';
import { X, Download, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import './MediaViewerModal.css';

/**
 * MediaViewerModal - Una experiència immersiva per a veure mitjans a gran escala.
 * Compleix amb la petició de "veure a mida gran, a la seua mida".
 */
const MediaViewerModal = ({ isOpen, onClose, src, title, type = 'image' }) => {
    useEffect(() => {
        if (!isOpen) {
            document.body.style.overflow = 'unset';
            return;
        }
        
        // Guardem l'estat original del scroll
        const originalOverflow = document.body.style.overflow;
        const originalPadding = document.body.style.paddingRight;
        
        // Calculem l'ample de la scrollbar per compensar
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        
        // Cleanup complet al desmuntar o tancar
        return () => {
            document.body.style.overflow = originalOverflow || 'unset';
            document.body.style.paddingRight = originalPadding || '';
        };
    }, [isOpen]);

    // Netegem event listeners de teclat
    useEffect(() => {
        if (!isOpen) return;
        
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = src;
        link.download = `socdepoble-${title || 'imatge'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="media-viewer-overlay" onClick={onClose} aria-modal="true" role="dialog">
            <div className="media-viewer-toolbar">
                <div className="toolbar-left">
                    <span className="viewer-title">{title}</span>
                </div>
                <div className="toolbar-right">
                    <button className="toolbar-btn" onClick={(e) => { e.stopPropagation(); handleDownload(); }} title="Descarregar">
                        <Download size={20} />
                    </button>
                    <button className="toolbar-btn close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>
            </div>

            <div className="media-viewer-content" onClick={(e) => e.stopPropagation()}>
                {type === 'image' && (
                    <img
                        src={src}
                        alt={title}
                        className="viewer-main-media"
                        draggable="true"
                        onDragStart={(e) => {
                            e.dataTransfer.setData('text/uri-list', src);
                            e.dataTransfer.setData('text/plain', src);
                        }}
                    />
                )}
                {type === 'video' && (
                    <video src={src} controls className="viewer-main-media" autoPlay />
                )}
                {(type === 'pdf' || type === 'document' || type === 'presentation') && (
                    <iframe
                        src={src}
                        title={title}
                        className="viewer-main-iframe"
                        style={{ width: '100%', height: '100%', border: 'none', background: 'white' }}
                    />
                )}
            </div>

            <div className="media-viewer-footer">
                <p>Veient mitjà original • Sóc de Poble Immersion Mode</p>
            </div>
        </div>
    );
};

export default MediaViewerModal;
