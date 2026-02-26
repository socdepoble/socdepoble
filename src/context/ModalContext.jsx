import React, { createContext, useContext, useState, useMemo } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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
        openConnectionModal: (config) => {
            setConnectionConfig(config);
            setIsConnectionModalOpen(true);
        },
        closeConnectionModal: () => {
            setIsConnectionModalOpen(false);
            setConnectionConfig(null);
        },
        isAgentSelectorOpen, setIsAgentSelectorOpen,
        agentSelectorConfig,
        openAgentSelector: (config) => {
            setAgentSelectorConfig(config);
            setIsAgentSelectorOpen(true);
        },
        closeAgentSelector: () => {
            setIsAgentSelectorOpen(false);
            setAgentSelectorConfig(null);
        },
        isLegalModalOpen, setIsLegalModalOpen,
        legalConfig,
        openLegalModal: (config) => {
            setLegalConfig(config);
            setIsLegalModalOpen(true);
        },
        closeLegalModal: () => {
            setIsLegalModalOpen(false);
            setLegalConfig(null);
        },
        isEditModalOpen, setIsEditModalOpen,
        editConfig,
        openEditModal: (config) => {
            setEditConfig(config);
            setIsEditModalOpen(true);
        },
        closeEditModal: () => {
            setIsEditModalOpen(false);
            setEditConfig(null);
        },
        isMagicPregonerOpen, setIsMagicPregonerOpen,
        isGuestInteractionModalOpen, setIsGuestInteractionModalOpen
    }), [
        isCreateModalOpen, isPostModalOpen, isEventModalOpen, isMarketModalOpen,
        isSocialManagerOpen, socialManagerContext, postModalConfig, isViewerOpen, viewerConfig,
        isConnectionModalOpen, connectionConfig, isAgentSelectorOpen, agentSelectorConfig,
        isLegalModalOpen, legalConfig, isEditModalOpen, editConfig, isMagicPregonerOpen,
        isGuestInteractionModalOpen
    ]);

    return (
        <ModalContext.Provider value={value}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => useContext(ModalContext);
