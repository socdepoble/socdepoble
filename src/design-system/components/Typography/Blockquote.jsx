import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Blockquote = ({ children, isDayMode = true, className, ...props }) => {
  return (
    <blockquote
      className={twMerge(clsx(
        'pl-5 py-3 border-l-4 italic',
        isDayMode
          ? 'border-orange-500 bg-orange-50 text-gray-800'
          : 'border-blue-400 bg-blue-900/30 text-gray-200',
        className
      ))}
      {...props}
    >
      {children}
    </blockquote>
  );
};
