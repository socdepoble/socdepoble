import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { X, Check, Eye, EyeOff, Hash, Layers, Settings2, Sparkles, Loader2 } from 'lucide-react';
import { useSocial } from '../context/SocialContext';
import { useUI } from '../context/UIContext';
import { supabaseService } from '../services/supabaseService';
import { logger } from '../utils/logger';
import './SocialManager.css';

const SocialManager = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { activeCategories, toggleCategory, followedTags, savePreferences } = useSocial();
    const { socialManagerContext } = useUI();
    const [privateTags, setPrivateTags] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    const availableCategories = [
        { id: 'xat', label: t('common.role_xat'), icon: <Layers size={18} /> },
        { id: 'gent', label: t('common.role_gent'), icon: <Layers size={18} /> },
        { id: 'grup', label: t('common.role_grup'), icon: <Layers size={18} /> },
        { id: 'treball', label: t('common.role_treball'), icon: <Layers size={18} /> },
        { id: 'pobo', label: t('common.role_pobo'), icon: <Layers size={18} /> }
    ];

    const availableTags = ['Esdeveniment', 'Avís', 'Proposta', 'Oportunitat', 'Cultura', 'Esport', 'Ajuda', 'Mercat'];

    if (!isOpen) return null;

    return (
        <div className="social-manager-overlay" onClick={onClose}>
            <div className="social-manager-content" onClick={e => e.stopPropagation()}>
                <header className="sm-header">
                    <div className="sm-title-row">
                        <Settings2 className="sm-title-icon" />
                        <h2>{t('social.manager_title', 'Gestió Social')}</h2>
                    </div>
                    <button className="sm-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </header>

                <div className="sm-scroll-body">
                    {socialManagerContext && (
                        <section className="sm-section connection-tagging">
                            <div className="sm-section-header">
                                <Sparkles size={20} className="sm-section-icon highlight" />
                                <div className="sm-section-text">
                                    <h3>Etiqueta a {socialManagerContext.name}</h3>
                                    <p>Com vols recordar a este veí? (Privat)</p>
                                </div>
                            </div>
                            <div className="sm-tags-cloud">
                                {['Veí', 'Amic', 'Família', 'Treball', 'Interès Comú', 'Referent'].map(tag => {
                                    const isSelected = privateTags.includes(tag);
                                    return (
                                        <button
                                            key={tag}
                                            className={`sm-tag-pill ${isSelected ? 'followed' : ''}`}
                                            onClick={() => {
                                                const updated = isSelected
                                                    ? privateTags.filter(t => t !== tag)
                                                    : [...privateTags, tag];
                                                setPrivateTags(updated);
                                                setIsSaving(true);
                                                // Sync with DB
                                                supabaseService.connectWithProfile(
                                                    user?.id,
                                                    socialManagerContext.id,
                                                    updated
                                                ).finally(() => setIsSaving(false));
                                            }}
                                            disabled={isSaving}
                                        >
                                            {isSaving && isSelected ? <Loader2 size={12} className="spinner" /> : tag}
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    )}
                    <section className="sm-section">
                        <div className="sm-section-header">
                            <Layers size={20} className="sm-section-icon" />
                            <div className="sm-section-text">
                                <h3>{t('social.categories', 'Pestanyes Actives')}</h3>
                                <p>{t('social.categories_desc', 'Tria quines seccions vols veure al teu menú de navegació.')}</p>
                            </div>
                        </div>
                        <div className="sm-categories-grid">
                            {availableCategories.map(cat => {
                                const isActive = activeCategories.includes(cat.id);
                                return (
                                    <button
                                        key={cat.id}
                                        className={`sm-category-card ${isActive ? 'active' : ''}`}
                                        onClick={() => toggleCategory(cat.id)}
                                    >
                                        <div className="sm-cat-icon-wrapper">
                                            {isActive ? <Eye size={20} /> : <EyeOff size={20} />}
                                        </div>
                                        <span className="sm-cat-label">{cat.label}</span>
                                        {isActive && <Check size={14} className="sm-check" />}
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    <section className="sm-section">
                        <div className="sm-section-header">
                            <Hash size={20} className="sm-section-icon" />
                            <div className="sm-section-text">
                                <h3>{t('social.tags', 'Etiquetes que segueixes')}</h3>
                                <p>{t('social.tags_desc', 'Rebràs més contingut relacionat amb aquests temes.')}</p>
                            </div>
                        </div>
                        <div className="sm-tags-cloud">
                            {availableTags.map(tag => {
                                const isFollowed = followedTags.includes(tag);
                                return (
                                    <button
                                        key={tag}
                                        className={`sm-tag-pill ${isFollowed ? 'followed' : ''}`}
                                        onClick={() => {
                                            const updated = isFollowed
                                                ? followedTags.filter(t => t !== tag)
                                                : [...followedTags, tag];
                                            savePreferences({ followedTags: updated });
                                        }}
                                    >
                                        {isFollowed && <Sparkles size={12} className="sm-spark" />}
                                        {tag}
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                </div>

                <footer className="sm-footer">
                    <button className="sm-done-btn" onClick={onClose}>
                        {t('common.done', 'FET')}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default SocialManager;
