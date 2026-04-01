import { useEffect, useRef } from 'react';

export const useThrottledScroll = (callback, delay = 100) => {
    const lastCallRef = useRef(0);
    const rafRef = useRef(null);
    const callbackRef = useRef(callback);

    // Mantenim la referència actualitzada
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [delay]);

    return (e) => {
        const now = Date.now();
        if (now - lastCallRef.current >= delay) {
            lastCallRef.current = now;
            callbackRef.current(e);
        } else {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => {
                callbackRef.current(e);
            });
        }
    };
};
