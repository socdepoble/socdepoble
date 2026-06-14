import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { buttonVariants } from './Button.variants';
import { hapticService } from '../../../core/services/hapticService';
export const Button = React.forwardRef(({
  className,
  intent,
  size,
  shape,
  fullWidth,
  isLoading,
  context,
  children,
  leftIcon,
  rightIcon,
  as: ComponentProp,
  ...props
}, ref) => {
  const Component = ComponentProp || (props.href ? 'a' : 'button');
  const baseClasses = buttonVariants({
    intent,
    size,
    shape,
    fullWidth,
    isLoading,
    context
  });
  const mergedClasses = twMerge(clsx(baseClasses, className));
  return <Component ref={ref} className={mergedClasses} disabled={Component === 'button' ? isLoading || props.disabled : undefined} aria-disabled={isLoading || props.disabled ? true : undefined} onClick={e => {
    if (isLoading || props.disabled) {
      e.preventDefault();
      return;
    }
    // Activar haptic feedback si no és un link
    if (Component === 'button') {
      hapticService.playAtomicFeedback('action');
    }
    if (props.onClick) {
      props.onClick(e);
    }
  }} {...props}>
        {isLoading ? <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Carregant...
          </> : <>
            {leftIcon && <span className="mr-2 flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2 flex-shrink-0">{rightIcon}</span>}
          </>}
      </Component>;
});
Button.displayName = 'Button';