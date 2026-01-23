/**
 * Constants globals per a l'aplicació Sóc de Poble
 */

export const DEMO_USER_ID = '11111111-0000-0000-0000-000000000001';

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
export const ENTITY_TYPES = {
    OFFICIAL: 'oficial',
    BUSINESS: 'empresa',
    GROUP: 'grup',
    PRIVATE: 'personal' // Per a perfils de veïns
};

export const USER_ROLES = {
    NEIGHBOR: 'vei',
    GROUP: 'grup',
    BUSINESS: 'empresa',
    OFFICIAL: 'oficial'
};

export const ROLE_LABELS = {
    [USER_ROLES.NEIGHBOR]: { va: 'Veí', es: 'Vecino' },
    [USER_ROLES.GROUP]: { va: 'Grup', es: 'Grupo' },
    [USER_ROLES.BUSINESS]: { va: 'Empresa', es: 'Empresa' },
    [USER_ROLES.OFFICIAL]: { va: 'Oficial', es: 'Oficial' }
};

export const AUTH_EVENTS = {
    SIGNED_IN: 'SIGNED_IN',
    SIGNED_OUT: 'SIGNED_OUT',
    USER_UPDATED: 'USER_UPDATED',
    INITIAL_SESSION: 'INITIAL_SESSION'
};

export const ENABLE_MOCKS = true;
