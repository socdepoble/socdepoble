import React, { useRef } from 'react';
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

  const handleEvent = (eventName) => {
    try {
      if (typeof window !== 'undefined' && window.navigator?.vibrate) window.navigator.vibrate(10);
    } catch (e) {
      // Ignorem silenciosament si l'API no està disponible o l'usuari no ha interactuat
    }
    safeEmit(eventName, { entityId: String(entityId), entityTitle, entityType });
  };

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
        icon={<Languages size={22} aria-hidden="true" />} 
      />
      <ActionIconBtn 
        onClick={() => handleEvent('COMMENT')} 
        label="Comentar" 
        icon={<MessageCircle size={22} aria-hidden="true" />} 
      />
      <ActionIconBtn 
        onClick={() => handleEvent('SHARE')} 
        label="Compartir" 
        icon={<Share2 size={22} aria-hidden="true" />} 
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
      {primaryLabel === 'AFEGIR' ? <ShoppingCart size={16} strokeWidth={3} aria-hidden="true" /> : <Plus size={16} strokeWidth={3} aria-hidden="true" />} 
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
