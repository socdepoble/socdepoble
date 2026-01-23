import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Image as ImageIcon, Send, Loader2, Globe, Lock, Users } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants';
import './CreatePostModal.css';

import EntitySelector from './EntitySelector';

const PREDEFINED_TAGS = ['Esdeveniment', 'Avís', 'Consulta', 'Proposta'];

const CreatePostModal = ({ isOpen, onClose, onPostCreated, isPrivateInitial = false, isPlayground = false }) => {
    const { t } = useTranslation();
    const { profile, user, impersonatedProfile } = useAuth();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    const [privacy, setPrivacy] = useState(isPrivateInitial ? 'groups' : 'public');
    const [selectedIdentity, setSelectedIdentity] = useState({
        id: impersonatedProfile ? impersonatedProfile.id : 'user',
        name: impersonatedProfile ? impersonatedProfile.full_name : (profile?.full_name || 'Jo'),
        type: impersonatedProfile ? impersonatedProfile.role : 'user',
        avatar_url: impersonatedProfile ? impersonatedProfile.avatar_url : profile?.avatar_url
    });

    useEffect(() => {
        if (isOpen) {
            setPrivacy(isPrivateInitial ? 'groups' : 'public');
        }
    }, [isOpen, isPrivateInitial]);

    // Use useEffect for resetting identity when profile/impersonation loads or modal opens
    useEffect(() => {
        if (isOpen) {
            if (impersonatedProfile) {
                setSelectedIdentity({
                    id: impersonatedProfile.id,
                    name: impersonatedProfile.full_name,
                    type: impersonatedProfile.role,
                    avatar_url: impersonatedProfile.avatar_url
                });
            } else if (profile && (selectedIdentity.id === 'user' || !selectedIdentity.id)) {
                setSelectedIdentity({
                    id: 'user',
                    name: profile.full_name || 'Jo',
                    type: 'user',
                    avatar_url: profile.avatar_url
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, profile, impersonatedProfile]);

    if (!isOpen) return null;

    const toggleTag = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        try {
            const newPost = {
                author_user_id: user.id,
                content: content,
                likes: 0,
                comments_count: 0,
                created_at: new Date().toISOString(),
                tags: selectedTags,
                privacy: privacy,
                is_private: privacy !== 'public',

                // Multi-Identidad (Unified identity scheme)
                author_entity_id: selectedIdentity.type !== 'user' ? selectedIdentity.id : null,
                author_role: selectedIdentity.type === 'user' ? ROLES.PEOPLE : selectedIdentity.type,

                // Display fallbacks
                author: selectedIdentity.type === 'user'
                    ? profile.full_name
                    : `${selectedIdentity.name} | ${profile.full_name}`,
                image_url: selectedIdentity.avatar_url
            };

            await supabaseService.createPost(newPost, isPlayground);
            onPostCreated();
            setContent('');
            setSelectedTags([]);
            onClose();
        } catch (error) {
            logger.error('Error creating post:', error);
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
                        <label htmlFor="post-content-textarea" className="sr-only">Contingut de la publicació</label>
                        <textarea
                            id="post-content-textarea"
                            placeholder={t('feed.placeholder')}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="tag-selector-container">
                        <span className="tag-label">Afegir etiquetes:</span>
                        <div className="tag-pills">
                            {PREDEFINED_TAGS.map(tag => (
                                <button
                                    key={tag}
                                    type="button"
                                    className={`tag-pill ${selectedTags.includes(tag) ? 'active' : ''}`}
                                    onClick={() => toggleTag(tag)}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="privacy-selector-container">
                        <span className="tag-label">{t('common.privacy')}:</span>
                        <div className="privacy-options">
                            <button
                                type="button"
                                className={`privacy-btn ${privacy === 'public' ? 'active' : ''}`}
                                onClick={() => setPrivacy('public')}
                            >
                                <Globe size={16} />
                                {t('common.public')}
                            </button>
                            <button
                                type="button"
                                className={`privacy-btn ${privacy === 'groups' ? 'active' : ''}`}
                                onClick={() => setPrivacy('groups')}
                            >
                                <Users size={16} />
                                {t('common.groups')}
                            </button>
                            <button
                                type="button"
                                className={`privacy-btn ${privacy === 'private' ? 'active' : ''}`}
                                onClick={() => setPrivacy('private')}
                            >
                                <Lock size={16} />
                                {t('common.private')}
                            </button>
                        </div>
                    </div>

                    <div className="post-actions">
                        <button type="button" className="icon-btn">
                            <ImageIcon size={20} />
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={!content.trim() || loading}
                            style={{ borderRadius: 'var(--radius-full)' }}
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
