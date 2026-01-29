import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, MapPin, Users, Info, MessageCircle, ShoppingBag } from 'lucide-react';
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTown = async () => {
            setLoading(true);
            try {
                const allTowns = await supabaseService.getTowns();
                const isUuid = id.includes('-');
                const found = allTowns.find(t => isUuid ? t.uuid === id : t.id === parseInt(id));
                setTown(found);

                if (found) {
                    const wiki = await wikipediaService.getTownSummary(found.name);
                    setWikiData(wiki);

                    // Si no tenim escut al DB, el busquem a Commons
                    if (!found.logo_url) {
                        const shield = await wikipediaService.getTownShield(found.name);
                        if (shield) {
                            setTown(prev => ({ ...prev, logo_url: shield }));
                        }
                    }
                }
            } catch (error) {
                logger.error('Error loading town:', error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchTown();
    }, [id]);

    if (loading) return <div className="loading-container">{t('common.loading')}</div>;
    if (!town) return <div className="error-container">Poble no trobat</div>;

    return (
        <div className="town-detail-page">
            <SEO
                title={town.name}
                description={town.description || `Descobreix la vida i comunitat a ${town.name}, Comunitat Valenciana.`}
                image={town.image_url}
                keywords={`${town.name}, ${town.comarca}, ${town.province}, pobles valencians`}
            />
            <ProfileHeaderPremium
                type="town"
                title={town.name}
                subtitle={`${town.comarca}, ${town.province}`}
                bio={town.description}
                avatarUrl={town.logo_url}
                coverUrl={town.image_url}
                badges={['Activa']}
                stats={[
                    { label: 'Veïns', value: town.population?.toLocaleString() || '---', icon: <Users size={18} /> },
                    { label: 'Ubicació', value: town.comarca || 'Comunitat', icon: <MapPin size={18} /> }
                ]}
                shareData={{
                    title: town.name,
                    text: town.description || `Vine a conèixer ${town.name} a Sóc de Poble!`,
                    url: window.location.href
                }}
            />

            <div className="town-detail-body">
                {/* BANDO MUNICIPAL - Official Announcements */}
                <section className="bando-municipal-container">
                    <div className="bando-header">
                        <div className="bando-title">
                            <div className="bando-icon-pulse">📢</div>
                            <h3>Bando Municipal</h3>
                        </div>
                        <span className="bando-tag">Oficial</span>
                    </div>
                    <div className="bando-content-card">
                        <h4 className="bando-subject">⚠️ Avís: Tall de subministrament</h4>
                        <p>Es comunica que demà de 9:00 a 12:00 hi haurà un tall en el servei d'aigua per manteniment a la Plaça Major.</p>
                        <span className="bando-date">Publicat avui a les 09:30</span>
                    </div>
                </section>

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
                    <div className="utility-card weather-glass">
                        <div className="utility-icon">☀️</div>
                        <div className="utility-info">
                            <span className="utility-label">El Temps</span>
                            <span className="utility-value">12°C - Clar</span>
                        </div>
                    </div>
                    <div className="utility-card events-glass">
                        <div className="utility-icon">📅</div>
                        <div className="utility-info">
                            <span className="utility-label">Proxims Actes</span>
                            <span className="utility-value">Fira de Sant Antoni</span>
                        </div>
                    </div>
                </section>

                <div className="town-content-explorer">
                    <div className="explorer-tabs">
                        <h3 className="active-tab-indicator">Tot el poble</h3>
                    </div>

                    <div className="town-sections-grid">
                        <section className="town-wall-section">
                            <div className="section-header-premium">
                                <MessageCircle size={18} />
                                <h3>Mur de la Comunitat</h3>
                            </div>
                            <Feed townId={town.uuid || town.id} hideHeader={true} />
                        </section>

                        <section className="town-market-section">
                            <div className="section-header-premium">
                                <ShoppingBag size={18} />
                                <h3>Productes Locals</h3>
                            </div>
                            <Marketplace townId={town.uuid || town.id} hideHeader={true} />
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TownDetail;
