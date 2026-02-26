import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { preferenceService } from '../services/preferenceService';
import { AGENTS } from '../constants/agents';

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
    const [prefs] = useState(preferenceService.getPrefs());

    const [landingPage, setLandingPage] = useState(prefs.landingPage || 'mur');
    const [preferredAgentId, setPreferredAgentId] = useState(prefs.preferredAgentId || 'iaia');
    const [enabledAgentIds, setEnabledAgentIdsState] = useState(prefs.enabledAgentIds || AGENTS.map(a => a.id));
    const [iaiaLoreEnabled, setIaiaLoreEnabledState] = useState(prefs.iaiaLoreEnabled !== undefined ? prefs.iaiaLoreEnabled : true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(window.innerWidth >= 768);
    const [iaiaSidebarOpen, setIaiaSidebarOpen] = useState(false);
    const [iaiaSidebarContext, setIaiaSidebarContext] = useState('general');
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isAccessibilitatOpen, setIsAccessibilitatOpen] = useState(false);
    const [selectedTown, setSelectedTown] = useState(prefs.selectedTown || 'La Torre de les Maçanes');
    const [chatSettings, setChatSettings] = useState(prefs.chatSettings || { readReceipts: true });
    const [forensicMode, setForensicMode] = useState(false);

    useEffect(() => {
        preferenceService.setPrefs({
            landingPage, preferredAgentId, enabledAgentIds, iaiaLoreEnabled,
            selectedTown, chatSettings
        });
    }, [landingPage, preferredAgentId, enabledAgentIds, iaiaLoreEnabled, selectedTown, chatSettings]);

    const value = useMemo(() => ({
        landingPage, setLandingPage,
        preferredAgentId, setPreferredAgentId,
        enabledAgentIds, setEnabledAgentIdsState,
        iaiaLoreEnabled, setIaiaLoreEnabledState,
        isDrawerOpen, setIsDrawerOpen,
        toggleDrawer: () => setIsDrawerOpen(p => !p),
        closeDrawer: () => window.innerWidth < 768 && setIsDrawerOpen(false),
        iaiaSidebarOpen, setIaiaSidebarOpen,
        openIAIASidebar: (ctx) => { setIaiaSidebarContext(ctx || 'general'); setIaiaSidebarOpen(true); },
        iaiaSidebarContext, setIaiaSidebarContext,
        isProfileMenuOpen, setIsProfileMenuOpen, closeProfileMenu: () => setIsProfileMenuOpen(false),
        isAccessibilitatOpen, setIsAccessibilitatOpen,
        selectedTown, setSelectedTown,
        chatSettings, setChatSettings,
        forensicMode, setForensicMode
    }), [
        landingPage, preferredAgentId, enabledAgentIds, iaiaLoreEnabled, isDrawerOpen, iaiaSidebarOpen, iaiaSidebarContext, isProfileMenuOpen, isAccessibilitatOpen, selectedTown, chatSettings, forensicMode
    ]);

    return (
        <NavigationContext.Provider value={value}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigation = () => useContext(NavigationContext);
