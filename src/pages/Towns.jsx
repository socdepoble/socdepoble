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
import { MOCK_EVENTS } from '../data';
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
    const [eventSearch, setEventSearch] = useState('');
    const [activeEventTag, setActiveEventTag] = useState('tots');

    const eventTags = ['tots', 'Festes', 'Fotos', 'Reunió', 'Cultura'];

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
        // [BATEC TERRITORIAL] El service ens retorna la llista ja batejada per activitat
        return towns;
    }, [towns]);

    const townTabs = [
        { id: 'pobles', label: t('nav.towns') || 'Pobles' },
        { id: 'esdeveniments', label: t('nav.events') || 'Esdeveniments' },
        { id: 'rhizome', label: 'Essències' },
        { id: 'calendari', label: 'Calendari' },
        { id: 'mapa', label: t('nav.map_tab') || 'Mapa' }
    ];

    const filteredEvents = MOCK_EVENTS.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
            event.description.toLowerCase().includes(eventSearch.toLowerCase()) ||
            event.location.toLowerCase().includes(eventSearch.toLowerCase());
        const matchesTag = activeEventTag === 'tots' || event.tags.includes(activeEventTag);
        return matchesSearch && matchesTag;
    });

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
                            } else if (role === 'calendari') {
                                navigate('/calendari');
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
                    <div className="events-container">
                        <div className="events-filter-bar" style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            padding: '10px 0',
                            marginBottom: '20px',
                            borderBottom: '1px solid var(--sdp-glass-border)'
                        }}>
                            <div className="search-wrapper" style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    placeholder="Cerca esdeveniments, llocs..."
                                    value={eventSearch}
                                    onChange={(e) => setEventSearch(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px 12px 40px',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid var(--sdp-glass-border)',
                                        borderRadius: '12px',
                                        color: '#fff',
                                        fontSize: '14px'
                                    }}
                                />
                                <MapIcon size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                            </div>
                            <div className="event-tags-selector flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                                {eventTags.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => setActiveEventTag(tag)}
                                        className={`tag-btn ${activeEventTag === tag ? 'active' : ''}`}
                                        style={{
                                            padding: '6px 16px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                            whiteSpace: 'nowrap',
                                            background: activeEventTag === tag ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.05)',
                                            color: activeEventTag === tag ? '#000' : '#fff',
                                            border: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {tag.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {filteredEvents.length === 0 ? (
                            <div className="empty-state-full py-10 text-center opacity-50">
                                <h3>No hem trobat cap esdeveniment</h3>
                                <p>Prova amb altres paraules o etiquetes.</p>
                            </div>
                        ) : (
                            <div className="events-grid" style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                gap: '20px',
                                padding: '10px 0'
                            }}>
                                {filteredEvents.map(event => (
                                    <UniversalCard
                                        key={event.id}
                                        title={event.title}
                                        subtitle={`${event.location} • ${event.start_time} - ${event.end_time}`}
                                        avatarSrc={event.author_avatar}
                                        avatarName={event.author}
                                        headerTheme="terracotta"
                                        className="event-card animate-in-up"
                                        image={event.image_url?.[0] || "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=1000"}
                                        footer={
                                            <div className="event-card-footer flex justify-between items-center w-full px-2" style={{ padding: '12px 0' }}>
                                                <div className="event-date-badge" style={{
                                                    background: 'var(--color-primary-soft)',
                                                    color: 'var(--color-primary)',
                                                    padding: '4px 12px',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    fontWeight: '800'
                                                }}>
                                                    {new Date(event.date).toLocaleDateString('ca-ES', { day: 'numeric', month: 'long' })}
                                                </div>
                                                <button
                                                    className="btn-enter-town-premium"
                                                    onClick={() => navigate(`/mapa`, { state: { center: event.coordinates } })}
                                                    style={{
                                                        background: 'var(--color-primary)',
                                                        color: '#000',
                                                        padding: '8px 16px',
                                                        borderRadius: '20px',
                                                        fontSize: '12px',
                                                        fontWeight: '900'
                                                    }}
                                                >
                                                    VEURE AL MAPA <MapIcon size={14} style={{ marginLeft: '4px' }} />
                                                </button>
                                            </div>
                                        }
                                    >
                                        <div className="event-description text-sm opacity-90" style={{ padding: '10px 0', minHeight: '60px' }}>
                                            {event.description}
                                        </div>
                                        <div className="event-tags flex gap-2 flex-wrap mt-2">
                                            {event.tags.map(tag => (
                                                <span key={tag} className="tag-pill" style={{
                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '10px',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.5px'
                                                }}>#{tag}</span>
                                            ))}
                                        </div>
                                    </UniversalCard>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                {currentTab === 'rhizome' && (
                    <div className="rhizome-essences animate-in">
                        <section className="essence-hero py-6 text-center border-b border-white/10 mb-8">
                            <h2 className="text-2xl font-black text-primary">RECURSOS DEL SOLATGE</h2>
                            <p className="opacity-70 text-sm">Coneixement local protegit pel protocol Rhizome</p>
                        </section>

                        <div className="essences-grid grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* OLI DE LA TORRE */}
                            <UniversalCard
                                title="Oli de La Torre (Verge Extra)"
                                subtitle="Km0 • Cooperativa • Essències"
                                headerTheme="olive"
                                className="essence-card"
                                image="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=1000"
                                footer={
                                    <div className="px-4 py-3 flex justify-between items-center bg-black/20">
                                        <span className="text-xs font-bold text-success">PRODUCTE PROTEGIT</span>
                                        <button className="text-xs font-black text-primary" onClick={(e) => { e.preventDefault(); navigate('/didactica/oli-de-la-torre'); }}>SABER MÉS</button>
                                    </div>
                                }
                            >
                                <p className="text-sm opacity-90 py-2">
                                    El nostre oli és fill de la muntanya. Produït majoritàriament amb la varietat <strong>Blanqueta</strong>, resistent i noble. L'oli es deixa <em>trastombar</em> naturalment per a separar la <em>morca</em>.
                                </p>
                                <div className="specs-box mt-2 p-3 bg-white/5 border border-white/10 rounded flex justify-between">
                                    <div className="spec text-xs"><strong>Acidesa:</strong> 0.8º</div>
                                    <div className="spec text-xs"><strong>Procés:</strong> Batuda en fred (23ºC)</div>
                                </div>
                            </UniversalCard>

                            {/* ITINERARIS */}
                            <UniversalCard
                                title="Som pa, som oli"
                                subtitle="Itinerari • Gastronòmic • 4h"
                                headerTheme="terracotta"
                                className="essence-card"
                                image="https://images.unsplash.com/photo-1541336032412-2048a678540d?auto=format&fit=crop&q=80&w=1000"
                                footer={
                                    <div className="px-4 py-3 flex justify-between items-center bg-black/20">
                                        <span className="text-xs font-bold">1.3 KM • 3 PARADES</span>
                                        <button className="text-xs font-black text-primary" onClick={(e) => { e.preventDefault(); navigate('/mapa'); }}>VEURE RUTA</button>
                                    </div>
                                }
                            >
                                <p className="text-sm opacity-90 py-2">
                                    Una ruta pels sabors que defineixen la memòria de l'horta.
                                </p>
                                <div className="stops-list flex flex-wrap gap-2 mt-2">
                                    {["Forns de llenya", "Almàssera", "Molí Hidràulic"].map(s => (
                                        <span key={s} className="px-2 py-1 bg-white/5 text-[10px] rounded border border-white/10">{s.toUpperCase()}</span>
                                    ))}
                                </div>
                            </UniversalCard>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Towns;
