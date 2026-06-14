import { create } from 'zustand';
import { preferenceService } from '../../core/services/preferenceService';
import { AGENTS } from '../../constants';

/**
 * useNavigationStore (Zustand)
 * Gestiona l'estat global de navegació i panells laterals.
 * Desacoblat per a aconseguir Zero Overhead a la UI (Pedra Seca 5.0).
 */
export const useNavigationStore = create((set, get) => {
  const prefs = preferenceService.getPrefs();
  
  return {
    landingPage: prefs.landingPage || 'mur',
    preferredAgentId: prefs.preferredAgentId || 'iaia',
    enabledAgentIds: prefs.enabledAgentIds || AGENTS.map(a => a.id),
    iaiaLoreEnabled: prefs.iaiaLoreEnabled !== undefined ? prefs.iaiaLoreEnabled : true,
    
    isDrawerOpen: typeof window !== 'undefined' ? window.innerWidth >= 768 : false,
    globalDroppedFile: null,
    
    iaiaSidebarOpen: false,
    iaiaSidebarContext: 'general',
    isProfileMenuOpen: false,
    isAccessibilitatOpen: false,
    selectedTown: prefs.selectedTown || 'La Torre de les Maçanes',
    chatSettings: prefs.chatSettings || { readReceipts: true },
    forensicMode: false,

    // Accions
    setLandingPage: (val) => {
      set({ landingPage: val });
      get().syncPrefs();
    },
    setPreferredAgentId: (val) => {
      set({ preferredAgentId: val });
      get().syncPrefs();
    },
    setEnabledAgentIdsState: (val) => {
      set({ enabledAgentIds: val });
      get().syncPrefs();
    },
    setIaiaLoreEnabledState: (val) => {
      set({ iaiaLoreEnabled: val });
      get().syncPrefs();
    },
    
    setIsDrawerOpen: (val) => set({ isDrawerOpen: val }),
    toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
    closeDrawer: () => {
      if (window.innerWidth < 768) {
        set({ isDrawerOpen: false });
      }
    },

    setGlobalDroppedFile: (file) => set({ globalDroppedFile: file }),

    openIAIASidebar: (ctx = 'general') => set({ iaiaSidebarOpen: true, iaiaSidebarContext: ctx }),
    closeIAIASidebar: () => set({ iaiaSidebarOpen: false }),

    setIsProfileMenuOpen: (val) => set({ isProfileMenuOpen: val }),
    closeProfileMenu: () => set({ isProfileMenuOpen: false }),

    setIsAccessibilitatOpen: (val) => set({ isAccessibilitatOpen: val }),

    setSelectedTown: (val) => {
      set({ selectedTown: val });
      get().syncPrefs();
    },

    setChatSettings: (val) => {
      set({ chatSettings: val });
      get().syncPrefs();
    },

    setForensicMode: (val) => set({ forensicMode: val }),

    // Persistència a localStorage
    syncPrefs: () => {
      const state = get();
      preferenceService.setPrefs({
        landingPage: state.landingPage,
        preferredAgentId: state.preferredAgentId,
        enabledAgentIds: state.enabledAgentIds,
        iaiaLoreEnabled: state.iaiaLoreEnabled,
        selectedTown: state.selectedTown,
        chatSettings: state.chatSettings
      });
    }
  };
});

// Listener global de resize per a obrir/tancar el calaix lateral automàticament
if (typeof window !== 'undefined') {
  let rafId = null;
  window.addEventListener('resize', () => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      const isDesktop = window.innerWidth >= 768;
      const isOpen = useNavigationStore.getState().isDrawerOpen;
      
      if (isDesktop && !isOpen) {
        useNavigationStore.setState({ isDrawerOpen: true });
      } else if (!isDesktop && isOpen) {
        useNavigationStore.setState({ isDrawerOpen: false });
      }
      
      rafId = null;
    });
  });
}
