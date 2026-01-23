import React from 'react';
import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';
import CreatePostModal from './CreatePostModal';
import AddItemModal from './AddItemModal';

const GlobalModals = () => {
    const {
        isPostModalOpen,
        setIsPostModalOpen,
        isMarketModalOpen,
        setIsMarketModalOpen,
        postModalConfig
    } = useUI();
    const { isPlayground } = useAuth();

    const handlePostCreated = () => {
        setIsPostModalOpen(false);
        // Dispatch a global event to refresh any mounted feed
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

            {isMarketModalOpen && (
                <AddItemModal
                    isOpen={isMarketModalOpen}
                    onClose={() => setIsMarketModalOpen(false)}
                    onItemCreated={handleItemCreated}
                    isPlayground={isPlayground}
                />
            )}
        </>
    );
};

export default GlobalModals;
