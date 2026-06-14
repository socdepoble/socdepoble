/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from 'react';
import { useStore } from 'zustand';
import { createPageUIStore } from './createPageUIStore';

const PageUIStoreContext = createContext(null);

export function PageUIStoreProvider({ children, defaultViewMode = 'document' }) {
  const [store] = React.useState(() => createPageUIStore(defaultViewMode));
  React.useEffect(() => {
    return () => store.destroy?.();
  }, [store]);

  return (
    <PageUIStoreContext.Provider value={store}>
      {children}
    </PageUIStoreContext.Provider>
  );
}

export function usePageUIStore(selector) {
  const store = useContext(PageUIStoreContext);
  if (!store) throw new Error('Missing PageUIStoreProvider');
  return useStore(store, selector);
}

export function usePageUIStoreActions() {
  const store = useContext(PageUIStoreContext);
  if (!store) throw new Error('Missing PageUIStoreProvider');
  return store.getState();
}
