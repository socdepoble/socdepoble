import React from 'react';
import { Menu } from 'lucide-react';

/**
 * [Ona 9] Botó circular unificat basat en l'estil "molt bonic" de ContextualMenu.
 * Elimina la necessitat de tindre "14 botons inventats".
 */
const RoundButton = ({ 
    icon, 
    onClick, 
    isActive = false, 
    activeRotate = true,
    className = "", 
    title = "",
    colorClass = "bg-white/5 text-slate-400 hover:bg-[var(--theme-accent-primary)] hover:text-white",
    activeColorClass = "bg-[var(--theme-accent-primary)] text-white",
    sizeClasses = "w-8 h-8 rounded-[28px]",
    iconSize = 16,
    iconStrokeWidth = 4,
    ...props
}) => {
    const IconComponent = icon || Menu;
    
    return (
        <button 
            onClick={onClick}
            title={title}
            className={`flex items-center justify-center transition-all active:scale-95 shadow-inner ${sizeClasses} ${isActive ? activeColorClass : colorClass} ${className}`}
            {...props}
        >
            <IconComponent 
                size={iconSize} 
                strokeWidth={iconStrokeWidth} 
                className={`transition-transform duration-200 ${isActive && activeRotate ? 'rotate-45' : ''}`} 
            />
        </button>
    );
};

export default RoundButton;
