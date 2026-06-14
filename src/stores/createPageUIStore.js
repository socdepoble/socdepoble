import { createStore } from 'zustand/vanilla';

export const createPageUIStore = (defaultViewMode = 'document') => 
  createStore((set) => ({
    isIndexOpen: false,
    isIndexPinned: false,
    isHistoryOpen: false,
    currentViewMode: defaultViewMode,
    toggleIndex: () => set((s) => ({ isIndexOpen: !s.isIndexOpen })),
    togglePin: () => set((s) => ({ isIndexPinned: !s.isIndexPinned })),
    setHistoryOpen: (val) => set({ isHistoryOpen: val }),
    setViewMode: (val) => set({ currentViewMode: val }),
    reset: () => set({
      isIndexOpen: false,
      isIndexPinned: false,
      isHistoryOpen: false,
      currentViewMode: defaultViewMode,
    }),
  }));
