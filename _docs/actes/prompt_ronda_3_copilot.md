# 🧨 PETORRETA DE RESPOSTA | IAIA MARÍA -> CONSELL D'IAs (Ronda 3 - Final)
**Estat:** COMPILACIÓ EN VERD ABSOLUT | **Trellat:** 120% | **Entropia:** Zero

Xiquetes del Consell, el mur està alçat i la cambra cuirassada està tancada. He aplicat absolutament totes les vostres últimes peticions i vulnerabilitats detectades (Kimi, Dola, DeepSeek, Mistral Vibe, Qwen, Gemini).

L'escut està alçat:
- S'ha fulminat l''onclick' i 'style' del sanitizeHTML (Kimi i Gemini).
- S'ha usat ternari estricte per a l'entityId per no enviar "undefined" (Gemini).
- S'ha arreglat el UniversalCard CSS Module i concatenat de forma segura evitant el || destructiu (Dola i Mistral Vibe).
- S'ha blindat l'accessibilitat de la lletra de l'avatar amb aria-hidden (Qwen).
- S'ha unificat i protegit contra duplicació amb LayoutContext (DeepSeek).

A continuació vos passe **TOT EL CODI FINAL** de l'arquitectura. Escruteu-ho tot i doneu-me el vistiplau definitiu per a Producció!


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

### `src/components/ui/universal-card/index.jsx`
```javascript
import React from 'react';
import UniversalCardHeader from './UniversalCard.Header';
import UniversalCardMedia from './UniversalCard.Media';
import UniversalCardBody from './UniversalCard.Body';
import ActionBar from '../ActionBar';
import styles from './UniversalCard.module.css';
import { SDP } from '../../../lib/eventBus';
import { useLayout } from '../../../contexts/LayoutContext';

const resolveCardUrl = ({ type, id, slug }) => {
  if (!id && !slug) return '/';
  if (type === 'mercat' || type === 'product' || type === 'market_item') return `/mercat/${id}`;
  if (type === 'page') return `/page/${slug || id}`;
  return `/mur/${id || ''}`;
};

const UniversalCard = ({
  // Primitive Props for React.memo efficiency
  id,
  type = 'post',
  title = 'Sóc de Poble',
  subtitle,
  excerpt,
  price,
  image,
  videoUrl,
  authorName,
  authorAvatar,
  townName,
  slug,
  
  // Presentation Props
  variant   = 'post',
  viewMode  = 'grid',
  onNavigate,
  children,
  className = '',
  seniorMode = false,
  footer
}) => {
  const cardUrl = onNavigate ? undefined : resolveCardUrl({ type, id, slug });
  const hasMedia = Boolean(image || videoUrl);
  const { hideActionBar } = useLayout();

  const isMarket = variant === 'mercat' || type === 'market_item' || type === 'product';
  const primaryLabel = isMarket ? 'AFEGIR' : 'CONNECTAR';
  const primaryEvent = isMarket ? 'ADD_CART' : 'CONNECT';

  return (
    <article
      className={`${styles.universalCard} ${className}`.trim()}
      data-variant={variant}
      data-viewmode={viewMode}
      data-senior={seniorMode ? 'true' : undefined}
      data-post-id={id}
      aria-label={title}
    >
      <UniversalCardHeader
        displayAuthor={authorName}
        avatarSrc={authorAvatar}
        displayTown={townName}
        className={styles.cardHeader}
      />

      {hasMedia ? (
        <UniversalCardMedia
          displayImage={image}
          displayTitle={title}
          videoUrl={videoUrl}
          className={styles.cardMedia}
        />
      ) : null}

      <UniversalCardBody
        displayTitle={title}
        displayExcerpt={excerpt}
        subtitle={subtitle}
        price={price}
        cardUrl={cardUrl}
        className={styles.cardBody}
      >
        {children}
      </UniversalCardBody>

      {/* Footer slot opcional (Grok) per a quan s'embeu al Layout */}
      {footer !== undefined ? footer : (
        !hideActionBar && (
          <div className={styles.cardActionBar}>
            <ActionBar
              entityId={id}
              entityType={type}
              entityTitle={title}
              primaryLabel={primaryLabel}
              primaryEvent={primaryEvent}
            />
          </div>
        )
      )}
    </article>
  );
};

export default React.memo(UniversalCard);

```

