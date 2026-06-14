import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Users, MapPin, Building, Link2, Loader2, Search, ChevronRight } from 'lucide-react';
import { supabaseService } from '../../core/services/supabaseService';
import { geminiService } from '../../core/services/geminiService';
import { raindropService } from '../../core/services/raindropService';
import { MOCK_EVENTS } from '../../data';
import { hapticService } from '../../core/services/hapticService';
import { logger } from '../../utils/logger';
import SEO from '../../components/core/SEO';
import Avatar from '../../components/ui/Avatar';
import SearchNavBar from '../../components/patterns/SearchNavBar';
import './CercaPage.css';
const HighlightText = ({
  text,
  highlight
}) => {
  if (!highlight || !text) return <>{text}</>;
  const safeText = String(text);
  const safeHighlight = String(highlight).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = safeText.split(new RegExp(`(${safeHighlight})`, 'gi'));
  return (
    <span>
              {parts.map((part, i) => part.toLowerCase() === highlight.toLowerCase() ? <span key={i} className='bg-sdp-theme-accent-primary text-white dark:bg-yellow-500 dark:text-black font-bold px-0.5 rounded-sm'>{part}</span> : <span key={i}>{part}</span>)}
          </span>
  );
};
export default function CercaPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Suport natiu per inicialitzar la cerca via URL (?q=...&scope=...)
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  const initialScope = queryParams.get('scope') || 'tots';
  const [query, setQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState(initialScope);
  const [results, setResults] = useState({
    gent: [],
    entitats: [],
    pobles: [],
    arxiu: [],
    esdeveniments: []
  });
  const [searchInsights, setSearchInsights] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);

  // Només mostrem suggeriments si l'usuari no ha buscat res.
  const popularSearches = ['Cocentaina', 'Vicent Ferris', 'Mercat de Muro', 'IAIA'];
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim().length > 1) {
        performSearch(query.trim());
      } else {
        setResults({
          gent: [],
          entitats: [],
          pobles: [],
          arxiu: [],
          esdeveniments: []
        });
        setSearchInsights(null);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Actualitza els paràmetres de la URL silenciósament
  useEffect(() => {
    const currentParams = new URLSearchParams(location.search);
    let changed = false;
    if (query.trim()) {
      currentParams.set('q', query);
      changed = true;
    } else {
      if (currentParams.has('q')) {
        currentParams.delete('q');
        changed = true;
      }
    }
    if (activeFilter !== 'tots') {
      currentParams.set('scope', activeFilter);
      changed = true;
    } else {
      if (currentParams.has('scope')) {
        currentParams.delete('scope');
        changed = true;
      }
    }
    if (changed) {
      navigate({
        search: currentParams.toString()
      }, {
        replace: true
      });
    }
  }, [query, activeFilter, navigate, location.search]);
  const performSearch = async q => {
    setIsSearching(true);
    setSearchInsights(null);
    try {
      const [gent, entitats, pobles, archive, filteredEvents, insights] = await Promise.all([supabaseService.searchProfiles(q), supabaseService.searchEntities(q), supabaseService.searchAllTowns(q), raindropService.getCollection('all'), Promise.resolve(MOCK_EVENTS.filter(e => (e.title?.toLowerCase() || '').includes(q.toLowerCase()) || (e.description?.toLowerCase() || '').includes(q.toLowerCase()) || (e.location?.toLowerCase() || '').includes(q.toLowerCase()))), q.length > 3 ? geminiService.ask('RATO', `Resum breu i amb trellat sobre "${q}" en el context rural valencià, donant-li color local.`) : null]);
      const filteredArchive = (archive || []).filter(item => (item.title?.toLowerCase() || '').includes(q.toLowerCase()) || item.excerpt && (item.excerpt?.toLowerCase() || '').includes(q.toLowerCase()));
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
    setResults({
      gent: [],
      entitats: [],
      pobles: [],
      arxiu: [],
      esdeveniments: []
    });
    setSearchInsights(null);
    hapticService.notifySuccess();
    if (inputRef.current) inputRef.current.focus();
  };
  const filters = [{
    id: 'tots',
    label: 'Tots',
    icon: <Sparkles size={14} />
  }, {
    id: 'gent',
    label: 'Gent',
    icon: <Users size={14} />
  }, {
    id: 'pobles',
    label: 'Pobles',
    icon: <MapPin size={14} />
  }, {
    id: 'esdeveniments',
    label: 'Esdeveniments',
    icon: <Sparkles size={14} />
  }, {
    id: 'entitats',
    label: 'Entitats',
    icon: <Building size={14} />
  }, {
    id: 'arxiu',
    label: 'Arxiu',
    icon: <Link2 size={14} />
  }];
  const isEmpty = !query && results.gent.length === 0 && results.entitats.length === 0 && results.pobles.length === 0 && results.arxiu.length === 0 && results.esdeveniments.length === 0;
  const hasNoResults = query.length > 1 && !isSearching && results.gent.length === 0 && results.entitats.length === 0 && results.pobles.length === 0 && results.arxiu.length === 0 && results.esdeveniments.length === 0;
  return (
    <div className="search-discover-page min-h-screen bg-theme-bg flex flex-col">
              <SEO title={query ? `Cerca: ${query}` : 'Cerca Universal'} description="Explora tot l'ecosistema de Sóc de Poble: persones, entitats, pobles, esdeveniments i arxiu documental." keywords="cerca, buscador, pobles, persones, arxiu, iaia" />
              
              <SearchNavBar query={query} setQuery={setQuery} placeholder="Busca al sistema..." onClear={clearSearch} customIcon={<Search className='text-sdp-theme-accent-primary' size={20} />} inputRef={inputRef} />

              <div className='filter-chips-container w-full overflow-x-auto no-scrollbar border-b border-sdp-theme-border bg-theme-bg sticky top-[60px] z-20 shadow-sm'>
                  <div className="flex px-4 py-3 gap-2 min-w-full justify-start sm:justify-center w-max mx-auto">
                      {filters.map((filter, index) => <React.Fragment key={filter.id}>
                              <button onClick={() => {
              hapticService.bategat();
              setActiveFilter(filter.id);
            }} className={`flex items-center gap-2 rounded-full font-bold transition-all shadow-sm ${filter.id === 'tots' ? 'text-base px-6 py-2' : 'text-sm px-4 py-1.5 self-center'} ${activeFilter === filter.id ? 'bg-[var(--theme-accent-primary)] text-white' : 'bg-theme-panel text-theme-text hover:bg-black/5 dark:hover:bg-white/5'}`}>
                                  {filter.icon}
                                  {filter.label}
                              </button>
                              {index === 0 && <div className='w-[2px] h-6 bg-sdp-theme-border mx-1 self-center opacity-50 shrink-0' />}
                          </React.Fragment>)}
                  </div>
              </div>

              <div className="search-content pt-4 flex-1 w-full max-w-4xl mx-auto px-4 pb-20">
                  {isSearching ? <div className="search-loading flex flex-col items-center justify-center p-12 text-theme-muted">
                          <Loader2 className="animate-spin mb-4" size={32} />
                          <p>Analitzant l'ecosistema...</p>
                      </div> : <>
                          {/* IAIA INTENT ROUTER */}
                          {query && <div className="intent-router-suggestion animate-in fade-in slide-in-from-top-4 mb-4">
                                  {query.toLowerCase().includes('gana') || query.toLowerCase().includes('dinar') || query.toLowerCase().includes('recepta') ? <div className="universal-card bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 border border-orange-200 dark:border-orange-800 p-4 rounded-3xl flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/tools/recipe')}>
                                          <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                                              <Sparkles size={24} className="text-orange-600 dark:text-orange-400" />
                                          </div>
                                          <div className="flex-1">
                                              <h4 className="font-bold text-orange-900 dark:text-orange-100">Vols una recepta?</h4>
                                              <p className="text-sm text-orange-800 dark:text-orange-300">La IAIA té fam i vol anar al rebost.</p>
                                          </div>
                                          <ChevronRight className="text-orange-500" />
                                      </div> : query.toLowerCase().includes('foto') || query.toLowerCase().includes('mira') || query.toLowerCase().includes('ull') ? <div className="universal-card bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border border-blue-200 dark:border-blue-800 p-4 rounded-3xl flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/ia')}>
                                          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                                              <Sparkles size={24} className="text-blue-600 dark:text-blue-400" />
                                          </div>
                                          <div className="flex-1">
                                              <h4 className="font-bold text-blue-900 dark:text-blue-100">Puc veure-ho?</h4>
                                              <p className="text-sm text-blue-800 dark:text-blue-300">Obre l'Ull del Mestre (Visió Artificial).</p>
                                          </div>
                                          <ChevronRight className="text-blue-500" />
                                      </div> : query.toLowerCase().includes('paraula') || query.toLowerCase().includes('què vol dir') ? <div className="universal-card bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 border border-emerald-200 dark:border-emerald-800 p-4 rounded-3xl flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/tools/diccionari')}>
                                          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                                              <Sparkles size={24} className="text-emerald-600 dark:text-emerald-400" />
                                          </div>
                                          <div className="flex-1">
                                              <h4 className="font-bold text-emerald-900 dark:text-emerald-100">Busques una definició?</h4>
                                              <p className="text-sm text-emerald-800 dark:text-emerald-300">Consulta el Diccionari Rural de la IAIA.</p>
                                          </div>
                                          <ChevronRight className="text-emerald-500" />
                                      </div> : null}
                              </div>}

                          {/* SEMANTIC INSIGHTS (SUPER RATOLÍ) */}
                          {searchInsights && <div className='semantic-insight-card bg-theme-panel rounded-[32px] p-5 shadow-sm border border-sdp-theme-border mb-6 animate-in fade-in slide-in-from-bottom-4'>
                                  <div className="flex items-center gap-3 mb-3">
                                      <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]">
                                          <img src="/uploads/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/super_ratoli_tia_style_1770057904274.png" alt="Súper Ratolí" className="w-full h-full object-cover" />
                                      </div>
                                      <div className="flex-1">
                                          <h4 className="font-black text-theme-text text-sm uppercase tracking-wide">Context de l'IAIA</h4>
                                          <div className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400 font-bold px-2 py-0.5 rounded-full inline-block mt-0.5">Insight Actiu</div>
                                      </div>
                                  </div>
                                  <p className="text-[15px] leading-relaxed text-theme-text italic font-medium">"{searchInsights}"</p>
                              </div>}

                          {/* RESULTATS DE LA CERCA */}
                          {!isEmpty ? <div className="search-results-container flex flex-col gap-6">
                                  {filters.filter(f => f.id !== 'tots').map(filter => {
              if (activeFilter !== 'tots' && activeFilter !== filter.id) return null;
              let sectionResults = [];
              let RenderItem = null;
              switch (filter.id) {
                case 'gent':
                  sectionResults = results.gent;
                  RenderItem = ({
                    item
                  }) => <div className='bg-theme-card rounded-[24px] p-3 flex items-center gap-4 active:scale-[0.98] transition-transform select-none cursor-pointer shadow-sm hover:shadow-md border border-sdp-theme-border' onClick={() => navigate(`/gent/${item.id}`)}>
                                                      <Avatar src={item.avatar_url} role="user" name={item.full_name} size={48} />
                                                      <div className="flex flex-col flex-1 min-w-0">
                                                          <span className="text-[17px] font-bold text-theme-text truncate"><HighlightText text={item.full_name} highlight={query} /></span>
                                                          <span className="text-sm text-theme-muted font-medium truncate"><HighlightText text={item.role || 'Foraster'} highlight={query} /> {item.primary_town ? <span>• <HighlightText text={item.primary_town} highlight={query} /></span> : ''}</span>
                                                      </div>
                                                  </div>;
                  break;
                case 'pobles':
                  sectionResults = results.pobles;
                  RenderItem = ({
                    item
                  }) => <div className='bg-theme-card rounded-[24px] p-3 flex items-center gap-4 active:scale-[0.98] transition-transform select-none cursor-pointer shadow-sm hover:shadow-md border border-sdp-theme-border' onClick={() => navigate(`/pobles/${item.id}`)}>
                                                      <Avatar src={item.image_url} role="oficial" name={item.name} size={48} />
                                                      <div className="flex flex-col flex-1 min-w-0">
                                                          <span className="text-[17px] font-bold text-theme-text truncate"><HighlightText text={item.name} highlight={query} /></span>
                                                          <span className="text-sm text-theme-muted font-medium truncate"><HighlightText text={item.comarca} highlight={query} /> {item.province ? <span>• <HighlightText text={item.province} highlight={query} /></span> : ''}</span>
                                                      </div>
                                                  </div>;
                  break;
                case 'esdeveniments':
                  sectionResults = results.esdeveniments;
                  RenderItem = ({
                    item
                  }) => <div className='bg-sdp-color-terracotta text-white rounded-[24px] p-4 flex items-center gap-4 active:scale-[0.98] transition-transform select-none cursor-pointer shadow-sm hover:shadow-md hover:brightness-110' onClick={() => navigate('/pobles', {
                    state: {
                      initialTab: 'esdeveniments'
                    }
                  })}>
                                                      <div className="w-[48px] h-[48px] rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                                          <Sparkles size={24} className="text-white" />
                                                      </div>
                                                      <div className="flex flex-col flex-1 min-w-0">
                                                          <span className="text-[17px] font-bold text-white truncate"><HighlightText text={item.title} highlight={query} /></span>
                                                          <span className="text-sm text-white/80 font-medium truncate"><HighlightText text={item.location} highlight={query} /> • {new Date(item.date).toLocaleDateString('ca-ES', {
                          day: 'numeric',
                          month: 'long'
                        })}</span>
                                                      </div>
                                                  </div>;
                  break;
                case 'entitats':
                  sectionResults = results.entitats;
                  RenderItem = ({
                    item
                  }) => <div className='bg-theme-card rounded-[24px] p-3 flex items-center gap-4 active:scale-[0.98] transition-transform select-none cursor-pointer shadow-sm hover:shadow-md border border-sdp-theme-border' onClick={() => navigate(`/empresa/${item.id}`)}>
                                                      <Avatar src={item.avatar_url} role={item.type} name={item.name} size={48} />
                                                      <div className="flex flex-col flex-1 min-w-0">
                                                          <span className="text-[17px] font-bold text-theme-text truncate"><HighlightText text={item.name} highlight={query} /></span>
                                                          <span className="text-sm text-theme-muted font-medium truncate capitalize">{item.type} {item.town_name ? `• ${item.town_name}` : ''}</span>
                                                      </div>
                                                  </div>;
                  break;
                case 'arxiu':
                  sectionResults = results.arxiu;
                  RenderItem = ({
                    item
                  }) => <div className='bg-theme-panel rounded-[24px] p-4 flex items-start gap-4 active:scale-[0.98] transition-transform select-none cursor-pointer shadow-sm hover:shadow-md border border-sdp-theme-border' onClick={() => window.open(item.link, '_blank')}>
                                                      <div className='w-12 h-12 rounded-full bg-sdp-color-orange-vibrant/10 text-sdp-color-orange-vibrant flex items-center justify-center shrink-0'>
                                                          <Link2 size={24} />
                                                      </div>
                                                      <div className="flex flex-col flex-1 min-w-0 pt-1">
                                                          <span className="text-base font-bold text-theme-text line-clamp-2 leading-tight mb-1"><HighlightText text={item.title} highlight={query} /></span>
                                                          <span className="text-[13px] text-theme-muted font-medium line-clamp-2"><HighlightText text={item.excerpt || 'Document de l\'arxiu'} highlight={query} /></span>
                                                      </div>
                                                  </div>;
                  break;
                default:
                  return null;
              }
              if (sectionResults.length === 0) return null;
              return <section key={filter.id} className="animate-in fade-in slide-in-from-bottom-4">
                                              <div className="flex items-center justify-between mb-3 px-2">
                                                  <h3 className="font-black text-lg text-theme-text flex items-center gap-2">
                                                      {filter.icon}
                                                      {filter.label}
                                                  </h3>
                                                  <span className="bg-theme-surface text-theme-muted text-xs font-bold px-2.5 py-1 rounded-full">{sectionResults.length}</span>
                                              </div>
                                              <div className="flex flex-col gap-2">
                                                  {sectionResults.map(item => <RenderItem key={item.id || item.uuid || item._id} item={item} />)}
                                              </div>
                                          </section>;
            })}
                              </div> : hasNoResults && <div className='flex flex-col items-center justify-center text-center p-12 bg-theme-panel rounded-[32px] border border-sdp-theme-border mt-8 animate-in fade-in'>
                                  <Search size={48} className="text-theme-muted opacity-50 mb-4" />
                                  <h3 className="text-xl font-bold text-theme-text mb-2">Sense resultats</h3>
                                  <p className="text-theme-muted">No hem trobat res per a "<strong className="text-theme-text">{query}</strong>" a la secció {filters.find(f => f.id === activeFilter)?.label.toLowerCase()}.</p>
                                  {activeFilter !== 'tots' && <button onClick={() => setActiveFilter('tots')} className='mt-6 px-6 py-2 bg-sdp-theme-accent-primary text-white rounded-full font-bold shadow-md hover:bg-orange-600 transition-colors'>
                                          Buscar a tot arreu
                                      </button>}
                              </div>}
                      </>}

                  {/* EMPTY STATE - RECOMANACIONS */}
                  {isEmpty && <div className="empty-state-suggestions mt-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                          <div className="mb-8">
                              <h4 className="text-sm font-black text-theme-muted uppercase tracking-wider mb-4 px-2">Cerques Populars</h4>
                              <div className="flex flex-wrap gap-2">
                                  {popularSearches.map(s => <button key={s} className='flex items-center gap-2 px-4 py-2 rounded-full bg-theme-panel border border-sdp-theme-border text-sm font-medium text-theme-text hover:bg-sdp-theme-surface hover:scale-105 transition-all shadow-sm' onClick={() => setQuery(s)}>
                                          <Search size={14} className="text-theme-muted" />
                                          {s}
                                      </button>)}
                              </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <button onClick={() => navigate('/agents')} className="universal-card text-left p-6 flex flex-col items-center sm:flex-row sm:items-start gap-5 data-[active=true]:shadow-lg transition-all group overflow-hidden relative" data-active="false" onPointerEnter={(e) => e.currentTarget.dataset.active = "true"} onPointerLeave={(e) => e.currentTarget.dataset.active = "false"} onPointerCancel={(e) => e.currentTarget.dataset.active = "false"}>
                                  <div className='absolute inset-0 translate-x-[-100%] group-data-[active=true]:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-sdp-theme-text/5 to-transparent skew-x-12'></div>
                                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex-shrink-0 relative shadow-md group-data-[active=true]:scale-105 transition-transform duration-500 overflow-hidden bg-theme-surface" data-active="false" onPointerEnter={(e) => e.currentTarget.dataset.active = "true"} onPointerLeave={(e) => e.currentTarget.dataset.active = "false"} onPointerCancel={(e) => e.currentTarget.dataset.active = "false"}>
                                      <img src="/uploads/avatars/iaia_comic_matriarch.png" alt="IAIA" className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                      <h3 className='font-black text-xl sm:text-2xl text-theme-text mb-2 group-data-[active=true]:text-sdp-theme-accent-primary transition-colors'>
                                          L'Equip Sintètic
                                      </h3>
                                      <p className="text-theme-muted text-sm leading-relaxed">Entra a descobrir com l'IAIA i els seus agents ens ajuden en el dia a dia de Sóc de Poble.</p>
                                  </div>
                              </button>

                              <button onClick={() => navigate('/iaies-mundials')} className="universal-card text-left p-6 flex flex-col items-center sm:flex-row sm:items-start gap-5 data-[active=true]:shadow-lg transition-all group overflow-hidden relative" data-active="false" onPointerEnter={(e) => e.currentTarget.dataset.active = "true"} onPointerLeave={(e) => e.currentTarget.dataset.active = "false"} onPointerCancel={(e) => e.currentTarget.dataset.active = "false"}>
                                  <div className='absolute inset-0 translate-x-[-100%] group-data-[active=true]:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-sdp-theme-text/5 to-transparent skew-x-12'></div>
                                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex-shrink-0 relative shadow-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white group-data-[active=true]:scale-105 transition-transform duration-500" data-active="false" onPointerEnter={(e) => e.currentTarget.dataset.active = "true"} onPointerLeave={(e) => e.currentTarget.dataset.active = "false"} onPointerCancel={(e) => e.currentTarget.dataset.active = "false"}>
                                      <Sparkles size={36} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                      <h3 className="font-black text-xl sm:text-2xl text-theme-text mb-2 group-data-[active=true]:text-blue-500 transition-colors" data-active="false" onPointerEnter={(e) => e.currentTarget.dataset.active = "true"} onPointerLeave={(e) => e.currentTarget.dataset.active = "false"} onPointerCancel={(e) => e.currentTarget.dataset.active = "false"}>
                                          IAIES Mundials
                                      </h3>
                                      <p className="text-theme-muted text-sm leading-relaxed">L'ecosistema global d'Intel·ligències Artificials que mantenen i auditen l'arquitectura del sistema.</p>
                                  </div>
                              </button>
                          </div>
                      </div>}
              </div>
          </div>
  );
}