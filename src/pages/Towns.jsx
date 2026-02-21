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
import ContextualHeader from '../components/ContextualHeader';
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
                    borderRadius: '0px',
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
    const [townSearch, setTownSearch] = useState('');
    const [viewMode, setViewMode] = useState(localStorage.getItem('towns_view_mode') || 'grid');
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
                logger.log('[Towns] Data bategada des de Supabase:', data?.length, 'pobles trobats.');
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

    const filteredTowns = useMemo(() => {
        if (!townSearch) return towns;
        const normalized = townSearch.toLowerCase();
        return towns.filter(t => 
            t.name?.toLowerCase().includes(normalized) || 
            t.description?.toLowerCase().includes(normalized)
        );
    }, [towns, townSearch]);

    const townTabs = [
        { id: 'pobles', label: t('nav.towns') || 'Pobles' },
        { id: 'esdeveniments', label: t('nav.events') || 'Esdeveniments' },
        { id: 'rhizome', label: 'Essències' },
        { id: 'calendari', label: 'Calendari' },
        { id: 'mapa', label: t('nav.map_tab') || 'Mapa' }
    ];

    const filteredEvents = useMemo(() => {
        return MOCK_EVENTS.filter(event => {
            const matchesSearch = !townSearch || 
                event.title.toLowerCase().includes(townSearch.toLowerCase()) ||
                event.description.toLowerCase().includes(townSearch.toLowerCase()) ||
                event.location.toLowerCase().includes(townSearch.toLowerCase());
            const matchesTag = activeEventTag === 'tots' || event.tags.includes(activeEventTag);
            return matchesSearch && matchesTag;
        });
    }, [townSearch, activeEventTag]);

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
                            "url": `https://socdepoble.org/pobles/${town.uuid || town.id}`,
                            "image": town.image_url
                        }
                    }))
                }}
            />
            {/* Semantic Heading for SEO/A11y */}
            <h1 className="sr-only">{t('towns.title') || 'Xarxa de Pobles Connectats'}</h1>

            <header className="towns-header flex items-center gap-4 px-4">
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors border border-white/10 shrink-0"
                    title="Tornar"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="header-tabs-wrapper flex-1 overflow-hidden">
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

            <ContextualHeader
                searchTerm={townSearch}
                onSearchChange={setTownSearch}
                viewMode={viewMode}
                onViewModeChange={(mode) => {
                    setViewMode(mode);
                    localStorage.setItem('towns_view_mode', mode);
                }}
                placeholder={currentTab === 'esdeveniments' ? "Cerca esdeveniments..." : "Cerca pobles..."}
            />

            <div className="towns-content-area">
                {currentTab === 'pobles' && (
                    <div className={`towns-grid view-mode-${viewMode}`}>
                        {filteredTowns.length > 0 ? (
                            filteredTowns.map(town => {
                                const isUserTown = profile && (town.uuid === profile.town_uuid || town.id === profile.town_id);
                                const lastActiveId = localStorage.getItem('last_active_town_id');
                                const isBating = town.uuid === lastActiveId || String(town.id) === lastActiveId;

                                return (
                                    <Link
                                        key={town.uuid || town.id}
                                        to={`/pobles/${town.uuid || town.id}`}
                                        className={`town-card-link ${isUserTown ? 'is-user-town' : ''}`}
                                    >
                                        <UniversalCard
                                            item={town}
                                            subtitle={town.name}
                                            avatarSrc={town.logo_url}
                                            avatarName={town.name}
                                            className="town-card animate-in-up"
                                            image={town.image_url}
                                            mode="pobles"
                                            isBating={isBating}
                                        >
                                            <div className="town-description-mini text-sm italic opacity-80 line-clamp-2" style={{ padding: '10px 0' }}>
                                                {town.description || 'Explora la saviesa i el batec d\'aquest poble.'}
                                            </div>
                                        </UniversalCard>
                                    </Link>
                                );
                            })
                        ) : (
                            <div className="col-span-full py-20 text-center opacity-50 font-black uppercase tracking-widest">
                                <p>No s'han trobat pobles actius</p>
                                <button 
                                    onClick={() => window.location.reload()} 
                                    className="mt-4 px-6 py-2 border border-white/20 hover:bg-white/10 transition-colors"
                                >
                                    BATEGAR DE NOU
                                </button>
                            </div>
                        )}
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
                            <div className="event-tags-selector flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                                {eventTags.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => setActiveEventTag(tag)}
                                        className={`tag-btn ${activeEventTag === tag ? 'active' : ''}`}
                                        style={{
                                            padding: '6px 16px',
                                            borderRadius: '0px',
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
                            <div className={`events-grid view-mode-${viewMode}`}>
                                {filteredEvents.map(event => (
                                    <UniversalCard
                                        key={event.id}
                                        item={event}
                                        title={event.title}
                                        subtitle={`${event.location} • ${event.start_time} - ${event.end_time}`}
                                        avatarSrc={event.author_avatar}
                                        avatarName={event.author}
                                        className="event-card animate-in-up"
                                        image={event.image_url?.[0] || "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=1000"}
                                        mode="event"
                                    >
                                        <div className="event-description text-sm opacity-90" style={{ padding: '10px 0', minHeight: '60px' }}>
                                            {event.description}
                                        </div>
                                        <div className="event-tags flex gap-2 flex-wrap mt-2">
                                            {event.tags.map(tag => (
                                                <span key={tag} className="tag-pill" style={{
                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                    padding: '2px 8px',
                                                    borderRadius: '0px',
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
