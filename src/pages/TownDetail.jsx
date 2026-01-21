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
            try {
                const isUuid = id.includes('-');
                const found = data.find(t => isUuid ? t.uuid === id : t.id === parseInt(id));
                setTown(found);
            } catch (error) {
                console.error('Error loading town:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTown();
    }, [id]);

    if (loading) return <div className="loading-container">{t('common.loading')}</div>;
    if (!town) return <div className="error-container">Poble no trobat</div>;

    return (
        <div className="town-detail-page">
            <header className="town-detail-hero">
                <div className="town-hero-overlay"></div>
                <img
                    src={town.image_url || 'https://images.unsplash.com/photo-1541890289-b86df5b6fea1?auto=format&fit=crop&q=80'}
                    alt={town.name}
                    className="town-hero-img"
                />
                <div className="town-hero-content">
                    <button className="back-circle-btn" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} />
                    </button>
                    <div className="town-title-box">
                        {town.logo_url && <img src={town.logo_url} alt="" className="town-logo-large" />}
                        <div className="town-title-text">
                            <h1>{town.name}</h1>
                            <span className="town-subtitle">{town.population?.toLocaleString()} habitants</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="town-detail-body">
                <section className="town-info-section">
                    <div className="info-card">
                        <Info size={20} />
                        <p>{town.description}</p>
                    </div>
                </section>

                <div className="town-sections-grid">
                    <section className="town-wall-section">
                        <div className="section-header">
                            <MessageCircle size={22} />
                            <h3>Muro de {town.name}</h3>
                        </div>
                        <Feed townId={town.uuid || town.id} hideHeader={true} />
                    </section>

                    <section className="town-market-section">
                        <div className="section-header">
                            <ShoppingBag size={22} />
                            <h3>Mercat de {town.name}</h3>
                        </div>
                        <Market townId={town.uuid || town.id} hideHeader={true} />
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TownDetail;
