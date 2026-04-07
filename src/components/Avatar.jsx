import React from 'react';
import DynamicIcon from './DynamicIcon';
import { ROLES } from '../constants';

const getAvatarIconName = (role) => {
    switch (role) {
        case ROLES.OFFICIAL: return 'Building2';
        case ROLES.BUSINESS: return 'Store';
        case ROLES.GROUPS: return 'Users';
        default: return 'User';
    }
};

const getAvatarColor = (role) => {
    switch (role) {
        case ROLES.OFFICIAL: return 'var(--color-primary)';
        case ROLES.BUSINESS: return 'var(--color-secondary)';
        case ROLES.GROUPS: // Falls through to default orange
        default: return '#FF7300'; // Taronja Corporatiu Sóc de Poble (Protocol OMEGA)
    }
};

const getAvatarFallbackImage = (role) => {
    switch (role) {
        case ROLES.OFFICIAL: return '/assets/avatars/iaia_comic_matriarch.png';
        case ROLES.BUSINESS: return '/assets/avatars/avatar_lucia_comic.png';
        case ROLES.GROUPS: return '/assets/avatars/avatar_man_1.png';
        case 'ambassador': return '/assets/avatars/iaia_comic_matriarch.png';
        case 'iaia': return '/assets/avatars/iaia_comic_matriarch.png';
        default: return null; // Let initials/icon handle it for neighbors
    }
};

const Avatar = ({ src, role, name, size = 44, className = "" }) => {
    const [hasError, setHasError] = React.useState(false);

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
    let normalizedSrc = (src && !src.startsWith('http') && !src.startsWith('/')) ? `/${src}` : src;

    // [HEALING PROTOCOL] Intercept legacy broken supabase avatars (400 Bad Request prevention)
    if (normalizedSrc && normalizedSrc.includes('avatar_agent_iaia')) {
        normalizedSrc = '/assets/avatars/iaia_comic_matriarch.png';
    }

    // We attempt to load the image in the background first to avoid noisy 400/404 errors 
    // from triggering before we have a chance to show the fallback.
    const [isPreloading, setIsPreloading] = React.useState(!!normalizedSrc);

    React.useEffect(() => {
        setHasError(false);
        setIsPreloading(!!normalizedSrc);
        
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

    // [MASTER DYNAMIC ICON] 
    // Detect if src is an icon identifier (e.g. "lucide:Home" or starts with "icon:")
    const isIcon = src && (src.startsWith('lucide:') || src.startsWith('icon:'));
    const displayIconName = isIcon ? src.replace('icon:', '').replace('lucide:', '') : null;

    if (isIcon) {
        return (
            <div style={style} className={`avatar-container icon-mode ${className}`}>
                <DynamicIcon name={displayIconName} size={numericSize * 0.6} color="white" />
            </div>
        );
    }

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
        if (name.toLowerCase().includes("sóc de poble")) return "SP";
        const parts = name.split(' ').filter(p => p.length > 0);
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        return parts[0][0].toUpperCase();
    };

    return (
        <div style={style} className={`avatar-container fallback ${className}`}>
            {name ? (
                <span style={{ fontSize: numericSize * 0.4 }}>{getInitials(name)}</span>
            ) : (
                <DynamicIcon name={getAvatarIconName(role)} size={numericSize * 0.6} color="white" />
            )}
        </div>
    );
};

export default Avatar;
