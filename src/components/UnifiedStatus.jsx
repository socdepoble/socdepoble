import React from 'react';
import { BadgeCheck, Clock, AlertCircle } from 'lucide-react';

/**
 * UnifiedStatus Component
 * Displays a standardized status badge for verification or state.
 * Fallback implementation to fix missing dependency.
 */
const UnifiedStatus = ({ status, type = 'user', size = 'md' }) => {
    // Basic mapping
    const getStatusConfig = () => {
        switch (status) {
            case 'verified':
            case 'active':
            case 'approved':
                return {
                    icon: <BadgeCheck size={size === 'sm' ? 14 : 16} />,
                    text: 'Verificat',
                    color: 'var(--cc-success)',
                    bg: 'rgba(34, 197, 94, 0.1)'
                };
            case 'pending':
                return {
                    icon: <Clock size={size === 'sm' ? 14 : 16} />,
                    text: 'Pendent',
                    color: 'var(--cc-accent)',
                    bg: 'rgba(255, 126, 51, 0.1)'
                };
            default:
                return {
                    icon: null,
                    text: null,
                    color: 'transparent',
                    bg: 'transparent'
                };
        }
    };

    const config = getStatusConfig();

    if (!config.text) return null;

    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: size === 'sm' ? '2px 6px' : '4px 8px',
            borderRadius: '99px',
            backgroundColor: config.bg,
            color: config.color,
            fontSize: size === 'sm' ? '0.75rem' : '0.875rem',
            fontWeight: '600',
            border: `1px solid ${config.color}`
        }}>
            {config.icon}
            <span>{config.text}</span>
        </div>
    );
};

export default UnifiedStatus;
