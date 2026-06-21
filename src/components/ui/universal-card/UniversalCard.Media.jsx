import React from 'react';
import PropTypes from 'prop-types';
import styles from './UniversalCard.module.css';

const UniversalCardMedia = React.memo(({
  displayImage,
  displayTitle,
  videoUrl,
  subtitleUrl,
  aspectMode = 'square',
  className
}) => {

  const mediaClass = className || styles.cardMedia;

  if (videoUrl) {
    return (
      <div className={mediaClass}>
        <video 
          src={videoUrl} 
          controls 
          className="w-full h-full object-cover" 
          poster={displayImage}
          preload="none"
          aria-label={displayTitle ? `Vídeo: ${displayTitle}` : 'Vídeo de contingut'}
        >
          {subtitleUrl && <track kind="subtitles" src={subtitleUrl} srcLang="ca" label="Català" default />}
        </video>
      </div>
    );
  }

  if (displayImage) {
    return (
      <img
        src={displayImage}
        alt={displayTitle ? `Imatge per a: ${displayTitle}` : 'Imatge decorativa'}
        loading="lazy"
        decoding="async"
        className={mediaClass}
      />
    );
  }

  return null;
});

UniversalCardMedia.displayName = 'UniversalCardMedia';

UniversalCardMedia.propTypes = {
  displayImage: PropTypes.string,
  displayTitle: PropTypes.string,
  videoUrl: PropTypes.string,
  subtitleUrl: PropTypes.string,
  aspectMode: PropTypes.string,
  className: PropTypes.string
};

export default UniversalCardMedia;
