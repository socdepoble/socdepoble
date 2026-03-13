import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { preferenceService } from '../services/preferenceService';

const DesignContext = createContext();

export const DesignProvider = ({ children }) => {
    const [prefs] = useState(preferenceService.getPrefs());

    const [theme, setTheme] = useState(prefs.theme);
    const [visionMode, setVisionModeState] = useState(prefs.visionMode || 'immersiva');
    const [vibe, setVibe] = useState(prefs.vibe);
    const [gloveMode, setGloveMode] = useState(prefs.gloveMode);
    const [visualDemocracy, setVisualDemocracy] = useState(prefs.visualDemocracy || 'pedra-seca');
    const [globalDesign, setGlobalDesign] = useState(prefs.globalDesign || 'batega');
    const [iaiaLevel, setIaiaLevelState] = useState(prefs.iaiaLevel !== undefined ? prefs.iaiaLevel : 2);
    const [blueprintMode, setBlueprintMode] = useState(prefs.blueprintMode || false);
    const [accessibilityMode, setAccessibilityMode] = useState(prefs.accessibilityMode || false);

    // Aliases to prevent breaking older hooks during script parse
    const isDark = theme === 'dark';
    const darkMode = theme === 'dark';
    const architectMode = blueprintMode;
    const asoMode = false;
    const toggleAsoMode = useCallback(() => {}, []);
    const hapticService = useMemo(() => ({ trigger: () => {} }), []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
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

        preferenceService.setPrefs({
            theme, vibe, visionMode, gloveMode, visualDemocracy, globalDesign,
            blueprintMode, iaiaLevel, accessibilityMode
        });
    }, [theme, vibe, visionMode, gloveMode, visualDemocracy, globalDesign, blueprintMode, iaiaLevel, accessibilityMode]);

    const toggleTheme = useCallback(() => setTheme(prev => prev === 'light' ? 'dark' : 'light'), []);
    const toggleGloveMode = useCallback(() => setGloveMode(prev => !prev), []);
    const toggleAccessibilityMode = useCallback(() => setAccessibilityMode(p => !p), []);
    const resetToNaturalOrder = useCallback(() => preferenceService.resetToNaturalOrder(), []);
    const setVisionMode = useCallback((mode) => {
        setVisionModeState(mode);
        const levelMap = { 'humana': 0, 'iaia': 1, 'immersiva': 2, 'creativa': 3 };
        if (levelMap[mode] !== undefined) setIaiaLevelState(levelMap[mode]);
    }, []);

    const value = useMemo(() => ({
        theme, setTheme, toggleTheme,
        visionMode, setVisionMode,
        vibe, setVibe,
        gloveMode, setGloveMode, toggleGloveMode,
        visualDemocracy, setVisualDemocracy,
        globalDesign, setGlobalDesign,
        iaiaLevel, setIaiaLevelState,
        blueprintMode, setBlueprintMode,
        accessibilityMode, setAccessibilityMode, toggleAccessibilityMode,
        resetToNaturalOrder,
        isDark, darkMode, architectMode, asoMode, toggleAsoMode, hapticService
    }), [
        theme, visionMode, vibe, gloveMode, visualDemocracy, globalDesign,
        iaiaLevel, blueprintMode, accessibilityMode,
        toggleTheme, setVisionMode, toggleGloveMode, toggleAccessibilityMode, resetToNaturalOrder,
        toggleAsoMode, hapticService
    ]);

    return (
        <DesignContext.Provider value={value}>
            {children}
        </DesignContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDesign = () => useContext(DesignContext);
