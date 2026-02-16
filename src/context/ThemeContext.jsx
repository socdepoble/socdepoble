import React, { createContext, useContext, useState, useEffect } from 'react';
import { THEMES } from '../constants';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Recuperar preferència o defecte a 'dark' (Nit Digital)
    const [theme, setThemeState] = useState(() => {
        const savedTheme = localStorage.getItem('nexus_theme');
        return savedTheme || 'light';
    });

    const availableThemes = [
        { id: 'light', name: 'Llum de Dia' },
        { id: 'dark', name: 'Nit Digital' },
        { id: 'solemne', name: 'Perfil Solemne' }
    ];

    useEffect(() => {
        // Aplicar la classe al body per a les variables CSS
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark', 'solemne', 'theme-light', 'theme-dark', 'theme-solemne');
        
        // Apliquem la classe nua per a compatibilitat amb Tailwind/CSS Master
        root.classList.add(theme);
        
        // També mantenim la prefixada per compatibilitat amb components antics
        root.classList.add(`theme-${theme}`);
        
        localStorage.setItem('nexus_theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
    };

    const setTheme = (newTheme) => {
        setThemeState(newTheme);
    };

    const resetTheme = () => {
        setThemeState('dark');
    };

    return (
        <ThemeContext.Provider value={{ 
            theme, 
            toggleTheme, 
            setTheme, 
            resetTheme, 
            availableThemes 
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);

// eslint-disable-next-line react-refresh/only-export-components
export const useThemeCustomizer = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeCustomizer must be used within a ThemeProvider');
    }
    return context;
};
