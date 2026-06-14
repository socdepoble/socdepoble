import { DEMO_USER_ID, IAIA_ID } from '../constants';

/**
 * identityUtils.js
 * 
 * Verificador determinista e inmutable para las tipologías de actores
 * en el ecosistema P2P de Sóc de Poble. Elimina dependencias "ad-hoc"
 * de validación por substrings a lo largo del código.
 */

const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

/**
 * Validar si un string es un UUID genérico estrictamente formateado.
 */
export const isStrictUUID = id => {
  if (!id || typeof id !== 'string') return false;
  return UUID_REGEX.test(id);
};

/**
 * ¿El ID pertenece al usuario DEMO "Sólo Lectura" sin sesión de Supabase?
 */
export const isGuestUser = id => {
  return id === DEMO_USER_ID;
};

/**
 * ¿El ID corresponde a la IAIA Central o sus agentes derivados?
 */
export const isIAIAAgent = id => {
  return id === IAIA_ID || id.startsWith('iaia-') || id.startsWith('1a1a-');
};

/**
 * Determina si la entidad fue creada offline/mockeada (Legacy Data)
 */
export const isLegacyMock = id => {
  if (!id) return false;
  return id.startsWith('mock-') || id.startsWith('sdp-core') || id === '00000000-0000-0000-0000-000000000000';
};

/**
 * Es un usuario con UUID real de persistencia en Supabase (No IA, No Mock, No Fallback)
 */
export const isRealDBUUID = id => {
  return isStrictUUID(id) && !isGuestUser(id) && !isIAIAAgent(id) && !isLegacyMock(id);
};

/**
 * Detecta si la tarjeta o post corresponde directamente a Sóc de Poble Oficial
 */
export const isSdPOficial = (id, name = '') => {
  if (!id && !name) return false;
  const rawName = String(name || '').toLowerCase();
  const rawId = String(id || '');
  return rawName.includes('sóc de poble') || rawId === 'sdp-core' || rawId.startsWith('mock-business-sdp') || rawId === 'socdepoble';
};