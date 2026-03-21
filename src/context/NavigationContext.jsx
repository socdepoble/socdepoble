import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { preferenceService } from '../services/preferenceService';
import { AGENTS } from '../constants/agents';

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
    const [prefs] = useState(preferenceService.getPrefs());

    const [landingPage, setLandingPage] = useState(prefs.landingPage || 'mur');
    const [preferredAgentId, setPreferredAgentId] = useState(prefs.preferredAgentId || 'iaia');
    const [enabledAgentIds, setEnabledAgentIdsState] = useState(prefs.enabledAgentIds || AGENTS.map(a => a.id));
    const [iaiaLoreEnabled, setIaiaLoreEnabledState] = useState(prefs.iaiaLoreEnabled !== undefined ? prefs.iaiaLoreEnabled : true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(() =>
        typeof window !== 'undefined' ? window.innerWidth >= 768 : false
    );

    useEffect(() => {
        const handleResize = () => {
            const isDesktop = window.innerWidth >= 768;
            setIsDrawerOpen(prev => {
                if (isDesktop && !prev) return true;
                if (!isDesktop && prev) return false;
                return prev;
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const [iaiaSidebarOpen, setIaiaSidebarOpen] = useState(false);
    const [iaiaSidebarContext, setIaiaSidebarContext] = useState('general');
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isAccessibilitatOpen, setIsAccessibilitatOpen] = useState(false);
    const [selectedTown, setSelectedTown] = useState(prefs.selectedTown || 'La Torre de les Maçanes');
    const [chatSettings, setChatSettings] = useState(prefs.chatSettings || { readReceipts: true });
    const [forensicMode, setForensicMode] = useState(false);

    const usePreferencePersistence = (prefs) => {
        const prefsRef = useRef(prefs);
        
        useEffect(() => {
            prefsRef.current = prefs;
        }, [prefs]);
        
        useEffect(() => {
            const timeoutId = setTimeout(() => {
                const current = preferenceService.getPrefs();
                if (JSON.stringify(current) !== JSON.stringify(prefsRef.current)) {
                    preferenceService.setPrefs(prefsRef.current);
                }
            }, 1000); // 1s cooldown to prevent multiple writes
            return () => clearTimeout(timeoutId);
        }, [prefs]);
    };

    usePreferencePersistence({
        landingPage, preferredAgentId, enabledAgentIds, iaiaLoreEnabled,
        selectedTown, chatSettings
    });

    const toggleDrawer = useCallback(() => setIsDrawerOpen(p => !p), []);
    const closeDrawer = useCallback(() => {
        if (window.innerWidth < 768) setIsDrawerOpen(false);
    }, []);
    const openIAIASidebar = useCallback((ctx) => {
        setIaiaSidebarContext(ctx || 'general');
        setIaiaSidebarOpen(true);
    }, []);
    const closeIAIASidebar = useCallback(() => setIaiaSidebarOpen(false), []);
    const closeProfileMenu = useCallback(() => setIsProfileMenuOpen(false), []);

    const value = useMemo(() => ({
        landingPage, setLandingPage,
        preferredAgentId, setPreferredAgentId,
        enabledAgentIds, setEnabledAgentIdsState,
        iaiaLoreEnabled, setIaiaLoreEnabledState,
        isDrawerOpen, setIsDrawerOpen,
        toggleDrawer,
        closeDrawer,
        iaiaSidebarOpen, setIaiaSidebarOpen,
        openIAIASidebar,
        closeIAIASidebar,
        iaiaSidebarContext, setIaiaSidebarContext,
        isProfileMenuOpen, setIsProfileMenuOpen,
        closeProfileMenu,
        isAccessibilitatOpen, setIsAccessibilitatOpen,
        selectedTown, setSelectedTown,
        chatSettings, setChatSettings,
        forensicMode, setForensicMode
    }), [
        landingPage, preferredAgentId, enabledAgentIds, iaiaLoreEnabled, isDrawerOpen, iaiaSidebarOpen, iaiaSidebarContext, isProfileMenuOpen, isAccessibilitatOpen, selectedTown, chatSettings, forensicMode,
        toggleDrawer, closeDrawer, openIAIASidebar, closeIAIASidebar, closeProfileMenu
    ]);

    return (
        <NavigationContext.Provider value={value}>
            {children}
        </NavigationContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNavigation = () => useContext(NavigationContext);
