import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { supabaseService } from '../services/supabaseService';
import { identityService } from '../services/identityService';
import { logger } from '../utils/logger';
import i18n from '../i18n/config';
import { DEMO_USER_ID, IAIA_ID, AUTH_EVENTS, USER_ROLES, CREATOR_EMAILS } from '../constants';

const AuthContext = createContext();

/**
 * [PILAR 2: CONTEXT PRE-WARM]
 * Passive geolocation and context preparation.
 */
const preWarmContext = async () => {
    try {
        if ("geolocation" in navigator) {
            // [MASTER GPS ACTIVATION] 
            // L'usuari ha donat permís explícit. Bateguem la localització de forma activa.
            navigator.geolocation.getCurrentPosition((pos) => {
                const { latitude, longitude } = pos.coords;
                logger.log('[PreWarm] GPS Active Bategat:', latitude, longitude);
                localStorage.setItem('last_known_geo', JSON.stringify({ lat: latitude, lon: longitude, ts: Date.now() }));

                // També ho guardem a la identitat sobirana si existeix
                identityService.updateIdentity({ last_lat: latitude, last_lon: longitude });
            }, (err) => {
                logger.warn('[PreWarm] GPS error or timeout:', err.message);
            }, { enableHighAccuracy: true, timeout: 10000 });
        }
    } catch (e) {
        // Silent catch for pre-warm
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        logger.log('[AuthProvider] Montat. El context d\'autenticació ja està disponible en l\'arbre.');
    }, []);
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
            role: USER_ROLES.ADMIN,
            is_demo: true,
            is_admin: true,
            avatar_url: '/assets/avatars/iaia_official.png'
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
        logger.log('[AuthContext] !!! COMENÇANT SEQÜÈNCIA DE SORTIDA RESILIENT !!!');
        alert('Eixint de la xarxa...'); // Alert temporal per a depuració visual de l'usuari
        logger.log('[AuthContext] Executing resilient logout sequence...');

        // [MASTER OPTIMISTIC UI] Netejem l'estat local primer per alliberar l'usuari a l'instant
        const clearLocalState = () => {
            localStorage.removeItem('isPlaygroundMode');
            localStorage.removeItem('sb-simulation-mode');
            localStorage.removeItem('nuke_in_progress');
            localStorage.removeItem('sp_sovereign_identity'); // També identitats sobiranes si cal

            setIsPlayground(false);
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
            // Intentem tancar sessió a Supabase amb un timeout o catch ràpid
            // No esperem eternament si la xarxa falla (Rural Resilience)
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
    };

    useEffect(() => {
        let isMounted = true;
        let initialCheckDone = false;

        // [PILAR 2] Pre-warm context in background (Silenzi Bruno: Evitem violació de gest d'usuari a la consola)
        // preWarmContext();

        const handleAuth = async (event, session) => {
            if (!isMounted) return;
            logger.log('[AuthContext] Auth Event:', event, session?.user?.id);

            const isSobiraSession = !session?.user && !!identityService.getStoredIdentity();
            const isSimulation = localStorage.getItem('isPlaygroundMode') === 'true' ||
                localStorage.getItem('sb-simulation-mode') === 'true' ||
                (session?.user?.id === IAIA_ID);

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
                    const masters = (typeof CREATOR_EMAILS !== 'undefined') ? CREATOR_EMAILS : [];
                    const isCreator = masters.includes(session.user.email);
                    const isPadrino = isCreator; // All creators are Padrinos by definition

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
                        // [MASTER IDENTITY PROTECTION]
                        const masters = (typeof CREATOR_EMAILS !== 'undefined') ? CREATOR_EMAILS : [];
                        const isOfficialCreator = masters.includes(session.user.email) ||
                            session.user.email?.includes('javillinares') ||
                            (window.location.hostname === 'localhost' && !session.user.email?.includes('test')) ||
                            (window.location.hostname.includes('ngrok') && !session.user.email?.includes('test'));

                        const effectiveProfile = {
                            ...(profileData || {}),
                            id: profileData?.id || session.user.id,
                            full_name: isOfficialCreator ? 'Javi Llinares' : (profileData?.full_name || session.user.email?.split('@')[0] || 'Veí de la Torre'),
                            role: isCreator ? USER_ROLES.SUPER_ADMIN : (profileData?.role || USER_ROLES.NEIGHBOR),
                            avatar_url: isOfficialCreator ? '/images/agents/javi_real.png' : (supabaseService.normalizeStorageUrl(profileData?.avatar_url) || null),
                            cover_url: isOfficialCreator ? '/assets/master/brand_cinematic.png' : (supabaseService.normalizeStorageUrl(profileData?.cover_url) || null),
                            ofici: isOfficialCreator ? 'Mestre de la Simbiosi & Dissenyador Master' : (profileData?.ofici || null),
                            bio: isOfficialCreator ? 'Pare de la +IA i de la Xarxa Rhizome. Bategant en peluca i ulleres de sol per la sobirania digital del poble. 🏺🏛️✨' : (profileData?.bio || null),
                            is_master: isOfficialCreator
                        };

                        // [TERMINOLOGY PURGE] Auto-correction for legacy 'Agent' names
                        if (effectiveProfile.full_name?.startsWith('Agent ')) {
                            effectiveProfile.full_name = effectiveProfile.full_name.replace('Agent ', 'Veí ');
                        }

                        setRealProfile(effectiveProfile);
                        setProfile(effectiveProfile);
                        logger.log('[AuthContext] Identity established for production:', effectiveProfile.full_name);
                    }
                } catch (error) {
                    logger.error('[AuthContext] Error loading profile:', error);
                    if (isMounted) {
                        const fallback = {
                            id: session.user.id,
                            full_name: session.user.email?.split('@')[0] || 'Agent',
                            role: isCreator ? USER_ROLES.SUPER_ADMIN : USER_ROLES.NEIGHBOR
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
                setRealUser(null);
                setRealProfile(null);
            } else if (isSobiraSession) {
                const sobira = identityService.getStoredIdentity();
                logger.log('[AuthContext] Recovering Sovereign Identity (0ms entry):', sobira.username);

                const isLocalMaster = window.location.hostname === 'localhost' || window.location.hostname.includes('ngrok');
                if (isLocalMaster) {
                    const masterSobira = {
                        ...sobira,
                        id: 'd6325f44-7277-4d20-b020-166c010995ab',
                        full_name: 'Javi Llinares',
                        username: 'javillinares',
                        role: USER_ROLES.SUPER_ADMIN,
                        avatar_url: '/images/agents/javi_real.png',
                        is_master: true,
                        is_sovereign: true
                    };
                    setUser(masterSobira);
                    setProfile(masterSobira);
                    setRealProfile(masterSobira);
                } else {
                    setUser({ ...sobira, is_sovereign: true });
                    setProfile(sobira);
                }
            } else if (!session?.user) {
                // [CRYPTO GENESIS] Si no hi ha res, bateguem una nova identitat ara mateix
                const genesis = identityService.generateSovereignIdentity();
                setUser({ ...genesis, is_sovereign: true });
                setProfile(genesis);
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

            const isSimulation = localStorage.getItem('isPlaygroundMode') === 'true' ||
                localStorage.getItem('sb-simulation-mode') === 'true' ||
                (session?.user?.id === IAIA_ID);

            // [MASTER RESILIENCE] Si estem en simulació i l'esdeveniment és un SIGNED_OUT extern
            // (per exemple, per un tancament de pestanya o timeout de Supabase), 
            // no expulsem a l'usuari si realment està visitant el poble en "Modo Lectura/Plau".
            if (isSimulation && event === 'SIGNED_OUT') {
                logger.log('[AuthContext] Ignorant SIGNED_OUT en mode Simulació per a mantenir l\'harmonia.');
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
            isSuperAdmin: ((typeof CREATOR_EMAILS !== 'undefined' ? CREATOR_EMAILS : [])).includes(realUser?.email) ||
                profile?.role === USER_ROLES.SUPER_ADMIN ||
                profile?.phone === '+34635082813',
            isAdmin: ((typeof CREATOR_EMAILS !== 'undefined' ? CREATOR_EMAILS : [])).includes(realUser?.email) || [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN].includes(profile?.role),
            isEditor: ((typeof CREATOR_EMAILS !== 'undefined' ? CREATOR_EMAILS : [])).includes(realUser?.email) || [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.EDITOR].includes(profile?.role),
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
