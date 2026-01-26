import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { supabaseService } from '../services/supabaseService';
import { logger } from '../utils/logger';
import i18n from '../i18n/config';
import { DEMO_USER_ID, IAIA_ID, AUTH_EVENTS, USER_ROLES } from '../constants';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [realUser, setRealUser] = useState(null);
    const [realProfile, setRealProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPlayground, setIsPlaygroundState] = useState(localStorage.getItem('isPlaygroundMode') === 'true');

    const setIsPlayground = (val) => {
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
    };

    const exitPlayground = async () => {
        logger.log('[AuthContext] Exiting Playground mode...');

        if (realUser) {
            // Restore real identity
            setIsPlayground(false);
            setUser(realUser);
            setProfile(realProfile);
            window.location.href = '/';
        } else {
            // No real user? Nuclear reset to login.
            await forceNukeSimulation();
        }
    };
    const [impersonatedProfile, setImpersonatedProfile] = useState(null);
    const [activeEntityId, setActiveEntityId] = useState(null);
    const [language, setLanguageState] = useState(localStorage.getItem('i18nextLng') || 'va');

    const setLanguage = (lang) => {
        setLanguageState(lang);
        localStorage.setItem('i18nextLng', lang);
        i18n.changeLanguage(lang);
    };

    const adoptPersona = (personaProfile) => {
        setIsPlayground(true);
        localStorage.setItem('isPlaygroundMode', 'true');

        // DUAL IDENTITY: Keep realUser/realProfile if they exist
        if (realUser) {
            setUser(realUser);
        } else {
            setUser({ id: personaProfile.id, email: `${personaProfile.username}@playground.local`, isDemo: true });
        }

        setProfile({ ...personaProfile, is_playground_session: true });
        setLoading(false);
    };

    const loginAsGuest = () => {
        // Transitional: IAIA is the new guide, Vicent is just a neighbor.
        adoptPersona({
            id: IAIA_ID,
            full_name: 'IAIA (Guia del Poble)',
            username: 'iaia_guide',
            role: USER_ROLES.OFFICIAL,
            is_demo: true,
            is_admin: true,
            avatar_url: '/assets/avatars/iaia.png'
        });
    };

    const forceNukeSimulation = async () => {
        logger.log('[AuthContext] NUCLEAR RESET TRIGGERED - PURGING SIMULATION');

        // 1. Purge ALL storage types
        localStorage.clear();
        sessionStorage.clear();

        // 2. Unregister ALL service workers for total refresh
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

        // 3. Clear Cache API if available
        if ('caches' in window) {
            try {
                const keys = await caches.keys();
                await Promise.all(keys.map(key => caches.delete(key)));
            } catch (cacheError) {
                logger.error('[AuthContext] Cache Clear error:', cacheError);
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

        // Hard reload to clean memory states - back to absolute root with safety flags
        localStorage.setItem('nuke_in_progress', 'true');
        window.location.href = '/login?nuked=true&v=' + Date.now();
    };

    const switchContext = async (entityId = null) => {
        logger.log('[AuthContext] Switching context to:', entityId || 'Personal Profile');
        setActiveEntityId(entityId);

        if (!entityId) {
            // Restore personal profile
            setProfile(realProfile);
            setImpersonatedProfile(null);
            return;
        }

        try {
            // Fetch entity profile to impersonate
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
    };

    const logout = async () => {
        logger.log('[AuthContext] Executing secure logout sequence...');
        if (isPlayground) {
            await forceNukeSimulation();
            return;
        }

        localStorage.removeItem('isPlaygroundMode');
        localStorage.removeItem('sb-simulation-mode');
        localStorage.removeItem('nuke_in_progress');
        setIsPlayground(false);
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setRealUser(null);
        setRealProfile(null);
        setImpersonatedProfile(null);
        setActiveEntityId(null);
    };

    useEffect(() => {
        let isMounted = true;
        let initialCheckDone = false;

        const handleAuth = async (event, session) => {
            if (!isMounted) return;
            logger.log('[AuthContext] Auth Event:', event, session?.user?.id);

            const isSimulation = localStorage.getItem('isPlaygroundMode') === 'true' || localStorage.getItem('sb-simulation-mode') === 'true';

            if (session?.user) {
                // DIRECTIVA 1: L'usuari registrat sempre aterra a PRODUCCIÓ (Xat Real)
                if (isSimulation) {
                    logger.warn('[AuthContext] DIRECTIVA 1: Real session detected - Killing simulation flags');
                    setIsPlaygroundState(false);
                    localStorage.removeItem('isPlaygroundMode');
                    localStorage.removeItem('sb-simulation-mode');
                }

                if (isMounted) {
                    setRealUser(session.user);
                    setUser(session.user);
                    setImpersonatedProfile(null);
                    setActiveEntityId(null);
                }

                try {
                    let profileData = await supabaseService.getProfile(session.user.id);

                    // BUSCADOR DEL COR (v2): Si és un Padrino/Admin i el perfil és buit, busquem l'original
                    const JAVI_REAL_ID = 'd6325f44-7277-4d20-b020-166c010995ab';
                    const isJavi = session.user.email === 'socdepoblecom@gmail.com';
                    const isDamia = session.user.email === 'damimus@gmail.com';
                    const isPadrino = isJavi || isDamia;

                    // If profileData is empty but it's a Padrino, search by name/username
                    if (isPadrino && !profileData) {
                        const { data: adminProfiles } = await supabase
                            .from('profiles')
                            .select('*')
                            .or(`id.eq.${JAVI_REAL_ID},full_name.ilike.%Javi Llinares%,username.eq.javillinares,username.eq.socdepoble`)
                            .not('avatar_url', 'is', null)
                            .order('created_at', { ascending: true })
                            .limit(1);

                        if (adminProfiles && adminProfiles.length > 0) {
                            profileData = adminProfiles[0];
                        }
                    }

                    if (isMounted) {
                        if (profileData && isJavi) {
                            profileData.full_name = 'Javi';
                        }

                        // [DIRECTIVA 1] Fallback profile must NEVER be IAIA for a real session
                        const fallbackProfile = {
                            id: session.user.id,
                            full_name: isJavi ? 'Javi' : (isDamia ? 'Damià' : (session.user.email?.split('@')[0] || 'Veí')),
                            role: 'vei',
                            avatar_url: null
                        };

                        const effectiveProfile = profileData || fallbackProfile;

                        setRealProfile(effectiveProfile);
                        setProfile(effectiveProfile);
                        logger.log('[AuthContext] Identity established for production:', effectiveProfile.full_name);
                    }
                } catch (error) {
                    logger.error('[AuthContext] Error loading profile:', error);
                    const isJavi = session.user.email === 'socdepoblecom@gmail.com';
                    const isDamia = session.user.email === 'damimus@gmail.com';
                    if (isMounted) {
                        const fallback = {
                            id: session.user.id,
                            full_name: isJavi ? 'Javi' : (isDamia ? 'Damià' : (session.user.email?.split('@')[0] || 'Veí')),
                            role: 'vei'
                        };
                        setRealProfile(fallback);
                        setProfile(fallback);
                    }
                }
            } else if (isSimulation) {
                if (!user || user.id !== IAIA_ID) {
                    logger.log('[AuthContext] Restoring playground guest session');
                    loginAsGuest();
                }
            } else {
                setUser(null);
                setProfile(null);
                setRealUser(null);
                setRealProfile(null);
            }

            if (isMounted) setLoading(false);
        };

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            const isNuked = localStorage.getItem('nuke_in_progress') === 'true';
            if (isNuked) {
                localStorage.removeItem('nuke_in_progress');
                handleAuth(AUTH_EVENTS.INITIAL_SESSION, null);
            } else {
                handleAuth(AUTH_EVENTS.INITIAL_SESSION, session);
            }
            initialCheckDone = true;
        }).catch(err => {
            logger.error('[AuthContext] Crash in getSession:', err);
            initialCheckDone = true;
            if (isMounted) setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (!initialCheckDone && event === 'SIGNED_IN') return;

            const isSimulation = localStorage.getItem('isPlaygroundMode') === 'true' || localStorage.getItem('sb-simulation-mode') === 'true';
            if (isSimulation && event === 'SIGNED_OUT') {
                logger.log('[AuthContext] Ignoring SIGNED_OUT event in Rescue Mode');
                return;
            }

            handleAuth(event, session);
        });

        return () => {
            isMounted = false;
            if (subscription) subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{
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
            isSuperAdmin: (realUser?.email === 'socdepoblecom@gmail.com' || realUser?.email === 'damimus@gmail.com') || profile?.role === USER_ROLES.SUPER_ADMIN,
            isAdmin: (realUser?.email === 'socdepoblecom@gmail.com' || realUser?.email === 'damimus@gmail.com') || [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN].includes(profile?.role),
            isEditor: (realUser?.email === 'socdepoblecom@gmail.com' || realUser?.email === 'damimus@gmail.com') || [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.EDITOR].includes(profile?.role),
            impersonatedProfile,
            setImpersonatedProfile,
            activeEntityId,
            setActiveEntityId,
            switchContext,
            language,
            setLanguage
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
