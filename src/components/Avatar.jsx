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
        case ROLES.OFFICIAL: return '/assets/avatars/iaia_official.png';
        case ROLES.BUSINESS: return '/images/demo/avatar_lucia.png';
        case ROLES.GROUPS: return '/images/demo/avatar_man_1.png';
        case 'ambassador': return '/assets/avatars/iaia_official.png';
        case 'iaia': return '/assets/avatars/iaia_official.png';
        default: return '/assets/avatars/iaia_official.png'; 
    }
};

const Avatar = ({ src, role, name, size = 44, className = "" }) => {
    const [hasError, setHasError] = useState(false);

    // Map common string sizes to numbers to prevent NaN in SVG calculations
    const numericSize = typeof size === 'number' ? size : {
        'xs': 24,
        'sm': 32,
        'md': 44,
        'lg': 64,
        'xl': 96
    }[size] || 44;

    const style = {
        width: numericSize,
        height: numericSize,
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
    const normalizedSrc = (src && !src.startsWith('http') && !src.startsWith('/')) ? `/${src}` : src;

    // [SILENT SHIELD] 
    // We attempt to load the image in the background first to avoid noisy 400/404 errors 
    // from triggering before we have a chance to show the fallback.
    const [isPreloading, setIsPreloading] = useState(!!normalizedSrc);

    React.useEffect(() => {
        if (!normalizedSrc) {
            setIsPreloading(false);
            return;
        }

        const img = new Image();
        img.src = normalizedSrc;
        img.onload = () => setIsPreloading(false);
        img.onerror = () => {
            setHasError(true);
            setIsPreloading(false);
        };
    }, [normalizedSrc]);

    if ((normalizedSrc || fallbackImage) && !hasError && !isPreloading) {
        return (
            <div style={style} className={`avatar-container ${className}`}>
                <img
                    src={normalizedSrc || fallbackImage}
                    alt={name ? `Avatar de ${name}` : 'Avatar'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={() => setHasError(true)}
                />
            </div>
        );
    }

    if (isPreloading) {
        return (
            <div style={style} className={`avatar-container loading ${className}`}>
                {/* Minimal placeholder while preloading to prevent flicker */}
            </div>
        );
    }

    const getInitials = (name) => {
        if (!name) return "";
        if (name === "Associació Cultural Sant Gregori") return "SG";
        const parts = name.split(' ').filter(p => p.length > 0);
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        return parts[0][0].toUpperCase();
    };

    return (
        <div style={style} className={`avatar-container fallback ${className}`}>
            {name ? (
                <span style={{ fontSize: numericSize * 0.4 }}>{getInitials(name)}</span>
            ) : (
                getAvatarIcon(role, numericSize)
            )}
        </div>
    );
};

export default Avatar;
