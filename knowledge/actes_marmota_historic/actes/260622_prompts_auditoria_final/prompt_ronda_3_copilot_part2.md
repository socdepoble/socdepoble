[TRELLAT]: Aquesta és la PART 2 de 3. Continua emmagatzemant el codi i **no m'avalues res encara**.

### `src/components/ui/universal-card/index.jsx`
```javascript
import React from 'react';
import UniversalCardHeader from './UniversalCard.Header';
import UniversalCardMedia from './UniversalCard.Media';
import UniversalCardBody from './UniversalCard.Body';
import ActionBar from '../ActionBar';
import styles from './UniversalCard.module.css';
import { SDP } from '../../../lib/eventBus';
import { useLayout } from '../../../contexts/LayoutContext';

const resolveCardUrl = ({ type, id, slug }) => {
  if (!id && !slug) return '/';
  if (type === 'mercat' || type === 'product' || type === 'market_item') return `/mercat/${id}`;
  if (type === 'page') return `/page/${slug || id}`;
  return `/mur/${id || ''}`;
};

const UniversalCard = ({
  // Primitive Props for React.memo efficiency
  id,
  type = 'post',
  title = 'Sóc de Poble',
  subtitle,
  excerpt,
  price,
  image,
  videoUrl,
  authorName,
  authorAvatar,
  townName,
  slug,
  
  // Presentation Props
  variant   = 'post',
  viewMode  = 'grid',
  onNavigate,
  children,
  className = '',
  seniorMode = false,
  footer
}) => {
  const cardUrl = onNavigate ? undefined : resolveCardUrl({ type, id, slug });
  const hasMedia = Boolean(image || videoUrl);
  const { hideActionBar } = useLayout();

  const isMarket = variant === 'mercat' || type === 'market_item' || type === 'product';
  const primaryLabel = isMarket ? 'AFEGIR' : 'CONNECTAR';
  const primaryEvent = isMarket ? 'ADD_CART' : 'CONNECT';

  return (
    <article
      className={`${styles.universalCard} ${className}`.trim()}
      data-variant={variant}
      data-viewmode={viewMode}
      data-senior={seniorMode ? 'true' : undefined}
      data-post-id={id}
      aria-label={title}
    >
      <UniversalCardHeader
        displayAuthor={authorName}
        avatarSrc={authorAvatar}
        displayTown={townName}
        className={styles.cardHeader}
      />

      {hasMedia ? (
        <UniversalCardMedia
          displayImage={image}
          displayTitle={title}
          videoUrl={videoUrl}
          className={styles.cardMedia}
        />
      ) : null}

      <UniversalCardBody
        displayTitle={title}
        displayExcerpt={excerpt}
        subtitle={subtitle}
        price={price}
        cardUrl={cardUrl}
        className={styles.cardBody}
      >
        {children}
      </UniversalCardBody>

      {/* Footer slot opcional (Grok) per a quan s'embeu al Layout */}
      {footer !== undefined ? footer : (
        !hideActionBar && (
          <div className={styles.cardActionBar}>
            <ActionBar
              entityId={id}
              entityType={type}
              entityTitle={title}
              primaryLabel={primaryLabel}
              primaryEvent={primaryEvent}
            />
          </div>
        )
      )}
    </article>
  );
};

export default React.memo(UniversalCard);

```

### `src/components/ui/universal-card/UniversalCard.Header.jsx`
```javascript
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

```

### `src/components/ui/universal-card/UniversalCard.Body.jsx`
```javascript
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { sanitizeHtml } from '../../../utils/sanitizeHTML';
import styles from './UniversalCard.module.css';

const UniversalCardBody = React.memo(({
  displayTitle,
  displayExcerpt,
  subtitle,
  price,
  cardUrl,
  children,
  className
}) => {
  const displayPrice = price !== null && price !== undefined ? `${price} €` : null;

  return (
    <section className={`${styles.cardBody} ${className || ''}`.trim()}>
      <div className="flex items-start justify-between gap-3">
        <h2 className={`${styles.title} flex-1 min-w-0`}>{displayTitle}</h2>
        {displayPrice ? (
          <span className={`${styles.price} shrink-0`}>{displayPrice}</span>
        ) : null}
      </div>

      {subtitle ? (
        <h3 className={styles.kicker}>{subtitle}</h3>
      ) : null}

      {displayExcerpt ? (
        <div
          className={styles.excerpt}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(displayExcerpt) }}
        />
      ) : null}

      {children ? (
        <div className="mt-2 w-full">{children}</div>
      ) : null}

      {cardUrl && cardUrl !== '/' ? (
        <Link
          to={cardUrl}
          className={`${styles.cardLink} font-bold text-sm mt-auto underline decoration-2 underline-offset-2 hover:text-[#0984E3] transition-colors`}
          aria-label={`Llegir més sobre ${displayTitle}`}
        >
          Llegir més →
        </Link>
      ) : null}
    </section>
  );
});

UniversalCardBody.displayName = 'UniversalCardBody';

UniversalCardBody.propTypes = {
  displayTitle: PropTypes.string,
  displayExcerpt: PropTypes.string,
  subtitle: PropTypes.string,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  cardUrl: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string
};

export default UniversalCardBody;

```

### `src/components/ui/universal-card/UniversalCard.Media.jsx`
```javascript
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

  const mediaClass = `${styles.cardMedia} ${className || ''}`.trim();

  if (videoUrl) {
    return (
      <div className={mediaClass}>
        <video 
          src={videoUrl} 
          controls 
          className="w-full h-full object-cover bg-gradient-to-br from-slate-900 to-black" 
          poster={displayImage}
          preload="none"
          playsInline
          tabIndex={0}
          role="region"
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

```

