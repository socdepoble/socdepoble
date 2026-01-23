import React from 'react';
import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';
import CreatePostModal from './CreatePostModal';
import AddItemModal from './AddItemModal';
import CreateEventModal from './CreateEventModal';
import SocialManager from './SocialManager';

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
        postModalConfig
    } = useUI();
    const { isPlayground } = useAuth();

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
        </>
    );
};

export default GlobalModals;
