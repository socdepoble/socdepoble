import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Layers, Info } from 'lucide-react';
import CategoryTabs from '../components/CategoryTabs';
import { MOCK_EVENTS } from '../data';
import './Map.css';

const Map = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const townTabs = [
        { id: 'pobles', label: t('nav.towns') || 'Pobles' },
        { id: 'esdeveniments', label: t('nav.events') || 'Esdeveniments' },
        { id: 'mapa', label: t('nav.map_tab') || 'Mapa' }
    ];

    return (
        <div className="map-page-container">
            <header className="page-header-with-tabs">
                <div className="header-tabs-wrapper">
                    <CategoryTabs
                        selectedRole="mapa"
                        onSelectRole={(role) => {
                            if (role === 'pobles') {
                                navigate('/pobles');
                            } else if (role === 'esdeveniments') {
                                navigate('/pobles', { state: { initialTab: 'esdeveniments' } });
                            }
                        }}
                        tabs={townTabs}
                    />
                </div>
            </header>

            <div className="map-view-mock">
                <div className="map-header-hud">
                    <span className="hud-badge">VISTA TÀCTICA: ON</span>
                    <span className="hud-metric">LAT: 38.6183 N</span>
                    <span className="hud-metric">LON: 0.4189 W</span>
                </div>

                <div className="map-controls">
                    <button className="map-control-btn gold" title="Saviesa de l'IAIA"><MapPin size={22} /></button>
                    <button className="map-control-btn"><Layers size={20} /></button>
                    <button className="map-control-btn"><Navigation size={20} /></button>
                </div>

                {/* Mock Map Background */}
                <div className="map-background">
                    {/* IAIA Gold Pin - The Soul of the Village */}
                    <div className="map-ping gold" style={{ top: '48%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                        <div className="ping-wave"></div>
                        <div className="ping-dot"></div>
                        <div className="ping-label">IAIA: Memòria Viva</div>
                    </div>

                    <div className="map-ping mur" style={{ top: '30%', left: '40%' }}>
                        <div className="ping-wave"></div>
                        <div className="ping-dot"></div>
                        <div className="ping-label">Mur: Nova Collita</div>
                    </div>

                    <div className="map-ping mercat" style={{ top: '65%', left: '60%' }}>
                        <div className="ping-wave"></div>
                        <div className="ping-dot"></div>
                        <div className="ping-label">Mercat: Mel de la Torre</div>
                    </div>

                    {/* DYNAMIC EVENTS [VOS] */}
                    {MOCK_EVENTS.map(event => (
                        <div
                            key={event.id}
                            className="map-ping event-dynamic animate-bategat"
                            style={{
                                top: `${35 + (Math.random() * 20)}%`, // Mock positions around center
                                left: `${25 + (Math.random() * 20)}%`
                            }}
                            onClick={() => navigate('/pobles', { state: { initialTab: 'esdeveniments' } })}
                        >
                            <div className="ping-wave"></div>
                            <div className="ping-dot" style={{ backgroundColor: 'var(--color-terracotta)' }}></div>
                            <div className="ping-label" style={{ backgroundColor: 'var(--color-terracotta-dark)' }}>
                                {event.title}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="map-legend tactical-legend">
                    <div className="legend-item"><span className="dot gold"></span> Saviesa</div>
                    <div className="legend-item"><span className="dot mur"></span> Bategat</div>
                    <div className="legend-item"><span className="dot mercat"></span> Comerç</div>
                </div>
            </div>

            <div className="map-info-card">
                <div className="info-header">
                    <Info size={18} />
                    <h4>{t('map.info_title') || 'Informació del Mapa'}</h4>
                </div>
                <p>{t('map.info_desc') || 'Aquest mapa mostra totes les publicacions, productes i esdeveniments geolocalitzats en temps real.'}</p>
            </div>
        </div>
    );
};

export default Map;
