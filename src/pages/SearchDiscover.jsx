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

const HighlightText = ({ text, highlight }) => {
    if (!highlight || !text) return <>{text}</>;
    
    // Normalize safely to string and avoid regex injection by escaping
    const safeText = String(text);
    const safeHighlight = String(highlight).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = safeText.split(new RegExp(`(${safeHighlight})`, 'gi'));
    
    return (
        <span>
            {parts.map((part, i) => 
                part.toLowerCase() === highlight.toLowerCase() ? 
                <span key={i} className="bg-[#ff6d23] text-white dark:bg-yellow-500 dark:text-black font-bold px-0.5 rounded-sm">{part}</span> : 
                <span key={i}>{part}</span>
            )}
        </span>
    );
};

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
            <div className="search-nav-bar glass-premium h-[56px] px-4 flex items-center gap-3 border-b border-[var(--theme-border)]">
                <button className="back-circle w-10 h-10 rounded-full bg-theme-panel active:scale-95 hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center justify-center shrink-0 shadow-sm" onClick={() => { hapticService.notifySuccess(); navigate(-1); }}>
                    <ArrowLeft size={22} className="text-theme-text" />
                </button>
                <div className="search-input-wrapper flex-1 relative flex items-center h-10 bg-theme-panel rounded-full shadow-sm focus-within:shadow-md transition-all">
                    <Search className="search-icon-fixed ml-4 text-primary" size={20} />
                    <input
                        id="global-search-input"
                        name="global-search-input"
                        ref={inputRef}
                        type="text"
                        placeholder="BUSCA PEL NOM, OFICI, POBLE..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="main-search-input bg-transparent border-none outline-none w-full h-full pl-12 pr-10 text-lg font-black uppercase text-theme-text placeholder:text-theme-muted"
                    />
                    {query && (
                        <button className="clear-search-btn absolute right-2 w-7 h-7 rounded-full bg-[var(--theme-border)] flex items-center justify-center hover:bg-theme-text/10 transition-all" onClick={clearSearch}>
                            <X size={18} className="text-theme-text" />
                        </button>
                    )}
                </div>
            </div>

            <div className="filter-chips-container w-full overflow-x-auto no-scrollbar border-b border-[var(--theme-border)] bg-theme-bg">
                <div className="flex px-4 py-3 gap-2 min-w-full justify-start sm:justify-center w-max mx-auto">
                    {filters.map((filter, index) => (
                        <React.Fragment key={filter.id}>
                            <button
                                onClick={() => { hapticService.bategat(); setActiveFilter(filter.id); }}
                                className={`flex items-center gap-2 rounded-full font-bold transition-all shadow-sm ${filter.id === 'tots' ? 'text-base px-6 py-2' : 'text-sm px-4 py-1.5 self-center'} ${activeFilter === filter.id ? 'bg-[#ff6d23] text-white' : 'bg-theme-panel text-theme-text hover:bg-black/5 dark:hover:bg-white/5'}`}
                            >
                                {filter.icon}
                                {filter.label}
                            </button>
                            {index === 0 && <div className="w-[2px] h-6 bg-[var(--theme-border)] mx-1 self-center opacity-50 shrink-0" />}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="search-content pt-4">

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
                                                        <div key={person.id} className="bg-theme-card rounded-3xl p-3 mb-2 flex items-center gap-3 active:scale-[0.98] transition-transform select-none cursor-pointer shadow-sm hover:shadow-md" onClick={() => navigate(`/perfil/${person.id}`)}>
                                                            <Avatar
                                                                src={person.avatar_url}
                                                                role="user"
                                                                name={person.full_name}
                                                                size={44}
                                                            />
                                                            <div className="flex flex-col flex-1 min-w-0">
                                                                <span className="text-[17px] font-bold text-[var(--text-main)] truncate leading-tight">
                                                                    <HighlightText text={person.full_name} highlight={query} />
                                                                </span>
                                                                <span className="text-[14px] text-theme-muted font-medium truncate">
                                                                    <HighlightText text={person.role || 'Foraster'} highlight={query} /> {person.primary_town ? <span>• <HighlightText text={person.primary_town} highlight={query} /></span> : ''}
                                                                </span>
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
                                                        <div key={town.id} className="bg-theme-card rounded-3xl p-3 mb-2 flex items-center gap-3 active:scale-[0.98] transition-transform select-none cursor-pointer shadow-sm hover:shadow-md" onClick={() => navigate(`/pobles/${town.uuid || town.id}`)}>
                                                            <Avatar
                                                                src={town.image_url}
                                                                role="oficial"
                                                                name={town.name}
                                                                size={44}
                                                            />
                                                            <div className="flex flex-col flex-1 min-w-0">
                                                                <span className="text-[17px] font-bold text-[var(--text-main)] truncate leading-tight">
                                                                    <HighlightText text={town.name} highlight={query} />
                                                                </span>
                                                                <span className="text-[14px] text-theme-muted font-medium truncate">
                                                                    <HighlightText text={town.comarca} highlight={query} /> {town.province ? <span>• <HighlightText text={town.province} highlight={query} /></span> : ''}
                                                                </span>
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
                                                        <div key={event.id} className="bg-[var(--color-terracotta)] text-white rounded-3xl p-3 mb-2 flex items-center gap-3 active:scale-[0.98] transition-transform select-none cursor-pointer shadow-sm hover:shadow-md hover:brightness-110" onClick={() => navigate('/pobles', { state: { initialTab: 'esdeveniments' } })}>
                                                            <div className="w-[44px] h-[44px] rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                                                <Sparkles size={20} className="text-white" />
                                                            </div>
                                                            <div className="flex flex-col flex-1 min-w-0">
                                                                <span className="text-[17px] font-bold text-white truncate leading-tight">
                                                                    <HighlightText text={event.title} highlight={query} />
                                                                </span>
                                                                <span className="text-[14px] text-white/80 font-medium truncate">
                                                                    <HighlightText text={event.location} highlight={query} /> • {new Date(event.date).toLocaleDateString('ca-ES', { day: 'numeric', month: 'long' })}
                                                                </span>
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

                {/* 3. Empty State Content (Popular Searches) */}
                {
                    isEmpty && (
                        <div className="search-welcome mt-12 pb-12">
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
                            
                            {/* Agents Directory Button */}
                            <div className="w-full max-w-[800px] mx-auto px-4 mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <button 
                                    onClick={() => navigate('/agents')}
                                    className="w-full relative group overflow-hidden rounded-[32px] bg-theme-panel transition-all shadow-xl hover:shadow-[0_0_30px_rgba(249,115,22,0.3)] flex items-center p-6 sm:p-8"
                                >
                                    <div className="absolute inset-0 translate-x-[-100%] group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-[var(--theme-text)]/5 to-transparent skew-x-12"></div>
                                    <div className="absolute -inset-4 rounded-full bg-[var(--theme-accent-primary)] opacity-10 group-hover:opacity-20 blur-2xl transition-opacity duration-700"></div>

                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex-shrink-0 relative mr-4 sm:mr-6 shadow-inner group-hover:scale-105 transition-transform duration-500">
                                        <img src="/assets/avatars/comic/iaia_comic_matriarch.png" alt="IAIA" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                        <h3 className="font-black text-xl sm:text-3xl text-theme-text mb-1 drop-shadow-sm group-hover:text-[var(--theme-accent-primary)] transition-colors">
                                            IAIA i els seus agents intel·ligents
                                        </h3>
                                        <p className="text-theme-muted font-bold text-xs sm:text-sm uppercase tracking-widest truncate max-w-md">L'Equip Sintètic del Mas</p>
                                    </div>
                                    <div className="hidden sm:flex w-12 h-12 rounded-full bg-theme-bg shadow-sm items-center justify-center shrink-0 ml-4 group-hover:bg-[var(--theme-accent-primary)] transition-all">
                                        <ChevronRight size={24} className="text-theme-muted group-hover:text-white transition-colors" />
                                    </div>
                                </button>
                            </div>
                        </div>
                    )
                }
            </div >
        </div >
    );
};

export default SearchDiscover;
