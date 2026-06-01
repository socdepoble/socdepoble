import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * UniversalHeader.Logo
 * Component indestructible per al logotip de l'aplicació.
 */
const UniversalHeaderLogo = React.memo(({ onClick, className = '' }) => {
    const navigate = useNavigate();

    const handleClick = (e) => {
        if (onClick) {
            onClick(e);
        } else {
            navigate('/mur');
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`flex items-center active:scale-95 transition-transform shrink min-w-0 outline-none ${className}`}
            aria-label="Inici"
        >
            <img
                src="/assets/system/ui/logo-socdepoble-rect-blanc.svg"
                alt="Sóc de Poble"
                className="h-[32px] sm:h-[42px] lg:h-[45px] w-auto object-contain filter drop-shadow-md shrink min-w-0"
                fetchPriority="high"
            />
        </button>
    );
});
UniversalHeaderLogo.displayName = 'UniversalHeaderLogo';

export default UniversalHeaderLogo;
