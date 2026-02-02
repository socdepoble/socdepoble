import React, { useState, useEffect, useMemo } from 'react';
import { supabaseService } from '../services/supabaseService';
import UniversalCard from '../components/UniversalCard';
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
        return (
            <div
                className="flex items-center justify-center w-full h-full"
                style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    border: '1px solid var(--sdp-glass-border)'
                }}
            >
                <MapIcon size={24} style={{ color: 'var(--color-primary)', opacity: 0.5 }} />
            </div>
        );
    }

    return (
        <img
            src={url}
            alt={`Escut de ${name}`}
            className="town-logo-img"
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

            // [PILAR 1: INSTANT LOAD TOWNS]
            const localData = localStorage.getItem('lc_towns_all');
            if (localData) {
                try {
                    const parsed = JSON.parse(localData);
                    if (parsed && Array.isArray(parsed)) {
                        logger.log('[Towns] Instant Load: Bategant llista de pobles des del solatge...');
                        setTowns(parsed);
                        setLoading(false);
                    }
                } catch (e) {
                    logger.warn('[Towns] Error en Instant Load:', e);
                }
            }

            try {
                const data = await supabaseService.getTowns();
                setTowns(data);
                // Save for next time
                localStorage.setItem('lc_towns_all', JSON.stringify(data));
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
        // L'ordenació ja ve definida pel "Batec" des del supabaseService
        return towns;
    }, [towns]);

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
                structuredData={{
                    "@type": "ItemList",
                    "name": "Pobles de la Comunitat",
                    "itemListElement": towns.slice(0, 10).map((town, index) => ({
                        "@type": "ListItem",
                        "position": index + 1,
                        "item": {
                            "@type": "AdministrativeArea",
                            "name": town.name,
                            "url": `https://socdepoble.vercel.app/pobles/${town.uuid || town.id}`,
                            "image": town.image_url
                        }
                    }))
                }}
            />
            {/* Semantic Heading for SEO/A11y */}
            <h1 className="sr-only">{t('towns.title') || 'Xarxa de Pobles Connectats'}</h1>

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
                                <UniversalCard
                                    title={town.name}
                                    subtitle={`${town.posts_count || 0} veïns bategant`}
                                    avatarSrc={town.logo_url}
                                    avatarName={town.name}
                                    headerTheme="terracotta"
                                    className="town-card animate-in-up"
                                    image={town.image_url}
                                    isBating={town.uuid === localStorage.getItem('last_active_town_id') || town.id === parseInt(localStorage.getItem('last_active_town_id'))}
                                    isOfficial={town.is_official}
                                    footer={
                                        <div className="town-card-footer flex justify-between items-center w-full px-2" style={{ padding: '8px 4px' }}>
                                            <span className="town-post-count flex items-center gap-1 opacity-70">
                                                <Users size={16} />
                                                {town.population?.toLocaleString() || 0}
                                            </span>
                                            <div
                                                className="btn-enter-town-premium"
                                                style={{
                                                    background: 'var(--color-primary)',
                                                    color: '#000',
                                                    padding: '6px 14px',
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    fontWeight: '900',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px'
                                                }}
                                            >
                                                ENTRAR <ChevronRight size={14} />
                                            </div>
                                        </div>
                                    }
                                >
                                    <div className="town-description-mini text-sm italic opacity-80 line-clamp-2" style={{ padding: '10px 0' }}>
                                        {town.description || 'Explora la saviesa i el batec d\'aquest poble.'}
                                    </div>
                                </UniversalCard>
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
