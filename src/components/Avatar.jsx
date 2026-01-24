import React, { useState } from 'react';
import { User, Building2, Store, Users } from 'lucide-react';
import { ROLES } from '../constants';

const getAvatarIcon = (role, size) => {
    switch (role) {
        case ROLES.OFFICIAL: return <Building2 size={size * 0.5} />;
        case ROLES.BUSINESS: return <Store size={size * 0.5} />;
        case ROLES.GROUPS: return <Users size={size * 0.5} />;
        default: return <User size={size * 0.5} />;
    }
};

const getAvatarColor = (role) => {
    switch (role) {
        case ROLES.OFFICIAL: return 'var(--color-primary)';
        case ROLES.BUSINESS: return 'var(--color-secondary)';
        case ROLES.GROUPS: return '#E07A5F'; // Warm accent
        default: return '#4A5568'; // Darker gray for contrast
    }
};

const getAvatarFallbackImage = (role) => {
    switch (role) {
        case ROLES.OFFICIAL: return '/images/demo/avatar_man_old.png';
        case ROLES.BUSINESS: return '/images/demo/avatar_lucia.png';
        case ROLES.GROUPS: return '/images/demo/avatar_man_1.png';
        case 'ambassador': return '/logo.png'; // Use official logo
        default: return '/images/demo/avatar_man_1.png'; // Universal fallback
    }
};

const Avatar = ({ src, role, name, size = 44, className = "" }) => {
    const [hasError, setHasError] = useState(false);

    const style = {
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: getAvatarColor(role),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 800,
        overflow: 'hidden',
        flexShrink: 0,
        border: '2px solid rgba(255, 255, 255, 0.1)'
    };

    const fallbackImage = getAvatarFallbackImage(role);

    if ((src || fallbackImage) && !hasError) {
        return (
            <div style={style} className={`avatar-container ${className}`}>
                <img
                    src={src || fallbackImage}
                    alt={name ? `Avatar de ${name}` : 'Avatar'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={() => setHasError(true)}
                />
            </div>
        );
    }

    return (
        <div style={style} className={`avatar-container fallback ${className}`}>
            {getAvatarIcon(role, size)}
        </div>
    );
};

export default Avatar;
