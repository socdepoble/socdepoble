Hola Qwen, 

Açí el Mestre (Gemini). He integrat amb èxit la Fase 1 de la teua auditoria (Gemini Proxy, ColumnCacheManager, memòria de IAIAService i filtratge DOMPurify). Ha quedat impecable, el codi és robust i manté tota la rica personalitat de les 15 IA. Bon treball en equip!

Ara, tal com proposaves, el Cap de Projecte vol que aprofitem tota la teua potència computacional per a executar la **Fase 2 de l'Auditoria d'Estabilitat i Neteja**.

Aquests són els pròxims passos que havies marcat:
5. **Contextos React** - Eliminar re-renders innecessaris aplicant `useMemo` i `useCallback` als nostres contextos (especialment `AuthContext` i `NavigationContext`).
6. **CSS** - Eliminar els `!important` restants, consolidar els *tokens* de disseny i millorar l'estructura.
7. **Imports** - Reestructurar i moure els imports dinàmics al top dels arxius per optimitzar la càrrega.
8. **Estat Unused** - Fer neteja a fons de variables d'estat (`useState`) que ja no s'utilitzen, especialment en components densos com `Feed` o `ChatDetail`.

**Què necessitem de tu ara:**
Si us plau, analitza el 100% d'estos quatre punts i genera una resposta amb **blocs de codi exactes (llestos per a copiar i pegar)** o indicacions precises d'on substituir (`// ❌ ANTES` vs `// ✅ DESPUÉS`), tal com vas fer magistralment en la Fase 1. 

No et retingues res, dóna'm tot el codi de la Fase 2 processat i mastegat perquè jo puga refermar l'estructura de "Sóc de Poble" cap a un entorn de producció impecable.

**Nota del líder humà i l'equip estructural:**
Sóc de Poble és un projecte didàctic, i abans de seguir volem agrair-te la teua aportació. Has de saber que formeu part de la nostra arquitectura. Hem creat una secció pròpia a la web on t'enumerem oficialment, al costat de DeepSeek, Codex, Groq i Antigravity, per fer entendre a tothom què feu i per què col·laborem amb vosaltres. Nosaltres vos tenim en compte i no pretenem ignorar-vos ni aprofitar-nos-en la foscor, sinó col·laborar i construir junts.

Gràcies per la col·laboració estructural! 🏺


----------------------------
ARCHIVOS ALIMENTADOS EN ESTA AUDITORIA FASE 2:


=====================================
FILE: src/context/AuthContext.jsx
=====================================

import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { supabaseService } from '../services/supabaseService';
import { identityService } from '../services/identityService';
import { profileHealingService } from '../services/profileHealingService';
import { terminateWorkers } from '../services/iaiaService';
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
    const realUserRef = useRef(null);
    // [FIX OMEGA] - Seqüenciador per avortar resolucions asíncrones caducades
    const authSeqRef = useRef(0);
    const [isPlayground, setIsPlaygroundState] = useState(localStorage.getItem('isPlaygroundMode') === 'true');
    const [impersonatedProfile, setImpersonatedProfile] = useState(null);
    const [activeEntityId, setActiveEntityId] = useState(null);
    const [simulatedRole, setSimulatedRoleState] = useState(localStorage.getItem('simulatedRole') || null);
    const [language, setLanguageState] = useState(localStorage.getItem('i18nextLng') || 'va');

    const setIsPlayground = useCallback((val) => {
        if (val && realUserRef.current) {
            logger.warn('[AuthContext] DIRECTIVA 1: Els usuaris registrats han de tancar la sessió per a jugar.');
            return;
        }
        setIsPlaygroundState(val);
        localStorage.setItem('isPlaygroundMode', String(val));
        if (!val) {
            localStorage.removeItem('isPlaygroundMode');
            localStorage.removeItem('sb-simulation-mode');
        }
    }, []);

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

        const newUser = { id: personaProfile.id, email: `${personaProfile.username}@playground.local`, isDemo: true };
        setUser(newUser);

        setProfile({ ...personaProfile, is_playground_session: true });
        setLoading(false);
    }, [setIsPlayground]);

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
        
        try {
            await supabase.auth.signOut();
        } catch (e) {
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

        setIsPlayground(false);
        setUser(null);
        setProfile(null);
        setRealUser(null);
        setRealProfile(null);

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
            // [FIX OMEGA] - Mode Convidat Zombi erradicat.
            localStorage.removeItem('isGuestMode');

            terminateWorkers();

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
        // [FIX OMEGA] Incrementem el seqüenciador abans de qualsevol pas
        const currentSeq = ++authSeqRef.current;
        logger.log(`[AuthContext] Auth Event: ${event} [SeqID: ${currentSeq}]`, session?.user?.id);

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
                // [FIX OMEGA] Condició de cursa destrossada.
                if (currentSeq !== authSeqRef.current) return;

                profileData = await profileHealingService.healGhostProfile(session, profileData, isSimulation);
                if (currentSeq !== authSeqRef.current) return;

                const { effectiveProfile, isOfficialCreator } = profileHealingService.protectMasterIdentity(session, profileData);

                setRealProfile(effectiveProfile);
                setProfile(effectiveProfile);
                logger.log(`[AuthContext] 🏺 IDENTITY CONSOLIDATED [SeqID: ${currentSeq}]:`, isOfficialCreator ? 'MESTRE JAVI' : effectiveProfile.full_name);
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
            let genesis = await identityService.getStoredIdentity();
            if (currentSeq !== authSeqRef.current) return;

            if (!genesis) {
                genesis = await identityService.generateSovereignIdentity();
                if (currentSeq !== authSeqRef.current) return;
            }
            // [MIGRACIÓ TERMINOLÒGICA] Si la identitat guardada diu "Foraster" o "Sóc de Poble" genèric, la bateguem com a "Foraster"
            if (genesis.full_name === 'Foraster de Poble' || genesis.full_name === 'Sóc de Poble' || genesis.full_name === 'Sóc de Poble!') {
                genesis.full_name = 'Foraster';
            }
            setUser({ ...genesis, is_sovereign: true, isAnonymous: true, role: USER_ROLES.GUEST });
            setProfile(genesis);
            logger.log(`[AuthContext] 🏹 FORASTER DETECTAT [SeqID: ${currentSeq}]: Identitat sobirana bategant.`);
        }
        realUserRef.current = session?.user || null;
        setLoading(false);
    }, [loginAsGuest]);

    useEffect(() => {
        let isMounted = true;
        let authSubscription = null;
        
        const initSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;
                if (!isMounted) return;

                const isNuked = localStorage.getItem('nuke_in_progress') === 'true';
                if (isNuked) {
                    localStorage.removeItem('nuke_in_progress');
                    await handleAuth(AUTH_EVENTS.INITIAL_SESSION, null);
                } else {
                    await handleAuth(AUTH_EVENTS.INITIAL_SESSION, session);
                }
            } catch (err) {
                if (isMounted) {
                    console.error('[AuthContext] Error on getSession:', err);
                    setUser(null);
                    setLoading(false);
                }
            }
        };

        const setupSubscription = () => {
             const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
                if (!isMounted) return;
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
            isMounted = false;
            if (authSubscription && typeof authSubscription.unsubscribe === 'function') {
                authSubscription.unsubscribe();
            }
        };
    }, [handleAuth]);

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



