import React, { createContext, useContext, useState, useEffect } from 'react';
import { logger } from '../utils/logger';

const ThemeContext = createContext();

/**
 * PRESETS DE DISSENY [MASTER]
 * Definició de les variables CSS per a cada mode.
 */
export const THEMES = {
    AGRO: {
        id: 'agro',
        name: 'Agro-Brutalista (Sistema Rizoma)',
        variables: {
            '--bg-app': '#FFFCF0',
            '--bg-main': '#FFFFFF',
            '--bg-surface': '#FFFFFF',
            '--text-main': '#000000',
            '--text-secondary': '#1A1A1A',
            '--text-muted': '#404040',
            '--color-primary': '#E65100', // Taronja Terra
            '--color-secondary': '#2E7D32', // Verd Sóc de Poble
            '--color-accent': '#00F2FF', // Teal Tecnològic
            '--glass-panel': 'rgba(255, 255, 255, 0.95)',
            '--glass-blur': '0px',
            '--font-main': "'Inter', system-ui, sans-serif",
            '--font-heading': "'Inter', system-ui, sans-serif",
            '--radius-organic': '0px',
            '--radius-card': '0px',
            '--radius-media': '0px',
            '--border-subtle': '2px solid #000000',
            '--shadow-card': '4px 4px 0px #000000'
        }
    },
    RAINDROP: {
        id: 'raindrop',
        name: 'Raindrop Zen (Neteda)',
        variables: {
            '--bg-app': '#F5F7FA',
            '--bg-main': '#FFFFFF',
            '--bg-surface': '#FFFFFF',
            '--text-main': '#1A1A1A',
            '--text-secondary': '#4A4A4A',
            '--text-muted': '#757575',
            '--color-primary': '#007AFF',
            '--color-secondary': '#34C759',
            '--color-accent': '#5856D6',
            '--glass-panel': 'rgba(255, 255, 255, 0.8)',
            '--glass-blur': 'blur(12px)',
            '--font-main': "'Inter', system-ui, sans-serif",
            '--font-heading': "'Inter', system-ui, sans-serif",
            '--radius-organic': '12px',
            '--radius-card': '8px',
            '--radius-media': '0px', // Directiva Zero Radius
            '--border-subtle': '1px solid #E0E0E0',
            '--shadow-card': '0 1px 3px rgba(0,0,0,0.05)'
        }
    },
    GOOGLE: {
        id: 'google',
        name: 'Google Material (Públic)',
        variables: {
            '--bg-app': '#F8F9FA',
            '--bg-main': '#FFFFFF',
            '--bg-surface': '#E9EEF6',
            '--text-main': '#1F1F1F',
            '--text-secondary': '#444746',
            '--text-muted': '#747775',
            '--color-primary': '#0B57D0',
            '--color-secondary': '#1E8E3E',
            '--color-accent': '#A8C7FA',
            '--glass-panel': '#FFFFFF',
            '--glass-blur': '0px',
            '--font-main': "'Roboto', 'Inter', sans-serif",
            '--font-heading': "'Google Sans', 'Roboto', sans-serif",
            '--radius-organic': '24px',
            '--radius-card': '16px',
            '--radius-media': '0px', // Directiva Zero Radius
            '--border-subtle': '1px solid #DADCE0',
            '--shadow-card': '0 1px 2px rgba(0,0,0,0.3), 0 1px 3px 1px rgba(0,0,0,0.15)'
        }
    },
    FRESCA: {
        id: 'fresca',
        name: 'La Fresca (OLED)',
        variables: {
            '--bg-app': '#000000',
            '--bg-main': '#121212',
            '--bg-surface': '#1A1A1A',
            '--text-main': '#E0E0E0',
            '--text-secondary': '#A0A0A0',
            '--text-muted': '#666666',
            '--color-primary': '#FF6D00',
            '--color-secondary': '#2E7D32',
            '--color-accent': '#00F2FF',
            '--glass-panel': 'rgba(0, 0, 0, 0.8)',
            '--glass-blur': 'blur(10px)',
            '--font-main': "'Inter', system-ui, sans-serif",
            '--font-heading': "'Inter', system-ui, sans-serif",
            '--radius-organic': '4px',
            '--radius-card': '4px',
            '--radius-media': '0px',
            '--border-subtle': '1px solid #333333',
            '--shadow-card': 'none'
        }
    },
    SOLEMNE: {
        id: 'solemne',
        name: 'Sant Gregori (Solemne)',
        variables: {
            '--bg-app': '#F4ECD8',
            '--bg-main': '#F4ECD8',
            '--bg-surface': '#E8DFCA',
            '--text-main': '#3E2723',
            '--text-secondary': '#5D4037',
            '--text-muted': '#A1887F',
            '--color-primary': '#CC5500',
            '--glass-panel': 'rgba(232, 223, 202, 0.7)',
            '--font-main': "'Inter Tight', sans-serif",
            '--font-heading': "'Inter Tight', sans-serif",
            '--radius-organic': '0px',
            '--radius-card': '0px',
            '--radius-media': '0px',
            '--border-subtle': '1px solid rgba(62, 39, 35, 0.1)',
            '--shadow-card': 'none'
        }
    },
    RURAL_V12: {
        id: 'rural_v12',
        name: 'Trellat Rural (V1.2)',
        variables: {
            '--bg-app': '#FDFCF5', // Crema
            '--bg-main': '#FDFCF5',
            '--bg-surface': '#FFFFFF',
            '--text-main': '#1A1C19', // Contrast Extrem
            '--text-secondary': '#454746',
            '--text-muted': '#747775',
            '--color-primary': '#9A6C63', // Argila
            '--color-secondary': '#556B2F', // Verd Serra
            '--color-accent': '#00F2FF', // Pulsació IA (Teal)
            '--md-sys-color-primary': '#9A6C63',
            '--md-sys-color-surface': '#FDFCF5',
            '--md-sys-color-on-surface': '#1A1C19',
            '--glass-panel': 'rgba(255, 255, 255, 0.85)',
            '--glass-blur': 'blur(12px)',
            '--font-main': "'Open Sans', system-ui, sans-serif",
            '--font-heading': "'DM Sans', system-ui, sans-serif",
            '--radius-organic': '16px',
            '--radius-card': '0px',
            '--radius-media': '0px !important',
            '--border-subtle': '1px solid rgba(0,0,0,0.1)',
            '--shadow-card': '0 4px 12px rgba(0,0,0,0.05)'
        }
    }
};

export const ThemeProvider = ({ children }) => {
    // Carreguem el tema de localStorage o usem Solemne com a default
    const [currentThemeId, setCurrentThemeId] = useState(() => {
        return localStorage.getItem('sp_user_theme') || 'solemne';
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
        setCurrentThemeId('solemne');
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
