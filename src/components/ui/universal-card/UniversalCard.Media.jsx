import React from 'react';

const UniversalCardMedia = React.memo(({
  displayImage,
  displayTitle,
  videoUrl,
  aspectMode = 'square'
}) => {
  const isVideo = aspectMode === 'video';
  const mediaClass = isVideo ? 'uc-media uc-media--video' : 'uc-media';

  if (videoUrl) {
    return (
      <div className={mediaClass}>
        <video 
          src={videoUrl} 
          controls 
          className="w-full h-full object-cover"
          poster={displayImage}
        />
      </div>
    );
  }

  if (displayImage) {
    return (
      <img
        src={displayImage}
        alt={displayTitle || ''}
        loading="lazy"
        decoding="async"
        className={mediaClass}
      />
    );
  }

  return null;
});

UniversalCardMedia.displayName = 'UniversalCardMedia';
export default UniversalCardMedia;
