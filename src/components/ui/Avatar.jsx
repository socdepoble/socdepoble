import React from 'react';
import { ROLES } from '../../constants';
import { resolveImageUrl } from '../../utils/urlHelper';
import * as LucideIcons from 'lucide-react';

const DynamicIcon = ({ name, size, color }) => {
    const IconComponent = LucideIcons[name] || LucideIcons.User;
    return <IconComponent size={size} color={color} />;
};

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
        case ROLES.OFFICIAL: return '#4F46E5';
        case ROLES.BUSINESS: return 'var(--color-secondary)';
        case ROLES.GROUPS: // Falls through to default orange
        default: return '#FF7300'; // Taronja Corporatiu Sóc de Poble (Protocol OMEGA)
    }
};

const getAvatarFallbackImage = (role) => {
    switch (role) {
        case ROLES.OFFICIAL: return null; // We want to show initials for official if no logo

        case ROLES.BUSINESS: return '/uploads/avatars/avatar_lucia_comic.png';
        case ROLES.GROUPS: return '/uploads/avatars/avatar_man_1.png';
        case 'ambassador': return '/uploads/avatars/iaia_comic_matriarch.png';
        case 'iaia': return '/uploads/avatars/iaia_comic_matriarch.png';
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
    let rawNormalizedSrc = (src && !src.startsWith('http') && !src.startsWith('/')) ? `/${src}` : src;

    // [HEALING PROTOCOL] Intercept legacy broken supabase avatars (400 Bad Request prevention)
    if (rawNormalizedSrc && rawNormalizedSrc.includes('avatar_agent_iaia')) {
        rawNormalizedSrc = '/uploads/avatars/iaia_comic_matriarch.png';
    }

    // [MASTER DYNAMIC OVERRIDE] Force green square for Sóc de Poble
    if (name && (name.toLowerCase().includes('sóc de poble') || name.toLowerCase().includes('soc de poble'))) {
        rawNormalizedSrc = '/assets/system/ui/logo-socdepoble-cuadrat-verd.svg';
    }

    let normalizedSrc = resolveImageUrl(rawNormalizedSrc);

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

    const isEmoji = src && src.length <= 8 && /\p{Extended_Pictographic}/u.test(src);
    
    if (isEmoji) {
        return (
            <div style={{...style, backgroundColor: 'var(--bg-card, #f0f0f0)'}} className={`avatar-container emoji-mode ${className}`}>
                <span style={{ fontSize: numericSize * 0.5, lineHeight: 1 }}>{src}</span>
            </div>
        );
    }

    if ((normalizedSrc || fallbackImage) && !hasError && !isPreloading) {
        return (
            <div style={style} className={`avatar-container ${className}`}>
                <img
                    src={(normalizedSrc || fallbackImage) || undefined}
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
