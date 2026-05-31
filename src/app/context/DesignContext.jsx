import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { preferenceService } from '../../core/services/preferenceService';

const DesignContext = createContext();

export const DesignProvider = ({ children }) => {
    const [prefs] = useState(preferenceService.getPrefs());

    const [theme, setTheme] = useState(prefs.theme);
    const [visionMode, setVisionModeState] = useState(prefs.visionMode || 'immersiva');
    const [vibe, setVibe] = useState(prefs.vibe);
    const [gloveMode, setGloveMode] = useState(prefs.gloveMode);
    const [seniorMode, setSeniorMode] = useState(prefs.seniorMode || false);
    const [reduceMotion, setReduceMotion] = useState(prefs.reduceMotion || false);
    const [visualDemocracy, setVisualDemocracy] = useState(prefs.visualDemocracy || 'pedra-seca');
    const [globalDesign, setGlobalDesign] = useState(prefs.globalDesign || 'batega');
    const [iaiaLevel, setIaiaLevelState] = useState(prefs.iaiaLevel !== undefined ? prefs.iaiaLevel : 3);
    const [blueprintMode, setBlueprintMode] = useState(prefs.blueprintMode || false);
    const [accessibilityMode, setAccessibilityMode] = useState(prefs.accessibilityMode || false);
    const [compactMenus, setCompactMenus] = useState(prefs.compactMenus || false);


    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.classList.remove('light', 'dark', 'solemne', 'theme-light', 'theme-dark', 'theme-solemne');
        document.documentElement.classList.add(theme);
        document.documentElement.classList.add(`theme-${theme}`);
        document.documentElement.setAttribute('data-vibe', vibe);
        document.documentElement.setAttribute('data-visual-democracy', visualDemocracy);
        document.documentElement.setAttribute('data-design', globalDesign);

        if (globalDesign === 'consola') {
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
        const activeClass = themeMap[visualDemocracy] || 'theme-pedra-seca';
        document.documentElement.classList.add(activeClass);

        if (gloveMode) {
            document.body.classList.add('mode-guants');
        } else {
            document.body.classList.remove('mode-guants');
        }

        if (seniorMode) {
            document.body.classList.add('senior-mode');
        } else {
            document.body.classList.remove('senior-mode');
        }

        if (reduceMotion) {
            document.documentElement.style.setProperty('--animation-speed', '0s');
            document.body.classList.add('reduce-motion');
        } else {
            document.documentElement.style.setProperty('--animation-speed', '0.3s');
            document.body.classList.remove('reduce-motion');
        }

        const prefsToSave = {
            theme, vibe, visionMode, gloveMode, seniorMode, visualDemocracy, globalDesign,
            blueprintMode, iaiaLevel, accessibilityMode, reduceMotion, compactMenus
        };

        const timeoutId = setTimeout(() => {
            preferenceService.setPrefs(prefsToSave);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [theme, vibe, visionMode, gloveMode, seniorMode, visualDemocracy, globalDesign, blueprintMode, iaiaLevel, accessibilityMode, reduceMotion, compactMenus]);

    const toggleTheme = useCallback(() => setTheme(prev => prev === 'light' ? 'dark' : 'light'), []);
    const toggleGloveMode = useCallback(() => setGloveMode(prev => !prev), []);
    const toggleSeniorMode = useCallback(() => setSeniorMode(prev => !prev), []);
    const toggleReduceMotion = useCallback(() => setReduceMotion(prev => !prev), []);
    const toggleAccessibilityMode = useCallback(() => setAccessibilityMode(p => !p), []);
    const toggleCompactMenus = useCallback(() => setCompactMenus(p => !p), []);
    const resetToNaturalOrder = useCallback(() => preferenceService.resetToNaturalOrder(), []);
    const setVisionMode = useCallback((mode) => {
        setVisionModeState(mode);
        const levelMap = { 'humana': 0, 'iaia': 1, 'immersiva': 2, 'creativa': 3 };
        if (levelMap[mode] !== undefined) setIaiaLevelState(levelMap[mode]);
    }, []);

    const value = useMemo(() => ({
        theme, setTheme, toggleTheme,
        visionMode, setVisionMode, vibe, setVibe,
        gloveMode, setGloveMode, toggleGloveMode,
        seniorMode, setSeniorMode, toggleSeniorMode,
        reduceMotion, setReduceMotion, toggleReduceMotion,
        visualDemocracy, setVisualDemocracy,
        globalDesign, setGlobalDesign,
        iaiaLevel, setIaiaLevelState,
        blueprintMode, setBlueprintMode,
        accessibilityMode, setAccessibilityMode, toggleAccessibilityMode,
        compactMenus, setCompactMenus, toggleCompactMenus,
        resetToNaturalOrder,
        isDark: theme === 'dark',
        darkMode: theme === 'dark',
        architectMode: blueprintMode,
        asoMode: false,
        toggleAsoMode: () => {},
        hapticService: { trigger: () => {} }
    }), [
        theme, visionMode, vibe, gloveMode, seniorMode, reduceMotion,
        visualDemocracy, globalDesign, iaiaLevel, blueprintMode, accessibilityMode, compactMenus,
        resetToNaturalOrder, setVisionMode, toggleAccessibilityMode, toggleCompactMenus, toggleGloveMode, 
        toggleReduceMotion, toggleSeniorMode, toggleTheme
    ]);

    return (
        <DesignContext.Provider value={value}>
            {children}
        </DesignContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDesign = () => useContext(DesignContext);
