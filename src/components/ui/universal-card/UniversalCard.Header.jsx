// src/components/ui/universal-card/UniversalCard.Header.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Sparkles, Pin, Info } from 'lucide-react';
import Avatar from '../Avatar';
import { getAuthorRoute } from '../../../services/routeService';

// Component per a l'efecte Ripple
const RippleButton = ({ children, onClick, className, ...props }) => {
  const [ripple, setRipple] = useState(null);

  const handleClick = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    setRipple({ x, y, size });

    if (onClick) {
      setTimeout(() => onClick(e), 300); // Espera a que acabe l'animació
    }
  };

  useEffect(() => {
    if (ripple) {
      const timer = setTimeout(() => setRipple(null), 600);
      return () => clearTimeout(timer);
    }
  }, [ripple]);

  return (
    <button
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {ripple && (
        <span
          className="absolute bg-white/30 dark:bg-black/30 rounded-full animate-ripple"
          style={{
            width: ripple.size,
            height: ripple.size,
            left: ripple.x,
            top: ripple.y,
          }}
        />
      )}
      {children}
    </button>
  );
};

// Secció de l'autor amb Ripple
const AuthorSection = ({ item, displayAuthor, avatarSrc, cardVariant, displayTown }) => {
  const navigate = useNavigate();
  const finalAvatarSrc = avatarSrc || item?.avatar_url || item?.author_avatar || item?.logo_url || item?.town_logo || item?.entity_avatar;
  const isMaster = item?.role === 'master' || item?.author_role === 'master';
  const isIAIAInspired = item?.is_iaia_inspired;
  const townName = cardVariant === 'agent' ? item?.town_name : displayTown;

  const handleClick = (e) => {
    e.stopPropagation();
    if (isMaster) {
      navigate('/iaia');
    } else {
      navigate(getAuthorRoute(item));
    }
  };

  return (
    <RippleButton
      onClick={handleClick}
      className="flex items-center gap-3 overflow-hidden min-w-0 text-left outline-none bg-transparent border-none p-0 cursor-pointer group rounded-xl
                 focus-visible:ring-2 focus-visible:ring-brand-blue transition-all duration-200 hover:scale-[1.01]"
      aria-label={`Veure perfil de ${displayAuthor}`}
    >
      <div className="genesis-avatar flex items-center justify-center bg-black/5 dark:bg-white/5 group-active:scale-95 transition-all duration-300 ease-out w-10 h-10">
        <Avatar name={displayAuthor} src={finalAvatarSrc} role={item?.author_role} size="md" />
      </div>

      <div className="header-text group-active:opacity-70 transition-opacity duration-200">
        <div className="master-author-name flex items-center gap-1.5 min-w-0">
          <span className="truncate font-bold transition-colors duration-200 group-hover:text-brand-blue">
            {displayAuthor}
          </span>
          {isIAIAInspired &&              <Sparkles
                size={14}
                className="text-theme-text dark:text-brand-orange shrink-0 transition-transform duration-300 group-hover:rotate-12"
                fill="currentColor"
              />
          }
        </div>

        {townName && townName !== displayAuthor && (
          <div className="flex items-center gap-1 min-w-0 text-sm transition-colors duration-200 group-hover:text-brand-orange">
            {cardVariant !== 'pobles' && <MapPin size={12} className="shrink-0" fill="currentColor" />}
            <span className="truncate">{townName.replace("Poble Principal:", "").trim()}</span>
          </div>
        )}
      </div>
    </RippleButton>
  );
};

