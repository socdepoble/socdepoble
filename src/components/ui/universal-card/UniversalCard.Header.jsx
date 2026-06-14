import React from 'react';

const UniversalCardHeader = React.memo(({
  displayAuthor,
  avatarSrc,
  displayTown
}) => (
  <header className="uc-header" aria-label="Autor">
    {avatarSrc ? (
      <img
        src={avatarSrc}
        alt={displayAuthor || ''}
        className="w-10 h-10 rounded-full shrink-0 object-cover"
        loading="lazy"
      />
    ) : (
      <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center bg-white/20 text-white font-bold text-lg">
        {displayAuthor ? displayAuthor.charAt(0).toUpperCase() : 'S'}
      </div>
    )}
    <div className="flex flex-col min-w-0">
      <span className="uc-author">{displayAuthor || 'Autor desconegut'}</span>
      {displayTown && (
        <span className="uc-town">
          {displayTown.replace('Poble Principal:', '').trim()}
        </span>
      )}
    </div>
  </header>
));

UniversalCardHeader.displayName = 'UniversalCardHeader';
export default UniversalCardHeader;
