import { createContext, useContext, useState, useEffect } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isMarketModalOpen, setIsMarketModalOpen] = useState(false);
    const [postModalConfig, setPostModalConfig] = useState({ isPrivate: false });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const openPostModal = (config = { isPrivate: false }) => {
        setPostModalConfig(config);
        setIsPostModalOpen(true);
    };

    return (
        <UIContext.Provider value={{
            theme,
            toggleTheme,
            isCreateModalOpen,
            setIsCreateModalOpen,
            isPostModalOpen,
            setIsPostModalOpen,
            isEventModalOpen,
            setIsEventModalOpen,
            isMarketModalOpen,
            setIsMarketModalOpen,
            postModalConfig,
            openPostModal
        }}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) throw new Error('useUI must be used within a UIProvider');
    return context;
};
