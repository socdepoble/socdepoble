import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Image as ImageIcon, Send, Loader2 } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAppContext } from '../context/AppContext';
import './CreatePostModal.css';

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
    const { t } = useTranslation();
    const { profile, user } = useAppContext();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        try {
            const newPost = {
                author: profile?.full_name || 'Usuari',
                avatar_type: profile?.role === 'admin' ? 'gov' : 'user',
                content: content,
                likes: 0,
                comments_count: 0,
                created_at: new Date().toISOString()
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