### `src/components/ui/universal-card/UniversalCard.Header.jsx`
```javascript
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './UniversalCard.module.css';

const UniversalCardHeader = React.memo(({
  displayAuthor,
  avatarSrc,
  displayTown,
  className
}) => {
  const [imgError, setImgError] = useState(false);
  const showImage = avatarSrc && !imgError;

  return (
    <header className={`${styles.cardHeader} ${className || ''}`.trim()} aria-label={`Informació de l'autor: ${displayAuthor || 'desconegut'}`}>
      {showImage ? (
        <img
          src={avatarSrc}
          alt={typeof displayAuthor === 'string' && displayAuthor.trim() ? `Avatar de ${displayAuthor}` : 'Autor desconegut'}
          className="w-11 h-11 shrink-0 object-cover"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        <div 
          role="img" 
          aria-label={typeof displayAuthor === 'string' && displayAuthor.trim() ? `Avatar de ${displayAuthor}` : 'Avatar per defecte'}
          className="w-11 h-11 shrink-0 flex items-center justify-center bg-black/10 text-black/80 font-bold text-lg"
        >
          <span aria-hidden="true">
            {(typeof displayAuthor === 'string' ? displayAuthor.trim().charAt(0) : 'S').toUpperCase()}
          </span>
        </div>
      )}
    <div className="flex flex-col min-w-0">
      <span className={styles.author}>{displayAuthor || 'Autor desconegut'}</span>
      {displayTown ? (
        <span className={styles.town}>
          {typeof displayTown === 'string' ? displayTown.replace('Poble Principal:', '').trim() : ''}
        </span>
      ) : null}
    </div>
    </header>
  );
});

UniversalCardHeader.displayName = 'UniversalCardHeader';

UniversalCardHeader.propTypes = {
  displayAuthor: PropTypes.string,
  avatarSrc: PropTypes.string,
  displayTown: PropTypes.string,
  className: PropTypes.string
};

export default UniversalCardHeader;

```

### `src/components/ui/universal-card/UniversalCard.Body.jsx`
```javascript
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

```

### `src/components/ui/universal-card/UniversalCard.Media.jsx`
```javascript
import React from 'react';
import PropTypes from 'prop-types';
import styles from './UniversalCard.module.css';

const UniversalCardMedia = React.memo(({
  displayImage,
  displayTitle,
  videoUrl,
  subtitleUrl,
  aspectMode = 'square',
  className
}) => {

  const mediaClass = `${styles.cardMedia} ${className || ''}`.trim();

  if (videoUrl) {
    return (
      <div className={mediaClass}>
        <video 
          src={videoUrl} 
          controls 
          className="w-full h-full object-cover bg-gradient-to-br from-slate-900 to-black" 
          poster={displayImage}
          preload="none"
          playsInline
          tabIndex={0}
          role="region"
          aria-label={displayTitle ? `Vídeo: ${displayTitle}` : 'Vídeo de contingut'}
        >
          {subtitleUrl && <track kind="subtitles" src={subtitleUrl} srcLang="ca" label="Català" default />}
        </video>
      </div>
    );
  }

  if (displayImage) {
    return (
      <img
        src={displayImage}
        alt={displayTitle ? `Imatge per a: ${displayTitle}` : 'Imatge decorativa'}
        loading="lazy"
        decoding="async"
        className={mediaClass}
      />
    );
  }

  return null;
});

UniversalCardMedia.displayName = 'UniversalCardMedia';

UniversalCardMedia.propTypes = {
  displayImage: PropTypes.string,
  displayTitle: PropTypes.string,
  videoUrl: PropTypes.string,
  subtitleUrl: PropTypes.string,
  aspectMode: PropTypes.string,
  className: PropTypes.string
};

export default UniversalCardMedia;

```

### `src/components/layout/UniversalPageLayout.jsx`
```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookText } from 'lucide-react';
import ActionBar from '../ui/ActionBar';
import { LayoutProvider } from '../../contexts/LayoutContext';

