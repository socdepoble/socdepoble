import { useDesignStore } from '../domain/design/useDesignStore';
import { useShallow } from 'zustand/react/shallow';

/**
 * ESCUT DE SELECTORS (DesignHooks)
 * Selecciona específicament quines propietats fan re-renderitzar els components.
 */

export const useLayoutDesign = () => {
  return useDesignStore(useShallow(state => ({
    architectMode: state.blueprintMode,
    accessibilityMode: state.accessibilityMode
  })));
};

export const useThemeDesign = () => {
  return useDesignStore(useShallow(state => ({
    theme: state.theme,
    isDark: state.theme === 'dark',
    darkMode: state.theme === 'dark',
    visualDemocracy: state.visualDemocracy,
    globalDesign: state.globalDesign
  })));
};

export const useDesignActions = () => {
  return useDesignStore(useShallow(state => ({
    setTheme: state.setTheme,
    toggleTheme: state.toggleTheme,
    setVisionMode: state.setVisionMode,
    setVibe: state.setVibe,
    setGloveMode: state.setGloveMode,
    toggleGloveMode: state.toggleGloveMode,
    setSeniorMode: state.setSeniorMode,
    toggleSeniorMode: state.toggleSeniorMode,
    setReduceMotion: state.setReduceMotion,
    toggleReduceMotion: state.toggleReduceMotion,
    setVisualDemocracy: state.setVisualDemocracy,
    setGlobalDesign: state.setGlobalDesign,
    setIaiaLevelState: state.setIaiaLevelState,
    setBlueprintMode: state.setBlueprintMode,
    setAccessibilityMode: state.setAccessibilityMode,
    toggleAccessibilityMode: state.toggleAccessibilityMode,
    setCompactMenus: state.setCompactMenus,
    toggleCompactMenus: state.toggleCompactMenus,
    resetToNaturalOrder: state.resetToNaturalOrder
  })));
};

export const useDesignConfig = () => {
  return useDesignStore(useShallow(state => ({
    visionMode: state.visionMode,
    vibe: state.vibe,
    gloveMode: state.gloveMode,
    seniorMode: state.seniorMode,
    reduceMotion: state.reduceMotion,
    iaiaLevel: state.iaiaLevel,
    compactMenus: state.compactMenus
  })));
};
