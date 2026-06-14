import React from 'react';

/**
 * UniversalGridWrapper
 * Limita l'amplada segons el mode (single i list es queden estrets i llegibles, grid s'expandeix).
 */
export const UniversalGridWrapper = React.memo(({
  viewMode,
  children,
  className = ""
}) => {
  const isRestrictedWidth = viewMode === 'single';
  // [BLINDAJE 4K]: max-w-7xl (aprox 1280px) para evitar tracks kilométricas 
  const maxWidthClass = isRestrictedWidth ? 'max-w-3xl' : 'max-w-7xl';

  // Matemàtica Visual Perfecta: Apliquem p-6 (24px) a tots els costats.
  // Açò coincideix exactament amb el 'gap: 24px' de la retícula, creant marges idèntics.

  return <div className={`mx-auto w-full ${maxWidthClass} py-6 px-4 md:px-6 ${className}`}>
            {children}
        </div>;
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
  const childrenCount = React.Children.count(children);
  const requestedColumns = viewMode === 'list' || viewMode === 'single' || viewMode === 'masonry' ? 1 : columnCount;
  const actualColumns = Math.min(requestedColumns, childrenCount > 0 ? childrenCount : 1);

  /*
   * G-2: baseStyle memoizado dentro del componente.
   * `style` viene del virtualizador y SIEMPRE es un objeto nuevo (transform cambia).
   * Los valores estáticos se separan del spread dinámico para que el motor V8
   * pueda cachear la forma del objeto base.
   */
  const gridStyle = React.useMemo(() => {
    const isSingle = viewMode === 'single' || actualColumns === 1;
    return isSingle ? {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      // Centra horitzontalment els fills
      width: '100%',
      gap: '24px',
      boxSizing: 'border-box'
    } : {
      display: 'grid',
      gridTemplateColumns: `repeat(${actualColumns}, minmax(min(100%, 300px), 1fr))`,
      gap: '24px',
      boxSizing: 'border-box',
      width: '100%'
    };
  }, [actualColumns, viewMode]);
  const mergedStyle = React.useMemo(() => ({
    ...gridStyle,
    ...style
  }), [gridStyle, style]);
  return <div ref={ref} className={`universal-grid-row view-mode-${viewMode} ${className}`} style={mergedStyle} {...props}>
            {children}
        </div>;
}));
UniversalGridRow.displayName = 'UniversalGridRow';