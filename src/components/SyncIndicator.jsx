import React from 'react';

// Estats possibles: 'online' (invisible/verd), 'offline' (groc), 'syncing' (blau animat), 'error' (vermell)
export const SyncIndicator = ({ status, pendingCount = 0 }) => {
  // Silenci absolut si tot va bé i no hi ha feina pendent
  if (status === 'online' && pendingCount === 0) return null;

  const config = {
    offline: { color: 'bg-yellow-500', text: 'Sense cobertura. Guardant en local...', ping: false },
    syncing: { color: 'bg-blue-500', text: `Sincronitzant ${pendingCount} canvis...`, ping: true },
    error:   { color: 'bg-red-500', text: 'Error de connexió', ping: false }
  };

  const current = config[status] || config.offline;

  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-gray-900 text-white px-3 py-1.5 rounded-full shadow-lg text-[11px] font-bold z-50 transition-all duration-300 pointer-events-none">
      <div className="relative flex h-2.5 w-2.5">
        {current.ping && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.color}`}></span>
        )}
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${current.color}`}></span>
      </div>
      <span>{current.text}</span>
    </div>
  );
};
