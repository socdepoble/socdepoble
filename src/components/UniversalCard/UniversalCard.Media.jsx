import { useState, useEffect } from 'react';
import Watermark from '../ui/Watermark';
import ImageCarousel from '../ui/ImageCarousel';

const UniversalCardMedia = ({ 
    cardVariant,
    mediaList, 
    displayImage, 
    displayTitle, 
    openViewer,
    aspectMode = 'square'
}) => {
    // useTranslation not needed for fallback anymore
    const [hasImageError, setHasImageError] = useState(false);

    // [ANTI-CLS SKELETON] State para fade in al cargar
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    useEffect(() => {
        if (mediaList && mediaList.length > 1) {
            setIsImageLoaded(true);
        }
    }, [mediaList]);

    const handleMediaClick = (e) => {
        e.stopPropagation();
        
        // Regla Dorada: Imatge sempre obri el visor en gran.
        if (mediaList && mediaList.length > 0) {
            openViewer({
                src: mediaList[0],
                title: displayTitle,
                type: 'image',
                images: mediaList
            });
        } else if (displayImage) {
            openViewer({
                src: displayImage, 
                title: displayTitle, 
                type: 'image'
            });
        }
    };

    const isWikipedia = cardVariant === 'pobles';
    const isMarket = cardVariant === 'market' || cardVariant === 'mercat' || cardVariant === 'product';
    
    const isSquare = aspectMode === 'square';
    const isVideo = aspectMode === 'video';
    const isAuto = aspectMode === 'auto';

    const wrapperClasses = `w-full relative group bg-transparent z-10 ${
        isSquare ? 'aspect-square' : isVideo ? 'aspect-video' : 'h-auto aspect-auto'
    }`;

    const innerClasses = `w-full ${isSquare || isVideo ? 'h-full object-cover' : 'h-auto object-contain'}`;

    return (
        <Watermark hideLogo={!isMarket} variant="white" position="top-right" opacity={0.7}>
            <div className="relative w-full overflow-hidden cursor-pointer" onClick={handleMediaClick}>
            
            {/* SKELETON LAYER (Manejado por isImageLoaded) */}
            <div className={`absolute inset-0 z-0 bg-theme-base animate-pulse transition-opacity duration-700 ease-in-out ${isImageLoaded ? 'opacity-0' : 'opacity-100'}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-theme-muted/10 to-transparent skew-x-12 animate-pulse" />
            </div>

            {mediaList && mediaList.length > 1 ? (
                <div className={`w-full flex flex-col relative group bg-transparent z-10 transition-opacity duration-700 ease-in-out will-change-opacity opacity-100 active:scale-[0.98] ${isSquare ? 'aspect-square' : isVideo ? 'aspect-video' : ''}`}>
                    <div className="w-full h-full relative bg-black/5 dark:bg-white/5">
                        <ImageCarousel 
                            images={mediaList} 
                            onImageClick={(index) => {
                                openViewer({
                                    src: mediaList[index],
                                    title: displayTitle,
                                    type: 'image',
                                    images: mediaList
                                });
                            }} 
                            aspectMode={aspectMode} 
                        />
                    </div>
                </div>
            ) : (
                <div className={wrapperClasses}>
                    {(!displayImage || hasImageError) ? (
                        <div className="w-full h-full relative">
                            <img 
                                src="/assets/brand/hero_square.png"
                                alt="Paisatge Solarpunk genèric"
                                className={`${innerClasses} bg-black/5 dark:bg-white/5 filter brightness-75 contrast-125 saturate-50 transition-all duration-700 ease-in-out will-change-transform ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                loading="lazy"
                                fetchPriority="low"
                                decoding="async"
                                onLoad={() => setIsImageLoaded(true)}
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full relative">
                            <img 
                                src={displayImage} 
                                alt={displayTitle} 
                                className={`${innerClasses} transition-all duration-700 ease-in-out will-change-transform active:scale-[0.98] cursor-zoom-in ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                onLoad={() => setIsImageLoaded(true)}
                                onError={() => setHasImageError(true)}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
        </Watermark>
    );
};

export default UniversalCardMedia;
