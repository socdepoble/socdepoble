import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, MapPin, Users, Info, MessageCircle, ShoppingBag } from 'lucide-react';
import Feed from '../components/Feed';
import Market from '../components/Market';
import './Towns.css'; // Reusamos estilos o creamos específicos

const TownDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [town, setTown] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTown = async () => {
            setLoading(true);
            try {
                // Get all towns and find the specific one by ID or UUID
                const allTowns = await supabaseService.getTowns();
                const isUuid = id.includes('-');
                const found = allTowns.find(t => isUuid ? t.uuid === id : t.id === parseInt(id));
                setTown(found);
            } catch (error) {
                console.error('Error loading town:', error);
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
            <header className="town-detail-hero">
                <img
                    src={town.image_url || '/images/assets/town_square.png'}
                    alt={town.name}
                    className="town-hero-img"
                />
                <div className="town-hero-overlay"></div>
                <div className="town-hero-content-premium">
                    <button className="back-circle-btn-glass" onClick={() => navigate(-1)}>
                        <ArrowLeft size={22} />
                    </button>

                    <div className="town-identity-block">
                        <div className="town-logo-wrapper-vibrant">
                            {town.logo_url ? (
                                <img src={town.logo_url} alt="" className="town-logo-vibrant" />
                            ) : (
                                <div className="town-logo-placeholder">🏛️</div>
                            )}
                        </div>
                        <div className="town-main-info">
                            <h1 className="town-premium-name">{town.name}</h1>
                            <div className="town-quick-stats">
                                <span className="quick-stat-pill">
                                    <Users size={14} />
                                    {town.population?.toLocaleString()} veïns
                                </span>
                                <span className="quick-stat-pill active-community">
                                    <MapPin size={14} />
                                    Comunitat Activa
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

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

                <section className="town-info-section-premium">
                    <div className="info-grid-compact">
                        <div className="info-bubble">
                            <Info size={18} />
                            <p>{town.description}</p>
                        </div>
                    </div>
                </section>

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
                            <Market townId={town.uuid || town.id} hideHeader={true} />
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TownDetail;
