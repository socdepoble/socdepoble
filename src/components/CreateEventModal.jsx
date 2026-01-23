import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Image as ImageIcon, Send, Loader2, Globe, Lock, Users, Calendar } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants';
import { logger } from '../utils/logger';
import './CreatePostModal.css'; // Reusing post modal styles for consistency

import EntitySelector from './EntitySelector';

const CreateEventModal = ({ isOpen, onClose, onEventCreated, isPlayground = false }) => {
    const { t } = useTranslation();
    const { profile, user, impersonatedProfile } = useAuth();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedTags, setSelectedTags] = useState(['Esdeveniment']);
    const [privacy, setPrivacy] = useState('public');
    const [selectedIdentity, setSelectedIdentity] = useState({
        id: impersonatedProfile ? impersonatedProfile.id : 'user',
        name: impersonatedProfile ? impersonatedProfile.full_name : (profile?.full_name || 'Jo'),
        type: impersonatedProfile ? impersonatedProfile.role : 'user',
        avatar_url: impersonatedProfile ? impersonatedProfile.avatar_url : profile?.avatar_url
    });

    useEffect(() => {
        if (isOpen) {
            if (impersonatedProfile) {
                setSelectedIdentity({
                    id: impersonatedProfile.id,
                    name: impersonatedProfile.full_name,
                    type: impersonatedProfile.role,
                    avatar_url: impersonatedProfile.avatar_url
                });
            } else if (profile) {
                setSelectedIdentity({
                    id: 'user',
                    name: profile.full_name || 'Jo',
                    type: 'user',
                    avatar_url: profile.avatar_url
                });
            }
        }
    }, [isOpen, profile, impersonatedProfile]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() || loading) return;

        setLoading(true);
        try {
            const newEvent = {
                content: content,
                likes: 0,
                comments_count: 0,
                created_at: new Date().toISOString(),
                tags: selectedTags,
                privacy: privacy,
                is_private: privacy !== 'public',

                // Schema compatibility
                author_id: user.id,
                author_name: selectedIdentity.type === 'user'
                    ? profile.full_name
                    : `${selectedIdentity.name} | ${profile.full_name}`,
                author_avatar_url: selectedIdentity.avatar_url,

                author_entity_id: selectedIdentity.type !== 'user' ? selectedIdentity.id : null,
                author_role: selectedIdentity.type === 'user' ? ROLES.PEOPLE : selectedIdentity.type,
                image_url: null
            };

            await supabaseService.createPost(newEvent, isPlayground);
            onEventCreated();
            setContent('');
            onClose();
        } catch (error) {
            logger.error('Error creating event:', error);
            alert('Error al publicar l\'esdeveniment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <header className="modal-header">
                    <div className="title-with-icon">
                        <Calendar size={24} className="accent-icon" />
                        <h2>{t('events.create_title') || 'Crear Esdeveniment'}</h2>
                    </div>
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
                        <label htmlFor="event-content-input" className="sr-only">Contingut de l'esdeveniment</label>
                        <textarea
                            id="event-content-input"
                            placeholder={t('events.placeholder') || 'Explica de què tracta l\'esdeveniment...'}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            autoFocus
                        />
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
                            {t('common.publish') || 'Publicar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEventModal;
