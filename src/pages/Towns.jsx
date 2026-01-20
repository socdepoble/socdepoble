import React, { useState, useEffect, useMemo } from 'react';
import { supabaseService } from '../services/supabaseService';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, Calendar, Map as MapIcon, Info, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import CategoryTabs from '../components/CategoryTabs';
import Feed from '../components/Feed';
import Market from '../components/Market';
import './Towns.css';

const Towns = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { profile } = useAppContext();
    const [towns, setTowns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTab, setCurrentTab] = useState(location.state?.initialTab || 'pobles');
    const [selectedTown, setSelectedTown] = useState(null);

    useEffect(() => {
        const fetchTowns = async () => {
            try {
                const data = await supabaseService.getTowns();
                setTowns(data);
            } catch (error) {
                console.error('Error loading towns:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTowns();
    }, []);

    // Ordenar pueblos: El pueblo del usuario primero
    const sortedTowns = useMemo(() => {
        if (!profile?.town_id) return towns;
        const userTown = towns.find(t => t.id === profile.town_id);
        const otherTowns = towns.filter(t => t.id !== profile.town_id);
        return userTown ? [userTown, ...otherTowns] : towns;
    }, [towns, profile]);

    const townTabs = [
        { id: 'pobles', label: t('nav.towns') || 'Pobles' },
        { id: 'esdeveniments', label: t('nav.events') || 'Esdeveniments' },
        { id: 'mapa', label: t('nav.map_tab') || 'Mapa' }
    ];

    if (loading) return <div className="loading-container">{t('common.loading')}</div>;

    // Si hay un pueblo seleccionado, mostramos su "Muro" (Feed + Market filtrado)
    if (selectedTown) {
        return (
            <div className="town-detail-container">
                <header className="page-header-with-tabs">
                    <div className="town-detail-header">
                        <button className="back-btn" onClick={() => setSelectedTown(null)}>
                            <ArrowLeft size={20} />
                        </button>
                        <div className="town-header-info">
                            {selectedTown.logo_url && <img src={selectedTown.logo_url} alt="" className="town-logo-tiny" />}
                            <h2>{selectedTown.name}</h2>
                        </div>
                    </div>
                </header>
                <div className="town-wall-content">
                    {/* Reutilizamos Feed y Market pasándoles el townId */}
                    <div className="localized-wall-section">
                        <h3 className="section-title">{t('feed.title')}</h3>
                        <Feed townId={selectedTown.id} hideHeader={true} />
                    </div>
                    <div className="localized-wall-section">
                        <h3 className="section-title">{t('market.title')}</h3>
                        <Market townId={selectedTown.id} hideHeader={true} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="towns-container">
            <header className="page-header-with-tabs">
                <div className="header-tabs-wrapper">
                    <CategoryTabs
                        selectedRole={currentTab}
                        onSelectRole={(role) => {
                            if (role === 'mapa') {
                                navigate('/mapa');
                            } else {
                                setCurrentTab(role);
                            }
                        }}
                        tabs={townTabs}
                    />
                </div>
            </header>

            <div className="towns-content-area">
                {currentTab === 'pobles' && (
                    <div className="towns-grid">
                        {sortedTowns.map(town => (
                            <div
                                key={town.id}
                                className={`town-card ${town.id === profile?.town_id ? 'is-user-town' : ''}`}
                                onClick={() => setSelectedTown(town)}
                            >
                                <img
                                    src={town.image_url || 'https://images.unsplash.com/photo-1541890289-b86df5b6fea1?auto=format&fit=crop&q=80'}
                                    alt={town.name}
                                    className="town-image-bg"
                                />
                                <div className="town-overlay"></div>
                                <div className="town-info">
                                    {town.id === profile?.town_id && (
                                        <div className="user-town-badge">{t('towns.your_town') || 'El teu poble'}</div>
                                    )}
                                    <div className="town-header">
                                        {town.logo_url && (
                                            <img src={town.logo_url} alt="Escut" className="town-logo-mini" />
                                        )}
                                        <h3 className="town-name">{town.name}</h3>
                                    </div>
                                    <p className="town-desc">{town.description}</p>
                                    <div className="town-stats">
                                        <span className="stat-item">
                                            <Users size={14} />
                                            {town.population?.toLocaleString()} hab.
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {currentTab === 'esdeveniments' && (
                    <div className="empty-state-full">
                        <Calendar size={48} className="empty-icon" />
                        <h3>{t('events.title') || 'Pròxims Esdeveniments'}</h3>
                        <p>{t('events.empty') || 'No hi ha esdeveniments programats per a aquesta setmana.'}</p>
                        <button className="btn-primary-soft" onClick={() => window.dispatchEvent(new CustomEvent('open-create-post'))}>
                            Crear un esdeveniment
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Towns;
