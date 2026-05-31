import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, LayoutGrid, Store, MapPin, Plus } from 'lucide-react';

const TABS = [
  { id: '/chats', icon: MessageSquare, label: 'XAT' },
  { id: '/mur', icon: LayoutGrid, label: 'MUR' },
  { id: 'ADD', icon: Plus, label: 'CONNECTAR', isAction: true },
  { id: '/mercat', icon: Store, label: 'MERCAT' },
  { id: '/pobles', icon: MapPin, label: 'POBLES' },
];

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleActionClick = React.useCallback(
    (e, id) => {
      e.preventDefault();
      e.stopPropagation();
      if (id === 'ADD') {
        navigate('/hub');
      } else {
        navigate(id);
      }
    },
    [navigate]
  );

  return (
    <nav 
      className="notranslate fixed bottom-0 left-0 right-0 z-[var(--z-nav)] md:hidden bg-[#050505] border-t border-white/5 shadow-[0_-4px_10px_rgba(0,0,0,0.5)] select-none touch-manipulation flex flex-col items-center justify-center"
    >
      <div className="notranslate flex flex-1 items-center justify-evenly w-full h-[64px] px-2">
        {TABS.map((tab) => {
          const isActive = location.pathname.startsWith(tab.id) && !tab.isAction;
          const Icon = tab.icon;

          if (tab.isAction) {
            return (
              <button
                key={tab.id}
                onClick={(e) => handleActionClick(e, tab.id)}
                aria-label={tab.label}
                className="w-[52px] h-[52px] bg-[#4F46E5] text-white rounded-full flex items-center justify-center mx-1 shadow-lg shadow-[#4F46E5]/20 transition-transform active:scale-90 outline-none shrink-0"
              >
                <Icon size={30} strokeWidth={3} />
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={(e) => handleActionClick(e, tab.id)}
              aria-label={tab.label}
              className={`w-[52px] h-[52px] flex items-center justify-center transition-colors outline-none active:scale-90 shrink-0
                ${isActive ? 'text-[#4F46E5]' : 'text-white/60 hover:text-white/90'}`}
            >
              <Icon size={26} strokeWidth={isActive ? 3 : 2.5} />
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
