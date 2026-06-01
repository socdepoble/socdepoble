import React from 'react';

/**
 * UniversalHeader.Group
 * Contenidor indestructible per als grups de botons de l'esquerra o la dreta.
 */
const UniversalHeaderGroup = React.memo(({ position = 'left', children, className = '' }) => {
    // left: conté el menú i el logo
    // right: conté els botons d'eines (idioma, cercador, visió, etc.)
    const baseClass = position === 'left' 
        ? "flex items-center justify-start pl-2 sm:pl-4 shrink-0 z-10 gap-3"
        : "flex items-center gap-[4px] sm:gap-[20px] ml-auto h-full z-10 relative shrink-0 pr-[2px] sm:pr-[32px]";

    return (
        <div className={`${baseClass} ${className}`}>
            {children}
        </div>
    );
});
UniversalHeaderGroup.displayName = 'UniversalHeaderGroup';

export default UniversalHeaderGroup;
