import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const HStack = ({ 
  children, 
  spacing = 'md', 
  align = 'center',
  justify = 'start', 
  className, 
  ...props 
}) => {
  const spacingMap = {
    none: 'space-x-0',
    sm: 'space-x-2',
    md: 'space-x-4',
    lg: 'space-x-6',
    xl: 'space-x-8',
    '2xl': 'space-x-12',
  };

  const alignMap = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const justifyMap = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div
      className={twMerge(clsx(
        'flex flex-row',
        spacingMap[spacing],
        alignMap[align],
        justifyMap[justify],
        className
      ))}
      {...props}
    >
      {children}
    </div>
  );
};
