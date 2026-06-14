import React from 'react';
import UniversalCardHeader from './UniversalCard.Header';
import UniversalCardMedia from './UniversalCard.Media';
import UniversalCardBody from './UniversalCard.Body';
import ActionBar from '../ActionBar';
import './UniversalCard.css';
import { SDP } from '../../../lib/eventBus';

const resolveCardUrl = ({ type, id, slug }) => {
  if (!id && !slug) return '/';
  if (type === 'mercat' || type === 'product') return `/mercat/${id}`;
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

  // Lògica de negoci internalitzada (Grok)
  const isMarket = variant === 'mercat' || type === 'market_item' || type === 'product';
  const primaryLabel = isMarket ? 'AFEGIR' : 'CONNECTAR';
  const primaryEvent = isMarket ? SDP.ADD_CART : SDP.CONNECT;

  return (
    <article
      className={`universal-card ${className}`}
      data-variant={variant}
      data-viewmode={viewMode}
      data-senior={seniorMode || undefined}
      data-post-id={id}
      aria-label={title}
    >
      <UniversalCardHeader
        displayAuthor={authorName}
        avatarSrc={authorAvatar}
        displayTown={townName}
      />

      {hasMedia && (
        <UniversalCardMedia
          displayImage={image}
          displayTitle={title}
          videoUrl={videoUrl}
        />
      )}

      <UniversalCardBody
        displayTitle={title}
        displayExcerpt={excerpt}
        subtitle={subtitle}
        price={price}
        cardUrl={cardUrl}
      >
        {children}
      </UniversalCardBody>

      {/* Footer slot opcional (Grok) */}
      {footer !== undefined ? footer : (
        <ActionBar
          entityId={id}
          entityType={type}
          entityTitle={title}
          primaryLabel={primaryLabel}
          primaryEvent={primaryEvent}
        />
      )}
    </article>
  );
};

export default React.memo(UniversalCard);
