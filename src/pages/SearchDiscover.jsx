import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Users, Building2, MapPin, ArrowLeft, Loader2, Sparkles, SlidersHorizontal, ChevronRight, User, Landmark, Store, Building, Link2 } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { raindropService } from '../services/raindropService';
import { MOCK_EVENTS } from '../data';
import { hapticService } from '../services/hapticService';
import SEO from '../components/SEO';
import Avatar from '../components/Avatar';
import { logger } from '../utils/logger';
import './SearchDiscover.css';

const SearchDiscover = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('tots'); // tots, gent, entitats, pobles, esdeveniments
    const [results, setResults] = useState({ gent: [], entitats: [], pobles: [], arxiu: [], esdeveniments: [] });
    const [raindropResults, setRaindropResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [recentSearches] = useState(['Cocentaina', 'Vicent Ferris', 'Mercat de Muro']);
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.length > 1) {
                performSearch(query);
            } else {
                setResults({ gent: [], entitats: [], pobles: [], arxiu: [], esdeveniments: [] });
            }
        }, 300); // Faster debouncing for "in-typing" feel

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const performSearch = async (q) => {
        setIsSearching(true);
        try {
            // Simulated AI-reinforced global search
            // In a real app, this would call a dedicated edge function with embeddings or similar
            const [gent, entitats, pobles, archive, filteredEvents] = await Promise.all([
                supabaseService.searchProfiles(q),
                supabaseService.searchEntities(q),
                supabaseService.searchAllTowns(q),
                raindropService.getCollection('all'), // Unified Archive for now
                Promise.resolve(MOCK_EVENTS.filter(e =>
                    e.title.toLowerCase().includes(q.toLowerCase()) ||
                    e.description.toLowerCase().includes(q.toLowerCase()) ||
                    e.location.toLowerCase().includes(q.toLowerCase())
                ))
            ]);

            // Filter archive locally if needed (mock or real)
            const filteredArchive = archive.filter(item =>
                item.title.toLowerCase().includes(q.toLowerCase()) ||
                (item.excerpt && item.excerpt.toLowerCase().includes(q.toLowerCase()))
            );

            setResults({
                gent: gent || [],
                entitats: entitats || [],
                pobles: pobles || [],
                arxiu: filteredArchive || [],
                esdeveniments: filteredEvents || []
            });
        } catch (error) {
            logger.error('Search error:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const clearSearch = () => {
        setQuery('');
        setResults({ gent: [], entitats: [], pobles: [], arxiu: [], esdeveniments: [] });
        hapticService.notifySuccess();
        inputRef.current.focus();
    };

    const filters = [
        { id: 'tots', label: 'Tots', icon: <Sparkles size={14} /> },
        { id: 'gent', label: 'Gent', icon: <Users size={14} /> },
        { id: 'grups', label: 'Grups', icon: <Users size={14} />, type: 'grup' },
        { id: 'empreses', label: 'Empreses', icon: <Store size={14} />, type: 'empresa' },
        { id: 'pobles', label: 'Pobles', icon: <MapPin size={14} /> },
        { id: 'esdeveniments', label: 'Esdeveniments', icon: <Sparkles size={14} /> },
        { id: 'ajuntaments', label: 'Ajuntaments', icon: <Landmark size={14} />, type: 'oficial' },
        { id: 'entitats', label: 'Entitats', icon: <Building size={14} />, type: 'institucio' },
        { id: 'arxiu', label: 'Arxiu', icon: <Link2 size={14} /> }
    ];

    const isEmpty = !query && results.gent.length === 0 && results.entitats.length === 0 && results.pobles.length === 0 && (!results.arxiu || results.arxiu.length === 0);

    return (
        <div className="search-discover-page">
            <SEO
                title={query ? `Cerca: ${query} ` : 'Explora el teu territori'}
                description={query ? `Resultats de cerca per a ${query} a Sóc de Poble.Troba gent, entitats i pobles de la Comunitat Valenciana.` : 'Descobreix la gent, els pobles i les entitats de la teua comunitat.'}
                keywords={query ? `${query}, cerca, pobles, comunitat valenciana` : 'pobles, comunitat valenciana, xarxa social, proximitat'}
            />
            <div className="search-nav-bar">
                <button className="back-circle" onClick={() => { hapticService.notifySuccess(); navigate(-1); }}>
                    <ArrowLeft size={20} />
                </button>
                <div className="search-input-wrapper">
                    <Search className="search-icon-fixed" size={20} />
                    <input
                        id="global-search-input"
                        name="global-search-input"
                        ref={inputRef}
                        type="text"
                        placeholder="Busca pel nom, ofici, poble..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="main-search-input"
                    />
                    {query && (
                        <button className="clear-search-btn" onClick={clearSearch}>
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>

            <div className="search-content">
                {/* 1. Primary Feedback/Results Area (Pushed to the top when searching) */}
                {isSearching ? (
                    <div className="search-loading">
                        <Loader2 className="animate-spin" size={32} />
                        <p>Analitzant l'ecosistema...</p>
                    </div>
                ) : !isEmpty ? (
                    <div className="search-results-container">
                        {filters.filter(f => f.id !== 'tots').map(filter => {
                            if (activeFilter !== 'tots' && activeFilter !== filter.id) return null;

                            // Handle People
                            if (filter.id === 'gent') {
                                if (results.gent.length === 0) return null;
                                return (
                                    <section key="gent" className="result-section">
                                        <div className="result-section-header">
                                            <h3>Gent</h3>
                                            <span className="count">{results.gent.length}</span>
                                        </div>
                                        <div className="results-list">
                                            {results.gent.map(person => (
                                                <div key={person.id} className="universal-card result-item-card" onClick={() => navigate(`/perfil/${person.id}`)}>
                                                    <div className="card-header clickable">
                                                        <div className="header-left">
                                                            <Avatar
                                                                src={person.avatar_url}
                                                                role="user"
                                                                name={person.full_name}
                                                                size={44}
                                                            />
                                                            <div className="post-meta">
                                                                <div className="post-author-row">
                                                                    <span className="post-author">{person.full_name}</span>
                                                                </div>
                                                                <div className="post-town">
                                                                    {person.role || 'Veí'} {person.primary_town ? `• ${person.primary_town} ` : ''}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="header-right">
                                                            <ChevronRight size={18} className="chevron" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                );
                            }

                            // Handle Towns
                            if (filter.id === 'pobles') {
                                if (results.pobles.length === 0) return null;
                                return (
                                    <section key="pobles" className="result-section">
                                        <div className="result-section-header">
                                            <h3>Pobles</h3>
                                            <span className="count">{results.pobles.length}</span>
                                        </div>
                                        <div className="results-list">
                                            {results.pobles.map(town => (
                                                <div key={town.id} className="universal-card result-item-card town" onClick={() => navigate(`/pobles/${town.uuid || town.id}`)}>
                                                    <div className="card-header clickable">
                                                        <div className="header-left">
                                                            <Avatar
                                                                src={town.logo_url}
                                                                role="oficial"
                                                                name={town.name}
                                                                size={44}
                                                            />
                                                            <div className="post-meta">
                                                                <div className="post-author-row">
                                                                    <span className="post-author">{town.name}</span>
                                                                </div>
                                                                <div className="post-town">
                                                                    {town.comarca} {town.province ? `• ${town.province} ` : ''}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="header-right">
                                                            <ChevronRight size={18} className="chevron" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                );
                            }

                            // Handle Events
                            if (filter.id === 'esdeveniments') {
                                if (results.esdeveniments.length === 0) return null;
                                return (
                                    <section key="esdeveniments" className="result-section">
                                        <div className="result-section-header">
                                            <h3>Agenda Festera</h3>
                                            <span className="count">{results.esdeveniments.length}</span>
                                        </div>
                                        <div className="results-list">
                                            {results.esdeveniments.map(event => (
                                                <div key={event.id} className="universal-card result-item-card event" onClick={() => navigate('/pobles', { state: { initialTab: 'esdeveniments' } })}>
                                                    <div className="card-header clickable" style={{ background: 'var(--color-terracotta)' }}>
                                                        <div className="header-left">
                                                            <div className="post-avatar event" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', width: '44px', height: '44px' }}>
                                                                <Sparkles size={20} color="#fff" />
                                                            </div>
                                                            <div className="post-meta">
                                                                <div className="post-author-row">
                                                                    <span className="post-author" style={{ color: '#fff' }}>{event.title}</span>
                                                                </div>
                                                                <div className="post-town" style={{ color: 'rgba(255,255,255,0.8)' }}>
                                                                    {event.location} • {new Date(event.date).toLocaleDateString('ca-ES', { day: 'numeric', month: 'long' })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="header-right">
                                                            <ChevronRight size={18} className="chevron" color="#fff" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                );
                            }

                            // Handle Archive (Raindrop)
                            if (filter.id === 'arxiu') {
                                if (results.arxiu.length === 0) return null;
                                return (
                                    <section key="arxiu" className="result-section archive-section">
                                        <div className="result-section-header">
                                            <h3>Arxiu Documental (L'Espill del Temps)</h3>
                                            <span className="count">{results.arxiu.length}</span>
                                        </div>
                                        <div className="results-list">
                                            {results.arxiu.map(item => (
                                                <div key={item.uuid || item._id} className="universal-card result-item-card archive-item" onClick={() => window.open(item.link, '_blank')}>
                                                    <div className="card-header clickable">
                                                        <div className="header-left">
                                                            <div className="post-avatar archive" style={{ backgroundColor: 'var(--color-bg-dark)', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', overflow: 'hidden', width: '44px', height: '44px' }}>
                                                                <Link2 size={24} style={{ color: 'var(--color-orange-vibrant)' }} />
                                                            </div>
                                                            <div className="post-meta">
                                                                <div className="post-author-row">
                                                                    <span className="post-author">{item.title}</span>
                                                                </div>
                                                                <div className="post-town">
                                                                    {item.excerpt ? item.excerpt.substring(0, 80) + '...' : 'Document de l\'Arxiu'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="header-right">
                                                            <ChevronRight size={18} className="chevron" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                );
                            }

                            // Handle Categorized Entities
                            const filteredEntities = results.entitats.filter(e => e.type === filter.type);
                            if (filteredEntities.length === 0) return null;

                            return (
                                <section key={filter.id} className="result-section">
                                    <div className="result-section-header">
                                        <h3>{filter.label}</h3>
                                        <span className="count">{filteredEntities.length}</span>
                                    </div>
                                    <div className="results-list">
                                        {filteredEntities.map(entity => (
                                            <div key={entity.id} className={`universal-card result-item-card entity-${entity.type}`} onClick={() => navigate(`/entitat/${entity.id}`)}>
                                                <div className="card-header clickable">
                                                    <div className="header-left">
                                                        <Avatar
                                                            src={entity.avatar_url}
                                                            role={entity.type}
                                                            name={entity.name}
                                                            size={44}
                                                        />
                                                        <div className="post-meta">
                                                            <div className="post-author-row">
                                                                <span className="post-author">{entity.name}</span>
                                                            </div>
                                                            <div className="post-town">
                                                                {entity.type.charAt(0).toUpperCase() + entity.type.slice(1)} {entity.town_name ? `• ${entity.town_name} ` : ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="header-right">
                                                        <ChevronRight size={18} className="chevron" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            );
                        })}

                        {/* [SUPER-SEARCH: EXTERNAL FEDERATION] */}
                        {query.length > 2 && (
                            <section className="result-section external-federation">
                                <div className="result-section-header">
                                    <h3>Coneixement Territorial (Extern)</h3>
                                    <span className="badge-iaia">IAIA Verified</span>
                                </div>
                                <div className="external-links-list">
                                    <div key="ext-ivia" className="universal-card result-item-card external" onClick={() => window.open(`https://www.google.com/search?q=IVIA+${query}`, '_blank')}>
                                        <div className="card-header clickable">
                                            <div className="header-left">
                                                <div className="post-avatar external">
                                                    <Link2 size={24} color="var(--color-primary)" />
                                                </div>
                                                <div className="post-meta">
                                                    <div className="post-author-row">
                                                        <span className="post-author">Consulta IVIA: {query}</span>
                                                    </div>
                                                    <div className="post-town">Institut Valencià d'Investigacions Agràries</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div >
                                    <div key="ext-aemet" className="universal-card result-item-card external" onClick={() => window.open(`https://www.aemet.es/ca/eltiempo/prediccion/municipios?q=${query}`, '_blank')}>
                                        <div className="card-header clickable">
                                            <div className="header-left">
                                                <div className="post-avatar external">
                                                    <Link2 size={24} color="var(--color-primary)" />
                                                </div>
                                                <div className="post-meta">
                                                    <div className="post-author-row">
                                                        <span className="post-author">Previsió AEMET: {query}</span>
                                                    </div>
                                                    <div className="post-town">Agència Estatal de Meteorologia</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div >
                            </section >
                        )}
                    </div >
                ) : query.length > 1 && !isSearching && (
                    <div className="no-results-top-vibrant">
                        <p>No hem trobat resultats per a "<strong>{query}</strong>"</p>
                        <span>Prova amb termes més genèrics o revisa l'ortografia.</span>
                    </div>
                )}

                {/* 2. Standard Action Block (Displaced downward when searching) */}
                <button className="big-community-btn-xl" onClick={() => navigate('/comunitat')}>
                    <div className="btn-icon-xl">
                        <Users size={32} />
                    </div>
                    <div className="btn-text-xl">
                        <strong>Explora el teu territori</strong>
                        <span>Descobreix tota la gent i entitats del poble</span>
                    </div>
                    <ChevronRight size={24} />
                </button>

                <div className="filter-chips-scroll">
                    {filters.map(filter => (
                        <button
                            key={filter.id}
                            className={`filter-chip ${activeFilter === filter.id ? 'active' : ''}`}
                            onClick={() => setActiveFilter(filter.id)}
                        >
                            {filter.icon}
                            <span>{filter.label}</span>
                        </button>
                    ))}
                </div>

                {/* 3. Empty State Content (Popular Searches) */}
                {
                    isEmpty && (
                        <div className="search-welcome">
                            <div className="recent-searches">
                                <h4>Cerques populars</h4>
                                <div className="recent-list">
                                    {recentSearches.map(s => (
                                        <button key={s} className="recent-item" onClick={() => setQuery(s)}>
                                            <Search size={14} />
                                            <span>{s}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                }
            </div >
        </div >
    );
};

export default SearchDiscover;
