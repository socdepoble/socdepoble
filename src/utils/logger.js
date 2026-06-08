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
    '[Towns]',
    '[Feed]',
    '[SupabaseService]',
    'Applying strict author-territory filter',
    'townId entry',
    'Instant Load',
    'ResizeObserver',
    'React does not recognize',
    'React DevTools',
    'Download the React DevTools',
    '[AuthProvider] Montat',
    'INITIAL_SESSION',
    'Violation',
    "Bypass d'Emergència",
    "TIMEOUT_OPFS",
    "Update on reload",
    "ServiceWorker registration",
    "workbox",
    "Precaching",
    "PWA",
    "[WebCrypto]",
    "[IPFS]",
    "[App]",
    "Error tracking",
    "@Current",
    "Purga fantasma",
    "[BUNKER]",
    "NoteBookLM",
    "fetchpriority"
];

export const checkSilence = (msg) => {
    if (!msg) return false;
    let text = typeof msg === 'string' ? msg : '';
    if (!text) {
        try {
            text = JSON.stringify(msg);
        } catch {
            text = String(msg);
        }
    }
    return SILENCE_PATTERNS.some(p => text.includes(p));
};

export const logger = {
    log: (message, ...args) => {
        if (!checkSilence(message)) {
            window.dispatchEvent(new CustomEvent('app:log', { detail: { level: 'info', message, args } }));
        }
    },
    error: (message, ...args) => {
        if (!checkSilence(message)) {
            window.dispatchEvent(new CustomEvent('app:log', { detail: { level: 'error', message, args } }));
        }
    },
    warn: (message, ...args) => {
        if (!checkSilence(message)) {
            window.dispatchEvent(new CustomEvent('app:log', { detail: { level: 'warn', message, args } }));
        }
    },
    info: (message, ...args) => {
        if (!checkSilence(message)) {
            window.dispatchEvent(new CustomEvent('app:log', { detail: { level: 'info', message, args } }));
        }
    },
    debug: (message, ...args) => {
        if (!checkSilence(message)) {
            window.dispatchEvent(new CustomEvent('app:log', { detail: { level: 'debug', message, args } }));
        }
    }
};

