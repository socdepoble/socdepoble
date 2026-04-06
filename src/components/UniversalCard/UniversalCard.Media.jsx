import React, { useState } from 'react';
import { Image as ImageIcon, Zap } from 'lucide-react';
import ImageCarousel from '../ImageCarousel';
import Watermark from '../Watermark';

const UniversalCardMedia = ({ 
    item, 
    cardVariant,
    mediaList, 
    displayImage, 
    displayTitle, 
    openViewer 
}) => {
    // useTranslation not needed for fallback anymore
    const [hasImageError, setHasImageError] = useState(false);

    // [ANTI-CLS SKELETON] State para fade in al cargar
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const handleMediaClick = (e) => {
        e.stopPropagation();
        
        // Regla Dorada: Imatge sempre obri el visor en gran.
        if (mediaList && mediaList.length > 0) {
            openViewer(mediaList, 0);
        } else if (displayImage) {
            openViewer([{ src: displayImage, title: displayTitle, type: 'image' }], 0);
        }
    };

    const isWikipedia = cardVariant === 'pobles';
    const watermarkText = isWikipedia 
        ? "© WIKIPEDIA / WIKIMEDIA COMMONS (CC BY-SA)"
        : "© SÓC DE POBLE / FET PER LA IAIA I NANO BANANA";

    const fallbackWatermarkText = isWikipedia 
        ? "© WIKIPEDIA / WIKIMEDIA COMMONS (FALLBACK)"
        : "© SÓC DE POBLE / FET PER LA IAIA I NANO BANANA (FALLBACK)";

    return (
        <div className="relative w-full overflow-hidden cursor-pointer" onClick={handleMediaClick}>
            
            {/* SKELETON LAYER (Manejado por isImageLoaded) */}
            <div className={`absolute inset-0 z-0 bg-theme-base animate-pulse transition-opacity duration-700 ease-in-out ${isImageLoaded ? 'opacity-0' : 'opacity-100'}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-theme-muted/10 to-transparent skew-x-12 animate-pulse" />
            </div>

            {(item?.is_pinned || item?.metadata?.is_pinned) && (
                <div className="absolute top-4 right-4 z-20 bg-theme-panel/70 backdrop-blur-xl rounded-full p-2 text-[#F97316] shadow-xl select-none pointer-events-none">
                    <Zap size={16} fill="currentColor" className="drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
                </div>
            )}
            {mediaList && mediaList.length > 1 ? (
                <div className="w-full h-full relative group bg-transparent z-10 transition-opacity duration-700 ease-in-out will-change-opacity opacity-100 active:scale-[0.98]">
                    <ImageCarousel images={mediaList} onImageClick={(index) => openViewer(mediaList, index)} />
                    <div className="absolute right-3 bottom-2 z-10 pointer-events-none drop-shadow-md pb-1 font-medium text-[11px] text-white">
                        <span>{watermarkText}</span>
                    </div>
                </div>
            ) : (
                <div className="w-full h-full relative group bg-transparent z-10">
                    {(!displayImage || hasImageError) ? (
                        <Watermark variant="white" opacity={0.5} hideLogo={isWikipedia}>
                            <img 
                                src="/assets/brain/generations/nano_relleu_notext_1774284617988.png"
                                alt="Paisatge Solarpunk genèric"
                                className={`w-full aspect-square object-cover filter brightness-75 contrast-125 saturate-50 transition-all duration-700 ease-in-out will-change-transform ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                loading="lazy"
                                fetchPriority="low"
                                decoding="async"
                                onLoad={() => setIsImageLoaded(true)}
                            />
                            <div className={`absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 pointer-events-none transition-opacity duration-700 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`} />
                            <div className="absolute bottom-3 right-3 font-medium text-[11px] text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                                <span>{fallbackWatermarkText}</span>
                            </div>
                        </Watermark>
                    ) : (
                        <Watermark variant="white" opacity={0.7} hideLogo={isWikipedia}>
                            <img 
                                src={displayImage} 
                                alt={displayTitle} 
                                className={`w-full aspect-square object-cover transition-all duration-700 ease-in-out will-change-transform active:scale-[0.98] cursor-zoom-in ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                onLoad={() => setIsImageLoaded(true)}
                                onError={() => setHasImageError(true)}
                            />
                            <div className={`absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none transition-opacity duration-700 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`} />
                            <div className="absolute bottom-3 right-3 font-medium text-[11px] text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                                <span>{watermarkText}</span>
                            </div>
                        </Watermark>
                    )}
                </div>
            )}
        </div>
    );
};

export default UniversalCardMedia;
