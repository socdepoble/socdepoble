import React, { forwardRef } from 'react';

const BancalInput = forwardRef(({ 
  value, 
  onChange, 
  placeholder = "Escriu açí...", 
  className = "",
  ...props 
}, ref) => {
  return (
    <textarea 
      ref={ref}
      id="chat-input"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full resize-none rounded-xl border px-[var(--sp-space-4,16px)] py-[var(--sp-space-3,12px)] text-base
                 bg-white text-gray-900 dark:bg-gray-900 dark:text-white border-gray-300 dark:border-gray-700
                 focus:outline-none focus:ring-2 focus:ring-orange-500 ${className}`}
      style={{ 
        // Llei d'iOS: previndre zoom automàtic
        WebkitTextSizeAdjust: '100%', 
        touchAction: 'manipulation',
        minHeight: '56px'
      }}
      rows={1}
      inputMode="text"
      aria-label={placeholder}
      {...props}
    />
  );
});

BancalInput.displayName = 'BancalInput';

export default BancalInput;
