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
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

import Feed from "../components/Feed";
import Marketplace from "../components/Marketplace";
import { logger } from "../utils/logger";
import StatusLoader from "../components/StatusLoader";
import SEO from "../components/SEO";
import ContextualHeader from "../components/ContextualHeader";
import { MOCK_EVENTS } from "../data";
import "./Towns.css";

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
  const [viewMode, setViewMode] = useState(
    localStorage.getItem("towns_view_mode") || "grid",
  );
  
  const searchRef = useRef(null);
  const containerRef = useRef(null);
  const [columnCount, setColumnCount] = useState(() => {
    if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        if (viewMode === 'list' || viewMode === 'single') return 1;
        if (width < 768) return 1;
        if (width < 1024) return 2;
        if (width < 1536) return 3;
        return 4;
    }
    return 1;
  });

  useEffect(() => {
      if (!containerRef.current) return;
      const observer = new ResizeObserver(entries => {
          for (let entry of entries) {
              const width = entry.contentRect.width;
              if (viewMode === 'single' || viewMode === 'list') {
                  setColumnCount(1);
              } else {
                  if (width < 768) setColumnCount(1);
                  else if (width < 1024) setColumnCount(2);
                  else if (width < 1536) setColumnCount(3);
                  else setColumnCount(4);
              }
          }
      });
      observer.observe(containerRef.current);
      return () => observer.disconnect();
  }, [viewMode]);

  const handleFABClick = () => {
    if (searchRef.current) {
      searchRef.current.focus();
      searchRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

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
    return MOCK_EVENTS.filter((event) => {
      const matchesSearch =
        !townSearch ||
        event.title.toLowerCase().includes(townSearch.toLowerCase()) ||
        event.description.toLowerCase().includes(townSearch.toLowerCase()) ||
        event.location.toLowerCase().includes(townSearch.toLowerCase());
      return matchesSearch;
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
    <div className="towns-page-container">
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



      <div className="sticky top-0 w-full z-[100] shadow-md">
          <ContextualHeader
            ref={searchRef}
            searchTerm={townSearch}
            onSearchChange={setTownSearch}
            viewMode={viewMode}
            onViewModeChange={(mode) => {
              setViewMode(mode);
              localStorage.setItem("towns_view_mode", mode);
            }}
            placeholder={
              currentTab === "esdeveniments"
                ? "Cerca esdeveniments..."
                : "Cerca pobles..."
            }
            extraActions={
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/mapa')}
                  className="flex items-center justify-center w-10 h-10 bg-[#FF6D23] text-white rounded-[28px] hover:scale-110 transition-transform shadow-lg"
                  title="Obrir Mapa Local"
                >
                  <MapIcon size={20} />
                </button>
              </div>
            }
          />
      </div>

      <div className="towns-content-area" ref={containerRef}>
        {currentTab === "pobles" && (
          <div className={`mx-auto w-full transition-all duration-300 ${viewMode === 'grid' ? 'max-w-[1600px] px-2 sm:px-6' : 'max-w-3xl'}`}>
            <div className={`view-mode-${viewMode}`} style={{ display: 'grid', gridTemplateColumns: `repeat(${viewMode === 'list' || viewMode === 'single' ? 1 : columnCount}, minmax(0, 1fr))`, gap: '24px', padding: '24px 16px', paddingBottom: '32px' }}>
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
                    <Link
                      key={town.uuid || town.id}
                      to={`/pobles/${town.uuid || town.id}`}
                      className={`town-card-link card-rizoma-wrapper animate-in w-full h-full ${
                        isUserTown ? "is-user-town" : ""
                      }`}
                    >
                      <UniversalCard
                        item={town}
                        subtitle={town.name}
                        avatarSrc={town.logo_url}
                        avatarName={town.name}
                        className="town-card"
                        image={town.image_url}
                        mode="pobles"
                        isBating={isBating}
                        viewMode={viewMode}
                      >
                        <div
                          className="town-description-mini text-sm italic opacity-80 line-clamp-2"
                          style={{ padding: "10px 0" }}
                        >
                          {town.description ||
                            "Explora la saviesa i el batec d'aquest poble."}
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
          </div>
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
              <div className={`mx-auto w-full transition-all duration-300 ${viewMode === 'grid' ? 'max-w-[1600px] px-2 sm:px-6' : 'max-w-3xl'}`}>
                <div className={`view-mode-${viewMode}`} style={{ display: 'grid', gridTemplateColumns: `repeat(${viewMode === 'list' || viewMode === 'single' ? 1 : columnCount}, minmax(0, 1fr))`, gap: '24px', padding: '24px 16px', paddingBottom: '32px' }}>
                  {filteredEvents.map((event) => (
                    <div key={event.id} className="card-rizoma-wrapper animate-in w-full flex">
                        <UniversalCard
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
                    </div>
                  ))}
                </div>
              </div>
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

            <div className={`mx-auto w-full transition-all duration-300 ${viewMode === 'grid' ? 'max-w-[1600px] px-2 sm:px-6' : 'max-w-3xl'}`}>
                <div className="essences-grid view-mode-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`, gap: '24px', padding: '0 16px', paddingBottom: '24px' }}>
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
                </div>
            </div>
          </div>
        )}
      </div>

      {/* [PRO] FAB Cerca de Pobles v10.33.6 */}
      <button
        className="towns-search-fab"
        onClick={handleFABClick}
        title="Cercar Pobles"
      >
        <Search size={28} />
      </button>
    </div>
  );
};

export default Towns;
