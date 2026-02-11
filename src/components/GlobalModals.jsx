import React from 'react';
import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';
import CreatePostModal from './CreatePostModal';
import AddItemModal from './AddItemModal';
import CreateEventModal from './CreateEventModal';
import SocialManager from './SocialManager';
import ConnectionSelectorModal from './ConnectionSelectorModal';
import AgentSelectorModal from './AgentSelectorModal';
import MediaViewerModal from './MediaViewerModal';
import LegalDocsModal from './LegalDocsModal';
import TallerTrellat from './TallerTrellat';
import IAIARoleSelectorModal from './IAIARoleSelectorModal';
import MagicPregoner from './MagicPregoner';

const GlobalModals = () => {
    const {
        isPostModalOpen,
        setIsPostModalOpen,
        isEventModalOpen,
        setIsEventModalOpen,
        isMarketModalOpen,
        setIsMarketModalOpen,
        isSocialManagerOpen,
        setIsSocialManagerOpen,
        postModalConfig,
        isConnectionModalOpen,
        setIsConnectionModalOpen,
        connectionConfig,
        closeConnectionModal,
        isAgentSelectorOpen,
        closeAgentSelector,
        agentSelectorConfig,
        isViewerOpen,
        closeViewer,
        viewerConfig,
        isLegalModalOpen,
        closeLegalModal,
        legalConfig,
        editConfig,
        isEditModalOpen,
        closeEditModal,
        isTallerOpen,
        setIsTallerOpen,
        isIAIARoleSelectorOpen,
        closeIAIARoleSelector,
        iaiaLevel,
        setIaiaLevel,
        isMagicPregonerOpen,
        setIsMagicPregonerOpen
    } = useUI();
    const { isPlayground } = useAuth();

    // Import ConnectionSelectorModal inside if needed or at top

    const handlePostCreated = () => {
        setIsPostModalOpen(false);
        // Dispatch a global event to refresh any mounted feed
        window.dispatchEvent(new CustomEvent('data-refresh', { detail: { type: 'post' } }));
    };

    const handleEventCreated = () => {
        setIsEventModalOpen(false);
        // Events are also posts in the feed
        window.dispatchEvent(new CustomEvent('data-refresh', { detail: { type: 'post' } }));
    };

    const handleItemCreated = () => {
        setIsMarketModalOpen(false);
        // Dispatch a global event to refresh any mounted market
        window.dispatchEvent(new CustomEvent('data-refresh', { detail: { type: 'market' } }));
    };

    return (
        <>
            {isPostModalOpen && (
                <CreatePostModal
                    isOpen={isPostModalOpen}
                    onClose={() => setIsPostModalOpen(false)}
                    onPostCreated={handlePostCreated}
                    isPrivateInitial={postModalConfig.isPrivate}
                    isPlayground={isPlayground}
                />
            )}

            {isEventModalOpen && (
                <CreateEventModal
                    isOpen={isEventModalOpen}
                    onClose={() => setIsEventModalOpen(false)}
                    onEventCreated={handleEventCreated}
                    isPlayground={isPlayground}
                />
            )}

            {isMarketModalOpen && (
                <AddItemModal
                    isOpen={isMarketModalOpen}
                    onClose={() => setIsMarketModalOpen(false)}
                    onItemCreated={handleItemCreated}
                    isPlayground={isPlayground}
                />
            )}

            {isSocialManagerOpen && (
                <SocialManager
                    isOpen={isSocialManagerOpen}
                    onClose={() => setIsSocialManagerOpen(false)}
                />
            )}

            {isConnectionModalOpen && connectionConfig && (
                <ConnectionSelectorModal
                    isOpen={isConnectionModalOpen}
                    onClose={closeConnectionModal}
                    postId={connectionConfig.postId}
                    currentTags={connectionConfig.currentTags || []}
                    onUpdate={connectionConfig.onUpdate}
                />
            )}

            {isAgentSelectorOpen && agentSelectorConfig && (
                <AgentSelectorModal
                    isOpen={isAgentSelectorOpen}
                    onClose={closeAgentSelector}
                    postId={agentSelectorConfig.postId}
                    authorId={agentSelectorConfig.authorId}
                    context={agentSelectorConfig.context}
                />
            )}

            {isViewerOpen && viewerConfig && (
                <MediaViewerModal
                    isOpen={isViewerOpen}
                    onClose={closeViewer}
                    src={viewerConfig.src}
                    title={viewerConfig.title}
                    type={viewerConfig.type}
                />
            )}

            {isLegalModalOpen && legalConfig && (
                <LegalDocsModal
                    isOpen={isLegalModalOpen}
                    onClose={closeLegalModal}
                    title={legalConfig.title}
                    content={legalConfig.content}
                    type={legalConfig.type}
                />
            )}
            {isEditModalOpen && editConfig && (
                <CreatePostModal
                    isOpen={isEditModalOpen}
                    onClose={closeEditModal}
                    editMode={true}
                    postData={editConfig.postData}
                    onPostCreated={handlePostCreated}
                    isPlayground={isPlayground}
                />
            )}
            {isTallerOpen && (
                <TallerTrellat
                    isOpen={isTallerOpen}
                    onClose={() => setIsTallerOpen(false)}
                />
            )}
            {isIAIARoleSelectorOpen && (
                <IAIARoleSelectorModal
                    isOpen={isIAIARoleSelectorOpen}
                    onClose={closeIAIARoleSelector}
                    currentLevel={iaiaLevel}
                    onSelect={setIaiaLevel}
                />
            )}
            {isMagicPregonerOpen && (
                <MagicPregoner 
                    onClose={() => setIsMagicPregonerOpen(false)} 
                    onContentGenerated={(text) => {
                        window.dispatchEvent(new CustomEvent('magic-text-generated', { detail: { text } }));
                        setIsMagicPregonerOpen(false);
                    }}
                />
            )}
        </>
    );
};

export default GlobalModals;