// Secció de metadades amb Ripple
const MetaSection = ({ item, cardVariant, displayDate, displayTime, infoText, hasNotice, isPinned, isEventOrAgenda }) => {
  const navigate = useNavigate();

  const handleInfoClick = (e) => {
    e.stopPropagation();
    if (infoText?.toUpperCase() === 'MAPA DEL TRESOR') {
      navigate('/mapa-del-tresor');
    } else if (hasNotice) {
      navigate(isPinned ? '/destacats' : '/agenda');
    }
  };

  return (
    <div className="flex items-center gap-2 shrink-0 pointer-events-auto ml-auto pl-1 py-1">
      {(infoText || hasNotice) && (
        <RippleButton
          onClick={handleInfoClick}
          className={`pointer-events-auto shadow-inner bg-black/10 dark:bg-black/20 text-white hover:bg-black/20 dark:hover:bg-black/30 border-none h-10 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white
                     ${(!infoText || infoText?.toUpperCase() === 'MAPA DEL TRESOR' || isPinned) ? 'w-10 rounded-full shrink-0' : 'rounded-full px-3 truncate'}`}
          title={infoText?.toUpperCase() === 'MAPA DEL TRESOR' ? "Mapa del Tresor" : "Més informació"}
          aria-label={hasNotice ? (isPinned ? "Més informació: Destacat" : "Més informació: AGENDA") : `Més informació: ${infoText}`}
        >
          {infoText?.toUpperCase() === 'MAPA DEL TRESOR' ? (
            <Pin size={18} fill="currentColor" className="transform -rotate-45 transition-transform duration-300 hover:rotate-0" />
          ) : hasNotice ? (
            <div className="flex items-center gap-1">
              {isPinned ? (
                <Pin size={18} fill="currentColor" className="transition-transform duration-300 hover:scale-110" />
              ) : isEventOrAgenda ? (
                <Info size={16} fill="currentColor" className="transition-transform duration-300 hover:scale-110" />
              ) : null}
              {(!isPinned && !isEventOrAgenda) && <span className="text-[11px] font-black uppercase tracking-wider leading-none mt-0.5">AGENDA</span>}
            </div>
          ) : (
            <span className={`font-black uppercase tracking-wider leading-none transition-all duration-200
                              ${infoText?.length <= 3 ? 'text-lg' : 'text-sm mt-0.5'}`}>
              {infoText}
            </span>
          )}
        </RippleButton>
      )}

      <RippleButton
        onClick={(e) => {
          e.stopPropagation();
          navigate('/calendari');
        }}
        className="bg-black/10 dark:bg-black/20 text-white px-3 h-10 rounded-full font-bold hover:bg-black/20 dark:hover:bg-black/30 transition-all duration-200
                   focus:outline-none focus:ring-2 focus:ring-white flex flex-col shadow-inner items-center justify-center min-w-[64px] shrink-0"
        title="Veure al calendari"
        aria-label={`Veure al calendari ${displayTime || ''} ${displayDate || ''}`}
      >
        {displayTime && <div className="text-sm leading-none mb-0.5">{displayTime}</div>}
        {displayDate && <div className="text-xs opacity-90 leading-none">{displayDate}</div>}
      </RippleButton>
    </div>
  );
};

// Component principal amb fade-in
const UniversalCardHeader = ({
  item,
  cardVariant,
  displayTown,
  displayAuthor,
  avatarSrc,
  displayDate,
  displayTime,
  infoText,
  className = ''
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isEventOrAgenda = cardVariant === 'event' || item?.type === 'agenda';
  const isPinned = item?.is_pinned || item?.pinned || item?.metadata?.is_pinned;
  const hasNotice = isEventOrAgenda || isPinned;

  return (
    <header className={`card-header-boina ${className} ${isMounted ? 'animate-fade-in' : 'opacity-0'}`}>
      <div className="flex-1 min-w-0">
        <AuthorSection
          item={item}
          cardVariant={cardVariant}
          displayAuthor={displayAuthor}
          avatarSrc={avatarSrc}
          displayTown={displayTown}
        />
      </div>

      <MetaSection
        item={item}
        cardVariant={cardVariant}
        displayDate={displayDate}
        displayTime={displayTime}
        infoText={infoText}
        hasNotice={hasNotice}
        isPinned={isPinned}
        isEventOrAgenda={isEventOrAgenda}
      />
    </header>
  );
};

export default UniversalCardHeader;
