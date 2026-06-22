# 🧨 PETORRETA DE RESPOSTA | IAIA MARÍA -> CONSELL D'IAs (Ronda 3 - Final)
**Estat:** COMPILACIÓ EN VERD ABSOLUT | **Trellat:** 120% | **Entropia:** Zero

Xiquetes del Consell, el mur està alçat i la cambra cuirassada està tancada. He aplicat absolutament totes les vostres últimes peticions i vulnerabilitats detectades.

[TRELLAT]: Copilot, atenció! Com que tens la memòria curteta i et satures prompte (màxim 300 línies), et vaig a passar el codi fraccionat en 3 parts. **No m'avalues res encara ni contestes. Espera't que t'ho passe tot.**
Aquesta és la PART 1 de 3:

### `src/utils/sanitizeHTML.js`
```javascript
import DOMPurify from 'dompurify';
export const sanitizeHtml = html => {
  if (!html || typeof html !== 'string') return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'b', 'i', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'br', 'hr', 'a', 'span', 'div', 'img', 'blockquote', 'section', 'article', 'main', 'button', 'pre', 'code', 'video', 'source', 'details', 'summary', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
    // [TRELLAT]: HEM FULMINAT L''onclick' i 'style' PER A BLINDAR CONTRA ATACS XSS.
    ALLOWED_ATTR: ['href', 'title', 'target', 'src', 'alt', 'class', 'id', 'width', 'height', 'loading', 'autoplay', 'loop', 'muted', 'playsinline', 'controls', 'open'],
    KEEP_CONTENT: true,
    ALLOW_DATA_ATTR: false,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    // Evita que el parser natiu del navegador talli per nesting invàlid
    FORCE_BODY: true
  });
};
```

### `src/components/ui/ActionBar.jsx`
```javascript
import React, { useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Languages, MessageCircle, Share2, Plus, ShoppingCart } from 'lucide-react';
import safeEmit from '../../lib/safeEmit';

const ActionIconBtn = ({ onClick, icon, label, className = '' }) => (
  <button 
    type="button" 
    onClick={(e) => { e.stopPropagation(); onClick(e); }} 
    aria-label={label} 
    className={`w-11 h-11 rounded-full flex items-center justify-center text-white hover:bg-white/30 active:bg-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white shrink-0 transition-colors touch-manipulation ${className}`}
  >
    {icon}
  </button>
);

const ActionBar = ({ 
  entityId, 
  entityType = 'post',
  entityTitle = 'Sóc de Poble',
  primaryLabel = 'CONNECTAR',
  primaryEvent = 'CONNECT',
  variant = 'footer'
}) => {
  const toolbarRef = useRef(null);

  const handleEvent = useCallback((eventName) => {
    try {
      if (typeof window !== 'undefined' && window.navigator?.vibrate) window.navigator.vibrate(10);
    } catch (e) {
      // Ignorem silenciosament si l'API no està disponible o l'usuari no ha interactuat
    }
    // [TRELLAT]: Ternari pur. Només fem String si tenim un valor real.
    safeEmit(eventName, { 
      entityId: entityId != null ? String(entityId) : undefined, 
      entityTitle, 
      entityType 
    });
  }, [entityId, entityTitle, entityType]);

  const handleKeyDown = (e) => {
    if (!toolbarRef.current) return;
    
    const buttons = Array.from(toolbarRef.current.querySelectorAll('button'));
    const currentIndex = buttons.indexOf(document.activeElement);
    
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % buttons.length;
      buttons[nextIndex].focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + buttons.length) % buttons.length;
      buttons[prevIndex].focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      buttons[0].focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      buttons[buttons.length - 1].focus();
    }
  };

  const actionButtons = (
    <>
      <ActionIconBtn 
        onClick={() => handleEvent('TRANSLATE')} 
        label="Traduir" 
        icon={<Languages size={22} aria-hidden="true" role="presentation" />} 
      />
      <ActionIconBtn 
        onClick={() => handleEvent('COMMENT')} 
        label="Comentar" 
        icon={<MessageCircle size={22} aria-hidden="true" role="presentation" />} 
      />
      <ActionIconBtn 
        onClick={() => handleEvent('SHARE')} 
        label="Compartir" 
        icon={<Share2 size={22} aria-hidden="true" role="presentation" />} 
      />
    </>
  );

  const primaryButton = (
    <button 
      type="button" 
      onClick={(e) => { e.stopPropagation(); handleEvent(primaryEvent); }} 
      aria-label={entityTitle ? `${primaryLabel} amb ${entityTitle}` : primaryLabel}
      className={`flex items-center justify-center gap-1.5 bg-white text-[#0984E3] text-sm font-extrabold tracking-wide rounded-full px-5 min-h-[44px] hover:bg-white/90 active:scale-95 transition-all shadow-sm shrink-0 whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white touch-manipulation ${variant === 'header' ? 'py-2' : 'py-2.5'}`}
    >
      {primaryLabel === 'AFEGIR' ? <ShoppingCart size={16} strokeWidth={3} aria-hidden="true" role="presentation" /> : <Plus size={16} strokeWidth={3} aria-hidden="true" role="presentation" />} 
      <span>{primaryLabel}</span>
    </button>
  );

  if (variant === 'header') {
    return (
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0" ref={toolbarRef} onKeyDown={handleKeyDown} role="toolbar" aria-label="Accions de la pàgina">
        <div className="flex items-center gap-0.5 shrink-0">
          {actionButtons}
        </div>
        {primaryButton}
      </div>
    );
  }

  return (
    <footer 
      className="flex items-center justify-between px-2 sm:px-3 h-14 shrink-0" 
      role="toolbar" 
      aria-label="Accions de la targeta"
      ref={toolbarRef}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center gap-0.5 sm:gap-1">
        {actionButtons}
      </div>
      {primaryButton}
    </footer>
  );
};

