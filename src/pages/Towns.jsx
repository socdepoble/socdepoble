import React, { useState, useEffect } from 'react';
import { supabaseService } from '../services/supabaseService';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, Calendar, Map as MapIcon, Info } from 'lucide-react';
import CategoryTabs from '../components/CategoryTabs';
import './Towns.css';

const Towns = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
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
                        {towns.map(town => (
                            <div key={town.id} className="town-card" onClick={() => console.log('Ir a detalle de', town.name)}>
                                <img
                                    src={town.image_url || 'https://images.unsplash.com/photo-1541890289-b86df5b6fea1?auto=format&fit=crop&q=80'}
                                    alt={town.name}
                                    className="town-image-bg"
                                />
                                <div className="town-overlay"></div>
                                <div className="town-info">
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

                {currentTab === 'mapa' && (
                    <div className="map-placeholder-container">
                        <div className="map-card-placeholder">
                            <MapIcon size={48} />
                            <h3>Mapa Connectat</h3>
                            <p>Explora els punts geolocalitzats de la teua zona.</p>
                            <div className="map-mock-points">
                                <div className="mock-point mur"><span>Mur</span></div>
                                <div className="mock-point mercat"><span>Mercat</span></div>
                                <div className="mock-point event"><span>Esdeveniment</span></div>
                            </div>
                            <button className="btn-primary" onClick={() => console.log('Navigate to full map')}>
                                Obrir Mapa Complet
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Towns;
