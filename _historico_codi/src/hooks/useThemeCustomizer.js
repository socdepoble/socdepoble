import { useState, useEffect, useCallback } from 'react';
import { resolveColorIdentity } from '../constants/ruralColors';

/**
 * useThemeCustomizer [MASTER]
 * Hook per gestionar la personalització granular del disseny (StyleTuner).
 * Actua sobre les variables CSS en temps real i persisteix a localStorage.
 */
export const useThemeCustomizer = () => {
    const [themeConfig, setThemeConfig] = useState(() => {
        const saved = localStorage.getItem('sp-theme-custom-config');
        return saved ? JSON.parse(saved) : {
            fontScale: 1.0,
            primaryColor: '#CC5500', // Terracotta default
            fontFamily: 'system-ui',
            contrastMode: 'standard'
        };
    });

    // Calcula el contrast WCAG 2.1
    const getLuminance = (hex) => {
        const rgb = hex.startsWith('#') ? hex.slice(1) : hex;
        const r = parseInt(rgb.slice(0, 2), 16) / 255;
        const g = parseInt(rgb.slice(2, 4), 16) / 255;
        const b = parseInt(rgb.slice(4, 6), 16) / 255;

        const a = [r, g, b].map(v => {
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };

    const validateContrast = useCallback((bgColor, fgColor = '#FFFFFF') => {
        const l1 = getLuminance(bgColor);
        const l2 = getLuminance(fgColor);
        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        return ratio >= 4.5; // WCAG AA
    }, []);

    // Aplica les variables al body
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--font-scale-multiplier', themeConfig.fontScale);

        // El color pot venir com a string o com a objecte (compatibilitat)
        const hex = typeof themeConfig.primaryColor === 'string'
            ? themeConfig.primaryColor
            : themeConfig.primaryColor.hex;

        root.style.setProperty('--color-action-primary', hex);
        root.style.setProperty('--font-family-base', themeConfig.fontFamily);

        // Aesthetics Guard: Auto-contrast per al text sobre l'accent
        const isDark = getLuminance(hex) < 0.5;
        root.style.setProperty('--color-action-text', isDark ? '#FFFFFF' : '#000000');

        localStorage.setItem('sp-theme-custom-config', JSON.stringify(themeConfig));
    }, [themeConfig]);

    const updateColor = (newHex) => {
        const identity = resolveColorIdentity(newHex);
        setThemeConfig(prev => ({ ...prev, primaryColor: identity }));
    };

    const updateConfig = (newConfig) => {
        if (newConfig.primaryColor) {
            newConfig.primaryColor = resolveColorIdentity(newConfig.primaryColor);
        }
        setThemeConfig(prev => ({ ...prev, ...newConfig }));
    };

    const resetToMasia = () => {
        setThemeConfig({
            fontScale: 1.0,
            primaryColor: resolveColorIdentity('#CC5500'),
            fontFamily: 'system-ui',
            contrastMode: 'standard'
        });
    };

    const ruralInfo = typeof themeConfig.primaryColor === 'string'
        ? resolveColorIdentity(themeConfig.primaryColor)
        : themeConfig.primaryColor;

    return {
        themeConfig,
        updateConfig,
        updateColor,
        resetToMasia,
        validateContrast,
        ruralInfo
    };
};
