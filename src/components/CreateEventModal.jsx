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
                        <Calendar size={20} className="accent-icon" style={{ color: 'var(--color-primary)', marginRight: '8px' }} />
                        <h2>{t('events.create_title') || 'Crear Esdeveniment'}</h2>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="post-form-compact">
                    <div className="post-identity-bar">
                        <EntitySelector
                            currentIdentity={selectedIdentity}
                            onSelectIdentity={setSelectedIdentity}
                            mini={true}
                        />
                        <div className="post-privacy-mini">
                            <button
                                type="button"
                                className={`privacy-toggle ${privacy}`}
                                onClick={() => {
                                    const flow = ['public', 'groups', 'private'];
                                    const next = flow[(flow.indexOf(privacy) + 1) % 3];
                                    setPrivacy(next);
                                }}
                                title={t(`common.${privacy}`)}
                            >
                                {privacy === 'public' ? <Globe size={18} /> :
                                    privacy === 'groups' ? <Users size={18} /> : <Lock size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="post-content-area">
                        <textarea
                            id="event-content-input"
                            placeholder={t('events.placeholder') || 'Explica de què tracta l\'esdeveniment...'}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="post-footer-tools">
                        <div className="tools-left">
                            <button type="button" className="tool-btn">
                                <ImageIcon size={20} />
                            </button>
                            <div className="tag-scroller">
                                <button
                                    type="button"
                                    className="tag-pill-mini active"
                                    disabled
                                >
                                    {t('common.event') || 'Esdeveniment'}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-send-round"
                            disabled={!content.trim() || loading}
                        >
                            {loading ? <Loader2 className="spinner" size={20} /> : <Send size={20} />}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEventModal;
