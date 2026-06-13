import React, { memo } from 'react';
import ImageCarousel from '../ui/ImageCarousel';

const UniversalHero = memo(({ images, format = 'square', position = 'center', onImageClick, videoUrl }) => {
    if (videoUrl) {
        return (
            <section className="relative w-full z-0 flex flex-col items-center justify-center overflow-hidden bg-[var(--bg-panel)] bg-black">
                <iframe 
                    className={`w-full ${format === 'square' ? 'aspect-square' : 'aspect-video'} max-w-full`}
                    src={videoUrl} 
                    title="Sóc de Poble Video" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; compute-pressure" 
                    referrerPolicy="strict-origin-when-cross-origin" 
                    allowFullScreen
                ></iframe>
            </section>
        );
    }

    if (!images || images.length === 0) return null;
    
    const positionClass = position === 'top' ? 'object-top' : position === 'bottom' ? 'object-bottom' : 'object-center';
    const displayImage = images[0];

    const handleHeroClick = () => {
        if (onImageClick) {
            onImageClick(images, displayImage);
        }
    };
    
    return (
        <section 
            className={`relative w-full z-0 flex flex-col items-center justify-center overflow-hidden bg-[var(--bg-panel)] cursor-pointer active:scale-[0.99] transition-transform ${format === 'horizontal' ? 'max-h-[60vh]' : ''}`}
            onClick={handleHeroClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleHeroClick(); } }}
            aria-label="Veure imatge de portada"
        >
            {images.length > 1 ? (
                <div className="w-full h-full relative">
                    <ImageCarousel 
                        images={images} 
                        onImageClick={(index) => {
                            if (onImageClick) onImageClick(images, images[index]);
                        }} 
                        aspectMode={format === 'horizontal' ? 'video' : 'square'} 
                    />
                </div>
            ) : (
                <img 
                    src={displayImage || undefined} 
                    alt="Hero Banner" 
                    fetchpriority="high"
                    className={`block w-full ${
                        format === 'horizontal' ? `h-auto aspect-video object-cover ${positionClass} max-h-[60vh]` : 
                        format === 'native' ? `h-auto object-contain ${positionClass}` :
                        `w-full h-auto aspect-square object-cover ${positionClass}`
                    }`}
                    style={{ margin: 0, padding: 0 }}
                />
            )}
        </section>
    );
});

export default UniversalHero;
