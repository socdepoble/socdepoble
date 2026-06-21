import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './UniversalCard.module.css';

const UniversalCardHeader = React.memo(({
  displayAuthor,
  avatarSrc,
  displayTown,
  className
}) => {
  const [imgError, setImgError] = useState(false);
  const showImage = avatarSrc && !imgError;

  return (
    <header className={`${styles.cardHeader} ${className || ''}`.trim()} aria-label={`Informació de l'autor: ${displayAuthor || 'desconegut'}`}>
      {showImage ? (
        <img
          src={avatarSrc}
          alt={typeof displayAuthor === 'string' && displayAuthor.trim() ? `Avatar de ${displayAuthor}` : 'Autor desconegut'}
          className="w-11 h-11 shrink-0 object-cover"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        <div 
          role="img" 
          aria-label={typeof displayAuthor === 'string' && displayAuthor.trim() ? `Avatar de ${displayAuthor}` : 'Avatar per defecte'}
          className="w-11 h-11 shrink-0 flex items-center justify-center bg-black/10 text-black/80 font-bold text-lg"
        >
          <span aria-hidden="true">
            {(typeof displayAuthor === 'string' ? displayAuthor.trim().charAt(0) : 'S').toUpperCase()}
          </span>
        </div>
      )}
    <div className="flex flex-col min-w-0">
      <span className={styles.author}>{displayAuthor || 'Autor desconegut'}</span>
      {displayTown ? (
        <span className={styles.town}>
          {typeof displayTown === 'string' ? displayTown.replace('Poble Principal:', '').trim() : ''}
        </span>
      ) : null}
    </div>
    </header>
  );
});

UniversalCardHeader.displayName = 'UniversalCardHeader';

UniversalCardHeader.propTypes = {
  displayAuthor: PropTypes.string,
  avatarSrc: PropTypes.string,
  displayTown: PropTypes.string,
  className: PropTypes.string
};

export default UniversalCardHeader;
