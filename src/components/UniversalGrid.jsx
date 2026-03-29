import React from 'react';

/**
 * UniversalGridWrapper
 * Limita l'amplada segons el mode (single i list es queden estrets i llegibles, grid s'expandeix).
 */
export const UniversalGridWrapper = ({ viewMode, children, className = "" }) => {
    const isRestrictedWidth = viewMode === 'list' || viewMode === 'single';
    // Ens assegurem de treure max-w-none i max-w-5xl antics
    const maxWidthClass = isRestrictedWidth ? 'max-w-3xl' : 'max-w-[1600px]';

    return (
        <div className={`mx-auto w-full transition-all duration-300 ${maxWidthClass} px-2 sm:px-6 lg:px-8 ${className}`}>
            {children}
        </div>
    );
};

/**
 * UniversalGridRow
 * Fila estàndard que aplica "display: grid" amb un "gap" innegociable de 24px per evitar encavalcaments.
 * Compatible amb `isVirtualRow` si passem un obj `style` que incloga transform i absolute position.
 */
export const UniversalGridRow = ({ viewMode, columnCount, children, className = "", style = {}, ...props }) => {
    const actualColumns = (viewMode === 'list' || viewMode === 'single' || viewMode === 'masonry') ? 1 : columnCount;
    
    const baseStyle = {
        display: 'grid',
        gridTemplateColumns: `repeat(${actualColumns}, minmax(0, 1fr))`,
        gap: '24px',
        padding: '0 16px',
        paddingBottom: '24px',
        boxSizing: 'border-box',
        ...style
    };

    return (
        <div 
            className={`universal-grid-row view-mode-${viewMode} ${className}`} 
            style={baseStyle}
            {...props}
        >
            {children}
        </div>
    );
};