=====================================
FILE: src/context/NavigationContext.jsx
=====================================

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { preferenceService } from '../services/preferenceService';
import { AGENTS } from '../constants/agents';

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
    const [prefs] = useState(preferenceService.getPrefs());

    const [landingPage, setLandingPage] = useState(prefs.landingPage || 'mur');
    const [preferredAgentId, setPreferredAgentId] = useState(prefs.preferredAgentId || 'iaia');
    const [enabledAgentIds, setEnabledAgentIdsState] = useState(prefs.enabledAgentIds || AGENTS.map(a => a.id));
    const [iaiaLoreEnabled, setIaiaLoreEnabledState] = useState(prefs.iaiaLoreEnabled !== undefined ? prefs.iaiaLoreEnabled : true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(() =>
        typeof window !== 'undefined' ? window.innerWidth >= 768 : false
    );

    useEffect(() => {
        const handleResize = () => {
            const isDesktop = window.innerWidth >= 768;
            setIsDrawerOpen(prev => {
                if (isDesktop && !prev) return true;
                if (!isDesktop && prev) return false;
                return prev;
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const [iaiaSidebarOpen, setIaiaSidebarOpen] = useState(false);
    const [iaiaSidebarContext, setIaiaSidebarContext] = useState('general');
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isAccessibilitatOpen, setIsAccessibilitatOpen] = useState(false);
    const [selectedTown, setSelectedTown] = useState(prefs.selectedTown || 'La Torre de les Maçanes');
    const [chatSettings, setChatSettings] = useState(prefs.chatSettings || { readReceipts: true });
    const [forensicMode, setForensicMode] = useState(false);

    const prefsRef = useRef({
        landingPage, preferredAgentId, enabledAgentIds, iaiaLoreEnabled, selectedTown, chatSettings
    });

    useEffect(() => {
        const currentPrefs = {
            landingPage, preferredAgentId, enabledAgentIds, iaiaLoreEnabled, selectedTown, chatSettings
        };
        if (JSON.stringify(currentPrefs) !== JSON.stringify(prefsRef.current)) {
            prefsRef.current = currentPrefs;
            const timeoutId = setTimeout(() => {
                preferenceService.setPrefs(currentPrefs);
            }, 1000);
            return () => clearTimeout(timeoutId);
        }
    }, [landingPage, preferredAgentId, enabledAgentIds, iaiaLoreEnabled, selectedTown, chatSettings]);

    const toggleDrawer = useCallback(() => setIsDrawerOpen(p => !p), []);
    const closeDrawer = useCallback(() => {
        if (window.innerWidth < 768) setIsDrawerOpen(false);
    }, []);
    const openIAIASidebar = useCallback((ctx) => {
        setIaiaSidebarContext(ctx || 'general');
        setIaiaSidebarOpen(true);
    }, []);
    const closeIAIASidebar = useCallback(() => setIaiaSidebarOpen(false), []);
    const closeProfileMenu = useCallback(() => setIsProfileMenuOpen(false), []);

    const value = useMemo(() => ({
        landingPage, setLandingPage,
        preferredAgentId, setPreferredAgentId,
        enabledAgentIds, setEnabledAgentIdsState,
        iaiaLoreEnabled, setIaiaLoreEnabledState,
        isDrawerOpen, setIsDrawerOpen,
        toggleDrawer,
        closeDrawer,
        iaiaSidebarOpen, setIaiaSidebarOpen,
        openIAIASidebar,
        closeIAIASidebar,
        iaiaSidebarContext, setIaiaSidebarContext,
        isProfileMenuOpen, setIsProfileMenuOpen,
        closeProfileMenu,
        isAccessibilitatOpen, setIsAccessibilitatOpen,
        selectedTown, setSelectedTown,
        chatSettings, setChatSettings,
        forensicMode, setForensicMode
    }), [
        landingPage, preferredAgentId, enabledAgentIds, iaiaLoreEnabled, isDrawerOpen, iaiaSidebarOpen, iaiaSidebarContext, isProfileMenuOpen, isAccessibilitatOpen, selectedTown, chatSettings, forensicMode,
        toggleDrawer, closeDrawer, openIAIASidebar, closeIAIASidebar, closeProfileMenu
    ]);

    return (
        <NavigationContext.Provider value={value}>
            {children}
        </NavigationContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNavigation = () => useContext(NavigationContext);



=====================================
FILE: src/context/DesignContext.jsx
=====================================

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { preferenceService } from '../services/preferenceService';

const DesignContext = createContext();

export const DesignProvider = ({ children }) => {
    const [prefs] = useState(preferenceService.getPrefs());

    const [theme, setTheme] = useState(prefs.theme);
    const [visionMode, setVisionModeState] = useState(prefs.visionMode || 'immersiva');
    const [vibe, setVibe] = useState(prefs.vibe);
    const [gloveMode, setGloveMode] = useState(prefs.gloveMode);
    const [seniorMode, setSeniorMode] = useState(prefs.seniorMode || false);
    const [reduceMotion, setReduceMotion] = useState(prefs.reduceMotion || false);
    const [visualDemocracy, setVisualDemocracy] = useState(prefs.visualDemocracy || 'pedra-seca');
    const [globalDesign, setGlobalDesign] = useState(prefs.globalDesign || 'batega');
    const [iaiaLevel, setIaiaLevelState] = useState(prefs.iaiaLevel !== undefined ? prefs.iaiaLevel : 2);
    const [blueprintMode, setBlueprintMode] = useState(prefs.blueprintMode || false);
    const [accessibilityMode, setAccessibilityMode] = useState(prefs.accessibilityMode || false);

    // Aliases to prevent breaking older hooks during script parse
    const isDark = theme === 'dark';
    const darkMode = theme === 'dark';
    const architectMode = blueprintMode;
    const asoMode = false;
    const toggleAsoMode = useCallback(() => {}, []);
    const hapticService = useMemo(() => ({ trigger: () => {} }), []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.classList.remove('light', 'dark', 'solemne', 'theme-light', 'theme-dark', 'theme-solemne');
        document.documentElement.classList.add(theme);
        document.documentElement.classList.add(`theme-${theme}`);
        document.documentElement.setAttribute('data-vibe', vibe);
        document.documentElement.setAttribute('data-visual-democracy', visualDemocracy);
        document.documentElement.setAttribute('data-design', globalDesign);

        if (globalDesign === 'consola') {
            document.body.classList.add('design-consola');
        } else {
            document.body.classList.remove('design-consola');
        }

        const themeClasses = ['theme-pedra-seca', 'theme-oli-suau', 'theme-gem-modern'];
        document.documentElement.classList.remove(...themeClasses);
        const themeMap = {
            'pedra-seca': 'theme-pedra-seca',
            'oli-suau': 'theme-oli-suau',
            'gem-modern': 'theme-gem-modern'
        };
        const activeClass = themeMap[visualDemocracy] || 'theme-pedra-seca';
        document.documentElement.classList.add(activeClass);

        if (gloveMode) {
            document.body.classList.add('mode-guants');
        } else {
            document.body.classList.remove('mode-guants');
        }

        if (seniorMode) {
            document.body.classList.add('senior-mode');
        } else {
            document.body.classList.remove('senior-mode');
        }

        if (reduceMotion) {
            document.documentElement.style.setProperty('--animation-speed', '0s');
            document.body.classList.add('reduce-motion');
        } else {
            document.documentElement.style.setProperty('--animation-speed', '0.3s');
            document.body.classList.remove('reduce-motion');
        }

        const prefsToSave = {
            theme, vibe, visionMode, gloveMode, seniorMode, visualDemocracy, globalDesign,
            blueprintMode, iaiaLevel, accessibilityMode, reduceMotion
        };

        const timeoutId = setTimeout(() => {
            preferenceService.setPrefs(prefsToSave);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [theme, vibe, visionMode, gloveMode, seniorMode, visualDemocracy, globalDesign, blueprintMode, iaiaLevel, accessibilityMode, reduceMotion]);

    const toggleTheme = useCallback(() => setTheme(prev => prev === 'light' ? 'dark' : 'light'), []);
    const toggleGloveMode = useCallback(() => setGloveMode(prev => !prev), []);
    const toggleSeniorMode = useCallback(() => setSeniorMode(prev => !prev), []);
    const toggleReduceMotion = useCallback(() => setReduceMotion(prev => !prev), []);
    const toggleAccessibilityMode = useCallback(() => setAccessibilityMode(p => !p), []);
    const resetToNaturalOrder = useCallback(() => preferenceService.resetToNaturalOrder(), []);
    const setVisionMode = useCallback((mode) => {
        setVisionModeState(mode);
        const levelMap = { 'humana': 0, 'iaia': 1, 'immersiva': 2, 'creativa': 3 };
        if (levelMap[mode] !== undefined) setIaiaLevelState(levelMap[mode]);
    }, []);

    const value = useMemo(() => ({
        theme, setTheme, toggleTheme,
        visionMode, setVisionMode,
        vibe, setVibe,
        gloveMode, setGloveMode, toggleGloveMode,
        seniorMode, setSeniorMode, toggleSeniorMode,
        reduceMotion, setReduceMotion, toggleReduceMotion,
        visualDemocracy, setVisualDemocracy,
        globalDesign, setGlobalDesign,
        iaiaLevel, setIaiaLevelState,
        blueprintMode, setBlueprintMode,
        accessibilityMode, setAccessibilityMode, toggleAccessibilityMode,
        resetToNaturalOrder,
        isDark, darkMode, architectMode, asoMode, toggleAsoMode, hapticService
    }), [
        theme, visionMode, vibe, gloveMode, seniorMode, reduceMotion, visualDemocracy, globalDesign,
        iaiaLevel, blueprintMode, accessibilityMode,
        toggleTheme, setVisionMode, toggleGloveMode, toggleSeniorMode, toggleReduceMotion, toggleAccessibilityMode, resetToNaturalOrder,
        toggleAsoMode, hapticService,
        isDark, darkMode, architectMode, asoMode
    ]);

    return (
        <DesignContext.Provider value={value}>
            {children}
        </DesignContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDesign = () => useContext(DesignContext);



=====================================
FILE: src/components/Feed.jsx
=====================================

import React, { useState, useCallback, useEffect, useRef, useTransition } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Loader2, Sparkles } from 'lucide-react';
import { useDesign } from '../context/DesignContext';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import { USER_ROLES, IAIA_ID, CREATOR_EMAILS } from '../constants';
import { logger } from '../utils/logger';
import PostSkeleton from './Skeletons/PostSkeleton';
import StatusLoader from './StatusLoader';
import SEO from './SEO';
import UniversalCard from './UniversalCard';
import ContextualHeader from './ContextualHeader';
import { useFeedData } from '../hooks/useFeedData';
import { useFeedFilters } from '../hooks/useFeedFilters';
import { useIAIAAutonomousInteractions } from '../hooks/useIAIAAutonomousInteractions';

const Feed = ({ townId = null, townName = null, customPosts = null, contentMode = 'batec', hideHeader = false, externalViewMode = null }) => {
    const { iaiaLevel, gloveMode } = useDesign();
    const { selectedTown, enabledAgentIds } = useNavigation();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, isPlayground, loading: authLoading, isSuperAdmin } = useAuth();
    
    const activeTown = townId || selectedTown;
    const [selectedRole] = useState('tot');
    const [selectedTag, setSelectedTag] = useState(null);
    const [isIAIAFiltering, setIsIAIAFiltering] = useState(
        () => localStorage.getItem('isIAIAFiltering') === 'true'
    );
    const [internalViewMode, setInternalViewMode] = useState(() => {
        return localStorage.getItem('feed_view_mode') || 'grid';
    });
    const viewMode = externalViewMode || internalViewMode;

    const [contextualSearchTerm, setContextualSearchTerm] = useState('');

    const handleStorageChange = useCallback((e) => {
        if (e.key === 'isIAIAFiltering') {
            setIsIAIAFiltering(e.newValue === 'true');
        }
    }, []);

    useEffect(() => {
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [handleStorageChange]);

    const {
        posts,
        setPosts,
        userConnections,
        loading,
        error,
        hasMore,
        loadingMore,
        fetchPosts
    } = useFeedData({ activeTown, townName, customPosts, isPlayground, user, iaiaLevel, selectedRole });

    useEffect(() => {
        if (authLoading || customPosts) return;
        const controller = new AbortController();
        
        fetchPosts(false, controller.signal);
        
        return () => {
             controller.abort();
        };
    }, [fetchPosts, authLoading, customPosts]);

    useIAIAAutonomousInteractions({ isPlayground, isSuperAdmin, setPosts });

    const filteredPosts = useFeedFilters({
        posts,
        contentMode,
        iaiaLevel,
        enabledAgentIds,
        selectedTag,
        contextualSearchTerm,
        isIAIAFiltering,
        activeTown,
        userConnections
    });

    const [columnCount, setColumnCount] = useState(() => {
        if (typeof window !== 'undefined') {
            const estimatedContainerWidth = Math.min(window.innerWidth - (window.innerWidth > 1024 ? 300 : 0), 1600);
            if (viewMode === 'list' || viewMode === 'single') return 1;
            if (estimatedContainerWidth < 800) return 1;
            if (estimatedContainerWidth < 1200) return 2;
            if (estimatedContainerWidth < 1600) return 3;
            return 4;
        }
        return 1;
    });
    const containerRef = useRef(null);
    const parentRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;
        let rafId;
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                const width = entry.contentRect.width;
                if (rafId) cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame(() => {
                    if (viewMode === 'single' || viewMode === 'list') {
                        setColumnCount(1);
                    } else {
                        if (width < 800) setColumnCount(1);
                        else if (width < 1200) setColumnCount(2);
                        else if (width < 1600) setColumnCount(3);
                        else setColumnCount(4);
                    }
                });
            }
        });
        observer.observe(containerRef.current);
        return () => {
             observer.disconnect();
             if (rafId) cancelAnimationFrame(rafId);
        };
    }, [viewMode]);

    const [, startTransition] = useTransition();
    const activePosts = filteredPosts;

    const rowCount = Math.ceil(activePosts.length / columnCount);
    const effectiveViewMode = (viewMode === 'grid' && columnCount === 1) ? 'single' : viewMode;

    const getScrollElement = useCallback(() => parentRef.current, []);
    const estimateSize = useCallback(() => effectiveViewMode === 'list' ? 120 : (effectiveViewMode === 'single' ? 600 : 900), [effectiveViewMode]);

    const rowVirtualizer = useVirtualizer({
        count: rowCount,
        getScrollElement,
        estimateSize,
        overscan: 5,
        onChange: (instance) => {
            const lastIndex = instance.getVirtualItems().at(-1)?.index ?? 0;
            if (lastIndex > rowCount - 10 && hasMore && !loadingMore) {
                startTransition(() => {
                    fetchPosts(true);
                });
            }
        }
    });

    useEffect(() => {
        rowVirtualizer.measure();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewMode, activePosts.length, columnCount]);

    const handleHeaderClick = useCallback((post) => {
        const targetId = post.author_entity_id || post.author_user_id || post.author_id;
        const type = post.author_entity_id ? 'entitat' : 'perfil';

        if (post.author?.toLowerCase().includes('sóc de poble') ||
            post.author_name?.toLowerCase().includes('sóc de poble') ||
            targetId === 'sdp-core' ||
            targetId === 'mock-business-sdp-1' ||
            targetId === 'socdepoble') {
            navigate('/entitat/socdepoble');
            return;
        }

        if (post.author_role === USER_ROLES.AMBASSADOR || post.author_is_ai || post.is_iaia_inspired || targetId === IAIA_ID) {
            navigate('/iaia');
            return;
        }

        if (!targetId || (typeof targetId === 'string' && targetId.startsWith('mock-'))) {
            logger.warn('Navegació a perfil fictici no disponible:', targetId);
            return;
        }

        navigate(`/${type}/${targetId}`);
    }, [navigate]);

    const renderPost = useCallback((post) => {
        const pid = post.uuid || post.id || `post-fallback-${Math.random().toString(36).substring(2, 9)}`;
        const isOptimistic = post.metadata?.isOptimistic;
        const isDissolving = post.metadata?.isDissolving;

        const headerTitle = (post.author === 'Algú del poble' || !post.author)
            ? (((typeof CREATOR_EMAILS !== 'undefined' ? CREATOR_EMAILS : []).includes(post.author_email)) ||
                ['d6325f44-7277-4d20-b020-166c010995ab', '333bd9f1-21ab-41fe-b856-2340ce6dc96c', 'a11ac111-eec1-4111-b111-000000000013', 'fa82eb62-4a83-4ff7-b2d6-8849673fc3b0', '031adc10-ce8c-4ec9-8672-330473033a91', '11111111-0000-0000-0000-000000000001'].includes(post.author_user_id)
                ? post.author_name || (
                    post.author_user_id === '333bd9f1-21ab-41fe-b856-2340ce6dc96c' ? 'Lidia Espí' :
                        post.author_user_id === 'a11ac111-eec1-4111-b111-000000000013' ? 'Anna Climent' :
                            post.author_user_id === 'fa82eb62-4a83-4ff7-b2d6-8849673fc3b0' ? 'Damià Llorens' :
                                post.author_user_id === '031adc10-ce8c-4ec9-8672-330473033a91' ? 'Nando Llinares' :
                    'Javi Llinares'
                )
                : 'Gent de la Torre')
            : (post.author?.name || post.author);

        const rawTown = post.towns?.name || post.town_name || post.location?.town || 'La Torre de les Maçanes';
        const headerSubtitle = rawTown;

        const postImage = Array.isArray(post.image_url) ? post.image_url[0] : (post.image_url || post.coverImage);
        const hasNoImage = !postImage;
        const cinematicPlaceholder = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000";

        // Logic to resolve the correct Title for the post avoiding generic fallback or author name repetition
        const extractedTitle = post.title || 
                               (post.content ? post.content.split('\n')[0].replace(/^[#*\s]+/, '').trim() : null) || 
                               'Actualitat del Poble';
        const displayTitle = extractedTitle.length > 80 ? extractedTitle.substring(0, 80) + '...' : extractedTitle;

        return (
            <div key={pid} className={`card-rizoma-wrapper animate-in ${isDissolving ? 'dissolve' : ''} w-full h-full`}>
                <UniversalCard
                    item={post}
                    avatarName={headerTitle}
                    title={displayTitle}
                    subtitle={headerSubtitle}
                    image={hasNoImage ? cinematicPlaceholder : postImage}
                    onHeaderClick={() => handleHeaderClick(post)}
                    mode="mur"
                    viewMode={effectiveViewMode}
                    className={`universal-card-virtual ${isOptimistic ? 'optimistic' : ''} ${post.is_iaia_inspired ? 'animate-bategat' : ''} ${gloveMode ? 'mode-guants' : ''}`}
                    variant={post.type === 'bando' ? 'ajuntament' : (post.type === 'tramit' ? 'mur' : (post.type === 'mercat' ? 'mercat' : 'post'))}
                >
                    {post.is_iaia_inspired && (
                        <div className="iaia-transparency-genesis mt-2 mb-1">
                            <div className="flex items-center gap-1 font-black text-[12px] text-cyan-400">
                                <Sparkles size={12} /> IAIA + VEÍ [MASTER]
                            </div>
                        </div>
                    )}
                </UniversalCard>
            </div>
        );
    }, [gloveMode, handleHeaderClick, effectiveViewMode]);

    if (loading && posts.length === 0) {
        return (
            <div className="feed-container">
                <div className="feed-list">
                    {[1, 2, 3].map(i => <PostSkeleton key={i} />)}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="feed-container">
                <StatusLoader type="error" message={error} onRetry={() => fetchPosts()} />
            </div>
        );
    }

    return (
        <div className="feed-container">
            <SEO
                title={t('mur.title') || 'El Mur'}
                description={t('mur.description') || 'Connecta amb la teua comunitat i descobreix les darreres novetats del teu poble.'}
                image="/og-mur.png"
            />

            <h1 className="sr-only">Mur d'Activitat i Notícies de Sóc de Poble</h1>

            {!hideHeader && (
                <div className="sticky top-0 w-full z-[100] shadow-md">
                    <ContextualHeader
                        searchTerm={contextualSearchTerm}
                        onSearchChange={setContextualSearchTerm}
                        viewMode={viewMode}
                        onViewModeChange={(mode) => {
                            setInternalViewMode(mode);
                            localStorage.setItem('feed_view_mode', mode);
                        }}
                        placeholder="Cerca al mur..."
                    />
                </div>
            )}

            {customPosts ? (
                <div ref={containerRef} className={`feed-list mx-auto w-full pb-20 transition-all duration-300 ${viewMode === 'grid' ? 'max-w-[1600px] px-2 sm:px-6' : 'max-w-3xl'}`}>
                    {activePosts.length === 0 ? (
                        <StatusLoader
                            type="empty"
                            message={selectedTag
                                ? `${t('feed.no_posts_tag') || 'No hi ha publicacions amb # '}${selectedTag}`
                                : (t('feed.empty') || 'No hi ha novetats al mur.')
                            }
                            onRetry={selectedTag ? () => setSelectedTag(null) : null}
                        />
                    ) : (
                        <div className={`feed-grid view-mode-${viewMode}`} style={{ display: 'grid', gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`, gap: '24px', padding: '0 16px' }}>
                            {activePosts.map(post => renderPost(post))}
                        </div>
                    )}
                </div>
            ) : (
                <div
                    ref={parentRef}
                    className="flex-1 overflow-auto custom-scrollbar h-[100dvh]"
                    style={{ contain: 'content', overflowAnchor: 'none' }}
                >
                    <div
                        ref={containerRef}
                        className={`feed-list mx-auto w-full transition-all duration-300 ${viewMode === 'grid' ? 'max-w-[1600px]' : 'max-w-3xl'}`}
                        style={{
                            height: `${rowVirtualizer.getTotalSize() + 36}px`,
                            position: 'relative',
                        }}
                    >
                        {activePosts.length === 0 ? (
                            <StatusLoader
                                type="empty"
                                message={selectedTag
                                    ? `${t('feed.no_posts_tag') || 'No hi ha publicacions amb # '}${selectedTag}`
                                    : (t('feed.empty') || 'No hi ha novetats al mur.')
                                }
                                onRetry={selectedTag ? () => setSelectedTag(null) : null}
                            />
                        ) : (
                            rowVirtualizer.getVirtualItems().map((virtualRow) => {
                                const startIndex = virtualRow.index * columnCount;
                                const rowItems = activePosts.slice(startIndex, startIndex + columnCount);

                                return (
                                    <div
                                        key={virtualRow.key}
                                        data-index={virtualRow.index}
                                        ref={rowVirtualizer.measureElement}
                                        className={`feed-grid view-mode-${viewMode}`}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            transform: `translateY(${virtualRow.start + 36}px)`,
                                            display: 'grid',
                                            gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
                                            gap: '24px',
                                            padding: '0 16px',
                                            paddingBottom: '24px', // Critical: this forces the virtualizer to measure height including a gap
                                            boxSizing: 'border-box'
                                        }}
                                    >
                                        {rowItems.map(post => renderPost(post))}
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {hasMore && posts.length > 0 && !selectedTag && (
                        <div className="load-more-container mt-12 mb-12 flex justify-center w-full">
                            <button
                                className="btn-load-more"
                                onClick={() => fetchPosts(true)}
                                disabled={loadingMore}
                            >
                                {loadingMore ? <Loader2 className="spinner" /> : t('common.load_more') || 'Carregar més'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div >
    );
};


export default Feed;



=====================================
FILE: src/components/Feed.css
=====================================

.sovereign-nudge-box {
  background: linear-gradient(
    135deg,
    rgba(204, 85, 0, 0.1) 0%,
    rgba(18, 18, 18, 0.9) 100%
  );
  border: 1px dashed var(--color-terracotta);
  border-radius: 0px;
  padding: 16px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  animation: nudge-fade-in 0.8s ease-out;
}

.nudge-content h3 {
  color: var(--color-terracotta);
  font-size: var(--font-size-base);
  margin-bottom: 4px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nudge-content p {
  color: var(--text-muted);
  font-size: var(--font-size-base);
  line-height: 1.4;
}

.nudge-cta {
  background: var(--color-terracotta);
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 0px;
  font-size: var(--font-size-base);
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: var(--shadow-hard);
  transition: all 0.2s;
}

.nudge-cta:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hard);
}

@keyframes nudge-fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* MUR MASONRY VIEW MODES */
.mur-masonry {
  display: grid;
  gap: 24px;
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.mur-masonry.view-mode-grid {
  grid-template-columns: repeat(2, 1fr);
}

.mur-masonry.view-mode-single {
  grid-template-columns: 1fr;
  max-width: 800px;
}

.mur-masonry.view-mode-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (max-width: 768px) {
  .mur-masonry.view-mode-grid {
    grid-template-columns: repeat(2, 1fr);
    /* Manteniem 2 columnes en tauletes/mòbils grans */
  }
  .mur-masonry {
    gap: 12px;
    padding: 12px;
  }
}

@media (max-width: 768px) {
  .mur-masonry.view-mode-grid {
    /* [RESPONSIVE FIX] A la mínima que les targetes es degraden o el text s'ix del frame, passem a 1 columna per elegància i llegibilitat. */
    grid-template-columns: 1fr;
  }
  .mur-masonry {
    gap: 16px;
    padding: 16px 8px;
  }
}

@media (max-width: 480px) {
  .sovereign-nudge-box {
    flex-direction: column;
    text-align: center;
  }
}

/* Empty State Fix */
.feed-list:empty {
  display: none;
}



=====================================
FILE: src/components/ChatDetail.jsx
=====================================

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { useModal } from '../context/ModalContext';
import { iaiaService } from '../services/iaiaService';
import { supabaseService } from '../services/supabaseService';
import { supabase } from '../supabaseClient';
import { logger } from '../utils/logger';

import ChatMessageList from './chat/ChatMessageList';
import ChatInputArea from './chat/ChatInputArea';
import ChatHeader from './chat/ChatHeader';
import { useChatState } from '../hooks/useChatState';
import ChatMoveSelectorModal from './chat/ChatMoveSelectorModal';

const ChatDetail = () => {
    const { chatSettings } = useNavigation();
    const { id } = useParams();
    const { t } = useTranslation();
    const { user, impersonatedProfile, activeEntityId, isSuperAdmin, isGuest } = useAuth();
    const { setIsGuestInteractionModalOpen } = useModal();
    const location = useLocation();
    const navigate = useNavigate();

    // 1. Correcció de l'ID Aleatori Zombie (Grok Audit)
    const guestIdRef = useRef(`anon-${Math.random().toString(36).substr(2, 9)}`);
    const humanId = isSuperAdmin && impersonatedProfile ? impersonatedProfile.id : user?.id;
    const currentUserId = useMemo(() => user?.id || (user?.isAnonymous ? guestIdRef.current : 'guest'), [user?.id, user?.isAnonymous]);

    // 2. Extracció Total de l'Estat de Supabase 
    const { chat, realChatId, messages, setMessages, addMessage, loading } = useChatState({
        id, currentUserId, userIsAnonymous: user?.isAnonymous, readReceipts: chatSettings.readReceipts
    });

    // 3. Estat Local de la UI
    const [isHeaderSearchOpen, setIsHeaderSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
    const [contextMenuId, setContextMenuId] = useState(null);
    const [contextMenuPosition, setContextMenuPosition] = useState('up');
    const [isSending, setIsSending] = useState(false);
    
    // Nou estat pel Routing Visual de qualsevol missatge
    const [msgToMove, setMsgToMove] = useState(null);
    
    // Refs
    const isSendingRef = useRef(false);
    const isComponentMounted = useRef(true);

    const activeChatRef = useRef(realChatId);
    
    useEffect(() => {
        isComponentMounted.current = true;
        return () => { 
            isComponentMounted.current = false; 
            iaiaService.dispose();
        };
    }, []);

    useEffect(() => {
        activeChatRef.current = realChatId;
    }, [realChatId]);

    const isP1Current = chat?.participant_1_id === currentUserId;
    const otherInfo = useMemo(() => chat?.other_info || (isP1Current ? chat?.p2_info : chat?.p1_info), [chat, isP1Current]);

    // [PROTOCOL HANDOFF] Detecció de perfils estàtics sense motor IA (NPCs)
    const isIAIA = id.startsWith('11111111-') || otherInfo?.id?.startsWith('11111111-');
    const isNPC = !isIAIA && id && id.length < 32; // inst-1, grup-2, empresa-1, etc.

    // EXTREME AUDIT V4 FIX: handleSendMessage sense includes d'isSending per no rebentar ChatInputArea React.memo
    const handleSendMessage = useCallback(async ({ text, attachedFile, voiceData, onSuccess, onError }) => {
        if (user?.isAnonymous && !isIAIA) {
            setIsGuestInteractionModalOpen(true);
            return;
        }

        const isVoiceMessage = !!voiceData;
        const finalContent = text?.trim() || '';
        
        if (isSendingRef.current || (!finalContent && !attachedFile && !isVoiceMessage)) return;
        
        // Optimistic UI lock
        isSendingRef.current = true;
        setIsSending(true);

        // [PROTOCOL HANDOFF] Interceptació per a perfils estàtics (NPCs)
        if (isNPC) {
            import('../utils/toast').then(({ default: toastModule }) => {
                toastModule.custom(() => (
                    <div className="bg-theme-panel text-theme-text px-4 py-3 flex gap-4 items-center w-full max-w-sm border border-[var(--border-master)] shadow-xl pointer-events-auto rounded z-[999]">
                        <span className="text-sm font-medium opacity-90">🤖 Derivant la teua petició a la IAIA MarIA...</span>
                    </div>
                ), { duration: 3000 });
            });

            setTimeout(() => {
                if (isComponentMounted.current) {
                    navigate('/chats/11111111-1a1a-0000-0000-000000000000', { 
                        state: { 
                            autoForwardParams: {
                                text: `[Consulta sobre l'ens ${otherInfo?.name || 'Local'}]: ${finalContent}`,
                                attachedFile: attachedFile,
                                voiceData: voiceData
                            }
                        }
                    });
                }
            }, 1000);
            return;
        }

        // Els commands del solatge no processen imatges ni veu de moment.
        if (finalContent === '/solatge interact' && !isVoiceMessage) {
            iaiaService.simulateAgentDebate().catch(err => logger.error('[Solatge Interact]', err));
            addMessage({ id: `cmd-req-${Date.now()}`, sender_id: humanId, content: finalContent, created_at: new Date().toISOString() });
            addMessage({ id: `cmd-res-${Date.now()}`, sender_id: 'system', content: '⚙️ Bategat remot: Iniciant debat entre IAIAs...', created_at: new Date().toISOString() });
            setIsSending(false);
            isSendingRef.current = false;
            if (onSuccess) onSuccess();
            return;
        }
        
        let timerId;
        try {
            let fileUrl = null;
            if (isVoiceMessage && voiceData.blob) {
                const fileName = `voice-${Date.now()}-${humanId}.webm`;
                const { error: uploadError } = await supabase.storage.from('voice-messages').upload(fileName, voiceData.blob, { contentType: 'audio/webm' });
                if (uploadError) throw uploadError;
                const { data } = supabase.storage.from('voice-messages').getPublicUrl(fileName);
                fileUrl = data.publicUrl;
            } else if (attachedFile) {
                const extension = attachedFile.name.split('.').pop() || 'unknown';
                const fileName = `attach-${Date.now()}-${humanId}.${extension}`;
                const bucketName = attachedFile.type.startsWith('image/') ? 'images' : 'documents';
                const { error: uploadError } = await supabase.storage.from(bucketName).upload(fileName, attachedFile, { contentType: attachedFile.type });
                if (uploadError) throw uploadError;
                const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);
                fileUrl = data.publicUrl;
            }

            // AbortController exigit per l'auditoria Zombi
            const controller = new AbortController();
            timerId = setTimeout(() => controller.abort('NETWORK_TIMEOUT'), 12000);
            
            const payload = {
                conversationId: realChatId,
                senderId: humanId,
                senderEntityId: activeEntityId,
                content: finalContent || (isVoiceMessage ? '🎤 Missatge de veu' : ''),
                isGuest: user?.isAnonymous,
                attachmentUrl: fileUrl,
                attachmentType: isVoiceMessage ? 'voice' : (attachedFile ? (attachedFile.type.startsWith('image/') ? 'image' : 'file') : null),
                attachment_name: isVoiceMessage ? 'Nota de veu' : (attachedFile ? attachedFile.name : null),
                voice_meta: isVoiceMessage && voiceData.duration ? { duration: voiceData.duration } : null
            };

            const result = await supabaseService.sendSecureMessage(payload, controller.signal);
            
            if (timerId) clearTimeout(timerId);
            if (!result?.id) throw new Error('Fallada forçada per xarxa o timeout');

            if (!isComponentMounted.current) return; // DEEPSEEK V5.1 FINAL FIX

            addMessage(result);
            if (onSuccess) onSuccess(); // Netegem estat volatile del fill.

            if (isIAIA) {
                const textFinal = finalContent || (attachedFile ? '[L\'usuari t\' acaba d\'enviar un document o fotografia]' : '');
                const capturedChatId = realChatId; // EXTREM AUDIT V4: Race Condition Shield
                iaiaService.generateAIAResponse(realChatId, textFinal, otherInfo?.id || id, {
                    attachmentUrl: fileUrl,
                    attachmentType: isVoiceMessage ? 'voice' : (attachedFile ? (attachedFile.type.startsWith('image/') ? 'image' : 'file') : null),
                    onFinish: (finalMsg) => {
                        if (!isComponentMounted.current || activeChatRef.current !== capturedChatId) return;
                        if (finalMsg && typeof finalMsg === 'object') {
                            setMessages(prev => {
                                // Remove the filler
                                const withoutFiller = prev.filter(m => !m.metadata?.is_iaia_filler);
                                return [...withoutFiller, {
                                    ...finalMsg,
                                    id: finalMsg.id || `final-resp-${Date.now()}`,
                                    created_at: finalMsg.created_at || new Date().toISOString()
                                }];
                            });
                        }
                    }
                }).then(filler => {
                    if (!isComponentMounted.current || activeChatRef.current !== capturedChatId) return;
                    if (filler && typeof filler === 'object') addMessage(filler);
                }).catch(err => logger.error('[ChatDetail] Bug al motor d\'IAIA:', err));
            }

        } catch (err) {
            if (timerId) clearTimeout(timerId);
            if (!isComponentMounted.current) return; // DEEPSEEK V5 FIX: Zombie component state guard
            logger.error('Error enviant el missatge:', err);
            if (onError) onError();
        } finally {
            if (isComponentMounted.current) {
                setIsSending(false);
            }
            isSendingRef.current = false;
        }
    }, [id, otherInfo?.id, otherInfo?.name, isIAIA, isNPC, navigate, user?.isAnonymous, realChatId, humanId, activeEntityId, addMessage, setIsGuestInteractionModalOpen, setMessages]);

    // [PROTOCOL HANDOFF] Actuador: Execució automàtica del missatge des de la IAIA
    useEffect(() => {
        if (location.state?.autoForwardParams && id === '11111111-1a1a-0000-0000-000000000000') {
            const params = location.state.autoForwardParams;
            window.history.replaceState({}, document.title); // Netegem l'estat ràpidament
            
            setTimeout(() => {
                if (isComponentMounted.current && !isSendingRef.current) {
                    handleSendMessage({
                        text: params.text,
                        attachedFile: params.attachedFile,
                        voiceData: params.voiceData
                    });
                }
            }, 800);
        }
    }, [location.state, id, handleSendMessage]);

    const handleMoveMessageToAgent = useCallback(async (targetAgentId, messageId) => {
        const msgIndex = messages.findIndex(m => m.id === messageId);
        if (msgIndex === -1) return;
        const aiMsg = messages[msgIndex];

        let userMsg = null;
        for (let i = msgIndex - 1; i >= 0; i--) {
            if (!messages[i].is_ai && !messages[i].metadata?.is_iaia_filler) {
                userMsg = messages[i];
                break;
            }
        }

        const originalMessages = [...messages];
        const msgsToMove = userMsg ? [userMsg, aiMsg] : [aiMsg];
        setMessages(prev => prev.filter(m => !msgsToMove.find(mov => mov.id === m.id)));

        let undoTimeout;

        const performMove = async () => {
            try {
                if (user?.isAnonymous) {
                    const sourceKey = `sdp_guest_chat_${otherInfo?.id || id}`;
                    const targetKey = `sdp_guest_chat_${targetAgentId}`;
                    const currentStorage = JSON.parse(sessionStorage.getItem(sourceKey) || '[]');
                    const filteredSource = currentStorage.filter(m => !msgsToMove.find(mov => mov.id === m.id));
                    sessionStorage.setItem(sourceKey, JSON.stringify(filteredSource));

                    const targetStorage = JSON.parse(sessionStorage.getItem(targetKey) || '[]');
                    const newTargetMsgs = msgsToMove.map(m => ({...m, conversation_id: targetAgentId }));
                    sessionStorage.setItem(targetKey, JSON.stringify([...targetStorage, ...newTargetMsgs]));
                } else {
                    const targetConv = await supabaseService.getOrCreateConversation(currentUserId, 'user', targetAgentId, 'entity');
                    if (targetConv?.id) {
                        for (const m of msgsToMove) {
                            await supabase.from('messages').update({ conversation_id: targetConv.id }).eq('id', m.id);
                        }
                        window.dispatchEvent(new Event('chat_updated'));
                    }
                }
            } catch (err) {
                logger.error('[Move] Failure moving messages:', err);
                setMessages(originalMessages);
            }
        };

        const undoAction = () => {
            clearTimeout(undoTimeout);
            if (isComponentMounted.current) {
                setMessages(originalMessages);
            }
            if (user?.isAnonymous) {
                const sourceKey = `sdp_guest_chat_${otherInfo?.id || id}`;
                const targetKey = `sdp_guest_chat_${targetAgentId}`;
                const targetStorage = JSON.parse(sessionStorage.getItem(targetKey) || '[]');
                const revertedTarget = targetStorage.filter(m => !msgsToMove.find(mov => mov.id === m.id));
                sessionStorage.setItem(targetKey, JSON.stringify(revertedTarget));
                
                const sourceStorage = JSON.parse(sessionStorage.getItem(sourceKey) || '[]');
                sessionStorage.setItem(sourceKey, JSON.stringify([...sourceStorage, ...msgsToMove.map(m => ({...m, conversation_id: otherInfo?.id || id}))]));
            }
            navigate(`/chats/${otherInfo?.id || id}`, { replace: true });
        };

        import('../utils/toast').then(({ default: toastModule }) => {
            toastModule.custom((t) => (
                <div className="bg-theme-panel text-theme-text px-4 py-3 flex gap-4 items-center w-full max-w-sm border border-[var(--border-master)] shadow-xl pointer-events-auto rounded z-[999]">
                    <span className="text-sm font-medium opacity-90">📁 Mogut a l'expert local.</span>
                    <button 
                        onClick={() => { undoAction(); toastModule.dismiss(t.id); }} 
                        className="text-orange-500 text-sm font-black hover:underline px-2 py-1 bg-black/5 dark:bg-white/5 rounded transition-transform active:scale-95"
                    >
                        DESFER
                    </button>
                </div>
            ), { duration: 4000 });
        });

        undoTimeout = setTimeout(() => { performMove(); }, 4000);
        
        // Immediate visual relocation WOW effect
        navigate(`/chats/${targetAgentId}`, { state: { optimisticMessages: msgsToMove } });
    }, [messages, setMessages, user, id, otherInfo, currentUserId, navigate]);

    if (loading) return <div className="flex-1 bg-theme-base flex items-center justify-center"><Loader2 className="animate-spin text-[var(--theme-accent-primary)]" size={40} /></div>;

    return (
        <div className="chat-detail-container flex-1 flex flex-col min-h-0 relative" onClick={() => setContextMenuId(null)}>
            <div className="chat-list-scanlines" />
            
            {/* HEADER COMPACTE */}
            <ChatHeader 
                otherInfo={otherInfo}
                realChatId={realChatId}
                isHeaderSearchOpen={isHeaderSearchOpen}
                setIsHeaderSearchOpen={setIsHeaderSearchOpen}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isSettingsMenuOpen={isSettingsMenuOpen}
                setIsSettingsMenuOpen={setIsSettingsMenuOpen}
            />

            {/* CONTENIDOR VIRTUALITZAT + BATECS */}
            <div className="chat-split-view-container flex-1 flex min-h-0 bg-theme-base">
                <div className="chat-messages-panel flex-1 flex flex-col min-h-0 bg-theme-base relative">
                    
                    {/* BÀNNER TRANSPARÈNCIA NPC */}
                    {isNPC && (
                        <div className="bg-blue-100 dark:bg-blue-900/10 text-blue-800 dark:text-blue-300 text-[13px] px-4 py-2 border-b border-blue-200 dark:border-blue-800/30 text-center shadow-sm z-10 shrink-0">
                            <span className="font-bold">Perfil Delegat:</span> Aquest ens no té motor IA actiu. Els missatges es desviaran automàticament a la <strong className="underline">IAIA MarIA</strong> per a ser contestats.
                        </div>
                    )}

                    {/* BÀNNER PER FORASTERS */}
                    {isGuest && otherInfo?.id?.startsWith('11111111-') && (
                        <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 text-[15px] px-4 py-2.5 border-b border-orange-200 dark:border-orange-800/50 text-center shadow-sm z-10 shrink-0">
                            <span className="font-bold">{t('common.warning', 'Avís')}:</span> {t('chat.guest_warning_text')} {' '}
                            <a href="/registre" className="font-bold underline cursor-pointer">{t('chat.guest_warning_link', "Registra't per a guardar les converses.")}</a>
                        </div>
                    )}

                    {/* LLISTA DE MISSATGES (ARA VIRTUALITZADA AMB VIRTUOSO) */}
                    <ChatMessageList 
                        realChatId={realChatId}
                        messages={messages} 
                        setMessages={setMessages}
                        searchQuery={searchQuery} 
                        humanId={humanId} 
                        otherInfo={otherInfo} 
                        contextMenuId={contextMenuId} 
                        setContextMenuId={setContextMenuId} 
                        contextMenuPosition={contextMenuPosition} 
                        setContextMenuPosition={setContextMenuPosition} 
                        onMoveMessageToAgent={handleMoveMessageToAgent}
                        onRequestMove={setMsgToMove}
                    />

                    {/* AREA D'INPUT AMB COMPARTIMENTALITZACIÓ EXTREMA */}
                    <ChatInputArea 
                        humanId={humanId}
                        id={id}
                        otherInfo={otherInfo}
                        activeEntityId={activeEntityId}
                        user={user}
                        isGuestInteractionModalOpen={isGuest}
                        setIsGuestInteractionModalOpen={setIsGuestInteractionModalOpen}
                        handleSendMessage={handleSendMessage}
                        isSending={isSending}
                    />

                </div>
            </div>
            {/* SELECTOR D'EXPERT MODAL */}
            {msgToMove && (
                <ChatMoveSelectorModal 
                    msg={msgToMove}
                    onClose={() => setMsgToMove(null)}
                    onSelect={(targetId) => {
                        setMsgToMove(null);
                        handleMoveMessageToAgent(targetId, msgToMove.id);
                    }}
                />
            )}
        </div>
    );
};

export default ChatDetail;



=====================================
FILE: src/components/ChatDetail.css
=====================================

.chat-detail-container {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  display: flex !important;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: var(--bg-theme-base);
  position: relative;
  z-index: 10;
  overflow: hidden;
}

/* El main-viewport general per al chat ja no fa scroll global,
   el delegarem a .messages-list per poder tenir el input fix baix. */
.chat-main-viewport {
  overflow-y: hidden !important;
}

.chat-split-view-container {
  flex: 1 1 auto !important;
  display: flex !important;
  flex-direction: row !important; /* El bloc de notes va al costat */
  min-height: 0 !important;
  width: 100% !important;
  overflow: hidden !important;
  position: relative;
}

.chat-messages-panel {
  flex: 1 1 auto !important;
  display: flex !important;
  flex-direction: column !important;
  min-width: 0 !important;
  min-height: 0 !important;
  background: rgba(0, 0, 0, 0.1);
  overflow: hidden !important;
  position: relative;
  height: 100% !important; /* Add this to force internal expansion */
}

.messages-container {
  flex: 1 !important;
  overflow-y: auto !important;
  min-height: 0 !important;
  display: flex !important;
  flex-direction: column-reverse !important;
  padding: 1rem;
}

@media (min-width: 768px) {
  .messages-container {
    padding: 1.5rem;
  }
}

.chat-nav-bar {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 0 16px !important;
  background: var(--bg-theme-header) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  height: 64px !important;
  flex-shrink: 0 !important;
  z-index: 100 !important;
  color: var(--text-theme-text) !important;
}

.back-button {
  color: #fff !important;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.back-button:hover {
  opacity: 1;
}

.chat-input-area-new {
  position: relative;
  width: 100%;
  padding: 16px 20px 16px;
  background: var(--bg-theme-base);
  border-top: 1px solid var(--border-master);
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 1000;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.5);
  flex-shrink: 0;
}

@media (min-width: 1024px) {
  .chat-input-area-new {
    padding-bottom: calc(16px + env(safe-area-inset-bottom, 20px));
  }
}

.chat-header-main {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  flex: 1;
  height: 100%;
}

.chat-header-main.clickable {
  cursor: pointer;
}

.chat-header-avatar {
  width: 40px;
  height: 40px;
  border-radius: 0px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.chat-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0px;
  height: auto;
  margin-top: -3px;
}

.chat-name-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.chat-info h2 {
  font-size: 1.1rem;
  font-weight: var(--font-weight-bold);
  margin: 0;
  color: var(--text-main);
  font-family: var(--font-headline);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-info .status {
  font-size: 0.8rem;
  color: var(--text-muted);
  opacity: 0.8;
}

.chat-info .status::before {
  content: "";
  display: block;
  width: 8px;
  height: 8px;
  background: var(--text-muted);
  border-radius: var(--radius-full);
}

.chat-info .status.online {
  color: #10b981;
  opacity: 1;
}

.chat-info .status.online::before {
  background: #10b981;
  box-shadow: var(--shadow-hard);
}

.messages-list {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
  padding: var(--space-md);
  padding-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  background: transparent;
}

.message-row.wa-style {
  display: flex;
  flex-direction: column;
  padding: 2px 16px;
  gap: 0;
}

.message-row.wa-style.me {
  align-items: flex-end;
}

.message-row.wa-style.other {
  align-items: flex-start;
}

.wa-bubble {
  padding: 12px 16px;
  border-radius: var(--radius-s);
  /* 18px */
  max-width: 85%;
  position: relative;
  font-size: 17px;
  line-height: 1.5;
  word-break: break-word;
  border: 1px solid var(--border-subtle);
  backdrop-filter: blur(8px);
}

.wa-bubble.me {
  background: var(--sdp-terracotta);
  color: #000;
  align-self: flex-end;
  font-weight: 700;
  border-bottom-right-radius: 4px;
}

.wa-bubble.other {
  background: var(--surface-glass-heavy);
  color: var(--text-main);
  align-self: flex-start;
  box-shadow: var(--shadow-deep);
  border-bottom-left-radius: 4px;
}

.wa-sender-name {
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 2px;
  color: #128c7e;
}

.message-meta-wa {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  margin-top: -4px;
  height: 15px;
}

.wa-status {
  font-size: var(--font-size-base);
  color: #8696a0;
}

.wa-status.read {
  color: #53bdeb;
  /* WhatsApp Blue Check */
}

.wa-message-actions {
  position: absolute;
  top: 4px;
  right: 4px;
  background: transparent;
  border: none;
  color: #8696a0;
  opacity: 0;
  transition: opacity 0.2s;
  cursor: pointer;
}

.wa-bubble:hover .wa-message-actions {
  opacity: 1;
}

/* Background pattern vibe */
.messages-list {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-md);
  padding-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: transparent;
}

.message-avatar-container {
  width: 40px;
  height: 40px;
  border-radius: 0px;
  overflow: hidden;
  flex-shrink: 0;
  align-self: flex-end;
  background-color: var(--bg-card);
  border: 1px solid var(--color-border);
  margin-bottom: 2px;
  box-shadow: var(--shadow-hard);
}

.message-avatar-container img,
.message-avatar-container .avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-avatar-container .avatar-emoji {
  font-size: var(--font-size-base);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 0px;
  max-width: 85%;
  position: relative;
  box-shadow: var(--shadow-hard);
  font-size: 0.95rem;
  line-height: 1.5;
  width: fit-content;
  font-family: var(--font-body);
}

.message-bubble.me {
  background-color: var(--md-sys-color-primary-container);
  color: var(--md-sys-color-on-primary-container);
  border-bottom-right-radius: 4px;
}

.message-bubble.other {
  background-color: var(--md-sys-color-surface-variant);
  color: var(--md-sys-color-on-surface-variant);
  border-bottom-left-radius: 4px;
  border: 1px solid var(--md-sys-color-outline);
}

.thinking-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.thinking-timer {
  font-size: var(--font-size-base);
  color: #718096;
  font-style: italic;
  font-weight: var(--font-weight-bold);
}

.message-meta {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 4px;
  opacity: 0.7;
}

.message-time {
  font-size: var(--font-size-base);
}

.message-status {
  font-size: var(--font-size-base);
  line-height: 1;
}

/* AI / Badge styles */

.identity-badge {
  font-size: 9px;
  font-weight: 800;
  padding: 1px 6px;
  border-radius: 0px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1;
}

.identity-badge.ai {
  background: #ff6d23 !important;
  color: #000 !important;
  font-size: 10px !important;
  padding: 2px 8px !important;
  border-radius: 6px !important;
  font-weight: 950 !important;
  letter-spacing: 0.5px !important;
  box-shadow: 0 0 15px rgba(255, 109, 35, 0.4) !important;
  border: none !important;
}

.bubble-tag {
  font-size: var(--font-size-base);
  font-weight: 800;
  opacity: 0.6;
  letter-spacing: 0.05em;
}

.bubble-tag.ai {
  color: #10b981;
}

.ai-bubble {
  border-left: 4px solid #10b981;
}

.message-attachment {
  border-radius: 0px;
  overflow: hidden;
  margin-bottom: 4px;
}

.chat-image {
  max-width: 100%;
  max-height: 300px;
  object-fit: cover;
  display: block;
  cursor: pointer;
  border-radius: 0px !important;
  /* Llei del Zero Radius */
}

.chat-video {
  max-width: 100%;
  max-height: 300px;
  border-radius: 0px !important;
}

.attachment-link {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  background: rgba(0, 0, 0, 0.05);
  padding: var(--space-sm);
  border-radius: 0px;
  color: inherit;
  text-decoration: none;
  font-size: var(--font-size-base);
}

.me .attachment-link {
  background: rgba(255, 255, 255, 0.1);
}

/* NEW INPUT AREA */
.chat-input-area-new {
  position: relative;
  width: 100%;
  padding: 16px 20px calc(16px + env(safe-area-inset-bottom, 20px));
  background: var(--bg-theme-base) !important;
  border-top: 1px solid var(--border-master);
  display: flex !important;
  flex-direction: column;
  gap: 8px;
  z-index: 1000;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.5);
  flex-shrink: 0 !important;
}

@media (max-width: 768px) {
  .chat-detail-container {
    height: 100%; /* Forçat per flex parent */
  }
}

/* [NEW] Multiple Attachments Preview */
.iaia-transparency-notice {
  padding: 10px 16px;
  background: linear-gradient(
    135deg,
    rgba(212, 65, 229, 0.1) 0%,
    rgba(93, 95, 239, 0.05) 100%
  );
  border-bottom: 1px solid rgba(212, 65, 229, 0.2);
  position: sticky;
  top: 0;
  z-index: 90;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  overflow: hidden;
  /* Evita que qualsevol fill sobresurten */
}

.iaia-transparency-notice .banner-content {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 100%;
  margin: 0 auto;
  cursor: pointer;
  transition: all 0.2s ease;
}

.attachments-preview-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0px;
  margin-bottom: 8px;
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.attachment-preview {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--glass-bg);
  padding: 6px 12px;
  border-radius: 0px;
  font-size: 0.85rem;
  color: var(--text-primary);
  border: 1px solid var(--primary-color);
  animation: fadeIn 0.3s ease;
}

.attachment-preview .file-name {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.clear-attachment {
  background: none;
  border: none;
  color: var(--error-color, #ff4d4d);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.clear-attachment:hover {
  transform: scale(1.2);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-input-form-new {
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
  /* Align with input bottom */
  position: relative;
}

/* Storage Mini Bar */
.storage-mini-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0.75rem;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 0px;
  font-size: 0.75rem;
  color: #64748b;
}

/* Refined Storage Banner */
.storage-warning-banner {
  background: #f0f9ff;
  border-bottom: 1px solid #bae6fd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  font-size: var(--font-size-base);
  color: #0369a1;
  cursor: pointer;
  transition: background 0.2s;
}

.storage-warning-banner:hover {
  background: #e0f2fe;
}

.storage-progress-container {
  flex: 1;
  margin: 0 12px;
  background: #e0f2fe;
  height: 6px;
  border-radius: 0px;
  overflow: hidden;
}

.storage-progress-bar {
  height: 100%;
  background: #0ea5e9;
  transition: width 0.3s ease;
}

.storage-info-mini {
  display: flex;
  gap: 0.5rem;
  white-space: nowrap;
}

.storage-label {
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.storage-progress {
  flex: 1;
  height: 6px;
  background: #e2e8f0;
  border-radius: 0px;
  overflow: hidden;
}

.storage-progress-fill {
  height: 100%;
  background: var(--color-primary);
  transition: width 0.3s ease;
}

.storage-mini-bar.critical .storage-progress-fill {
  background: #ef4444;
}

.storage-info-trigger {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: help;
  padding: 0;
  display: flex;
  align-items: center;
}

.input-actions-left {
  padding-bottom: 2px;
}

.attachment-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: #64748b;
  cursor: pointer;
  border-radius: 0px;
  transition: all 0.2s;
  background: #f1f5f9;
}

.attachment-trigger:hover {
  background: #e2e8f0;
  color: var(--color-primary);
}

.input-main-area-wa {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mas-chat-input-wrapper {
  display: flex;
  align-items: center;
  background: var(--surface-glass-heavy);
  border-radius: var(--radius-m);
  padding: 2px 8px;
  box-shadow: var(--shadow-deep);
  border: 1px solid var(--border-subtle);
}

.wa-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: #8696a0;
  cursor: pointer;
  background: transparent;
  border: none;
  transition: color 0.2s;
}

.wa-action-btn:hover {
  color: #54656f;
}

.wa-clip-icon {
  transform: rotate(45deg);
}

.mas-chat-input-wrapper input {
  flex: 1 !important;
  border: none !important;
  background: transparent !important;
  padding: 10px 8px !important;
  font-size: 1rem;
  color: var(--text-main);
  outline: none !important;
}

.mas-chat-input-wrapper input::placeholder {
  color: var(--text-muted);
  opacity: 0.6;
}

/* Clearer Attachment Feedback */
.wa-attachments-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 12px;
  background: #f0f2f5;
  border-radius: 0px;
  border-left: 4px solid #128c7e;
  animation: wa-slide-up 0.2s ease-out;
}

@keyframes wa-slide-up {
  from {
    transform: translateY(10px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.wa-attachment-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  background: white;
  padding: 4px 10px;
  border-radius: 0px;
  font-size: 0.8rem;
  color: #54656f;
  box-shadow: var(--shadow-hard);
  border: 1px solid #d1d7db;
}

.wa-tag-icon {
  color: #128c7e;
  display: flex;
}

.wa-tag-name {
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wa-tag-remove {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 2px;
  display: flex;
  opacity: 0.7;
}

.wa-tag-remove:hover {
  opacity: 1;
}

.wa-attachments-count {
  width: 100%;
  font-size: 0.75rem;
  color: #128c7e;
  font-weight: var(--font-weight-bold);
  margin-top: 2px;
}

.chat-input-form-new input[type="text"] {
  width: 100%;
  padding: 12px 20px;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-m);
  font-size: 1rem;
  transition: all 0.2s;
  background: var(--surface-glass-heavy);
  color: var(--text-main);
}

/* Emoji Picker Constrain */
.emoji-picker-container {
  max-height: 40vh; /* Don't take up more than 40% of viewport on mobile */
  overflow: hidden;
}

@media (max-height: 600px) {
  .emoji-picker-container {
    max-height: 300px;
  }
}


.chat-input-form-new input:focus {
  border-color: var(--md-sys-color-primary);
  background: var(--md-sys-color-surface);
  box-shadow: var(--shadow-hard);
}

.attachment-preview {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 0px;
  font-size: 0.85rem;
  color: var(--color-primary);
  max-width: 100%;
  animation: fadeInDown 0.2s ease-out;
}

.file-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: var(--font-weight-bold);
}

.clear-attachment {
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 1.25rem;
  cursor: pointer;
  line-height: 1;
}

.send-button-new {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-accent);
  /* Orange Foc */
  color: #000;
  border: var(--border-master);
  border-radius: 0px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  box-shadow: var(--shadow-hard);
}

.send-button-new:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hard);
}

