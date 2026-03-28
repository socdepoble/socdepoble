import React, { useState, useEffect, useRef } from 'react';
import './LazyImage.css';

/**
 * [MASTER] LazyImage - "Pedra Seca" Loading protocol
 * Carrega mandrosa amb efecte de desenfocament sòlid.
 */
const LazyImage = ({ src, alt, className, style, ...props }) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const imgRef = useRef(null);
    const [prevSrc, setPrevSrc] = useState(src);
    if (src !== prevSrc) {
        setPrevSrc(src);
        setLoaded(false);
        setError(false);
    }

    useEffect(() => {
        let isMounted = true;
        const img = new Image();
        imgRef.current = img;
        
        img.onload = () => {
            if (isMounted) setLoaded(true);
            img.onload = null;
            img.onerror = null;
        };
        
        img.onerror = () => {
            if (isMounted) setError(true);
            img.onload = null;
            img.onerror = null;
        };
        
        img.src = src;
        
        return () => {
            isMounted = false;
            if (imgRef.current) {
                imgRef.current.onload = null;
                imgRef.current.onerror = null;
                imgRef.current.src = "";
                imgRef.current = null;
            }
        };
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
