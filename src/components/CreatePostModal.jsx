import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Image as ImageIcon, Send, Loader2 } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAppContext } from '../context/AppContext';
import './CreatePostModal.css';

import EntitySelector from './EntitySelector';

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
    const { t } = useTranslation();
    const { profile, user } = useAppContext();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedIdentity, setSelectedIdentity] = useState({
        id: 'user',
        name: profile?.full_name || 'Jo',
        type: 'user',
        avatar_url: profile?.avatar_url
    });

    // Use useEffect for resetting identity when profile loads or modal opens
    useEffect(() => {
        if (isOpen && profile && selectedIdentity.id === 'user') {
            setSelectedIdentity({
                id: 'user',
                name: profile.full_name || 'Jo',
                type: 'user',
                avatar_url: profile.avatar_url
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, profile]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        try {
            const newPost = {
                author_id: user.id,
                content: content,
                likes: 0,
                comments_count: 0,
                created_at: new Date().toISOString(),

                // Multi-Identidad
                author_type: selectedIdentity.type === 'user' ? 'user' : 'entity',
                author_entity_id: selectedIdentity.type !== 'user' ? selectedIdentity.id : null,
                author_role: selectedIdentity.type === 'user' ? 'gent' : selectedIdentity.type,

                // Legacy / Display fallbacks
                author: selectedIdentity.name,
                avatar_type: selectedIdentity.type === 'user' ? (profile?.role === 'admin' ? 'gov' : 'user') : selectedIdentity.type,
                image_url: selectedIdentity.avatar_url
            };

            await supabaseService.createPost(newPost);
            onPostCreated();
            setContent('');
            onClose();
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Error al publicar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <header className="modal-header">
                    <h2>{t('feed.title')}</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </header>

                <form onSubmit={handleSubmit}>
                    <div className="post-input-container">
                        <EntitySelector
                            currentIdentity={selectedIdentity}
                            onSelectIdentity={setSelectedIdentity}
                        />
                        <textarea
                            placeholder={t('feed.placeholder')}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="post-actions">
                        <button type="button" className="icon-btn">
                            <ImageIcon size={20} />
                        </button>
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={!content.trim() || loading}
                        >
                            {loading ? <Loader2 className="spinner" /> : <Send size={20} />}
                            {t('common.send')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePostModal;
