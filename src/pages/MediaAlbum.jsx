import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabaseService } from '../services/supabaseService';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Grid, Image as ImageIcon, Layout, Users, MoreVertical, Trash2, ExternalLink, Loader2, Film, FileText, File } from 'lucide-react';
import UnifiedStatus from '../components/UnifiedStatus';
import './MediaAlbum.css';

const MediaAlbum = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [mediaItems, setMediaItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'avatar', 'cover', 'shared', 'video', 'document'

    useEffect(() => {
        if (user?.id) {
            loadMedia();
        }
    }, [user?.id]);

    const loadMedia = async () => {
        try {
            setIsLoading(true);
            const data = await supabaseService.getUserMedia(user.id);
            setMediaItems(data || []);
        } catch (error) {
            console.error('Error loading media:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredItems = mediaItems.filter(item => {
        if (filter === 'all') return true;
        if (filter === 'shared' && item.is_public) return true;
        if (filter === 'video' && item.asset.mime_type?.startsWith('video/')) return true;
        if (filter === 'document' && (item.asset.mime_type?.includes('pdf') || item.asset.mime_type?.includes('doc'))) return true;
        return item.context === filter;
    });

    const getFileIcon = (mimeType) => {
        if (mimeType?.startsWith('image/')) return <ImageIcon size={24} />;
        if (mimeType?.startsWith('video/')) return <Film size={24} />;
        if (mimeType?.includes('pdf')) return <FileText size={24} />;
        return <File size={24} />;
    };

    if (isLoading) return <UnifiedStatus type="loading" />;

    return (
        <div className="photos-page">
            <header className="photos-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <h1>{t('nav.my_album') || 'Àlbum Multimedia'}</h1>
                <div className="header-stats">
                    <span>{mediaItems.length} {mediaItems.length === 1 ? 'Arxiu' : 'Arxius'}</span>
                </div>
            </header>

            <nav className="photos-filter-bar">
                <button
                    className={filter === 'all' ? 'active' : ''}
                    onClick={() => setFilter('all')}
                >
                    Tots
                </button>
                <button
                    className={filter === 'avatar' ? 'active' : ''}
                    onClick={() => setFilter('avatar')}
                >
                    Perfil
                </button>
                <button
                    className={filter === 'cover' ? 'active' : ''}
                    onClick={() => setFilter('cover')}
                >
                    Portada
                </button>
                <button
                    className={filter === 'video' ? 'active' : ''}
                    onClick={() => setFilter('video')}
                >
                    <Film size={14} /> Vídeos
                </button>
                <button
                    className={filter === 'document' ? 'active' : ''}
                    onClick={() => setFilter('document')}
                >
                    <FileText size={14} /> Docs
                </button>
                <button
                    className={filter === 'shared' ? 'active' : ''}
                    onClick={() => setFilter('shared')}
                >
                    <Users size={14} /> Compartits
                </button>
            </nav>

            {filteredItems.length === 0 ? (
                <div className="empty-album">
                    <ImageIcon size={48} color="var(--color-border)" />
                    <p>No hi ha arxius en aquesta categoria</p>
                </div>
            ) : (
                <div className="photos-grid">
                    {filteredItems.map(item => (
                        <div key={item.id} className="photo-card">
                            <div className="photo-wrapper">
                                {item.asset.mime_type?.startsWith('image/') ? (
                                    <img src={item.asset.url} alt={item.context} loading="lazy" />
                                ) : item.asset.mime_type?.startsWith('video/') ? (
                                    <div className="video-placeholder">
                                        <Film size={40} color="var(--color-primary)" />
                                        <span className="file-type-label">VÍDEO</span>
                                    </div>
                                ) : (
                                    <div className="file-placeholder">
                                        <FileText size={40} color="var(--color-primary)" />
                                        <span className="file-type-label">DOCUMENT</span>
                                    </div>
                                )}
                                <div className="photo-overlay">
                                    <span className="photo-badge">{item.context}</span>
                                    {item.is_public && <div className="shared-badge" title="Compartit"><Users size={12} /></div>}
                                </div>
                            </div>
                            <div className="photo-info">
                                <span className="photo-date">
                                    {new Date(item.created_at).toLocaleDateString()}
                                </span>
                                <button className="photo-menu-btn">
                                    <MoreVertical size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MediaAlbum;
