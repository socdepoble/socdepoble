import SectionChrome from '../../components/SectionChrome';
import { useAppData } from '../../app/AppDataContext';
import { SUPPORTED_LANGUAGES } from '../../config/i18n';

export default function TranslationsSection() {
  const { language, setLanguage, t } = useAppData();

  return (
    <SectionChrome
      kicker={t('section.translations.kicker', 'Idioma')}
      title={t('section.translations.title', 'Traduccions i llengua')}
      subtitle={t('section.translations.subtitle', 'Canvia l’idioma de la interfície i guarda la preferència al navegador.')}
      meta={[t('common.interfaceLanguage', 'Idioma de la interfície'), t('section.translations.meta', 'Preferències'), t('common.saved', 'Guardat')]}
    >
      <div className="stack-grid">
        {SUPPORTED_LANGUAGES.map((item) => {
          const isActive = item.code === language;
          return (
            <button
              key={item.code}
              type="button"
              className={`card card--soft language-card ${isActive ? 'language-card--active' : ''}`}
              onClick={() => setLanguage(item.code)}
            >
              <div className="card__body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div>
                  <strong style={{ display: 'block' }}>{item.name}</strong>
                  <span className="section-item-card__subtitle">{item.code.toUpperCase()}</span>
                </div>
                <span className={`pill ${isActive ? 'pill--primary' : ''}`}>
                  {isActive ? t('section.translations.status.active', 'Actiu') : t('section.translations.status.available', 'Disponible')}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </SectionChrome>
  );
}
