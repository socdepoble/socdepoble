import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Users, Building2, MapPin, ArrowLeft, Loader2, Sparkles, SlidersHorizontal, ChevronRight, User, Landmark, Store, Building, Link2 } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { geminiService } from '../services/geminiService';
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
    const [searchInsights, setSearchInsights] = useState(null);
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
        setSearchInsights(null);
        try {
            // [INTENT ROUTER OMEGA]
            // ... results logic ...
            const [gent, entitats, pobles, archive, filteredEvents, insights] = await Promise.all([
                supabaseService.searchProfiles(q),
                supabaseService.searchEntities(q),
                supabaseService.searchAllTowns(q),
                raindropService.getCollection('all'), // Unified Archive for now
                Promise.resolve(MOCK_EVENTS.filter(e =>
                    (e.title?.toLowerCase() || '').includes(q.toLowerCase()) ||
                    (e.description?.toLowerCase() || '').includes(q.toLowerCase()) ||
                    (e.location?.toLowerCase() || '').includes(q.toLowerCase())
                )),
                q.length > 3 ? geminiService.ask('RATO', `Resum breu i amb trellat sobre "${q}" en el context rural valencià.`) : null
            ]);

            // Filter archive locally if needed (mock or real)
            const filteredArchive = archive.filter(item =>
                (item.title?.toLowerCase() || '').includes(q.toLowerCase()) ||
                (item.excerpt && (item.excerpt?.toLowerCase() || '').includes(q.toLowerCase()))
            );

            setResults({
                gent: gent || [],
                entitats: entitats || [],
                pobles: pobles || [],
                arxiu: filteredArchive || [],
                esdeveniments: filteredEvents || []
            });
            if (insights && !insights.error) {
                setSearchInsights(insights.text);
            }
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
            <div className="search-nav-bar glass-premium h-20 px-4 flex items-center gap-4">
                <button className="back-circle w-14 h-14 rounded-[28px] border border-white/10 bg-white/5 active:scale-95 hover:bg-white/10 transition-all flex items-center justify-center shrink-0" onClick={() => { hapticService.notifySuccess(); navigate(-1); }}>
                    <ArrowLeft size={28} className="text-white" />
                </button>
                <div className="search-input-wrapper flex-1 relative flex items-center h-14 bg-white/10 rounded-[28px] border-2 border-white/10 focus-within:border-primary/50 transition-all">
                    <Search className="search-icon-fixed ml-5 text-primary" size={24} />
                    <input
                        id="global-search-input"
                        name="global-search-input"
                        ref={inputRef}
                        type="text"
                        placeholder="BUSCA PEL NOM, OFICI, POBLE..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="main-search-input bg-transparent border-none outline-none w-full h-full pl-14 pr-12 text-xl font-black uppercase tracking-tight text-white placeholder:text-white/20"
                    />
                    {query && (
                        <button className="clear-search-btn absolute right-4 w-8 h-8 rounded-[28px] bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all" onClick={clearSearch}>
                            <X size={18} className="text-white" />
                        </button>
                    )}
                </div>
                <button 
                    className={`filter-toggle-btn w-14 h-14 rounded-full border border-white/10 bg-white/5 active:scale-95 transition-all flex items-center justify-center shrink-0 ${activeFilter !== 'tots' ? 'text-primary border-primary/50' : 'text-white'}`}
                    onClick={() => {
                        hapticService.bategat();
                        const nextFilter = activeFilter === 'tots' ? 'gent' : 
                                         activeFilter === 'gent' ? 'pobles' :
                                         activeFilter === 'pobles' ? 'esdeveniments' : 'tots';
                        setActiveFilter(nextFilter);
                    }}
                >
                    <SlidersHorizontal size={24} />
                </button>
            </div>

            <div className="search-content">
                {activeFilter !== 'tots' && (
                    <div className="active-filter-indicator px-6 py-2 bg-primary/10 border-b border-primary/20 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Filtre actiu: {filters.find(f => f.id === activeFilter)?.label}</span>
                        <button onClick={() => setActiveFilter('tots')} className="text-[10px] font-black uppercase text-white/50">Netejar</button>
                    </div>
                )}

                {/* 1. Primary Feedback/Results Area (Pushed to the top when searching) */}
                {isSearching ? (
                    <div className="search-loading">
                        <Loader2 className="animate-spin" size={32} />
                        <p>Analitzant l'ecosistema...</p>
                    </div>
                ) : (
                    <>
                        {/* IAIA INTENT ROUTER SUGGESTION OMEGA */}
                        {query && (
                            <div className="intent-router-suggestion animate-in">
                                {(query.toLowerCase().includes('gana') || query.toLowerCase().includes('dinar') || query.toLowerCase().includes('recepta')) ? (
                                    <div className="intent-card glass-premium iaia-router" onClick={() => navigate('/tools/recipe')}>
                                        <Sparkles size={20} className="text-[#5D5FEF]" />
                                        <div className="intent-text">
                                            <strong>La IAIA t'ajuda: "Vols una recepta?"</strong>
                                            <span>Obrir el Rebost de la IAIA</span>
                                        </div>
                                    </div>
                                ) : (query.toLowerCase().includes('foto') || query.toLowerCase().includes('mira') || query.toLowerCase().includes('ull')) ? (
                                    <div className="intent-card glass-premium iaia-router" onClick={() => navigate('/ia')}>
                                        <Sparkles size={20} className="text-[#5D5FEF]" />
                                        <div className="intent-text">
                                            <strong>L'Ull de la IAIA: "Puc veure-ho?"</strong>
                                            <span>Analitzar imatge amb l'IAIA</span>
                                        </div>
                                    </div>
                                ) : (query.toLowerCase().includes('paraula') || query.toLowerCase().includes('què vol dir')) ? (
                                    <div className="intent-card glass-premium iaia-router" onClick={() => navigate('/tools/diccionari')}>
                                        <Sparkles size={20} className="text-[#5D5FEF]" />
                                        <div className="intent-text">
                                            <strong>Diccionari Rural: "T'ho explique?"</strong>
                                            <span>Significat de paraules del carrer</span>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        )}

                        {/* SUPER RATOLÍ SEMANTIC INSIGHTS */}
                        {searchInsights && (
                            <div className="semantic-insight-card animate-in">
                                <div className="insight-header">
                                    <div className="hero-avatar small ratoli-glow">
                                        <img src="/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/super_ratoli_tia_style_1770057904274.png" alt="Súper Ratolí" />
                                    </div>
                                    <div className="insight-title-row">
                                        <h4>Coneixement de Súper Ratolí</h4>
                                        <span className="badge-iaia">Insight Bategat</span>
                                    </div>
                                </div>
                                <p className="insight-text">"{searchInsights}"</p>
                            </div>
                        )}

                        {!isEmpty ? (
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
                                                                            {person.role || 'Foraster'} {person.primary_town ? `• ${person.primary_town} ` : ''}
                                                                        </div>
                                                                    </div>
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
                                                                        src={town.image_url}
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
                                            </div>
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
                                        </div>
                                    </section>
                                )}
                            </div>
                        ) : query.length > 1 && !isSearching && (
                            <div className="no-results-top-vibrant">
                                <p>No hem trobat resultats per a "<strong>{query}</strong>"</p>
                                <span>Prova amb termes més genèrics o revisa l'ortografia.</span>
                            </div>
                        )}
                    </>
                )}

                {/* 2. Standard Action Block (Displaced downward when searching) */}
                <div className="search-bottom-actions py-12 flex justify-center">
                    <button className="big-community-btn-xl max-w-[640px] w-full" onClick={() => navigate('/comunitat')}>
                        <div className="btn-icon-xl">
                            <Users size={32} />
                        </div>
                        <div className="btn-text-xl">
                            <strong>Explora el teu territori</strong>
                            <span>Descobreix tota la gent i entitats del poble</span>
                        </div>
                    </button>
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
