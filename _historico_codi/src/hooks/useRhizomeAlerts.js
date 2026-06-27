import { useSyncExternalStore } from 'react';
import { rhizomeMesh } from '../core/services/RhizomeMesh';

/**
 * useRhizomeAlerts (Zero Network Protocol)
 * Conecta un mapa Yjs distribuido (Alertas P2P) directo con la Vista de React.
 * Ignora totalmente a Supabase. Las escrituras aquí viajan directo al éter Bluetooth.
 */

// Usamos el Map 'alerts' definido en el constructor de RhizomeMesh
const alertsMap = rhizomeMesh.getStore('map', 'alerts');

const getSnapshot = () => {
    // Retornamos un Array inmutable para React cada vez que hay una mutación
    return JSON.stringify(Array.from(alertsMap.values()));
};

const subscribe = (callback) => {
    // Observador atómico nativo de Yjs
    const observer = () => {
        callback();
    };
    
    alertsMap.observe(observer);
    
    // Función Cleanup
    return () => alertsMap.unobserve(observer);
};

export const useRhizomeAlerts = () => {
    const alertsStr = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
    const alertsList = JSON.parse(alertsStr);

    // Ordenamiento por fecha (las más recientes arriba)
    const sortedAlerts = alertsList.sort((a, b) => b.timestamp - a.timestamp);

    const publishAlert = (content, dtnLevel = 1) => {
        const id = crypto.randomUUID();
        // Las escrituras mutan silenciosamente el Map. 
        // Yjs dispara un Update, YjsBleTransport lo intercepta, lo hace un chunk y lo emite vía DTN.
        alertsMap.set(id, {
            id,
            content,
            timestamp: Date.now(),
            dtnLevel, // QoS Protocol
            emitter: localStorage.getItem('sp_identity_uuid') || 'Anon-Mule'
        });
    };

    const deleteAlert = (id) => {
        alertsMap.delete(id);
    };

    return {
        alerts: sortedAlerts,
        publishAlert,
        deleteAlert
    };
};
