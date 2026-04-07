import React, { useState } from 'react';
import { Image as ImageIcon, Zap } from 'lucide-react';
import ImageCarousel from '../ImageCarousel';
import Watermark from '../Watermark';

const UniversalCardMedia = ({ 
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


            {mediaList && mediaList.length > 1 ? (
                <div className="w-full h-full relative group bg-transparent z-10 transition-opacity duration-700 ease-in-out will-change-opacity opacity-100 active:scale-[0.98]">
                    <ImageCarousel images={mediaList} onImageClick={(index) => openViewer(mediaList, index)} />
                    <div className="absolute left-0 right-0 bottom-1 text-center z-10 pointer-events-none pb-1 font-bold text-[12px] text-black tracking-wide [text-shadow:-2px_-2px_0_rgba(255,255,255,1),2px_-2px_0_rgba(255,255,255,1),-2px_2px_0_rgba(255,255,255,1),2px_2px_0_rgba(255,255,255,1),-1px_-1px_0_rgba(255,255,255,1),1px_-1px_0_rgba(255,255,255,1),-1px_1px_0_rgba(255,255,255,1),1px_1px_0_rgba(255,255,255,1)]">
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
                            <div className="absolute left-0 right-0 bottom-1 text-center z-10 pointer-events-none pb-1 font-bold text-[12px] text-black tracking-wide [text-shadow:-2px_-2px_0_rgba(255,255,255,1),2px_-2px_0_rgba(255,255,255,1),-2px_2px_0_rgba(255,255,255,1),2px_2px_0_rgba(255,255,255,1),-1px_-1px_0_rgba(255,255,255,1),1px_-1px_0_rgba(255,255,255,1),-1px_1px_0_rgba(255,255,255,1),1px_1px_0_rgba(255,255,255,1)]">
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
                            <div className="absolute left-0 right-0 bottom-1 text-center z-10 pointer-events-none pb-1 font-bold text-[12px] text-black tracking-wide [text-shadow:-2px_-2px_0_rgba(255,255,255,1),2px_-2px_0_rgba(255,255,255,1),-2px_2px_0_rgba(255,255,255,1),2px_2px_0_rgba(255,255,255,1),-1px_-1px_0_rgba(255,255,255,1),1px_-1px_0_rgba(255,255,255,1),-1px_1px_0_rgba(255,255,255,1),1px_1px_0_rgba(255,255,255,1)]">
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
