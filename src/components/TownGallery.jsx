import React, { useState, useEffect } from 'react';
import { wikipediaService } from '../services/wikipediaService';
import { logger } from '../utils/logger';
import { Camera, User, Maximize2, X, Download } from 'lucide-react';
import './TownGallery.css';

const TownGallery = ({ townName }) => {
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadImages = async () => {
            if (!townName) return;
            setLoading(true);
            try {
                const data = await wikipediaService.getTownImages(townName);
                setImages(data || []);
            } catch (err) {
                logger.error('[TownGallery] Error loading images:', err);
            } finally {
                setLoading(false);
            }
        };
        loadImages();
    }, [townName]);

    if (loading) return <div className="gallery-loading">Carregant galeria...</div>;
    if (images.length === 0) return null;

    return (
        <div className="md3-gallery-container animate-in">
            <h3 className="m3-title-large px-4 mb-4 flex items-center gap-2">
                <Camera size={20} className="text-secondary" />
                Imatges de {townName}
            </h3>

            <div className="google-photos-grid">
                {images.map((img, idx) => (
                    <div
                        key={idx}
                        className="photo-item"
                        onClick={() => setSelectedImage(img)}
                    >
                        <img src={img.url} alt={img.title} loading="lazy" />
                        <div className="photo-overlay">
                            <Maximize2 size={18} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox MD3 */}
            {selectedImage && (
                <div className="m3-lightbox-overlay" onClick={() => setSelectedImage(null)}>
                    <div className="m3-lightbox-content" onClick={e => e.stopPropagation()}>
                        <header className="lightbox-header">
                            <button className="m3-icon-button" onClick={() => setSelectedImage(null)}>
                                <X size={24} />
                            </button>
                            <div className="lightbox-info">
                                <span className="m3-label-large">{selectedImage.artist || 'Wikimedia'}</span>
                                <span className="m3-label-small">{selectedImage.licenseShort}</span>
                            </div>
                            <a
                                href={selectedImage.descriptionUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="m3-icon-button"
                            >
                                <Download size={24} />
                            </a>
                        </header>
                        <div className="lightbox-image-wrapper">
                            <img src={selectedImage.url} alt={selectedImage.title} />
                        </div>
                        {selectedImage.description && (
                            <footer className="lightbox-footer">
                                <p className="m3-body-medium">{selectedImage.description}</p>
                            </footer>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TownGallery;
