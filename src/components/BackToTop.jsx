import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import './BackToTop.css';

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const toggleVisibility = () => {
            const currentScrollY = window.scrollY;

            // Show only if we have scrolled down more than 400px
            // AND we are scrolling UP (as requested)
            if (currentScrollY > 400 && currentScrollY < lastScrollY) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, [lastScrollY]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    if (!isVisible) return null;

    return (
        <button
            className="back-to-top"
            onClick={scrollToTop}
            aria-label="Tornar a dalt"
        >
            <ChevronUp size={24} />
        </button>
    );
};

export default BackToTop;
