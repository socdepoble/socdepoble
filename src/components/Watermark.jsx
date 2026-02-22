import React from 'react';
import './Watermark.css';

const Watermark = ({ children, variant = 'white', position = 'bottom-right', opacity = 0.6 }) => {
    const logoSrc = variant === 'white' 
        ? '/logo_socdepoble_white_clean.png' 
        : '/logo_socdepoble_black_sketch.png';

    return (
        <div className="watermark-container">
            {children}
            <div className={`watermark-overlay ${position}`} style={{ opacity }}>
                <img src={logoSrc} alt="Sóc de Poble" className="watermark-logo" />
            </div>
        </div>
    );
};

export default Watermark;
