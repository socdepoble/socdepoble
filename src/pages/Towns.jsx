import React, { useState, useEffect, useMemo } from 'react';
import { supabaseService } from '../services/supabaseService';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Users, Calendar, Map as MapIcon, Info, ArrowLeft, ChevronRight } from 'lucide-react';
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

    // Ordenar pueblos: La Torre de les Maçanes primer, després el del usuari
    const sortedTowns = useMemo(() => {
        let list = [...towns];

        // Moure La Torre de les Maçanes al principi
        const torre = list.find(t => t.name === 'La Torre de les Maçanes');
        if (torre) {
            list = [torre, ...list.filter(t => t.name !== 'La Torre de les Maçanes')];
        }

        // Moure el poble del usuari a la segona posició (si no es la Torre)
        if (profile?.town_uuid || profile?.town_id) {
            const userTownId = profile.town_uuid || profile.town_id;
            const userTown = list.find(t => t.uuid === userTownId || t.id === userTownId);
            if (userTown && userTown.name !== 'La Torre de les Maçanes') {
                const rest = list.filter(t => (t.uuid !== userTownId && t.id !== userTownId) && t.name !== 'La Torre de les Maçanes');
                list = [list[0], userTown, ...rest];
            }
        }

        return list;
    }, [towns, profile]);

    const townTabs = [
        { id: 'pobles', label: t('nav.towns') || 'Pobles' },
        { id: 'esdeveniments', label: t('nav.events') || 'Esdeveniments' },
        { id: 'mapa', label: t('nav.map_tab') || 'Mapa' }
    ];

    if (loading) return <div className="loading-container">{t('common.loading')}</div>;

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
                            <Link
                                key={town.uuid || town.id}
                                to={`/pobles/${town.uuid || town.id}`}
                                className={`town-card-link ${(town.uuid === profile?.town_uuid || town.id === profile?.town_id) ? 'is-user-town' : ''}`}
                            >
                                <div className="universal-card town-card">
                                    <div className="card-header">
                                        <div className="header-left">
                                            <div className="post-avatar" style={{ backgroundColor: 'var(--bg-surface)', padding: '2px' }}>
                                                {town.logo_url ? (
                                                    <img
                                                        src={town.logo_url}
                                                        alt="Escut"
                                                        className="town-logo-mini"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.parentElement.innerHTML = '<div class="avatar-placeholder"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>';
                                                        }}
                                                    />
                                                ) : <MapIcon size={20} />}
                                            </div>
                                            <div className="post-meta">
                                                <span className="post-author">{town.name}</span>
                                                <span className="post-time">{town.province}</span>
                                            </div>
                                        </div>
                                        <ChevronRight size={20} className="text-muted" />
                                    </div>

                                    <div className="card-image-wrapper">
                                        <img
                                            src={town.image_url || '/images/assets/town_square.png'}
                                            alt={town.name}
                                        />
                                        {(town.uuid === profile?.town_uuid || town.id === profile?.town_id) && (
                                            <div className="pill-badge accent user-town-badge">{t('towns.your_town') || 'El teu poble'}</div>
                                        )}
                                    </div>

                                    <div className="card-body">
                                        <p className="town-desc-short">{town.description}</p>
                                    </div>
                                    <div className="card-footer-vibrant">
                                        <div className="footer-stat-block">
                                            <div className="stat-item">
                                                <Users size={18} />
                                                <span>{town.population?.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <button className="add-btn-premium-vibrant">
                                            Explorar
                                        </button>
                                    </div>
                                </div>
                            </Link>
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
