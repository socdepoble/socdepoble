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
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [viewerConfig, setViewerConfig] = useState(null); // { did, anchor, label, type }

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('data-vibe', vibe);
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
            landingPage
        });
    }, [theme, vibe, visionMode, gloveMode, landingPage]);

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
            resetToNaturalOrder
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
