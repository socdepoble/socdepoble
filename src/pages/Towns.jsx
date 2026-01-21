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
                                <div className="town-card">
                                    <img
                                        src={town.image_url || 'https://images.unsplash.com/photo-1541890289-b86df5b6fea1?auto=format&fit=crop&q=80'}
                                        alt={town.name}
                                        className="town-image-bg"
                                    />
                                    <div className="town-overlay"></div>
                                    <div className="town-info">
                                        {(town.uuid === profile?.town_uuid || town.id === profile?.town_id) && (
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
                                            <ChevronRight size={16} className="card-arrow" />
                                        </div>
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
