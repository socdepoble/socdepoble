import React, { createContext, useContext, useState, useEffect } from 'react';
import { logger } from '../utils/logger';

const ThemeContext = createContext();

/**
 * PRESETS DE DISSENY [MASTER]
 * Definició de les variables CSS per a cada mode.
 */
export const THEMES = {
    BATEGA: {
        id: 'batega',
        name: 'Batega Master (Foc i Aigua)',
        variables: {
            '--bg-app': '#FFFFFF', // Clear white base to make orange "sting"
            '--bg-page': '#FFFFFF',
            '--bg-canvas': '#000000',
            '--bg-surface': '#FFFFFF',
            '--bg-card': '#FFFFFF',
            '--text-main': '#000000',
            '--text-secondary': '#121212',
            '--text-muted': '#444444',
            '--color-primary': '#00F2FF', // Cian Elèctric
            '--color-accent': '#FF6D23',  // Taronja Foc
            '--glass-panel': 'rgba(255, 255, 255, 0.95)',
            '--glass-blur': '0px',
            '--radius-organic': '0px',
            '--radius-card': '0px',
            '--border-subtle': '2px solid #000000',
            '--shadow-card': '4px 4px 0px #000000'
        }
    },
    NIT: {
        id: 'nit',
        name: 'Nit del Poble (Contrast Suprem)',
        variables: {
            '--bg-app': '#000000',
            '--bg-page': '#000000',
            '--bg-canvas': '#000000',
            '--bg-surface': '#121212',
            '--bg-card': '#1a1a1a',
            '--text-main': '#FFFFFF',
            '--text-secondary': '#E5E5E5',
            '--text-muted': '#A1A1AA',
            '--color-primary': '#007AFF',
            '--color-accent': '#FF6D23',
            '--glass-panel': 'rgba(0, 0, 0, 0.8)',
            '--glass-blur': 'blur(24px)',
            '--radius-organic': '0px',
            '--radius-card': '0px',
            '--border-subtle': '1px solid #333333',
            '--shadow-card': 'none'
        }
    }
};

export const ThemeProvider = ({ children }) => {
    // Carreguem el tema de localStorage o usem BATEGA com a default
    const [currentThemeId, setCurrentThemeId] = useState(() => {
        return localStorage.getItem('sp_user_theme') || 'batega';
    });

    // Aplicar el tema al :root
    useEffect(() => {
        const theme = Object.values(THEMES).find(t => t.id === currentThemeId) || THEMES.SOLEMNE;

        logger.log(`[ThemeEngine] Aplicant tema sobirà: ${theme.name}`);

        const root = document.documentElement;
        Object.entries(theme.variables).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });

        // Guardar preferència
        localStorage.setItem('sp_user_theme', currentThemeId);

        // Atribut per a selectors CSS si calen
        root.setAttribute('data-user-theme', currentThemeId);
    }, [currentThemeId]);

    const setTheme = (themeId) => {
        if (THEMES[themeId.toUpperCase()] || Object.values(THEMES).find(t => t.id === themeId)) {
            setCurrentThemeId(themeId);
        } else {
            logger.warn(`[ThemeEngine] Intent d'aplicar tema inexistent: ${themeId}`);
        }
    };

    const resetTheme = () => {
        logger.log('[ThemeEngine] Protocol de Pànic: Restaurant disseny original.');
        setCurrentThemeId('batega');
    };

    return (
        <ThemeContext.Provider value={{
            theme: currentThemeId,
            setTheme,
            resetTheme,
            availableThemes: Object.values(THEMES)
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};
