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

// ----------------------------------------------------------------------
// TownLocalEnricher: Carga instantánea de imágenes locales y propostes d'identitat
// ----------------------------------------------------------------------
const TownLocalEnricher = ({ town, winningProposal, children }) => {
  const cleanTownName = town.name.replace("La Torre de les Maçanes", "La Torre");
  const sluggify = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  const townHandle = sluggify(cleanTownName);
  
  // Utiliza la imagen local descargada del script de petorretas
  const localImageUrl = `/assets/uploads/poble/${townHandle}/cover.jpg`;
  const wikiSummary = WIKI_SUMMARIES[townHandle];

  // Combina la info del poble amb la proposta guanyadora si n'hi ha
  const finalImageUrl = winningProposal?.image_url || ((town.avatar_url && town.avatar_url !== 'EMPTY') ? town.avatar_url : localImageUrl);
  const finalLema = winningProposal?.lema ? `${town.comarca}. ${winningProposal.lema}` : (town.comarca || 'Comunitat Valenciana');
  const finalDescription = winningProposal?.description || wikiSummary || town.description || `Poble de la comarca de ${town.comarca || 'la Comunitat Valenciana'}`;

  const enrichedTown = {
    ...town,
    image_url: finalImageUrl,
    escudo_url: town.escudo_url,
    comarca: finalLema, // Passem el lema com a comarca per a que isca on toca
    description: finalDescription,
    wiki_url: `https://ca.wikipedia.org/wiki/${encodeURIComponent(town.name)}`,
  };

  return children(enrichedTown);
};
// ----------------------------------------------------------------------

