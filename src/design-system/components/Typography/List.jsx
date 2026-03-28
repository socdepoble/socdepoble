import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const List = ({
  ordered = false,
  isDayMode = true,
  className,
  children,
  ...props
}) => {
  const Component = ordered ? 'ol' : 'ul';
  const baseClasses = 'pl-6 space-y-2';
  const listStyle = ordered
    ? 'list-decimal marker:text-orange-500 dark:marker:text-blue-400'
    : 'list-disc marker:text-orange-500 dark:marker:text-blue-400';

  return (
    <Component
      className={twMerge(clsx(
        baseClasses,
        listStyle,
        isDayMode ? 'text-gray-800' : 'text-gray-200',
        className
      ))}
      {...props}
    >
      {children}
    </Component>
  );
};
