import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './ImageCarousel.css';

const ImageCarousel = ({ images, onImageClick }) => {
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
            className="image-carousel-container"
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
                            src={img}
                            alt={`Slide ${idx + 1}`}
                            onClick={() => onImageClick && onImageClick(idx)}
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
                    <button className="carousel-btn prev" onClick={prevSlide}>
                        <ChevronLeft size={24} />
                    </button>
                    <button className="carousel-btn next" onClick={nextSlide}>
                        <ChevronRight size={24} />
                    </button>
                    <div className="carousel-dots">
                        {images.map((_, idx) => (
                            <div
                                key={idx}
                                className={`dot ${idx === currentIndex ? 'active' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentIndex(idx);
                                }}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ImageCarousel;
