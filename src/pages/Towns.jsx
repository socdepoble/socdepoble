import React, { useState, useEffect, useMemo, useRef } from "react";
import { supabaseService } from "../services/supabaseService";
import UniversalCard from "../components/UniversalCard";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  Map as MapIcon,
  Info,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

import Feed from "../components/Feed";
import Marketplace from "../components/Marketplace";
import { logger } from "../utils/logger";
import StatusLoader from "../components/StatusLoader";
import SEO from "../components/SEO";
import ContextualHeader from "../components/ContextualHeader";
import { MOCK_EVENTS } from "../data";
import { wikipediaService } from "../services/wikipediaService";
import { useViewMode } from "../hooks/useViewMode";
import { UniversalGridWrapper, UniversalGridRow } from "../components/UniversalGrid";
import "./Towns.css";

// ----------------------------------------------------------------------
// TownWikipediaEnricher: Carga perezosa de Wikipedia con caché local estricto
// ----------------------------------------------------------------------
const isShieldOrMap = (url) => {
  if (!url) return true;
  const lurl = url.toLowerCase();
  return lurl.includes('.svg') || lurl.includes('escut') || lurl.includes('escudo') || lurl.includes('mapa') || lurl.includes('map') || lurl.includes('bandera') || lurl.includes('flag') || lurl.includes('locator');
};

const TownWikipediaEnricher = ({ town, children }) => {
  const [wikiData, setWikiData] = useState(() => {
    const cached = localStorage.getItem(`wiki_enrich_v2_${town.name}`);
    return cached ? JSON.parse(cached) : null;
  });

  useEffect(() => {
    let isMounted = true;
    if (!wikiData) {
      wikipediaService.getTownSummary(town.name).then(async (data) => {
        if (data && isMounted) {
          let bestImage = data.original_image || data.thumbnail;
          if (isShieldOrMap(bestImage)) {
             try {
               const gallery = await wikipediaService.getTownImages(town.name);
               const validPhotos = gallery.filter(img => !isShieldOrMap(img.url));
               if (validPhotos.length > 0) {
                 bestImage = validPhotos[0].url;
               }
             } catch (e) {
               console.warn("Error fetching alternate images for", town.name, e);
             }
          }
          const info = {
            image: bestImage,
            summary: data.extract,
            page_url: data.page_url,
          };
          if (isMounted) {
            setWikiData(info);
            localStorage.setItem(`wiki_enrich_v2_${town.name}`, JSON.stringify(info));
          }
        }
      });
    }
    return () => { isMounted = false; };
  }, [town.name, wikiData]);

  // Mezclamos los datos nativos con los enriquecidos, dando prioridad a Wikipedia para pobles huérfanos
  const enrichedTown = {
    ...town,
    image_url: wikiData?.image || town.image_url,
    description: wikiData?.summary || town.description,
    wiki_url: wikiData?.page_url,
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

const Towns = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();
  const [towns, setTowns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'pobles';
  const [townSearch, setTownSearch] = useState("");
  const { viewMode, setViewMode, columnCount, containerRef } = useViewMode("towns_view_mode", "grid");
  
  const [showWikiBanner, setShowWikiBanner] = useState(() => {
    if (typeof window !== "undefined") {
       return localStorage.getItem("hide_wiki_banner") !== "true" && sessionStorage.getItem("hide_wiki_banner_session") !== "true";
    }
    return true;
  });

  const handleDismissWikiBanner = () => {
    setShowWikiBanner(false);
    if (profile) {
       localStorage.setItem("hide_wiki_banner", "true");
    } else {
       sessionStorage.setItem("hide_wiki_banner_session", "true");
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
              url: `https://socdepoble.org/pobles/${town.uuid || town.id}`,
              image: town.image_url,
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

      <div className="flex-1 overflow-y-auto custom-scrollbar towns-content-area" ref={containerRef}>
        {currentTab === "pobles" && (
          <UniversalGridWrapper viewMode={viewMode}>
            <UniversalGridRow viewMode={viewMode} columnCount={columnCount} className="pt-6 pb-8">
              {/* ATRIBUCIÓ OBLIGATÒRIA I AGRAÏMENT A WIKIPEDIA (IMPERATIU LEGAL) */}
              {showWikiBanner && (
                <div className="col-span-full mb-6 relative p-6 rounded-2xl bg-[#FF6D23]/5 dark:bg-[#FF6D23]/10 border border-[#FF6D23]/20 dark:border-[#FF6D23]/10">
                  <button 
                    onClick={handleDismissWikiBanner}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-1"
                    aria-label="Tancar avís"
                  >
                    <X size={20} />
                  </button>
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className="flex-shrink-0 p-3 bg-[#FF6D23]/10 rounded-xl text-[#FF6D23]">
                      <Info size={24} />
                    </div>
                    <div className="flex-1 pr-8">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        🏛️ Patrimoni Obert Connectat
                      </h4>
                      <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                        Les imatges històriques principals i els textos descriptius fonamentals s’enriqueixen en temps real gràcies al coneixement col·lectiu actiu de <a href="https://ca.wikipedia.org" target="_blank" rel="noopener noreferrer" className="text-[#FF6D23] hover:underline font-semibold">Wikipedia</a> i <a href="https://commons.wikimedia.org" target="_blank" rel="noopener noreferrer" className="text-[#FF6D23] hover:underline font-semibold">Wikimedia Commons</a>, d'acord amb la llicència <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer" className="underline">CC BY-SA 4.0</a>.
                        <br/>
                        <span className="mt-2 block font-medium">La memòria no es destrueix, es comparteix.</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {filteredTowns.length > 0 ? (
                filteredTowns.map((town) => {
                  const isUserTown =
                    profile &&
                    (town.uuid === profile.town_uuid ||
                      town.id === profile.town_id);
                  const lastActiveId = localStorage.getItem(
                    "last_active_town_id",
                  );
                  const isBating =
                    town.uuid === lastActiveId ||
                    String(town.id) === lastActiveId;

                  return (
                    <TownWikipediaEnricher key={town.uuid || town.id} town={town}>
                      {(enrichedTown) => (
                          <UniversalCard
                            item={enrichedTown}
                            subtitle={enrichedTown.name}
                            avatarSrc={enrichedTown.image_url}
                            avatarName={enrichedTown.name}
                            className={`town-card animate-in w-full ${
                              isUserTown ? "ring-2 ring-[var(--theme-accent-primary)] shadow-[0_0_20px_rgba(249,115,22,0.3)]" : ""
                            }`}
                            image={enrichedTown.image_url}
                            mode="pobles"
                            isBating={isBating}
                            viewMode={viewMode}
                            onNavigate={() => navigate(`/pobles/${enrichedTown.uuid || enrichedTown.id}`)}
                          >
                            <div
                              className="town-description-mini text-sm italic opacity-80"
                              style={{ padding: "10px 0" }}
                              title={enrichedTown.description}
                            >
                              <span className="line-clamp-3">
                                {enrichedTown.description ||
                                  "Explora la saviesa i el batec d'aquest poble."}
                              </span>
                              {enrichedTown.wiki_url && (
                                <a 
                                  href={enrichedTown.wiki_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="not-italic block mt-2 text-xs font-bold text-[var(--theme-accent-primary)] hover:underline opacity-100 transition-opacity"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Llegir l'article sencer a Wikipedia ↗
                                </a>
                              )}
                            </div>
                          </UniversalCard>
                      )}
                    </TownWikipediaEnricher>
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
              <UniversalGridWrapper viewMode={viewMode}>
                <UniversalGridRow viewMode={viewMode} columnCount={columnCount} className="pt-6 pb-8">
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
