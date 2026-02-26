import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
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
    const toggleAsoMode = () => {};
    const hapticService = { trigger: () => {} };

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
        const activeClass = visualDemocracy === 'pedra-seca' ? 'theme-pedra-seca' : 'theme-oli-suau';
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

    const value = useMemo(() => ({
        theme, setTheme, toggleTheme: () => setTheme(prev => prev === 'light' ? 'dark' : 'light'),
        visionMode, setVisionMode: (mode) => {
            setVisionModeState(mode);
            const levelMap = { 'humana': 0, 'iaia': 1, 'immersiva': 2, 'creativa': 3 };
            if (levelMap[mode] !== undefined) setIaiaLevelState(levelMap[mode]);
        },
        vibe, setVibe,
        gloveMode, setGloveMode, toggleGloveMode: () => setGloveMode(prev => !prev),
        visualDemocracy, setVisualDemocracy,
        globalDesign, setGlobalDesign,
        iaiaLevel, setIaiaLevelState,
        blueprintMode, setBlueprintMode,
        accessibilityMode, setAccessibilityMode, toggleAccessibilityMode: () => setAccessibilityMode(p => !p),
        resetToNaturalOrder: () => preferenceService.resetToNaturalOrder(),
        isDark, darkMode, architectMode, asoMode, toggleAsoMode, hapticService
    }), [
        theme, visionMode, vibe, gloveMode, visualDemocracy, globalDesign, iaiaLevel, blueprintMode, accessibilityMode, isDark, darkMode, architectMode
    ]);

    return (
        <DesignContext.Provider value={value}>
            {children}
        </DesignContext.Provider>
    );
};

export const useDesign = () => useContext(DesignContext);
