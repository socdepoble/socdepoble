import React, { useState } from 'react';
import { Image as ImageIcon, Zap } from 'lucide-react';
import ImageCarousel from './ImageCarousel';
import Watermark from './Watermark';

const UniversalCardMedia = ({ 
    item, 
    mediaList, 
    displayImage, 
    displayTitle, 
    openViewer 
}) => {
    // useTranslation not needed for fallback anymore
    const [hasImageError, setHasImageError] = useState(false);

    const handleMediaClick = (e) => {
        e.stopPropagation();
        
        // Regla Dorada: Imatge sempre obri el visor en gran.
        if (mediaList && mediaList.length > 0) {
            openViewer(mediaList, 0);
        } else if (displayImage) {
            openViewer([{ src: displayImage, title: displayTitle, type: 'image' }], 0);
        }
    };

    return (
        <div className="card-media-wrapper relative" onClick={handleMediaClick}>
            {(item?.is_pinned || item?.metadata?.is_pinned) && (
                <div className="absolute top-4 right-4 z-20 bg-black/40 backdrop-blur-md rounded-full p-2 text-[var(--theme-accent-primary)] shadow-xl border border-white/20 select-none pointer-events-none">
                    <Zap size={16} fill="currentColor" className="zap-celestial" />
                </div>
            )}
            {mediaList && mediaList.length > 1 ? (
                <div className="w-full h-full relative group bg-var(--bg-edge)">
                    <ImageCarousel images={mediaList} onImageClick={(index) => openViewer(mediaList, index)} />
                    <div 
                        className="image-overlay-credits absolute right-2 z-10 pointer-events-none drop-shadow-md pb-1" 
                        style={{ fontSize: '11px', bottom: '4px', color: '#ffffff', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
                    >
                        © SÓC DE POBLE / FET PER LA IAIA I NANO BANANA
                    </div>
                </div>
            ) : (
                <div className="w-full h-full relative group bg-var(--bg-edge)">
                    {(!displayImage || hasImageError) ? (
                        <Watermark variant="white" opacity={0.5}>
                            <img 
                                src="/assets/brain/generations/nano_relleu_notext_1774284617988.png"
                                alt="Paisatge Solarpunk genèric"
                                className="universal-card-media filter brightness-75 contrast-125 saturate-50"
                                loading="lazy"
                            />
                            <div className="image-overlay-credits" style={{ fontSize: '11px' }}>
                                © SÓC DE POBLE / FET PER LA IAIA I NANO BANANA (FALLBACK)
                            </div>
                        </Watermark>
                    ) : (
                        <Watermark variant="white" opacity={0.7}>
                            <img 
                                src={displayImage} 
                                alt={displayTitle} 
                                className="universal-card-media" 
                                loading="lazy" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openViewer({ src: displayImage, title: displayTitle, type: 'image' });
                                }}
                                style={{ cursor: 'zoom-in' }}
                                onError={() => setHasImageError(true)}
                            />
                            <div className="image-overlay-credits" style={{ fontSize: '11px' }}>
                                © SÓC DE POBLE / FET PER LA IAIA I NANO BANANA
                            </div>
                        </Watermark>
                    )}
                </div>
            )}
        </div>
    );
};

export default UniversalCardMedia;
