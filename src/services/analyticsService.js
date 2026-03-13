import ReactGA from "react-ga4";

const GA_ID = import.meta.env.VITE_GA_ID;

export const initGA = () => {
    if (GA_ID) {
        ReactGA.initialize(GA_ID);
        // logger.info("🏺 [ANALYTICS] Bategat mètric inicialitzat");
    } else {
        // Silenciós en producció per evitar soroll visual
        /* if (import.meta.env.DEV) {
            console.log("🏺 [ANALYTICS] Mode silenciós actiu (Sense ID).");
        } */
    }
};

export const trackPageView = (path) => {
    if (GA_ID) {
        ReactGA.send({ hitType: "pageview", page: path });
        console.log("🏺 [ANALYTICS] Ruta bategada:", path);
    }
};

export const trackEvent = (category, action, label) => {
    if (GA_ID) {
        ReactGA.event({
            category,
            action,
            label
        });
        console.log(`🏺 [ANALYTICS] Esdeveniment rural: ${category} -> ${action} (${label || ''})`);
    }
};
