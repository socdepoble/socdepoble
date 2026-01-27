/**
 * Constants globals per a l'aplicació Sóc de Poble
 */

export const DEMO_USER_ID = '11111111-0000-0000-0000-000000000001';
export const IAIA_ID = '11111111-1a1a-0000-0000-000000000000';

export const ROLES = {
    ALL: 'tot',
    PEOPLE: 'gent',
    GROUPS: 'grups',
    BUSINESS: 'empreses',
    OFFICIAL: 'oficial'
};

/**
 * Rols d'entitat i usuari per a la lògica de negoci i base de dades
 */
export const USER_ROLES = {
    SUPER_ADMIN: 'super_admin', // Javi & Damià (Poders Totals)
    ADMIN: 'admin',             // Gestors de Poble
    EDITOR: 'editor',           // Gestors de Contingut (Verificadors)
    AUTHOR: 'autor',            // Col·laboradors Verificats
    NEIGHBOR: 'vei',            // Usuari Estàndard
    OFFICIAL: 'oficial',        // Entitats oficials (IAIA, Ajuntament)
    GUEST: 'convidat'           // Sense registre
};

/**
 * Emails dels creadors amb poders de Super Padrino (Hardcoded Safety)
 */
export const CREATOR_EMAILS = [
    'socdepoblecom@gmail.com',
    'damimus@gmail.com'
];

export const ENTITY_TYPES = {
    OFFICIAL: 'oficial',
    BUSINESS: 'empresa',
    GROUP: 'grup',
    PRIVATE: 'personal' // Per a perfils de veïns
};

export const ROLE_LABELS = {
    [USER_ROLES.SUPER_ADMIN]: { va: 'Super Padrino', es: 'Super Padrino' },
    [USER_ROLES.ADMIN]: { va: 'Administrador', es: 'Administrador' },
    [USER_ROLES.EDITOR]: { va: 'Editor', es: 'Editor' },
    [USER_ROLES.AUTHOR]: { va: 'Autor', es: 'Autor' },
    [USER_ROLES.NEIGHBOR]: { va: 'Veí', es: 'Vecino' }
};

export const AUTH_EVENTS = {
    SIGNED_IN: 'SIGNED_IN',
    SIGNED_OUT: 'SIGNED_OUT',
    USER_UPDATED: 'USER_UPDATED',
    INITIAL_SESSION: 'INITIAL_SESSION'
};

export const ENABLE_MOCKS = import.meta.env.VITE_ENABLE_MOCKS === 'true' || import.meta.env.MODE === 'development';
