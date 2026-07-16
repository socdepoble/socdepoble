import React from 'react';
import { BrainCircuit, Languages, MessageCircle, Share2 } from 'lucide-react';
import './Universal.css';

export function UniversalPage({ title, children, tone }) {
  return (
    <div className={`sp-page${tone ? ` is-${tone}` : ''}`}>
      {title ? (
        <header className="sp-page-header">
          <div className="sp-page-inner-header">
            <h1 className="sp-page-title">{title}</h1>
          </div>
        </header>
      ) : null}
      <div className="sp-page-inner-content">{children}</div>
    </div>
  );
}

export function IconButton({ label, children, onClick }) {
  return (
    <button className="sp-icon-button" type="button" aria-label={label} title={label} onClick={onClick}>
      {children}
    </button>
  );
}

export function UniversalButton({
  children,
  onClick,
  variant = "primary",
  type = "button",
  className = ""
}) {
  return (
    <button className={`button ${variant} ${className}`} type={type} onClick={onClick}>
      {children}
    </button>
  );
}

export function UniversalCard({
  title,
  body,
  location,
  time,
}) {
  return (
    <article className="sp-card">
      <header className="sp-card-header">
        <span className="sp-avatar sp-sp-avatar-compact" aria-hidden="true">
          <BrainCircuit />
        </span>
        <div>
          <strong>Sóc de Poble</strong>
          <p>{location || 'El teu poble'}</p>
        </div>
        <time>{time}</time>
      </header>
      <div className="sp-card-body">
        <h3>{title}</h3>
        {body ? <p>{body}</p> : null}
        <div className="sp-stone-image" aria-label="Imatge placeholder de pedra seca" />
      </div>
      <footer className="sp-card-footer">
        <IconButton label="Traduir">
          <Languages aria-hidden="true" />
        </IconButton>
        <IconButton label="Xatejar">
          <MessageCircle aria-hidden="true" />
        </IconButton>
        <IconButton label="Compartir">
          <Share2 aria-hidden="true" />
        </IconButton>
        <UniversalButton variant="outline">+ CONNECTAR</UniversalButton>
      </footer>
    </article>
  );
}
