import { useEffect, useRef, useCallback } from 'react';

/**
 * useSnapToBottom
 * Hook indestructible per a mantenir l'scroll al fons en xats de Sóc de Poble.
 * Especialment dissenyat per suportar el redimensionament del visualViewport quan 
 * s'obri el teclat a l'iPad A10.
 * 
 * @param {Object} options
 * @param {React.MutableRefObject} options.scrollContainerRef - Ref al contenidor d'scroll (ex: el scroller de Virtuoso o un div normal)
 * @param {Array} options.dependencies - Dependències addicionals per llançar el scroll (ex: messages)
 * @param {boolean} options.enabled - Si el snap està actiu (pot desactivar-se si l'usuari fa scroll manual amunt)
 */
export const useSnapToBottom = ({ scrollContainerRef, dependencies = [], enabled = true }) => {
    const isKeyboardOpenRef = useRef(false);
    const lastViewportHeightRef = useRef(window.visualViewport?.height || window.innerHeight);

    const scrollToBottom = useCallback((behavior = 'auto') => {
        if (!enabled || !scrollContainerRef.current) return;
        
        try {
            // Intenta cridar mètodes del Virtuoso si n'hi ha (scrollToIndex), 
            // altrament usa el comportament natiu del DOM.
            const container = scrollContainerRef.current;
            if (typeof container.scrollToIndex === 'function') {
                container.scrollToIndex({ index: 'LAST', behavior, align: 'end' });
            } else {
                container.scrollTop = container.scrollHeight;
            }
        } catch (e) {
            console.warn('[useSnapToBottom] Error forçant scroll:', e);
        }
    }, [enabled, scrollContainerRef]);

    // Efecte per l'API VisualViewport (Safari / iPad)
    useEffect(() => {
        if (!window.visualViewport) return;

        const handleResize = () => {
            if (!enabled) return;
            const currentHeight = window.visualViewport.height;
            const isKeyboardOpening = currentHeight < lastViewportHeightRef.current;
            
            if (isKeyboardOpening) {
                isKeyboardOpenRef.current = true;
                scrollToBottom('auto');
            } else if (currentHeight > lastViewportHeightRef.current) {
                isKeyboardOpenRef.current = false;
            }

            lastViewportHeightRef.current = currentHeight;
        };

        window.visualViewport.addEventListener('resize', handleResize);
        // Fallback per a canvis bruscs
        window.addEventListener('resize', handleResize);

        return () => {
            window.visualViewport.removeEventListener('resize', handleResize);
            window.removeEventListener('resize', handleResize);
        };
    }, [enabled, scrollToBottom]);

    // Efecte per actualitzacions de dades (ex: nous missatges)
    useEffect(() => {
        if (enabled) {
            // Un petit delay per assegurar que el DOM ha pintat els nous missatges
            requestAnimationFrame(() => {
                scrollToBottom('smooth');
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...dependencies, enabled, scrollToBottom]);

    return { scrollToBottom };
};
