import { useState, useCallback } from 'react';

/**
 * Hook d'optimització (Trellat) per evitar el "Layout Thrashing" i l'exhauriment 
 * de la RAM/GPU de l'iPad A10.
 * 
 * Activa `will-change: transform` només al moment exacte on l'usuari interacciona 
 * (hover/touch), i ho desactiva quan l'animació acaba.
 * 
 * Ús:
 * const { willChangeStyle, handlers } = useWillChange();
 * <div style={willChangeStyle} {...handlers}>...</div>
 */
export function useWillChange() {
  const [isInteracting, setIsInteracting] = useState(false);

  const onPointerEnter = useCallback(() => setIsInteracting(true), []);
  const onPointerLeave = useCallback(() => {
    // Retardem un poc la desactivació per si la transició CSS encara està corrent (0.2s)
    setTimeout(() => setIsInteracting(false), 250);
  }, []);

  const handlers = {
    onPointerEnter,
    onPointerLeave,
    onTouchStart: onPointerEnter,
    onTouchEnd: onPointerLeave
  };

  const willChangeStyle = isInteracting ? { willChange: 'transform' } : {};

  return { willChangeStyle, handlers };
}
