import React from 'react';
import { useTranslation } from 'react-i18next';
import { logger } from '../utils/logger';
import { useUI } from '../context/UIContext';
import { useSocial } from '../context/SocialContext';
import './CategoryTabs.css';

const CategoryTabs = ({ selectedRole, onSelectRole, exclude = [], tabs }) => {
    const { t } = useTranslation();
    const { setIsSocialManagerOpen } = useUI();
    const { activeCategories } = useSocial();

    const defaultRoles = [
        { id: 'tot', label: t('common.role_all') },
        { id: 'xat', label: t('common.role_all') }, // Fallback for chat-specific tabs
        { id: 'gent', label: t('common.role_gent') },
        { id: 'grup', label: t('common.role_grup') },
        { id: 'empresa', label: t('common.role_empresa') },
        { id: 'oficial', label: t('common.role_oficial') },
        { id: 'treball', label: t('common.role_treball') },
        { id: 'pobo', label: t('common.role_pobo') }
    ];

    const allRoles = tabs || defaultRoles;

    // Filter by activeCategories, but always keep 'tot' and 'xat' if they are the "All" view
    const roles = allRoles.filter(role =>
        !exclude.includes(role.id) &&
        (role.id === 'tot' || activeCategories.includes(role.id))
    );

    return (
        <div className="category-tabs">
            {roles.map(role => (
                <button
                    key={role.id}
                    className={`category-tab ${selectedRole === role.id ? 'active' : ''}`}
                    onClick={() => onSelectRole(role.id)}
                >
                    {role.label}
                </button>
            ))}
            <button
                className="category-tab add-tab"
                onClick={() => setIsSocialManagerOpen(true)}
            >
                +
            </button>
        </div>
    );
};

export default CategoryTabs;
