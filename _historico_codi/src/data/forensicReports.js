/**
 * Informes Forenses de l'IAIA [MASTER SESSION]
 * Aquests informes detallen les accions automàtiques realitzades pel sistema de manteniment.
 */

export const FORENSIC_REPORTS = [
    {
        id: 'report-eg-walker-sync',
        timestamp: new Date().toISOString(),
        title: "Convergència Eg-walker (DAG)",
        icon: 'Activity',
        status: 'success',
        summary: "Sincronització de línia temporal determinista.",
        details: [
            "**Algorisme:** Eg-walker v3.0 (Lamport Tie-break).",
            "**Estat:** 0 conflictes detectats al graf d'esdeveniments.",
            "**Persistència:** IndexedDB (RhizomeDB) actualitzada sense spinners.",
            "Compliment del protocol: 'Càrrega instantània des del disc'."
        ]
    },
    {
        id: 'report-rhizome-mesh',
        timestamp: new Date().toISOString(),
        title: "Xarxa Rhizome (Gossip)",
        icon: 'Zap',
        status: 'optimized',
        summary: "Malla de veïns resilient activa.",
        details: [
            "**Protocol:** Plumtree (Difusió epidèmica).",
            "**Connectivitat:** HyParView gestionant el churn de nodes rural.",
            "**Dades:** Sincronització de bandos via gossip protocol.",
            "Latència de propagació territorial: <15ms."
        ]
    },
    {
        id: 'report-peace-signal',
        timestamp: '2026-02-11T04:20:00Z',
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
    }
];
