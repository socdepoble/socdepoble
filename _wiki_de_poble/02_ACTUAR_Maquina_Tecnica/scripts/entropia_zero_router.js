/**
 * ENTROPIA ZERO ROUTER (V5.0.3)
 * Arquitectura de Macro-Regions de DeepSeek
 */
const path = require('path');

// Les propietats del Nucli Universal (Qwen + Aliases)
const CORE_PROPS = [
    'id', 'name', 'version', 'created_at', 'updated_at',
    'autor', 'categoria', 'macro_regio', 'tags', 'estat', 'related',
    'aliases' // Restaurem aliases a petició del Mestre
];

// Les propietats de governança (opcionals)
const GOV_PROPS = ['tier', 'pes_regla'];

const ALLOWED_MACRO_REGIONS = ['Còrtex', 'Hipocamp', 'Motor', ''];
const ALLOWED_ESTATS = ['actiu', 'arxivat', 'deprecated'];
const GOV_TYPES = ['directriu', 'norma', 'protocol'];

// Taula d'Enrutament basada en DeepSeek
const ROUTING_TABLE = {
    // 🏛️ Còrtex (Govern i Identitat)
    'identitat': '01_identitat_iaia/', 
    'filosofia': '02_filosofia/',
    'directriu': '03_govern/',
    'norma': '03_govern/',
    'protocol': '03_govern/',
    'capacitat': '08_capacitats/',
    'acte': '10_actes/',
    'memoria': '10_actes/',

    // 🧠 Hipocamp (Coneixement i Cultura)
    'cultura': '06_cultura/',
    'plantilla': '07_plantilles/',
    'arxiu': '90_arxiu_historic/',

    // ⚙️ Motor (Arquitectura i Execució)
    'arquitectura': '04_arquitectura_disseny/',
    'disseny': '04_arquitectura_disseny/',
    'skill': '05_skills_ia/',
    'script': '99_maquinaria/',
    'eina': '99_maquinaria/',
    'schema': '99_maquinaria/'
};

function validarFrontmatter(fm) {
    const errors = [];
    
    // Core
    for (const prop of CORE_PROPS) {
        if (prop !== 'aliases' && prop !== 'version' && prop !== 'tags' && prop !== 'related' && (fm[prop] === undefined || fm[prop] === null)) {
            errors.push(`Falta propietat obligatòria: ${prop}`);
        }
    }

    // Propietats prohibides
    const allAllowed = [...CORE_PROPS, ...GOV_PROPS];
    for (const key of Object.keys(fm)) {
        if (!allAllowed.includes(key)) {
            errors.push(`Propietat prohibida detectada: ${key}`);
        }
    }

    if (fm.macro_regio && !ALLOWED_MACRO_REGIONS.includes(fm.macro_regio)) {
        errors.push(`macro_regio invàlida: ${fm.macro_regio}`);
    }
    if (fm.estat && !ALLOWED_ESTATS.includes(fm.estat)) {
        errors.push(`estat invàlid: ${fm.estat}`);
    }

    if (fm.tipus && GOV_TYPES.includes(fm.tipus)) {
        if (fm.tier === undefined) errors.push(`Falta 'tier' per a govern (${fm.tipus})`);
        if (fm.pes_regla === undefined) errors.push(`Falta 'pes_regla' per a govern (${fm.tipus})`);
    }

    if (fm.related && Array.isArray(fm.related) && fm.related.length > 5) {
        errors.push(`Límit d'entropia excedit: màxim 5 enllaços 'related'.`);
    }

    return errors;
}

function determinarCarpeta(fm) {
    if (fm.estat === 'arxivat') {
        return '90_arxiu_historic/';
    }

    let carpetaBase = ROUTING_TABLE[fm.tipus];
    
    // Fallbacks
    if (!carpetaBase) {
        if (fm.macro_regio === 'Còrtex') carpetaBase = '03_govern/';
        else if (fm.macro_regio === 'Hipocamp') carpetaBase = '06_cultura/';
        else carpetaBase = '99_maquinaria/';
    }

    return carpetaBase;
}

module.exports = {
    validarFrontmatter,
    determinarCarpeta,
    CORE_PROPS,
    GOV_PROPS
};
