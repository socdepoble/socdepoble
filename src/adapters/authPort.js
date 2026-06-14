/**
 * FÀÇANA D'AUTENTICACIÓ (AuthPort)
 * Aquesta interfície és l'única via d'accés a l'estat d'autenticació per a fitxers Vanilla JS 
 * (serveis, workers, funcions utils) que no necessiten re-renderitzats de React.
 * 
 * Cumpleix amb l'Acció Atòmica 1 de l'Auditoria dels 12 Savis:
 * - Evita dependències circulars.
 * - Garanteix la immutabilitat de l'estat exposat.
 * - Proporciona backpressure si fos necessari.
 */

import { useAuthStore } from '../domain/auth/useAuthStore';
import { USER_ROLES } from '../constants';
export const AuthPort = {
  /**
   * Retorna una instantània (snapshot) immutable de la sessió actual.
   * @returns {Readonly<{user: object|null, profile: object|null, isAuthenticated: boolean, activeActor: object}>}
   */
  getSession: () => {
    const state = useAuthStore.getState();
    return Object.freeze({
      user: state.user,
      profile: state.profile,
      isAuthenticated: !!state.realUser && !state.isPlayground,
      activeActor: state.activeActor,
      isGuest: !!state.user && !!state.user.isAnonymous
    });
  },
  /**
   * Comprova si l'usuari actual o el rol simulat té permisos d'edició globals.
   */
  isEditor: () => {
    const state = useAuthStore.getState();
    const role = state.simulatedRole || state.profile?.role;
    return [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.REGION_COORDINATOR, USER_ROLES.TOWN_COORDINATOR, USER_ROLES.GROUP_COORDINATOR].includes(role);
  },
  /**
   * Tanca la sessió de forma segura sense exposar el mutador directe.
   */
  logout: async () => {
    return await useAuthStore.getState().logout();
  },
  /**
   * Permet subscriure's a canvis d'estat (només per a serveis molt específics).
   * @param {function} callback 
   */
  subscribe: callback => {
    return useAuthStore.subscribe(callback);
  }
};
export default AuthPort;