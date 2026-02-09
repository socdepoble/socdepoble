import React, { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = {
    DAY: 'light',
    NIGHT: 'dark',
    SOLEMNE: 'solemne'
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Recuperar preferència o defecte a 'dark' (Nit Digital)
    const [theme, setThemeState] = useState(() => {
        const savedTheme = localStorage.getItem('nexus_theme');
        return savedTheme || 'dark';
    });

    const availableThemes = [
        { id: 'light', name: 'Llum de Dia' },
        { id: 'dark', name: 'Nit Digital' },
        { id: 'solemne', name: 'Perfil Solemne' }
    ];

    useEffect(() => {
        // Aplicar la classe al body per a les variables CSS
        const root = window.document.documentElement;
        root.classList.remove('theme-light', 'theme-dark', 'theme-solemne');
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

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
