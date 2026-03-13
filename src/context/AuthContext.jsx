import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
            avatar_url: '/assets/avatars/comic/iaia_comic_matriarch.png'
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
            let timerId;
            const timeoutPromise = new Promise((_, reject) => {
                timerId = setTimeout(() => reject(new Error('Logout Timeout')), 3000);
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

            try {
                let profileData = await supabaseService.getProfile(session.user.id);
                // [MASTER IDENTITY PROTECTION]
                const userEmail = (session.user.email || session.user.user_metadata?.email || '').toLowerCase();
                const masters = Array.isArray(CREATOR_EMAILS) ? CREATOR_EMAILS : [];
                
                const isMastersEmail = masters.some(email => email.toLowerCase() === userEmail) || 
                                     userEmail === 'javillinares@gmail.com' ||
                                     userEmail === 'mestre@socdepoble.com' ||
                                     userEmail === 'sollutia@gmail.com' ||
                                     userEmail === 'socdepoblecom@gmail.com' ||
                                     userEmail.includes('javillinares') ||
                                     userEmail.includes('llinares') ||
                                     userEmail.includes('mestre@');
                                     
                const databaseName = (profileData?.full_name || '').toLowerCase();
                const isMasterByName = databaseName.includes('llinares') || databaseName.includes('mestre javi');

                // [MASTER ID RECOGNITION] - Very aggressive
                const MASTER_IDS = [
                    'd6325f44-7277-4d20-b020-166c010995ab', // Known Master ID
                    '56557878-3a83-4710-8588-44ade442a8b3', // Fallback Master ID
                ];

                const isOfficialCreator = isMastersEmail || isMasterByName || MASTER_IDS.includes(session.user.id);

                // [NUCLEAR PURGE & SHIELD]
                if (isOfficialCreator) {
                    ['sp_sovereign_identity', 'sp_identity', 'sp_user_id', 'sp_profile', 'sp_active_profile', 'sp_last_auth'].forEach(k => localStorage.removeItem(k));
                    logger.log('[AuthContext] MESTRE DETECTAT. Blindant identitat v2...');
                } else {
                    // SILENT CHECK FOR GHOSTS
                    if (userEmail.includes('javi') || userEmail.includes('llinares')) {
                        console.warn('[MASTER DETECTOR] A ghost was detected but not recognized by official shield.', { email: userEmail, id: session.user.id });
                    }
                }

                let effectiveName = profileData?.full_name || session.user.user_metadata?.full_name || (userEmail ? userEmail.split('@')[0] : null) || (session.user.phone ? 'Veí del Poble' : 'Veí del Poble');
                if (isOfficialCreator) effectiveName = 'Javi Llinares';

                const effectiveProfile = {
                    ...(profileData || {}),
                    id: profileData?.id || session.user.id,
                    full_name: effectiveName,
                    role: isOfficialCreator ? USER_ROLES.SUPER_ADMIN : (profileData?.role || USER_ROLES.NEIGHBOR),
                    avatar_url: isOfficialCreator ? '/Javi_Llinares-Foto_perfil-1.jpg' : (supabaseService.normalizeStorageUrl(profileData?.avatar_url) || null),
                    is_master: isOfficialCreator,
                    is_super_admin: isOfficialCreator
                };

                setRealProfile(effectiveProfile);
                setProfile(effectiveProfile);
                logger.log('[AuthContext] 🏺 IDENTITY CONSOLIDATED:', isOfficialCreator ? 'MESTRE JAVI' : effectiveProfile.full_name);
            } catch (error) {
                logger.error('[AuthContext] Error loading profile:', error);
                const fallback = {
                    id: session.user.id,
                    full_name: session.user.email?.split('@')[0] || 'Sóc de Poble',
                    role: USER_ROLES.NEIGHBOR
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
            // [GUEST/FORASTER MODE] 
            const genesis = identityService.getStoredIdentity() || identityService.generateSovereignIdentity();
            // [MIGRACIÓ TERMINOLÒGICA] Si la identitat guardada diu "Foraster" o "Sóc de Poble" genèric, la bateguem com a "Foraster"
            if (genesis.full_name === 'Foraster de Poble' || genesis.full_name === 'Sóc de Poble' || genesis.full_name === 'Sóc de Poble!') {
                genesis.full_name = 'Foraster';
            }
            setUser({ ...genesis, is_sovereign: true, isAnonymous: true, role: USER_ROLES.GUEST });
            setProfile(genesis);
            logger.log('[AuthContext] 🏹 FORASTER DETECTAT: Identitat sobirana bategant.');
        }

        setLoading(false);
    }, [loginAsGuest]);

    const handleAuthRef = useRef(handleAuth);
    useEffect(() => { handleAuthRef.current = handleAuth; }, [handleAuth]);

    useEffect(() => {
        let isMounted = true;
        
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!isMounted) return;
            const isNuked = localStorage.getItem('nuke_in_progress') === 'true';
            if (isNuked) {
                localStorage.removeItem('nuke_in_progress');
                handleAuthRef.current(AUTH_EVENTS.INITIAL_SESSION, null);
            } else {
                handleAuthRef.current(AUTH_EVENTS.INITIAL_SESSION, session);
            }
        }).catch(err => {
            if (!isMounted) return;
            logger.error('[AuthContext] Crash in getSession:', err);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (!isMounted) return;
            handleAuthRef.current(event, session);
        });

        return () => {
            isMounted = false;
            if (subscription) subscription.unsubscribe();
        };
    }, []);

    const isAuthenticated = !!realUser && !isPlayground;
    const isGuest = !!user && !!user.isAnonymous;

    const value = useMemo(() => ({
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
        currentRole: simulatedRole || profile?.role || USER_ROLES.GUEST,
        isSuperAdmin: (profile?.is_super_admin || profile?.is_master || (simulatedRole ? simulatedRole === USER_ROLES.SUPER_ADMIN : profile?.role === USER_ROLES.SUPER_ADMIN)),
        isAdmin: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN].includes(simulatedRole || profile?.role) || profile?.is_master,
        isEditor: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.EDITOR].includes(simulatedRole || profile?.role) || profile?.is_master,
        language,
        setLanguage,
        loginAsGuestAnonymous,
        isAuthenticated,
        isGuest
    }), [
        user, profile, realUser, realProfile, loading, adoptPersona, loginAsGuest, 
        exitPlayground, logout, forceNukeSimulation, isPlayground, setIsPlayground, 
        impersonatedProfile, activeEntityId, switchContext, simulatedRole, setSimulatedRole, 
        language, setLanguage, loginAsGuestAnonymous, isAuthenticated, isGuest
    ]);

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
