import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Send, Loader2, Globe, Lock, Users, BookOpen, MessageSquare, Sparkles, Camera, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabaseService } from '../services/supabaseService';
import { hapticService } from '../services/hapticService';
import { iaiaService } from '../services/iaiaService';
import { logger } from '../utils/logger';
import { getRandomProverb } from '../data/proverbs';
import CaptureStudio from './CaptureStudio';
import './CreatePostModal.css';

const PREDEFINED_TAGS = ['Esdeveniment', 'Avís', 'Consulta', 'Proposta'];

const CreatePostModal = ({ isOpen, onClose, initialPobles = [] }) => {
    const { user, profile } = useAuth();
    const [content, setContent] = useState('');
    const [selectedIdentity, setSelectedIdentity] = useState('user');
    const [selectedTowns, setSelectedTowns] = useState(initialPobles);
    const [isPlayground, setIsPlayground] = useState(false);
    const [loading, setLoading] = useState(false);
    const [entities, setEntities] = useState([]);
    const [postType, setPostType] = useState('post');
    const [bookTitle, setBookTitle] = useState('');
    const [chapterNumber, setChapterNumber] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [multimediaPreview, setMultimediaPreview] = useState(null);
    const [multimediaFile, setMultimediaFile] = useState(null);
    const [iaiaAnalyzing, setIaiaAnalyzing] = useState(false);
    const [isCaptureOpen, setIsCaptureOpen] = useState(false);

    useEffect(() => {
        if (isOpen && user) {
            hapticService.bategat();
            loadEntities();
            if (profile && selectedTowns.length === 0) {
                const id = profile.town_uuid || profile.town_id;
                if (id) setSelectedTowns([id]);
            }
        }
    }, [isOpen, user, profile]);

    const loadEntities = async () => {
        try {
            const userEntities = await supabaseService.getUserEntities(user.id);
            setEntities(userEntities);
        } catch (error) {
            logger.error('[CreatePostModal] Error loading entities:', error);
        }
    };

    const toggleTag = (tag) => {
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    const handleSubmit = async () => {
        if (!content.trim() || loading) return;
        setLoading(true);
        try {
            hapticService.notifySuccess();
            const newPost = {
                content: content,
                author_id: user.id,
                author_name: profile.full_name,
                author_avatar_url: profile.avatar_url,
                author_role: profile.role,
                entity_id: selectedIdentity === 'user' ? null : selectedIdentity,
                town_uuid: selectedTowns[0] || null,
                town_id: selectedTowns[0] || null,
                town_ids: selectedTowns,
                type: postType,
                tags: selectedTags,
                ai_percentage: 0,
                human_percentage: 100,
                is_playground: isPlayground,
                book_title: postType === 'book' ? bookTitle : null,
                chapter_number: postType === 'book' ? parseInt(chapterNumber) || null : null
            };

            await supabaseService.createPost(newPost, isPlayground);
            hapticService.bategat();
            onClose();
            setContent('');
            setMultimediaPreview(null);
            setMultimediaFile(null);
        } catch (error) {
            logger.error('[CreatePostModal] Error:', error);
            alert('Error al publicar. Revisa el teu bategat territorial.');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMultimediaFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setMultimediaPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const analyzeWithIAIA = async () => {
        if (!multimediaFile) return;
        setIaiaAnalyzing(true);
        try {
            const context = await iaiaService.studyMultimediaContext(multimediaFile, multimediaFile.name);
            const result = await iaiaService.generateMultimediaPublication(context, content);
            setContent(result.content);
        } catch (error) {
            logger.error('[IAIA] Error analyzing:', error);
        } finally {
            setIaiaAnalyzing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="m3-dialog-overlay" onClick={onClose}>
            <div className="m3-dialog-content animate-in-up" onClick={e => e.stopPropagation()}>
                <header className="m3-dialog-header">
                    <button className="m3-icon-button" onClick={onClose}>
                        <X size={24} />
                    </button>
                    <div className="header-title-group">
                        <h2 className="m3-headline-small">Bategar al Mur</h2>
                        <div className={`playground-badge ${isPlayground ? 'active' : ''}`} onClick={() => setIsPlayground(!isPlayground)}>
                            <Shield size={12} />
                            <span>Playground</span>
                        </div>
                    </div>
                    <button
                        className="m3-button-text"
                        onClick={handleSubmit}
                        disabled={loading || !content.trim()}
                    >
                        {loading ? 'Publicant...' : 'PUBLICAR'}
                    </button>
                </header>

                <div className="m3-dialog-body scrollable">
                    {/* Identitat Rail */}
                    <div className="identity-rail-m3">
                        <div
                            className={`rail-item ${selectedIdentity === 'user' ? 'active' : ''}`}
                            onClick={() => setSelectedIdentity('user')}
                        >
                            <div className="rail-avatar">
                                <img src={profile?.avatar_url} alt="You" />
                            </div>
                            <span className="m3-label-small">Tu</span>
                        </div>
                        {entities.map(e => (
                            <div
                                key={e.entities.id}
                                className={`rail-item ${selectedIdentity === e.entities.id ? 'active' : ''}`}
                                onClick={() => setSelectedIdentity(e.entities.id)}
                            >
                                <div className="rail-avatar">
                                    <img src={e.entities.avatar_url} alt={e.entities.name} />
                                </div>
                                <span className="m3-label-small">{e.entities.name}</span>
                            </div>
                        ))}
                    </div>

                    {/* Town Selector */}
                    <div className="m3-town-chips">
                        {profile?.town_name && (
                            <button
                                className={`m3-filter-chip ${selectedTowns.includes(profile.town_uuid || profile.town_id) ? 'active' : ''}`}
                                onClick={() => {
                                    const id = profile.town_uuid || profile.town_id;
                                    setSelectedTowns(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
                                }}
                            >
                                {profile.town_name}
                            </button>
                        )}
                    </div>

                    {/* Media Preview */}
                    {multimediaPreview && (
                        <div className="m3-media-preview-box">
                            <img src={multimediaPreview} alt="Preview" />
                            <button className="remove-media" onClick={() => { setMultimediaPreview(null); setMultimediaFile(null); }}>
                                <X size={16} />
                            </button>
                            <button className="iaia-btn-fab" onClick={analyzeWithIAIA} disabled={iaiaAnalyzing}>
                                <Sparkles size={16} />
                                {iaiaAnalyzing ? 'Estudiant...' : 'IAIA'}
                            </button>
                        </div>
                    )}

                    <div className="m3-editor-container">
                        <textarea
                            className="m3-portal-textarea"
                            placeholder="Què bategue al teu poble?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            autoFocus
                        />
                    </div>

                    {/* Tag Selector */}
                    <div className="m3-tag-selector">
                        {PREDEFINED_TAGS.map(tag => (
                            <button
                                key={tag}
                                className={`m3-assist-chip ${selectedTags.includes(tag) ? 'active' : ''}`}
                                onClick={() => toggleTag(tag)}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                <footer className="m3-dialog-footer">
                    <div className="footer-tools">
                        <button className="m3-icon-button" onClick={() => document.getElementById('post-media').click()}>
                            <ImageIcon size={20} />
                        </button>
                        <button className="m3-icon-button" onClick={() => setIsCaptureOpen(true)}>
                            <Camera size={20} />
                        </button>
                        <button className={`m3-icon-button ${postType === 'book' ? 'active' : ''}`} onClick={() => setPostType(postType === 'book' ? 'post' : 'book')}>
                            <BookOpen size={20} />
                        </button>
                        <input type="file" id="post-media" hidden onChange={handleFileChange} accept="image/*" />
                    </div>
                </footer>
            </div>

            <CaptureStudio
                isOpen={isCaptureOpen}
                onClose={() => setIsCaptureOpen(false)}
                onCapture={(media) => {
                    setMultimediaPreview(media.url);
                    if (media.blob) setMultimediaFile(new File([media.blob], 'capture.jpg', { type: 'image/jpeg' }));
                }}
                mode="photo"
            />
        </div>
    );
};

export default CreatePostModal;
