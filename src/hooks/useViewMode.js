import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useViewMode - Hook Universal per a la gestió de columnes, resize i localStorage
 * @param {string} storageKey - La clau de localStorage (ex: 'feed_view_mode')
 * @param {string} defaultMode - Mode per defecte ('grid', 'list', 'single')
 * @param {string} externalMode - Mode extern si es força des de dalt (per incrustacions)
 */
export function useViewMode(storageKey, defaultMode = 'grid', externalMode = null) {
    const [internalViewMode, setInternalViewModeState] = useState(() => {
        if (!storageKey) return defaultMode;
        return localStorage.getItem(storageKey) || defaultMode;
    });

    const viewMode = externalMode || internalViewMode;

    const setViewMode = useCallback((mode) => {
        setInternalViewModeState(mode);
        if (storageKey) {
            localStorage.setItem(storageKey, mode);
        }
    }, [storageKey]);

    const calculateColumns = useCallback((width, mode) => {
        if (mode === 'list' || mode === 'single' || mode === 'masonry') return 1;
        
        // Matemàtica de sistema de disseny: 
        // --card-min-width: 340px, --gap: 24px
        // Restem aprox 64px de padding combinat dels wrappers
        const CARD_MIN_WIDTH = 340;
        const GAP = 24;
        const availableWidth = Math.max(0, width - 64); 
        
        let cols = Math.floor((availableWidth + GAP) / (CARD_MIN_WIDTH + GAP));
        return Math.max(1, Math.min(cols, 4));
    }, []);

    const [columnCount, setColumnCount] = useState(() => {
        if (typeof window !== 'undefined') {
            const estimatedContainerWidth = Math.min(window.innerWidth - (window.innerWidth > 1024 ? 300 : 0), 1600);
            return calculateColumns(estimatedContainerWidth, viewMode);
        }
        return 1;
    });

    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;
        
        let rafId;
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                const width = entry.contentRect.width;
                if (rafId) cancelAnimationFrame(rafId);
                
                rafId = requestAnimationFrame(() => {
                    setColumnCount(calculateColumns(width, viewMode));
                });
            }
        });
        
        observer.observe(containerRef.current);
        
        return () => {
             observer.disconnect();
             if (rafId) cancelAnimationFrame(rafId);
        };
    }, [viewMode, calculateColumns]);

    // effectiveViewMode prevé que si el grid cau a 1 columna naturalment,
    // es mostre visualment com un "single" si utilitzem UniversalCard
    const effectiveViewMode = (viewMode === 'grid' && columnCount === 1) ? 'single' : viewMode;

    return {
        viewMode,
        setViewMode,
        columnCount,
        containerRef,
        effectiveViewMode
    };
}
