import { createContext, useContext, useState, useMemo, useCallback } from 'react';

// Separemos el Contexto Central en dos hemisferios (State y Dispatch)
// Esto evita la Explosión de Re-renders ("Context Blast") en toda la app.
const ModalStateContext = createContext();
const ModalDispatchContext = createContext();

export const ModalProvider = ({ children }) => {
    // === ESTADOS Aislados ===
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isNotePadOpen, setIsNotePadOpen] = useState(false);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isMarketModalOpen, setIsMarketModalOpen] = useState(false);
    const [isSocialManagerOpen, setIsSocialManagerOpen] = useState(false);
    const [socialManagerContext, setSocialManagerContext] = useState(null); 
    const [postModalConfig, setPostModalConfig] = useState({ isPrivate: false });
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [viewerConfig, setViewerConfig] = useState(null); 
    const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
    const [connectionConfig, setConnectionConfig] = useState(null); 
    const [isAgentSelectorOpen, setIsAgentSelectorOpen] = useState(false);
    const [agentSelectorConfig, setAgentSelectorConfig] = useState(null); 
    const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
    const [legalConfig, setLegalConfig] = useState(null); 
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editConfig, setEditConfig] = useState(null); 
    const [isMagicPregonerOpen, setIsMagicPregonerOpen] = useState(false);
    const [isGuestInteractionModalOpen, setIsGuestInteractionModalOpen] = useState(false);
    const [isTranslationModalOpen, setIsTranslationModalOpen] = useState(false);
    const [translationConfig, setTranslationConfig] = useState(null); 

    // === FUNCIONES (Dispatch) MemoiZadas ===
    const openTranslationModal = useCallback((config) => {
        setTranslationConfig(config);
        setIsTranslationModalOpen(true);
    }, []);

    const closeTranslationModal = useCallback(() => {
        setIsTranslationModalOpen(false);
        setTranslationConfig(null);
    }, []);

    const openPostModal = useCallback((config = { isPrivate: false }) => {
        setPostModalConfig(config);
        setIsPostModalOpen(true);
    }, []);

    const openViewer = useCallback((config) => {
        setViewerConfig(config);
        setIsViewerOpen(true);
    }, []);

    const closeViewer = useCallback(() => {
        setIsViewerOpen(false);
        setViewerConfig(null);
    }, []);

    const openConnectionModal = useCallback((config) => {
        setConnectionConfig(config);
        setIsConnectionModalOpen(true);
    }, []);

    const closeConnectionModal = useCallback(() => {
        setIsConnectionModalOpen(false);
        setConnectionConfig(null);
    }, []);

    const openAgentSelector = useCallback((config) => {
        setAgentSelectorConfig(config);
        setIsAgentSelectorOpen(true);
    }, []);

    const closeAgentSelector = useCallback(() => {
        setIsAgentSelectorOpen(false);
        setAgentSelectorConfig(null);
    }, []);

    const openLegalModal = useCallback((config) => {
        setLegalConfig(config);
        setIsLegalModalOpen(true);
    }, []);

    const closeLegalModal = useCallback(() => {
        setIsLegalModalOpen(false);
        setLegalConfig(null);
    }, []);

    const openEditModal = useCallback((config) => {
        setEditConfig(config);
        setIsEditModalOpen(true);
    }, []);

    const closeEditModal = useCallback(() => {
        setIsEditModalOpen(false);
        setEditConfig(null);
    }, []);

    // El StateContext cambia si cualquier booleano cambia
    const stateValue = useMemo(() => ({
        isNotePadOpen, isCreateModalOpen, isPostModalOpen, isEventModalOpen, isMarketModalOpen,
        isSocialManagerOpen, socialManagerContext, postModalConfig, isViewerOpen, viewerConfig,
        isConnectionModalOpen, connectionConfig, isAgentSelectorOpen, agentSelectorConfig,
        isLegalModalOpen, legalConfig, isEditModalOpen, editConfig, isMagicPregonerOpen,
        isGuestInteractionModalOpen, isTranslationModalOpen, translationConfig
    }), [
        isNotePadOpen, isCreateModalOpen, isPostModalOpen, isEventModalOpen, isMarketModalOpen,
        isSocialManagerOpen, socialManagerContext, postModalConfig, isViewerOpen, viewerConfig,
        isConnectionModalOpen, connectionConfig, isAgentSelectorOpen, agentSelectorConfig,
        isLegalModalOpen, legalConfig, isEditModalOpen, editConfig, isMagicPregonerOpen,
        isGuestInteractionModalOpen, isTranslationModalOpen, translationConfig
    ]);

    // El DispatchContext casi NUNCA cambia (todo estabilizado por useCallback)
    const dispatchValue = useMemo(() => ({
        setIsNotePadOpen, setIsCreateModalOpen, setIsPostModalOpen, setIsEventModalOpen, setIsMarketModalOpen,
        setIsSocialManagerOpen, setSocialManagerContext, openPostModal, 
        setIsViewerOpen, openViewer, closeViewer, 
        setIsConnectionModalOpen, setConnectionConfig, openConnectionModal, closeConnectionModal,
        setIsAgentSelectorOpen, openAgentSelector, closeAgentSelector,
        setIsLegalModalOpen, openLegalModal, closeLegalModal,
        setIsEditModalOpen, openEditModal, closeEditModal,
        setIsMagicPregonerOpen, setIsGuestInteractionModalOpen,
        setIsTranslationModalOpen, openTranslationModal, closeTranslationModal
    }), [
        openPostModal, openViewer, closeViewer, openConnectionModal, closeConnectionModal,
        openAgentSelector, closeAgentSelector, openLegalModal, closeLegalModal,
        openEditModal, closeEditModal, openTranslationModal, closeTranslationModal
    ]);

    return (
        <ModalStateContext.Provider value={stateValue}>
            <ModalDispatchContext.Provider value={dispatchValue}>
                {children}
            </ModalDispatchContext.Provider>
        </ModalStateContext.Provider>
    );
};

// Hook Optimizado de Solo Lectura (Re-renderiza el componente solo si cambia algún state)
// eslint-disable-next-line react-refresh/only-export-components
export const useModalState = () => {
    const context = useContext(ModalStateContext);
    if (context === undefined) throw new Error('useModalState must be used within a ModalProvider');
    return context;
};

// Hook Optimizado de Solo Escritura (Nunca re-renderiza el componente que lo usa)
// eslint-disable-next-line react-refresh/only-export-components
export const useModalDispatch = () => {
    const context = useContext(ModalDispatchContext);
    if (context === undefined) throw new Error('useModalDispatch must be used within a ModalProvider');
    return context;
};

// Hook Retrocompatible (Cuidado: re-renderiza con CUALQUIER cambio de modal)
// eslint-disable-next-line react-refresh/only-export-components
export const useModal = () => {
    const state = useModalState();
    const dispatch = useModalDispatch();
    return { ...state, ...dispatch };
};
