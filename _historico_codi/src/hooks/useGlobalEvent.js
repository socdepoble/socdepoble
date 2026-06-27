import { useEffect, useRef } from 'react';

/**
 * useGlobalEvent - Patrón Trellat para listeners únicos
 * Elimina problemas de ghost listeners en la arquitectura de React.
 */
export const useGlobalEvent = (event, handler, options = {}) => {
    const handlerRef = useRef(handler);
    
    useEffect(() => {
        handlerRef.current = handler; 
    }, [handler]);
    
    useEffect(() => {
        const wrappedHandler = (e) => handlerRef.current(e);
        
        window.addEventListener(event, wrappedHandler, options);
        
        return () => {
            window.removeEventListener(event, wrappedHandler, options);
            if (options.key) {
                window.removeEventListener(event, wrappedHandler);
            }
        };
    }, [event, options]); 
};
