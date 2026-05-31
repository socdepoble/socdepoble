import { createContext, useContext, useReducer, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import { supabaseService } from '../../core/services/supabaseService';
import { identityService } from '../../core/services/identityService';
import { profileHealingService } from '../../core/services/profileHealingService';
import { terminateWorkers } from '../../core/services/iaiaService';
import { logger } from '../../utils/logger';
import i18n from '../../i18n/config';
import { IAIA_ID, AUTH_EVENTS, USER_ROLES } from '../../constants';
import { webCryptoService } from '../../core/services/webCryptoService';
import { rhizomeManager } from '../../core/services/rhizomeManager';

const AuthStateContext = window.__AuthStateContext || createContext();
window.__AuthStateContext = AuthStateContext;
const AuthActionsContext = window.__AuthActionsContext || createContext();
window.__AuthActionsContext = AuthActionsContext;

const authReducer = (state, action) => {
    switch (action.type) {
        case 'SET_USER': return { ...state, user: action.payload };
        case 'SET_PROFILE': return { ...state, profile: action.payload };
        case 'SET_REAL_USER': return { ...state, realUser: action.payload };
        case 'SET_REAL_PROFILE': return { ...state, realProfile: action.payload };
        case 'SET_LOADING': return { ...state, loading: action.payload };
        case 'SET_IS_PLAYGROUND': return { ...state, isPlayground: action.payload };
        case 'SET_IMPERSONATED_PROFILE': return { ...state, impersonatedProfile: action.payload };
        case 'SET_ACTIVE_ENTITY_ID': return { ...state, activeEntityId: action.payload };
        case 'SET_SIMULATED_ROLE': return { ...state, simulatedRole: action.payload };
        case 'SET_LANGUAGE': return { ...state, language: action.payload };
        case 'NUKE_STATE':
            return {
                ...state,
                user: null,
                profile: null,
                realUser: null,
                realProfile: null,
                isPlayground: false,
                impersonatedProfile: null,
                activeEntityId: null,
                loading: false
            };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        profile: null,
        realUser: null,
        realProfile: null,
        loading: true,
        isPlayground: localStorage.getItem('isPlaygroundMode') === 'true',
        impersonatedProfile: null,
        activeEntityId: null,
        simulatedRole: localStorage.getItem('simulatedRole') || null,
        language: localStorage.getItem('i18nextLng') || 'va'
    });

    const realUserRef = useRef(null);
    const authSeqRef = useRef(0);
    const mountedRef = useRef(true);

    const generateSovereignIdentity = useCallback(async () => {
        const keyPair = await webCryptoService.generateEd25519KeyPair();
        const deviceId = crypto.randomUUID();
        const sovereignIdentity = {
            id: deviceId,
            publicKey: keyPair.publicKey,
            createdAt: Date.now(),
            isSovereign: true,
            role: USER_ROLES.GUEST
        };
        await rhizomeManager.storeSovereignIdentity(sovereignIdentity, keyPair.privateKey);
        return sovereignIdentity;
    }, []);

    const setIsPlayground = useCallback((val) => {
        if (val && realUserRef.current) {
            logger.warn('[AuthContext] DIRECTIVA 1: Els usuaris registrats han de tancar la sessió per a jugar.');
            return;
        }
        dispatch({ type: 'SET_IS_PLAYGROUND', payload: val });
        localStorage.setItem('isPlaygroundMode', String(val));
        if (!val) {
            localStorage.removeItem('isPlaygroundMode');
            localStorage.removeItem('sb-simulation-mode');
        }
    }, []);

    const setSimulatedRole = useCallback((role) => {
        dispatch({ type: 'SET_SIMULATED_ROLE', payload: role });
        if (role) localStorage.setItem('simulatedRole', role);
        else localStorage.removeItem('simulatedRole');
    }, []);

    const setLanguage = useCallback((lang) => {
        dispatch({ type: 'SET_LANGUAGE', payload: lang });
        localStorage.setItem('i18nextLng', lang);
        i18n.changeLanguage(lang);
    }, []);

    const adoptPersona = useCallback((personaProfile) => {
        setIsPlayground(true);
        localStorage.setItem('isPlaygroundMode', 'true');
        const newUser = { id: personaProfile.id, email: `${personaProfile.username}@playground.local`, isDemo: true };
        dispatch({ type: 'SET_USER', payload: newUser });
        dispatch({ type: 'SET_PROFILE', payload: { ...personaProfile, is_playground_session: true } });
        dispatch({ type: 'SET_LOADING', payload: false });
    }, [setIsPlayground]);

    const loginAsGuest = useCallback(() => {
        adoptPersona({
            id: IAIA_ID,
            full_name: 'IAIA (Guia del Poble)',
            username: 'iaia_guide',
            role: USER_ROLES.ADMIN,
            is_demo: true,
            is_admin: true,
            avatar_url: '/uploads/avatars/iaia_comic_matriarch.png'
        });
    }, [adoptPersona]);

    const loginAsGuestAnonymous = useCallback(() => {
        logger.log('[AuthContext] Entering as Guest Anonymous (Open Community)');
        const guestUser = {
            id: 'guest_' + Math.random().toString(36).substr(2, 9),
            full_name: 'Visitant Gentil',
            username: 'guest',
            role: 'guest',
            isAnonymous: true,
            avatar_url: '/uploads/avatars/guest_avatar.png'
        };
        dispatch({ type: 'SET_USER', payload: guestUser });
        dispatch({ type: 'SET_PROFILE', payload: guestUser });
        localStorage.setItem('isGuestMode', 'true');
        dispatch({ type: 'SET_LOADING', payload: false });
    }, []);

    const forceNukeSimulation = useCallback(async () => {
        logger.log('[AuthContext] NUCLEAR RESET TRIGGERED - PURGING SIMULATION');
        try { await supabase.auth.signOut(); } catch (e) {
            logger.error('[AuthContext] Supabase signOut error during nuke:', e);
        }
        
        const deviceId = localStorage.getItem('sdp_device_id');
        localStorage.clear();
        sessionStorage.clear();
        if (deviceId) localStorage.setItem('sdp_device_id', deviceId);

        if ('serviceWorker' in navigator) {
            try {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (let registration of registrations) {
                    const scriptURL = registration.active?.scriptURL || registration.installing?.scriptURL || registration.waiting?.scriptURL || '';
                    if (!scriptURL.includes('coi-serviceworker')) {
                        await registration.unregister();
                    }
                }
            } catch (swError) {
                logger.error('[AuthContext] SW Unregister error:', swError);
            }
        }

        dispatch({ type: 'NUKE_STATE' });
        localStorage.setItem('nuke_in_progress', 'true');
        window.location.href = '/login?nuked=true&v=' + Date.now();
    }, []);

    const exitPlayground = useCallback(async () => {
        logger.log('[AuthContext] Exiting Playground mode...');
        if (state.realUser) {
            setIsPlayground(false);
            dispatch({ type: 'SET_USER', payload: state.realUser });
            dispatch({ type: 'SET_PROFILE', payload: state.realProfile });
            window.location.href = '/';
        } else {
            await forceNukeSimulation();
        }
    }, [state.realUser, state.realProfile, setIsPlayground, forceNukeSimulation]);

    const switchContext = useCallback(async (entityId = null) => {
        logger.log('[AuthContext] Switching context to:', entityId || 'Personal Profile');
        dispatch({ type: 'SET_ACTIVE_ENTITY_ID', payload: entityId });

        if (!entityId) {
            dispatch({ type: 'SET_PROFILE', payload: state.realProfile });
            dispatch({ type: 'SET_IMPERSONATED_PROFILE', payload: null });
            return;
        }

        try {
            const entityData = await supabaseService.getPublicEntity(entityId);
            if (entityData) {
                const impersonated = {
                    ...entityData,
                    full_name: entityData.name,
                    id: entityData.id,
                    role: entityData.type === 'oficial' ? 'official' : (entityData.type === 'negoci' ? 'business' : 'group'),
                    is_impersonated: true
                };
                dispatch({ type: 'SET_IMPERSONATED_PROFILE', payload: impersonated });
                dispatch({ type: 'SET_PROFILE', payload: impersonated });
            }
        } catch (err) {
            logger.error('[AuthContext] Error switching context:', err);
        }
    }, [state.realProfile]);

    const logout = useCallback(async () => {
        logger.log('[AuthContext] !!! COMENÇANT SEQÜÈNCIA DE SORTIDA RESILIENT !!!');

        const clearLocalState = () => {
            localStorage.removeItem('isPlaygroundMode');
            localStorage.removeItem('sb-simulation-mode');
            localStorage.removeItem('nuke_in_progress');
            localStorage.removeItem('sp_sovereign_identity');
            localStorage.removeItem('isGuestMode');
            localStorage.removeItem('sp_user_cache');

            terminateWorkers();
            dispatch({ type: 'NUKE_STATE' });
        };

        if (state.isPlayground) {
            await forceNukeSimulation();
            return;
        }

        try {
            const ac = new AbortController();
            const logoutPromise = supabase.auth.signOut();
            let timerId;
            const timeoutPromise = new Promise((_, reject) => {
                timerId = setTimeout(() => {
                    ac.abort();
                    reject(new Error('Logout Timeout'));
                }, 3000);
            });
            await Promise.race([logoutPromise, timeoutPromise]).catch(err => {
                logger.warn('[AuthContext] Supabase signOut failed or timed out, but proceeding with local logout:', err);
            });
            clearTimeout(timerId);
        } catch (err) {
            logger.error('[AuthContext] Error during Supabase signOut:', err);
        } finally {
            clearLocalState();
            logger.log('[AuthContext] Local state cleared. User is now out of the network.');
        }
    }, [state.isPlayground, forceNukeSimulation]);

    const handleAuth = useCallback(async (event, session) => {
        const currentSeq = ++authSeqRef.current;
        logger.log(`[AuthContext] Auth Event: ${event} [SeqID: ${currentSeq}]`, session?.user?.id);

        if (!mountedRef.current) return;

        try {
            const isSimulation = state.isPlayground ||
                localStorage.getItem('sb-simulation-mode') === 'true' ||
                (session?.user?.id === IAIA_ID);

            if (session?.user) {
                if (isSimulation) {
                    dispatch({ type: 'SET_IS_PLAYGROUND', payload: false });
                    localStorage.removeItem('isPlaygroundMode');
                    localStorage.removeItem('sb-simulation-mode');
                }

                dispatch({ type: 'SET_REAL_USER', payload: session.user });
                dispatch({ type: 'SET_USER', payload: session.user });
                dispatch({ type: 'SET_IMPERSONATED_PROFILE', payload: null });
                dispatch({ type: 'SET_ACTIVE_ENTITY_ID', payload: null });

                try {
                    let profileData = await supabaseService.getProfile(session.user.id);
                    if (currentSeq !== authSeqRef.current || !mountedRef.current) return;

                    profileData = await profileHealingService.healGhostProfile(session, profileData, isSimulation);
                    if (currentSeq !== authSeqRef.current || !mountedRef.current) return;

                    const { effectiveProfile, isOfficialCreator } = profileHealingService.protectMasterIdentity(session, profileData);

                    dispatch({ type: 'SET_REAL_PROFILE', payload: effectiveProfile });
                    dispatch({ type: 'SET_PROFILE', payload: effectiveProfile });
                    logger.log(`[AuthContext] 🏺 IDENTITY CONSOLIDATED [SeqID: ${currentSeq}]:`, isOfficialCreator ? 'MESTRE JAVI' : effectiveProfile.full_name);
                } catch (error) {
                    logger.error('[AuthContext] Error loading profile:', error);
                    const fallback = {
                        id: session.user.id,
                        full_name: session.user.email?.split('@')[0] || 'Sóc de Poble',
                        role: USER_ROLES.NEIGHBOR
                    };
                    dispatch({ type: 'SET_REAL_PROFILE', payload: fallback });
                    dispatch({ type: 'SET_PROFILE', payload: fallback });
                }
            } else if (isSimulation) {
                loginAsGuest();
                dispatch({ type: 'SET_REAL_USER', payload: null });
                dispatch({ type: 'SET_REAL_PROFILE', payload: null });
            } else if (localStorage.getItem('isGuestMode') === 'true') {
                const guestUser = { id: 'guest_restored', full_name: 'Visitant Gentil', role: 'guest', isAnonymous: true };
                dispatch({ type: 'SET_USER', payload: guestUser });
                dispatch({ type: 'SET_PROFILE', payload: guestUser });
            } else {
                let genesis = await identityService.getStoredIdentity();
                if (currentSeq !== authSeqRef.current || !mountedRef.current) return;

                if (!genesis) {
                    genesis = await generateSovereignIdentity();
                    if (currentSeq !== authSeqRef.current || !mountedRef.current) return;
                }
                
                if (genesis.full_name === 'Foraster de Poble' || genesis.full_name === 'Sóc de Poble' || genesis.full_name === 'Sóc de Poble!') {
                    genesis.full_name = 'Foraster';
                }
                
                const sovereignUser = { ...genesis, is_sovereign: true, isAnonymous: true, role: USER_ROLES.GUEST };
                dispatch({ type: 'SET_USER', payload: sovereignUser });
                dispatch({ type: 'SET_PROFILE', payload: genesis });
            }

            if (currentSeq === authSeqRef.current) {
                realUserRef.current = session?.user || null;
            }
        } catch (error) {
            logger.error('[AuthContext] Auth handle failed:', error);
        } finally {
            if (currentSeq === authSeqRef.current && mountedRef.current) {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        }
    }, [state.isPlayground, loginAsGuest, generateSovereignIdentity]);

    useEffect(() => {
        mountedRef.current = true;
        let authSubscription = null;
        
        const initSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;
                if (!mountedRef.current) return;

                const isNuked = localStorage.getItem('nuke_in_progress') === 'true';
                if (isNuked) {
                    localStorage.removeItem('nuke_in_progress');
                    await handleAuth(AUTH_EVENTS.INITIAL_SESSION, null);
                } else {
                    await handleAuth(AUTH_EVENTS.INITIAL_SESSION, session);
                }
            } catch (err) {
                if (mountedRef.current) {
                    console.error('[AuthContext] Error on getSession:', err);
                    dispatch({ type: 'SET_USER', payload: null });
                    dispatch({ type: 'SET_LOADING', payload: false });
                }
            }
        };

        const setupSubscription = () => {
             const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
                if (!mountedRef.current) return;
                if (_event === 'SIGNED_OUT') {
                    console.log('[AuthContext] Signed out detected. Removing cache.');
                    localStorage.removeItem('sp_user_cache');
                }
                await handleAuth(_event, session);
            });
            authSubscription = subscription;
        };

        initSession();
        setupSubscription();

        return () => {
            mountedRef.current = false;
            if (authSubscription && typeof authSubscription.unsubscribe === 'function') {
                authSubscription.unsubscribe();
            }
        };
    }, [handleAuth]);

    const stateValue = useMemo(() => ({
        ...state,
        currentRole: state.simulatedRole || state.profile?.role || USER_ROLES.GUEST,
        isSuperAdmin: (state.simulatedRole ? state.simulatedRole === USER_ROLES.SUPER_ADMIN : state.profile?.role === USER_ROLES.SUPER_ADMIN),
        isAdmin: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN].includes(state.simulatedRole || state.profile?.role),
        isEditor: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.REGION_COORDINATOR, USER_ROLES.TOWN_COORDINATOR, USER_ROLES.GROUP_COORDINATOR].includes(state.simulatedRole || state.profile?.role),
        isAuthenticated: !!state.realUser && !state.isPlayground,
        isGuest: !!state.user && !!state.user.isAnonymous
    }), [state]);

    const actionsValue = useMemo(() => ({
        setProfile: (p) => dispatch({ type: 'SET_PROFILE', payload: p }),
        adoptPersona,
        loginAsGuest,
        exitPlayground,
        logout,
        forceNukeSimulation,
        setIsPlayground,
        setImpersonatedProfile: (p) => dispatch({ type: 'SET_IMPERSONATED_PROFILE', payload: p }),
        setActiveEntityId: (id) => dispatch({ type: 'SET_ACTIVE_ENTITY_ID', payload: id }),
        switchContext,
        setSimulatedRole,
        setLanguage,
        loginAsGuestAnonymous,
        generateSovereignIdentity
    }), [adoptPersona, loginAsGuest, exitPlayground, logout, forceNukeSimulation, setIsPlayground, switchContext, setSimulatedRole, setLanguage, loginAsGuestAnonymous, generateSovereignIdentity]);

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
    return { ...state, ...actions };
};


/* eslint-enable react-refresh/only-export-components */

