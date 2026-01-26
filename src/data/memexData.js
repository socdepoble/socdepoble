/**
 * IAIA Memex Data - Cognitive Cache for the Admin Panel
 * This data is used to render Knowledge Nodes in the Memex Module.
 */
export const memexData = {
    version: "1.5.1",
    lastPulse: "2026-01-26 01:15:00",
    stats: {
        architectureIntegrity: 98,
        cognitiveRetention: 100,
        unresolvedIncidents: 0
    },
    knowledgeNodes: [
        {
            id: "arch-resilience",
            category: "ARQUITECTURA",
            title: "SW Proactive Resilience",
            content: "Implementació d'un sistema de 'heartbeat' al Service Worker per evitar bloquejos de caché. Pings cada 5m a /api/health.",
            priority: "alta",
            icon: "Shield"
        },
        {
            id: "atomic-profile",
            category: "ESTRUCTURA",
            title: "Atomic Profile Decomposition",
            content: "Refactorització de Profile.jsx de 868 a 332 línies. Descomposició en tabs atòmics i hooks especialitzats.",
            priority: "mitjana",
            icon: "LayoutGrid"
        },
        {
            id: "react-query",
            category: "DADES",
            title: "React Query Integration",
            content: "Gestió centralitzada de dades amb caching global. Eliminats els 'waterfalls' de càrrega al perfil i entitats.",
            priority: "mitjana",
            icon: "Zap"
        },
        {
            id: "zombie-sw",
            category: "LLEÇONS",
            title: "The Zombie SW Incident",
            content: "La caché persistent pot bloquejar actualitzacions. S'ha d'incrementar la versió en 3 punts: main.jsx, sw.js, health.js.",
            priority: "crítica",
            icon: "AlertTriangle"
        },
        {
            id: "unified-status-fallback",
            category: "LLEÇONS",
            title: "ReferenceError: UnifiedStatus",
            content: "No esborrar mai tags si poden estar en caché antiga. Solució: Fallback global a window.UnifiedStatus.",
            priority: "alta",
            icon: "CheckCircle"
        }
    ]
};
