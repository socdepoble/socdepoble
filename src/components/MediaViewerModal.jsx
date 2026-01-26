import React, { useEffect } from 'react';
import { X, Download, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import './MediaViewerModal.css';

/**
 * MediaViewerModal - Una experiència immersiva per a veure mitjans a gran escala.
 * Compleix amb la petició de "veure a mida gran, a la seua mida".
 */
const MediaViewerModal = ({ isOpen, onClose, src, title, type = 'image' }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

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
                {type === 'image' ? (
                    <img
                        src={src}
                        alt={title}
                        className="viewer-main-media"
                        draggable="true"
                        onDragStart={(e) => {
                            // Specifically allow dragging the source URL
                            e.dataTransfer.setData('text/uri-list', src);
                            e.dataTransfer.setData('text/plain', src);
                        }}
                    />
                ) : (
                    <video src={src} controls className="viewer-main-media" autoPlay />
                )}
            </div>

            <div className="media-viewer-footer">
                <p>Veient mitjà original • Sóc de Poble Immersion Mode</p>
            </div>
        </div>
    );
};

export default MediaViewerModal;
