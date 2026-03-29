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

    const [columnCount, setColumnCount] = useState(() => {
        if (typeof window !== 'undefined') {
            const estimatedContainerWidth = Math.min(window.innerWidth - (window.innerWidth > 1024 ? 300 : 0), 1600);
            if (viewMode === 'list' || viewMode === 'single' || viewMode === 'masonry') return 1;
            if (estimatedContainerWidth < 900) return 1;
            if (estimatedContainerWidth < 1400) return 2;
            if (estimatedContainerWidth < 1800) return 3;
            return 4;
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
                    if (viewMode === 'single' || viewMode === 'list' || viewMode === 'masonry') {
                        setColumnCount(1);
                    } else {
                        // grid, timeline, globals...
                        // Adapta les pantalles segons els punts de tall del disseny
                        if (width < 900) setColumnCount(1);
                        else if (width < 1400) setColumnCount(2);
                        else if (width < 1800) setColumnCount(3);
                        else setColumnCount(4);
                    }
                });
            }
        });
        
        observer.observe(containerRef.current);
        
        return () => {
             observer.disconnect();
             if (rafId) cancelAnimationFrame(rafId);
        };
    }, [viewMode]);

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
