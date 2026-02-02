/**
 * Informes Forenses de l'IAIA [MASTER SESSION]
 * Aquests informes detallen les accions automàtiques realitzades pel sistema de manteniment.
 */

export const FORENSIC_REPORTS = [
    {
        id: 'report-peace-signal',
        timestamp: '2026-02-01T04:20:00Z',
        title: "Senyal de Pau (La Llumeta Verda)",
        icon: 'Activity',
        status: 'success',
        summary: "Confirmació binària de manteniment completat.",
        details: [
            "El corral està net, els animals (dades) menjats i la porta tancada.",
            "Indicador visual actiu a la Consola de Comandament.",
            "Sincronització amb Rhizome DB realitzada amb èxit."
        ]
    },
    {
        id: 'report-atum-autohealing',
        timestamp: '2026-02-01T03:15:00Z',
        title: "Protocol ATUM (Autoreparació)",
        icon: 'Zap',
        status: 'healing',
        summary: "Detecció i cauterització de ferides del sistema.",
        details: [
            "**Purga de l'Error 'Pantalla Blanca'**: Implementada la 'Ruta de Rescat'. Redirecció a la Plaça després de 500ms d'inactivitat forçada.",
            "**Farciment de Buits (Nano Banana)**: Detectats perfils sense imatge. Aplicat l'avatar per defecte segons el ritu de Nano Banana.",
            "Compliment de la norma: 'Cap perfil pot aparèixer mort'."
        ]
    },
    {
        id: 'report-carrasca-freeze',
        timestamp: '2026-02-01T01:00:00Z',
        title: "El Code Freeze (La Llei de la Carrasca)",
        icon: 'Shield',
        status: 'locked',
        summary: "Cadenat aplicat per garantir l'estabilitat.",
        details: [
            "Bloqueig de noves funcionalitats experimentals des de l'última sessió.",
            "Rhizome DB blindada en mode 'Només Lectura i Sincronització'.",
            "Priorització absoluta de l'estabilitat sobre la novetat."
        ]
    },
    {
        id: 'report-ruper-search',
        timestamp: '2026-01-31T23:50:00Z',
        title: "Superbuscador (Rúper Ratón)",
        icon: 'Search',
        status: 'optimized',
        summary: "Indexació profunda per a cerques instantànies.",
        details: [
            "Creació d'índexs FTS5 (Full-Text Search) a SQLite.",
            "L'IAIA ha llegit i indexat tot el contingut abans de la pregunta de l'usuari.",
            "Latència de cerca reduïda a <20ms."
        ]
    }
];
