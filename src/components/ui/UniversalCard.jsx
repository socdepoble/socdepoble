import React from 'react';
import '../../styles/matrioixca.css';

function UniversalCard({
  id,
  title,
  subtitle,
  body,
  media,
  category = 'neutral',
  actions = []
}) {
  return (
    <article
      id={id}
      className={`sp-matrioixca sp-card sp-card--${category}`}
      data-escala="targeta"
      data-accent={category}
      aria-labelledby={id ? `${id}-title` : undefined}
    >
      <header className="sp-matrioixca-head">
        <h2
          id={id ? `${id}-title` : undefined}
          className="sp-card-title"
        >
          {title}
        </h2>

        {subtitle && (
          <p className="sp-card-subtitle">
            {subtitle}
          </p>
        )}
      </header>

      <div className="sp-matrioixca-body">
        {media?.src && (
          <img
            src={media.src}
            alt={media.alt || ''}
            loading="lazy"
            decoding="async"
            className="sp-card-media"
          />
        )}

        {body && (
          <p className="sp-card-body">
            {body}
          </p>
        )}
      </div>

      {!!actions?.length && (
        <footer
          className="sp-matrioixca-foot"
          aria-label="Accions"
        >
          {actions.map(action => (
            <button
              key={action.key}
              type="button"
              className="sp-btn-primary"
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </footer>
      )}
    </article>
  );
}

export default React.memo(UniversalCard);
