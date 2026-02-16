import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { supabaseService } from '../services/supabaseService';
import { identityService } from '../services/identityService';
import { logger } from '../utils/logger';
import i18n from '../i18n/config';
import { IAIA_ID, AUTH_EVENTS, USER_ROLES, CREATOR_EMAILS } from '../constants';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [realUser, setRealUser] = useState(null);
    const [realProfile, setRealProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPlayground, setIsPlaygroundState] = useState(localStorage.getItem('isPlaygroundMode') === 'true');
    const [impersonatedProfile, setImpersonatedProfile] = useState(null);
    const [activeEntityId, setActiveEntityId] = useState(null);
    const [simulatedRole, setSimulatedRoleState] = useState(localStorage.getItem('simulatedRole') || null);
    const [language, setLanguageState] = useState(localStorage.getItem('i18nextLng') || 'va');

    const setIsPlayground = useCallback((val) => {
        if (val && realUser) {
            logger.warn('[AuthContext] DIRECTIVA 1: Els usuaris registrats han de tancar la sessió per a jugar.');
            return;
        }
        setIsPlaygroundState(val);
        localStorage.setItem('isPlaygroundMode', String(val));
        if (!val) {
            localStorage.removeItem('isPlaygroundMode');
            localStorage.removeItem('sb-simulation-mode');
        }
    }, [realUser]);

    const setSimulatedRole = useCallback((role) => {
        setSimulatedRoleState(role);
        if (role) {
            localStorage.setItem('simulatedRole', role);
        } else {
            localStorage.removeItem('simulatedRole');
        }
    }, []);

    const setLanguage = useCallback((lang) => {
        setLanguageState(lang);
        localStorage.setItem('i18nextLng', lang);
        i18n.changeLanguage(lang);
    }, []);

    const adoptPersona = useCallback((personaProfile) => {
        setIsPlayground(true);
        localStorage.setItem('isPlaygroundMode', 'true');

        if (realUser) {
            setUser(realUser);
        } else {
            setUser({ id: personaProfile.id, email: `${personaProfile.username}@playground.local`, isDemo: true });
        }

        setProfile({ ...personaProfile, is_playground_session: true });
        setLoading(false);
    }, [realUser, setIsPlayground]);

    const loginAsGuest = useCallback(() => {
        adoptPersona({
            id: IAIA_ID,
            full_name: 'IAIA (Guia del Poble)',
            username: 'iaia_guide',
            role: USER_ROLES.ADMIN,
            is_demo: true,
            is_admin: true,
            avatar_url: '/assets/avatars/iaia_official.png'
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
            avatar_url: '/assets/avatars/guest_avatar.png'
        };
        setUser(guestUser);
        setProfile(guestUser);
        localStorage.setItem('isGuestMode', 'true');
        setLoading(false);
    }, []);

    const forceNukeSimulation = useCallback(async () => {
        logger.log('[AuthContext] NUCLEAR RESET TRIGGERED - PURGING SIMULATION');
        localStorage.clear();
        sessionStorage.clear();

        if ('serviceWorker' in navigator) {
            try {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (let registration of registrations) {
                    await registration.unregister();
                }
            } catch (swError) {
                logger.error('[AuthContext] SW Unregister error:', swError);
            }
        }

        setIsPlayground(false);
        setUser(null);
        setProfile(null);
        setRealUser(null);
        setRealProfile(null);

        try {
            await supabase.auth.signOut();
        } catch (e) {
            logger.error('[AuthContext] Supabase signOut error during nuke:', e);
        }

        localStorage.setItem('nuke_in_progress', 'true');
        window.location.href = '/login?nuked=true&v=' + Date.now();
    }, [setIsPlayground]);

    const exitPlayground = useCallback(async () => {
        logger.log('[AuthContext] Exiting Playground mode...');
        if (realUser) {
            setIsPlayground(false);
            setUser(realUser);
            setProfile(realProfile);
            window.location.href = '/';
        } else {
            await forceNukeSimulation();
        }
    }, [realUser, realProfile, setIsPlayground, forceNukeSimulation]);

    const switchContext = useCallback(async (entityId = null) => {
        logger.log('[AuthContext] Switching context to:', entityId || 'Personal Profile');
        setActiveEntityId(entityId);

        if (!entityId) {
            setProfile(realProfile);
            setImpersonatedProfile(null);
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
                setImpersonatedProfile(impersonated);
                setProfile(impersonated);
            }
        } catch (err) {
            logger.error('[AuthContext] Error switching context:', err);
        }
    }, [realProfile]);

    const logout = useCallback(async () => {
        logger.log('[AuthContext] !!! COMENÇANT SEQÜÈNCIA DE SORTIDA RESILIENT !!!');
        logger.log('[AuthContext] Executing resilient logout sequence...');

        const clearLocalState = () => {
            localStorage.removeItem('isPlaygroundMode');
            localStorage.removeItem('sb-simulation-mode');
            localStorage.removeItem('nuke_in_progress');
            localStorage.removeItem('sp_sovereign_identity');

            setIsPlaygroundState(false);
            setUser(null);
            setProfile(null);
            setRealUser(null);
            setRealProfile(null);
            setImpersonatedProfile(null);
            setActiveEntityId(null);
            setLoading(false);
        };

        if (isPlayground) {
            await forceNukeSimulation();
            return;
        }

        try {
            const logoutPromise = supabase.auth.signOut();
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Logout Timeout')), 3000));
            await Promise.race([logoutPromise, timeoutPromise]).catch(err => {
                logger.warn('[AuthContext] Supabase signOut failed or timed out, but proceeding with local logout:', err);
            });
        } catch (err) {
            logger.error('[AuthContext] Error during Supabase signOut:', err);
        } finally {
            clearLocalState();
            logger.log('[AuthContext] Local state cleared. User is now out of the network.');
        }
    }, [isPlayground, forceNukeSimulation]);

    const handleAuth = useCallback(async (event, session) => {
        logger.log('[AuthContext] Auth Event:', event, session?.user?.id);

        const isSimulation = localStorage.getItem('isPlaygroundMode') === 'true' ||
            localStorage.getItem('sb-simulation-mode') === 'true' ||
            (session?.user?.id === IAIA_ID);

        if (session?.user) {
            if (isSimulation) {
                setIsPlaygroundState(false);
                localStorage.removeItem('isPlaygroundMode');
                localStorage.removeItem('sb-simulation-mode');
            }

            setRealUser(session.user);
            setUser(session.user);
            setImpersonatedProfile(null);
            setActiveEntityId(null);

            const masters = (typeof CREATOR_EMAILS !== 'undefined') ? CREATOR_EMAILS : [];
            const isCreator = masters.includes(session.user.email);

            try {
                let profileData = await supabaseService.getProfile(session.user.id);
                // [MASTER IDENTITY PROTECTION]
                const isOfficialCreator = isCreator ||
                    session.user.id === 'd6325f44-7277-4d20-b020-166c010995ab' ||
                    session.user.email?.includes('javillinares');

                const effectiveProfile = {
                    ...(profileData || {}),
                    id: profileData?.id || session.user.id,
                    full_name: isOfficialCreator ? 'Master Arquitecte' : (profileData?.full_name || session.user.email?.split('@')[0] || 'Veí de la Torre'),
                    role: isOfficialCreator ? USER_ROLES.SUPER_ADMIN : (profileData?.role || USER_ROLES.NEIGHBOR),
                    avatar_url: isOfficialCreator ? '/Javi_Llinares-Foto_perfil-1.jpg' : (supabaseService.normalizeStorageUrl(profileData?.avatar_url) || null),
                    is_master: isOfficialCreator
                };

                setRealProfile(effectiveProfile);
                setProfile(effectiveProfile);
                logger.log('[AuthContext] Identity established for production:', effectiveProfile.full_name);
            } catch (error) {
                logger.error('[AuthContext] Error loading profile:', error);
                const fallback = {
                    id: session.user.id,
                    full_name: session.user.email?.split('@')[0] || 'Veí',
                    role: isCreator ? USER_ROLES.SUPER_ADMIN : USER_ROLES.NEIGHBOR
                };
                setRealProfile(fallback);
                setProfile(fallback);
            }
        } else if (isSimulation) {
            loginAsGuest();
            setRealUser(null);
            setRealProfile(null);
        } else if (localStorage.getItem('isGuestMode') === 'true') {
            const guestUser = { id: 'guest_restored', full_name: 'Visitant Gentil', role: 'guest', isAnonymous: true };
            setUser(guestUser);
            setProfile(guestUser);
        } else {
            const genesis = identityService.getStoredIdentity() || identityService.generateSovereignIdentity();
            setUser({ ...genesis, is_sovereign: true });
            setProfile(genesis);
        }

        setLoading(false);
    }, [loginAsGuest]);

    useEffect(() => {
        let isMounted = true;
        
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!isMounted) return;
            const isNuked = localStorage.getItem('nuke_in_progress') === 'true';
            if (isNuked) {
                localStorage.removeItem('nuke_in_progress');
                handleAuth(AUTH_EVENTS.INITIAL_SESSION, null);
            } else {
                handleAuth(AUTH_EVENTS.INITIAL_SESSION, session);
            }
        }).catch(err => {
            if (!isMounted) return;
            logger.error('[AuthContext] Crash in getSession:', err);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (!isMounted) return;
            handleAuth(event, session);
        });

        return () => {
            isMounted = false;
            if (subscription) subscription.unsubscribe();
        };
    }, [handleAuth]);

    const value = {
        user,
        profile,
        realUser,
        realProfile,
        loading,
        setProfile,
        adoptPersona,
        loginAsGuest,
        exitPlayground,
        logout,
        forceNukeSimulation,
        isPlayground,
        setIsPlayground,
        setImpersonatedProfile,
        impersonatedProfile,
        activeEntityId,
        setActiveEntityId,
        switchContext,
        simulatedRole,
        setSimulatedRole,
        isSuperAdmin: (realUser?.email === 'javillinares@gmail.com' || profile?.role === USER_ROLES.SUPER_ADMIN),
        isAdmin: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN].includes(profile?.role),
        isEditor: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.EDITOR].includes(profile?.role),
        language,
        setLanguage,
        loginAsGuestAnonymous
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
