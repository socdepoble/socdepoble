import { createContext, useContext, useState } from 'react';
// import { usePowerSync } from '@powersync/react'; // En el futuro de PowerSync

const RealmContext = createContext();

export const RealmProvider = ({ children }) => {
  // El estado por defecto es 'GLOBAL' (El Aleph, todos tus reinos superpuestos)
  const [activeRealm, setActiveRealm] = useState('GLOBAL');
  const [myRealms] = useState([
    { id: '00000000-0000-0000-0000-111111111111', name: 'Sóc de Poble', type: 'poble', theme_color: '#f97316' },
    { id: '22222222-2222-2222-2222-222222222222', name: 'Campus UPV', type: 'universitat', theme_color: '#3b82f6' }
  ]);

  const switchRealm = (realmId) => {
    setActiveRealm(realmId);
    console.log(`[ÁRBOL DE REINOS] Cambiando vista a: ${realmId}`);
    // Aquí en el futuro inyectaremos document.documentElement.style.setProperty('--primary-color', reino.theme_color)
  };

  const currentRealmData = activeRealm === 'GLOBAL' 
    ? { id: 'GLOBAL', name: 'Vista Global', type: 'global' }
    : myRealms.find(r => r.id === activeRealm);

  return (
    <RealmContext.Provider value={{ activeRealm, myRealms, switchRealm, currentRealmData }}>
      {children}
    </RealmContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useRealm = () => {
  const context = useContext(RealmContext);
  if (!context) {
    throw new Error("useRealm debe estar dentro de un RealmProvider");
  }
  return context;
};
