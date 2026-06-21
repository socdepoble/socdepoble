import React from 'react';
import { Languages, MessageCircle, Share2, Plus } from 'lucide-react';
import { emit, SDP } from '../../lib/eventBus';
import './PageActionBar.css';

export default function PageActionBar({ title }) {
  const handleEvent = (eventName) => {
    if (window.navigator?.vibrate) window.navigator.vibrate(10);
    emit(eventName, { entityTitle: title, entityType: 'page' });
  };

  return (
    <div className="sdp-page-actions flex items-center gap-1 shrink-0">
      <button 
        type="button" 
        onClick={() => handleEvent(SDP?.TRANSLATE)} 
        aria-label="Traduir" 
        className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
      >
        <Languages size={22} />
      </button>
      <button 
        type="button" 
        onClick={() => handleEvent(SDP?.COMMENT)} 
        aria-label="Comentar" 
        className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
      >
        <MessageCircle size={22} />
      </button>
      <button 
        type="button" 
        onClick={() => handleEvent(SDP?.SHARE)} 
        aria-label="Compartir" 
        className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
      >
        <Share2 size={22} />
      </button>
      <button 
        type="button" 
        onClick={() => handleEvent(SDP?.CONNECT)} 
        className="h-11 px-4 ml-1 flex items-center gap-1.5 rounded-full bg-white text-black text-xs font-black hover:bg-white/90 active:opacity-80 transition-opacity"
      >
        <Plus size={14} strokeWidth={3} /> CONNECTAR
      </button>
    </div>
  );
}
