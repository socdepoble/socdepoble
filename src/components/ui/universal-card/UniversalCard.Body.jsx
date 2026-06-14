import React from 'react';
import { Link } from 'react-router-dom';
import { sanitizeHtml } from '../../../utils/sanitizeHTML';

const UniversalCardBody = React.memo(({
  displayTitle,
  displayExcerpt,
  subtitle,
  price,
  cardUrl,
  children
}) => {
  const displayPrice = price ? `${price} €` : null;

  return (
    <section className="uc-body">
      <div className="flex items-start justify-between gap-3">
        <h2 className="uc-title flex-1 min-w-0">{displayTitle}</h2>
        {displayPrice && (
          <span className="uc-price shrink-0">{displayPrice}</span>
        )}
      </div>

      {subtitle && (
        <h3 className="uc-subtitle">{subtitle}</h3>
      )}

      {displayExcerpt && (
        <div
          className="uc-excerpt"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(displayExcerpt) }}
        />
      )}

      {children && (
        <div className="mt-2 w-full">{children}</div>
      )}

      {cardUrl && (
        <Link
          to={cardUrl}
          className="uc-read-more mt-auto"
          aria-label={`Llegir més sobre ${displayTitle}`}
        >
          Llegir més →
        </Link>
      )}
    </section>
  );
});

UniversalCardBody.displayName = 'UniversalCardBody';
export default UniversalCardBody;
