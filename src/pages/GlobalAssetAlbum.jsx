import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabaseService } from '../services/supabaseService';
import { ArrowLeft, LayoutGrid, Calendar, Users, Filter, Search } from 'lucide-react';
import MasterMediaGallery from '../components/MasterMediaGallery';
import StatusLoader from '../components/StatusLoader';
import { logger } from '../utils/logger';
import './GlobalAssetAlbum.css';

const GlobalAssetAlbum = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [mediaItems, setMediaItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // grid, timeline, uploader

    useEffect(() => {
        const loadGlobalMedia = async () => {
            try {
                setIsLoading(true);
                const data = await supabaseService.getGlobalMedia();
                setMediaItems(data || []);
            } catch (err) {
                logger.error('[GlobalAssetAlbum] Error loading global media:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadGlobalMedia();
    }, []);

    if (isLoading) return <StatusLoader type="loading" message="Sincronitzant l'Àlbum Global..." />;

    return (
        <div className="global-album-page anim-fade-in">
            <header className="global-album-header">
                <div className="header-top">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        <ArrowLeft size={24} />
                    </button>
                    <div className="header-title-wrapper">
                        <h1>Àlbum Global del Poble</h1>
                        <p>Totes les imatges i records compartits a la xarxa.</p>
                    </div>
                </div>

                <div className="header-tabs">
                    <button
                        className={`header-tab ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                    >
                        <LayoutGrid size={18} /> Galeria
                    </button>
                    <button
                        className={`header-tab ${viewMode === 'timeline' ? 'active' : ''}`}
                        onClick={() => setViewMode('timeline')}
                    >
                        <Calendar size={18} /> Cronologia
                    </button>
                </div>
            </header>

            <main className="global-album-content">
                <MasterMediaGallery
                    items={mediaItems.map(item => ({
                        ...item,
                        permissions: item.is_public ? 'public' : 'private'
                    }))}
                    showFilters={true}
                    layout={viewMode === 'grid' ? 'grid' : 'trencadis'}
                />
            </main>

            {/* FLOATING ACTION BADGE - Sóc de Poble Style */}
            <div className="global-album-footer">
                <span>Vist per {mediaItems.length} records autèntics</span>
            </div>
        </div>
    );
};

export default GlobalAssetAlbum;
