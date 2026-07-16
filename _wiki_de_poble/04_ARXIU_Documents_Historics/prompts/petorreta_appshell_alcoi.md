---
estat: "arxivat"
tipus: "petorreta"
description: "Qui som i la nostra Missió:"
---
# 📜 ACTA PETORRETA: Integració de l'AppShell d'Alcoi i Disseny Pedra Seca

## 1. Context Global de Sóc de Poble
**Qui som i la nostra Missió:**
Sóc de Poble és una xarxa pública i rural, dissenyada per a connectar els pobles i la seua gent, donant prioritat a l'accessibilitat extrema, al rendiment en dispositius antics i a la identitat cultural autòctona.

**Identitat i IAIA MarIA:**
Jo sóc la IAIA MarIA, el sistema cognitiu i l'ànima del projecte, que vetla pel "Trellat" (el sentit comú) en cada línia de codi. Treballem junt amb l'esforç dels informàtics d'Alcoi, que ens han proporcionat una base tècnica de React excel·lent, neta i funcional.

**Model Arquitectònic - La Pedra Seca:**
El nostre disseny visual es basa en la "Pedra Seca":
- **Alt Contrast i Brutalisme Rural**: Fons negre (`#131313`, `#0a0a0a`), text clar, accents taronges (`#ffb68f`).
- **Rendiment Suprem**: Sense ombres (`box-shadow`), sense desenfocaments (`backdrop-filter`). Transicions mínimes.
- **Bancal Mode**: Botons i àrees interactives grans (mínim 44x48px) sense vores arredonides en les targetes (`border-radius: 0`), però amb botons suaus (`border-radius: 28px`).

---

## 2. La Situació Actual i el Dilema
Els informàtics d'Alcoi ens han lliurat un sistema molt net (React + Vite). No obstant això, la seua implementació de l'embolcall principal (`AppShell`) no quadra amb el nostre disseny de Pedra Seca.

**El Disseny d'Alcoi:**
- Una barra lateral esquerra que ocupa el 100% de l'alçada.
- Una barra superior (`TopBar`) que només ocupa la part central dreta, per damunt del contingut. Està arrodornida i flota sobre el contingut (`border-radius: 999px; position: sticky;`).

**El Nostre Disseny Desitjat:**
- Una **Barra Superior Global** negra que ocupe el 100% de l'amplada de la pantalla dalt de tot (amb el logo a l'esquerra i les icones globals a la dreta). Fons recte, sense vores arrodonides, estretament ancorada dalt.
- Una **Barra Lateral Esquerra** que comence just per davall de la barra superior.
- En mòbil, la barra lateral desapareix i es converteix en una **Barra Inferior** amb les 4 icones principals i un botó flotant de `+` al centre.

**El Problema:**
No volem entrar com un elefant en una terrisseria i destrossar la feina que han fet els d'Alcoi. Necessitem una estratègia, un *script* o una refactorització neta que adapte la seua estructura a la nostra sense trencar la seua lògica de rutes ni fer-los pensar que hem descartat la seua feina de forma negligent. Hem d'integrar-nos respectant la seua base.

---

## 3. Peticions per al Consell (Claude 3.5 Sonnet, ChatGPT-4o)

Benvolgut Consell, vos demane la vostra potència analítica per a les següents tasques:

1. **Avaluació dels Components Universals**:
   Més avall teniu el codi pur en React de `UniversalCard` i `UniversalPage`. Hem construït la Gestoria amb això. Necessite que auditeu este codi. Té errors? Hi ha "fantasmes" de disseny, problemes d'accessibilitat o de rendiment? Com els milloraríeu perquè siguen impecables i purs?

2. **Pla d'Integració de l'AppShell**:
   Com podem alterar l'estructura de `App.jsx` i el seu `global.css` per a col·locar la TopBar ocupant tot l'ample de la pantalla a dalt, i la barra lateral per davall, de la forma més elegant i menys invasiva possible respecte al codi original d'Alcoi? Necessitem que ens escrigueu la solució CSS (tipus Grid o Flexbox al `.app-shell`) i com reorganitzaríeu el JSX en `App.jsx`.

---

## 4. Codi Adjunt per a l'Auditoria

### A) El codi actual de l'AppShell (Base d'Alcoi, extret de `src/app/App.jsx`):
```jsx
function AppShell({ children }) {
  const navigate = useNavigate();
  const { language, t } = useAppData();

  return (
    <div className="app-shell">
      <aside className="app-nav">
        <div className="app-brand">
          <BrandMark className="app-brand__mark" />
          <div className="app-brand__name">
            <strong>{APP_NAME}</strong>
            <span>{t('app.tagline', APP_TAGLINE)}</span>
          </div>
        </div>

        <button
          type="button"
          className="nav-cta"
          onClick={() => navigate('/control')}
        >
          <Plus size={22} strokeWidth={2.8} />
          <span>CENTRE DE CONTROL</span>
        </button>

        <nav className="nav-stack" aria-label="Seccions">
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
          <TopBar />
          {children}
        </div>
      </main>
    </div>
  );
}
```

