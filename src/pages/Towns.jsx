import React, { useState, useEffect, useMemo } from 'react';
import { supabaseService } from '../services/supabaseService';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Users, Calendar, Map as MapIcon, Info, ArrowLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CategoryTabs from '../components/CategoryTabs';
import Feed from '../components/Feed';
import Marketplace from '../components/Marketplace';
import { logger } from '../utils/logger';
import StatusLoader from '../components/StatusLoader';
import SEO from '../components/SEO';
import './Towns.css';

const TownLogo = ({ url, name }) => {
    const [error, setError] = useState(false);

    if (!url || error) {
        return <MapIcon size={24} style={{ color: 'var(--color-primary)' }} />;
    }

    return (
        <img
            src={url}
            alt={`Escut de ${name}`}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            onError={() => setError(true)}
        />
    );
};

const Towns = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { profile } = useAuth();
    const [towns, setTowns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentTab, setCurrentTab] = useState(location.state?.initialTab || 'pobles');

    useEffect(() => {
        const fetchTowns = async () => {
            setError(null);
            try {
                const data = await supabaseService.getTowns();
                setTowns(data);
            } catch (error) {
                logger.error('Error loading towns:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTowns();
    }, []);

    const sortedTowns = useMemo(() => {
        let list = [...towns];
        const torre = list.find(t => t.name === 'La Torre de les Maçanes');
        if (torre) {
            list = [torre, ...list.filter(t => t.name !== 'La Torre de les Maçanes')];
        }
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

    if (error) {
        return (
            <div className="towns-container">
                <StatusLoader type="error" message={error} />
            </div>
        );
    }

    if (loading) {
        return (
            <div className="towns-container">
                <StatusLoader type="loading" />
            </div>
        );
    }

    return (
        <div className="towns-page-container">
            <SEO
                title={t('towns.title') || 'Els Pobles'}
                description={t('towns.description') || 'Explora la xarxa de pobles connectats i descobreix el que els fa únics.'}
                image="/og-pobles.png"
            />
            <header className="towns-header">
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
                                            <div className="post-avatar" style={{ backgroundColor: 'white', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', overflow: 'hidden', width: '44px', height: '44px' }}>
                                                <TownLogo url={town.logo_url} name={town.name} />
                                            </div>
                                            <div className="post-meta">
                                                <span className="post-author">{town.name}</span>
                                                <div className="post-town">{town.province}</div>
                                            </div>
                                        </div>
                                        <div className="header-right">
                                            <ChevronRight size={24} />
                                        </div>
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
