import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, MapPin, Users, Info, MessageCircle, ShoppingBag, Sparkles, BookOpen } from 'lucide-react';
import Feed from '../components/Feed';
import Marketplace from '../components/Marketplace';
import SEO from '../components/SEO';
import ProfileHeaderPremium from '../components/ProfileHeaderPremium';
import './Towns.css';
import { logger } from '../utils/logger';
import { wikipediaService } from '../services/wikipediaService';
import ShareHub from '../components/ShareHub';

const TownDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [town, setTown] = useState(null);
    const [wikiData, setWikiData] = useState(null);
    const [officialEntity, setOfficialEntity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [contentMode, setContentMode] = useState('batec'); // 'batec' (Ara) vs 'arrel' (Patrimoni)

    const triggerHaptic = (style) => {
        if ('vibrate' in navigator) {
            if (style === 'light') navigator.vibrate(10); // "Crunchy" earthy feel
            else if (style === 'heavy') navigator.vibrate([30, 10, 30]); // "Solid" stone feel
        }
    };
 
    const handleActionClick = (type, action) => {
        triggerHaptic('light');
        if (action) action();
    };

    useEffect(() => {
        const fetchTown = async () => {
            setLoading(true);
            try {
                const allTowns = await supabaseService.getTowns();
                const isUuid = id.includes('-');
                const sluggify = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]/g, '');
                
                const found = allTowns.find(t => {
                    if (isUuid) return t.uuid === id || t.id === parseInt(id);
                    return sluggify(t.name) === sluggify(id);
                });
                setTown(found);

                if (found) {
                    const wiki = await wikipediaService.getTownSummary(found.name);
                    setWikiData(wiki);

                    // [MERITOCRÀCIA VISUAL] La gent decideix la cara del poble
                    const batecImage = await supabaseService.getTownBatecImage(found.uuid || found.id);
                    if (batecImage) {
                        setTown(prev => ({ ...prev, image_url: batecImage.url }));
                    }

                    // [DUALITAT ONTOLÒGICA] Busquem l'entitat oficial (Ajuntament)
                    try {
                        const entities = await supabaseService.searchEntities(`Ajuntament ${found.name}`);
                        const official = entities.find(e => e.type === 'oficial' || e.name.toLowerCase().includes('ajuntament'));
                        setOfficialEntity(official);
                    } catch {
                        logger.warn(`No s'ha pogut carregar l'entitat oficial per a ${found.name}`);
                    }

                    // [BATEC TERRITORIAL] Guardem aquest poble com l'últim visitat
                    localStorage.setItem('last_active_town_id', found.uuid || found.id);
                }
            } catch (error) {
                logger.error('Error loading town:', error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchTown();
    }, [id]);

    // Lògica "Gent de..." MASTER GENESIS
    const getGentDePage = (townName) => {
        if (!townName) return "Gent de Poble";
        if (townName.includes("La Torre de les Maçanes")) return "Gent de La Torre";
        return `Gent de ${townName}`;
    };

    if (loading) return <div className="loading-container">{t('common.loading')}</div>;
    if (!town) return <div className="error-container">Poble no trobat</div>;

    const gentTitle = getGentDePage(town.name);

    return (
        <div className="town-detail-page">
            <SEO
                title={gentTitle}
                description={town.description || `Espai comunitari de la ${gentTitle}.`}
                image={town.image_url}
                keywords={`${town.name}, Gent de la Torre, ${town.comarca}, ${town.province}, pobles valencians`}
            />
            <ProfileHeaderPremium
                type="town"
                title={gentTitle}
                subtitle={`${(town.comarca && town.comarca !== 'null') ? town.comarca : 'Comunitat'} • ${(town.province && town.province !== 'null') ? town.province : 'Alacant'}`}
                bio={town.description}
                avatarUrl={town.logo_url}
                coverUrl={town.image_url}
                badges={['Activa']}
                stats={[
                    { label: 'Veïns', value: town.population?.toLocaleString() || '---', icon: <Users size={18} /> },
                    { label: 'Ubicació', value: town.comarca || 'Comunitat', icon: <MapPin size={18} /> }
                ]}
                shareData={{
                    title: gentTitle,
                    text: town.description || `Benvingut a la ${gentTitle} a Sóc de Poble!`,
                    url: window.location.href
                }}
            />

            <div className="town-detail-body">
                {/* HUD AGRARI & CLIMÀTIC (Signes Vitals) */}
                <section className="agrarian-hud-container animate-in">
                    <div className="hud-metric" title="Risc de Mosca de l'Olivera">
                        <span className="hud-metric-label">🪰 PLAGUES</span>
                        <div className="hud-indicator-dot" style={{ background: '#FF4C4C' }}></div>
                        <span className="hud-status-text" style={{ color: '#FF4C4C' }}>RISC ALT</span>
                    </div>
                    <div className="hud-metric" title="Estat de sequera del sòl">
                        <span className="hud-metric-label">🪵 SEQUERA</span>
                        <div className="hud-indicator-dot" style={{ background: '#FFA500' }}></div>
                        <span className="hud-status-text" style={{ color: '#FFA500' }}>ALERTA</span>
                    </div>
                    <div className="hud-metric" title="Context d'humitat">
                        <span className="hud-metric-label">💧 SAÓ</span>
                        <div className="hud-indicator-indicator" style={{ display: 'flex', gap: '2px' }}>
                            <div className="bar active"></div>
                            <div className="bar"></div>
                            <div className="bar"></div>
                        </div>
                        <span className="hud-status-text">BAIXA</span>
                    </div>
                </section>

                {/* PORTAL DE PAS: AJUNTAMENT VS POBLE */}
                <div className="dual-portal-notice community-glass border border-primary/30 p-4 rounded-2xl flex items-start gap-4 mb-6">
                    <div className="icon-wrapper text-primary">
                        <Users size={32} />
                    </div>
                    <div className="text-sm">
                        <h4 className="font-black text-primary mb-1 uppercase tracking-tighter">{gentTitle}</h4>
                        <p className="opacity-80">Aquest és l'espai comunitari on bateguen els veïns. Per a tràmits oficials i bans municipals, visita la Seu de l'Ajuntament.</p>
                        <button
                            onClick={() => navigate(`/ajuntament/${town.uuid || town.id}`)}
                            className="inline-flex items-center gap-2 mt-3 p-2 px-4 bg-blue-600 text-white font-black rounded-lg text-xs"
                        >
                            ANAR A L'AJUNTAMENT
                        </button>
                    </div>
                </div>

                {/* BANDO MUNICIPAL - Official Announcements */}
                <section className="bando-municipal-container" onClick={() => navigate(`/ajuntament/${id}`)}>
                    <div className="bando-header">
                        <div className="bando-title">
                            <div className="bando-icon-pulse">📢</div>
                            <h3>Bando Municipal</h3>
                        </div>
                        <span className="bando-tag" style={{ background: 'var(--color-primary)', color: 'black' }}>VEURE TOTS</span>
                    </div>
                    <div className="bando-content-card">
                        <h4 className="bando-subject">⚠️ Avís: Tall de subministrament</h4>
                        <p>Es comunica que demà de 9:00 a 12:00 hi haurà un tall en el servei d'aigua per manteniment a la Plaça Major.</p>
                        <span className="bando-date">Publicat avui a les 09:30</span>
                    </div>
                </section>

                {/* ... (WIKIPEDIA section follows) */}

                {/* MEMÒRIA UNIVERSAL (WIKIPEDIA) */}
                {wikiData && (
                    <section className="town-wiki-section-premium">
                        <div className="section-header-premium">
                            <Info size={18} />
                            <h3>Memòria Universal (Wikipedia)</h3>
                        </div>
                        <div className="wiki-card-glass">
                            <p className="wiki-extract">{wikiData.extract}</p>
                            <div className="wiki-footer">
                                <a href={wikiData.page_url} target="_blank" rel="noopener noreferrer" className="wiki-link">
                                    Llegir més a la Wikipedia
                                </a>
                                <span className="wiki-attribution">Font: Wikimedia Foundation</span>
                            </div>
                        </div>
                    </section>
                )}

                <section className="town-utilities-row">
                    <div
                        className="utility-card institution-glass"
                        onClick={() => handleActionClick('oficial', () => officialEntity ? navigate(`/entitat/${officialEntity.uuid || officialEntity.id}`) : navigate(`/search?q=Ajuntament ${town.name}`))}
                        style={{ border: '1px solid var(--color-primary)', background: 'rgba(0, 122, 255, 0.05)' }}
                    >
                        <div className="utility-icon">🏛️</div>
                        <div className="utility-info">
                            <span className="utility-label" style={{ color: 'var(--color-primary)' }}>Ajuntament</span>
                            <span className="utility-value">Seu Electrònica</span>
                        </div>
                    </div>
                    <div className="utility-card weather-glass" onClick={() => triggerHaptic('light')}>
                        <div className="utility-icon">☀️</div>
                        <div className="utility-info">
                            <span className="utility-label">El Temps</span>
                            <span className="utility-value">12°C - Clar</span>
                        </div>
                    </div>
                    <div className="utility-card events-glass" onClick={() => triggerHaptic('light')}>
                        <div className="utility-icon">📅</div>
                        <div className="utility-info">
                            <span className="utility-label">Propers Actes</span>
                            <span className="utility-value">Bategant...</span>
                        </div>
                    </div>
                </section>

                <div className="town-content-explorer">
                    {/* INTERRUPTOR DE CAPES DE TEMPS (Ara vs Arrel) */}
                    <div className="time-layer-explorer flex gap-4 p-4 border-b border-white/5">
                        <button
                            className={`layer-btn flex items-center gap-2 p-2 px-4 rounded-lg transition-all ${contentMode === 'batec' ? 'bg-primary text-black' : 'bg-white/5 text-white/40'}`}
                            onClick={() => { triggerHaptic('light'); setContentMode('batec'); }}
                        >
                            <Sparkles size={16} />
                            <span>ARA (Batec)</span>
                        </button>
                        <button
                            className={`layer-btn flex items-center gap-2 p-2 px-4 rounded-lg transition-all ${contentMode === 'arrel' ? 'bg-amber-600 text-black' : 'bg-white/5 text-white/40'}`}
                            onClick={() => { triggerHaptic('light'); setContentMode('arrel'); }}
                        >
                            <BookOpen size={16} />
                            <span>ARREL (Arxiu)</span>
                        </button>
                    </div>

                    <div className="town-sections-grid">
                        <section className="town-wall-section">
                            <div className="section-header-premium">
                                <MessageCircle size={18} />
                                <h3>{contentMode === 'batec' ? 'Mur de la Comunitat' : 'Memòria de l\'Arxiu'}</h3>
                            </div>
                            <Feed townId={town.uuid || town.id} townName={town.name} hideHeader={true} contentMode={contentMode} />
                        </section>

                        {contentMode === 'batec' && (
                            <section className="town-market-section animate-in">
                                <div className="section-header-premium">
                                    <ShoppingBag size={18} />
                                    <h3>Productes Locals</h3>
                                </div>
                                <Marketplace townId={town.uuid || town.id} hideHeader={true} />
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TownDetail;
