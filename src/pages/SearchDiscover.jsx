import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Users, Building2, MapPin, ArrowLeft, Loader2, Sparkles, SlidersHorizontal, ChevronRight, User } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import './SearchDiscover.css';

const SearchDiscover = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('tots'); // tots, gent, entitats, pobles
    const [results, setResults] = useState({ gent: [], entitats: [], pobles: [] });
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
                setResults({ gent: [], entitats: [], pobles: [] });
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const performSearch = async (q) => {
        setIsSearching(true);
        try {
            // Simulated AI-reinforced global search
            // In a real app, this would call a dedicated edge function with embeddings or similar
            const [gent, entitats, pobles] = await Promise.all([
                supabaseService.searchProfiles(q),
                supabaseService.searchEntities(q),
                supabaseService.searchAllTowns(q)
            ]);

            setResults({
                gent: gent || [],
                entitats: entitats || [],
                pobles: pobles || []
            });
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const clearSearch = () => {
        setQuery('');
        setResults({ gent: [], entitats: [], pobles: [] });
        inputRef.current.focus();
    };

    const filters = [
        { id: 'tots', label: 'Tots', icon: <Sparkles size={14} /> },
        { id: 'gent', label: 'Gent', icon: <Users size={14} /> },
        { id: 'entitats', label: 'Entitats/Grups', icon: <Building2 size={14} /> },
        { id: 'pobles', label: 'Pobles', icon: <MapPin size={14} /> }
    ];

    const isEmpty = !query && results.gent.length === 0 && results.entitats.length === 0 && results.pobles.length === 0;

    return (
        <div className="search-discover-page">
            <div className="search-nav-bar">
                <button className="back-circle" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                </button>
                <div className="search-input-wrapper">
                    <Search className="search-icon-fixed" size={20} />
                    <input
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

                {isSearching ? (
                    <div className="search-loading">
                        <Loader2 className="animate-spin" size={32} />
                        <p>Analitzant l'ecosistema...</p>
                    </div>
                ) : isEmpty ? (
                    <div className="search-welcome">
                        <div className="ai-badge">DISCOVER AI</div>
                        <h2>Explora el teu territori</h2>
                        <p>Troba amics, negocis locals, entitats i tot el que passa als teus pobles.</p>

                        <button className="big-community-btn" onClick={() => navigate('/comunitat')}>
                            <Users size={24} />
                            <div className="btn-text">
                                <strong>La Comunitat</strong>
                                <span>Descobreix tota la gent i entitats del poble</span>
                            </div>
                            <ChevronRight size={20} />
                        </button>

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
                ) : (
                    <div className="search-results-container">
                        {(activeFilter === 'tots' || activeFilter === 'gent') && results.gent.length > 0 && (
                            <section className="result-section">
                                <div className="result-section-header">
                                    <h3>Gent</h3>
                                    <span className="count">{results.gent.length}</span>
                                </div>
                                <div className="results-list">
                                    {results.gent.map(person => (
                                        <div key={person.id} className="result-item-card" onClick={() => navigate(`/perfil/${person.id}`)}>
                                            <div className="result-avatar">
                                                {person.avatar_url ? <img src={person.avatar_url} alt="" /> : <User size={20} />}
                                            </div>
                                            <div className="result-info">
                                                <strong>{person.full_name}</strong>
                                                <span>{person.role || 'Veí'} • {person.town_name || 'La Torre'}</span>
                                            </div>
                                            <ChevronRight size={18} className="chevron" />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {(activeFilter === 'tots' || activeFilter === 'entitats') && results.entitats.length > 0 && (
                            <section className="result-section">
                                <div className="result-section-header">
                                    <h3>Entitats i Negocis</h3>
                                    <span className="count">{results.entitats.length}</span>
                                </div>
                                <div className="results-list">
                                    {results.entitats.map(entity => (
                                        <div key={entity.id} className="result-item-card" onClick={() => navigate(`/entitat/${entity.id}`)}>
                                            <div className="result-avatar entity">
                                                {entity.avatar_url ? <img src={entity.avatar_url} alt="" /> :
                                                    entity.type === 'empresa' ? <Building2 size={20} /> : <Users size={20} />}
                                            </div>
                                            <div className="result-info">
                                                <strong>{entity.name}</strong>
                                                <span>{entity.type.charAt(0).toUpperCase() + entity.type.slice(1)} • {entity.town_name}</span>
                                            </div>
                                            <ChevronRight size={18} className="chevron" />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {(activeFilter === 'tots' || activeFilter === 'pobles') && results.pobles.length > 0 && (
                            <section className="result-section">
                                <div className="result-section-header">
                                    <h3>Pobles</h3>
                                    <span className="count">{results.pobles.length}</span>
                                </div>
                                <div className="results-list">
                                    {results.pobles.map(town => (
                                        <div key={town.id} className="result-item-card" onClick={() => navigate(`/pobles/${town.id}`)}>
                                            <div className="result-avatar town">
                                                <MapPin size={20} />
                                            </div>
                                            <div className="result-info">
                                                <strong>{town.name}</strong>
                                                <span>{town.comarca} • {town.province}</span>
                                            </div>
                                            <ChevronRight size={18} className="chevron" />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {results.gent.length === 0 && results.entitats.length === 0 && results.pobles.length === 0 && (
                            <div className="no-results">
                                <p>No hem trobat resultats per a "<strong>{query}</strong>"</p>
                                <span>Prova amb termes més genèrics o revisa l'ortografia.</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchDiscover;
