import { useState, useEffect } from 'react';

/**
 * useMountTransition - Hook Maestro para coreografía de animaciones
 * Mantiene un nodo en el DOM el tiempo suficiente para que WebKit/Blink ejecute 
 * el CSS transition antes del "Unmount" destructor de React.
 *
 * @param {boolean} isMounted - Si el componente debe estar visible
 * @param {number} unmountDelay - Ms de retardo antes de destruir el Nodo
 * @returns {object} { shouldRender, hasTransitionedIn }
 */
export function useMountTransition(isMounted, unmountDelay) {
  const [shouldRender, setShouldRender] = useState(isMounted);
  const [hasTransitionedIn, setHasTransitionedIn] = useState(false);

  // Derivamos el estado durante el renderizado para evitar advertencias de "cascade render" 
  // y re-renderizados innecesarios del Effect.
  if (isMounted && !shouldRender) {
    setShouldRender(true);
  }

  useEffect(() => {
    let timeoutId;

    if (isMounted && shouldRender && !hasTransitionedIn) {
      // 2. El nodo ya existe en el DOM (invisible). Forzamos reflow para animar
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setHasTransitionedIn(true);
        });
      });
    } else if (!isMounted && hasTransitionedIn) {
      // 3. El usuario cierra el modal. Quitamos la clase CSS activa instantáneamente
      setHasTransitionedIn(false);
    } else if (!isMounted && shouldRender && !hasTransitionedIn) {
      // 4. Esperamos el retardo (unmountDelay) y fulminamos el componente
      timeoutId = setTimeout(() => {
        setShouldRender(false);
      }, unmountDelay);
    }

    return () => clearTimeout(timeoutId);
  }, [isMounted, unmountDelay, shouldRender, hasTransitionedIn]);

  return { shouldRender, hasTransitionedIn };
}
