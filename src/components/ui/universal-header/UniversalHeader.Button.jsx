import React from 'react';

/**
 * UniversalHeader.Button
 * Botó nuclear indestructible per a la barra superior.
 * Variants disponibles: 'menu' (esquerra), 'tool' (dreta), 'profile', 'custom'
 */
const UniversalHeaderButton = React.memo(React.forwardRef(({ 
    variant = 'tool', 
    onClick, 
    children, 
    className = '', 
    title, 
    ariaLabel 
}, ref) => {
    let baseClass = "";

    switch (variant) {
        case 'menu':
            baseClass = "flex items-center justify-center w-10 h-10 rounded-xl hover:bg-white/10 active:scale-95 transition-colors text-white";
            break;
        case 'tool':
            // Cercador, Tema, Registre...
            baseClass = "shrink-0 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center text-white/70 hover:text-white active:scale-95 transition-all";
            break;
        case 'profile':
            baseClass = "shrink-0 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-transform";
            break;
        case 'custom':
        default:
            baseClass = "";
            break;
    }

    // Convertim div en button per perfil si té onClick
    const Component = (variant === 'profile' && !onClick) ? 'div' : 'button';

    return (
        <Component 
            ref={ref}
            onClick={onClick}
            className={`${baseClass} ${className}`}
            title={title}
            aria-label={ariaLabel || title}
        >
            {children}
        </Component>
    );
}));
UniversalHeaderButton.displayName = 'UniversalHeaderButton';

export default UniversalHeaderButton;
