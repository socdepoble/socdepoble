/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from 'react';

export function useMountTransition(isMounted, unmountDelay = 300) {
    const [shouldRender, setShouldRender] = useState(isMounted);
    const [hasTransitionedIn, setHasTransitionedIn] = useState(false);
    const timeoutRef = useRef(null);

    // Sincronitzem l'estat de muntatge de forma segura
    useEffect(() => {
        if (isMounted) {
            setShouldRender(true);
            // Forcem reflow + transició
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setHasTransitionedIn(true));
            });
        } else if (hasTransitionedIn) {
            setHasTransitionedIn(false);
            timeoutRef.current = setTimeout(() => {
                setShouldRender(false);
            }, unmountDelay);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [isMounted, hasTransitionedIn, unmountDelay]);

    return { shouldRender, hasTransitionedIn };
}
