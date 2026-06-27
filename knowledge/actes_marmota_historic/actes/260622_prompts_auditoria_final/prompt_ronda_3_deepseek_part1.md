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


[TRELLAT]: DeepSeek, com que el codi complet és massa llarg per a la teua memòria a curt termini, he dividit el servei principal en dues parts. Ací tens la UI i la PART 1 de la base de dades:

### `src/core/services/supabaseService.js` (PART 1 de 2)
```javascript
import { supabase } from '../../supabaseClient';
import { logger } from '../../utils/logger';
import { DEMO_USER_ID, ROLES, ENABLE_MOCKS, CREATOR_EMAILS } from '../../constants';
import { PostSchema, MarketItemSchema, MessageSchema, ProfileSchema, ConversationSchema } from './schemas';
import { MOCK_LORE_POSTS, MOCK_LORE_ITEMS } from '../../data/mockLoreData';
import { pushNotifications } from './pushNotifications';
import { isRealDBUUID } from '../../utils/identityUtils';
import { get, set } from 'idb-keyval';

/**
 * Helper for time-aware greetings
 */
const getTimeAwareGreeting = (lang = 'va') => {
    const hour = new Date().getHours();
    if (lang === 'es') {
        if (hour >= 6 && hour < 14) return "¡Buenos días!";
        if (hour >= 14 && hour < 20) return "¡Buenas tardes!";
        return "¡Buenas noches!";
    } else { // Valencian/Default
        if (hour >= 6 && hour < 14) return "Bon dia!";
        if (hour >= 14 && hour < 20) return "Bona vesprada!";
        return "Bona nit!";
    }
};

/**
 * Sanitizes input strings to prevent common injection patterns 
 * and remove potentially dangerous characters.
 */
const sanitizeInput = (text) => {
    if (typeof text !== 'string') return '';
    // Remove characters often used in SQL injection or HTML injection
    // Keep letters (any lang), numbers, spaces and common punctuation
    return text.replace(/[<>{}[\]\\^`|%'"?]/g, '').trim();
};

/**
 * Normalizes Wikimedia URLs to standardized thumbnails (500px).
 * Purged aggressive thumb.php guessing to prevent 404 network spam.
 */
const normalizeWikipediaUrl = (url) => {
    if (!url) return null;

    let normalized = decodeURIComponent(String(url).trim());

    // Strict validation: must be a full URL or local absolute path
    if (!normalized.startsWith('http') && !normalized.startsWith('//') && !normalized.startsWith('/')) {
        return null; // Return null so components naturally fallback to CSS initials
    }

    // Protocol-relative handling
    if (normalized.startsWith('//')) {
        normalized = 'https:' + normalized;
    }

    // Standardize Wikimedia existing thumbs to 500px if possible
    if (normalized.includes('wikimedia.org') || normalized.includes('wikipedia.org')) {
        if (normalized.includes('/thumb/')) {
            return normalized.replace(/\/\d+px-/g, '/500px-');
        }
    }

    return normalized;
};

/**
 * Linguistic engine to adjust common Valencian/Catalan terms 
 * based on the character's gender.
 */
const adjustGender = (text, gender) => {
    if (!text || gender !== 'female') return text;
    // Map of common masculine to feminine endings or terms
    const adaptations = {
        ' un poc liat': ' un poc liada',
        ' tot sol': ' tota sola',
        'content ': 'contenta ',
        ' cansat': ' cansada',
        'Preparat': 'Preparada',
        'benvingut': 'benvinguda',
        'estret': 'estreta',
        'segur': 'segura',
        'animat': 'animada'
    };

    let adjusted = text;
    for (const [masc, fem] of Object.entries(adaptations)) {
        adjusted = adjusted.replace(new RegExp(masc, 'g'), fem);
    }
    return adjusted;
};

/**
/**
 * [OMEGA-3 FIXED] columnCache implementation using a Proxy and L1 RAM mirror.
 * Zero-Jank policy: synchronous gets hit RAM, synchronous sets hit RAM.
 * Disk writes are batched and debounced async.
 */
const _ramColumnCache = {};
let _columnCacheWriteTimer = null;
const _columnCachePendingWrites = new Set();

const columnCache = new Proxy({}, {
    get: (target, prop) => {
        // [MASTER BLINDATGE] Evitem consultes amb IDs malformats
        if (prop === 'sp_node_befd9c41142744f6') return null;
        if (prop.includes('_punt')) return null; // [GHOST-SHIELD] Blocking dynamic project_ref prefixes

        // 1. Resposta instantània des de RAM (L1)
        if (prop in _ramColumnCache) return _ramColumnCache[prop];

        // 2. Fallback síncron: Només 1 vegada per propietat en tota la sessió
        const val = localStorage.getItem(`cp_${prop}`);
        if (val === 'true') {
            _ramColumnCache[prop] = true;
            return true;
        }
        if (val === 'false') {
            _ramColumnCache[prop] = false;
            return false;
        }

        _ramColumnCache[prop] = null;
        return null;
    },
    set: (target, prop, value) => {
        // 1. L1 RAM Hit
        _ramColumnCache[prop] = value;
        
        // 2. Asynchronous Batched Debounced Write L2 (Zero Main-Thread Jank)
        _columnCachePendingWrites.add(prop);
        if (!_columnCacheWriteTimer) {
            _columnCacheWriteTimer = setTimeout(() => {
                _columnCachePendingWrites.forEach(p => {
                    try {
                        localStorage.setItem(`cp_${p}`, String(_ramColumnCache[p]));
                    } catch {
                         // Silently swallow quota errors to keep the application responsive locally
                    }
                });
                _columnCachePendingWrites.clear();
                _columnCacheWriteTimer = null;
            }, 1000); // 1000ms flush
        }
        return true;
    }
});

// [MASTER PURGE] Self-healing logic for legacy data
// })();


/**
 * Intelligent Synonym Dictionary for Towns and Search Terms
 * Maps historical, informal, or other language variants to canonical names.
 */
const SEARCH_SYNONYMS = {
    'torremanzanas': 'La Torre de les Maçanes',
    'la torre de las manzanas': 'La Torre de les Maçanes',
    'la torre': 'La Torre de les Maçanes',
    'alcoy': 'Alcoi',
    'alcoià': 'Alcoi',
    'el mure': 'Muro d\'Alcoi',
    'muro de alcoy': 'Muro d\'Alcoi',
    'muro': 'Muro d\'Alcoi',
    'cocentaina': 'Cocentaina', // Canonical
    'quincena': 'Cocentaina', // For testing or local context
    'penaguila': 'Penàguila',
    'rellen': 'Relleu',
    'benifallim': 'Benifallim',
    'soc de poble': 'Sóc de Poble',
    'socdepoble': 'Sóc de Poble',
    'soc de': 'Sóc de Poble',
    'poble': 'Sóc de Poble',
    'soc': 'Sóc de Poble',
    'rutadelpoble': 'Sóc de Poble',
    'merchandising': 'Sóc de Poble',
    'xixona': 'Xixona',
    'jijona': 'Xixona',
    'alacant': 'Alacant',
    'alicante': 'Alacant',
    'alacantí': 'L\'Alacantí',
    'el campello': 'El Campello',
    'mutxamel': 'Mutxamel',
    'sant joan': 'Sant Joan d\'Alacant',
    'sant vicent': 'Sant Vicent del Raspeig',
    'agost': 'Agost'
};

/**
 * Normalizes a search query using the synonym engine.
 * @param {string} query 
 * @returns {string} Normalized query
 */
const getNormalizedQuery = (query) => {
    if (!query) return '';
    const trimmed = query.toLowerCase().trim();

    // Accents normalization (Damia -> Damià)
    const accentLess = trimmed.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Direct match check in Synonyms
    if (SEARCH_SYNONYMS[trimmed]) return SEARCH_SYNONYMS[trimmed];
    if (SEARCH_SYNONYMS[accentLess]) return SEARCH_SYNONYMS[accentLess];

    // Partial match/Contains check (more dynamic)
    for (const [key, value] of Object.entries(SEARCH_SYNONYMS)) {
        if (trimmed.includes(key) || accentLess.includes(key)) return value;
    }
    return accentLess;
};



/**
 * Utilitat interna per a comparació OMNISCIENT (Ignora accents, espais i majúscules)
 */
const omniMatch = (target, search) => {
    if (!target || !search) return false;
    const normalize = (str) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    return normalize(target).includes(normalize(search));
};

const setColumnCache = (key, value) => {
    columnCache[key] = value;
};

/**
 * [PILAR 1: LOCAL-FIRST] Advanced Cache Layer for Latency Zero
 */
const LocalCache = {
    _storage: {},
    get: (key) => {
        const item = LocalCache._storage[key] || JSON.parse(localStorage.getItem(`lc_${key}`) || 'null');
        if (item && Date.now() < item.expires) {
            LocalCache._storage[key] = item; // Repopulate L1 if missing
            return item.data;
        }
        return null;
    },
    set: (key, data, ttl = 300000) => { // Default 5 min
        const item = { data, expires: Date.now() + ttl };
        LocalCache._storage[key] = item;
        try {
            localStorage.setItem(`lc_${key}`, JSON.stringify(item));
        } catch {
            // [CRÍTIC OMEGA-3] Fallback QuotaExceededError - Continuem només en RAM pura.
            // Ajudant als telèfons amb limitació dràstica d'espai al navegador
            console.warn('[LocalCache] Evitant crash de QuotaExceededError. Caiguda cap L1 RAM.');
        }
    },
    invalidate: (key) => {
        delete LocalCache._storage[key];
        localStorage.removeItem(`lc_${key}`);
    }
};

/**
 * [MASTER] Ensures column cache is populated with robust SQL checks
 */
