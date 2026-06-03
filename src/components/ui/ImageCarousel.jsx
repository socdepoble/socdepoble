import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './ImageCarousel.css';

const ImageCarousel = ({ images, onImageClick, aspectMode = 'square' }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    if (!images || images.length === 0) return null;

    const nextSlide = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = (e) => {
        if (e) e.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        if (isRightSwipe) setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

        setTouchEnd(null);
        setTouchStart(null);
    };

    return (
        <div 
            className={`image-carousel-container ${aspectMode === 'auto' ? 'carousel-aspect-auto' : ''}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div
                className="carousel-track"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((img, idx) => (
                    <div key={idx} className="carousel-slide">
                        <img
                            src={img || undefined}
                            alt={`Slide ${idx + 1}`}
                            loading={idx === 0 ? "eager" : "lazy"}
                            fetchPriority={idx === 0 ? "high" : "auto"}
                            decoding="async"
                            onClick={() => onImageClick && onImageClick(idx)}
                            role={onImageClick ? "button" : "img"}
                            tabIndex={onImageClick ? 0 : -1}
                            onKeyDown={(e) => {
                                if (onImageClick && (e.key === 'Enter' || e.key === ' ')) {
                                    e.preventDefault();
                                    onImageClick(idx);
                                }
                            }}
                            style={{ cursor: onImageClick ? 'zoom-in' : 'default' }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.classList.add('image-error');
                            }}
                        />
                    </div>
                ))}
            </div>

            {images.length > 1 && (
                <>
                    <button className="carousel-btn prev" onClick={prevSlide} aria-label="Imatge anterior">
                        <ChevronLeft size={24} />
                    </button>
                    <button className="carousel-btn next" onClick={nextSlide} aria-label="Imatge següent">
                        <ChevronRight size={24} />
                    </button>
                    <div className="carousel-dots" role="tablist">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                className="dot-wrapper"
                                role="tab"
                                aria-selected={idx === currentIndex}
                                tabIndex={0}
                                aria-label={`Anar a la imatge ${idx + 1}`}
                                type="button"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setCurrentIndex(idx);
                                    }
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentIndex(idx);
                                }}
                            >
                                <div className={`dot ${idx === currentIndex ? 'active' : ''}`} />
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ImageCarousel;
