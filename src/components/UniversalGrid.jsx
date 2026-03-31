import React from 'react';

/**
 * UniversalGridWrapper
 * Limita l'amplada segons el mode (single i list es queden estrets i llegibles, grid s'expandeix).
 */
export const UniversalGridWrapper = React.memo(({ viewMode, children, className = "" }) => {
    const isRestrictedWidth = viewMode === 'list' || viewMode === 'single';
    // [BLINDAJE 4K]: max-w-7xl (aprox 1280px) para evitar tracks kilométricas 
    const maxWidthClass = isRestrictedWidth ? 'max-w-3xl' : 'max-w-7xl';

    return (
        <div className={`mx-auto w-full transition-[max-width] duration-300 ease-in-out ${maxWidthClass} px-2 sm:px-6 lg:px-8 ${className}`}>
            {children}
        </div>
    );
});
UniversalGridWrapper.displayName = 'UniversalGridWrapper';

/**
 * UniversalGridRow
 * Fila estàndard que aplica "display: grid" amb un "gap" innegociable de 24px per evitar encavalcaments.
 * Compatible amb `isVirtualRow` si passem un obj `style` que incloga transform i absolute position.
 */
export const UniversalGridRow = React.memo(React.forwardRef(({
    viewMode,
    columnCount,
    children,
    className = "",
    style = {},
    ...props
}, ref) => {
    const actualColumns = (viewMode === 'list' || viewMode === 'single' || viewMode === 'masonry')
        ? 1
        : columnCount;

    /*
     * G-2: baseStyle memoizado dentro del componente.
     * `style` viene del virtualizador y SIEMPRE es un objeto nuevo (transform cambia).
     * Los valores estáticos se separan del spread dinámico para que el motor V8
     * pueda cachear la forma del objeto base.
     */
    const gridStyle = React.useMemo(() => ({
        display: 'grid',
        gridTemplateColumns: `repeat(${actualColumns}, minmax(min(100%, 340px), 1fr))`,
        gap: '24px',
        padding: '0 16px',
        paddingBottom: '24px',
        boxSizing: 'border-box',
    }), [actualColumns]);

    const mergedStyle = React.useMemo(() => ({ ...gridStyle, ...style }), [gridStyle, style]);

    return (
        <div
            ref={ref}
            className={`universal-grid-row view-mode-${viewMode} ${className}`}
            style={mergedStyle}
            {...props}
        >
            {children}
        </div>
    );
}));
UniversalGridRow.displayName = 'UniversalGridRow';
