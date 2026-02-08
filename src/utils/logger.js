const isDev = import.meta.env.DEV;

// [SILENCE PROTOCOL] Master Patterns to suppress
export const SILENCE_PATTERNS = [
    'beforeinstallpromptevent',
    'Banner not shown',
    'shadow host',
    'ShadowRoot',
    'User denied Geolocation',
    'ADVERTIMENT',
    'Self-XSS',
    'Si feu servir aquesta consola',
    '[ThemeEngine]',
    '[BOOT]',
    '[Rhizome]',
    'ResizeObserver',
    'React does not recognize',
    'React DevTools',
    'Download the React DevTools',
    '[AuthProvider] Montat'
];

export const checkSilence = (msg) => {
    if (!msg) return false;
    const strMatch = SILENCE_PATTERNS.some(p => String(msg).includes(p));
    return strMatch;
};

export const logger = {
    log: (message, ...args) => {
        if (isDev && !checkSilence(message)) {
            console.log(`%c[INFO] ${message}`, 'color: #94a3b8', ...args);
        }
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