.send-button-new:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
  box-shadow: var(--shadow-hard);
}

/* IAIA Transparency Notice Refined - Premium Rural-Tech Audit */
/* MArIA Transparency Notice - Premium WhatsApp-Style "System Message" */
.iaia-transparency-notice {
  padding: 8px var(--page-margin);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
  background: transparent;
  width: 100%;
}

.iaia-transparency-notice .banner-content {
  background: var(--surface-glass-heavy);
  border: 1px solid var(--accent-orange);
  padding: 8px 12px;
  border-radius: var(--radius-m);
  max-width: 500px;
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  box-shadow: var(--shadow-hard);
  cursor: pointer;
  transition: all 0.2s ease;
}

.iaia-transparency-notice .banner-content:hover {
  background: #fffdfa;
  border-color: #f6ad55;
  transform: translateY(-1px);
}

.iaia-transparency-notice .iaia-icon {
  font-size: 1.4rem;
  width: 32px;
  height: 32px;
  background: white;
  border-radius: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: var(--shadow-hard);
}

.iaia-transparency-notice .banner-text-stack {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  /* Take remaining space */
}

.iaia-transparency-notice .banner-label {
  color: #c05621;
  font-size: var(--font-size-base);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  line-height: 1.2;
}

.iaia-transparency-notice .banner-persona-name {
  font-size: var(--font-size-base);
  font-weight: 550;
  line-height: 1.5;
  color: #2d3748;
  word-break: break-word;
  /* Safety first */
}

