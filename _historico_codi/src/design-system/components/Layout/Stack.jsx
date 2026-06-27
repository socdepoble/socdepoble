import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Stack = ({ 
  children, 
  spacing = 'md', 
  align = 'start', 
  className, 
  ...props 
}) => {
  const spacingMap = {
    none: 'space-y-0',
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
    xl: 'space-y-8',
    '2xl': 'space-y-12',
    '3xl': 'space-y-16',
  };

  const alignMap = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  return (
    <div
      className={twMerge(clsx(
        'flex flex-col',
        spacingMap[spacing],
        alignMap[align],
        className
      ))}
      {...props}
    >
      {children}
    </div>
  );
};
