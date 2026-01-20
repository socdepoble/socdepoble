import React from 'react';
import { useTranslation } from 'react-i18next';
import './CategoryTabs.css';

const CategoryTabs = ({ selectedRole, onSelectRole, exclude = [], tabs }) => {
    const { t } = useTranslation();

    const defaultRoles = [
        { id: 'tot', label: t('common.role_all') },
        { id: 'gent', label: t('common.role_gent') },
        { id: 'grup', label: t('common.role_grup') },
        { id: 'empresa', label: t('common.role_empresa') },
        { id: 'oficial', label: t('common.role_oficial') }
    ];

    const allRoles = tabs || defaultRoles;
    const roles = allRoles.filter(role => !exclude.includes(role.id));

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
                onClick={() => console.log('Future management screen')}
            >
                +
            </button>
        </div>
    );
};

export default CategoryTabs;