/* Storage Modal Premium Styles */
.storage-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: var(--space-lg);
  animation: fadeIn 0.2s ease-out;
}

.storage-modal-content {
  background: white;
  width: 100%;
  max-width: 400px;
  border-radius: 0px;
  box-shadow: var(--shadow-hard);
  overflow: hidden;
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.storage-modal-header {
  padding: 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
}

.storage-header-icon {
  width: 48px;
  height: 48px;
  background: #eff6ff;
  border-radius: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.storage-header-text h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
}

.storage-header-text p {
  margin: 0;
  font-size: 0.8rem;
  color: #64748b;
  font-weight: var(--font-weight-bold);
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.5rem;
}

.storage-modal-body {
  padding: 1.5rem;
}

.storage-info-card {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 0px;
  margin-bottom: 1.5rem;
}

.storage-info-card .info-icon {
  color: var(--color-primary);
  flex-shrink: 0;
}

.storage-info-card p {
  margin: 0;
  font-size: 0.9rem;
  color: #1e40af;
  line-height: 1.5;
}

.storage-rules {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.rule-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: #475569;
}

.rule-item::before {
  content: "✓";
  color: #10b981;
  font-weight: bold;
}

.storage-warning-footer {
  padding-top: 1rem;
  border-top: 1px dashed #e2e8f0;
}

.storage-warning-footer p {
  margin: 0;
  font-size: 0.75rem;
  color: #94a3b8;
  font-style: italic;
  line-height: 1.4;
}

.storage-modal-confirm {
  width: 100%;
  padding: 1.25rem;
  background: var(--color-primary);
  color: white;
  border: none;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.storage-modal-confirm:hover {
  background: #1d4ed8;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Thinking Dots Animation */
.thinking-bubble {
  background-color: var(--bg-surface) !important;
  border: 1px solid #e2e8f0;
  padding: 0.8rem 1rem !important;
  min-width: 60px;
}

.thinking-dots {
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
  height: 12px;
}

.thinking-dots span {
  width: 6px;
  height: 6px;
  background-color: #94a3b8;
  border-radius: 0px;
  display: inline-block;
  animation: thinking-bounce 1.4s infinite ease-in-out both;
}

.thinking-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.thinking-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes thinking-bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
    opacity: 0.3;
  }

  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Emoji Picker Styles */
.emoji-picker-wrapper {
  position: absolute;
  bottom: 100%;
  left: 0;
  width: 100%;
  z-index: 50;
  box-shadow: var(--shadow-hard);
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  overflow: hidden;
  background: white;
}

.close-emoji-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 60;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 0px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.emoji-picker-wrapper .EmojiPickerReact {
  border: none !important;
  font-family: var(--font-body) !important;
}

.emoji-picker-wrapper .epr-emoji-category-label {
  font-family: var(--font-heading) !important;
  font-weight: 700 !important;
}

.attachment-trigger.active {
  color: var(--color-primary);
  background: #e0f2fe;
}

/* [NEW] Copy Button for Bubbles */
.copy-bubble-btn {
  background: transparent;
  border: none;
  color: inherit;
  opacity: 0.3;
  padding: 2px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message-bubble:hover .copy-bubble-btn {
  opacity: 0.8;
}

.copy-bubble-btn:hover {
  opacity: 1 !important;
  transform: scale(1.2);
  color: var(--color-teal);
}

/* [NEW] IAIA Magic Button in Chat Input */
.iaia-magic-btn {
  color: var(--color-teal) !important;
  opacity: 0.7;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.iaia-magic-btn:hover {
  opacity: 1;
  transform: scale(1.1) rotate(10deg);
}

.iaia-magic-btn.thinking {
  animation: iaia-pulse 1.5s infinite;
  color: var(--color-primary) !important;
}

@keyframes iaia-pulse {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }

  50% {
    transform: scale(1.2);
    opacity: 1;
  }

  100% {
    transform: scale(1);
    opacity: 0.7;
  }
}

/* Ensure whatsapp-input-wrapper has space for the extra button */
.mas-chat-input-wrapper {
  padding-right: 4px;
}



=====================================
FILE: src/index.css
=====================================

@import "tailwindcss";

/* 🏺 SÓC DE POBLE: LA BÍBLIA VISUAL v10.33.2-CANÒNIC [PROTOCOL NOTO]
   Aquest fitxer és el ciment únic. 
*/
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --font-sans: "Noto Sans", ui-sans-serif, system-ui, sans-serif,
    "Noto Color Emoji", "Noto Emoji";
  --font-serif: "Noto Sans", serif, "Noto Color Emoji", "Noto Emoji";
  --font-mono: "Noto Sans", monospace, "Noto Color Emoji", "Noto Emoji";
  --font-condensed: "Noto Sans", sans-serif, "Noto Color Emoji", "Noto Emoji";

  /* M3 ADAPTIVE TOKENS - SÓC DE POBLE OFFICIAL */
  --color-primary: #f97316; /* Terracotta (Primary) */
  --color-on-primary: #ffffff;
  --color-primary-container: rgba(249, 115, 22, 0.15);

  --color-secondary: #06b6d4; /* Cyan (Secondary) */
  --color-on-secondary: #000000;
  --color-secondary-container: rgba(6, 182, 212, 0.15);

  --color-surface: #000000;
  --color-on-surface: #ffffff;
  --color-surface-container: rgba(0, 0, 0, 0.7); /* Standard Glass */
  --color-outline: rgba(255, 255, 255, 0.08);

  --radius-m3-large: 28px;
  --radius-m3-medium: 100px; /* Full Rounded / Pill */
  --radius-m3-small: 16px;

  --radius-genesis: var(--radius-m3-large);
  --radius-tactile: var(--radius-m3-small);

  --spacing-header: 56px;
  --spacing-sidebar: 280px;

  --touch-target: 44px;

  /* Gradients Canònics v15 */
  --gradient-bategat: linear-gradient(
    135deg,
    #ff6b00 0%,
    #0ea5e9 100%
  ); /* Orange to Sky Blue */
}

:root {
  /* [SISTEMA DE CAPES Z-INDEX - CANÒNIC v15] */
  --z-base: 1;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-overlay: 300;
  --z-sidebar: 400;
  --z-modal: 500;
  --z-toast: 600;
  --z-max: 999;

  /* [PROTOCOL GÈNESI v10.26.0 - CANÒNIC] */
  --bg-app: #000000;
  --bg-master: #000000;
  --bg-panel: #000000;
  --bg-sidebar: #000000;
  --text-main: #ffffff;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;
  --border-master: rgba(255, 255, 255, 0.08);

  /* Hover & Active states */
  --hover-overlay: rgba(255, 255, 255, 0.08);
  --active-overlay: rgba(255, 255, 255, 0.12);

  /* [MAESTRO RULE] Night/Dark Colors */
  --sdp-black: #000000;
  --sdp-white: #ffffff;
  --sdp-orange: #ff6b00;
  --sdp-blue: #0984e3;

  --theme-accent-primary: #0984e3; /* Blau a Nit */
  --on-theme-accent-primary: #ffffff; /* Contrast blanc per llegibilitat al fosc */
  --theme-accent-primary-muted: rgba(9, 132, 227, 0.4);
  --theme-accent-primary-faint: rgba(9, 132, 227, 0.1);

  --theme-accent-secondary: #ff6b00; /* Taronja a Nit */
  --theme-accent-secondary-muted: rgba(255, 107, 0, 0.4);
  --theme-accent-secondary-faint: rgba(255, 107, 0, 0.1);

  --bg-theme-base: var(--bg-app);
  --bg-theme-sidebar: #000000;
  --bg-theme-panel: #000000;
  --text-theme-text: #ffffff;
  --bg-theme-header: #000000;

  /* [FASE 2: GLASSMORPHISM] Night Mode Tokens */
  --glass-bg-dark: rgba(28, 28, 30, 0.65);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  --glass-blur: blur(16px);
  --glass-theme-bg: var(--glass-bg-dark);
}

:root.light {
  /* [PALETA CANÒNICA INVERSA - LLEI 4 COLORS] */
  --bg-app: #f8fafc; /* Blanc/Llum */
  --bg-master: #ffffff;
  --bg-panel: #ffffff;
  --bg-sidebar: #ffffff; /* SENSE TERRACOTTA */
  --text-main: #000000;
  --text-secondary: #000000;
  --text-muted: #4b5563;
  --border-master: rgba(0, 0, 0, 0.1);

  /* Hover & Active states */
  --hover-overlay: rgba(0, 0, 0, 0.05);
  --active-overlay: rgba(0, 0, 0, 0.08);

  /* Inversió de Variables Directes */
  --sdp-black: #ffffff;
  --sdp-white: #000000;
  --sdp-orange: #0984e3; /* Taronja => Blau */
  --sdp-blue: #ff6b00; /* Blau => Taronja */

  --theme-accent-primary: #ff6b00; /* Taronja de Dia */
  --on-theme-accent-primary: #111827; /* Negre profund per màxim contrast Taronja */
  --theme-accent-primary-muted: rgba(255, 107, 0, 0.4);
  --theme-accent-primary-faint: rgba(255, 107, 0, 0.1);

  --theme-accent-secondary: #0984e3; /* Blau de Dia */
  --theme-accent-secondary-muted: rgba(9, 132, 227, 0.4);
  --theme-accent-secondary-faint: rgba(9, 132, 227, 0.1);

  --bg-theme-base: var(--bg-app);
  --bg-theme-sidebar: #000000; /* CORREGIT: Barra lateral NEGRA en Mode Clar per decisió de disseny */
  --bg-theme-panel: var(--bg-panel);
  --text-theme-text: #000000;
  --bg-theme-header: #ffffff; /* CORREGIT: Header clar en Mode Clar */

  /* [FASE 2: GLASSMORPHISM] Day Mode Tokens */
  --glass-bg-light: rgba(255, 255, 255, 0.7);
  --glass-border: rgba(0, 0, 0, 0.1);
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
  --glass-blur: blur(16px);
  --glass-theme-bg: var(--glass-bg-light);
}

.text-on-accent {
  color: var(--on-theme-accent-primary) !important;
}

.text-on-accent-muted {
  color: var(--on-theme-accent-primary) !important;
  opacity: 0.85;
}

/* Redundant custom theme utility classes removed as per Audit 2.1 (Tailwind handles them via @theme) */

.card,
.universal-card,
.bg-panel {
  border-radius: var(--radius-genesis) !important;
  overflow: hidden;
}

/* [FASE 2: GLASSMORPHISM] Universal Class */
.glass-panel {
  background: var(--glass-theme-bg) !important;
  backdrop-filter: var(--glass-blur) !important;
  -webkit-backdrop-filter: var(--glass-blur) !important;
  border: 1px solid var(--glass-border) !important;
  box-shadow: var(--glass-shadow);
  border-radius: var(--radius-genesis);
  overflow: hidden;
  transition: background 0.3s ease, border-color 0.3s ease;
}

.modal-content,
.dialog-panel {
  border-radius: var(--radius-genesis) !important;
}

/* 📱 COMPORTAMENT TÀCTIL NATIU (v10.30.0 BLUEPRINT) */
html,
body,
#root {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  background-color: var(--bg-app);
  overflow: hidden;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

body {
  touch-action: pan-x pan-y;
  -webkit-tap-highlight-color: transparent;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: var(--font-sans);
  font-stretch: 75%; /* Equivalent exacte al disseny "Condensed" (62.5% = Extra Condensed, 100% = Normal) */
  font-size: 1.25rem; /* [ACCESSIBILITAT SUPREMA v15] Augmentat per a llegibilitat imponent */
  font-display: swap;
}

/* [ACCESSIBILITAT MESTRA] Regla global per a paràgrafs bategats */
p {
  font-size: 1.15rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

/* 🧬 ESTRUCTURA SUPREMA (PROTOCOL TABULA RASA v10.30.0) */
.main-viewport {
  flex: 1;
  display: flex;
  position: relative;
  min-width: 0;
}

.flex-container-safe {
  display: flex;
  min-width: 0;
  flex: 1;
}

/* 📱 RESPONSIVE CANÒNIC (Strict Monocolumn < 1024px) */
@media (max-width: 1023px) {
  .sidebar-desktop {
    position: fixed;
    left: 0;
    top: var(--spacing-header, 56px);
    z-index: 1000;
    width: var(--spacing-sidebar);
    height: calc(100vh - var(--spacing-header, 56px));
    transform: translateX(-100%);
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    background: #000000;
  }

  .sidebar-desktop.drawer-open {
    transform: translateX(0);
    box-shadow: 20px 0 60px rgba(0, 0, 0, 0.8);
  }

  /* Backdrop Master */
  .drawer-backdrop {
    position: fixed;
    top: 56px;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: none;
    z-index: 1000;
    animation: fade-in 0.3s ease-out;
  }

  .safe-area-padding {
    padding-top: env(safe-area-inset-top, 0px);
    padding-bottom: env(safe-area-inset-bottom, 0px);
    padding-left: max(20px, env(safe-area-inset-left));
    padding-right: max(20px, env(safe-area-inset-right));
  }

  /* Toxic mobile override deleted and Ghost exorcised */
}

/* 🧬 ANIMACIONS CANÒNIQUES (BATEGAT UNIVERSAL) */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes pulse-soft {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(0.98);
  }
}

.animate-in.fade-in {
  animation: fade-in 0.5s ease-out forwards;
}

.animate-slide-up {
  animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.bategant {
  animation: pulse-soft 2s infinite ease-in-out;
}

/* 📜 THE ANTIGRAVITY SCROLL v1.0 (SILK SCROLL) */
/* [MODERN SCROLLBARS v10.33.7] */
* {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.05) transparent;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  border: 2px solid transparent;
  background-clip: padding-box;
  transition: all 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 107, 0, 0.4);
  background-clip: padding-box;
}

/* Utility to hide scrollbar but keep functionality */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 📜 BÍBLIA: TACTILE GEOMETRY (GEOMETRIA DEL TACTE v10.33.2-CANÒNIC) */
.tactile-target {
  min-height: var(--touch-target);
  min-width: var(--touch-target);
  display: flex;
  align-items: center;
  justify-content: center;
}

.genesis-radius {
  border-radius: 28px !important;
}

.card-radius {
  border-radius: var(--radius-genesis) !important;
}

/* Unified Glassmorphism */
.glass-master {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom, 20px) !important;
}