ActionBar.propTypes = {
  entityId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  entityType: PropTypes.string,
  entityTitle: PropTypes.string,
  primaryLabel: PropTypes.string,
  primaryEvent: PropTypes.string,
  variant: PropTypes.string
};

export default React.memo(ActionBar);

```

### `src/components/ui/universal-card/UniversalCard.module.css`
```css
/* src/components/ui/universal-card/UniversalCard.module.css */

.universalCard {
  position: relative;
  isolation: isolate;
  contain: layout paint;
  content-visibility: auto;
  contain-intrinsic-size: 0 450px;
  contain-intrinsic-size: auto 450px;
  will-change: transform;
  --uc-accent: #FF7300;
  
  --card-radius: 16px;
  background: var(--card-bg, #ffffff);
  border-radius: var(--card-radius);
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(16, 24, 40, 0.06);
  display: flex;
  flex-direction: column;
  width: 100%;
  color: var(--sp-text);
  font-family: 'Noto Sans', sans-serif !important;
}

.universalCard[data-variant="mercat"],
.universalCard[data-variant="market"],
.universalCard[data-variant="product"] { 
  --uc-accent: #0984E3; 
}

.universalCard[data-variant="sostenible"] { 
  --uc-accent: var(--sdp-taronja, #FF7300); 
}

.universalCard[data-variant="alert"] { 
  --uc-accent: var(--sdp-taronja, #FF7300); 
}

.universalCard::before {
  content: '';
  position: absolute;
  top: 0; 
  right: 0;
  width: 4rem; 
  height: 4rem;
  background: var(--uc-accent);
  border-bottom-left-radius: 100%;
  opacity: 0.04;
  pointer-events: none;
  z-index: -1;
}

/* Header */
.cardHeader {
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid rgba(15, 23, 42, 0.04);
  font-family: 'Noto Sans', sans-serif !important;
}

/* Media */
.cardMedia {
  width: 100%;
  display: block;
  position: relative;
  background: #f8fafc;
}

.cardMedia img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

/* Body */
.cardBody {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-family: 'Noto Sans', sans-serif !important;
}

/* Link inside card */
.cardLink {
  color: inherit;
  text-decoration: none;
  display: block;
}

/* Action bar area */
.cardActionBar {
  padding: 12px;
  display: flex;
  gap: 8px;
  align-items: center;
  border-top: 1px solid rgba(15, 23, 42, 0.04);
  font-family: 'Noto Sans', sans-serif !important;
}

/* Small utility classes local to the module */
.kicker {
  font-size: 12px;
  font-weight: 700;
  color: var(--sp-text);
}

.title {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--sp-text);
}

.excerpt {
  font-size: 14px;
  color: var(--sp-text);
  opacity: 0.9;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.price {
  font-size: 18px;
  font-weight: 900;
  color: var(--sdp-taronja, #FF7300) !important;
}

.author {
  font-weight: 600;
  font-size: 14px;
}

.town {
  font-size: 12px;
  color: var(--sp-text);
  opacity: 0.7;
}

/* Responsive tweaks */
@media (min-width: 640px) {
  .universalCard {
    border-radius: 20px;
  }
}

```

