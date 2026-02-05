import { createContext, useContext, useState, useEffect } from 'react';
import { preferenceService } from '../services/preferenceService';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
    const [prefs, setPrefsState] = useState(preferenceService.getPrefs());

    const [theme, setTheme] = useState(prefs.theme);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isMarketModalOpen, setIsMarketModalOpen] = useState(false);
    const [isSocialManagerOpen, setIsSocialManagerOpen] = useState(false);
    const [socialManagerContext, setSocialManagerContext] = useState(null); // { type, id, name }
    const [postModalConfig, setPostModalConfig] = useState({ isPrivate: false });
    const [visionMode, setVisionMode] = useState(prefs.visionMode);
    const [vibe, setVibe] = useState(prefs.vibe);
    const [gloveMode, setGloveMode] = useState(prefs.gloveMode);
    const [landingPage, setLandingPage] = useState(prefs.landingPage);
    const [visualDemocracy, setVisualDemocracy] = useState(prefs.visualDemocracy || 'pedra-seca');
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

    // [MASTER GENT] Lògica de Poble-Nodo (Cyber-Rural)
    const [selectedTown, setSelectedTown] = useState(prefs.selectedTown || 'La Torre de les Maçanes');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('data-vibe', vibe);
        document.documentElement.setAttribute('data-visual-democracy', visualDemocracy);

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
            selectedTown
        });
    }, [theme, vibe, visionMode, gloveMode, landingPage, visualDemocracy, selectedTown]);

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
            selectedTown,
            setSelectedTown
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
