import React, { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = {
    DAY: 'light',
    NIGHT: 'dark'
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Recuperar preferència o defecte a 'dark' (Nit Digital)
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('nexus_theme');
        return savedTheme || 'dark';
    });

    useEffect(() => {
        // Aplicar la classe al body per a les variables CSS
        const root = window.document.documentElement;
        root.classList.remove('theme-light', 'theme-dark');
        root.classList.add(`theme-${theme}`);
        localStorage.setItem('nexus_theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
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
