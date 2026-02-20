import React from 'react';
import * as LucideIcons from 'lucide-react';
import './DynamicIcon.css';

/**
 * DynamicIcon Component
 * Renders a Lucide icon by name or an external image (SVG/PNG).
 * Supports the "Solid, Simple, Large" aesthetic for Sóc de Poble.
 * 
 * @param {string} name - Icon name (e.g. "Home", "User", or full URL)
 * @param {number} size - Size in pixels (default: 24)
 * @param {string} color - CSS color
 * @param {boolean} solid - Whether to use a thicker stroke for Lucide icons
 * @param {string} className - Additional classes
 */
const DynamicIcon = ({ name, size = 24, color = 'currentColor', solid = true, className = '' }) => {
    if (!name) return null;

    const normalizedName = name.startsWith('icon:') ? name.replace('icon:', '') : name;

    // 1. Check if it's a URL (starts with http, https or /)
    const isUrl = normalizedName.startsWith('http') || normalizedName.startsWith('/') || normalizedName.includes('.');
    
    if (isUrl) {
        return (
            <img 
                src={normalizedName} 
                alt="icon" 
                style={{ width: size, height: size, objectFit: 'contain' }}
                className={`dynamic-icon-img ${solid ? 'dynamic-icon-solid' : ''} ${className}`}
                loading="lazy"
            />
        );
    }

    // 2. Resolve Lucide Icon
    const iconKey = normalizedName.replace('lucide:', '').trim();
    // Capitalize first letter (Lucide uses PascalCase)
    const lucideName = iconKey.charAt(0).toUpperCase() + iconKey.slice(1);
    
    const IconComponent = LucideIcons[lucideName];

    if (!IconComponent) {
        // Fallback to a default icon if not found
        console.warn(`[DynamicIcon] Icon "${normalizedName}" not found in Lucide.`);
        return <LucideIcons.HelpCircle size={size} color={color} className={className} />;
    }

    return <IconComponent size={size} color={color} className={className} strokeWidth={solid ? 3 : 2} />;
};

export default DynamicIcon;
