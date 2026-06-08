import React, { memo } from 'react';

const PedraMissatge = memo(({ message, isOwn }) => {
  const { id, content, author, timestamp, attachments, status } = message;

  const formatTime = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <article
      className={`pedra-missatge ${isOwn ? 'pedra-missatge--propi' : 'pedra-missatge--altri'}`}
      data-message-id={id}
      style={{
        // CONTRACTE STRICTE:
        // 1. maxWidth dins del component (el contenidor no limita)
        maxWidth: 'min(80%, 42rem)',
        // 2. wordBreak per a text llarg
        wordBreak: 'break-word',
        hyphens: 'auto',
        // 3. margin: 0 OBLIGATORI (el gap del pare gestiona l'espaiat)
        margin: 0,
        // 4. contain per aïllar repaints interns
        contain: 'layout paint',
      }}
    >
      <header className="pedra-missatge__meta flex items-center justify-between mb-1 opacity-70 px-2">
        {!isOwn && author?.name && (
          <span className="pedra-missatge__autor text-xs font-bold">{author.name}</span>
        )}
        <time className="pedra-missatge__hora text-[10px]" dateTime={timestamp ? new Date(timestamp).toISOString() : undefined}>
          {formatTime(timestamp)}
        </time>
      </header>

      <div 
        className="pedra-missatge__cos"
        style={{
          // Colors per a contrast AAA
          backgroundColor: isOwn ? 'var(--sp-accent-primary, #d97706)' : 'var(--sp-bg-panel, #f5f5f0)',
          color: isOwn ? '#ffffff' : 'var(--sp-text-main, #1a1a1a)',
          borderRadius: '1.75rem',
          borderBottomRightRadius: isOwn ? '0.5rem' : '1.75rem',
          borderBottomLeftRadius: isOwn ? '1.75rem' : '0.5rem',
          padding: 'calc(var(--sp-space-3, 12px) * var(--lupa-scale, 1))',
        }}
      >
        {content && (
          <p 
            className="pedra-missatge__text text-base"
            style={{
              margin: 0,
            }}
          >
            {content}
          </p>
        )}

        {attachments?.map((att, idx) => (
          <figure 
            key={`${id}-att-${idx}`} 
            className="pedra-missatge__adjunt"
            style={{
              margin: '0.75rem 0 0 0',
              borderRadius: '0.75rem',
              overflow: 'hidden',
            }}
          >
            {att.type === 'image' && (
              <img
                src={att.src}
                alt={att.alt || 'Imatge adjunta'}
                loading="lazy"
                decoding="async"
                style={{
                  display: 'block',
                  width: '100%',
                  height: 'auto',
                  maxHeight: '300px',
                  objectFit: 'cover',
                }}
                onLoad={(e) => {
                  // CRÍTIC: Notificar al virtualitzador que l'alçada ha canviat
                  const wrapper = e.target.closest('[data-virtual-index]');
                  if (wrapper) {
                    wrapper.style.minHeight = `${e.target.offsetHeight + 32}px`;
                  }
                }}
              />
            )}
          </figure>
        ))}
      </div>

      {isOwn && status && (
        <footer className="pedra-missatge__estat flex justify-end" style={{ marginTop: '0.25rem', padding: '0 0.75rem', fontSize: '0.75px', opacity: 0.7 }}>
          <span className="text-[10px]" aria-label={status === 'read' ? 'Llegit' : status === 'delivered' ? 'Lliurat' : 'Enviat'}>
            {status === 'read' ? '✓✓' : '✓'}
          </span>
        </footer>
      )}
    </article>
  );
});

PedraMissatge.displayName = 'PedraMissatge';

export default PedraMissatge;
