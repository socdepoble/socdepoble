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
