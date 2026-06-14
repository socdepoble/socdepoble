import { useRef, useEffect } from 'react';

/**
 * useBranchZero: evita render condicional destruint branches.
 * Retorna props de visibilitat i aria-hidden; el component ha d'exposar sempre la mateixa estructura.
 */
export function useBranchZero(visible, options = { placeholder: true }) {
  const ref = useRef({ visible });
  useEffect(() => { ref.current.visible = visible; }, [visible]);
  return {
    'data-visible': visible ? 'true' : 'false',
    'aria-hidden': visible ? 'false' : 'true',
    style: visible ? {} : { visibility: 'hidden', pointerEvents: 'none' }
  };
}
