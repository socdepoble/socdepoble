import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Layers, Info } from 'lucide-react';
import CategoryTabs from '../components/CategoryTabs';
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
                <div className="map-controls">
                    <button className="map-control-btn"><Layers size={20} /></button>
                    <button className="map-control-btn"><Navigation size={20} /></button>
                </div>

                {/* Mock Map Background */}
                <div className="map-background">
                    <div className="map-ping mur" style={{ top: '30%', left: '40%' }}>
                        <div className="ping-wave"></div>
                        <div className="ping-dot"></div>
                    </div>
                    <div className="map-ping mercat" style={{ top: '55%', left: '60%' }}>
                        <div className="ping-wave"></div>
                        <div className="ping-dot"></div>
                    </div>
                    <div className="map-ping event" style={{ top: '45%', left: '25%' }}>
                        <div className="ping-wave"></div>
                        <div className="ping-dot"></div>
                    </div>
                </div>

                <div className="map-legend">
                    <div className="legend-item"><span className="dot mur"></span> Mur</div>
                    <div className="legend-item"><span className="dot mercat"></span> Mercat</div>
                    <div className="legend-item"><span className="dot event"></span> {t('common.event') || 'Esdeveniment'}</div>
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
