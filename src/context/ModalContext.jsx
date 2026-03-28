import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isNotePadOpen, setIsNotePadOpen] = useState(false);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isMarketModalOpen, setIsMarketModalOpen] = useState(false);
    const [isSocialManagerOpen, setIsSocialManagerOpen] = useState(false);
    const [socialManagerContext, setSocialManagerContext] = useState(null); // { type, id, name }
    const [postModalConfig, setPostModalConfig] = useState({ isPrivate: false });
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
    const [isMagicPregonerOpen, setIsMagicPregonerOpen] = useState(false);
    const [isGuestInteractionModalOpen, setIsGuestInteractionModalOpen] = useState(false);
    const [isTranslationModalOpen, setIsTranslationModalOpen] = useState(false);
    const [translationConfig, setTranslationConfig] = useState(null); // { postId, title }

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

    const value = useMemo(() => ({
        isNotePadOpen, setIsNotePadOpen,
        isCreateModalOpen, setIsCreateModalOpen,
        isPostModalOpen, setIsPostModalOpen,
        isEventModalOpen, setIsEventModalOpen,
        isMarketModalOpen, setIsMarketModalOpen,
        isSocialManagerOpen, setIsSocialManagerOpen,
        socialManagerContext, setSocialManagerContext,
        postModalConfig, openPostModal,
        isViewerOpen, setIsViewerOpen,
        viewerConfig, openViewer, closeViewer,
        isConnectionModalOpen, setIsConnectionModalOpen,
        connectionConfig, setConnectionConfig,
        openConnectionModal, closeConnectionModal,
        isAgentSelectorOpen, setIsAgentSelectorOpen,
        agentSelectorConfig,
        openAgentSelector, closeAgentSelector,
        isLegalModalOpen, setIsLegalModalOpen,
        legalConfig,
        openLegalModal, closeLegalModal,
        isEditModalOpen, setIsEditModalOpen,
        editConfig,
        openEditModal, closeEditModal,
        isMagicPregonerOpen, setIsMagicPregonerOpen,
        isGuestInteractionModalOpen, setIsGuestInteractionModalOpen,
        isTranslationModalOpen, setIsTranslationModalOpen,
        translationConfig, openTranslationModal, closeTranslationModal
    }), [
        isNotePadOpen, isCreateModalOpen, isPostModalOpen, isEventModalOpen, isMarketModalOpen,
        isSocialManagerOpen, socialManagerContext, postModalConfig, isViewerOpen, viewerConfig,
        isConnectionModalOpen, connectionConfig, isAgentSelectorOpen, agentSelectorConfig,
        isLegalModalOpen, legalConfig, isEditModalOpen, editConfig, isMagicPregonerOpen,
        isGuestInteractionModalOpen, isTranslationModalOpen, translationConfig,
        closeAgentSelector, closeConnectionModal, closeEditModal, closeLegalModal, closeViewer, closeTranslationModal,
        openAgentSelector, openConnectionModal, openEditModal, openLegalModal, openPostModal, openViewer, openTranslationModal
    ]);

    return (
        <ModalContext.Provider value={value}>
            {children}
        </ModalContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useModal = () => useContext(ModalContext);
