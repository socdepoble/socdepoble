import { useState, useEffect, useMemo, useRef } from "react";
import { supabaseService } from "../../core/services/supabaseService";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from 'react-router-dom';
import { MapIcon, Info, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { UniversalGridWrapper, UniversalGridRow } from '../../components/ui/UniversalGrid';
import UniversalCard from '../../components/ui/universal-card';
import StatusLoader from '../../components/ui/StatusLoader';
import SEO from '../../components/core/SEO';
import { useAuth } from "../../app/context/AuthContext";
import ContextualHeader from '../../components/layout/ContextualHeader';
import { logger } from "../../utils/logger";
import { MOCK_EVENTS } from "../../data";
import WIKI_SUMMARIES from "../../data/wikipedia_summaries.json";
import { useViewMode } from "../../hooks/useViewMode";
import { useAllTownProposals } from "../../hooks/useAllTownProposals";
import "./Towns.css";

const TownLocalEnricher = ({ town, winningProposal, children }) => {
  const cleanTownName = town.name.replace("La Torre de les Maçanes", "La Torre");
  const sluggify = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  const townHandle = sluggify(cleanTownName);
  const localImageUrl = `/assets/uploads/poble/${townHandle}/cover.jpg`;
  const wikiSummary = WIKI_SUMMARIES[townHandle];
  const finalImageUrl = winningProposal?.image_url || ((town.avatar_url && town.avatar_url !== 'EMPTY') ? town.avatar_url : localImageUrl);
  const finalLema = winningProposal?.lema ? `${town.comarca}. ${winningProposal.lema}` : (town.comarca || 'Comunitat Valenciana');
  const finalDescription = winningProposal?.description || wikiSummary || town.description || `Poble de la comarca de ${town.comarca || 'la Comunitat Valenciana'}`;

  const enrichedTown = {
    ...town,
    image_url: finalImageUrl,
    escudo_url: town.escudo_url,
    comarca: finalLema,
    description: finalDescription,
    wiki_url: `https://ca.wikipedia.org/wiki/${encodeURIComponent(town.name)}`,
  };

  return children(enrichedTown);
};

const formatComarca = (comarca) => {
    if (!comarca) return 'Comunitat Valenciana';
    const c = comarca.toLowerCase();
    if (c === 'safor' || c === 'la safor') return 'La Safor';
    if (c === 'costera' || c === 'la costera') return 'La Costera';
    if (c === 'comtat' || c === 'el comtat') return 'El Comtat';
    if (c === 'ribera alta' || c === 'la ribera alta') return 'La Ribera Alta';
    if (c === 'ribera baixa' || c === 'la ribera baixa') return 'La Ribera Baixa';
    if (c === 'marina alta' || c === 'la marina alta') return 'La Marina Alta';
    if (c === 'marina baixa' || c === 'la marina baixa') return 'La Marina Baixa';
    if (c === 'alt vinalopó' || c === "l'alt vinalopó") return "L'Alt Vinalopó";
    if (c === 'alacantí' || c === "l'alacantí") return "L'Alacantí";
    if (c === 'alcoià' || c === "l'alcoià") return "L'Alcoià";
    return comarca;
};

const formatGentDe = (townName) => {
    if (!townName) return 'Gent de Poble';
    if (townName === 'La Torre de les Maçanes') return 'Gent de la Torre';
    const firstChar = townName.charAt(0).toUpperCase();
    if (['A', 'E', 'I', 'O', 'U', 'H'].includes(firstChar)) {
        return `Gent d'${townName}`;
    }
    return `Gent de ${townName}`;
};

const Towns = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();
  const { winningProposalsMap } = useAllTownProposals();

  const [towns, setTowns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'pobles';
  const [townSearch, setTownSearch] = useState("");
  const { viewMode, setViewMode, columnCount, containerRef } = useViewMode("towns_view_mode", "grid");
  
  const [showWikiBanner, setShowWikiBanner] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("hide_wiki_banner") !== "true";
    }
    return true;
  });

  const handleDismissWikiBanner = () => {
    setShowWikiBanner(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("hide_wiki_banner", "true");
    }
  };

  const searchRef = useRef(null);

  useEffect(() => {
    const fetchTowns = async () => {
      setError(null);
      const localData = localStorage.getItem("lc_towns_all");
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          if (parsed && Array.isArray(parsed)) {
            setTowns(parsed);
            setLoading(false);
          }
        } catch (e) {
          logger.warn("[Towns] Error en Instant Load:", e);
        }
      }

      try {
        const data = await supabaseService.getTowns();
        setTowns(data);
        localStorage.setItem("lc_towns_all", JSON.stringify(data));
      } catch (error) {
        logger.error("Error loading towns:", error);
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
    return towns.filter(
      (t) =>
        t.name?.toLowerCase().includes(normalized) ||
        t.description?.toLowerCase().includes(normalized),
    );
  }, [towns, townSearch]);

  const filteredEvents = useMemo(() => {
    if (!townSearch) return MOCK_EVENTS;
    const normalizedSearch = townSearch.toLowerCase();
    return MOCK_EVENTS.filter((event) => {
      return event.title.toLowerCase().includes(normalizedSearch) ||
        event.description.toLowerCase().includes(normalizedSearch) ||
        event.location.toLowerCase().includes(normalizedSearch);
    });
  }, [townSearch]);

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
    <div className="flex-1 flex flex-col w-full min-h-0 towns-page-container bg-gray-50">
      <SEO
        title={t("towns.title") || "Els Pobles"}
        description={t("towns.description") || "Explora la xarxa de pobles connectats i descobreix el que els fa únics."}
        image="/og-pobles.png"
        structuredData={{
          "@type": "ItemList",
          name: "Pobles de la Comunitat",
          itemListElement: towns.slice(0, 10).map((town, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "AdministrativeArea",
              name: town.name,
              url: `https://socdepoble.org/pobles/${town.id}`,
              image: town.avatar_url && town.avatar_url !== 'EMPTY' ? town.avatar_url : town.escudo_url,
            },
          })),
        }}
      />
      <h1 className="sr-only">
        {t("towns.title") || "Xarxa de Pobles Connectats"}
      </h1>

      <div className="flex-none w-full z-50 shadow-sm bg-white">
          <ContextualHeader
            ref={searchRef}
            searchTerm={townSearch}
            onSearchChange={setTownSearch}
            viewMode={viewMode}
            onViewModeChange={(mode) => {
              setViewMode(mode);
            }}
            placeholder={currentTab === "esdeveniments" ? "Cerca esdeveniments..." : "Cerca pobles..."}
          />
      </div>

      {showWikiBanner && currentTab === "pobles" && (
        <div className="flex-none w-full bg-orange-50 border-b border-orange-100 px-3 py-2 flex items-center justify-between gap-3 shadow-sm z-40">
          <div className="flex items-center gap-2 flex-1 min-w-0 md:max-w-4xl mx-auto">
             <Info size={18} className="text-orange-500 flex-shrink-0" />
             <p className="text-[11px] sm:text-xs text-gray-800 leading-tight md:whitespace-normal mb-0 m-0">
               <span className="font-black mr-1 hidden sm:inline">Patrimoni Obert Connectat:</span> 
               Dades i imatges enriquides gràcies a <a href="https://ca.wikipedia.org" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline font-bold">Wikipedia</a> i <a href="https://commons.wikimedia.org" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline font-bold">Wikimedia Commons</a> (<a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer" className="underline text-orange-500 hover:text-orange-600">CC BY-SA 4.0</a>). La memòria no es destrueix, es comparteix.
             </p>
          </div>
          <button 
            onClick={handleDismissWikiBanner}
            className="flex-shrink-0 text-gray-400 hover:text-orange-500 transition-colors bg-white rounded-lg p-1 border border-gray-200"
            aria-label="Tancar avís"
            title="Tancar i no tornar a mostrar"
          >
            <X size={36} strokeWidth={2.5} />
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar" ref={containerRef}>
        {currentTab === "pobles" && (
          <UniversalGridWrapper viewMode={viewMode}>
            <UniversalGridRow viewMode={viewMode} columnCount={columnCount} className="pb-8">
              {filteredTowns.length > 0 ? (
                filteredTowns.map((town) => {
                  const isUserTown = profile && (town.id === profile.town_uuid);
                  const lastActiveId = localStorage.getItem("last_active_town_id");
                  const isBating = town.id === lastActiveId;
                  const townProposal = winningProposalsMap?.[town.id || town.uuid];

                  return (
                    <TownLocalEnricher key={town.id} town={town} winningProposal={townProposal}>
                      {(enrichedTown) => (
                          <UniversalCard
                            item={enrichedTown}
                            subtitle={formatComarca(enrichedTown.comarca)}
                            avatarSrc={enrichedTown.image_url}
                            avatarName={formatGentDe(enrichedTown.name)}
                            excerpt={enrichedTown.description || "Explora la saviesa i el batec d'aquest poble."}
                            className={`town-card animate-in w-full bg-white ${isUserTown ? "ring-2 ring-orange-500 shadow-sm" : ""}`}
                            image={enrichedTown.image_url}
                            mode="pobles"
                            isBating={isBating}
                            viewMode={viewMode}
                            onNavigate={() => {
                                const cleanTownName = enrichedTown.name.replace("La Torre de les Maçanes", "La Torre");
                                const sluggify = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]/g, '');
                                const townHandle = sluggify(cleanTownName);
                                navigate(`/pobles/${townHandle}`);
                            }}
                          >
                            {enrichedTown.wiki_url && (
                                <div className="mt-3 mb-1 w-full flex justify-center">
                                    <a 
                                      href={enrichedTown.wiki_url} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="text-[14px] md:text-[15px] font-black text-orange-500 hover:underline transition-opacity text-center m-0"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      Llegir l'article sencer a Wikipedia ↗
                                    </a>
                                </div>
                            )}
                          </UniversalCard>
                      )}
                    </TownLocalEnricher>
                  );
                })
              ) : (
                <div className="col-span-full py-20 text-center opacity-50 font-black uppercase tracking-widest text-gray-500">
                  <p className="m-0">No s'han trobat pobles actius</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    BATEGAR DE NOU
                  </button>
                </div>
              )}
            </UniversalGridRow>
          </UniversalGridWrapper>
        )}

        {currentTab === "esdeveniments" && (
          <div className="events-container p-4">
            <div className="calendar-widget-wrapper mb-6 bg-white p-4 md:p-6 rounded-[28px] border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6 px-2">
                    <button className="p-3 hover:bg-gray-100 rounded-full transition-colors text-gray-500"><ChevronLeft size={24}/></button>
                    <span className="font-black tracking-widest text-[16px] md:text-[18px] text-gray-900 m-0">MARÇ 2026</span>
                    <button className="p-3 hover:bg-gray-100 rounded-full transition-colors text-gray-500"><ChevronRight size={24}/></button>
                </div>
                
                <div className="grid grid-cols-7 gap-1 md:gap-2 text-center mb-3 text-gray-400">
                    {['DL', 'DT', 'DC', 'DJ', 'DV', 'DS', 'DG'].map(d => (
                        <div key={d} className="text-[12px] md:text-[14px] font-black opacity-50 mb-2 m-0">{d}</div>
                    ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1 md:gap-2 text-center">
                    {[...Array(6)].map((_, i) => <div key={`empty-${i}`} className="p-2 md:p-3"/>)}
                    
                    {[...Array(31)].map((_, i) => {
                        const day = i + 1;
                        const hasEvent = [1, 2, 10, 15, 28].includes(day); 
                        const isToday = day === 23;
                        return (
                            <button
                                key={day}
                                className={`relative flex flex-col items-center justify-center p-2 h-12 w-full sm:h-14 rounded-[16px] text-[16px] md:text-[18px] font-bold transition-all hover:scale-105 active:scale-95 ${hasEvent ? 'bg-orange-50 text-orange-600 font-black' : 'text-gray-700 hover:bg-gray-100'} ${isToday ? 'ring-2 ring-orange-500 ring-offset-2' : ''}`}
                            >
                                {day}
                                {hasEvent && <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-orange-500"></div>}
                            </button>
                        );
                    })}
                </div>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="empty-state-full py-10 text-center text-gray-400">
                <h3 className="font-black text-lg m-0 mb-2">No hem trobat cap esdeveniment</h3>
                <p className="m-0">Prova amb altres paraules o etiquetes.</p>
              </div>
            ) : (
              <UniversalGridWrapper viewMode={viewMode} className="pt-6">
                <UniversalGridRow viewMode={viewMode} columnCount={columnCount} className="pb-8">
                  {filteredEvents.map((event) => (
                        <UniversalCard
                          key={event.id}
                          item={event}
                          title={event.title}
                          subtitle={`${event.location} • ${event.start_time} - ${event.end_time}`}
                          avatarSrc={event.author_avatar}
                          avatarName={event.author}
                          className="event-card animate-in-up w-full bg-white"
                          image={event.image_url?.[0] || "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=1000"}
                          mode="event"
                          viewMode={viewMode}
                        >
                          <div className="event-description text-sm text-gray-600" style={{ padding: "10px 0", minHeight: "60px" }}>
                            {event.description}
                          </div>
                          <div className="event-tags flex gap-2 flex-wrap mt-2">
                            {event.tags.map((tag) => (
                              <span key={tag} className="tag-pill px-2 py-1 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-wider rounded-lg border border-gray-200 m-0">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </UniversalCard>
                  ))}
                </UniversalGridRow>
              </UniversalGridWrapper>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Towns;