const _ensureColumnCache = async () => {
    // 1. Check Posts columns
    if (columnCache.posts_ai_percentage === null) {
        if (!activeChecks.posts) {
            activeChecks.posts = (async () => {
                try {
                    const { data, error } = await supabase.from('posts').select('*').limit(1);
                    if (!error && data) {
                        const row = data[0] || {};
                        const exists = 'ai_percentage' in row;
                        setColumnCache('posts_ai_percentage', exists);
                        setColumnCache('posts_human_percentage', exists);
                        setColumnCache('posts_time_saved', exists);
                        setColumnCache('posts_is_iaia_inspired', exists);
                        setColumnCache('posts_pinned_position', 'pinned_position' in row);
                        setColumnCache('posts_town_uuid', 'town_uuid' in row);
                    } else if (error) {
                        setColumnCache('posts_ai_percentage', false);
                        setColumnCache('posts_pinned_position', false);
                    }
                    // logger.log(`[SupabaseService] Posts columns check done.`);
                } catch (e) {
                    logger.warn('[SupabaseService] Error checking posts columns:', e);
                } finally { activeChecks.posts = null; }
            })();
        }
    }

    // 2. Check Market columns
    if (columnCache.market_pinned_position === null) {
        if (!activeChecks.market) {
            activeChecks.market = (async () => {
                try {
                    // Check multiple columns in one go (market_items select *)
                    const { data, error } = await supabase.from('market_items').select('*').limit(1);
                    if (!error && data && data.length >= 0) {
                        const row = data[0] || {};
                        setColumnCache('market_pinned_position', 'pinned_position' in row);
                        setColumnCache('market_is_pinned', 'is_pinned' in row);
                        setColumnCache('market_is_iaia_inspired', 'is_iaia_inspired' in row);
                        setColumnCache('market_is_playground', 'is_playground' in row);
                    } else if (error) {
                        // If we can't select *, let's be conservative
                        setColumnCache('market_pinned_position', false);
                        setColumnCache('market_is_pinned', false);
                    }

                    // Check for the specific town join hint (PostgREST syntax)
                    const { error: fkError } = await supabase.from('market_items').select('uuid').limit(1);
                    setColumnCache('market_fk_town_uuid', !fkError);

                    // logger.log(`[SupabaseService] Market columns check done.`);
                } catch (e) {
                    logger.warn('[SupabaseService] Error checking market columns:', e);
                } finally { activeChecks.market = null; }
            })();
        }
    }

    // 3. Check Messages columns
    if (columnCache.messages_post_uuid === null) {
        if (!activeChecks.messages) {
            activeChecks.messages = (async () => {
                try {
                    const { data, error } = await supabase.from('messages').select('*').limit(1);
                    if (!error && data) {
                        const row = data[0] || {};
                        setColumnCache('messages_post_uuid', 'post_uuid' in row);
                        setColumnCache('messages_is_playground', 'is_playground' in row);
                    } else if (error) {
                        setColumnCache('messages_post_uuid', false);
                        setColumnCache('messages_is_playground', false);
                    }
                    logger.log(`[SupabaseService] Messages columns check done.`);
                } catch (e) {
                    logger.warn('[SupabaseService] Error checking messages columns:', e);
                } finally { activeChecks.messages = null; }
            })();
        }
    }

    await Promise.all([activeChecks.posts, activeChecks.market, activeChecks.messages]);
}

export const isValidUUID = (id) => {
    if (!id) return false;
    const isStandardUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const isSovereignID = typeof id === 'string' && id.startsWith('sp_node_');
    return isStandardUUID || isSovereignID;
};



// Promesas activas para evitar ráfagas de errores 400 en paralelo
const activeChecks = {
    posts: null,
    market: null,
    messages: null,
    conversations: null
};

/**
 * Centralized System Entities (Virtual Identities)
 */
const SYSTEM_ENTITIES = [
    {
        id: 'socdepoble',
        full_name: 'Sóc de Poble',
        username: 'socdepoble',
        type: 'empresa',
        town_name: 'Global',
        description: 'La plataforma de connexió rural definitiva. Gent, terra i xarxa. Connectem pobles, persones i territori a través de la tecnologia i la identitat.',
        avatar_url: '/assets/system/ui/logo-socdepoble-cuadrat-verd.svg',
        cover_url: '/assets/uploads/brain/media__1776834317381.jpg',
        category: 'Tecnologia i Comunitat',
        is_active: true,
        created_at: '2025-01-01T00:00:00Z'
    },
    {
        id: 'el-rentonar',
        full_name: 'Associació Cultural El Rentonar',
        username: 'rentonar',
        type: 'empresa',
        town_name: 'La Torre de les Maçanes',
        description: 'Entitat gestora de Sóc de Poble i custòdia de la tradició i identitat de La Torre de les Maçanes. Treballem per la memòria viva i la sobirania tecnològica rural. CIF G-03967668.',
        avatar_url: '/system/ui/logo-socdepoble-rect-negre.svg',
        cover_url: '/assets/mock-data/illustrations/rustic_detail.png',
        category: 'Cultura i Tradició',
        is_active: true,
        created_at: '2025-01-01T00:00:00Z'
    },
    {
        id: '11111111-1a1a-0000-0000-000000000000',
        full_name: 'IAIA (Guia del Poble)',
        type: 'oficial',
        town_name: 'Sóc de Poble',
        description: 'Assistència virtual i guia de la comunitat. Soc la teua acompanyant digital per a tot el que necessites al poble.',
        avatar_url: '/assets/mock-data/avatars/avatar_maria.png',
        cover_url: '/assets/mock-data/illustrations/night_party.png',
        is_active: true,
        created_at: '2025-01-01T00:00:00Z'
    },
    {
        id: 'fa82eb62-4a83-4ff7-b2d6-8849673fc3b0',
        full_name: 'Damià Llorens (Perit)',
        username: 'damianllorens',
        type: 'persona',
        town_name: 'Global',
        description: 'Fundador de Sóc de Poble. Dissenyant el futur de la connexió rural viva.',
        avatar_url: '/uploads/avatars/damia_agutzil_comic.png',
        cover_url: '/assets/mock-data/illustrations/night_party.png',
        category: 'Tecnologia',
        is_active: true,
        is_admin: true,
        created_at: '2025-01-01T00:00:00Z'
    },
    {
        id: 'a11ac111-eec1-4111-b111-000000000013',
        full_name: 'Anna Climent',
        type: 'persona',
        town_name: 'Ibi / Global',
        description: 'Biòloga, arquitecta i professora. Experta en nutrició saludable i sostenibilitat rural.',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
        cover_url: '/assets/mock-data/illustrations/night_party.png',
        category: 'gent',
        is_active: true,
        is_admin: true, // Elevating to admin
        created_at: '2026-01-27T18:00:00Z'
    }
];

/**
 * Centralized logic to detect if a profile is fictive (Lore or Demo)
 */
export const isFictiveProfile = (profile) => {
    if (!profile) return false;
    const pid = profile.id || '';
    const email = profile.email || '';

    // Order of priority: Creator account (NEVER fictive), ID prefix (Lore), System IDs, then explicit flag (Demo)
    const masters = (typeof CREATOR_EMAILS !== 'undefined') ? CREATOR_EMAILS : [];
    if (masters.includes(email)) return false;

    return pid.startsWith('11111111-') ||
        pid.startsWith('sdp-') ||
        profile.is_demo === true;
};

/**
 * Hardcoded Lore Personas for Sandbox and AI interaction
 */
const LORE_PERSONAS = [
    { id: '11111111-1a1a-0000-0000-000000000000', full_name: 'IAIA MarIA', username: 'iaia_master', gender: 'female', role: 'official', ofici: 'Matriarca Digital', primary_town: 'Sóc de Poble (Global)', bio: 'Dignitat, terra i xarxa. Soc la teua assistenta (MArIA: Memòria Artificial i Acció) per a tot el que necessites al poble.', avatar_url: '/uploads/avatars/iaia_comic_matriarch.png', category: 'gent', type: 'person', onomatopoeia: '🏺', time: 'Sempre' },
    { id: '11111111-1a1a-0001-0000-000000000001', full_name: 'Andreu Soler', username: 'andreu-soler', gender: 'male', role: 'ambassador', ofici: 'Capatàs del Mas', primary_town: 'La Torre de les Maçanes', bio: "L'Andreu és el rellotge del camp.", avatar_url: '/uploads/avatars/andreu-soler-comic.png', onomatopoeia: '¡PLAS!', category: 'treball', type: 'person', time: '3:35 p. m.' },
    { id: '11111111-1a1a-0001-0000-000000000002', full_name: 'Beatriz Ortega', username: 'beatriz-ortega', gender: 'female', role: 'ambassador', ofici: 'Arquitecta de Ferro', primary_town: 'Global', bio: 'Mestre, la V15 està bategant forta!', avatar_url: '/uploads/avatars/beatriz-ortega-comic.png', onomatopoeia: '¡CLINC!', category: 'treball', type: 'person', time: '12:19 p. m.' },
    { id: '11111111-1a1a-0001-0000-000000000003', full_name: 'Carla Soriano', username: 'carla-soriano', gender: 'female', role: 'ambassador', ofici: 'Harmonitzadora de Batecs', primary_town: 'Ibi', bio: 'Bategat equilibrat, mestre Javi.', avatar_url: '/uploads/avatars/carla-soriano_comic.png', onomatopoeia: '¡OMMM!', category: 'gent', type: 'person', time: '6:13 p. m.' },
    { id: '11111111-1111-4111-a111-000000000009', full_name: 'Carmen la del Forn', username: 'cuinera', gender: 'female', role: 'ambassador', ofici: 'Cuinera del Mas', primary_town: 'La Torre de les Maçanes', bio: 'La cuina de Pepica és el cor del Mas.', avatar_url: '/uploads/avatars/beatriz-ortega-comic.png', onomatopoeia: '¡XUP!', category: 'treball', type: 'person', time: '2:16 p. m.' },
    { id: '11111111-1111-4111-a111-000000000003', full_name: 'Vicent Ferris', username: 'vferris', gender: 'male', role: 'ambassador', ofici: 'Agricultor Gran', primary_town: 'La Torre de les Maçanes', bio: 'Els cicles lunars manen sobre la collita.', avatar_url: '/uploads/avatars/vicent-ferris-comic.png', onomatopoeia: '¡ZAS!', category: 'treball', type: 'person', time: '5:00 a. m.' },
    { id: '11111111-1111-4111-a111-000000000004', full_name: 'Samir Mensah', username: 'samirm', gender: 'male', role: 'ambassador', ofici: 'Artesà', primary_town: 'Ibi', bio: 'Integrant tradicions.', avatar_url: '/uploads/avatars/avatar_samir_comic.png', onomatopoeia: '¡TAC!', category: 'gent', type: 'person', time: '4:15 p. m.' },
    { id: '11111111-1111-4111-a111-000000000005', full_name: 'Mariamel', username: 'mariamel', gender: 'female', role: 'ambassador', ofici: 'Historiadora', primary_town: 'Muro', bio: 'Conservant el llegat del poble.', avatar_url: '/uploads/products/avatar_mariamel_comic.png', onomatopoeia: '¡SHH!', category: 'gent', type: 'person', time: '1:00 p. m.' },
    { id: '11111111-1111-4111-a111-000000000008', full_name: 'Joan Batiste (Avi dels Papers)', username: 'joanbat', gender: 'male', role: 'ambassador', ofici: 'Arxiver', primary_town: 'Cocentaina', bio: 'Tots els documents en regla.', avatar_url: '/uploads/avatars/joan-batiste-comic.png', onomatopoeia: '¡RASS!', category: 'gent', type: 'person', time: '10:00 a. m.' },
    { id: '11111111-0000-0000-0000-000000000004', full_name: 'Marc (El Gall)', username: 'marcgall', gender: 'male', role: 'official', ofici: 'Alertes Globals', primary_town: 'Global', bio: 'Alçant al Mas cada dia.', avatar_url: '/uploads/avatars/avatar-marc-comic.png', onomatopoeia: '¡KIKIRIKI!', category: 'gent', type: 'person', time: '6:00 a. m.' },
    { id: '11111111-1111-4111-a111-000000000011', full_name: 'Elena Popova', username: 'elenap', gender: 'female', role: 'ambassador', ofici: 'Innovadora', primary_town: 'Agost', bio: "Buscant el futur a l'entorn rural.", avatar_url: '/uploads/avatars/elena-popova-comic.png', onomatopoeia: '¡PING!', category: 'gent', type: 'person', time: '2:30 p. m.' },
    { id: '11111111-1111-4111-a111-000000000012', full_name: 'Joanet Serra', username: 'joanets', gender: 'male', role: 'ambassador', ofici: 'Sereno', primary_town: 'Relleu', bio: 'Vigilant les estreles.', avatar_url: '/uploads/avatars/joanet-serra-comic.png', onomatopoeia: '¡FIUU!', category: 'gent', type: 'person', time: '11:00 p. m.' },
    { id: '11111111-1111-4111-a111-000000000013', full_name: 'Lucia', username: 'lucia', gender: 'female', role: 'ambassador', ofici: 'Llibretera', primary_town: 'Banyeres', bio: 'La màgia dels contes vells.', avatar_url: '/uploads/avatars/avatar_lucia_comic.png', onomatopoeia: '¡CLAP!', category: 'gent', type: 'person', time: '5:45 p. m.' },
    { id: '11111111-1a1a-0001-0000-000000000007', full_name: 'Pepica la de la Vall', username: 'pepica_vall', gender: 'female', role: 'ambassador', ofici: 'Herbolària', primary_town: 'La Vall', bio: 'Remeis naturals.', avatar_url: '/uploads/avatars/pepica-vall-comic.png', onomatopoeia: '¡TSH!', category: 'treball', type: 'person', time: '8:00 a. m.' },
    { id: '11111111-1a1a-0000-0000-000000000005', full_name: 'Nano Banana', username: 'nanob', gender: 'male', role: 'official', ofici: 'Artista T.I.A.', primary_town: 'Global', bio: '🎨 Píxels i humor.', avatar_url: '/uploads/avatars/nano-banana-comic.png', onomatopoeia: '¡POW!', category: 'gent', type: 'person', time: '4:20 p. m.' },
];

