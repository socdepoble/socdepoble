import React, { useCallback } from 'react';

/**
 * SpInteractive — Embolcall semàntic per a qualsevol element interactiu
 * que no siga un <button> o <a> natiu.
 * 
 * Garanteix: role, tabIndex, onKeyDown (Enter+Space), aria-label.
 * Construït seguint la filosofia de la Pedra Seca (indestructible i accessible).
 * 
 * @param {string} as - Tag HTML ('div', 'span', 'li'...). Default: 'div'
 * @param {function} onClick - Handler de clic
 * @param {string} [ariaLabel] - Descripció per a lectors de pantalla
 * @param {boolean} [disabled] - Desactiva interactivitat
 */
export function SpInteractive({
  as: Tag = 'div',
  onClick,
  ariaLabel,
  disabled = false,
  children,
  className,
  ...rest
}) {
  const handleKeyDown = useCallback(e => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); // Evita scroll en Space
      onClick?.(e);
    }
  }, [onClick, disabled]);
  return <Tag role="button" tabIndex={disabled ? -1 : 0} aria-label={ariaLabel} aria-disabled={disabled || undefined} onClick={disabled ? undefined : onClick} onKeyDown={handleKeyDown} className={className} {...rest}>
      {children}
    </Tag>;
}