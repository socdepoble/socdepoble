import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabaseService } from '../services/supabaseService';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Grid, Image as ImageIcon, Layout, Users, MoreVertical, Trash2, ExternalLink, Loader2, Film, FileText, File } from 'lucide-react';
import StatusLoader from '../components/StatusLoader';
import './MediaAlbum.css';
import { logger } from '../utils/logger';
import MasterMediaGallery from '../components/MasterMediaGallery';

const MediaAlbum = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, isPlayground } = useAuth();
    const [mediaItems, setMediaItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'avatar', 'cover', 'shared', 'video', 'document'

    useEffect(() => {
        const loadMedia = async () => {
            try {
                setIsLoading(true);
                const data = await supabaseService.getUserMedia(user.id, isPlayground);
                setMediaItems(data || []);
            } catch (error) {
                logger.error('Error loading media:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user?.id) {
            loadMedia();
        }
    }, [user?.id, isPlayground]);

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

    if (isLoading) return <StatusLoader type="loading" />;

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

            <MasterMediaGallery
                items={mediaItems.map(item => ({
                    ...item,
                    permissions: item.is_public ? 'public' : 'private'
                }))}
                title="El Teu Àlbum Personal"
            />
        </div>
    );
};

export default MediaAlbum;
