import { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { preferenceService } from '../../core/services/preferenceService';
import { AGENTS } from '../../constants';

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
    const [prefs] = useState(preferenceService.getPrefs());

    const [landingPage, setLandingPage] = useState(prefs.landingPage || 'mur');
    const [preferredAgentId, setPreferredAgentId] = useState(prefs.preferredAgentId || 'iaia');
    const [enabledAgentIds, setEnabledAgentIdsState] = useState(prefs.enabledAgentIds || AGENTS.map(a => a.id));
    const [iaiaLoreEnabled, setIaiaLoreEnabledState] = useState(prefs.iaiaLoreEnabled !== undefined ? prefs.iaiaLoreEnabled : true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.innerWidth >= 768;
    });

    // Estat per a guardar arxius arrossegats globalment a Sóc de Poble
    const [globalDroppedFile, setGlobalDroppedFile] = useState(null);

    useEffect(() => {
        let rafId = null;
        const handleResize = () => {
            if (rafId) return;
            rafId = requestAnimationFrame(() => {
                const isDesktop = window.innerWidth >= 768;
                setIsDrawerOpen(prev => {
                    if (isDesktop && !prev) return true;
                    if (!isDesktop && prev) return false;
                    return prev;
                });
                rafId = null;
            });
        };
        window.addEventListener('resize', handleResize);
        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const [iaiaSidebarOpen, setIaiaSidebarOpen] = useState(false);
    const [iaiaSidebarContext, setIaiaSidebarContext] = useState('general');
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isAccessibilitatOpen, setIsAccessibilitatOpen] = useState(false);
    const [selectedTown, setSelectedTown] = useState(prefs.selectedTown || 'La Torre de les Maçanes');
    const [chatSettings, setChatSettings] = useState(prefs.chatSettings || { readReceipts: true });
    const [forensicMode, setForensicMode] = useState(false);

    const prefsRef = useRef({
        landingPage, preferredAgentId, enabledAgentIds, iaiaLoreEnabled, selectedTown, chatSettings
    });

    useEffect(() => {
        const currentPrefs = {
            landingPage, preferredAgentId, enabledAgentIds, iaiaLoreEnabled, selectedTown, chatSettings
        };
        if (JSON.stringify(currentPrefs) !== JSON.stringify(prefsRef.current)) {
            prefsRef.current = currentPrefs;
            const timeoutId = setTimeout(() => {
                preferenceService.setPrefs(currentPrefs);
            }, 1000);
            return () => clearTimeout(timeoutId);
        }
    }, [landingPage, preferredAgentId, enabledAgentIds, iaiaLoreEnabled, selectedTown, chatSettings]);

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
        landingPage, setLandingPage, preferredAgentId, setPreferredAgentId,
        enabledAgentIds, setEnabledAgentIdsState, iaiaLoreEnabled, setIaiaLoreEnabledState,
        isDrawerOpen, toggleDrawer, closeDrawer,
        iaiaSidebarOpen, iaiaSidebarContext, openIAIASidebar, closeIAIASidebar,
        isProfileMenuOpen, closeProfileMenu, isAccessibilitatOpen, setIsAccessibilitatOpen,
        selectedTown, setSelectedTown, chatSettings, setChatSettings,
        forensicMode, setForensicMode,
        globalDroppedFile, setGlobalDroppedFile
    }), [
        landingPage, preferredAgentId, enabledAgentIds, iaiaLoreEnabled,
        isDrawerOpen, iaiaSidebarOpen, iaiaSidebarContext, isProfileMenuOpen,
        isAccessibilitatOpen, selectedTown, chatSettings, forensicMode,
        closeDrawer, closeIAIASidebar, closeProfileMenu, openIAIASidebar, toggleDrawer,
        globalDroppedFile
    ]);

    return (
        <NavigationContext.Provider value={value}>
            {children}
        </NavigationContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNavigation = () => useContext(NavigationContext);
