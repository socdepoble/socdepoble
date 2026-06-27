import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Box = ({ 
  children, 
  className, 
  as = 'div',
  ...props 
}) => {
  const Component = as;
  
  return (
    <Component
      className={twMerge(clsx('', className))}
      {...props}
    >
      {children}
    </Component>
  );
};
