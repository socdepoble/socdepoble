import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { preferenceService } from '../services/preferenceService';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
    const [prefs] = useState(preferenceService.getPrefs());

    const [theme, setTheme] = useState(prefs.theme);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isMarketModalOpen, setIsMarketModalOpen] = useState(false);
    const [isSocialManagerOpen, setIsSocialManagerOpen] = useState(false);
    const [socialManagerContext, setSocialManagerContext] = useState(null); // { type, id, name }
    const [postModalConfig, setPostModalConfig] = useState({ isPrivate: false });
    const [visionMode, setVisionMode] = useState(prefs.visionMode || 'hibrida');
    const [vibe, setVibe] = useState(prefs.vibe);
    const [gloveMode, setGloveMode] = useState(prefs.gloveMode);
    const [landingPage, setLandingPage] = useState(prefs.landingPage);
    const [visualDemocracy, setVisualDemocracy] = useState(prefs.visualDemocracy || 'pedra-seca');
    const [globalDesign, setGlobalDesign] = useState(prefs.globalDesign || 'batega');
    const [preferredAgentId, setPreferredAgentId] = useState(prefs.preferredAgentId || 'iaia');
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [viewerConfig, setViewerConfig] = useState(null); // { did, anchor, label, type }
    const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
    const [connectionConfig, setConnectionConfig] = useState(null); // { postId, currentTags, onUpdate }
    const [isAgentSelectorOpen, setIsAgentSelectorOpen] = useState(false);
    const [agentSelectorConfig, setAgentSelectorConfig] = useState(null); // { postId, authorId, context }
    const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
    const [legalConfig, setLegalConfig] = useState(null); // { title, content, type }
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editConfig, setEditConfig] = useState(null); // { postData, onUpdate }
    const [asoMode, setAsoMode] = useState(false);
    const [isTallerOpen, setIsTallerOpen] = useState(false);
    const [isNotePadOpen, setIsNotePadOpen] = useState(false);
    const [isIAIARoleSelectorOpen, setIsIAIARoleSelectorOpen] = useState(false);
    const [iaiaLevel, setIaiaLevel] = useState(prefs.iaiaLevel || 0);
    const [architectMode, setArchitectMode] = useState(false);
    const [isMagicPregonerOpen, setIsMagicPregonerOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [forensicMode, setForensicMode] = useState(false);
    const [blueprintMode, setBlueprintMode] = useState(prefs.blueprintMode || false);
    const [isGuestInteractionModalOpen, setIsGuestInteractionModalOpen] = useState(false);
    const [iaiaSidebarOpen, setIaiaSidebarOpen] = useState(false);
    const [iaiaSidebarContext, setIaiaSidebarContext] = useState('general');
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isAccessibilitatOpen, setIsAccessibilitatOpen] = useState(false);
    const [chatSettings, setChatSettings] = useState(prefs.chatSettings || { readReceipts: true });

    // [MASTER GENT] Lògica de Poble-Nodo (Cyber-Rural)
    const [selectedTown, setSelectedTown] = useState(prefs.selectedTown || 'La Torre de les Maçanes');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('data-vibe', vibe);
        document.documentElement.setAttribute('data-visual-democracy', visualDemocracy);
        document.documentElement.setAttribute('data-design', globalDesign);

        if (globalDesign === 'consola') {
            document.body.classList.add('design-consola');
        } else {
            document.body.classList.remove('design-consola');
        }

        // [MASTER THEME SYNC] Apliquem classes de tema de manera neta
        // Purguem totes les possibles classes de tema anteriors
        const themeClasses = ['theme-pedra-seca', 'theme-oli-suau', 'theme-gem-modern'];
        document.documentElement.classList.remove(...themeClasses);

        // Apliquem la classe activa (oli-suau és el nou estàndard Gem)
        const activeClass = visualDemocracy === 'pedra-seca' ? 'theme-pedra-seca' : 'theme-oli-suau';
        document.documentElement.classList.add(activeClass);

        if (gloveMode) {
            document.body.classList.add('mode-guants');
        } else {
            document.body.classList.remove('mode-guants');
        }

        // Sincronitzar amb el servei
        preferenceService.setPrefs({
            theme,
            vibe,
            visionMode,
            gloveMode,
            landingPage,
            visualDemocracy,
            globalDesign,
            selectedTown,
            preferredAgentId,
            blueprintMode,
            chatSettings
        });
    }, [theme, vibe, visionMode, gloveMode, landingPage, visualDemocracy, globalDesign, selectedTown, preferredAgentId, blueprintMode, chatSettings]);

    const resetToNaturalOrder = () => {
        preferenceService.resetToNaturalOrder();
    };

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const openPostModal = (config = { isPrivate: false }) => {
        setPostModalConfig(config);
        setIsPostModalOpen(true);
    };

    const openViewer = (config) => {
        setViewerConfig(config);
        setIsViewerOpen(true);
    };

    const closeViewer = () => {
        setIsViewerOpen(false);
        setViewerConfig(null);
    };


    const value = useMemo(() => ({
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
        isSocialManagerOpen,
        setIsSocialManagerOpen,
        socialManagerContext,
        setSocialManagerContext,
        postModalConfig,
        openPostModal,
        visionMode,
        setVisionMode,
        vibe,
        setVibe,
        gloveMode,
        setGloveMode,
        toggleGloveMode: () => setGloveMode(prev => !prev),
        isViewerOpen,
        setIsViewerOpen,
        viewerConfig,
        openViewer,
        closeViewer,
        landingPage,
        setLandingPage,
        visualDemocracy,
        setVisualDemocracy,
        globalDesign,
        setGlobalDesign,
        resetToNaturalOrder,
        isConnectionModalOpen,
        setIsConnectionModalOpen,
        connectionConfig,
        setConnectionConfig,
        openConnectionModal: (config) => {
            setConnectionConfig(config);
            setIsConnectionModalOpen(true);
        },
        closeConnectionModal: () => {
            setIsConnectionModalOpen(false);
            setConnectionConfig(null);
        },
        isAgentSelectorOpen,
        setIsAgentSelectorOpen,
        agentSelectorConfig,
        openAgentSelector: (config) => {
            setAgentSelectorConfig(config);
            setIsAgentSelectorOpen(true);
        },
        closeAgentSelector: () => {
            setIsAgentSelectorOpen(false);
            setAgentSelectorConfig(null);
        },
        isLegalModalOpen,
        setIsLegalModalOpen,
        legalConfig,
        openLegalModal: (config) => {
            setLegalConfig(config);
            setIsLegalModalOpen(true);
        },
        closeLegalModal: () => {
            setIsLegalModalOpen(false);
            setLegalConfig(null);
        },
        isEditModalOpen,
        setIsEditModalOpen,
        editConfig,
        openEditModal: (config) => {
            setEditConfig(config);
            setIsEditModalOpen(true);
        },
        closeEditModal: () => {
            setIsEditModalOpen(false);
            setEditConfig(null);
        },
        asoMode,
        setAsoMode,
        toggleAsoMode: () => setAsoMode(prev => !prev),
        isTallerOpen,
        setIsTallerOpen,
        isNotePadOpen,
        setIsNotePadOpen,
        isIAIARoleSelectorOpen,
        setIsIAIARoleSelectorOpen,
        iaiaLevel,
        setIaiaLevel: (level) => {
            setIaiaLevel(level);
            preferenceService.setPrefs({ ...preferenceService.getPrefs(), iaiaLevel: level });
        },
        architectMode,
        setArchitectMode,
        toggleArchitectMode: () => setArchitectMode(prev => !prev),
        openIAIARoleSelector: () => setIsIAIARoleSelectorOpen(true),
        closeIAIARoleSelector: () => setIsIAIARoleSelectorOpen(false),
        selectedTown,
        setSelectedTown,
        preferredAgentId,
        setPreferredAgentId,
        isMagicPregonerOpen,
        setIsMagicPregonerOpen,
        isDrawerOpen,
        setIsDrawerOpen,
        toggleDrawer: () => setIsDrawerOpen(prev => !prev),
        closeDrawer: () => setIsDrawerOpen(false),
        openDrawer: () => setIsDrawerOpen(true),
        forensicMode,
        setForensicMode,
        toggleForensicMode: () => setForensicMode(prev => !prev),
        blueprintMode,
        setBlueprintMode,
        toggleBlueprintMode: () => setBlueprintMode(prev => !prev),
        isGuestInteractionModalOpen,
        setIsGuestInteractionModalOpen,
        iaiaSidebarOpen,
        setIaiaSidebarOpen,
        iaiaSidebarContext,
        setIaiaSidebarContext,
        toggleIAIASidebar: () => setIaiaSidebarOpen(prev => !prev),
        openIAIASidebar: (ctx = 'general') => {
            setIaiaSidebarContext(ctx);
            setIaiaSidebarOpen(true);
        },
        closeIAIASidebar: () => setIaiaSidebarOpen(false),
        isProfileMenuOpen,
        setIsProfileMenuOpen,
        toggleProfileMenu: () => setIsProfileMenuOpen(prev => !prev),
        openProfileMenu: () => setIsProfileMenuOpen(true),
        closeProfileMenu: () => setIsProfileMenuOpen(false),
        isAccessibilitatOpen,
        setIsAccessibilitatOpen,
        toggleAccessibilitat: () => setIsAccessibilitatOpen(prev => !prev),
        chatSettings,
        setChatSettings,
        toggleReadReceipts: () => setChatSettings(prev => ({ ...prev, readReceipts: !prev.readReceipts }))
    }), [
        theme, isCreateModalOpen, isPostModalOpen, isEventModalOpen, isMarketModalOpen, 
        isSocialManagerOpen, socialManagerContext, postModalConfig, visionMode, vibe, 
        gloveMode, isViewerOpen, viewerConfig, landingPage, visualDemocracy, globalDesign, 
        isConnectionModalOpen, connectionConfig, isAgentSelectorOpen, agentSelectorConfig, 
        isLegalModalOpen, legalConfig, isEditModalOpen, editConfig, asoMode, 
        isTallerOpen, isNotePadOpen, isIAIARoleSelectorOpen, iaiaLevel, architectMode, 
        selectedTown, preferredAgentId, isMagicPregonerOpen, isDrawerOpen, forensicMode, 
        blueprintMode, isGuestInteractionModalOpen, iaiaSidebarOpen, iaiaSidebarContext, 
        isProfileMenuOpen, isAccessibilitatOpen, chatSettings
    ]);
    return (
        <UIContext.Provider value={value}>
            {children}
        </UIContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) {
        // [MASTER BLINDATGE] Retornem valors per defecte de seguretat si el context no és llest
        return {
            isViewerOpen: false,
            visionMode: 'hibrida',
            globalDesign: 'standard',
            setGlobalDesign: () => { },
            setVisionMode: () => { },
            selectedTownData: null,
            setSelectedTownData: () => { }
        };
    }
    return context;
};
