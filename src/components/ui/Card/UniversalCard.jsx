import React from 'react';
import styles from './UniversalCard.module.css';

/**
 * UniversalCard
 * El contenidor principal de la Masia (Pedra Seca).
 * Està lliure de classes d'estil de Tailwind per a complir la Constitució SOSP.
 * 
 * @param {string} className Permet passar classes d'esquelet de Tailwind (ex: 'w-full', 'col-span-2')
 * @param {boolean} interactive Defineix si la targeta reacciona a l'hover (Surar)
 */

const playAtomicFeedback = () => {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10); // Lleugerament més subtil que el botó
    }
  } catch (e) {
    // Safari iOS silencia l'error
  }
};
export const UniversalCard = React.forwardRef(({
  children,
  className = '',
  interactive = false,
  as: ComponentProp,
  onClick,
  ...props
}, ref) => {
  const Component = ComponentProp || (onClick ? 'button' : 'article');
  const isInteractive = interactive || !!onClick;
  const cardClasses = [styles['universal-card'], isInteractive ? styles.interactive : '', isInteractive ? 'tactil' : '',
  // Per a la vibració òptica a acte-reflex.css
  className].filter(Boolean).join(' ');
  return <Component ref={ref} className={cardClasses} onClick={e => {
    if (isInteractive) {
      playAtomicFeedback();
    }
    if (onClick) onClick(e);
  }} {...props}>
        {children}
      </Component>;
});
UniversalCard.displayName = 'UniversalCard';