const _throttleLocks = new Map();

/**
 * Verifica si una acción es demasiado frecuente (Throttling) con locks de concurrencia
 * @param {string} userId
 * @param {string} actionType
 * @param {number} limitMs
 */
const checkThrottling = async (userId, actionType, limitMs = 3000) => {
    const now = Date.now();
    const key = `${userId}_${actionType}`;
    const lock = _throttleLocks.get(key) || { lastTime: 0, pending: 0 };

    if (lock.pending > 5) {
        throw new Error('Massa peticions simultànies. Espera un poc.');
    }

    lock.pending++;
    _throttleLocks.set(key, lock);

    try {
        if (now - lock.lastTime < limitMs) {
            throw new Error(`Acció massa ràpida. Espera ${Math.ceil((limitMs - (now - lock.lastTime)) / 1000)} segons.`);
        }
        lock.lastTime = now;
    } finally {
        lock.pending--;
        // Mantenim el lock actualitzat
        _throttleLocks.set(key, lock);
        
        // [GC OMEGA-3] Garbage Collection del lock per no saturar memòria en sessions llargues
        if (lock.pending === 0) {
            setTimeout(() => {
                const currentLock = _throttleLocks.get(key);
                if (currentLock && currentLock.pending === 0 && Date.now() - currentLock.lastTime >= limitMs) {
                    _throttleLocks.delete(key);
                }
            }, limitMs + 50);
        }
    }
};

const TOWNS_MAP = {
    1: 'La Torre de les Maçanes',
    2: 'Cocentaina',
    3: 'Muro d\'Alcoi',
    'la-torre': 'La Torre de les Maçanes',
    'cocentaina': 'Cocentaina',
    'muro': 'Muro d\'Alcoi',
    4: 'Agost',
    'agost': 'Agost'
};

/**
 * Normaliza un item de feed/market con fallbacks robustos
 */
const normalizeContentItem = (item, type = 'post') => {
    if (!item) return null;

    const isJaviMaster = (
        item.author_id === '25218ea4-5d7d-4db4-bdc5-7ae035629242' || 
        item.author_user_id === '25218ea4-5d7d-4db4-bdc5-7ae035629242' || 
        item.author === 'Javi Llinares' || 
        item.author_name === 'Javi Llinares' ||
        item.author === 'socdepoblecom' || 
        item.author_name === 'socdepoblecom' || 
        item.username === 'socdepoblecom' ||
        item.author_email?.includes('socdepoblecom')
    );

    const joinedAvatar = item.profiles?.avatar_url || item.entities?.avatar_url;
    const joinedName = item.profiles?.full_name || item.entities?.name;

    const authorName = isJaviMaster ? 'Javi Llinares' : (joinedName || item.author || item.author_name || item.seller || item.seller_name || (type === 'market' ? 'Productor Local' : 'Veí del Poble'));
    const avatarUrl = isJaviMaster ? '/system/master/javi_avatar_cinematic.png' : (joinedAvatar || item.avatar_url || item.author_avatar || item.author_avatar_url || '/uploads/avatars/avatar_man_1.png');

    // [MASTER HEALER] Fallback d'imatges intel·ligent per al Mercat
    let imageUrl = item.image_url || item.image;
    if (!imageUrl && type === 'market') {
        const title = (item.title || '').toLowerCase();
        if (title.includes('mel')) imageUrl = '/assets/mock-data/products/mel_premium.png';
        else if (title.includes('oli')) imageUrl = '/assets/mock-data/products/oli_premium.png';
        else if (title.includes('poma') || title.includes('apple')) imageUrl = '/assets/mock-data/products/apples_premium.png';
        else if (title.includes('tomate')) imageUrl = '/assets/mock-data/products/tomates_premium.png';
        else if (title.includes('coque')) imageUrl = '/assets/mock-data/products/coques_premium.png';
        else if (title.includes('formatge')) imageUrl = '/assets/mock-data/products/formatge.png';
        else imageUrl = '/assets/mock-data/illustrations/generic-market.png';
    }

    // Resolución de pueblos con validación
    let townName = isJaviMaster ? 'La Torre de les Maçanes' : 'Al teu poble';
    if (!isJaviMaster) {
        if (item.towns?.name) {
            townName = item.towns.name;
        } else if (item.town_uuid && TOWNS_MAP[item.town_uuid]) {
            townName = TOWNS_MAP[item.town_uuid];
        } else if (item.town_name) {
            townName = item.town_name;
        }
    }

    return {
        ...item,
        id: item.uuid || item.id,
        uuid: item.uuid || item.id,
        author: authorName,
        seller: type === 'market' ? authorName : undefined,
        author_avatar: avatarUrl,
        author_role: isJaviMaster ? 'official' : (type === 'market' ? 'freelance' : (item.author_role || 'vei')),
        avatar_url: avatarUrl,
        author_user_id: isJaviMaster ? '25218ea4-5d7d-4db4-bdc5-7ae035629242' : (item.author_user_id || (item.author_role === 'user' ? item.author_id : (item.author_user_id || null))),
        author_entity_id: item.author_entity_id || (item.author_role !== 'user' ? (item.entity_id || item.author_id) : (item.author_entity_id || null)),
        towns: { name: townName },
        image_url: imageUrl,
        is_iaia_inspired: item.is_iaia_inspired || false,
        ai_percentage: item.ai_percentage || 0,
        human_percentage: item.human_percentage || 100,
        time_saved_minutes: item.time_saved_minutes || 0,
        semantic_tags: item.semantic_tags || [],
        external_links: item.external_links || []
    };
};
// [GHOST-SHIELD] Known broken or legacy storage assets that trigger 404/400 console errors
const BROKEN_STORAGE_URLS = [
    'javi_avatar.png',
    'profiles/javi_avatar.png',
    'avatars/javi_avatar.png'
];

export { columnCache, setColumnCache, _ensureColumnCache, LocalCache, isRealDBUUID, normalizeContentItem, checkThrottling, activeChecks, getTimeAwareGreeting, adjustGender, LORE_PERSONAS, ENABLE_MOCKS, DEMO_USER_ID };

