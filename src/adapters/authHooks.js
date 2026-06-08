/**
 * ESCUT DE SELECTORS (AuthHooks)
 * Cumpleix amb l'Acció Atòmica 1 de l'Auditoria dels 12 Savis (Gemini).
 * 
 * En comptes d'importar el `useAuthStore` sencer o l'antic `useAuth()`,
 * els components de React han d'utilitzar aquests hooks específics.
 * Aquests hooks usen `useShallow` internament per a assegurar que només
 * es re-renderitza el component quan canvia l'estat que realment utilitzen.
 */

import { useAuthStore } from '../domain/auth/useAuthStore';
import { useShallow } from 'zustand/react/shallow';
import { USER_ROLES } from '../constants';

/**
 * Retorna l'estat base de la sessió de l'usuari humà.
 * Només re-renderitza si canvia el perfil o l'usuari.
 */
export const useSession = () => {
    return useAuthStore(useShallow(state => ({
        user: state.user,
        profile: state.profile,
        isAuthenticated: !!state.realUser && !state.isPlayground,
        isGuest: !!state.user && !!state.user.isAnonymous,
        loading: state.loading
    })));
};

/**
 * Retorna els permisos i rols de l'usuari.
 * Aïllat de l'estat de sessió general.
 */
export const usePermissions = () => {
    return useAuthStore(useShallow(state => {
        const role = state.simulatedRole || state.profile?.role;
        return {
            currentRole: role || USER_ROLES.GUEST,
            isSuperAdmin: role === USER_ROLES.SUPER_ADMIN,
            isAdmin: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN].includes(role),
            isEditor: [
                USER_ROLES.SUPER_ADMIN, 
                USER_ROLES.ADMIN, 
                USER_ROLES.REGION_COORDINATOR, 
                USER_ROLES.TOWN_COORDINATOR, 
                USER_ROLES.GROUP_COORDINATOR
            ].includes(role)
        };
    }));
};

/**
 * Retorna exclusivament l'estat del Protocol J.A.R.V.I.S (Agents IA)
 * Útil només per al Xat o panells de control de la IA.
 */
export const useJarvisState = () => {
    return useAuthStore(useShallow(state => ({
        activeActor: state.activeActor,
        isPlayground: state.isPlayground,
        simulatedRole: state.simulatedRole
    })));
};

/**
 * Retorna les accions i mètodes.
 * Com que les funcions en Zustand no canvien de referència (són estables),
 * això mai provocarà un re-render addicional.
 */
export const useAuthActions = () => {
    return useAuthStore(useShallow(state => ({
        logout: state.logout,
        loginAsGuest: state.loginAsGuest,
        generateSovereignIdentity: state.generateSovereignIdentity,
        setLanguage: state.setLanguage,
        switchContext: state.switchContext
    })));
};
