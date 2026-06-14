import React from 'react';
import styles from './UniversalHeader.module.css';

/**
 * UniversalHeader
 * Capçalera centralitzada per a tota l'App, evitant el codi spaguetti de Tailwind.
 * Només s'accepten classes Tailwind a través de `className` per establir posicionament 
 * espacial (com `sticky top-0 z-50`), però no per a estètica.
 *
 * @param {ReactNode} leftSlot Contingut a l'esquerra (ex: botó tornar)
 * @param {string|ReactNode} title Títol central (Taronja per defecte segons CSS)
 * @param {ReactNode} rightSlot Contingut a la dreta (ex: botó d'accions o perfil)
 * @param {boolean} glass Si és true, aplica l'efecte backdrop-blur
 */
export const UniversalHeader = ({
  title,
  leftSlot,
  rightSlot,
  className = '',
  glass = true
}) => {
  const headerClasses = [styles['header-container'], glass ? styles.glass : '', className // Permet passar layout (ex: "sticky top-0 z-50")
  ].filter(Boolean).join(' ');
  return <header className={headerClasses} role="banner">
      <div className={styles['slot-left']}>
        {leftSlot}
      </div>
      
      {title && <h1 className={styles.title}>
          {title}
        </h1>}
      
      <div className={styles['slot-right']}>
        {rightSlot}
      </div>
    </header>;
};
UniversalHeader.displayName = 'UniversalHeader';