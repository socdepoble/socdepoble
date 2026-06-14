import { useNavigationStore } from '../domain/navigation/useNavigationStore';
import { useShallow } from 'zustand/react/shallow';

/**
 * ESCUT DE SELECTORS (NavigationHooks)
 * Selecciona específicament quines propietats fan re-renderitzar els components.
 */

export const useDrawerState = () => {
  return useNavigationStore(useShallow(state => ({
    isDrawerOpen: state.isDrawerOpen,
    toggleDrawer: state.toggleDrawer,
    closeDrawer: state.closeDrawer
  })));
};

export const useSidebarState = () => {
  return useNavigationStore(useShallow(state => ({
    iaiaSidebarOpen: state.iaiaSidebarOpen,
    iaiaSidebarContext: state.iaiaSidebarContext,
    openIAIASidebar: state.openIAIASidebar,
    closeIAIASidebar: state.closeIAIASidebar
  })));
};

export const useGlobalDroppedFile = () => {
  return useNavigationStore(useShallow(state => ({
    globalDroppedFile: state.globalDroppedFile,
    setGlobalDroppedFile: state.setGlobalDroppedFile
  })));
};

export const useNavigationActions = () => {
  return useNavigationStore(useShallow(state => ({
    setLandingPage: state.setLandingPage,
    setPreferredAgentId: state.setPreferredAgentId,
    setEnabledAgentIdsState: state.setEnabledAgentIdsState,
    setIaiaLoreEnabledState: state.setIaiaLoreEnabledState,
    setSelectedTown: state.setSelectedTown,
    setChatSettings: state.setChatSettings,
    setForensicMode: state.setForensicMode,
    setIsProfileMenuOpen: state.setIsProfileMenuOpen,
    closeProfileMenu: state.closeProfileMenu,
    setIsAccessibilitatOpen: state.setIsAccessibilitatOpen
  })));
};

export const useNavigationConfig = () => {
  return useNavigationStore(useShallow(state => ({
    landingPage: state.landingPage,
    preferredAgentId: state.preferredAgentId,
    enabledAgentIds: state.enabledAgentIds,
    iaiaLoreEnabled: state.iaiaLoreEnabled,
    selectedTown: state.selectedTown,
    chatSettings: state.chatSettings,
    forensicMode: state.forensicMode,
    isProfileMenuOpen: state.isProfileMenuOpen,
    isAccessibilitatOpen: state.isAccessibilitatOpen
  })));
};
