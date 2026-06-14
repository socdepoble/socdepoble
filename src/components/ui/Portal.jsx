import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Portal v10.0 (Escut de Titani Z-Index + Exorcismo de Fantasmas)
 * Injecta el component directament l'arrel de l'aplicació per saltar-se 
 * qualsevol "stacking context" i prevé fuges de memòria restaurant el focus i l'overflow.
 */
export default function Portal({
  children,
  isOpen = true
}) {
  const [container] = useState(() => document.createElement('div'));
  const previousActiveElement = useRef(null);
  useEffect(() => {
    if (!isOpen) return;

    // Trellat: Guardar foco para restaurarlo al cerrar
    previousActiveElement.current = document.activeElement;
    container.setAttribute('data-portal', 'true');
    container.setAttribute('class', 'app-portal');
    container.setAttribute('id', `portal-${Date.now()}`);
    document.body.appendChild(container);

    // Bloquear scroll del body
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      // EXORCISMO COMPLETO
      document.body.style.overflow = originalOverflow;
      if (previousActiveElement.current?.focus) {
        previousActiveElement.current.focus();
      }
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };
  }, [container, isOpen]);
  if (!isOpen) return null;
  return createPortal(children, container);
}