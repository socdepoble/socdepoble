import React from 'react';
import { sanitizeHtml } from '../../utils/sanitizeHtml';

export default function SafeHtml({ html, className = 'w-full max-w-none app-cms-content' }) {
  if (!html) return null;
  
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }} 
    />
  );
}
