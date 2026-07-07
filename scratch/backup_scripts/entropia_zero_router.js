/**
 * ENTROPIA ZERO ROUTER (V5.0.2)
 * Arquitectura de Qwen (11+2 propietats)
 */
const path = require('path');

// Les 11 propietats del Nucli Universal
const CORE_PROPS = [
    'id', 'name', 'version', 'created_at', 'updated_at',
    'authority', 'tipus', 'macro_regio', 'tags', 'estat', 'related'
];

// Les 2 propietats de governança (opcionals)
const GOV_PROPS = ['tier', 'pes_regla'];

const ALLOWED_MACRO_REGIONS = ['Còrtex', 'Hipocamp', 'Motor', ''];
const ALLOWED_ESTATS = ['actiu', 'arxivat', 'deprecated'];
const GOV_TYPES = ['directriu', 'norma', 'protocol'];

// Taula d'Enrutament Adaptada a l'Estructura de Qwen
const ROUTING_TABLE = {
    'directriu': '00_protocols/normes/',
    'norma': '00_protocols/normes/',
    'protocol': '00_protocols/protocols/',
    'identitat': '01_identitat/iaia/', 
    'cultura': '01_identitat/cultura/',
    'disseny': '02_arquitectura/disseny/',
    'arquitectura': '02_arquitectura/catedral/',
    'skill': '03_skills/',
    'schema': '04_dades/schemas/',
    'acte': '05_memoria/actes_recents/',
    'memoria': '05_memoria/actes_recents/',
    'arxiu': '05_memoria/arxiu_historic/',
    'script': '06_maquinaria/scripts/',
    'eina': '06_maquinaria/scripts/',
    'plantilla': '06_maquinaria/plantilles/'
};

function validarFrontmatter(fm) {
    const errors = [];
    
    // 1. Comprovar Core
    for (const prop of CORE_PROPS) {
        if (fm[prop] === undefined || fm[prop] === null) {
            errors.push(`Falta propietat obligatòria: ${prop}`);
        }
    }

    // 2. Comprovar propietat extranyes (greix)
    const allAllowed = [...CORE_PROPS, ...GOV_PROPS];
    for (const key of Object.keys(fm)) {
        if (!allAllowed.includes(key)) {
            errors.push(`Propietat prohibida detectada: ${key} (eliminar o fusionar)`);
        }
    }

    // 3. Validar valors
    if (fm.macro_regio && !ALLOWED_MACRO_REGIONS.includes(fm.macro_regio)) {
        errors.push(`macro_regio invàlida: ${fm.macro_regio}`);
    }
    if (fm.estat && !ALLOWED_ESTATS.includes(fm.estat)) {
        errors.push(`estat invàlid: ${fm.estat}`);
    }

    // 4. Validar Governança només per a tipus de govern
    if (fm.tipus && GOV_TYPES.includes(fm.tipus)) {
        if (fm.tier === undefined) errors.push(`Falta 'tier' per a un document de govern (${fm.tipus})`);
        if (fm.pes_regla === undefined) errors.push(`Falta 'pes_regla' per a un document de govern (${fm.tipus})`);
    }

    if (fm.related && Array.isArray(fm.related) && fm.related.length > 5) {
        errors.push(`Límit d'entropia excedit: un document no pot tindre més de 5 enllaços 'related'.`);
    }

    return errors;
}

function determinarCarpeta(fm) {
    if (fm.estat === 'arxivat') {
        return '05_memoria/arxiu_historic/';
    }

    let carpetaBase = ROUTING_TABLE[fm.tipus];
    
    // Fallbacks si el tipus no està a la taula
    if (!carpetaBase) {
        if (fm.macro_regio === 'Còrtex') carpetaBase = '00_protocols/filosofia/';
        else if (fm.macro_regio === 'Hipocamp') carpetaBase = '05_memoria/altres/';
        else carpetaBase = '06_maquinaria/altres/';
    }

    return carpetaBase;
}

module.exports = {
    validarFrontmatter,
    determinarCarpeta,
    CORE_PROPS,
    GOV_PROPS
};
