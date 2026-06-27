import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './Carousel.css';
import './Lightbox.css';

const Carousel = ({ images, height = '300px', interval = 5000, autoPlay = false }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const timerRef = useRef(null);

    const [workingImages, setWorkingImages] = useState(() => images.filter(img => img));
    const [loadedImages, setLoadedImages] = useState({});

    const [prevImages, setPrevImages] = useState(images);

    // Update state during render when props change (better than useEffect cascading renders)
    if (images !== prevImages) {
        setPrevImages(images);
        setWorkingImages(images.filter(img => img));
        setLoadedImages({});
        setCurrentIndex(0);
    }

    const handleImageError = (imgSrc) => {
        setWorkingImages(prev => {
            const next = prev.filter(img => img !== imgSrc);
            // Adjust current index if it becomes out of bounds
            setCurrentIndex(curr => (curr >= next.length ? Math.max(0, next.length - 1) : curr));
            return next;
        });
    };

    const handleImageLoad = (imgSrc) => {
        setLoadedImages(prev => ({ ...prev, [imgSrc]: true }));
    };

    // Reset timer on interaction
    const resetTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (autoPlay && workingImages.length > 1 && !isLightboxOpen) {
            timerRef.current = setInterval(() => {
                setCurrentIndex(prev => (prev === workingImages.length - 1 ? 0 : prev + 1));
            }, interval);
        }
    }, [autoPlay, workingImages.length, isLightboxOpen, interval]);

    useEffect(() => {
        resetTimer();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [currentIndex, autoPlay, workingImages.length, isLightboxOpen, resetTimer]);

    // Navigation
    const nextSlide = useCallback((e) => {
        if (e) e.stopPropagation();
        setCurrentIndex(prev => (prev === workingImages.length - 1 ? 0 : prev + 1));
        resetTimer();
    }, [workingImages.length, resetTimer]);

    const prevSlide = useCallback((e) => {
        if (e) e.stopPropagation();
        setCurrentIndex(prev => (prev === 0 ? workingImages.length - 1 : prev - 1));
        resetTimer();
    }, [workingImages.length, resetTimer]);

    // Keyboard navigation for lightbox
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isLightboxOpen) return;
            if (e.key === 'Escape') setIsLightboxOpen(false);
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLightboxOpen, nextSlide, prevSlide]);

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

    if (workingImages.length === 0) return null;

    if (workingImages.length === 1) {
        return (
            <>
                <div className="carousel-container single-slide" style={{ height }}>
                    <div className="carousel-track">
                        <div className="carousel-slide" onClick={openLightbox}>
                            <div className="carousel-image-wrapper relative w-full h-full bg-black/10">
                                {!loadedImages[workingImages[0]] && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200/20 backdrop-blur-md animate-pulse z-10" />
                                )}
                                <img
                                    src={workingImages[0]}
                                    alt="Slide"
                                    className="carousel-image zoomable transition-opacity duration-300"
                                    style={{ opacity: loadedImages[workingImages[0]] ? 1 : 0 }}
                                    onLoad={() => handleImageLoad(workingImages[0])}
                                    onError={() => handleImageError(workingImages[0])}
                                />
                            </div>

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
                            <img src={workingImages[0]} alt="Full size" className="lightbox-image" />
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
                    {workingImages.map((img, index) => {
                        const isRealHuman = img.includes('javi_head') || img.includes('avatars/') || !img.includes('campaign/') && !img.includes('iaia');
                        return (
                            <div className={`carousel-slide ${isRealHuman ? 'is-human' : ''}`} key={img} onClick={openLightbox}>
                                <div className="relative w-full h-full bg-black/10 flex items-center justify-center">
                                    {!loadedImages[img] && (
                                        <div className="absolute inset-0 bg-gray-200/20 animate-pulse backdrop-blur-md z-10" />
                                    )}
                                    <img
                                        src={img}
                                        alt={`Slide ${index + 1}`}
                                        draggable="false"
                                        className="carousel-image zoomable transition-opacity duration-500 ease-out"
                                        style={{ opacity: loadedImages[img] ? 1 : 0 }}
                                        onLoad={() => handleImageLoad(img)}
                                        onError={() => handleImageError(img)}
                                    />
                                </div>
                                {!isRealHuman && (
                                    <div className="attribution-badge">
                                        <span>© Sóc de Poble (Fet per la IAIA)</span>
                                        <span style={{ opacity: 0.6 }}>|</span>
                                        <span>Gratis (No Comercial)</span>
                                    </div>
                                )}
                                {isRealHuman && (
                                    <div className="attribution-badge human">
                                        <span>© Sóc de Poble</span>
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
                    {workingImages.map((_, index) => (
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
                        <div className="lightbox-carousel-track">
                            <img
                                src={workingImages[currentIndex]}
                                alt={`Full size ${currentIndex + 1}`}
                                className="lightbox-image scale-up-center"
                            />
                        </div>

                        <div className="lightbox-counter">
                            {currentIndex + 1} / {workingImages.length}
                        </div>
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
