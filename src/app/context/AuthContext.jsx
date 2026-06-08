import { createContext, useContext, useEffect, useMemo } from 'react';
import { supabase } from '../../supabaseClient';
import { useAuthStore } from '../../domain/auth/useAuthStore';
import { USER_ROLES } from '../../constants';

const AuthStateContext = window.__AuthStateContext || createContext();
window.__AuthStateContext = AuthStateContext;
const AuthActionsContext = window.__AuthActionsContext || createContext();
window.__AuthActionsContext = AuthActionsContext;

/**
 * FÀÇANA DE TRANSICIÓ (Fase 6)
 * Aquest Context actua com a adaptador per no trencar els 80 nodes antics.
 * Tota la lògica pesada i l'estat viu a useAuthStore (Zustand).
 * A mesura que refactoritzem els components, deixaran d'usar aquesta fàçana.
 */
export const AuthProvider = ({ children }) => {
    const store = useAuthStore(); // Ens subscrivim a tot el store per retrocompatibilitat

    useEffect(() => {
        let authSubscription = null;

        const initSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;

                const isNuked = localStorage.getItem('nuke_in_progress') === 'true';
                if (isNuked) {
                    localStorage.removeItem('nuke_in_progress');
                    await useAuthStore.getState().handleAuthEvent('INITIAL_SESSION', null);
                } else {
                    await useAuthStore.getState().handleAuthEvent('INITIAL_SESSION', session);
                }
            } catch (err) {
                console.error('[AuthContext Facade] Error on getSession:', err);
                useAuthStore.setState({ user: null, loading: false });
            }
        };

        const setupSubscription = () => {
             const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
                if (_event === 'SIGNED_OUT') {
                    if (!navigator.onLine) {
                        console.warn('[AuthContext] SUPABASE SIGNED_OUT INTERCEPTAT! Estem offline. Posant en Quarantena...');
                        window.dispatchEvent(new CustomEvent('sdp:offline-quarantine'));
                        return; 
                    }
                    localStorage.removeItem('sp_user_cache');
                }
                await useAuthStore.getState().handleAuthEvent(_event, session);
            });
            authSubscription = subscription;
        };

        initSession();
        setupSubscription();

        return () => {
            if (authSubscription && typeof authSubscription.unsubscribe === 'function') {
                authSubscription.unsubscribe();
            }
        };
    }, []);

    const stateValue = useMemo(() => ({
        user: store.user,
        profile: store.profile,
        realUser: store.realUser,
        realProfile: store.realProfile,
        loading: store.loading,
        isPlayground: store.isPlayground,
        impersonatedProfile: store.impersonatedProfile,
        activeEntityId: store.activeEntityId,
        simulatedRole: store.simulatedRole,
        language: store.language,
        currentRole: store.simulatedRole || store.profile?.role || USER_ROLES.GUEST,
        isSuperAdmin: (store.simulatedRole ? store.simulatedRole === USER_ROLES.SUPER_ADMIN : store.profile?.role === USER_ROLES.SUPER_ADMIN),
        isAdmin: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN].includes(store.simulatedRole || store.profile?.role),
        isEditor: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.REGION_COORDINATOR, USER_ROLES.TOWN_COORDINATOR, USER_ROLES.GROUP_COORDINATOR].includes(store.simulatedRole || store.profile?.role),
        isAuthenticated: !!store.realUser && !store.isPlayground,
        isGuest: !!store.user && !!store.user.isAnonymous
    }), [store]);

    const actionsValue = useMemo(() => ({
        setProfile: store.setProfile,
        adoptPersona: store.adoptPersona,
        loginAsGuest: store.loginAsGuest,
        exitPlayground: store.exitPlayground,
        logout: store.logout,
        forceNukeSimulation: store.forceNukeSimulation,
        setIsPlayground: store.setIsPlayground,
        setImpersonatedProfile: store.setImpersonatedProfile,
        setActiveEntityId: store.setActiveEntityId,
        switchContext: store.switchContext,
        setSimulatedRole: store.setSimulatedRole,
        setLanguage: store.setLanguage,
        loginAsGuestAnonymous: store.loginAsGuestAnonymous,
        generateSovereignIdentity: store.generateSovereignIdentity
    }), [store]);

    return (
        <AuthStateContext.Provider value={stateValue}>
            <AuthActionsContext.Provider value={actionsValue}>
                {children}
            </AuthActionsContext.Provider>
        </AuthStateContext.Provider>
    );
};

/* eslint-disable react-refresh/only-export-components */
export const useAuth = () => {
    const state = useContext(AuthStateContext);
    const actions = useContext(AuthActionsContext);
    if (!state || !actions) throw new Error('useAuth must be used within an AuthProvider');
    
    // Alerta de depreciació per l'Acció Atòmica 1 de l'Auditoria
    if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ [DEPRECATION] useAuth() està sent deprecat per evitar "God Nodes" i re-renders massius a l\'A10. Si us plau, migra a useSession(), usePermissions() o useAuthActions() de src/adapters/authHooks.js');
    }

    return { ...state, ...actions };
};
/* eslint-enable react-refresh/only-export-components */
