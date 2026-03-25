import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Portal v10.0 (Escut de Titani Z-Index)
 * Injecta el component directament l'arrel de l'aplicació per saltar-se 
 * qualsevol "stacking context" destructiu originat per "transforms" o "backdrop-filters" als pares.
 */
export default function Portal({ children }) {
  const [container] = useState(() => document.createElement('div'));

  useEffect(() => {
    container.setAttribute('data-portal', 'true');
    container.setAttribute('aria-hidden', 'false');
    container.setAttribute('class', 'app-portal');
    document.body.appendChild(container);
    return () => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };
  }, [container]);

  return createPortal(children, container);
}
