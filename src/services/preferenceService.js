// [MASTER] Preference Service - Sobirania de l'Usuari [BATEGA]

const PREFS_KEY = 'socdepoble_prefs';

const DEFAULT_CONFIG = {
    landingPage: 'mur',       // Pàgina d'inici per defecte
    theme: 'light',           // Estètica mestra
    visionMode: 'hibrida',   // Mode de visió per defecte
    vibe: 'genius',          // Ambientació
    gloveMode: false         // Mode guants desactivat
};

export const preferenceService = {
    /**
     * Obté les preferències actuals o les de defecte
     */
    getPrefs() {
        try {
            const saved = localStorage.getItem(PREFS_KEY);
            return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : DEFAULT_CONFIG;
        } catch (e) {
            console.error('[Prefs] Error llegint localStorage:', e);
            return DEFAULT_CONFIG;
        }
    },

    /**
     * Guarda una o més preferències
     */
    setPrefs(newPrefs) {
        try {
            const current = this.getPrefs();
            const updated = { ...current, ...newPrefs };
            localStorage.setItem(PREFS_KEY, JSON.stringify(updated));

            // Efectes col·laterals immediats si cal
            if (newPrefs.theme) document.documentElement.setAttribute('data-theme', newPrefs.theme);
            if (newPrefs.vibe) document.documentElement.setAttribute('data-vibe', newPrefs.vibe);

            return updated;
        } catch (e) {
            console.error('[Prefs] Error guardant a localStorage:', e);
        }
    },

    /**
     * Restaura l'Ordre Natural (Reset total)
     */
    resetToNaturalOrder() {
        localStorage.removeItem(PREFS_KEY);
        // Netejar altres claus legacy si n'hi ha
        localStorage.removeItem('theme');
        localStorage.removeItem('app-vibe');
        localStorage.removeItem('visionMode');
        localStorage.removeItem('sp_glove_mode');
        localStorage.removeItem('sp_landing_page');

        window.location.reload();
    }
};
