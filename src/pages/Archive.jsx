import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabaseService } from '../services/supabaseService';
import {
    Grid, List, Database, Share2, Plus, Search,
    FileText, Image as ImageIcon, MessageSquare,
    User, Store, Box, LayoutGrid, Tag, Inbox,
    Folder, ExternalLink, MoreVertical, Trash2,
    ShieldCheck, Zap, BookOpen, Clock, ArrowLeft, Filter, Calendar, MapPin, Download, Eye
} from 'lucide-react';
import StatusLoader from '../components/StatusLoader';
import { useTheme } from '../context/ThemeContext';
import { logger } from '../utils/logger';
import './Archive.css';

const Rebost = () => {
    const { user, profile } = useAuth();
    const { theme } = useTheme();
    const [viewMode, setViewMode] = useState('masonry');
    const [objects, setObjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [activeCollection, setActiveCollection] = useState('tots');
    const [searchQuery, setSearchQuery] = useState('');

    // PRESETS DE COLECCIONS (SACS)
    const collections = [
        { id: 'tots', name: 'Tots els recursos', icon: <Inbox size={18} /> },
        { id: 'historia', name: 'Història Viva', icon: <BookOpen size={18} />, color: '#CC5500' },
        { id: 'fadrins', name: 'Comissió Fadrins', icon: <Zap size={18} />, color: '#00F2FF' },
        { id: 'mercat', name: 'Arxiu Mercat', icon: <Store size={18} />, color: '#10B981' },
    ];

    useEffect(() => {
        const loadObjects = async () => {
            setLoading(true);
            try {
                // Simulacre de dades amb Snapshots ja fets (Soberania Local)
                const [posts, items] = await Promise.all([
                    supabaseService.getFeedPosts(),
                    supabaseService.getMarketItems()
                ]);

                const unified = [
                    ...posts.map(p => ({
                        id: p.id,
                        type: 'post',
                        title: p.content?.substring(0, 50) + '...',
                        description: "Crònica bategada al mur del poble.",
                        icon: <FileText size={18} />,
                        author: p.profiles?.username,
                        date: p.created_at,
                        tags: ['#relat', '#comunitat'],
                        image: p.media_url || '/assets/master/town_placeholder.png',
                        collection: 'historia'
                    })),
                    ...items.map(i => ({
                        id: i.id,
                        type: 'product',
                        title: i.title,
                        description: i.description,
                        icon: <Store size={18} />,
                        author: i.profiles?.username,
                        date: i.created_at,
                        tags: ['#mercat', '#producte'],
                        image: i.image_url || '/assets/master/market_placeholder.png',
                        collection: 'mercat'
                    }))
                ].sort((a, b) => new Date(b.date) - new Date(a.date));

                setObjects(unified);
            } catch (err) {
                console.error("Error carregant el rebost:", err);
            } finally {
                setLoading(false);
            }
        };

        loadObjects();
    }, []);

    const filteredObjects = useMemo(() => {
        return objects.filter(obj => {
            const matchesFilter = filter === 'all' || obj.type === filter;
            const matchesCollection = activeCollection === 'tots' || obj.collection === activeCollection;
            const matchesSearch = obj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                obj.author.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesFilter && matchesCollection && matchesSearch;
        });
    }, [objects, filter, activeCollection, searchQuery]);

    if (loading) return <StatusLoader message="Obrint el Rebost Digital..." />;

    return (
        <div className={`archive-page rebost-layout theme-${theme} animate-in`}>
            {/* SIDEBAR D'ORGANITZACIÓ (Estil Raindrop) */}
            <aside className="rebost-sidebar">
                <div className="sidebar-section">
                    <h3>Biblioteques</h3>
                    <nav className="sidebar-nav">
                        {collections.map(col => (
                            <button
                                key={col.id}
                                className={`nav-item ${activeCollection === col.id ? 'active' : ''}`}
                                onClick={() => setActiveCollection(col.id)}
                            >
                                <span className="nav-icon" style={{ color: col.color }}>{col.icon}</span>
                                <span className="nav-text">{col.name}</span>
                                <span className="nav-count">{objects.filter(o => o.collection === col.id || col.id === 'tots').length}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="sidebar-section">
                    <h3>Etiquetes</h3>
                    <div className="tags-cloud">
                        {['#relat', '#mercat', '#comunitat', '#producte', '#història'].map(tag => (
                            <button key={tag} className="tag-pill">{tag}</button>
                        ))}
                    </div>
                </div>

                <div className="sidebar-footer">
                    <div className="sovereign-badge">
                        <ShieldCheck size={14} />
                        <span>100% LOCAL STORAGE</span>
                    </div>
                </div>
            </aside>

            {/* CONTINGUT PRINCIPAL */}
            <main className="rebost-main">
                <header className="rebost-header">
                    <div className="search-bar-wrapper">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Cerca al teu arxiu sobirà..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="header-view-actions">
                        <button className={`view-btn ${viewMode === 'masonry' ? 'active' : ''}`} onClick={() => setViewMode('masonry')}>
                            <LayoutGrid size={20} />
                        </button>
                        <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
                            <List size={20} />
                        </button>
                        <button className="btn-add-resource">
                            <Plus size={20} />
                            <span>Afegir</span>
                        </button>
                    </div>
                </header>

                <div className={`rebost-grid ${viewMode}`}>
                    {filteredObjects.length > 0 ? (
                        filteredObjects.map(obj => (
                            <article key={obj.id} className="resource-card animate-in">
                                <div className="card-image">
                                    <img src={obj.image} alt={obj.title} loading="lazy" />
                                    <div className="card-type-tag">{obj.type}</div>
                                </div>
                                <div className="card-body">
                                    <div className="card-header-row">
                                        <span className="card-icon">{obj.icon}</span>
                                        <button className="btn-more"><MoreVertical size={16} /></button>
                                    </div>
                                    <h4>{obj.title}</h4>
                                    <p>{obj.description}</p>
                                    <div className="card-footer">
                                        <div className="card-tags">
                                            {obj.tags.map(t => <span key={t} className="mini-tag">{t}</span>)}
                                        </div>
                                        <span className="card-date">{new Date(obj.date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="empty-state">
                            <Box size={48} />
                            <p>No hi ha solatge en aquesta col·lecció.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Rebost;
