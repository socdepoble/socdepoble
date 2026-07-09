import SectionChrome from '../../components/SectionChrome';
import { useAppData } from '../../app/AppDataContext';
import { buildMapEmbedUrl } from './mapConfig.js';
import MapTownCard from './MapTownCard.jsx';

export default function MapaSection() {
  const { featuredTowns, t } = useAppData();
  return (
    <SectionChrome
      kicker={t('section.mapa.kicker', 'Mapa')}
      title={t('section.mapa.title', 'Mapa del territori')}
      subtitle={t('section.mapa.subtitle', 'Vista geogràfica del projecte i dels seus punts destacats.')}
      meta={['OpenStreetMap', `${featuredTowns.length} ${t('section.mapa.records', 'punts')}`, t('section.mapa.publicNav', 'Navegació pública')]}
    >
      <div className="map-panel">
        <div className="map-panel__head">
          <h2 className="section-title">{t('section.mapa.head', 'Pols del territori')}</h2>
          <span className="pill">{featuredTowns.length} {t('section.mapa.records', 'registres')}</span>
        </div>
        <div className="map-panel__body">
          <div className="split-grid">
            <div className="card" style={{ overflow: 'hidden', minHeight: 420 }}>
              <iframe
                title="Mapa del territori"
                src={buildMapEmbedUrl()}
                style={{ width: '100%', height: '100%', minHeight: 420, border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <aside className="stack-grid">
              {featuredTowns.map((town) => (
                <MapTownCard key={town.id} town={town} />
              ))}
            </aside>
          </div>
        </div>
      </div>
    </SectionChrome>
  );
}
