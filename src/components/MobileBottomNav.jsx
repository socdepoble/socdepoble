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
      className="fixed bottom-0 left-0 right-0 z-[var(--z-nav)] lg:hidden bg-[#050505] border-t border-white/5 shadow-[0_-4px_10px_rgba(0,0,0,0.5)] select-none touch-manipulation"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 0.75rem)',
        height: 'auto',
        minHeight: 'calc(72px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <div className="flex items-center justify-between w-full h-full px-1 xs:px-2">
        {TABS.map((tab) => {
          const isActive = location.pathname.startsWith(tab.id) && !tab.isAction;
          const Icon = tab.icon;

          if (tab.isAction) {
            return (
              <button
                key={tab.id}
                onClick={(e) => handleActionClick(e, tab.id)}
                aria-label={tab.label}
                className="flex-1 max-w-[100px] h-[56px] bg-[#544CF6] text-white rounded-[16px] flex flex-col items-center justify-center space-y-0.5 mx-1 transition-colors active:brightness-90 outline-none"
              >
                <Icon size={22} strokeWidth={3} />
                <span className="text-[10px] font-bold uppercase tracking-widest hidden min-[360px]:block">{tab.label}</span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={(e) => handleActionClick(e, tab.id)}
              aria-label={tab.label}
              className={`flex-1 flex flex-col items-center justify-center h-full space-y-1 transition-colors outline-none
                ${isActive ? 'text-[var(--theme-accent-primary)]' : 'text-white/60 hover:text-white/90'}`}
            >
              <Icon size={24} strokeWidth={isActive ? 3 : 2.5} />
              <span className="text-[10px] font-bold uppercase tracking-widest hidden min-[400px]:block">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
