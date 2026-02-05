import React, { useState, useEffect } from 'react';
import './LazyImage.css';

/**
 * [MASTER] LazyImage - "Pedra Seca" Loading protocol
 * Carrega mandrosa amb efecte de desenfocament sòlid.
 */
const LazyImage = ({ src, alt, className, style, ...props }) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => setLoaded(true);
        img.onerror = () => setError(true);
    }, [src]);

    if (error) {
        return (
            <div className={`lazy-image-fallback ${className}`} style={style}>
                <span>🏺</span>
            </div>
        );
    }

    return (
        <div className={`lazy-image-container ${loaded ? 'loaded' : ''} ${className}`} style={style}>
            {!loaded && <div className="lazy-image-blur-placeholder" />}
            <img
                src={src}
                alt={alt}
                className={`lazy-image-real ${loaded ? 'visible' : ''}`}
                loading="lazy"
                {...props}
            />
        </div>
    );
};

export default LazyImage;
