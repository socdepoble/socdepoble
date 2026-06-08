import React from 'react';
import styles from './UniversalInput.module.css';

/**
 * UniversalInput
 * Entrada de text i dades respectant l'espaiat de 56px per a "dits de llaurador"
 * i textos de 16px per a no desencadenar zoom a l'A10.
 */
export const UniversalInput = React.forwardRef(
  ({ id, label, error, className = '', ...props }, ref) => {
    
    // Generem un ID aleatori si no en rebem un, per a enllaçar el label i l'input correctament
    const inputId = id || `sosp-input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={`${styles['input-group']} ${className}`}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}
        
        <input
          id={inputId}
          ref={ref}
          className={styles['input-field']}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        
        {error && (
          <span id={`${inputId}-error`} className={styles['error-message']} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);

UniversalInput.displayName = 'UniversalInput';
