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

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('data-vibe', vibe);
        document.documentElement.setAttribute('data-visual-democracy', visualDemocracy);

        // Apliquem class per a compatibilitat amb CSS tokens
        document.documentElement.classList.remove('theme-pedra-seca', 'theme-oli-suau');
        document.documentElement.classList.add(`theme-${visualDemocracy}`);

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
            visualDemocracy
        });
    }, [theme, vibe, visionMode, gloveMode, landingPage, visualDemocracy]);

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
            }
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
