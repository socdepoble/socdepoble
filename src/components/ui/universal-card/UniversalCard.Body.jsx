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
