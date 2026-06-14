import React from 'react';
import styles from './UniversalButton.module.css';

/**
 * UniversalButton
 * Component creat sota les directrius del Consell SOSP (Pedra Seca).
 * - Aquest component NO UTILITZA classes Tailwind per a estètica.
 * - Els estils (colors, radis, transicions) viuen a UniversalButton.module.css.
 * - Suporta els estats: Surar, Premut, Sec.
 */

const playAtomicFeedback = () => {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(15); // Cop curt i sec de Pedra Seca
    }
  } catch (e) {
    // Safari iOS bloqueja la funció silenciosament. El CSS farà el treball òptic.
  }
};
export const UniversalButton = React.forwardRef(({
  className = '',
  variant = 'primary',
  // 'primary' | 'secondary'
  fullWidth = false,
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  children,
  as: ComponentProp,
  ...props
}, ref) => {
  const Component = ComponentProp || (props.href ? 'a' : 'button');

  // Mapeig de classes segons la variant
  let variantClass = styles.primary;
  if (variant === 'secondary') variantClass = styles.secondary;
  if (variant === 'danger') variantClass = styles.danger;
  if (variant === 'ghost') variantClass = styles.ghost;
  if (variant === 'canonic') variantClass = styles.primary; // Alias for backward compatibility

  // Classes estàtiques del CSS Module + condicions
  const btnClasses = [styles['universal-button'], variantClass, fullWidth ? styles['full-width'] : '', className // S'admeten classes de layout des de fora (ex: 'w-full', 'mt-4')
  ].filter(Boolean).join(' ');
  const isDisabled = isLoading || disabled;
  return <Component ref={ref} className={btnClasses} disabled={Component === 'button' ? isDisabled : undefined} aria-disabled={isDisabled ? true : undefined} onClick={e => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }
    playAtomicFeedback();
    if (props.onClick) {
      props.onClick(e);
    }
  }} {...props}>
        {isLoading ? <>
            <svg className={styles.spinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Carregant...
          </> : <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>}
      </Component>;
});
UniversalButton.displayName = 'UniversalButton';