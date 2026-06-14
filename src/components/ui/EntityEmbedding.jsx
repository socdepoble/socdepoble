// 📂 src/components/ui/EntityEmbedding.jsx
// Filosofia: 0 wrappers, 0 condicions de renderitzat complexes, SVG inline (0 peticions de xarxa).

import React, { memo } from 'react';

// Diccionari de formes geomètriques pures (Vector Embeddings)
const GEO_SHAPES = {
  poble: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" fill="white" />
    </svg>
  ),
  persona: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" />
    </svg>
  ),
  negoci: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8" aria-hidden="true">
      <path d="M3 21h18v-8l-9-7-9 7v8z" />
      <rect x="9" y="14" width="6" height="7" fill="white" />
    </svg>
  ),
  associacio: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8" aria-hidden="true">
      <path d="M12 2L2 22h20L12 2z" />
      <circle cx="12" cy="15" r="3" fill="white" />
    </svg>
  )
};

const LABELS = {
  poble: 'Entitat de tipus Poble',
  persona: 'Entitat de tipus Persona',
  negoci: 'Entitat de tipus Negoci',
  associacio: 'Entitat de tipus Associació'
};

export const EntityEmbedding = memo(function EntityEmbedding({ 
  type, 
  title, 
  subtitle, 
  onClick,
  id 
}) {
  // Validació defensiva: si el tipus no existeix, cau en 'poble' per no trencar la UI
  const safeType = GEO_SHAPES[type] ? type : 'poble';
  const ariaLabel = `${LABELS[safeType]}: ${title}`;

  return (
    <article
      id={id}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick?.(e)}
      className={`entity-embedding entity-${safeType}`}
      data-entity={safeType}
    >
      {/* Forma geomètrica pura (Vector Embedding) */}
      <div className="geo-shape" aria-hidden="true">
        {GEO_SHAPES[safeType]}
      </div>

      {/* Text directe, sense divs intermedis innecessaris */}
      <div className="entity-text">
        <span className="entity-title">{title}</span>
        {subtitle && <span className="entity-subtitle">{subtitle}</span>}
      </div>
    </article>
  );
});