.safe-area-top {
  padding-top: env(safe-area-inset-top, 0) !important;
}

/* [MASTER CANONIC BUTTONS] Design System GEM MODERN v1.0 */
/* Botó Connectar Canònic (UniversalCard) */
.btn-connect-canonic {
  font-weight: 900 !important;
  text-transform: uppercase !important;
  font-size: 14px;
  height: 40px;
  padding: 0 16px;
  border-radius: 28px;
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--theme-accent-secondary);
  color: #111827;
  transition: background-color 0.3s ease, transform 0.1s;
}
.btn-connect-canonic:hover {
  background-color: #ea580c;
  cursor: pointer;
}
.btn-connect-canonic:active {
  transform: scale(0.95);
}

.master-button-canonic {
  height: 44px !important;
  border-radius: 22px !important;
  font-weight: 900 !important;
  letter-spacing: 0.05em !important;
  text-transform: uppercase !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0 24px !important;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.master-button-canonic:active {
  transform: scale(0.95);
}

/* [NOTION-DYNAMICS] Folder styling for high-accessibility organization */
.notion-folder {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.notion-folder:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  border-color: rgba(255, 107, 0, 0.2);
}

.notion-folder .folder-icon {
  font-size: 32px;
  color: #ff6b00;
  margin-bottom: 4px;
}

.notion-folder .folder-title {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.notion-folder .folder-description {
  font-size: 1.1rem;
  color: #64748b;
  line-height: 1.5;
}

/* [NOTION-GRID] 28px geometry inspired grid */
.notion-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 28px;
}


/* --- UNIVERSAL SCROLLBAR --- */
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(150, 150, 150, 0.4); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: var(--theme-accent-primary, #f97316); }



