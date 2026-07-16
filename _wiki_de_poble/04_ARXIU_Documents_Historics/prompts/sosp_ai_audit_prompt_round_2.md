---
estat: "arxivat"
tipus: "prompt"
description: "[CONSELL DE LA PETORRETA — SEGONA RONDA]"
---
# SDP-PETORRETA-046: Auditoria de Codi Implementat

**[CONSELL DE LA PETORRETA — SEGONA RONDA]**

El Sistema Sóc de Poble (IAIA MarIA) ha executat i purgat l'arquitectura segons les vostres recomanacions unànimes de la primera ronda. Hem aplicat la Grid de 3 àrees, eliminat la brossa SaaS (blur, ombres), implantat la Bottom Nav per a mòbil i reparat totes les bretxes d'accessibilitat en els `UniversalComponents`.

A continuació vos exposem el codi exacte resultant de l'operació. La vostra missió com a auditors és **analitzar exclusivament aquest codi** i buscar si hem deixat algun "fantasma", si hi ha cap coll d'ampolla de rendiment per a dispositius A10 o si hi ha alguna violació del cànon estètic Pedra Seca. Si el codi és 100% pur, aproveu-lo. Si hi ha cap error, sigueu implacables.

---

### 1. `UniversalComponents.jsx`
```jsx
import React from 'react';
import './Universal.css';

export function UniversalPage({ title, children, tone }) {
  return (
    <div className="universal-page">
      {title ? (
        <header className={`universal-page-header${tone ? ` is-${tone}` : ''}`}>
          <div className="universal-page-inner-header">
            <h1 className="universal-page-title">{title}</h1>
          </div>
        </header>
      ) : null}
      <div className="universal-page-inner-content">{children}</div>
    </div>
  );
}

export function UniversalCard({ title, children, footer, onClick, tone }) {
  const isClickable = Boolean(onClick);
  
  const clickableProps = isClickable ? {
    role: 'button',
    tabIndex: 0,
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick(e);
      }
    }
  } : {};

  return (
    <div 
      className={`universal-card${isClickable ? ' clickable' : ''}${tone ? ` is-${tone}` : ''}`}
      onClick={onClick}
      {...clickableProps}
    >
      {title ? (
        <div className="universal-card-header">
          <h2 className="universal-card-title">{title}</h2>
        </div>
      ) : null}
      <div className="universal-card-body">{children}</div>
      {footer ? <div className="universal-card-footer">{footer}</div> : null}
    </div>
  );
}

export function UniversalButton({ children, onClick, variant = 'primary', icon, fullWidth = false }) {
  return (
    <button
      type="button"
      className={`universal-button universal-button-${variant} ${fullWidth ? 'full-width' : ''}`}
      onClick={onClick}
    >
      {icon ? React.cloneElement(icon, { 'aria-hidden': 'true' }) : null}
      {children}
    </button>
  );
}
```

### 2. `AppShell` (dins d'App.jsx)
```jsx
function AppShell({ children }) {
  const navigate = useNavigate();
  const { language, t } = useAppData();

  return (
    <div className="app-shell">
      <TopBar />
      <aside className="app-nav">
        <div className="app-brand">
          <BrandMark className="app-brand__mark" />
          <div className="app-brand__name">
            <strong>{APP_NAME}</strong>
            <span>{t('app.tagline', APP_TAGLINE)}</span>
          </div>
        </div>

        <button type="button" className="nav-cta" onClick={() => navigate('/control')}>
          <Plus size={22} strokeWidth={2.8} />
          <span>CENTRE DE CONTROL</span>
        </button>

        <nav className="nav-stack">
          {NAV_SECTIONS.map((section) => {
            const Icon = section.icon;
            const labels = getSectionLabels(section.id, language);
            return (
              <NavLink key={section.id} to={section.path} className="nav-item">
                <Icon className="nav-item__icon" strokeWidth={2.1} />
                <span className="nav-item__text">
                  <strong>{labels.label}</strong>
                </span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <main className="app-main">
        <div className="app-main__inner">
          {children}
        </div>
      </main>
    </div>
  );
}
```

### 3. CSS Grid Pedra Seca (global.css)
```css
/* ARQUITECTURA BASE GRID (Escriptori) */
.app-shell {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: 320px minmax(0, 1fr);
  grid-template-areas:
    "topbar topbar"
    "nav main";
  background-color: #131313;
  color: #ffffff;
}

/* TOPBAR ESTIL PEDRA SECA */
.topbar {
  grid-area: topbar;
  position: sticky;
  top: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: #131313;
  border-bottom: 2px solid #ffb68f; 
  border-radius: 0;
  backdrop-filter: none;
  box-shadow: none;
}

/* BARRA LATERAL */
.app-nav {
  grid-area: nav;
  position: sticky;
  top: 68px;
  height: calc(100vh - 68px); 
  overflow-y: auto;
  background: #131313;
  border-right: 2px solid #ffffff; 
  padding: 24px 16px;
}

/* CONTINGUT PRINCIPAL */
.app-main {
  grid-area: main;
  min-width: 0;
  padding: 24px;
  background-color: #ffffff;
  color: #131313; 
}

/* ADAPTACIÓ MÒBIL: BOTTOM NAV BOTTOM-FIRST */
@media (max-width: 768px) {
  .app-shell {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
      "topbar"
      "main"
      "nav";
  }

  .app-nav {
    grid-area: nav;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: auto;
    height: 76px;
    display: flex;
    align-items: stretch;
    justify-content: space-around;
    padding: 8px 12px 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(5, 5, 5, 0.98);
    z-index: 70;
    border-radius: 0;
    border-right: none;
    overflow: visible;
  }

  .app-brand { display: none; }

  .nav-stack {
    display: flex;
    flex: 1;
    justify-content: space-around;
    align-items: center;
    margin-top: 0;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 48px;
    min-height: 56px;
    padding: 6px;
  }

  .nav-cta {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate(-50%, -50%);
    width: 64px;
    height: 64px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #ffb68f;
    color: #131313;
    box-shadow: none;
    border: none;
    z-index: 10;
  }
  
  .nav-cta span { display: none; }
}
```