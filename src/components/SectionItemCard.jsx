import { Link } from 'react-router-dom';

export default function SectionItemCard({
  to,
  state,
  image,
  title,
  subtitle,
  excerpt,
  meta = [],
  eyebrow,
  buttonLabel = 'Llegir més',
  children,
  className = ''
}) {
  const Wrapper = to ? Link : 'article';
  const wrapperProps = to
    ? { to, state, className: `card section-item-card ${className}`.trim() }
    : { className: `card section-item-card ${className}`.trim() };
  const visibleMeta = meta.filter(Boolean);

  return (
    <Wrapper {...wrapperProps}>
      {image ? (
        <div className="media-frame section-item-card__media">
          <img src={image} alt={title || 'Element'} loading="lazy" decoding="async" />
        </div>
      ) : null}

      <div className="card__body section-item-card__body">
        {eyebrow ? (
          <div className="badge-row">
            <span className="badge">{eyebrow}</span>
          </div>
        ) : null}

        <h2 className="card__title" style={{ marginTop: eyebrow ? 12 : 0 }}>{title}</h2>

        {subtitle ? <p className="section-item-card__subtitle">{subtitle}</p> : null}

        {excerpt ? <p className="card__text section-item-card__excerpt">{excerpt}</p> : null}

        {visibleMeta.length > 0 ? (
          <div className="feed-card__meta">
            {visibleMeta.map((entry) => (
              <span key={String(entry)}>{entry}</span>
            ))}
          </div>
        ) : null}

        {children ? <div className="section-item-card__extra">{children}</div> : null}

        {to ? (
          <div className="section-item-card__footer">
            <span className="section-item-card__action">{buttonLabel}</span>
          </div>
        ) : null}
      </div>
    </Wrapper>
  );
}