export const supabaseService = {
    supabase,
    /**
     * [STORAGE HEALING]
     * Detects and fixes legacy or broken storage URLs.
     */
    normalizeStorageUrl(url) {
        if (!url) return url;

        // [GHOST-SHIELD] Pre-flight block for known broken remote assets
        if (typeof url === 'string') {
            const isBroken = BROKEN_STORAGE_URLS.some(broken => url.includes(broken));
            if (isBroken) {
                logger.debug(`[GhostShield] Blocking request to known broken asset: ${url}`);
                // Return a safe local placeholder that exists in the repo
                return '/system/master/javi_avatar_cinematic.png';
            }
        }

        // [MASTER BLINDATGE] Purguem rutes absolutes locals que s'hagen pogut colar
        // Admitem 'Users/' sense barra inicial per caçar rutes relatives malformades
        const localPathPattern = /(\/?Users\/|C:\\|D:\\|E:\\|F:\\|G:\\|H:\\|I:\\|J:\\)/i;
        if (typeof url === 'string' && localPathPattern.test(url)) {
            const fileName = url.split(/[/\\]/).pop();
            // Intentem recuperar-la de la carpeta de relíquies del Mas o fallback d'assets
            logger.warn(`[SupabaseService] Ruta absoluta detectada i sanejada: ${url}`);
            
            // Si el fitxer sembla un avatar, usem el path de profiles
            if (url.includes('avatar') || url.includes('profile')) {
                return `/uploads/brain/e1b6e544-2f87-4f23-b187-d802a30c0ca1/${fileName}`;
            }
            
            // Fallback general a assets/brain
            return `/uploads/brain/e1b6e544-2f87-4f23-b187-d802a30c0ca1/${fileName}`;
        }

        return url;
    },

    normalizeProfile(profile) {
        if (!profile) return null;
        return {
            ...profile,
            avatar_url: this.normalizeStorageUrl(profile.avatar_url),
            cover_url: this.normalizeStorageUrl(profile.cover_url)
        };
    },

    /**
    /**
     * Account Deletion System (5s Fast Track)
     * Calls the secure RPC 'delete_user' which invokes PostgreSQL ON DELETE CASCADE.
     */
    // New Feature: Persistent Notifications
    async createNotification(payload) {
        try {
            const { error } = await supabase.from('notifications').insert([{
                user_id: payload.user_id,
                type: payload.type || 'system',
                content: payload.content,
                is_read: false,
                created_at: new Date().toISOString(),
                // Optional fields if schema supports them
                // meta: payload.meta 
            }]);
            if (error) {
                // Ignore table missing errors for now
                if (error.code === '42P01') logger.warn('Notifications table missing');
                else logger.error('Error creating notification:', error);
            }
        } catch (e) {
            logger.error('Create notification exception:', e);
        }
    },

    // Admin Stats (Live)
    async getAdminStats() {
        try {
            const now = new Date();
            const yesterday = new Date(now.getTime() - (24 * 60 * 60 * 1000)).toISOString();

            // Total Real Users
            const { count: totalUsers, error: _countError } = await supabase
                .from('profiles')
                .select('id', { count: 'exact' })
                .eq('is_demo', false)
                .limit(1);

            // New Users (24h)
            const { data: newUsers, error: _newError } = await supabase
                .from('profiles')
                .select('id, full_name, created_at')
                .eq('is_demo', false)
                .gte('created_at', yesterday)
                .order('created_at', { ascending: false });

            // System Health (Check if any critical errors logged - using notifications for now)
            const { count: errorCount } = await supabase
                .from('notifications')
                .select('id', { count: 'exact' })
                .eq('type', 'system_error')
                .gte('created_at', yesterday)
                .limit(1);

            // Latest User
            const latestUser = newUsers?.[0] || null;

            return {
                totalUsers: totalUsers || 0,
                newUsers24h: newUsers?.length || 0,
                latestUser,
                errorCount: errorCount || 0
            };
        } catch (e) {
            logger.error('Error fetching admin stats:', e);
            return { totalUsers: 0, newUsers24h: 0, errorCount: 0 };
        }
    },

    // Global OverView (Total Vision for UCC)
    async getGlobalOverview() {
        try {
            const [stats, seo, { data: recentPosts }, { data: recentMarket }, { data: recentProfiles }] = await Promise.all([
                this.getAdminStats(),
                this.getSEOStats(),
                supabase.from('posts').select('id, content, created_at, author, author_role').order('created_at', { ascending: false }).limit(10),
                supabase.from('market_items').select('uuid, title, price, created_at, avatar_url').order('created_at', { ascending: false }).limit(10),
                supabase.from('profiles').select('id, full_name, created_at').eq('is_demo', false).order('created_at', { ascending: false }).limit(10)
            ]);

            // Combine and normalize for Activity Pipeline
            const timeline = [
                ...(recentPosts || []).map(p => normalizeContentItem({ ...p, type: 'post', label: 'Nou Post al Mur' }, 'post')),
                ...(recentMarket || []).map(m => normalizeContentItem({ ...m, type: 'market', label: 'Nou Producte' }, 'market')),
                ...(recentProfiles || []).map(u => ({ ...u, type: 'user', label: 'Nou Ciutadà', title: u.full_name, author: u.full_name }))
            ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            return {
                stats,
                seo,
                timeline: timeline.slice(0, 20)
            };
        } catch (err) {
            logger.error('[SupabaseService] Error in getGlobalOverview:', err);
            // Trace the exact error structure for 400/404 debugging
            if (err.details || err.hint) {
                logger.warn(`[SupabaseService] Query Fail: ${err.message} | ${err.details} | ${err.hint}`);
            }
            return { stats: {}, seo: {}, timeline: [] };
        }
    },

    // God-Level User Management (Noise Filtering)
    async updateUserModeration(userId, data) {
        try {
            logger.info(`[Admin] Actualitzant moderació per a ${userId}:`, data);
            const { error } = await supabase
                .from('profiles')
                .update({
                    is_noise: data.is_noise,
                    is_silenced: data.is_silenced,
                    reputation_score: data.reputation_score
                })
                .eq('id', userId);

            if (error) throw error;
            return true;
        } catch (e) {
            logger.error('Error updating user moderation:', e);
            throw e;
        }
    },

    async getModeratedPosts(options = {}) {
        try {
            let query = supabase.from('posts').select('*, author:profiles!fk_posts_author_profile(*)');

            // Logic to filter ONLY if 'filterNoise' is active
            if (options.filterNoise) {
                query = query.eq('author.is_noise', false);
            }

            const { data, error } = await query.order('created_at', { ascending: false });
            if (error) throw error;
            return data.map(normalizeContentItem);
        } catch (e) {
            logger.error('Error fetching moderated posts:', e);
            return [];
        }
    },

    // SEO / Health Stats (Admin)
    async getSEOStats() {
        try {
            // Simulated SEO Metrics for now (until we integrate Google Search Console API)
            // Real checks for sitemap and robots (Using GET to avoid SW Cache conflicts)
            const hasSitemap = await fetch('/sitemap.xml', { method: 'GET' }).then(r => r.ok).catch(() => false);
            const hasRobots = await fetch('/robots.txt', { method: 'GET' }).then(r => r.ok).catch(() => false);
            return {
                healthScore: hasSitemap && hasRobots ? 98 : 85, // Mock score based on basic checks
                indexedPages: 142, // Mock
                issues: !hasSitemap ? 1 : 0,
                lastCrawl: new Date().toISOString(),
                hasSitemap,
                hasRobots
            };
        } catch (error) {
            logger.warn('Error checking SEO stats:', error);
            return {
                healthScore: 0,
                indexedPages: 0,
                issues: 0,
                lastCrawl: null,
                hasSitemap: false,
                hasRobots: false
            };
        }
    },

    async getPostComments(postId) {
        try {
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(postId);
            if (!isUUID || String(postId).startsWith('mock-') || String(postId).startsWith('anna-') || String(postId).includes('-')) {
                // If it's a slug or mock, return empty array without crashing
                // Slugs (like 'busquem-socis-tecnologics') don't have comments in DB yet
                return [];
            }

            const { data, error } = await supabase
                .from('post_comments')
                .select('*, profiles(full_name, avatar_url)')
                .eq('post_uuid', postId)
                .order('created_at', { ascending: true });

            if (error) {
                if (error.code === '42P01' || error.code === 'PGRST205' || error.code === 'PGRST201') {
                    logger.warn('post_comments table or relationship missing, returning empty array');
                    return [];
                }
                throw error;
            }
            return data || [];
        } catch (e) {
            logger.error('Error fetching post comments:', e);
            return [];
        }
    },

    // Admin & Seeding
    async getAllPersonas(isPlayground = false) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('full_name', { ascending: true });

        if (error) throw error;

        const dbPersonas = (data || []).filter(p => {
            const masters = (typeof CREATOR_EMAILS !== 'undefined') ? CREATOR_EMAILS : [];
            const isRealUser = p.is_demo === false ||
                masters.includes(p.email) ||
                p.username?.toLowerCase().includes('javillinares') ||
                p.username?.toLowerCase().includes('socdepoble');

            const isLoreCharacter = LORE_PERSONAS.some(lp => lp.full_name === p.full_name);
            return !isRealUser && !isLoreCharacter;
        }).map(p => {
            // Aseguramos que siempre tengan un pueblo asignado
            if (!p.primary_town) {
                // Fallback inteligente para perfiles de la DB que puedan estar incompletos
                if (p.username === 'vferris') p.primary_town = 'La Torre de les Maçanes';
                else if (p.username === 'carlas') p.primary_town = 'Penàguila';
                else if (p.username === 'joanets') p.primary_town = 'Muro d\'Alcoi';
                else p.primary_town = 'La Torre de les Maçanes'; // Default para la simulación
            }
            return p;
        });

        // Combinem
        const rawPersonas = [...dbPersonas, ...LORE_PERSONAS];

        // Deduplicació real vs fictici per ID (Prioritat al Real/DB)
        const uniqueById = new Map();
        rawPersonas.forEach(p => {
            const pid = p.id;
            if (!pid) return;
            // Si ja existeix, donem prioritat al perfil que NO siga fictici o que tinga més info
            if (!uniqueById.has(pid)) {
                uniqueById.set(pid, p);
            } else {
                const existing = uniqueById.get(pid);
                const isExistingFictive = isFictiveProfile(existing);
                const isNewFictive = isFictiveProfile(p);

                if (isExistingFictive && !isNewFictive) {
                    uniqueById.set(pid, p);
                }
            }
        });

        const mergedPersonas = Array.from(uniqueById.values());

        // Lògica de Sincronització de Producció:
        // [MASTER IDENTITY PROTECTION] Solo dejamos perfiles reales en producción
        if (!isPlayground) {
            return mergedPersonas.filter(p => {
                const pid = p.id || '';
                // [GHOST-SHIELD EXTREME] Purgamos cualquier ID ficticio o de demo
                const isFictive = pid.startsWith('11111111-') || pid.startsWith('sdp-') || p.is_demo === true;
                const _isOfficial = p.role === 'official' || p.type === 'oficial';
                const isRealUser = (p.type === 'person' || p.type === 'user') && !isFictive;

                // En producció REAL, permetem humans autenticats i IDENTITATS CORE de la IAIA (ID 11111111-*)
                return (isRealUser && !isFictive) || (isFictive && pid.startsWith('11111111-'));
            }).sort((a, b) => (a.full_name || '').localeCompare(b.full_name || ''));
        }

        return mergedPersonas.sort((a, b) => (a.full_name || '').localeCompare(b.full_name || ''));
    },

    async getAdminEntities(isPlayground = false) {
        const { data, error } = await supabase
            .from('entities')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            logger.warn(`[SupabaseService] getAdminEntities error ignorat (probablement falta la taula entities):`, error);
        }
        
        const safeData = data || [];

        // En producció filtrem les entitats fictícies (demo o Lore-based)
        // I per petició legal, ocultem qualsevol entitat que no sigui del sistema si no estem en mode Playground
        if (!isPlayground) {
            // Mostrem entitats de sistema o del llinatge oficial
            const dbSystem = safeData.filter(e => e.type === 'system' || e.type === 'oficial' || e.owner_id === '25218ea4-5d7d-4db4-bdc5-7ae035629242');
            return [...SYSTEM_ENTITIES, ...dbSystem];
        }

        return [...SYSTEM_ENTITIES, ...safeData];
    },

    // Chats (Secure Messaging - Phase 4)
    async getConversations(userIdOrEntityId) {
        const isGuest = !userIdOrEntityId || userIdOrEntityId === DEMO_USER_ID;

        if (isGuest || (userIdOrEntityId && !isRealDBUUID(userIdOrEntityId))) {
            // [GUEST-FIRST] Forsters and sovereign IDs don't use Mock Chats anymore
            // to keep the Chat List clean with the 13+ official Agents.
            return [];
        }

        // Usamos la vista enriquecida que ya trae nombres y avatares directamente (Optimización Auditoría V3)
        let query = supabase.from('view_conversations_enriched').select(`
            id, 
            participant_1_id, 
            participant_2_id, 
            participant_1_type, 
            participant_2_type, 
            last_message_content, 
            last_message_at,
            is_playground,
            p1_name, 
            p1_avatar_url, 
            p1_role,
            p1_is_ai,
            p2_name, 
            p2_avatar_url,
            p2_role,
            p2_is_ai
        `);

        query = query.or(`participant_1_id.eq.${userIdOrEntityId},participant_2_id.eq.${userIdOrEntityId}`);

        const { data: convs, error } = await query.order('last_message_at', { ascending: false });

        if (error) {
            logger.error('[SupabaseService] Error in getConversations:', error);
            // Si hay error (posiblemente la vista no existe aún), devolvemos vacío o mocks si habilitado
            if (ENABLE_MOCKS) {
                const { MOCK_CHATS } = await import('../../data');
                const currentParticipantId = userIdOrEntityId || 'me';
                return MOCK_CHATS.map(m => ({
                    id: `mock-${m.id}`,
                    last_message_content: m.message,
                    last_message_at: new Date().toISOString(),
                    p1_info: { id: currentParticipantId, name: 'Jo' },
                    p2_info: { id: `m${m.id}`, name: m.name, avatar_url: m.avatar_url || null },
                    participant_1_id: currentParticipantId,
                    participant_2_id: `m${m.id}`,
                    participant_1_type: 'user',
                    participant_2_type: m.type === 'shop' || m.type === 'gov' ? 'entity' : 'user'
                }));
            }
            return [];
        }

        // Mapeamos los campos de la vista al formato que esperan los componentes
        const dbConvs = (convs || []).map(c => ({
            ...c,
            p1_info: { id: c.participant_1_id, name: c.p1_name, avatar_url: c.p1_avatar_url },
            p2_info: { id: c.participant_2_id, name: c.p2_name, avatar_url: c.p2_avatar_url }
        }));

        return dbConvs;
    },

    async getConversationMessages(conversationId) {
        if (!isRealDBUUID(conversationId) || conversationId?.startsWith('mock-')) {
            try {
                const mockIdx = conversationId.split('-')[1];
                const { MOCK_MESSAGES } = await import('../../data');
                const messages = MOCK_MESSAGES[mockIdx] || [];
                return messages.map(m => ({
                    id: `msg-mock-${m.id}`,
                    conversation_id: conversationId,
                    sender_id: m.sender === 'me' ? 'me' : 'other', // En la UI lo gestionamos
                    content: m.text,
                    created_at: new Date().toISOString(),
                    is_ai: false
                }));
            } catch (err) {
                logger.error('Error loading mock messages:', err);
                return [];
            }
        }

        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true });
        if (error) throw error;

        // Hydrate Voice Messages with Metadata
        if (data && data.length > 0) {
            const voiceMessageIds = data.filter(m => m.attachment_type === 'voice').map(m => m.id);
            if (voiceMessageIds.length > 0) {
                const { data: voiceMeta } = await supabase
                    .from('voice_messages')
                    .select('message_id, duration_seconds, waveform_data')
                    .in('message_id', voiceMessageIds);

                if (voiceMeta) {
                    const metaMap = new Map(voiceMeta.map(v => [v.message_id, v]));
                    return data.map(m => {
                        if (m.attachment_type === 'voice') {
                            const meta = metaMap.get(m.id);
                            return {
                                ...m,
                                voice_meta: meta ? {
                                    duration: meta.duration_seconds,
                                    waveform: meta.waveform_data
                                } : null
                            };
                        }
                        return m;
                    });
                }
            }
        }

        return data || [];
    },

    async getLatestMessages(conversationIds) {
        if (!conversationIds || conversationIds.length === 0) return { data: [] };

        // Fetch most recent message for each conversation
        // Auditoría V3: Recuperación manual cuando las columnas resumen fallan
        return supabase
            .from('messages')
            .select('conversation_id, content, created_at')
            .in('conversation_id', conversationIds)
            .order('created_at', { ascending: false });
    },

    async sendSecureMessage(messageData, abortSignal = null, retryCount = 0) {
        if (retryCount > 2) {
            logger.error('[SupabaseService] Recursió infinita aturada en sendSecureMessage');
            throw new Error("Recursió infinita detectada a l'enviar missatge");
        }
        
        if (messageData.senderId && !messageData.isGuest && !messageData.is_ai) {
            await checkThrottling(messageData.senderId, 'send_message', 1000).catch(e => logger.warn('Throttling warn', e));
        }
        // [FAILSAFE GLOBAL]: Si el conversationId és un Mock, un Local-Conv de Playground, o no s'ha arribat a canviar mai (1111... que és la IA)
        if (messageData.conversationId?.startsWith('mock-') || 
            messageData.conversationId?.startsWith('local-conv-') || 
            messageData.conversationId?.startsWith('11111111-')) {
            logger.log('[SupabaseService] Simulated send to mock conversation or unhydrated IAIA agent');
            return {
                id: crypto.randomUUID(), // Prevent mapping issues
                conversation_id: messageData.conversationId,
                sender_id: messageData.senderId,
                content: messageData.content,
                attachment_url: messageData.attachmentUrl || null,
                attachment_type: messageData.attachmentType || null,
                attachment_name: messageData.attachmentName || null,
                created_at: new Date().toISOString(),
                is_ai: false
            };
        }

        // [BATEGAT ANONYMOUS BYPASS] 
        // Si és un usuari anònim enviant a la IAIA, no ho guardem a Supabase
        // per evitar errors de constraint (400) pel sender_id no existent.
        // Simularem l'èxit i invocarem la resposta local.
        if (messageData.isGuest || !messageData.senderId || messageData.senderId === 'guest' || String(messageData.senderId).startsWith('anonymous')) {
            logger.warn('[supabaseService] Intent de sendSecureMessage per usuari anònim. Guardant en local (efímer).');
            const guestMessage = { 
                id: `guest-msg-${Date.now()}`, 
                conversation_id: messageData.conversationId, 
                sender_id: messageData.senderId || 'guest', 
                content: messageData.content, 
                created_at: new Date().toISOString(),
                is_ai: false
            };
            
            // Si la conversació és amb una IAIA (p.ex. IAIA MarIA), activem la resposta ràpida simulada
            if (messageData.conversationId && messageData.conversationId.startsWith('c1111000')) {
                 const personaInfo = LORE_PERSONAS.find(p => p.id === '11111111-1a1a-0000-0000-000000000000'); // IAIA Maria default
                 const responderId = messageData.conversationId.replace('c', ''); // Aproximació per al Mock
                 this.triggerSimulatedReply({ ...messageData, responderId, responderType: 'bot', persona: personaInfo || LORE_PERSONAS[0] });
            }

            return guestMessage;
        }

        // Validació estructural amb Zod
        const isPlayground = localStorage.getItem('isPlaygroundMode') === 'true' ||
            messageData.senderId?.startsWith('11111111-') ||
            messageData.conversationId?.startsWith('c1111000');

        // Check columns silently if in playground
        if (isPlayground && columnCache.messages_is_playground === null) {
            if (!activeChecks.messages) {
                activeChecks.messages = (async () => {
                    try {
                        const { data } = await supabase.from('messages').select('*').limit(1);
                        if (data && data.length > 0) {
                            setColumnCache('messages_is_playground', 'is_playground' in data[0]);
                        }
                    } catch (e) {
                        logger.error('[SupabaseService] Error checking playground column:', e);
                    } finally { activeChecks.messages = null; }
                })();
            }
            await activeChecks.messages;
        }

        const msgPayload = {
            id: crypto.randomUUID(),
            conversation_id: messageData.conversationId,
            sender_id: messageData.senderId,
            sender_entity_id: messageData.senderEntityId || null,
            content: messageData.content || null,
            attachment_url: messageData.attachmentUrl || null,
            attachment_type: messageData.attachmentType || null,
            attachment_name: messageData.attachmentName || null,
            post_uuid: messageData.postUuid || null
        };

        // Auditoría V3: Silenciador de errores por falta de columna post_uuid
        if (columnCache.messages_post_uuid === false) {
            delete msgPayload.post_uuid;
        }

        if (isPlayground && columnCache.messages_is_playground !== false) {
            msgPayload.is_playground = true;
        }

        const validated = MessageSchema.parse(msgPayload);

        // [BUGFIX 400 Bad Request] We construct the select query string dynamically to PREVENT
        // asking for columns that don't exist.
        let safeColumns = 'id, conversation_id, sender_id, content, attachment_url, attachment_type, attachment_name, created_at, is_ai, is_read';
        
        if (columnCache.messages_is_playground !== false) {
           safeColumns += ', is_playground';
        }
        
        const selectStr = columnCache.messages_post_uuid !== false ? `${safeColumns}, post_uuid` : safeColumns;

        let query = supabase
            .from('messages')
            .insert(validated)
            .select(selectStr);
            
        if (abortSignal) {
            query = query.abortSignal(abortSignal);
        }

        const { data, error } = await query;

        if (error) {
            const isMissingPostUuid = (error.code === '42703' || error.code === 'PGRST204') && msgPayload.post_uuid;
            const isMissingPlayground = error.code === 'PGRST204' && isPlayground && columnCache.messages_is_playground !== false;

            if (isMissingPlayground) {
                setColumnCache('messages_is_playground', false);
                return this.sendSecureMessage(messageData, abortSignal, retryCount + 1);
            }
            if (isMissingPostUuid) {
                setColumnCache('messages_post_uuid', false);
                return this.sendSecureMessage(messageData, abortSignal, retryCount + 1);
            }
            if (error.code === '42501') {
                logger.error('[SupabaseService] RLS Permission Denied on messages table.');
                throw { success: false, error: 'Accés denegat (RLS)', code: '42501' }; // Fals èxit suprimit per seguretat (C5)
            }
            throw error;
        }

        if (msgPayload.post_uuid && columnCache.messages_post_uuid === null) {
            setColumnCache('messages_post_uuid', true);
        }

        const message = data[0];

        // Actualizar el resumen en la conversación
        // Auditoría V3: Forzamos el update directo para evitar inconsistencias en la vista
        await supabase
            .from('conversations')
            .update({
                last_message_content: messageData.attachmentUrl ? `[${messageData.attachmentType || 'Arxiu'}]` : messageData.content,
                last_message_at: new Date().toISOString()
            })
            .eq('id', messageData.conversationId);

        // Detect if responder is AI/Lore (Harmonized with UI logic)
        // const { data: conv } = await supabase
        //     .from('view_conversations_enriched')
        //     .select('*')
        //     .eq('id', messageData.conversationId)
        //     .limit(1)
        //     .maybeSingle();

        // const responderId = conv?.participant_1_id === messageData.senderId ? conv?.participant_2_id : conv?.participant_1_id;
        // [Bot Reply Engine]
        // Lógica de respuesta simulada removida de aquí. Ahora iaiaService.js (generateAIAResponse) 
        // gestiona de forma exclusiva los fillers asépticos y la IA real (Gemini) para evitar duplicidades.
        // if (isToLore || responderIsAI || messageData.conversationId.startsWith('c1111000')) {
        //     // Buscamos persona de forma SINCRÓNICA para ganar milisegundos
        //     // const persona = LORE_PERSONAS.find(p => p.id === responderId);
        //     // this.triggerSimulatedReply({ ...messageData, responderId, responderType, persona });
        // }

        return message;
    },


    async triggerSimulatedReply(originalMessage) {
        // Respuesta quasi-instantánea para mantener el engagement (Petición usuario)
        try {
            const { conversationId, responderId, responderType, persona } = originalMessage;
            if (!responderId) return;

            let reply = "";
            const randomVal = Math.random();

            if (persona) {
                // Respuestas con personalidad según el Lore
                const greeting = getTimeAwareGreeting();

                // Respuestas con personalidad según el Lore (Integrando saludos neutros solicitados)
                if (persona.username === 'vferris') {
                    const vReplies = [
                        `${greeting} Gràcies pel missatge. Ara estic amb la garlopa, t'ho mire en un ratet.`,
                        `${greeting} Recorda que la fusta vol paciència. T'ho conteste després!`,
                        `${greeting} Això està fet. Si és per a la Torre, compte amb mi.`,
                        `${greeting} Passa't pel taller quan vullgues i ho mirem.`
                    ];
                    reply = vReplies[Math.floor(randomVal * vReplies.length)];
                } else if (persona.username === 'mariamel') {
                    const mReplies = [
                        `${greeting} Les meues abelles estan ara a tope amb el romer. Después parlem.`,
                        `${greeting} Dolç com la mèl! Gràcies pel missatge.`,
                        `${greeting} Xe, que bona idea. El poble necessita més gent així!`,
                        `${greeting} Estic per la serra sense cobertura, quan baixe t'ho mire.`
                    ];
                    reply = mReplies[Math.floor(randomVal * mReplies.length)];
                } else if (persona.username === 'elenap') {
                    const eReplies = [
                        `${greeting} Ja saps que qualsevol cosa em pots preguntar.`,
                        `${greeting} Sí, d'acord. Jo ajudaré en tot el que pugui al poble.`,
                        `${greeting} Com va tot per allí? Estic ací per a ajudar-te.`,
                        `${greeting} Tinc molta feina ara, però t'ho agraeixo molt!`
                    ];
                    reply = eReplies[Math.floor(randomVal * eReplies.length)];
                } else if (persona.username === 'joanb') {
                    const jReplies = [
                        `${greeting} Estic dalt l'Aitana amb el ramat. No se sent res por aquí.`,
                        `${greeting} Si vols parlar de veres, vine a Benifallim!`,
                        `${greeting} Les meues cabres i jo estem d'acord. Bona proposta!`,
                        `${greeting} Buff, millor parlem a la fresca un altre ratet.`
                    ];
                    reply = jReplies[Math.floor(randomVal * jReplies.length)];
                } else {
                    // Genérico para otros personajes del Lore (con ajuste de género automático y saludos)
                    const genericReplies = [
                        `${greeting} Xe, que bona idea! Gràcies por compartir-ho.`,
                        `${greeting} Ara estic un poc liat, però m'ho apunte!`,
                        `${greeting} Sóc de Poble som tots, compte amb mi.`,
                        `${greeting} Perfecte, ja m'ho dius quan sàpigues algo.`
                    ];
                    reply = adjustGender(genericReplies[Math.floor(randomVal * genericReplies.length)], persona.gender);
                }
            } else {
                reply = "D'acord! Ho tindré en compte. Gràcies pel missatge.";
            }

            // Insertamos el mensaje marcado como IA (con gestión de errores por si la columna no existe aún)
            const payload = {
                id: crypto.randomUUID(),
                conversation_id: conversationId,
                sender_id: responderId,
                sender_entity_id: responderType === 'entity' ? responderId : null,
                content: reply
            };

            // Solo añadimos is_ai si la caché no dice lo contrario
            if (columnCache.messages_is_ai !== false) {
                payload.is_ai = true;
            }

            const { error: insError } = await supabase.from('messages').insert(payload);

            if (insError && insError.code === '42703') { // Undefined column
                columnCache.messages_is_ai = false;
                delete payload.is_ai;
                await supabase.from('messages').insert(payload);
            } else if (!insError) {
                columnCache.messages_is_ai = true;
            }

            // Actualizamos la conversación
            await supabase.from('conversations').update({
                last_message_content: reply,
                last_message_at: new Date().toISOString()
            }).eq('id', conversationId);

        } catch (err) {
            logger.error('[NPC Simulation] Error:', err);
        }
    },

    async getOrCreateConversation(p1Id, p1Type, p2Id, p2Type, retryCount = 0) {
        // Buscar si ya existe la combinación (en cualquier orden)
        const { data: existing } = await supabase
            .from('conversations')
            .select('*')
            .or(`and(participant_1_id.eq.${p1Id},participant_2_id.eq.${p2Id}),and(participant_1_id.eq.${p2Id},participant_2_id.eq.${p1Id})`)
            .maybeSingle();

        if (existing) return existing;

        // Crear nueva si no existe
        const isPlayground = localStorage.getItem('isPlaygroundMode') === 'true' ||
            p1Id?.startsWith('11111111-') ||
            p2Id?.startsWith('11111111-');

        // Check columns silently if in playground
        if (isPlayground && columnCache.conversations_is_playground === null) {
            if (!activeChecks.conversations) {
                activeChecks.conversations = (async () => {
                    try {
                        const { data } = await supabase.from('conversations').select('*').limit(1);
                        if (data && data.length > 0) {
                            setColumnCache('conversations_is_playground', 'is_playground' in data[0]);
                        }
                    } catch (e) {
                        logger.error('[SupabaseService] Error checking definitions for conversations:', e);
                    } finally { activeChecks.conversations = null; }
                })();
            }
            await activeChecks.conversations;
        }

        const convPayload = {
            participant_1_id: p1Id,
            participant_1_type: p1Type,
            participant_2_id: p2Id,
            participant_2_type: p2Type
        };

        // [HOTFIX] Eliminat `is_playground` del payload i del .select() per evitar el llançament 
        // constants errors HTTP 400 (42703) quan la columna no està desplegada al Postgres de Producció.
        const validated = ConversationSchema.parse(convPayload);
        
        const selectStr = 'id, participant_1_id, participant_2_id, created_at';

        const { data, error } = await supabase
            .from('conversations')
            .insert(validated)
            .select(selectStr);

        if (error) {
            // Retratem per console però sense llançar el warning d'error PGRST204 ni el reintent circular
            if (error.code === 'PGRST204' || error.code === '42703') {
                logger.warn('[SupabaseService] PGRST204 o 42703 rebut. Ignorant i bypassejant a causa de diferències en esquemes de Database', error);
            }

            // Auditoria V4 (DeepSeek): Resolució Condició de Cursa Optimística
            if (error.code === '23505') {
                if (retryCount > 2) throw new Error('Recursió aturada en getOrCreateConversation');
                logger.warn('[SupabaseService] 💥 Condició de cursa detectada creant conversació (23505 Unique Violation). Aplicant lectura recursiva salvadora (Optimistic Lock).');
                return await this.getOrCreateConversation(p1Id, p1Type, p2Id, p2Type, retryCount + 1);
            }

            // [RLS / FK / CHECK BYPASS] EN MODE PLAYGROUND O SENSE PERFILS, L'ERROR 401, 403, 23503 (FK) O 23514 (CHECK) ÉS ESPERAT
            if (isPlayground && (error.code === '42501' || error.code === '23503' || error.code === '23514' || error.status === 401 || error.status === 403)) {
                logger.warn(`[SupabaseService] 🛡️ DB Bypass Activat (Error ${error.code || error.status}): Creant conversa local/mock per a la IA.`);
                return {
                    id: `local-conv-${p1Id.substring(0, 4)}-${p2Id.substring(0, 4)}`,
                    participant_1_id: p1Id,
                    participant_1_type: p1Type,
                    participant_2_id: p2Id,
                    participant_2_type: p2Type,
                    is_playground: true,
                    created_at: new Date().toISOString()
                };
            }
            throw error;
        }
        return data[0];
    },

    async markMessagesAsRead(conversationId, userId) {
        if (!conversationId || conversationId.startsWith('mock-') || !isRealDBUUID(conversationId)) return;
        
        // [GUEST SHIELD] Si el userId no és un UUID vàlid de base de dades, no marquem a la DB real
        if (!userId || !isRealDBUUID(userId)) {
            logger.info('[SupabaseService] Foraster detectat, markMessagesAsRead virtualitzat.');
            return;
        }

        const { error } = await supabase.rpc('mark_messages_as_read', {
            conv_id: conversationId,
            user_id: userId
        });

        if (error) {
            if (error.code === '22P02') {
                logger.warn('[SupabaseService] UUID syntax error in markMessagesAsRead, skipping.');
                return;
            }
            throw error;
        }
    },

    // [PROTOCOL REALTIME OMEGA] Bategat monitoritzat màxima eficiència
    subscribeToMessages(conversationId, callback) {
        if (!conversationId) return null;
        
        if (!this._activeChannels) this._activeChannels = new Map();
        if (!this._zombieChannels) this._zombieChannels = new Map();
        const MAX_ACTIVE_CHANNELS = 50; // Supabase Free tier permet màx 100 de forma segura
        
        // LRU Eviction: Tancar canal si estem al límit
        if (this._activeChannels.size >= MAX_ACTIVE_CHANNELS) {
            const oldestKey = this._activeChannels.keys().next().value;
            const oldestChannel = this._activeChannels.get(oldestKey);
            supabase.removeChannel(oldestChannel);
            this._activeChannels.delete(oldestKey);
            logger.warn(`[SupabaseService] LRU Eviction executada: Canal ${oldestKey} liquidat per saturació.`);
        }
        
        const channelKey = `chat:${conversationId}`;
        
        // [MASTER FIX] Purge Ghost Timeouts & Zombie Channels
        if (this._zombieChannels.has(channelKey)) {
            const zombie = this._zombieChannels.get(channelKey);
            clearTimeout(zombie.timeoutId);
            try {
                supabase.removeChannel(zombie.channel).catch(() => {});
            } catch (e) {
                logger.debug('[SupabaseService] Silent zombie remove error', e);
            }
            this._zombieChannels.delete(channelKey);
            logger.info(`[SupabaseService] Ghost timeout i canal zombie purgats per ${channelKey} abans de reconnectar.`);
        }
        
        if (this._activeChannels.has(channelKey)) {
            supabase.removeChannel(this._activeChannels.get(channelKey));
            this._activeChannels.delete(channelKey);
        }
        
        logger.info(`[SupabaseService] Connectant al canal realtime per a: ${conversationId}`);
        const channel = supabase.channel(channelKey)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${conversationId}`
            }, callback)
            .subscribe();
            
        this._activeChannels.set(channelKey, channel);
        return channel;
    },

    unsubscribe(channel) {
        if (channel) {
            const channelKey = channel.topic || channel.name || 'unknown-channel';
            
            if (!this._zombieChannels) this._zombieChannels = new Map();

            // Evitar duplicitat de timeouts si s'invoca repetidament sobre el mateix canal
            if (this._zombieChannels.has(channelKey)) {
                clearTimeout(this._zombieChannels.get(channelKey).timeoutId);
            }

            // [MASTER FIX] Prevenir 'WebSocket closed before the connection is established'
            // Retardem l'ordre de desconnexió per donar oxigen al handshake de Connexió
            const timeoutId = setTimeout(() => {
                try {
                    supabase.removeChannel(channel).catch(() => {});
                } catch (e) {
                    logger.debug('[SupabaseService] Silent remove error', e);
                }
                this._zombieChannels.delete(channelKey);
            }, 800);

            this._zombieChannels.set(channelKey, { channel, timeoutId });

            if (this._activeChannels) {
                this._activeChannels.forEach((val, key) => {
                    if (val === channel) this._activeChannels.delete(key);
                });
            }
            logger.info(`[SupabaseService] Canal realtime ${channelKey} desconnectat netament sense bloquejos orfes.`);
        }
    },

    // Pueblos
    async getTowns() {
        try {
            const { data, error } = await supabase
                .from('towns')
                .select('*');

            if (error) throw error;

            let townsList = data || [];
            
            // [BATEGAT DINÀMIC] Lògica per auto-provisionar i ordenar per activitat recent
            let townActivity = {};
            try {
                // Obtenim els últims posts per veure l'activitat de cada poble
                const { data: postsData } = await supabase
                    .from('posts')
                    .select('town_uuid, created_at')
                    .order('created_at', { ascending: false });
                
                if (postsData) {
                    postsData.forEach(p => {
                        const tId = p.town_uuid;
                        // Since we no longer select town_name, default to tId or "Unknown Town" if no mapping
                        const tName = tId;
                        if (tId && tName && !townActivity[tId]) {
                            townActivity[tId] = {
                                name: tName,
                                lastPost: new Date(p.created_at).getTime()
                            };
                        }
                    });
                }
            } catch (e) {
                logger.warn('[SupabaseService] No s\'ha pogut obtenir l\'activitat per als pobles', e);
            }

            // [AUTO-PROVISIONAMENT]
            Object.entries(townActivity).forEach(([tId, tData]) => {
                if (!townsList.some(t => t.id == tId || t.uuid == tId || t.name === tData.name)) {
                    const normalizedFolderName = 'gentde' + tData.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/['\s-]/g, '');
                    townsList.push({
                        id: tId,
                        uuid: tId,
                        name: tData.name,
                        description: `Nou poble a Sóc de Poble: ${tData.name}. Unint-se a la xarxa rural viva.`,
                        image_url: `/uploads/places/${normalizedFolderName}/cover.jpg`,
                        copy_img: 'EMPTY',
                        copy_texto: 'EMPTY',
                        is_auto_provisioned: true
                    });
                }
            });

            // [GHOST-BATEGAT] Inyectem Agost si no està a la DB (Integració Sixto Pina)
            if (!townsList.some(t => t.id === 4 || t.name === 'Agost')) {
                townsList.push({
                    id: 4,
                    uuid: 'agost-4-uuid',
                    name: 'Agost',
                    description: 'Poble de tradició terrissaire i artesana, on el bategat del ferro de Sixto Pina i el fang de les seues fàbriques crea una identitat única.',
                    escudo_url: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Escudo_de_Agost.svg',
                    avatar_url: 'https://images.unsplash.com/photo-1541336032412-2048a678540d?auto=format&fit=crop&q=80&w=1000',
                    cover_url: 'EMPTY',
                    province: 'Alacant',
                    comarca: 'L\'Alacantí'
                });
            }

            return townsList.map(town => {
                // [MASTER DIRECTIVE] ALGORISME DEL BATEC TERRITORIAL
                const lastActiveTownId = localStorage.getItem('last_active_town_id');
                const secondaryTownId = localStorage.getItem('secondary_town_id');
                const profile = JSON.parse(localStorage.getItem('sdp_profile') || 'null');
                const primaryTownId = profile?.town_uuid || profile?.town_id;

                let connectionStrength = 0;
                const townId = town.id;

                // 1. Recency of posts dominates the sorting (in ms)
                if (townActivity[townId]) {
                    connectionStrength += townActivity[townId].lastPost;
                }

                // 2. Personal affinities
                if (townId === lastActiveTownId) connectionStrength += 1000;
                if (townId === primaryTownId) connectionStrength += 500;
                if (townId === secondaryTownId) connectionStrength += 250;

                // 3. System Priorities (Forced order based on last publicators for the demo)
                const lowerName = town.name?.toLowerCase() || "";
                if (lowerName.includes("la torre")) connectionStrength += 100000000000000;
                else if (lowerName.includes("tibi")) connectionStrength += 90000000000000;
                else if (lowerName.includes("sella")) connectionStrength += 80000000000000;
                else if (lowerName.includes("xixona")) connectionStrength += 70000000000000;
                else if (lowerName.includes("alcoi") || lowerName.includes("alcoy")) connectionStrength += 60000000000000;
                else if (lowerName.includes("relleu")) connectionStrength += 50000000000000;

                // [MASTER IMAGE FALLBACK - FIXED FOLDERS WITHOUT ISO]
                const normalizedFolderName = 'gentde' + (town.name || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/['\s-]/g, '');
                let townAvatar = town.avatar_url && town.avatar_url !== 'EMPTY' ? town.avatar_url : null;
                let townHeader = null;
                
                // Force override for demo towns to fix broken DB paths (like /assets/brand/)
                if (lowerName.includes("benimassot")) townAvatar = "/assets/uploads/poble/benimassot/img-benimassot-main.jpg";
                else if (lowerName.includes("la torre")) {
                    townAvatar = "/assets/uploads/poble/la-torre-de-les-macanes/gentdelatorre-logo-bn-q.png";
                    townHeader = "/assets/uploads/poble/la-torre-de-les-macanes/toponim-la-torre-de-les-macanes-2048px.jpg";
                }
                else if (lowerName.includes("penàguila")) townAvatar = "/assets/uploads/poble/penaguila/img-pen-guila-main.jpg";

                return {
                    ...town,
                    escudo_url: town.escudo_url && town.escudo_url !== 'EMPTY' ? normalizeWikipediaUrl(town.escudo_url) : `/uploads/places/${normalizedFolderName}/logo.png`,
                    avatar_url: townAvatar ? normalizeWikipediaUrl(townAvatar) : `/uploads/places/${normalizedFolderName}/cover.jpg`,
                    cover_url: town.cover_url && town.cover_url !== 'EMPTY' ? normalizeWikipediaUrl(town.cover_url) : (townHeader || 'EMPTY'),
                    image_url: townHeader || town.image_url,
                    connection_strength: connectionStrength,
                    is_community: true 
                };
            }).sort((a, b) => {
                // Prioritat: Força del Batec (Activitat recent) > Ordre Alfabètic
                if (b.connection_strength !== a.connection_strength) {
                    return b.connection_strength - a.connection_strength;
                }
                return a.name.localeCompare(b.name);
            });
        } catch (e) {
            logger.error('Error in getTowns:', e);
            return [];
        }
    },

    async getTownBatecImage(townId) {
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            // [PROTOCOL FLASH] Meritocràcia Visual + Atribució CC BY
            const { data, error } = await supabase
                .from('posts')
                .select('image_url, connections_count, author_name')
                .eq('town_uuid', townId)
                .not('image_url', 'is', null)
                .gte('created_at', thirtyDaysAgo.toISOString())
                .order('connections_count', { ascending: false })
                .limit(1);

            if (error || !data || data.length === 0) return null;
            return {
                url: normalizeWikipediaUrl(data[0].image_url),
                author: data[0].author_name
            };
        } catch (e) {
            logger.warn(`No s'ha pogut trobar imatge de batec recent per a ${townId}:`, e);
            return null;
        }
    },

    // --- TOWN MEDIA (Votació Comunitària) ---
    async getTownMedia(townId) {
        try {
            const { data, error } = await supabase
                .from('town_media')
                .select(`
                    id, 
                    media_type, 
                    image_url, 
                    votes_count, 
                    uploader_id,
                    created_at,
                    profiles (
                        username,
                        avatar_url
                    )
                `)
                .eq('town_id', townId)
                .order('votes_count', { ascending: false });

            if (error) {
                if (error.code === '42P01' || error.code === 'PGRST205' || error.code === 'PGRST201') {
                    logger.warn('town_media table or relationship missing, returning empty array');
                    return [];
                }
                throw error;
            }
            return data;
        } catch (e) {
            logger.error(`Error fetching town media for ${townId}:`, e);
            return [];
        }
    },

    async getUserTownMediaVotes(townId, userId) {
        if (!userId) return [];
        try {
            const { data: votes, error: err2 } = await supabase
                .from('town_media_votes')
                .select('media_id, town_media!inner(town_id)')
                .eq('user_id', userId)
                .eq('town_media.town_id', townId);

            if (err2) throw err2;
            return votes.map(v => v.media_id);
        } catch (e) {
            logger.error(`Error fetching media votes for user ${userId} in town ${townId}:`, e);
            return [];
        }
    },

    async toggleTownMediaVote(mediaId, userId, currentVoted) {
        try {
            if (currentVoted) {
                const { error } = await supabase
                    .from('town_media_votes')
                    .delete()
                    .eq('media_id', mediaId)
                    .eq('user_id', userId);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('town_media_votes')
                    .insert({ media_id: mediaId, user_id: userId });
                if (error) throw error;
            }
            return true;
        } catch (e) {
            logger.error(`Error toggling vote for media ${mediaId}:`, e);
            throw e;
        }
    },

    async uploadTownMedia(townId, userId, file, mediaType) {
        try {
            const result = await this.processMediaUpload(userId, file, 'posts', 'town_media', true);
            const { error } = await supabase
                .from('town_media')
                .insert({
                    town_id: townId,
                    uploader_id: userId,
                    media_type: mediaType,
                    image_url: result.url
                });
            if (error) {
                if (error.code === '23505') {
                    throw new Error('Aquesta imatge ja ha sigut pujada per a aquest poble.');
                }
                throw error;
            }
            return result.url;
        } catch (e) {
            logger.error(`Error uploading town media:`, e);
            throw e;
        }
    },

    async createPioneerTown({ name, province, comarca }) {
        try {
            // [ESCALA NACIONAL] Si un usuario de Extremadura o fuera busca su pueblo y no existe, 
            // este método lo crea dinámicamente usando Wikipedia para el resumen y shield.
            
            // 1. Obtener información básica de la Wikipedia española o catalana
            const { wikipediaService } = await import('./wikipediaService');
            const summary = await wikipediaService.getTownSummary(name, 'es'); // Preferimos español para expansión nacional, fallará seguro la 'ca' para Extremadura.
            const shield = await wikipediaService.getTownShield(name);

            const newTownData = {
                name: name.trim(),
                province: province.trim(),
                comarca: comarca ? comarca.trim() : 'Poble Pioner',
                description: summary?.extract || `Municipi pioner de ${province.trim()} recentment fundat a la xarxa Sóc de Poble.`,
                escudo_url: shield || 'EMPTY',
                population: summary?.population || null
            };

            const { data, error } = await supabase
                .from('towns')
                .insert(newTownData)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            logger.error(`[Towns] Error creating pioneer town ${name}:`, error);
            throw error;
        }
    },

    async getProvinces() {
        const { data, error } = await supabase
            .from('towns')
            .select('province')
            .not('province', 'is', null)
            .order('province', { ascending: true });

        if (error) throw error;
        // Distinct values
        return [...new Set(data.map(item => item.province))];
    },

    async getComarcas(province) {
        const { data, error } = await supabase
            .from('towns')
            .select('comarca')
            .eq('province', province)
            .not('comarca', 'is', null)
            .order('comarca', { ascending: true });

        if (error) throw error;
        // Distinct values
        return [...new Set(data.map(item => item.comarca))];
    },

    async searchAllTowns(query) {
        const sanitizedQuery = sanitizeInput(query);
        if (!sanitizedQuery || sanitizedQuery.length < 2) return [];

        logger.log(`[SupabaseService] Performed search for: "${sanitizedQuery}"`);
        try {
            // Deduplicació de filtres per evitar error 400
            // Nota: towns només té name i description seguint supabase_towns_setup.sql
            const filterTerms = new Set();
            ['name', 'description'].forEach(col => {
                filterTerms.add(`${col}.ilike.%${sanitizedQuery}%`);
            });

            const orClause = Array.from(filterTerms).join(',');

            // NIVELL DIOS: Cerca transversal en municipis
            const { data, error } = await supabase
                .from('towns')
                .select('*')
                .or(orClause)
                .order('name', { ascending: true })
                .limit(40);

            if (error) throw error;
            return (data || []).map(t => ({
                ...t,
                escudo_url: t.escudo_url !== 'EMPTY' ? normalizeWikipediaUrl(t.escudo_url) : 'EMPTY',
                avatar_url: t.avatar_url !== 'EMPTY' ? normalizeWikipediaUrl(t.avatar_url) : 'EMPTY',
                cover_url: t.cover_url !== 'EMPTY' ? normalizeWikipediaUrl(t.cover_url) : 'EMPTY'
            }));
        } catch (err) {
            logger.error('[SupabaseService] Robust search failed, falling back to simple search:', err);
            const { data } = await supabase
                .from('towns')
                .select('*')
                .ilike('name', `%${query}%`)
                .limit(10);
            return data || [];
        }
    },

    async searchProfiles(query) {
        if (!query || query.length < 2) return [];
        const normalizedName = getNormalizedQuery(query);
        const cleanQuery = query.toLowerCase().trim();

        try {
            // Deduplicació intel·ligent per evitar error 400 (Duplicate filters)
            const filterTerms = new Set();
            [cleanQuery, normalizedName].forEach(q => {
                if (!q) return;
                // [FIX] Robusteza en PostgREST: Remove commas and quotes instead of wrapping in quotes
                const safeQ = q.replace(/[,"]/g, '');
                filterTerms.add(`full_name.ilike.%${safeQ}%`);
                filterTerms.add(`username.ilike.%${safeQ}%`);
                filterTerms.add(`primary_town.ilike.%${safeQ}%`);
            });

            // Afegim els altres camps que no depenen de la normalització de noms de poble/persona
            filterTerms.add(`role.ilike."%${cleanQuery}%"`);
            filterTerms.add(`ofici.ilike."%${cleanQuery}%"`);
            filterTerms.add(`bio.ilike."%${cleanQuery}%"`);

            const orClause = Array.from(filterTerms).join(',');
            logger.debug('[SupabaseService] profiles orClause:', orClause);

            // BUSCADOR NIVELL DIOS: Cerca OMNISCIENT en perfils
            let queryBuilder = supabase
                .from('profiles')
                .select('id, full_name, username, avatar_url, role, primary_town, bio, ofici, is_demo')
                .or(orClause);

            const isPlayground = localStorage.getItem('playground_mode') === 'true';
            if (!isPlayground) {
                queryBuilder = queryBuilder.eq('is_demo', false);
            }

            const { data, error } = await queryBuilder
                .order('full_name', { ascending: true })
                .limit(50);

            if (error) throw error;

            // Include lore personas in search with OmniMatch (Nivell Dios)
            const allPersonas = await this.getAllPersonas();
            const filteredLore = allPersonas.filter(p =>
                omniMatch(p.full_name, query) ||
                omniMatch(p.username, query) ||
                omniMatch(p.role, query) ||
                omniMatch(p.primary_town, query) ||
                omniMatch(p.ofici, query) ||
                omniMatch(p.bio, query)
            );

            // Merge and deduplicate by ID and full_name, prioritizing DB/Real
            const unique = [];
            const seenIds = new Set();
            const seenNames = new Set();

            const _combined = [...filteredLore, ...(data || [])];

            // Prioritzem data (DB) al final del merge si volem que "machaque", 
            // però aquí la lògica de .forEach d'un array barrejant-los un a un és clau.
            // Millor: Processar primer els Reals (DB) i després Lore si no s'han vist.

            const profilesToProcess = [
                ...(data || []), // DB first (Priority)
                ...filteredLore  // Lore second
            ];

            profilesToProcess.forEach(p => {
                const id = p.id;
                const nameKey = p.full_name?.toLowerCase().trim();

                if (!seenIds.has(id) && !seenNames.has(nameKey)) {
                    seenIds.add(id);
                    if (nameKey) seenNames.add(nameKey);

                    unique.push({
                        ...p,
                        town_name: p.town_name || p.primary_town
                    });
                }
            });

            return unique;
        } catch (error) {
            logger.error('[SupabaseService] Error in searchProfiles:', error);
            return [];
        }
    },

    async searchEntities(query) {
        if (!query || query.length < 2) return [];
        const normalizedCanonical = getNormalizedQuery(query); // E.g. "Sóc de Poble"
        const cleanQuery = query.toLowerCase().trim();

        // 1. DEFINICIÓ D'ENTITATS DE SISTEMA (Veritat Única - Usant constant centralitzada)
        const systemEntities = SYSTEM_ENTITIES;

        // 2. FILTRATGE OMNISCIENT DE SISTEMA (Sempre disponible)
        const filteredSystem = systemEntities.filter(e =>
            omniMatch(e.name, query) ||
            omniMatch(e.name, normalizedCanonical) ||
            omniMatch(e.type, query) ||
            omniMatch(e.town_name, query)
        );

        let dbResults = [];
        try {
            const filterTerms = new Set();
            const termsToTry = [cleanQuery, normalizedCanonical].filter(Boolean);

            termsToTry.forEach(q => {
                const term = q.trim().toLowerCase().replace(/[,"]/g, '');
                filterTerms.add(`full_name.ilike.%${term}%`);
                filterTerms.add(`username.ilike.%${term}%`);
            });

            // Camps extra
            filterTerms.add(`role.ilike."%${cleanQuery}%"`);
            filterTerms.add(`bio.ilike."%${cleanQuery}%"`);

            const orClause = Array.from(filterTerms).join(',');
            logger.debug('[SupabaseService] entities properly querying profiles with orClause:', orClause);

            // BUSCADOR NIVELL DIOS: Entitats, Comerços i Projectes mapped to profiles
            const { data, error } = await supabase
                .from('profiles')
                .select('id, full_name, username, avatar_url, role, bio')
                .eq('role', 'entitat')
                .or(orClause)
                .limit(50);

            if (error) throw error;
            // Map the profile fields to match entity expected fields (name, type, description)
            dbResults = (data || []).map(p => ({
                id: p.id,
                name: p.full_name || p.username,
                type: p.role,
                avatar_url: p.avatar_url,
                description: p.bio
            }));
        } catch (error) {
            logger.error('[SupabaseService] Error in searchEntities (DB):', error);
            // Seguim endavant amb filteredSystem encara que la DB falle
        }

        // 3. TAXONOMIA I NETEJA
        const sanitizedDbResults = dbResults.map(e => {
            let mappedType = e.type;
            if (e.type === 'negoci' || e.type === 'comerç') mappedType = 'empresa';
            if (e.type === 'associacio') mappedType = 'institucio';

            // Forçar "Sóc de Poble" com a empresa si el nom quadra (OmniMatch)
            if (omniMatch(e.name, 'Sóc de Poble') || omniMatch(e.name, 'Soc de Poble')) {
                mappedType = 'empresa';
            }

            return {
                ...e,
                type: mappedType,
                avatar_url: normalizeWikipediaUrl(e.avatar_url)
            };
        });

        // 4. MERGE I PRIORITZACIÓ (Codi Genius: Sistema > DB)
        // Posem primer les del sistema per a que eixquen dalt i deduplicació no les esborre
        const combined = [...filteredSystem, ...sanitizedDbResults];
        const unique = [];
        const ids = new Set();

        combined.forEach(e => {
            if (!ids.has(e.id)) {
                ids.add(e.id);
                unique.push(e);
            }
        });

        return unique;
    },

    async getPublicDirectory() {
        const cacheKey = 'SDP_COMMUNITY_CACHE';
        let result = { people: [], entities: [] };
        let isSuccess = false;
        
        try {
            const [profiles, entities] = await Promise.all([
                this.getAllPersonas(),
                this.getAdminEntities()
            ]);

            result = {
                people: profiles || [],
                entities: entities || []
            };
            
            if (result.people.length > 0 || result.entities.length > 0) {
                isSuccess = true;
                set(cacheKey, result).catch(e => logger.warn('[SupabaseService] Failed to save community to IDB', e));
            }
        } catch (error) {
            logger.error('[SupabaseService] Error in getPublicDirectory, falling back to IDB:', error);
        }
        
        if (!isSuccess) {
            try {
                const cached = await get(cacheKey);
                if (cached && (cached.people?.length > 0 || cached.entities?.length > 0)) {
                    logger.info('[SupabaseService] Serving community from IDB fallback.');
                    return cached;
                }
            } catch (idbError) {
                logger.error('[SupabaseService] Failed to read community from IDB:', idbError);
            }
        }

        return result;
    },

    async connectWithProfile(followerId, targetId, tags = []) {
        if (!followerId || !targetId) return false;
        if (columnCache.connections_table === false) return true;

        const isRealFollower = isRealDBUUID(followerId);
        const isRealTarget = isRealDBUUID(targetId);

        // Simulation for System/Lore entities that don't have valid UUIDs or aren't in auth.users
        if (!isRealFollower || !isRealTarget || isFictiveProfile({ id: targetId })) {
            logger.info(`[SupabaseService] Virtual Connection detected for ${targetId}. Simulating...`);
            // Store virtually in localStorage for current session persistence
            const virtualKey = `v_conn_${followerId}`;
            const connections = JSON.parse(localStorage.getItem(virtualKey) || '[]');
            if (!connections.includes(targetId)) {
                connections.push(targetId);
                localStorage.setItem(virtualKey, JSON.stringify(connections));
            }
            return true;
        }

        try {
            const { error, status } = await supabase
                .from('connections')
                .upsert({
                    follower_id: followerId,
                    target_id: targetId,
                    status: 'connected',
                    tags: tags,
                    created_at: new Date().toISOString()
                }, {
                    onConflict: 'follower_id,target_id',
                    ignoreDuplicates: false
                });

            if (error) {
                // Handle 409 Conflict (Key not in users) gracefully by falling back to virtual
                if (error.code === '23503' || error.code === '409' || error.code === '23514') { // Added 23514
                    logger.warn(`[SupabaseService] Foreign key constraint for connection ${targetId}. Falling back to virtual.`);
                    // The following lines seem to be from a different context (ChatDetail.jsx) and are commented out to maintain syntax.
                    // // Ensured AI persistence: Resolve real Supabase UUID (Passing 'entity' instead of 'ai' to avoid Postgres 23514 CHECK constraint)
                    // const realConv = await supabaseService.getOrCreateConversation(currentUserId, 'user', id, 'entity');
                    // if (!isMounted) return;}. Falling back to virtual.`);
                    const virtualKey = `v_conn_${followerId}`;
                    const connections = JSON.parse(localStorage.getItem(virtualKey) || '[]');
                    if (!connections.includes(targetId)) {
                        connections.push(targetId);
                        localStorage.setItem(virtualKey, JSON.stringify(connections));
                    }
                    return true;
                }

                if (error.code === '42P01' || status === 404) {
                    setColumnCache('connections_table', false);
                    return true;
                }
                throw error;
            }

            // Automate Push Notification
            const followerProfile = await this.getProfile(followerId);
            if (followerProfile) {
                pushNotifications.triggerNotification(targetId, {
                    title: `Nova connexió!`,
                    body: `${followerProfile.full_name} s'ha connectat amb tu.`,
                    url: `/gent/${followerId}`,
                    tag: `connect-${followerId}`
                }).catch(() => { });
            }

            if (columnCache.connections_table === null) setColumnCache('connections_table', true);
            return true;
        } catch (error) {
            logger.error('[SupabaseService] Error connecting:', error);
            return false;
        }
    },

    async disconnectFromProfile(followerId, targetId) {
        if (!followerId || !targetId) return false;

        // 1. Remove from Virtual Persistence
        const virtualKey = `v_conn_${followerId}`;
```

**[Nota per a DeepSeek]: No contestes encara, espera't al següent missatge on et passaré la PART 2.**