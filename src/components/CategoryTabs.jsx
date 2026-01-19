import React from 'react';
import { useTranslation } from 'react-i18next';
import './CategoryTabs.css';

const CategoryTabs = ({ selectedRole, onSelectRole, exclude = [] }) => {
    const { t } = useTranslation();

    const allRoles = [
        { id: 'tot', label: t('common.role_all') },
        { id: 'gent', label: t('common.role_gent') },
        { id: 'grup', label: t('common.role_grup') },
        { id: 'empresa', label: t('common.role_empresa') },
        { id: 'oficial', label: t('common.role_oficial') }
    ];

    const roles = allRoles.filter(role => !exclude.includes(role.id));

    return (
        <div className="category-tabs">
            {roles.map(role => (
                <button
                    key={role.id}
                    className={`category-tab ${selectedRole === role.id ? 'active' : ''}`}
                    onClick={() => onSelectRole(role.id)}
                    style={{ textTransform: 'uppercase', fontSize: '11px', fontWeight: '800', letterSpacing: '0.5px' }}
                >
                    {role.label}
                </button>
            ))}
        </div>
    );
};

export default CategoryTabs;
