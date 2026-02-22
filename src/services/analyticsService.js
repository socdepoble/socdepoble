import ReactGA from "react-ga4";

const GA_ID = import.meta.env.VITE_GA_ID;

export const initGA = () => {
    if (GA_ID) {
        ReactGA.initialize(GA_ID);
        console.log("🏺 [ANALYTICS] Bategat mètric inicialitzat amb ID:", GA_ID);
    } else {
        console.warn("⚠️ [ANALYTICS] No s'ha trobat el Measurement ID de Google Analytics.");
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
