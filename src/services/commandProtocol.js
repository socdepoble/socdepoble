/**
 * Sóc de Poble - Command Protocol (Antigravity Edition)
 * Aquest fitxer serveix com a pont per a registrar accions ràpides de publicació
 * i configuració executades per l'Arquitecte d'IA o Super Administradors.
 */

export const AntigravityProtocol = {
    version: '1.0.0',
    actions: [],

    /**
     * Registra una publicació forçada des d'Antigravity
     */
    logPublication: (author, topic, timestamp) => {
        const action = {
            id: crypto.randomUUID(),
            type: 'AUTO_PUBLISH',
            author,
            topic,
            timestamp: timestamp || new Date().toISOString(),
            status: 'CONSOLIDATED'
        };
        AntigravityProtocol.actions.push(action);
        console.log(`[AntigravityProtocol] Acció registrada: ${topic} per ${author}`);
        return action;
    }
};

// Expose to window for audit in dev console
if (typeof window !== 'undefined') {
    window.AntigravityProtocol = AntigravityProtocol;
}
