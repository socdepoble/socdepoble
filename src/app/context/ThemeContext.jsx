import { createContext, useContext } from 'react';
import { useDesign } from './DesignContext';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const { theme, setTheme, toggleTheme, visualDemocracy, setVisualDemocracy } = useDesign();

    const availableThemes = [
        { id: 'pedra-seca', name: 'Pedra Seca (Bàsic)' },
        { id: 'oli-suau', name: 'Oli Suau (Terrenal)' },
        { id: 'gem-modern', name: 'Pedra Seca (Net)' }
    ];

    const resetTheme = () => {
        setTheme('light');
        setVisualDemocracy('pedra-seca');
    };

    return (
        <ThemeContext.Provider value={{ 
            theme, 
            toggleTheme, 
            setTheme, 
            resetTheme, 
            availableThemes,
            visualDemocracy,
            setVisualDemocracy
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);


