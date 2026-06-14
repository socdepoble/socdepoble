import React from 'react';
import { Languages, MessageCircle, Share2, Plus } from 'lucide-react';
import { emit, SDP } from '../../lib/eventBus';

const ActionIconBtn = ({ onClick, icon, label }) => (
  <button 
    type="button" 
    onClick={onClick} 
    aria-label={label} 
    className="action-icon-btn"
  >
    {icon}
  </button>
);

const ActionBar = ({ 
  entityId, 
  entityType = 'post',
  entityTitle = 'Sóc de Poble',
  primaryLabel = 'CONNECTAR',
  primaryEvent = SDP.CONNECT 
}) => {
  const handleEvent = (eventName) => {
    if (window.navigator?.vibrate) window.navigator.vibrate(10);
    emit(eventName, { entityId, entityTitle, entityType });
  };

  return (
    <footer 
      className="action-bar flex items-center justify-between px-3 h-14 shrink-0" 
    >
      <div className="flex items-center gap-1">
        <ActionIconBtn 
          onClick={() => handleEvent(SDP.TRANSLATE)} 
          label="Traduir" 
          icon={<Languages size={22} />} 
        />
        <ActionIconBtn 
          onClick={() => handleEvent(SDP.COMMENT)} 
          label="Comentar" 
          icon={<MessageCircle size={22} />} 
        />
        <ActionIconBtn 
          onClick={() => handleEvent(SDP.SHARE)} 
          label="Compartir" 
          icon={<Share2 size={22} />} 
        />
      </div>
      <button 
        onClick={() => handleEvent(primaryEvent)} 
        className="flex items-center gap-1.5 bg-white text-black font-black text-xs rounded-full px-4 py-2 hover:bg-white/90 active:opacity-80 transition-opacity"
      >
        <Plus size={14} strokeWidth={3} /> {primaryLabel}
      </button>
    </footer>
  );
};

export default React.memo(ActionBar);
