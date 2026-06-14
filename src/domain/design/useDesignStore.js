import { create } from 'zustand';
import { preferenceService } from '../../core/services/preferenceService';

export const useDesignStore = create((set, get) => {
  const prefs = preferenceService.getPrefs();

  return {
    theme: prefs.theme || 'light',
    visionMode: prefs.visionMode || 'immersiva',
    vibe: prefs.vibe,
    gloveMode: prefs.gloveMode,
    seniorMode: prefs.seniorMode || false,
    reduceMotion: prefs.reduceMotion || false,
    visualDemocracy: prefs.visualDemocracy || 'pedra-seca',
    globalDesign: prefs.globalDesign || 'batega',
    iaiaLevel: prefs.iaiaLevel !== undefined ? prefs.iaiaLevel : 3,
    blueprintMode: prefs.blueprintMode || false,
    accessibilityMode: prefs.accessibilityMode || false,
    compactMenus: prefs.compactMenus || false,

    setTheme: (val) => {
      set({ theme: val });
      get().syncPrefs();
    },
    toggleTheme: () => {
      set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' }));
      get().syncPrefs();
    },
    setVisionMode: (mode) => {
      const levelMap = { 'humana': 0, 'iaia': 1, 'immersiva': 2, 'creativa': 3 };
      set({ 
        visionMode: mode,
        iaiaLevel: levelMap[mode] !== undefined ? levelMap[mode] : get().iaiaLevel 
      });
      get().syncPrefs();
    },
    setVibe: (val) => { set({ vibe: val }); get().syncPrefs(); },
    
    setGloveMode: (val) => { set({ gloveMode: val }); get().syncPrefs(); },
    toggleGloveMode: () => { set((state) => ({ gloveMode: !state.gloveMode })); get().syncPrefs(); },
    
    setSeniorMode: (val) => { set({ seniorMode: val }); get().syncPrefs(); },
    toggleSeniorMode: () => { set((state) => ({ seniorMode: !state.seniorMode })); get().syncPrefs(); },
    
    setReduceMotion: (val) => { set({ reduceMotion: val }); get().syncPrefs(); },
    toggleReduceMotion: () => { set((state) => ({ reduceMotion: !state.reduceMotion })); get().syncPrefs(); },
    
    setVisualDemocracy: (val) => { set({ visualDemocracy: val }); get().syncPrefs(); },
    setGlobalDesign: (val) => { set({ globalDesign: val }); get().syncPrefs(); },
    
    setIaiaLevelState: (val) => { set({ iaiaLevel: val }); get().syncPrefs(); },
    setBlueprintMode: (val) => { set({ blueprintMode: val }); get().syncPrefs(); },
    
    setAccessibilityMode: (val) => { set({ accessibilityMode: val }); get().syncPrefs(); },
    toggleAccessibilityMode: () => { set((state) => ({ accessibilityMode: !state.accessibilityMode })); get().syncPrefs(); },
    
    setCompactMenus: (val) => { set({ compactMenus: val }); get().syncPrefs(); },
    toggleCompactMenus: () => { set((state) => ({ compactMenus: !state.compactMenus })); get().syncPrefs(); },
    
    resetToNaturalOrder: () => {
      preferenceService.resetToNaturalOrder();
      const newPrefs = preferenceService.getPrefs();
      set({ ...newPrefs });
    },

    syncPrefs: () => {
      const state = get();
      preferenceService.setPrefs({
        theme: state.theme,
        vibe: state.vibe,
        visionMode: state.visionMode,
        gloveMode: state.gloveMode,
        seniorMode: state.seniorMode,
        visualDemocracy: state.visualDemocracy,
        globalDesign: state.globalDesign,
        blueprintMode: state.blueprintMode,
        iaiaLevel: state.iaiaLevel,
        accessibilityMode: state.accessibilityMode,
        reduceMotion: state.reduceMotion,
        compactMenus: state.compactMenus
      });
      get().applyDOMChanges();
    },

    applyDOMChanges: () => {
      if (typeof document === 'undefined') return;
      const state = get();
      
      document.documentElement.setAttribute('data-theme', state.theme);
      document.documentElement.classList.remove('light', 'dark', 'solemne', 'theme-light', 'theme-dark', 'theme-solemne');
      document.documentElement.classList.add(state.theme);
      document.documentElement.classList.add(`theme-${state.theme}`);
      
      document.documentElement.setAttribute('data-vibe', state.vibe || '');
      document.documentElement.setAttribute('data-visual-democracy', state.visualDemocracy);
      document.documentElement.setAttribute('data-design', state.globalDesign);
      
      if (state.globalDesign === 'consola') {
        document.body.classList.add('design-consola');
      } else {
        document.body.classList.remove('design-consola');
      }

      const themeClasses = ['theme-pedra-seca', 'theme-oli-suau', 'theme-gem-modern'];
      document.documentElement.classList.remove(...themeClasses);
      const themeMap = {
        'pedra-seca': 'theme-pedra-seca',
        'oli-suau': 'theme-oli-suau',
        'gem-modern': 'theme-gem-modern'
      };
      document.documentElement.classList.add(themeMap[state.visualDemocracy] || 'theme-pedra-seca');

      if (state.gloveMode) document.body.classList.add('mode-guants');
      else document.body.classList.remove('mode-guants');

      if (state.seniorMode) document.body.classList.add('senior-mode');
      else document.body.classList.remove('senior-mode');

      if (state.reduceMotion) {
        document.documentElement.style.setProperty('--animation-speed', '0s');
        document.body.classList.add('reduce-motion');
      } else {
        document.documentElement.style.setProperty('--animation-speed', '0.3s');
        document.body.classList.remove('reduce-motion');
      }

      setTimeout(() => {
        const rootStyle = getComputedStyle(document.documentElement);
        const primaryColor = rootStyle.getPropertyValue('--theme-accent-primary').trim() || '#f97316';
        const metaTheme = document.getElementById('meta-theme-color');
        if (metaTheme) metaTheme.setAttribute('content', primaryColor);
      }, 50);
    }
  };
});

// Inicialització inicial
if (typeof document !== 'undefined') {
  useDesignStore.getState().applyDOMChanges();
}