const TownLogo = ({ url, name }) => {
  const [error, setError] = useState(false);

  if (!url || error) {
    return (
      <div
        className="flex items-center justify-center w-full h-full"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "0px",
          border: "1px solid var(--sdp-glass-border)",
        }}
      >
        <MapIcon
          size={24}
          style={{ color: "var(--color-primary)", opacity: 0.5 }}
        />
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={`Escut de ${name}`}
      className="town-logo-img"
      style={{ width: "100%", height: "100%", objectFit: "contain" }}
      onError={() => setError(true)}
    />
  );
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
    
    // Si comença per vocal o hac, s'apostrofa en valencià
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
  
  // Connect to the unified CRDT hooks
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

      // [PILAR 1: INSTANT LOAD TOWNS]
      const localData = localStorage.getItem("lc_towns_all");
      if (localData) {
        try {
          const parsed = JSON.parse(localData);
          if (parsed && Array.isArray(parsed)) {
            logger.log(
              "[Towns] Instant Load: Bategant llista de pobles des del solatge...",
            );
            setTowns(parsed);
            setLoading(false);
          }
        } catch (e) {
          logger.warn("[Towns] Error en Instant Load:", e);
        }
      }

      try {
        const data = await supabaseService.getTowns();
        logger.log(
          "[Towns] Data bategada des de Supabase:",
          data?.length,
          "pobles trobats.",
        );
        setTowns(data);
        // Save for next time
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
        <div className="flex-1 flex flex-col w-full min-h-0 towns-page-container">
      <SEO
        title={t("towns.title") || "Els Pobles"}
        description={
          t("towns.description") ||
          "Explora la xarxa de pobles connectats i descobreix el que els fa únics."
        }
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
      {/* Semantic Heading for SEO/A11y */}
      <h1 className="sr-only">
        {t("towns.title") || "Xarxa de Pobles Connectats"}
      </h1>



      <div className="flex-none w-full z-50 shadow-md bg-theme-base">
          <ContextualHeader
            ref={searchRef}
            searchTerm={townSearch}
            onSearchChange={setTownSearch}
            viewMode={viewMode}
            onViewModeChange={(mode) => {
              setViewMode(mode);
            }}
            placeholder={
              currentTab === "esdeveniments"
                ? "Cerca esdeveniments..."
                : "Cerca pobles..."
            }
          />
      </div>

      {/* ATRIBUCIÓ OBLIGATÒRIA I AGRAÏMENT A WIKIPEDIA (IMPERATIU LEGAL) - AVISO COMPACTO PEGADO A LA BARRA */}
      {showWikiBanner && currentTab === "pobles" && (
        <div className="flex-none w-full bg-[#FF6D23]/10 dark:bg-[#FF6D23]/15 border-b border-[#FF6D23]/20 px-3 py-2 flex items-center justify-between gap-3 shadow-inner z-40">
          <div className="flex items-center gap-2 flex-1 min-w-0 md:max-w-4xl mx-auto">
             <Info size={18} className="text-[#FF6D23] flex-shrink-0" />
             <p className="text-[11px] sm:text-xs text-gray-800 dark:text-gray-200 leading-tight md:whitespace-normal mb-0">
               <span className="font-black mr-1 hidden sm:inline">Patrimoni Obert Connectat:</span> 
               Dades i imatges enriquides gràcies a <a href="https://ca.wikipedia.org" target="_blank" rel="noopener noreferrer" className="text-[#FF6D23] hover:underline font-bold">Wikipedia</a> i <a href="https://commons.wikimedia.org" target="_blank" rel="noopener noreferrer" className="text-[#FF6D23] hover:underline font-bold">Wikimedia Commons</a> (<a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer" className="underline">CC BY-SA 4.0</a>). La memòria no es destrueix, es comparteix.
             </p>
          </div>
          <button 
            onClick={handleDismissWikiBanner}
            className="flex-shrink-0 text-gray-500 hover:text-[#FF6D23] transition-colors bg-white/50 dark:bg-black/20 rounded-lg p-1 animate-pulse hover:animate-none border border-black/5 dark:border-white/5"
            aria-label="Tancar avís"
            title="Tancar i no tornar a mostrar"
          >
            <X size={36} strokeWidth={2.5} />
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-scroll custom-scrollbar towns-content-area" ref={containerRef}>
        {currentTab === "pobles" && (
          <UniversalGridWrapper viewMode={viewMode} className="">
            <UniversalGridRow viewMode={viewMode} columnCount={columnCount} className="pb-8">


              {filteredTowns.length > 0 ? (
                filteredTowns.map((town) => {
                  const isUserTown =
                    profile &&
                    (town.id === profile.town_uuid);
                  const lastActiveId = localStorage.getItem(
                    "last_active_town_id",
                  );
                  const isBating =
                    town.id === lastActiveId;
                  
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
                            className={`town-card animate-in w-full ${
                              isUserTown ? "ring-2 ring-[var(--theme-accent-primary)] shadow-[0_0_20px_rgba(249,115,22,0.3)]" : ""
                            }`}
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
                                      className="text-[14px] md:text-[15px] font-black text-[var(--theme-accent-primary)] hover:underline transition-opacity text-center"
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
            </UniversalGridRow>
          </UniversalGridWrapper>
        )}

        {currentTab === "esdeveniments" && (
          <div className="events-container">
            <div className="calendar-widget-wrapper mb-6 bg-theme-panel p-4 md:p-6 rounded-[28px] border border-white/5 shadow-sm">
                <div className="flex items-center justify-between mb-6 px-2">
                    <button className="p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"><ChevronLeft size={24}/></button>
                    <span className="font-black tracking-widest text-[16px] md:text-[18px]">MARÇ 2026</span>
                    <button className="p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"><ChevronRight size={24}/></button>
                </div>
                
                <div className="grid grid-cols-7 gap-1 md:gap-2 text-center mb-3">
                    {['DL', 'DT', 'DC', 'DJ', 'DV', 'DS', 'DG'].map(d => (
                        <div key={d} className="text-[12px] md:text-[14px] font-black opacity-50 mb-2">{d}</div>
                    ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1 md:gap-2 text-center">
                    {/* Buits abans de dia 1 (Març 26 comença diumenge, doncs 6 buits) */}
                    {[...Array(6)].map((_, i) => <div key={`empty-${i}`} className="p-2 md:p-3"/>)}
                    
                    {/* Dies del mes */}
                    {[...Array(31)].map((_, i) => {
                        const day = i + 1;
                        // Simular que alguns dies (ex. els propers que tenen eventCards abaix) tenen esdeveniment
                        const hasEvent = [1, 2, 10, 15, 28].includes(day); 
                        const isToday = day === 23;
                        return (
                            <button
                                key={day}
                                className={`relative flex flex-col items-center justify-center p-2 h-12 w-full sm:h-14 rounded-[16px] text-[16px] md:text-[18px] font-bold transition-all hover:scale-105 active:scale-95
                                    ${hasEvent ? 'bg-[var(--theme-accent-primary)]/10 text-[var(--theme-accent-primary)] font-black' : 'hover:bg-gray-100 dark:hover:bg-white/5'}
                                    ${isToday ? 'ring-2 ring-[var(--theme-accent-primary)] ring-offset-2 dark:ring-offset-[#111827]' : ''}
                                `}
                            >
                                {day}
                                {hasEvent && <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[var(--theme-accent-primary)]"></div>}
                            </button>
                        );
                    })}
                </div>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="empty-state-full py-10 text-center opacity-50">
                <h3>No hem trobat cap esdeveniment</h3>
                <p>Prova amb altres paraules o etiquetes.</p>
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
                          className="event-card animate-in-up w-full"
                          image={
                            event.image_url?.[0] ||
                            "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=1000"
                          }
                          mode="event"
                          viewMode={viewMode}
                        >
                          <div
                            className="event-description text-sm opacity-90"
                            style={{ padding: "10px 0", minHeight: "60px" }}
                          >
                            {event.description}
                          </div>
                          <div className="event-tags flex gap-2 flex-wrap mt-2">
                            {event.tags.map((tag) => (
                              <span
                                key={tag}
                                className="tag-pill"
                                style={{
                                  background: "rgba(255, 255, 255, 0.05)",
                                  padding: "2px 8px",
                                  borderRadius: "0px",
                                  fontSize: "10px",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px",
                                }}
                              >
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
        {currentTab === "rhizome" && (
          <div className="rhizome-essences animate-in">
            <section className="essence-hero py-6 text-center border-b border-white/10 mb-8">
              <h2 className="text-2xl font-black text-primary">
                RECURSOS DEL SOLATGE
              </h2>
              <p className="opacity-70 text-sm">
                Coneixement local protegit pel protocol Rhizome
              </p>
            </section>

            <UniversalGridWrapper viewMode={viewMode}>
                <UniversalGridRow viewMode={viewMode} columnCount={columnCount} className="pb-6">
                  {/* OLI DE LA TORRE */}
                  <UniversalCard
                    title="Oli de La Torre (Verge Extra)"
                    subtitle="Km0 • Cooperativa • Essències"
                    headerTheme="olive"
                    className="essence-card w-full"
                    image="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=1000"
                    footer={
                      <div className="px-4 py-3 flex justify-between items-center bg-black/20">
                        <span className="text-xs font-bold text-success">
                          PRODUCTE PROTEGIT
                        </span>
                        <button
                          className="text-xs font-black text-primary"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate("/didactica/oli-de-la-torre");
                          }}
                        >
                          SABER MÉS
                        </button>
                      </div>
                    }
                  >
                    <p className="text-sm opacity-90 py-2">
                      El nostre oli és fill de la muntanya. Produït majoritàriament
                      amb la varietat <strong>Blanqueta</strong>, resistent i noble.
                      L'oli es deixa <em>trastombar</em> naturalment per a separar
                      la <em>morca</em>.
                    </p>
                    <div className="specs-box mt-2 p-3 bg-white/5 border border-white/10 rounded flex justify-between">
                      <div className="spec text-xs">
                        <strong>Acidesa:</strong> 0.8º
                      </div>
                      <div className="spec text-xs">
                        <strong>Procés:</strong> Batuda en fred (23ºC)
                      </div>
                    </div>
                  </UniversalCard>

                  {/* ITINERARIS */}
                  <UniversalCard
                    title="Som pa, som oli"
                    subtitle="Itinerari • Gastronòmic • 4h"
                    headerTheme="terracotta"
                    className="essence-card w-full"
                    image="https://images.unsplash.com/photo-1541336032412-2048a678540d?auto=format&fit=crop&q=80&w=1000"
                    footer={
                      <div className="px-4 py-3 flex justify-between items-center bg-black/20">
                        <span className="text-xs font-bold">
                          1.3 KM • 3 PARADES
                        </span>
                        <button
                          className="text-xs font-black text-primary"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate("/mapa");
                          }}
                        >
                          VEURE RUTA
                        </button>
                      </div>
                    }
                  >
                    <p className="text-sm opacity-90 py-2">
                      Una ruta pels sabors que defineixen la memòria de l'horta.
                    </p>
                    <div className="stops-list flex flex-wrap gap-2 mt-2">
                      {["Forns de llenya", "Almàssera", "Molí Hidràulic"].map(
                        (s) => (
                          <span
                            key={s}
                            className="px-2 py-1 bg-white/5 text-[10px] rounded border border-white/10"
                          >
                            {s.toUpperCase()}
                          </span>
                        ),
                      )}
                    </div>
                  </UniversalCard>
                </UniversalGridRow>
            </UniversalGridWrapper>
          </div>
        )}
      </div>
    </div>
  );
};

export default Towns;
