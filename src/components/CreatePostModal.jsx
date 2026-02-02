import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';
import { ROLES, IAIA_ID } from '../constants';
import { iaiaService } from '../services/iaiaService';
import { getRandomProverb } from '../data/proverbs';
import { logger } from '../utils/logger';
import { X, Image as ImageIcon, Send, Loader2, Globe, Lock, Users, BookOpen, MessageSquare, Sparkles } from 'lucide-react';
import './CreatePostModal.css';

import EntitySelector from './EntitySelector';
import MasterEditor from './MasterEditor';

const PREDEFINED_TAGS = ['Esdeveniment', 'Avís', 'Consulta', 'Proposta'];

const CreatePostModal = ({ isOpen, onClose, onPostCreated, isPrivateInitial = false, isPlayground = false }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
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
    const [postType, setPostType] = useState('post'); // post, book
    const [bookTitle, setBookTitle] = useState('');
    const [chapterNumber, setChapterNumber] = useState('');
    const [multimediaFile, setMultimediaFile] = useState(null);
    const [multimediaPreview, setMultimediaPreview] = useState(null);
    const [iaiaAnalyzing, setIaiaAnalyzing] = useState(false);
    const [simbiosiMetrics, setSimbiosiMetrics] = useState(null);
    const [selectedTowns, setSelectedTowns] = useState([]); // Array per a Multilocalitat

    useEffect(() => {
        if (isOpen) {
            setPrivacy(isPrivateInitial ? 'groups' : 'public');

            // ARCHIVE DEBATE CONTEXT [MASTER FLOW]
            if (postModalConfig?.initialContext) {
                const ctx = postModalConfig.initialContext;
                const template = `<h1>Debat: ${ctx.sourceTitle}</h1>\n\n<blockquote>"${ctx.selectedText}"</blockquote>\n\nEstem perdent els referents o les dades oficials estan obsoletes? 🤔 #ArxiuActiu #VeritatDeFerro`;
                setContent(template);
                if (ctx.imageUrl) {
                    setMultimediaPreview(ctx.imageUrl);
                }
                setPostType('archive_debate');
            }
        }
    }, [isOpen, isPrivateInitial, postModalConfig]);

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

                // Inicialitzem amb el poble principal si existeix
                if (profile.town_uuid || profile.town_id) {
                    setSelectedTowns([profile.town_uuid || profile.town_id]);
                }
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
            setSimbiosiMetrics(result.metrics);
        } catch (error) {
            logger.error('[IAIA] Error analyzing multimedia:', error);
        } finally {
            setIaiaAnalyzing(false);
        }
    };

    const formatWithIAIA = async () => {
        if (!content.trim()) return;
        setIaiaAnalyzing(true);
        try {
            // IAIA call to format single paragraph into Master Post
            const context = {
                detectedObjects: ["narrativa de poble"],
                suggestedTitle: "Crònica del Veïnat",
                suggestedMotto: getRandomProverb().text,
                contextTone: "proller i autèntic"
            };
            const result = await iaiaService.generateMultimediaPublication(context, content);
            setContent(result.content);
            setSimbiosiMetrics(result.metrics);
        } catch (error) {
            logger.error('[IAIA] Error formatting text:', error);
        } finally {
            setIaiaAnalyzing(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() || loading) return;

        setLoading(true);
        try {
            const newPost = {
                content: content,
                likes: 0,
                comments_count: 0,
                created_at: new Date().toISOString(),
                tags: selectedTags,
                privacy: privacy,
                is_private: privacy !== 'public',

                // Multi-Identidad (Unified identity scheme)
                author_id: user.id,
                author_entity_id: selectedIdentity.type !== 'user' ? selectedIdentity.id : null,
                author_role: selectedIdentity.type === 'user' ? ROLES.PEOPLE : selectedIdentity.type,

                // Schema compatibility
                author_name: selectedIdentity.type === 'user'
                    ? profile.full_name
                    : `${selectedIdentity.name} | ${profile.full_name}`,
                author_avatar_url: selectedIdentity.avatar_url,
                image_url: null, // Reset if no content image

                // Book/CMS Logic
                type: postType,
                book_title: postType === 'book' ? bookTitle : null,
                chapter_number: postType === 'book' ? parseInt(chapterNumber) || null : null,

                // Symbiosis Protocol [MASTER]
                ai_percentage: simbiosiMetrics?.ai_percentage || 0,
                human_percentage: simbiosiMetrics?.human_percentage || 100,
                time_saved_minutes: simbiosiMetrics?.time_saved_minutes || 0,
                economic_value_saved: simbiosiMetrics?.economic_value_saved || 0,
                is_iaia_inspired: !!simbiosiMetrics,

                // Archive Debate Metadata
                metadata: {
                    ...postModalConfig?.initialContext,
                    is_archive_debate: postType === 'archive_debate'
                },

                // Multilocalitat
                town_ids: selectedTowns,
                town_id: selectedTowns[0] || null // Fallback per a schema antic
            };

            await supabaseService.createPost(newPost, isPlayground);

            // [BATEC TERRITORIAL] Registrem l'activitat en els pobles seleccionats
            if (selectedTowns.length > 0) {
                localStorage.setItem('last_active_town_id', selectedTowns[0]);
            }

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
                    <div className="modal-pull-handle"></div>
                    <div className="modal-header-row">
                        <div className="modal-header-actions">
                            <button
                                className="btn-presentation-sovereign"
                                onClick={() => navigate('/projecte')}
                                title="Conèixer Sóc de Poble"
                            >
                                <img src="/socdepoble_map_pattern_v1.png" alt="Sóc de Poble" className="logo-sovereign" />
                                <span>Presentació Oficial</span>
                            </button>
                            <h2>{t('feed.title')}</h2>
                        </div>
                        <button className="close-btn" onClick={onClose}>
                            <X size={24} />
                        </button>
                    </div>
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
                        <div className="post-type-selector">
                            <button
                                type="button"
                                className={`type-btn ${postType === 'post' ? 'active' : ''}`}
                                onClick={() => setPostType('post')}
                                title="Publicació estàndard"
                            >
                                <MessageSquare size={18} />
                            </button>
                            <button
                                type="button"
                                className={`type-btn ${postType === 'book' ? 'active' : ''}`}
                                onClick={() => setPostType('book')}
                                title="Capítol de Llibre"
                            >
                                <BookOpen size={18} />
                            </button>
                        </div>
                    </div>

                    {/* SELECTOR D'ARRELAMENT (Pobles) */}
                    <div className="post-town-selector">
                        <span className="selector-label">Publicar a:</span>
                        <div className="town-pills-container">
                            {profile?.town_name && (
                                <button
                                    type="button"
                                    className={`town-pill ${selectedTowns.includes(profile.town_uuid || profile.town_id) ? 'active' : ''}`}
                                    onClick={() => {
                                        const id = profile.town_uuid || profile.town_id;
                                        setSelectedTowns(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
                                    }}
                                >
                                    {profile.town_name} (Principal)
                                </button>
                            )}
                            {profile?.secondary_towns?.map(townId => (
                                <button
                                    key={townId}
                                    type="button"
                                    className={`town-pill ${selectedTowns.includes(townId) ? 'active' : ''}`}
                                    onClick={() => setSelectedTowns(prev => prev.includes(townId) ? prev.filter(t => t !== townId) : [...prev, townId])}
                                >
                                    {/* Aquí ens caldria el nom del poble, de moment usem l'ID o un placeholder */}
                                    Poble Secundari
                                </button>
                            ))}
                        </div>
                    </div>

                    {postType === 'book' && (
                        <div className="book-fields-grid animate-in" style={{ padding: '0 15px 10px 15px', display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                placeholder="Títol del Llibre (Etiqueta)"
                                value={bookTitle}
                                onChange={(e) => setBookTitle(e.target.value)}
                                style={{ flex: 2, padding: '8px', borderRadius: '8px', border: '1px solid var(--color-divider)', background: 'var(--bg-surface)', color: 'var(--text-main)' }}
                            />
                            <input
                                type="number"
                                placeholder="Cap."
                                value={chapterNumber}
                                onChange={(e) => setChapterNumber(e.target.value)}
                                style={{ flex: 0.5, padding: '8px', borderRadius: '8px', border: '1px solid var(--color-divider)', background: 'var(--bg-surface)', color: 'var(--text-main)', textAlign: 'center' }}
                            />
                        </div>
                    )}

                    {multimediaPreview && (
                        <div className="multimedia-preview-container animate-in">
                            <img src={multimediaPreview} alt="Preview" className="preview-img" />
                            <button className="remove-preview" onClick={() => { setMultimediaPreview(null); setMultimediaFile(null); }}>
                                <X size={16} />
                            </button>
                            {!iaiaAnalyzing ? (
                                <button type="button" className="iaia-analyze-btn" onClick={analyzeWithIAIA}>
                                    <Sparkles size={16} />
                                    Preguntar a l'IAIA
                                </button>
                            ) : (
                                <div className="iaia-working-badge">
                                    <Loader2 className="spinner" size={16} />
                                    L'IAIA i el Nano Banana estan estudiant la teua imatge...
                                </div>
                            )}
                        </div>
                    )}

                    <div className="post-content-area">
                        <MasterEditor
                            value={content}
                            onChange={setContent}
                            placeholder={t('feed.placeholder')}
                        />
                        {content.trim() && !content.includes('<h1>') && !iaiaAnalyzing && (
                            <button type="button" className="iaia-floating-help-btn animate-in" onClick={formatWithIAIA}>
                                <Sparkles size={14} />
                                Ajuda'm a bategar el text
                            </button>
                        )}
                    </div>

                    <div className="post-footer-tools">
                        <div className="tools-left">
                            <input
                                type="file"
                                id="post-multimedia"
                                hidden
                                onChange={handleFileChange}
                                accept="image/*,video/*"
                            />
                            <button type="button" className="tool-btn" onClick={() => document.getElementById('post-multimedia').click()}>
                                <ImageIcon size={20} />
                            </button>
                            <div className="tag-scroller">
                                {PREDEFINED_TAGS.map(tag => (
                                    <button
                                        key={tag}
                                        type="button"
                                        className={`tag-pill-mini ${selectedTags.includes(tag) ? 'active' : ''}`}
                                        onClick={() => toggleTag(tag)}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* CC BY-NC-SA 4.0 DISCLAIMER [FLASH] */}
                        <div className="post-legal-disclaimer">
                            En bategar, acceptes compartir el teu contingut sota llicència <strong>CC BY-NC-SA 4.0</strong> (Reconeixement-NoComercial-CompartirIgual).
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

export default CreatePostModal;