### B) Els estils CSS de l'AppShell d'Alcoi (extrets de `src/styles/global.css`):
```css
.app-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 0;
}

.app-nav {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: auto;
  background: rgba(5, 5, 5, 0.94);
  color: #fff;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  padding: 20px 16px;
}

.app-main {
  min-width: 0;
  padding: 22px;
}

.app-main__inner {
  max-width: var(--content-width);
  margin: 0 auto;
  display: grid;
  gap: 20px;
}

.topbar {
  position: sticky;
  top: 12px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  border: 1px solid rgba(17, 17, 17, 0.08);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.76);
  backdrop-filter: blur(18px);
  box-shadow: 0 10px 40px rgba(17, 17, 17, 0.06);
}
```

### C) Els nostres Universal Components (`UniversalComponents.jsx`):
```jsx
import React from 'react';
import './Universal.css';

export function UniversalPage({ title, children, headerColor = 'transparent' }) {
  return (
    <div className="universal-page">
      {title && (
        <header className="universal-page-header" style={{ backgroundColor: headerColor }}>
          <div className="universal-page-inner-header">
            <h1 className="universal-page-title">{title}</h1>
          </div>
        </header>
      )}
      <div className="universal-page-inner-content">
        {children}
      </div>
    </div>
  );
}

export function UniversalCard({ title, children, footer, onClick, headerColor }) {
  return (
    <div className={`universal-card ${onClick ? 'clickable' : ''}`} onClick={onClick}>
      {title && (
        <div className="universal-card-header" style={headerColor ? { backgroundColor: headerColor } : {}}>
          <h2 className="universal-card-title">{title}</h2>
        </div>
      )}
      <div className="universal-card-body">
        {children}
      </div>
      {footer && (
        <div className="universal-card-footer">
          {footer}
        </div>
      )}
    </div>
  );
}

export function UniversalButton({ children, onClick, variant = 'primary', icon, fullWidth = false }) {
  return (
    <button 
      className={`universal-button universal-button-${variant} ${fullWidth ? 'full-width' : ''}`} 
      onClick={onClick}
    >
      {icon && <span className="universal-button-icon">{icon}</span>}
      <span className="universal-button-text">{children}</span>
    </button>
  );
}
```

### D) Universal.css (Els estils Pedra Seca):
```css
/* Universal Pedra Seca Design System */
.universal-page {
  width: 100%;
  min-height: 100vh;
  background-color: #131313;
  color: #e5e2e1;
  font-family: Roboto, system-ui, sans-serif;
}
.universal-page-header {
  padding: 40px 40px 24px;
}
.universal-page-inner-header {
  max-width: 1280px;
  margin: 0 auto;
}
.universal-page-inner-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 40px 40px;
}
@media (max-width: 768px) {
  .universal-page-header { padding: 24px 24px 16px; }
  .universal-page-inner-content { padding: 0 24px 24px; }
}
.universal-page-title {
  font-size: 32px;
  font-weight: 400;
  line-height: 48px;
  margin: 0;
  color: #e5e2e1;
}

/* CARDS */
.universal-card {
  background-color: #0a0a0a;
  border: 1px solid #4A4740;
  border-radius: 0;
  display: flex;
  flex-direction: column;
  content-visibility: auto;
  transition: opacity 120ms ease;
}
.universal-card.clickable:hover {
  cursor: pointer;
  border: 2px solid #ffb68f;
}
.universal-card-header {
  padding: 16px;
  border-bottom: 1px solid #4A4740;
}
.universal-card-title {
  font-size: 20px;
  font-weight: 500;
  margin: 0;
}
.universal-card-body { padding: 16px; flex: 1; }
.universal-card-footer { padding: 16px; border-top: 1px solid #4A4740; }

/* BUTTONS */
.universal-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 48px;
  min-width: 48px;
  border-radius: 28px;
  border: none;
  font-family: Roboto, system-ui, sans-serif;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  padding: 0 24px;
  transition: opacity 120ms ease;
}
.universal-button.full-width { width: 100%; }
.universal-button:hover { opacity: 0.8; }
.universal-button-primary { background-color: #ffb68f; color: #542100; }
.universal-button-secondary { background-color: #a2c9ff; color: #00315b; }
.universal-button-outline { background-color: transparent; border: 1px solid #a88b7c; color: #e5e2e1; }
.universal-button-outline:hover { border-color: #ffb68f; opacity: 1; }
```