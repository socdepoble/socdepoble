import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { textVariants } from './Text.variants';

/**
 * Component Tipogràfic Mestre - "Llei de la Boina Taronja"
 * Assegura consistència semàntica i visual per a tot l'entorn CMS.
 */
export const Text = React.forwardRef(({ 
  variant = 'paragraph', 
  isDayMode = true, 
  glow = 'none',
  as, 
  className, 
  children, 
  ...props 
}, ref) => {
  // Map variant to default HTML element if `as` is not provided
  const Component = as || (
    variant === 'h1' ? 'h1' : 
    variant === 'h2' ? 'h2' : 
    variant === 'h3' ? 'h3' : 
    variant === 'subtitle' ? 'p' :
    variant === 'secondary' ? 'p' :
    variant === 'overline' ? 'span' :
    'p'
  );

  return (
    <Component
      ref={ref}
      className={twMerge(clsx(textVariants({ variant, isDayMode, glow }), className))}
      {...props}
    >
      {children}
    </Component>
  );
});

Text.displayName = 'Text';
