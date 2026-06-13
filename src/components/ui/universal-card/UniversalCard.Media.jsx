import { useState, useEffect } from 'react';
import Watermark from '../../ui/Watermark';
import ImageCarousel from '../../ui/ImageCarousel';
import UniversalVideo from '../universal-video/UniversalVideo';

const UniversalCardMedia = ({ 
    cardVariant,
    mediaList, 
    displayImage, 
    displayTitle, 
    openViewer,
    aspectMode = 'square',
    videoUrl
}) => {
    // useTranslation not needed for fallback anymore
    const [hasImageError, setHasImageError] = useState(false);

    // [ANTI-CLS SKELETON] State para fade in al cargar
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    useEffect(() => {
        if (mediaList && mediaList.length > 1) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
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

    const wrapperClasses = `ucard-media-container ${
        isSquare ? 'aspect-square' : isVideo ? 'aspect-video' : ''
    }`;

    if (videoUrl) {
        return (
            <div className={`w-full ${isSquare ? 'aspect-square' : isVideo ? 'aspect-video' : 'aspect-video'} overflow-hidden flex items-center justify-center`}>
                <UniversalVideo videoUrl={videoUrl} title={displayTitle || "Vídeo de la Pedra Seca"} className="w-full h-full" />
            </div>
        );
    }

    return (
        <Watermark hideLogo={!isMarket} variant="white" position="top-right" opacity={0.7}>
            <div 
                className={wrapperClasses} 
                onClick={handleMediaClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleMediaClick(e);
                    }
                }}
                aria-label={`Veure multimèdia de ${displayTitle}`}
            >
            
            {/* SKELETON LAYER (Manejado por isImageLoaded) */}
            <div className={`absolute inset-0 z-0 bg-theme-base ${(isImageLoaded || hasImageError || !displayImage) ? 'hidden' : 'block'}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-theme-muted/10 to-transparent skew-x-12" />
            </div>

            {mediaList && mediaList.length > 1 ? (
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
            ) : (
                <>
                    {(!displayImage || hasImageError) ? null : (
                        <img 
                            src={displayImage} 
                            alt={displayTitle} 
                            loading="lazy"
                            decoding="async"
                            className={`universal-card-media-img cursor-zoom-in ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                            onLoad={() => setIsImageLoaded(true)}
                            onError={() => setHasImageError(true)}
                        />
                    )}
                </>
            )}
        </div>
        </Watermark>
    );
};

export default UniversalCardMedia;
