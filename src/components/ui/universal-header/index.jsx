import React from 'react';
import UniversalHeaderGroup from './UniversalHeader.Group';
import UniversalHeaderButton from './UniversalHeader.Button';
import UniversalHeaderLogo from './UniversalHeader.Logo';

/**
 * UniversalHeader
 * Contenidor arrel indestructible per a la barra superior (Header)
 */
const UniversalHeaderRoot = React.memo(({ children, className = '' }) => {
    return (
        <header 
            className={`notranslate h-[56px] sm:h-[64px] min-h-[56px] sm:min-h-[64px] w-full flex items-center justify-between pr-2 sm:pr-4 lg:pr-6 z-50 transition-all duration-300 bg-[#000000] border-b border-[var(--border-master)]/50 shrink-0 shadow-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] relative ${className}`}
        >
            {children}
        </header>
    );
});
UniversalHeaderRoot.displayName = 'UniversalHeaderRoot';

export const UniversalHeader = Object.assign(UniversalHeaderRoot, {
    Group: UniversalHeaderGroup,
    Button: UniversalHeaderButton,
    Logo: UniversalHeaderLogo,
});

export default UniversalHeader;
