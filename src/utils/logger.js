/**
 * Utilitat de Logger condicional per a Sóc de Poble.
 * Només es mostren logs en entorn de desenvolupament.
 */

const isDev = import.meta.env.DEV;

export const logger = {
    log: (...args) => {
        if (isDev) console.log(...args);
    },
    error: (...args) => {
        // En producció podríem enviar-ho a un servei extern (Sentry, etc.)
        if (isDev) {
            console.error(...args);
        } else {
            // Log mínim o silenci
        }
    },
    warn: (...args) => {
        if (isDev) console.warn(...args);
    },
    info: (...args) => {
        if (isDev) console.info(...args);
    },
    debug: (...args) => {
        if (isDev) console.debug(...args);
    }
};

export default logger;
