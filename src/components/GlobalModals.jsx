import React, { useRef, useEffect } from 'react';
// ... (imports are kept untouched from line 1 of actual file since we replace from 22)
import { useModalState, useModalDispatch } from '../context/ModalContext';
import { useAuth } from '../context/AuthContext';
import Portal from './Portal';
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
import CreationHub from './CreationHub';
import GuestInteractionModal from './GuestInteractionModal';
import { useModalFocusTrap } from '../hooks/useModalFocusTrap';

const GlobalModals = () => {
    const { isCreateModalOpen, isPostModalOpen, isEventModalOpen, isMarketModalOpen, isSocialManagerOpen, postModalConfig, isConnectionModalOpen, connectionConfig, isAgentSelectorOpen, agentSelectorConfig, isViewerOpen, viewerConfig, isLegalModalOpen, legalConfig, editConfig, isEditModalOpen, isMagicPregonerOpen } = useModalState();
    
    const { setIsPostModalOpen, setIsEventModalOpen, setIsMarketModalOpen, setIsSocialManagerOpen, closeConnectionModal, closeAgentSelector, closeViewer, closeLegalModal, closeEditModal, setIsMagicPregonerOpen } = useModalDispatch();
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

    const isAnyModalOpen = isPostModalOpen || isEventModalOpen || isMarketModalOpen || isSocialManagerOpen || isConnectionModalOpen || isAgentSelectorOpen || isViewerOpen || isLegalModalOpen || isEditModalOpen || isMagicPregonerOpen || isCreateModalOpen;

    useEffect(() => {
        if (isAnyModalOpen) {
            document.body.style.overflow = 'hidden';
            // Also prevent mobile pull-to-refresh / scroll bounce issues when modal is open
            document.body.style.touchAction = 'none';
        } else {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        }

        return () => {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        };
    }, [isAnyModalOpen]);

    const closeAnyModal = () => {
        if (isPostModalOpen) setIsPostModalOpen(false);
        else if (isEventModalOpen) setIsEventModalOpen(false);
        else if (isMarketModalOpen) setIsMarketModalOpen(false);
        else if (isSocialManagerOpen) setIsSocialManagerOpen(false);
        else if (isConnectionModalOpen) closeConnectionModal();
        else if (isAgentSelectorOpen) closeAgentSelector();
        else if (isViewerOpen) closeViewer();
        else if (isLegalModalOpen) closeLegalModal();
        else if (isEditModalOpen) closeEditModal();
        else if (isMagicPregonerOpen) setIsMagicPregonerOpen(false);
        // isCreateModalOpen naturally bubbles context or we let it live.
    };

    const portalRef = useRef(null);

    useModalFocusTrap(isAnyModalOpen, closeAnyModal, portalRef);

    return (
        <Portal>
            <div ref={portalRef} tabIndex="-1" className="outline-none contents">
            <CreatePostModal
                isOpen={isPostModalOpen}
                onClose={() => setIsPostModalOpen(false)}
                onPostCreated={handlePostCreated}
                isPrivateInitial={postModalConfig?.isPrivate}
                initialFile={postModalConfig?.initialFile}
                isPlayground={isPlayground}
            />

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
            <CreatePostModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                editMode={true}
                postData={editConfig?.postData}
                onPostCreated={handlePostCreated}
                isPlayground={isPlayground}
            />

            {isMagicPregonerOpen && (
                <MagicPregoner 
                    onClose={() => setIsMagicPregonerOpen(false)} 
                    onContentGenerated={(text) => {
                        window.dispatchEvent(new CustomEvent('magic-text-generated', { detail: { text } }));
                        setIsMagicPregonerOpen(false);
                    }}
                />
            )}
            {isCreateModalOpen && <CreationHub />}
            </div>
        </Portal>
    );
};

export default React.memo(GlobalModals);
