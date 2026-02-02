import { logger } from './logger';

/**
 * ContrastGuard: Protecció de llegibilitat MASTER
 * Calcula el contrast WCAG entre colors i proposa correccions automàtiques.
 */

export const getContrastRatio = (fColor, bColor) => {
    const getLuminance = (hex) => {
        const rgb = hex.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16) / 255);
        const a = rgb.map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
        return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
    };

    const l1 = getLuminance(fColor);
    const l2 = getLuminance(bColor);

    const brightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);

    return (brightest + 0.05) / (darkest + 0.05);
};

export const enforceContrast = (foreground, background, threshold = 4.5) => {
    const ratio = getContrastRatio(foreground, background);
    if (ratio >= threshold) return foreground;

    logger.warn(`[ContrastGuard] Contrast insuficient (${ratio.toFixed(2)}). Corregint per a Sóc de Poble...`);

    // Si és massa baix, busquem el blanc o el negre més pur segons la lluminositat del fons
    const getLuminance = (hex) => {
        const rgb = hex.replace('#', '').match(/.{2}/g).map(x => parseInt(x, 16) / 255);
        return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    };

    return getLuminance(background) > 0.5 ? '#000000' : '#FFFFFF';
};

/**
 * Hook per a aplicar contrast dinàmic a components reactius
 */
import { useEffect, useState } from 'react';

export const useContrastGuard = (fg, bg) => {
    const [safeFg, setSafeFg] = useState(fg);

    useEffect(() => {
        if (fg && bg) {
            setSafeFg(enforceContrast(fg, bg));
        }
    }, [fg, bg]);

    return safeFg;
};
