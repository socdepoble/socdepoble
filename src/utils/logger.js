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
        if (isDev) console.error(...args);
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

/**
 * Creates a prefixed logger for a specific component.
 */
export const createLogger = (prefix) => ({
    log: (...args) => logger.log(`[${prefix}]`, ...args),
    error: (...args) => logger.error(`[${prefix}]`, ...args),
    warn: (...args) => logger.warn(`[${prefix}]`, ...args),
    info: (...args) => logger.info(`[${prefix}]`, ...args),
    debug: (...args) => logger.debug(`[${prefix}]`, ...args),
});

export default logger;
