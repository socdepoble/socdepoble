import { useTranslation } from 'react-i18next';
import './ConnectionSelectorModal.css';

/**
 * ConnectionSelectorModal [VOS]
 * Permet a l'usuari etiquetar una connexió i bategar amb el seu diccionari privat.
 */
const ConnectionSelectorModal = ({
  isOpen,
  onClose,
  currentTags = [],
  onUpdate
}) => {
  const {
    t
  } = useTranslation();
  if (!isOpen) return null;
  return (
      <div className='fixed inset-0 z-sdp-z-modal bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200' onClick={onClose}>
                <div className="connection-modal-content glass-morphism w-full max-w-md w-[85%] sm:w-full" onClick={e => e.stopPropagation()}>
                    <div role="region" aria-label="Capçalera de Secció" className="connection-modal-header">
                        <div className="header-icon">
                            <Sparkles size={18} />
                        </div>
                        <div className="header-title">
                            <h2>{t('feed.connect_title') || 'Connectar bategat'}</h2>
                            <p>{t('feed.connect_subtitle') || 'Afegeix etiquetes per a la teua llibreta privada'}</p>
                        </div>
                        <button className="close-btn" onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="connection-modal-body">
                        {/* [MASTER PRIVACY] Private Categorization Notice */}
                        <div className="privacy-badge-notice">
                            <Shield size={14} />
                            Aquesta acció és 100% privada. Només tu podràs veure aquest post a la teua llibreta.
                        </div>

                        <TagSelector currentTags={currentTags} onTagsChange={onUpdate} />
              
                    </div>

                    <footer className="connection-modal-footer">
                        <button className="confirm-btn" onClick={onClose}>
                            <Check size={18} />
                            {t('common.done') || 'Fet'}
                        </button>
                    </footer>
                </div>
            </div>
  );
};
export default ConnectionSelectorModal;