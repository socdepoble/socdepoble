import React from 'react';
import './PedraSecaPurifier.css';

/**
 * PedraSecaPurifier (El Purificador - Patró d'Estrangulació)
 * Wrapper d'emergència per a components heretats (com AdminPanel) que tenen 
 * deute tècnic i sopa de divs. Aïlla el CSS, forçant els estils canònics.
 */
export const PedraSecaPurifier = ({ children, className = '' }) => {
  return (
    <div className={`pedra-seca-purifier ${className}`}>
      {children}
    </div>
  );
};

export default PedraSecaPurifier;
