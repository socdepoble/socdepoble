import { useState, useEffect } from 'react';
import { supabaseService } from '../core/services/supabaseService';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../app/context/AuthContext';
import { ENTITY_TYPES } from '../constants';
import { logger } from '../utils/logger';
import './EntitySelector.css';

const EntitySelector = ({ currentIdentity, onSelectIdentity, mini = false }) => {
    const { t } = useTranslation();
    const { user, profile } = useAuth();
    const [entities, setEntities] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const loadEntities = async () => {
        try {
            const userEntities = await supabaseService.getUserEntities(user.id);
            setEntities(userEntities);
        } catch (error) {
            logger.error('Error loading entities:', error);
        }
    };

    useEffect(() => {
        if (user) {
            loadEntities();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const identities = [
        {
            id: 'user',
            name: profile?.full_name || 'Jo',
            type: 'user',
            avatar_url: profile?.avatar_url,
            isUser: true
        },
        ...entities
    ];

    const handleSelect = (identity) => {
        onSelectIdentity(identity);
        setIsOpen(false);
    };

    const getIcon = (type) => {
        if (type === ENTITY_TYPES.GROUP) return <Building2 size={18} />;
        if (type === ENTITY_TYPES.BUSINESS) return <Store size={18} />;
        if (type === ENTITY_TYPES.AUTONOMOUS) return <Briefcase size={18} />;
        if (type === ENTITY_TYPES.STUDENT) return <GraduationCap size={18} />;
        return <User size={18} />;
    };

    const getLabel = (identity) => {
        if (identity.isUser) return t('common.personal_profile') || 'Perfil Personal';
        if (identity.type === ENTITY_TYPES.GROUP) return t('common.role_grup') || 'Grup';
        if (identity.type === ENTITY_TYPES.BUSINESS) return t('common.role_empresa') || 'Empresa';
        if (identity.type === ENTITY_TYPES.AUTONOMOUS) return t('common.role_autonomo') || 'Autònom / Freelance';
        if (identity.type === ENTITY_TYPES.STUDENT) return t('common.role_estudiant') || 'Estudiant';
        return t('common.role_oficial') || 'Oficial';
    }

    return (
        <div className={`entity-selector-container ${mini ? 'mini' : ''}`}>
            {!mini && <label>{t('common.publish_as') || 'Publicar com a:'}</label>}
            <div className={`selector-trigger ${mini ? 'mini' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                <div className="selected-identity">
                    {currentIdentity.avatar_url ? (
                        <img src={currentIdentity.avatar_url} alt="" className="identity-avatar-small" />
                    ) : (
                        <div className="identity-icon-placeholder">
                            {getIcon(currentIdentity.type)}
                        </div>
                    )}
                    <span className="identity-name">{currentIdentity.name}</span>
                </div>
                <ChevronDown size={14} className={`chevron ${isOpen ? 'open' : ''}`} />
            </div>

            {isOpen && (
                <div className="identity-dropdown">
                    {identities.map((identity) => (
                        <div
                            key={identity.id}
                            className={`identity-option ${currentIdentity.id === identity.id ? 'active' : ''}`}
                            onClick={() => handleSelect(identity)}
                        >
                            {identity.avatar_url ? (
                                <img src={identity.avatar_url} alt="" className="identity-avatar-small" />
                            ) : (
                                <div className="identity-icon-placeholder">
                                    {getIcon(identity.type)}
                                </div>
                            )}
                            <div className="identity-info">
                                <span className="name">{identity.name}</span>
                                <span className="type-label">
                                    {getLabel(identity)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EntitySelector;
