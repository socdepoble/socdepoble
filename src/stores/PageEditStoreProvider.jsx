/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect } from 'react';
import { createStore, useStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

const createEditStore = (initialSubtitle = '') => createStore((set) => ({
  isEditing: false,
  isSaving: false,
  localSubtitle: initialSubtitle,
  setEditing: (val) => set({ isEditing: val }),
  setSaving: (val) => set({ isSaving: val }),
  setLocalSubtitle: (val) => set({ localSubtitle: val }),
  resetEdit: () => set({ isEditing: false, isSaving: false, localSubtitle: initialSubtitle }),
}));

const PageEditStoreContext = createContext(null);

export const PageEditStoreProvider = ({ children, initialSubtitle = '' }) => {
  const [store] = React.useState(() => createEditStore(initialSubtitle));

  // Sincronitza el subtítol si canvia de forma segura sense setState en render (Defecte 1 fixat)
  useEffect(() => {
    if (initialSubtitle !== undefined && initialSubtitle !== store.getState().localSubtitle) {
      store.getState().setLocalSubtitle(initialSubtitle);
    }
  }, [initialSubtitle, store]);

  useEffect(() => {
    return () => {
      store.destroy?.();
    };
  }, [store]);

  return (
    <PageEditStoreContext.Provider value={store}>
      {children}
    </PageEditStoreContext.Provider>
  );
};

export const usePageEditStore = (selector) => {
  const store = useContext(PageEditStoreContext);
  if (!store) {
    throw new Error('usePageEditStore ha de ser utilitzat dins de PageEditStoreProvider');
  }
  return useStore(store, selector);
};

export const usePageEditStoreActions = () => {
  const store = useContext(PageEditStoreContext);
  if (!store) {
    throw new Error('usePageEditStoreActions ha de ser utilitzat dins de PageEditStoreProvider');
  }

  return useStore(store, useShallow((s) => ({
    setEditing: s.setEditing,
    setSaving: s.setSaving,
    setLocalSubtitle: s.setLocalSubtitle,
    resetEdit: s.resetEdit,
  })));
};
