/**
 * Registre de Pàgines Hardcoded — Patró Definitiu Anti-If
 */

export const HARDCODED_PAGES = {
    skills: {
        title: 'Skills',
        subtitle: 'Com pensem? Tot el que em fa ser qui sóc',
        htmlContent: () => import('./SkillsContent').then(m => m.SKILLS_HTML),
        defaults: {
            heroFormat: 'horizontal',
            heroPosition: 'center',
            logoLight: '/assets/system/ui/logo-socdepoble-rect-negre.svg',
            logoDark: '/assets/system/ui/logo-socdepoble-rect-blanc.svg',
        }
    },
    versions: {
        title: 'Versions del Sistema',
        subtitle: "Historial d'actualitzacions i memòria tècnica",
        htmlContent: () => import('./VersionsContent').then(m => m.VERSIONS_HTML),
        defaults: { heroFormat: 'horizontal', heroPosition: 'center' }
    },
    'iaies-mundials': {
        title: 'Iaies Mundials',
        subtitle: 'Conexions globals',
        htmlContent: () => import('./IaiesMundialsContent').then(m => m.IAIES_MUNDIALS_HTML),
        defaults: { heroFormat: 'horizontal', heroPosition: 'center' }
    },
    disseny: {
        title: 'Disseny',
        subtitle: 'Com construïm la Masia?',
        htmlContent: () => import('./SkillsContent').then(m => m.DESIGN_HTML),
        defaults: { heroFormat: 'horizontal', heroPosition: 'center' }
    },
    projecte: {
        title: 'El Projecte',
        subtitle: 'Per què existim? (Projecte Documental Transmèdia)',
        htmlContent: () => import('./HumanProjectContent').then(m => m.HUMAN_PROJECT_HTML),
        defaults: {
            heroFormat: 'square',
            heroPosition: 'center',
            logoLight: '/assets/system/ui/logo-socdepoble-rect-negre.svg',
            logoDark: '/assets/system/ui/logo-socdepoble-rect-blanc.svg',
        }
    },
    'el-projecte': {
        // Alias de 'projecte'
        redirectTo: 'projecte'
    },
    constitucio: {
        title: 'Constitució',
        subtitle: 'Quines lleis no podem trencar?',
        htmlContent: () => import('./ConstitucioContent').then(m => m.CONSTITUCIO_HTML),
        defaults: { heroFormat: 'horizontal', heroPosition: 'center' }
    },
    ruta: {
        title: 'Ruta',
        subtitle: '',
        htmlContent: null,
        defaults: { heroFormat: 'horizontal', heroPosition: 'center' }
    }
};

/**
 * Resol una entrada del registre (gestiona aliases)
 */
export function resolvePageEntry(slug) {
    const entry = HARDCODED_PAGES[slug];
    if (!entry) return null;
    if (entry.redirectTo) {
        return resolvePageEntry(entry.redirectTo);
    }
    return entry;
}

/**
 * Comprova si un slug és hardcoded
 */
export function isHardcodedPage(slug) {
    return !!resolvePageEntry(slug);
}
