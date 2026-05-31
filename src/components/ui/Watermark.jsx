import './Watermark.css';

const Watermark = ({ children, variant = 'white', position = 'bottom-right', opacity = 0.6, hideLogo = false }) => {
    const logoSrc = variant === 'white' 
        ? '/system/ui/logo-socdepoble-rect-blanc.svg' 
        : '/system/ui/logo-socdepoble-rect-negre.svg';

    return (
        <div className="watermark-container">
            {children}
            {!hideLogo && (
                <div className={`watermark-overlay ${position}`} style={{ opacity }}>
                    <img src={logoSrc} alt="Sóc de Poble" className="watermark-logo" />
                </div>
            )}
        </div>
    );
};

export default Watermark;