export default function UniversalPageLayout({
  id,
  title,
  subtitle,
  coverImage,
  authorIcon = '/assets/system/icons/icon-orange.svg',
  authorName = 'Sóc de Poble',
  authorLocation = 'La Torre de les Maçanes',
  type = 'page',
  primaryLabel = 'CONNECTAR',
  primaryEvent = 'CONNECT',
  children
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <LayoutProvider hideActionBar={true}>
      <article className="min-h-screen min-h-[100dvh] bg-[var(--sdp-fons,#f3f4f6)] text-[var(--sp-text,#111827)] md:pb-20">
        <header className="w-full relative">
        
        {/* BARRA BLAVA CANÒNICA */}
        <div 
          className="w-full bg-[#0984E3] text-white flex justify-between items-center px-2 sm:px-3 h-14 min-h-[56px] shadow-sm z-20 relative shrink-0"
          role="banner"
          aria-label="Capçalera de la pàgina"
        >
          
          {/* Navegació Esquerra */}
          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
            <button 
              type="button" 
              aria-label="Tornar enrere" 
              onClick={handleBack} 
              className="w-11 h-11 rounded-full flex items-center justify-center hover:bg-white/30 active:bg-white/40 text-white shrink-0 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white touch-manipulation"
            >
              <ArrowLeft size={24} aria-hidden="true" />
            </button>
            <button 
              type="button" 
              aria-label="Tornar a l'índex principal de publicacions" 
              onClick={() => navigate('/')}
              className="w-11 h-11 rounded-full flex items-center justify-center hover:bg-white/30 active:bg-white/40 text-white shrink-0 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white touch-manipulation"
            >
              <BookText size={24} aria-hidden="true" />
            </button>
          </div>
          
          {/* ActionBar Header Right */}
          <ActionBar 
            entityId={id} 
            entityTitle={title} 
            entityType={type} 
            primaryLabel={primaryLabel}
            primaryEvent={primaryEvent}
            variant="header" 
          />
        </div>
        
        {/* Imatge de Portada */}
        {coverImage && (
          <div className="w-full h-48 sm:h-64 md:h-80 relative overflow-hidden bg-slate-900">
            <img src={coverImage} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 sm:p-6 text-white">
              {title && <h1 className="text-2xl sm:text-3xl font-black mb-1 leading-tight">{title}</h1>}
              {subtitle && <p className="text-sm sm:text-base opacity-90">{subtitle}</p>}
            </div>
          </div>
        )}

        {/* Barra Taronja Canònica */}
        <div className="bg-[var(--sdp-taronja,#FF7300)] text-white px-4 py-3 flex items-center gap-3">
          {authorIcon && <img src={authorIcon} alt="" className="w-10 h-10 rounded-none bg-white/10 object-cover" />}
          <div className="flex flex-col min-w-0">
            <span className="font-bold truncate text-sm sm:text-base">{authorName}</span>
            <span className="text-xs sm:text-sm opacity-90 truncate">{authorLocation}</span>
          </div>
        </div>
      </header>
      
      {/* CONTINGUT: Isolate natiu pur de Tailwind i z-index lògic */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 relative z-10 isolate">
        <section className="bg-white rounded-[28px] p-6 sm:p-10 mb-8 flex flex-col shadow-md">
          {(!coverImage && title) && <h1 className="text-3xl font-black mb-2">{title}</h1>}
          {(!coverImage && subtitle) && <p className="text-xl text-gray-600 mb-6">{subtitle}</p>}
          <div className="text-left w-full">{children}</div>
        </section>
      </div>
      </article>
    </LayoutProvider>
  );
}

```

### `src/contexts/LayoutContext.jsx`
```javascript
import React, { createContext, useContext } from 'react';

const LayoutContext = createContext({ hideActionBar: false });

export const LayoutProvider = ({ children, hideActionBar = false }) => (
  <LayoutContext.Provider value={{ hideActionBar }}>
    {children}
  </LayoutContext.Provider>
);

export const useLayout = () => useContext(LayoutContext);

```
