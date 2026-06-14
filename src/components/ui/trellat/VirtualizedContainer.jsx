import React, { forwardRef, useRef, useImperativeHandle, memo } from 'react';
import { useVirtualizedList } from '../../../hooks/useVirtualizedList';
import './VirtualizedContainer.css';
const VirtualizedContainer = memo(forwardRef(({
  items,
  renderItem,
  estimatedHeight = 80,
  overscan = 5,
  getItemId,
  className = '',
  emptyComponent: EmptyComponent,
  onEndReached,
  endReachedThreshold = 200,
  lupaSync = true,
  role = 'log',
  ariaLabel = 'Llista de contingut',
  ...props
}, forwardedRef) => {
  const scrollRef = useRef(null);

  // Exposem API al pare (scrollToIndex, scrollToOffset)
  useImperativeHandle(forwardedRef, () => ({
    scrollToIndex: (index, opts) => virtualizer.scrollToIndex(index, opts),
    scrollToOffset: (offset, opts) => virtualizer.scrollToOffset(offset, opts),
    getScrollElement: () => scrollRef.current,
    measure: () => virtualizer.measure()
  }));
  const virtualizer = useVirtualizedList({
    items,
    scrollRef,
    estimatedHeight,
    overscan,
    getItemId,
    lupaSync,
    onEndReached,
    endReachedThreshold
  });
  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  // Estat buit
  if (items.length === 0 && EmptyComponent) {
    return <div ref={scrollRef} className={`virtualized-container virtualized-container--buit ${className}`} role="status" {...props}>
        <EmptyComponent />
      </div>;
  }
  return <div ref={scrollRef} className={`virtualized-container ${className}`} role={role} aria-label={ariaLabel} {...props} style={{
    height: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
    position: 'relative',
    // CRÍTIC: contain strict aïlla el layout, paint i style
    // d'aquesta sub-arbre del DOM. L'iPad A10 no repintarà
    // aquesta àrea quan canvie fora.
    contain: 'strict',
    // CRÍTIC: Scroll suau per a iOS (WebKit legacy)
    WebkitOverflowScrolling: 'touch',
    // CRÍTIC: Evitar overscroll bounce que desplaçaria
    // la mesura del virtualitzador.
    overscrollBehaviorY: 'contain',
    ...props.style
  }}>
      <div style={{
      height: `${totalSize}px`,
      width: '100%',
      position: 'relative'
    }}>
        {/* 
          CRÍTIC: El contenidor intern usa display:flex + gap.
          Això permet que el virtualitzador calcule l'alçada total
          com a suma d'items + gaps, sense deprendre de margins
          col·lapsats o externs.
         */}
        <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        // Espaiat uniforme, previsible
        padding: '0 1rem' // Padding lateral, mai vertical
      }}>
          {virtualItems.map(virtualItem => <div key={virtualItem.key} data-index={virtualItem.index} data-virtual-index={virtualItem.index} ref={virtualizer.measureElement} style={{
          // CRÍTIC: Zero margin. L'espaiat és del gap del pare.
          margin: 0,
          // CRÍTIC: Containment per aïllar repaints dins d'aquest item
          contain: 'layout paint',
          // CRÍTIC: will-change NOMÉS durant scroll intens (gestionat via CSS)
          willChange: 'transform'
        }}>
              {renderItem(items[virtualItem.index], virtualItem.index)}
            </div>)}
        </div>
      </div>
    </div>;
}));
VirtualizedContainer.displayName = 'VirtualizedContainer';
export default VirtualizedContainer;