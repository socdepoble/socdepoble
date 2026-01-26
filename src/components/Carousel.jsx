import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import './Carousel.css';
import './Lightbox.css';

const Carousel = ({ images, height = '300px', interval = 5000, autoPlay = false }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const timerRef = useRef(null);

    // Filter valid images
    const validImages = images.filter(img => img);

    // Reset timer on interaction
    const resetTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (autoPlay && validImages.length > 1 && !isLightboxOpen) {
            timerRef.current = setInterval(() => {
                setCurrentIndex(prev => (prev === validImages.length - 1 ? 0 : prev + 1));
            }, interval);
        }
    };

    useEffect(() => {
        resetTimer();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [currentIndex, autoPlay, validImages.length, isLightboxOpen]);

    // Keyboard navigation for lightbox
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isLightboxOpen) return;
            if (e.key === 'Escape') setIsLightboxOpen(false);
            if (e.key === 'ArrowRight') nextSlide(e);
            if (e.key === 'ArrowLeft') prevSlide(e);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLightboxOpen, currentIndex]);

    // Navigation
    const nextSlide = (e) => {
        if (e) e.stopPropagation();
        setCurrentIndex(prev => (prev === validImages.length - 1 ? 0 : prev + 1));
        resetTimer();
    };

    const prevSlide = (e) => {
        if (e) e.stopPropagation();
        setCurrentIndex(prev => (prev === 0 ? validImages.length - 1 : prev - 1));
        resetTimer();
    };

    const goToSlide = (index, e) => {
        if (e) e.stopPropagation();
        setCurrentIndex(index);
        resetTimer();
    };

    // Touch Support
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

        if (isLeftSwipe) nextSlide();
        if (isRightSwipe) prevSlide();

        setTouchEnd(null);
        setTouchStart(null);
    };

    // Lightbox Controls
    const openLightbox = () => {
        setIsLightboxOpen(true);
        if (timerRef.current) clearInterval(timerRef.current);
    };

    if (validImages.length === 0) return null;

    if (validImages.length === 1) {
        return (
            <>
                <div className="carousel-container single-slide" style={{ height }}>
                    <div className="carousel-track">
                        <div className="carousel-slide" onClick={openLightbox}>
                            <img
                                src={validImages[0]}
                                alt="Slide"
                                className="carousel-image zoomable"
                            />

                            <div className="carousel-overlay-hint">
                                <Maximize2 size={16} />
                            </div>

                            <div className="attribution-badge">
                                <span>© Sóc de Poble (Fet per la IAIA)</span>
                                <span style={{ opacity: 0.6 }}>|</span>
                                <span>Gratis (No Comercial)</span>
                            </div>
                        </div>
                    </div>
                </div>
                {isLightboxOpen && createPortal(
                    <div className="lightbox-overlay" onClick={() => setIsLightboxOpen(false)}>
                        <button className="lightbox-close" onClick={() => setIsLightboxOpen(false)}>
                            <X size={24} />
                        </button>
                        <div className="lightbox-content" onClick={e => e.stopPropagation()}>
                            <img src={validImages[0]} alt="Full size" className="lightbox-image" />
                        </div>
                    </div>,
                    document.body
                )}
            </>
        );
    }

    return (
        <>
            <div
                className="carousel-container"
                style={{ height }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div
                    className="carousel-track"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {validImages.map((img, index) => {
                        const isRealHuman = img.includes('javi_head') || img.includes('avatars/') || !img.includes('campaign/') && !img.includes('iaia');
                        return (
                            <div className={`carousel-slide ${isRealHuman ? 'is-human' : ''}`} key={index} onClick={openLightbox}>
                                <img
                                    src={img}
                                    alt={`Slide ${index + 1}`}
                                    draggable="false"
                                    className="carousel-image zoomable"
                                />
                                {!isRealHuman && (
                                    <div className="attribution-badge">
                                        <span>© Sóc de Poble (Fet per la IAIA)</span>
                                        <span style={{ opacity: 0.6 }}>|</span>
                                        <span>Gratis (No Comercial)</span>
                                    </div>
                                )}
                                {isRealHuman && (
                                    <div className="attribution-badge human">
                                        <span>© Arquitecte de Sóc de Poble</span>
                                    </div>
                                )}
                                <div className="carousel-overlay-hint">
                                    <Maximize2 size={16} />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <button
                    className="carousel-btn prev"
                    onClick={prevSlide}
                    aria-label="Previous Slide"
                >
                    <ChevronLeft size={24} />
                </button>

                <button
                    className="carousel-btn next"
                    onClick={nextSlide}
                    aria-label="Next Slide"
                >
                    <ChevronRight size={24} />
                </button>

                <div className="carousel-indicators">
                    {validImages.map((_, index) => (
                        <button
                            key={index}
                            className={`indicator ${index === currentIndex ? 'active' : ''}`}
                            onClick={(e) => goToSlide(index, e)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Lightbox Modal via Portal */}
            {isLightboxOpen && createPortal(
                <div className="lightbox-overlay" onClick={() => setIsLightboxOpen(false)}>
                    <button className="lightbox-close" onClick={() => setIsLightboxOpen(false)}>
                        <X size={24} />
                    </button>

                    <button className="lightbox-btn prev" onClick={prevSlide}>
                        <ChevronLeft size={32} />
                    </button>

                    <div className="lightbox-content" onClick={e => e.stopPropagation()}>
                        <img
                            src={validImages[currentIndex]}
                            alt={`Full size ${currentIndex + 1}`}
                            className="lightbox-image"
                        />
                    </div>

                    <button className="lightbox-btn next" onClick={nextSlide}>
                        <ChevronRight size={32} />
                    </button>
                </div>,
                document.body
            )}
        </>
    );
};

export default Carousel;
