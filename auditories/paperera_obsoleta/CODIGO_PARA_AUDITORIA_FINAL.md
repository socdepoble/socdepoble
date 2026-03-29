=== CODI FONT PER A AUDITORIA EXTREMA (Sollutia / Copilot / ChatGPT) ===



--- INICI FITXER: src/App.jsx ---

import React, { useEffect, useCallback } from 'react';
import AppLayout from './components/AppLayout';
import { iaiaService } from './services/iaiaService';
import GlobalModals from './components/GlobalModals';
import './index.css';
import { errorTrackingService } from './services/errorTrackingService';
import { healthCheckService } from './services/healthCheckService';
import { logger } from './utils/logger';

// [Noves Portes / Cimentació Mestre]
import ErrorBoundary from './components/ErrorBoundary';
import LocalFirstGate from './components/gates/LocalFirstGate';
import AuthGate from './components/gates/AuthGate';
import OfflineGate from './components/gates/OfflineGate';

/**
 * 🏺 LA BÍBLIA ESTRUCTURAL (App.jsx) - BLINDATGE v2.0
 * Aquest fitxer conté la cimentació mestre orquestrant l'estat i les portes d'entrada.
 * FORÇAT: Fons Negre, Arquitectura de Ferro, Local First, Zero Fantasmes.
 */
const App = () => {
    // [MONITORING] Inicialitzar error tracking
    useEffect(() => {
        let isMounted = true;
        const initializeMonitoring = async () => {
            try {
                await errorTrackingService.initialize();
                if (isMounted) logger.log('[App] Error tracking initialized');
            } catch (error) {
                if (isMounted) logger.error('[App] Failed to initialize error tracking:', error);
            }
        };

        initializeMonitoring();
        return () => { isMounted = false; };
    }, []);

    // [MONITORING] Iniciar health checks
    useEffect(() => {
        healthCheckService.startMonitoring();
        
        const unsubscribe = healthCheckService.subscribe((health) => {
            if (health.overall !== 'healthy') {
                logger.warn('[App] Health check warning:', health);
                errorTrackingService.captureException(
                    new Error(`Health check: ${health.overall}`),
                    { health }
                );
            }
        });

        return () => {
            healthCheckService.stopMonitoring();
            unsubscribe();
        };
    }, []);

    // [ERROR] Global error handlers refactoritzats
    const handleError = useCallback((event) => {
        errorTrackingService.captureException(event.error || event.message, {
            type: 'global',
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
        });
    }, []);

    const handleUnhandledRejection = useCallback((event) => {
        errorTrackingService.captureException(event.reason, {
            type: 'unhandledrejection'
        });
    }, []);

    useEffect(() => {
        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleUnhandledRejection);

        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        };
    }, [handleError, handleUnhandledRejection]);

    useEffect(() => {
        return () => {
            iaiaService.dispose();
        };
    }, []);

    return (
        <ErrorBoundary fallbackMessage="Excepció Nuclear Detectada al Mas.">
            <OfflineGate>
                <LocalFirstGate>
                    <AuthGate>
                        <AppLayout />
                        <GlobalModals />
                    </AuthGate>
                </LocalFirstGate>
            </OfflineGate>
        </ErrorBoundary>
    );
};

export default App;


--- FI FITXER: src/App.jsx ---



--- INICI FITXER: src/entry.jsx ---

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
// import "./service-worker-manager"; // DESACTIVAT - Sóc de Poble PWA Failsafe

// --- [FAILSAFE PROTOCOL v3] FORÇAR DES-REGISTRE DE SERVICE WORKERS ANTICS ---
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
      console.warn("Failsafe: ServiceWorker eliminat forçosament per trencar el cicle de memòria cau.");
    }
  });
}
// -----------------------------------------------------------------------------
import "./design-system/tokens.css";
import "./i18n/config";
import { AuthProvider } from "./context/AuthContext";
import { ModalProvider } from "./context/ModalContext";
import { DesignProvider } from "./context/DesignContext";
import { NavigationProvider } from "./context/NavigationContext";
import { SocialProvider } from "./context/SocialContext";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';

import UnifiedStatus from "./components/UnifiedStatus";
import SafeShell from "./components/SafeShell";
import VersionGatekeeper from "./components/VersionGatekeeper";
import { APP_VERSION } from "./constants";
import { checkSilence } from "./utils/logger";

// 1. SILENT BOOT (Master Silence)
// No log noise in production.
// Global Error Handlers (Silent in Production)
window.onerror = (msg, src, lineno, colno, err) => {
  if (checkSilence(msg) || checkSilence(err)) return true;
  if (import.meta.env.DEV) console.error(`[FATAL] ${msg} at ${src}:${lineno}`);
};

// [FAILSAFE PROTOCOL] Capturar i silenciar l'error de Supabase JS "Refresh Token Not Found"
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.name === 'AuthApiError' && event.reason.message && event.reason.message.includes('Refresh Token')) {
    console.warn('[BATEGAT SAFETY] Sessió caducada silenciosament (Refresh Token). Supabase gestionarà la sortida.');
    event.preventDefault(); // Evita que l'error trenque la consola en roig
  }
});

// Console Noise Suppression
const originalWarn = console.warn;
const originalError = console.error;
const isNoise = (args) => args.some((arg) => checkSilence(arg));

console.warn = (...args) => { if (!isNoise(args)) originalWarn.apply(console, args); };
console.error = (...args) => { if (!isNoise(args)) originalError.apply(console, args); };



import { I18nProvider } from "./context/I18nContext";
import { ToastProvider } from "./components/ToastProvider";
import { ThemeProvider } from "./context/ThemeContext";

const CURRENT_MASTER_VERSION = APP_VERSION;

// Simplified Version Gatekeeper
// [RESILIENT VERSION GATEKEEPER] Protocol de Prevenció de Bucles
const savedVersion = localStorage.getItem("sp_app_version");
const lastReload = parseInt(localStorage.getItem("sp_last_version_reload") || "0");
const now = Date.now();

if (savedVersion && savedVersion !== CURRENT_MASTER_VERSION) {
    // [RESILIENT UPDATE] Si hem intentat recarregar en els últims 30 segons i seguim igual, STOP.
    // Augmentem el llindar perquè en algunes xarxes el reload triga més.
    if (now - lastReload < 60000) { 
        // Silenciat per a desenvolupament per petició de l'usuari
        // if (import.meta.env.DEV) console.warn('[BATEGAT SAFETY] Bucle de redirecció detectat. Aturant actualització forçada.');
        localStorage.setItem("sp_app_version", CURRENT_MASTER_VERSION);
    } else {
        // if (import.meta.env.DEV) console.log('[BATEGAT UPDATE] Versió desfasada detectada. Sincronitzant el Mas...');
        localStorage.setItem("sp_last_version_reload", now.toString());
        localStorage.setItem("sp_app_version", CURRENT_MASTER_VERSION);
        window.location.reload();
    }
} else if (!savedVersion) {
    localStorage.setItem("sp_app_version", CURRENT_MASTER_VERSION);
}

const container = document.getElementById("root");
if (!window.__SDP_ROOT__) window.__SDP_ROOT__ = ReactDOM.createRoot(container);

window.__SDP_ROOT__.render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
      <I18nProvider>
        <ThemeProvider>
          <AuthProvider>
            <SocialProvider>
              <DesignProvider>
                <NavigationProvider>
                  <ModalProvider>
                    <ToastProvider>
                      <VersionGatekeeper>
                        <SafeShell>
                          <App />
                        </SafeShell>
                      </VersionGatekeeper>
                    </ToastProvider>
                  </ModalProvider>
                </NavigationProvider>
              </DesignProvider>
            </SocialProvider>
          </AuthProvider>
        </ThemeProvider>
      </I18nProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

// Signalejar al Failsafe de index.html que hem arrancat amb èxit
window.__SDP_ROOT_MOUNTED = true;



--- FI FITXER: src/entry.jsx ---



--- INICI FITXER: src/context/AuthContext.jsx ---

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

                profileData = await profileHealingService.healGhostProfile(session, profileData, isSimulation);
                const { effectiveProfile, isOfficialCreator } = profileHealingService.protectMasterIdentity(session, profileData);

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


--- FI FITXER: src/context/AuthContext.jsx ---



--- INICI FITXER: src/services/supabaseService.js ---

import { supabase } from '../supabaseClient';
import { logger } from '../utils/logger';
import { DEMO_USER_ID, ROLES, USER_ROLES, ENABLE_MOCKS, CREATOR_EMAILS } from '../constants';
import { PostSchema, MarketItemSchema, MessageSchema, ProfileSchema, ConversationSchema } from './schemas';
import { MOCK_LORE_POSTS, MOCK_LORE_ITEMS } from '../data/mockLoreData';
import { pushNotifications } from './pushNotifications';

/**
 * Helper for time-aware greetings
 */
const getTimeAwareGreeting = (lang = 'va') => {
    const hour = new Date().getHours();
    if (lang === 'es') {
        if (hour >= 6 && hour < 14) return "¡Buenos días!";
        if (hour >= 14 && hour < 20) return "¡Buenas tardes!";
        return "¡Buenas noches!";
    } else { // Valencian/Default
        if (hour >= 6 && hour < 14) return "Bon dia!";
        if (hour >= 14 && hour < 20) return "Bona vesprada!";
        return "Bona nit!";
    }
};

/**
 * Sanitizes input strings to prevent common injection patterns 
 * and remove potentially dangerous characters.
 */
const sanitizeInput = (text) => {
    if (typeof text !== 'string') return '';
    // Remove characters often used in SQL injection or HTML injection
    // Keep letters (any lang), numbers, spaces and common punctuation
    return text.replace(/[<>{}[\]\\^`|%'"?]/g, '').trim();
};

/**
 * Normalizes Wikimedia URLs to standardized thumbnails (500px).
 * Handles raw SVGs and existing thumbs correctly.
 */
const normalizeWikipediaUrl = (url) => {
    if (!url) return url;

    let normalized = decodeURIComponent(String(url).trim());

    // 1. Handle protocol-relative URLs
    if (normalized.startsWith('//')) {
        normalized = 'https:' + normalized;
    }

    // 2. [MASTER RECOVERY] If it's just a filename or a File: reference
    // Pattern: "File:Escut_de_la_Torre.svg" or "Escut_de_la_Torre.svg"
    const isFilenameOnly = !normalized.includes('http') && (
        normalized.includes('File:') || 
        normalized.endsWith('.svg') || 
        normalized.endsWith('.png') || 
        normalized.endsWith('.jpg') ||
        normalized.includes('Escut') || 
        normalized.includes('Shield')
    );

    if (isFilenameOnly) {
        const filename = normalized.replace('File:', '').trim().replace(/ /g, '_');
        return `https://commons.wikimedia.org/w/thumb.php?f=${encodeURIComponent(filename)}&w=500`;
    }

    // 3. If it's already a full Wikimedia URL, ensure it's a 500px thumbnail
    if (normalized.includes('wikimedia.org') || normalized.includes('wikipedia.org')) {
        // If it's already a direct thumb path, we can keep it but force 500px
        if (normalized.includes('/thumb/')) {
            return normalized.replace(/\/\d+px-/g, '/500px-');
        }
        
        // If it's a link to a file page or raw file, convert to thumb.php
        const filenameMatch = normalized.match(/File:(.+)$/) || normalized.match(/\/([^/]+)$/);
        if (filenameMatch) {
            const filename = filenameMatch[1].split('?')[0];
            return `https://commons.wikimedia.org/w/thumb.php?f=${encodeURIComponent(filename)}&w=500`;
        }
    }

    return normalized;
};

/**
 * Linguistic engine to adjust common Valencian/Catalan terms 
 * based on the character's gender.
 */
const adjustGender = (text, gender) => {
    if (!text || gender !== 'female') return text;
    // Map of common masculine to feminine endings or terms
    const adaptations = {
        ' un poc liat': ' un poc liada',
        ' tot sol': ' tota sola',
        'content ': 'contenta ',
        ' cansat': ' cansada',
        'Preparat': 'Preparada',
        'benvingut': 'benvinguda',
        'estret': 'estreta',
        'segur': 'segura',
        'animat': 'animada'
    };

    let adjusted = text;
    for (const [masc, fem] of Object.entries(adaptations)) {
        adjusted = adjusted.replace(new RegExp(masc, 'g'), fem);
    }
    return adjusted;
};

/**
 * columnCache implementation using a Proxy to read/write dynamically from localStorage.
 * This ensures that if localStorage changes (e.g., in another tab), the service always uses fresh values.
 */
const columnCache = new Proxy({}, {
    get: (target, prop) => {
        // [MASTER BLINDATGE] Evitem consultes amb IDs malformats
        if (prop === 'sp_node_befd9c41142744f6') return null;
        if (prop.includes('_punt')) return null; // [GHOST-SHIELD] Blocking dynamic project_ref prefixes
        const val = localStorage.getItem(`cp_${prop}`);
        if (val === 'true') return true;
        if (val === 'false') return false;
        return null;
    },
    set: (target, prop, value) => {
        localStorage.setItem(`cp_${prop}`, String(value));
        return true;
    }
});

// [MASTER PURGE] Self-healing logic for legacy data
// })();


/**
 * Intelligent Synonym Dictionary for Towns and Search Terms
 * Maps historical, informal, or other language variants to canonical names.
 */
const SEARCH_SYNONYMS = {
    'torremanzanas': 'La Torre de les Maçanes',
    'la torre de las manzanas': 'La Torre de les Maçanes',
    'la torre': 'La Torre de les Maçanes',
    'alcoy': 'Alcoi',
    'alcoià': 'Alcoi',
    'el mure': 'Muro d\'Alcoi',
    'muro de alcoy': 'Muro d\'Alcoi',
    'muro': 'Muro d\'Alcoi',
    'cocentaina': 'Cocentaina', // Canonical
    'quincena': 'Cocentaina', // For testing or local context
    'penaguila': 'Penàguila',
    'rellen': 'Relleu',
    'benifallim': 'Benifallim',
    'soc de poble': 'Sóc de Poble',
    'socdepoble': 'Sóc de Poble',
    'soc de': 'Sóc de Poble',
    'poble': 'Sóc de Poble',
    'soc': 'Sóc de Poble',
    'rutadelpoble': 'Sóc de Poble',
    'merchandising': 'Sóc de Poble',
    'xixona': 'Xixona',
    'jijona': 'Xixona',
    'alacant': 'Alacant',
    'alicante': 'Alacant',
    'alacantí': 'L\'Alacantí',
    'el campello': 'El Campello',
    'mutxamel': 'Mutxamel',
    'sant joan': 'Sant Joan d\'Alacant',
    'sant vicent': 'Sant Vicent del Raspeig',
    'agost': 'Agost'
};

/**
 * Normalizes a search query using the synonym engine.
 * @param {string} query 
 * @returns {string} Normalized query
 */
const getNormalizedQuery = (query) => {
    if (!query) return '';
    const trimmed = query.toLowerCase().trim();

    // Accents normalization (Damia -> Damià)
    const accentLess = trimmed.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Direct match check in Synonyms
    if (SEARCH_SYNONYMS[trimmed]) return SEARCH_SYNONYMS[trimmed];
    if (SEARCH_SYNONYMS[accentLess]) return SEARCH_SYNONYMS[accentLess];

    // Partial match/Contains check (more dynamic)
    for (const [key, value] of Object.entries(SEARCH_SYNONYMS)) {
        if (trimmed.includes(key) || accentLess.includes(key)) return value;
    }
    return accentLess;
};

/**
 * [SUPER-SEARCH] Unified search with semantic awareness
 */
export const unifiedSearch = async (query) => {
    const normalized = getNormalizedQuery(query);
    // logger.log(`[Super-Search] Executing unified search for: ${normalized} (${category})`);

    // Logic will be expanded to use FTS5/GIN indexes in the next phase
    // For now, we enhance the existing filtering with semantic tag matching
    return normalized;
};

/**
 * Utilitat interna per a comparació OMNISCIENT (Ignora accents, espais i majúscules)
 */
const omniMatch = (target, search) => {
    if (!target || !search) return false;
    const normalize = (str) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    return normalize(target).includes(normalize(search));
};

const setColumnCache = (key, value) => {
    columnCache[key] = value;
};

/**
 * [PILAR 1: LOCAL-FIRST] Advanced Cache Layer for Latency Zero
 */
const LocalCache = {
    _storage: {},
    get: (key) => {
        const item = LocalCache._storage[key] || JSON.parse(localStorage.getItem(`lc_${key}`) || 'null');
        if (item && Date.now() < item.expires) {
            return item.data;
        }
        return null;
    },
    set: (key, data, ttl = 300000) => { // Default 5 min
        const item = { data, expires: Date.now() + ttl };
        LocalCache._storage[key] = item;
        localStorage.setItem(`lc_${key}`, JSON.stringify(item));
    },
    invalidate: (key) => {
        delete LocalCache._storage[key];
        localStorage.removeItem(`lc_${key}`);
    }
};

/**
 * [MASTER] Ensures column cache is populated with robust SQL checks
 */
const _ensureColumnCache = async () => {
    // 1. Check Posts columns
    if (columnCache.posts_ai_percentage === null) {
        if (!activeChecks.posts) {
            activeChecks.posts = (async () => {
                try {
                    const { data, error } = await supabase.from('posts').select('*').limit(1);
                    if (!error && data) {
                        const row = data[0] || {};
                        const exists = 'ai_percentage' in row;
                        setColumnCache('posts_ai_percentage', exists);
                        setColumnCache('posts_human_percentage', exists);
                        setColumnCache('posts_time_saved', exists);
                        setColumnCache('posts_is_iaia_inspired', exists);
                        setColumnCache('posts_pinned_position', 'pinned_position' in row);
                        setColumnCache('posts_town_uuid', 'town_uuid' in row);
                    } else if (error) {
                        setColumnCache('posts_ai_percentage', false);
                        setColumnCache('posts_pinned_position', false);
                    }
                    // logger.log(`[SupabaseService] Posts columns check done.`);
                } catch (e) {
                    logger.warn('[SupabaseService] Error checking posts columns:', e);
                } finally { activeChecks.posts = null; }
            })();
        }
    }

    // 2. Check Market columns
    if (columnCache.market_pinned_position === null) {
        if (!activeChecks.market) {
            activeChecks.market = (async () => {
                try {
                    // Check multiple columns in one go (market_items select *)
                    const { data, error } = await supabase.from('market_items').select('*').limit(1);
                    if (!error && data && data.length >= 0) {
                        const row = data[0] || {};
                        setColumnCache('market_pinned_position', 'pinned_position' in row);
                        setColumnCache('market_is_pinned', 'is_pinned' in row);
                        setColumnCache('market_is_iaia_inspired', 'is_iaia_inspired' in row);
                        setColumnCache('market_is_playground', 'is_playground' in row);
                    } else if (error) {
                        // If we can't select *, let's be conservative
                        setColumnCache('market_pinned_position', false);
                        setColumnCache('market_is_pinned', false);
                    }

                    // Check for the specific town join hint (PostgREST syntax)
                    const { error: fkError } = await supabase.from('market_items').select('towns!fk_market_town_uuid(name)').limit(1);
                    setColumnCache('market_fk_town_uuid', !fkError);

                    // logger.log(`[SupabaseService] Market columns check done.`);
                } catch (e) {
                    logger.warn('[SupabaseService] Error checking market columns:', e);
                } finally { activeChecks.market = null; }
            })();
        }
    }

    // 3. Check Messages columns
    if (columnCache.messages_post_uuid === null) {
        if (!activeChecks.messages) {
            activeChecks.messages = (async () => {
                try {
                    const { data, error } = await supabase.from('messages').select('*').limit(1);
                    if (!error && data) {
                        const row = data[0] || {};
                        setColumnCache('messages_post_uuid', 'post_uuid' in row);
                        setColumnCache('messages_is_playground', 'is_playground' in row);
                    } else if (error) {
                        setColumnCache('messages_post_uuid', false);
                        setColumnCache('messages_is_playground', false);
                    }
                    logger.log(`[SupabaseService] Messages columns check done.`);
                } catch (e) {
                    logger.warn('[SupabaseService] Error checking messages columns:', e);
                } finally { activeChecks.messages = null; }
            })();
        }
    }

    await Promise.all([activeChecks.posts, activeChecks.market, activeChecks.messages]);
}

export const isValidUUID = (id) => {
    if (!id) return false;
    const isStandardUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const isSovereignID = typeof id === 'string' && id.startsWith('sp_node_');
    return isStandardUUID || isSovereignID;
};

// Guardià per a crides que NÉCESSITEN un UUID de base de dades real (Supabase)
const isRealDBUUID = (id) => {
    return typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
};

// Promesas activas para evitar ráfagas de errores 400 en paralelo
const activeChecks = {
    posts: null,
    market: null,
    messages: null,
    conversations: null
};

/**
 * Centralized System Entities (Virtual Identities)
 */
const SYSTEM_ENTITIES = [
    {
        id: 'sdp-oficial-1',
        full_name: 'Sóc de Poble',
        username: 'socdepoble',
        type: 'empresa',
        town_name: 'Global',
        description: 'La plataforma de connexió rural definitiva. Gent, terra i xarxa. Connectem pobles, persones i territori a través de la tecnologia i la identitat.',
        avatar_url: '/assets/master/logo_socdepoble_green_square.png',
        cover_url: '/images/campaign/rustic_detail.png',
        category: 'Tecnologia i Comunitat',
        is_active: true,
        created_at: '2025-01-01T00:00:00Z'
    },
    {
        id: 'el-rentonar',
        full_name: 'Associació Cultural El Rentonar',
        username: 'rentonar',
        type: 'empresa',
        town_name: 'La Torre de les Maçanes',
        description: 'Entitat gestora de Sóc de Poble i custòdia de la tradició i identitat de La Torre de les Maçanes. Treballem per la memòria viva i la sobirania tecnològica rural. CIF G-03967668.',
        avatar_url: '/assets/master/logo_socdepoble_green_square.png',
        cover_url: '/images/campaign/rustic_detail.png',
        category: 'Cultura i Tradició',
        is_active: true,
        created_at: '2025-01-01T00:00:00Z'
    },
    {
        id: '11111111-1a1a-0000-0000-000000000000',
        full_name: 'IAIA (Guia del Poble)',
        type: 'oficial',
        town_name: 'Sóc de Poble',
        description: 'Assistència virtual i guia de la comunitat. Soc la teua acompanyant digital per a tot el que necessites al poble.',
        avatar_url: '/images/agents/iaia_avatar.png',
        cover_url: '/images/campaign/night_party.png',
        is_active: true,
        created_at: '2025-01-01T00:00:00Z'
    },
    {
        id: 'fa82eb62-4a83-4ff7-b2d6-8849673fc3b0',
        full_name: 'Damià Llorens (Perit)',
        username: 'damianllorens',
        type: 'persona',
        town_name: 'Global',
        description: 'Fundador de Sóc de Poble. Dissenyant el futur de la connexió rural viva.',
        avatar_url: '/assets/avatars/comic/damia_agutzil_comic.png',
        cover_url: '/images/campaign/night_party.png',
        category: 'Tecnologia',
        is_active: true,
        is_admin: true,
        created_at: '2025-01-01T00:00:00Z'
    },
    {
        id: 'a11ac111-eec1-4111-b111-000000000013',
        full_name: 'Anna Climent',
        type: 'persona',
        town_name: 'Ibi / Global',
        description: 'Biòloga, arquitecta i professora. Experta en nutrició saludable i sostenibilitat rural.',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
        cover_url: '/images/campaign/night_party.png',
        category: 'gent',
        is_active: true,
        is_admin: true, // Elevating to admin
        created_at: '2026-01-27T18:00:00Z'
    }
];

/**
 * Centralized logic to detect if a profile is fictive (Lore or Demo)
 */
export const isFictiveProfile = (profile) => {
    if (!profile) return false;
    const pid = profile.id || '';
    const email = profile.email || '';

    // Order of priority: Creator account (NEVER fictive), ID prefix (Lore), System IDs, then explicit flag (Demo)
    const masters = (typeof CREATOR_EMAILS !== 'undefined') ? CREATOR_EMAILS : [];
    if (masters.includes(email)) return false;

    return pid.startsWith('11111111-') ||
        pid.startsWith('sdp-') ||
        profile.is_demo === true;
};

/**
 * Hardcoded Lore Personas for Sandbox and AI interaction
 */
const LORE_PERSONAS = [
    { id: '11111111-1a1a-0000-0000-000000000000', full_name: 'IAIA MarIA', username: 'iaia_master', gender: 'female', role: 'official', ofici: 'Matriarca Digital', primary_town: 'Sóc de Poble (Global)', bio: 'Dignitat, terra i xarxa. Soc la teua assistenta (MArIA: Memòria Artificial i Acció) per a tot el que necessites al poble.', avatar_url: '/assets/avatars/comic/iaia_comic_matriarch.png', category: 'gent', type: 'person', onomatopoeia: '🏺', time: 'Sempre' },
    { id: '11111111-1a1a-0001-0000-000000000001', full_name: 'Andreu Soler', username: 'andreu_soler', gender: 'male', role: 'ambassador', ofici: 'Capatàs del Mas', primary_town: 'La Torre de les Maçanes', bio: "L'Andreu és el rellotge del camp.", avatar_url: '/assets/avatars/comic/andreu_soler_comic.png', onomatopoeia: '¡PLAS!', category: 'treball', type: 'person', time: '3:35 p. m.' },
    { id: '11111111-1a1a-0001-0000-000000000002', full_name: 'Beatriz Ortega', username: 'beatriz_ortega', gender: 'female', role: 'ambassador', ofici: 'Arquitecta de Ferro', primary_town: 'Global', bio: 'Mestre, la V15 està bategant forta!', avatar_url: '/assets/avatars/comic/beatriz_ortega_comic.png', onomatopoeia: '¡CLINC!', category: 'treball', type: 'person', time: '12:19 p. m.' },
    { id: '11111111-1a1a-0001-0000-000000000003', full_name: 'Carla Soriano', username: 'carla_soriano', gender: 'female', role: 'ambassador', ofici: 'Harmonitzadora de Batecs', primary_town: 'Ibi', bio: 'Bategat equilibrat, mestre Javi.', avatar_url: '/assets/avatars/comic/carla_soriano_comic.png', onomatopoeia: '¡OMMM!', category: 'gent', type: 'person', time: '6:13 p. m.' },
    { id: '11111111-1111-4111-a111-000000000009', full_name: 'Carmen la del Forn', username: 'cuinera', gender: 'female', role: 'ambassador', ofici: 'Cuinera del Mas', primary_town: 'La Torre de les Maçanes', bio: 'La cuina de Pepica és el cor del Mas.', avatar_url: '/assets/avatars/comic/carmen_forn_comic.png', onomatopoeia: '¡XUP!', category: 'treball', type: 'person', time: '2:16 p. m.' },
    { id: '11111111-1111-4111-a111-000000000003', full_name: 'Vicent Ferris', username: 'vferris', gender: 'male', role: 'ambassador', ofici: 'Agricultor Gran', primary_town: 'La Torre de les Maçanes', bio: 'Els cicles lunars manen sobre la collita.', avatar_url: '/assets/avatars/comic/vicent_ferris_comic.png', onomatopoeia: '¡ZAS!', category: 'treball', type: 'person', time: '5:00 a. m.' },
    { id: '11111111-1111-4111-a111-000000000004', full_name: 'Samir Mensah', username: 'samirm', gender: 'male', role: 'ambassador', ofici: 'Artesà', primary_town: 'Ibi', bio: 'Integrant tradicions.', avatar_url: '/assets/avatars/comic/avatar_samir_comic.png', onomatopoeia: '¡TAC!', category: 'gent', type: 'person', time: '4:15 p. m.' },
    { id: '11111111-1111-4111-a111-000000000005', full_name: 'Mariamel', username: 'mariamel', gender: 'female', role: 'ambassador', ofici: 'Historiadora', primary_town: 'Muro', bio: 'Conservant el llegat del poble.', avatar_url: '/assets/avatars/comic/avatar_mariamel_comic.png', onomatopoeia: '¡SHH!', category: 'gent', type: 'person', time: '1:00 p. m.' },
    { id: '11111111-1111-4111-a111-000000000008', full_name: 'Joan Batiste (Avi dels Papers)', username: 'joanbat', gender: 'male', role: 'ambassador', ofici: 'Arxiver', primary_town: 'Cocentaina', bio: 'Tots els documents en regla.', avatar_url: '/assets/avatars/comic/joan_batiste_comic.png', onomatopoeia: '¡RASS!', category: 'gent', type: 'person', time: '10:00 a. m.' },
    { id: '11111111-0000-0000-0000-000000000004', full_name: 'Marc (El Gall)', username: 'marcgall', gender: 'male', role: 'official', ofici: 'Alertes Globals', primary_town: 'Global', bio: 'Alçant al Mas cada dia.', avatar_url: '/assets/avatars/comic/avatar_marc_comic.png', onomatopoeia: '¡KIKIRIKI!', category: 'gent', type: 'person', time: '6:00 a. m.' },
    { id: '11111111-1111-4111-a111-000000000011', full_name: 'Elena Popova', username: 'elenap', gender: 'female', role: 'ambassador', ofici: 'Innovadora', primary_town: 'Agost', bio: "Buscant el futur a l'entorn rural.", avatar_url: '/assets/avatars/comic/elena_popova_comic.png', onomatopoeia: '¡PING!', category: 'gent', type: 'person', time: '2:30 p. m.' },
    { id: '11111111-1111-4111-a111-000000000012', full_name: 'Joanet Serra', username: 'joanets', gender: 'male', role: 'ambassador', ofici: 'Sereno', primary_town: 'Relleu', bio: 'Vigilant les estreles.', avatar_url: '/assets/avatars/comic/joanet_serra_comic.png', onomatopoeia: '¡FIUU!', category: 'gent', type: 'person', time: '11:00 p. m.' },
    { id: '11111111-1111-4111-a111-000000000013', full_name: 'Lucia', username: 'lucia', gender: 'female', role: 'ambassador', ofici: 'Llibretera', primary_town: 'Banyeres', bio: 'La màgia dels contes vells.', avatar_url: '/assets/avatars/comic/avatar_lucia_comic.png', onomatopoeia: '¡CLAP!', category: 'gent', type: 'person', time: '5:45 p. m.' },
    { id: '11111111-1a1a-0001-0000-000000000007', full_name: 'Pepica la de la Vall', username: 'pepica_vall', gender: 'female', role: 'ambassador', ofici: 'Herbolària', primary_town: 'La Vall', bio: 'Remeis naturals.', avatar_url: '/assets/avatars/comic/pepica_vall_comic.png', onomatopoeia: '¡TSH!', category: 'treball', type: 'person', time: '8:00 a. m.' },
    { id: '11111111-1a1a-0000-0000-000000000005', full_name: 'Nano Banana', username: 'nanob', gender: 'male', role: 'official', ofici: 'Artista T.I.A.', primary_town: 'Global', bio: '🎨 Píxels i humor.', avatar_url: '/assets/avatars/comic/nano_banana_comic.png', onomatopoeia: '¡POW!', category: 'gent', type: 'person', time: '4:20 p. m.' }
];


const _throttleLocks = new Map();

/**
 * Verifica si una acción es demasiado frecuente (Throttling) con locks de concurrencia
 * @param {string} userId
 * @param {string} actionType
 * @param {number} limitMs
 */
const checkThrottling = async (userId, actionType, limitMs = 3000) => {
    const now = Date.now();
    const key = `${userId}_${actionType}`;
    const lock = _throttleLocks.get(key) || { lastTime: 0, pending: 0 };

    if (lock.pending > 5) {
        throw new Error('Massa peticions simultànies. Espera un poc.');
    }

    lock.pending++;
    _throttleLocks.set(key, lock);

    try {
        if (now - lock.lastTime < limitMs) {
            throw new Error(`Acció massa ràpida. Espera ${Math.ceil((limitMs - (now - lock.lastTime)) / 1000)} segons.`);
        }
        lock.lastTime = now;
    } finally {
        lock.pending--;
        _throttleLocks.set(key, lock);
    }
};

const TOWNS_MAP = {
    1: 'La Torre de les Maçanes',
    2: 'Cocentaina',
    3: 'Muro d\'Alcoi',
    'la-torre': 'La Torre de les Maçanes',
    'cocentaina': 'Cocentaina',
    'muro': 'Muro d\'Alcoi',
    4: 'Agost',
    'agost': 'Agost'
};

/**
 * Normaliza un item de feed/market con fallbacks robustos
 */
const normalizeContentItem = (item, type = 'post') => {
    if (!item) return null;

    const isJaviMaster = (
        item.author_id === 'd6325f44-7277-4d20-b020-166c010995ab' || 
        item.author_user_id === 'd6325f44-7277-4d20-b020-166c010995ab' || 
        item.author === 'Javi Llinares' || 
        item.author_name === 'Javi Llinares' ||
        item.author === 'socdepoblecom' || 
        item.author_name === 'socdepoblecom' || 
        item.username === 'socdepoblecom' ||
        item.author_email?.includes('socdepoblecom')
    );

    const authorName = isJaviMaster ? 'Javi Llinares' : (item.author || item.author_name || item.seller || item.seller_name || (type === 'market' ? 'Productor Local' : 'Veí del Poble'));
    const avatarUrl = isJaviMaster ? '/assets/master/javi_avatar_cinematic.png' : (item.avatar_url || item.author_avatar || item.author_avatar_url || '/assets/avatars/comic/avatar_man_1.png');

    // [MASTER HEALER] Fallback d'imatges intel·ligent per al Mercat
    let imageUrl = item.image_url || item.image;
    if (!imageUrl && type === 'market') {
        const title = (item.title || '').toLowerCase();
        if (title.includes('mel')) imageUrl = '/images/assets/mel_premium.png';
        else if (title.includes('oli')) imageUrl = '/images/assets/oli_premium.png';
        else if (title.includes('poma') || title.includes('apple')) imageUrl = '/images/assets/apples_premium.png';
        else if (title.includes('tomate')) imageUrl = '/images/assets/tomates_premium.png';
        else if (title.includes('coque')) imageUrl = '/images/assets/coques_premium.png';
        else if (title.includes('formatge')) imageUrl = '/images/assets/formatge.png';
        else imageUrl = '/images/assets/generic_market.png';
    }

    // Resolución de pueblos con validación
    let townName = isJaviMaster ? 'La Torre de les Maçanes' : 'Al teu poble';
    if (!isJaviMaster) {
        if (item.towns?.name) {
            townName = item.towns.name;
        } else if (item.town_id && TOWNS_MAP[item.town_id]) {
            townName = TOWNS_MAP[item.town_id];
        } else if (item.town_name) {
            townName = item.town_name;
        }
    }

    return {
        ...item,
        id: item.uuid || item.id,
        uuid: item.uuid || item.id,
        author: authorName,
        seller: type === 'market' ? authorName : undefined,
        author_avatar: avatarUrl,
        author_role: isJaviMaster ? 'official' : (type === 'market' ? 'freelance' : (item.author_role || 'vei')),
        avatar_url: avatarUrl,
        author_user_id: isJaviMaster ? 'd6325f44-7277-4d20-b020-166c010995ab' : (item.author_user_id || (item.author_role === 'user' ? item.author_id : (item.author_user_id || null))),
        author_entity_id: item.author_entity_id || (item.author_role !== 'user' ? (item.entity_id || item.author_id) : (item.author_entity_id || null)),
        towns: { name: townName },
        image_url: imageUrl,
        is_iaia_inspired: item.is_iaia_inspired || false,
        ai_percentage: item.ai_percentage || 0,
        human_percentage: item.human_percentage || 100,
        time_saved_minutes: item.time_saved_minutes || 0,
        semantic_tags: item.semantic_tags || [],
        external_links: item.external_links || []
    };
};
// [GHOST-SHIELD] Known broken or legacy storage assets that trigger 404/400 console errors
const BROKEN_STORAGE_URLS = [
    'javi_avatar.png',
    'profiles/javi_avatar.png',
    'avatars/javi_avatar.png'
];

export const supabaseService = {
    /**
     * [STORAGE HEALING]
     * Detects and fixes legacy or broken storage URLs.
     */
    normalizeStorageUrl(url) {
        if (!url) return url;

        // [GHOST-SHIELD] Pre-flight block for known broken remote assets
        if (typeof url === 'string') {
            const isBroken = BROKEN_STORAGE_URLS.some(broken => url.includes(broken));
            if (isBroken) {
                logger.debug(`[GhostShield] Blocking request to known broken asset: ${url}`);
                // Return a safe local placeholder that exists in the repo
                return '/assets/master/javi_avatar_cinematic.png';
            }
        }

        // [MASTER BLINDATGE] Purguem rutes absolutes locals que s'hagen pogut colar
        // Admitem 'Users/' sense barra inicial per caçar rutes relatives malformades
        const localPathPattern = /(\/?Users\/|C:\\|D:\\|E:\\|F:\\|G:\\|H:\\|I:\\|J:\\)/i;
        if (typeof url === 'string' && localPathPattern.test(url)) {
            const fileName = url.split(/[/\\]/).pop();
            // Intentem recuperar-la de la carpeta de relíquies del Mas o fallback d'assets
            logger.warn(`[SupabaseService] Ruta absoluta detectada i sanejada: ${url}`);
            
            // Si el fitxer sembla un avatar, usem el path de profiles
            if (url.includes('avatar') || url.includes('profile')) {
                return `/assets/brain/e1b6e544-2f87-4f23-b187-d802a30c0ca1/${fileName}`;
            }
            
            // Fallback general a assets/brain
            return `/assets/brain/e1b6e544-2f87-4f23-b187-d802a30c0ca1/${fileName}`;
        }

        return url;
    },

    normalizeProfile(profile) {
        if (!profile) return null;
        return {
            ...profile,
            avatar_url: this.normalizeStorageUrl(profile.avatar_url),
            cover_url: this.normalizeStorageUrl(profile.cover_url)
        };
    },

    /**
     * Account Deletion System (5s Fast Track)
     * Calls the secure RPC 'delete_user' which invokes PostgreSQL ON DELETE CASCADE.
     */
    async deleteCurrentUser() {
        try {
            logger.info('[Account] Iniciant procediment d\'eliminació de compte...');
            const { error: rpcError } = await supabase.rpc('delete_user');
            if (rpcError) throw rpcError;
            
            // Si el borrat funciona, tanquem sessió al client per netejar el token local
            await supabase.auth.signOut();
            return { success: true };
        } catch (e) {
            logger.error('[Account] Error a l\'eliminar el compte:', e);
            throw e;
        }
    },
    // New Feature: Persistent Notifications
    async createNotification(payload) {
        try {
            const { error } = await supabase.from('notifications').insert([{
                user_id: payload.user_id,
                type: payload.type || 'system',
                content: payload.content,
                is_read: false,
                created_at: new Date().toISOString(),
                // Optional fields if schema supports them
                // meta: payload.meta 
            }]);
            if (error) {
                // Ignore table missing errors for now
                if (error.code === '42P01') logger.warn('Notifications table missing');
                else logger.error('Error creating notification:', error);
            }
        } catch (e) {
            logger.error('Create notification exception:', e);
        }
    },

    // Admin Stats (Live)
    async getAdminStats() {
        try {
            const now = new Date();
            const yesterday = new Date(now.getTime() - (24 * 60 * 60 * 1000)).toISOString();

            // Total Real Users
            const { count: totalUsers, error: _countError } = await supabase
                .from('profiles')
                .select('id', { count: 'exact' })
                .eq('is_demo', false)
                .limit(1);

            // New Users (24h)
            const { data: newUsers, error: _newError } = await supabase
                .from('profiles')
                .select('id, full_name, created_at')
                .eq('is_demo', false)
                .gte('created_at', yesterday)
                .order('created_at', { ascending: false });

            // System Health (Check if any critical errors logged - using notifications for now)
            const { count: errorCount } = await supabase
                .from('notifications')
                .select('id', { count: 'exact' })
                .eq('type', 'system_error')
                .gte('created_at', yesterday)
                .limit(1);

            // Latest User
            const latestUser = newUsers?.[0] || null;

            return {
                totalUsers: totalUsers || 0,
                newUsers24h: newUsers?.length || 0,
                latestUser,
                errorCount: errorCount || 0
            };
        } catch (e) {
            logger.error('Error fetching admin stats:', e);
            return { totalUsers: 0, newUsers24h: 0, errorCount: 0 };
        }
    },

    // Global OverView (Total Vision for UCC)
    async getGlobalOverview() {
        try {
            const [stats, seo, { data: recentPosts }, { data: recentMarket }, { data: recentProfiles }] = await Promise.all([
                this.getAdminStats(),
                this.getSEOStats(),
                supabase.from('posts').select('id, content, created_at, author:author_name, author_avatar:author_avatar_url').order('created_at', { ascending: false }).limit(10),
                supabase.from('market_items').select('id, title, price, created_at, seller:author_name, avatar_url:author_avatar_url').order('created_at', { ascending: false }).limit(10),
                supabase.from('profiles').select('id, full_name, created_at').eq('is_demo', false).order('created_at', { ascending: false }).limit(10)
            ]);

            // Combine and normalize for Activity Pipeline
            const timeline = [
                ...(recentPosts || []).map(p => normalizeContentItem({ ...p, type: 'post', label: 'Nou Post al Mur' }, 'post')),
                ...(recentMarket || []).map(m => normalizeContentItem({ ...m, type: 'market', label: 'Nou Producte' }, 'market')),
                ...(recentProfiles || []).map(u => ({ ...u, type: 'user', label: 'Nou Ciutadà', title: u.full_name, author: u.full_name }))
            ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            return {
                stats,
                seo,
                timeline: timeline.slice(0, 20)
            };
        } catch (err) {
            logger.error('[SupabaseService] Error in getGlobalOverview:', err);
            // Trace the exact error structure for 400/404 debugging
            if (err.details || err.hint) {
                logger.warn(`[SupabaseService] Query Fail: ${err.message} | ${err.details} | ${err.hint}`);
            }
            return { stats: {}, seo: {}, timeline: [] };
        }
    },

    // God-Level User Management (Noise Filtering)
    async updateUserModeration(userId, data) {
        try {
            logger.info(`[Admin] Actualitzant moderació per a ${userId}:`, data);
            const { error } = await supabase
                .from('profiles')
                .update({
                    is_noise: data.is_noise,
                    is_silenced: data.is_silenced,
                    reputation_score: data.reputation_score
                })
                .eq('id', userId);

            if (error) throw error;
            return true;
        } catch (e) {
            logger.error('Error updating user moderation:', e);
            throw e;
        }
    },

    async getModeratedPosts(options = {}) {
        try {
            let query = supabase.from('posts').select('*, towns(name), author:profiles!author_id(*)');

            // Logic to filter ONLY if 'filterNoise' is active
            if (options.filterNoise) {
                query = query.eq('author.is_noise', false);
            }

            const { data, error } = await query.order('created_at', { ascending: false });
            if (error) throw error;
            return data.map(normalizeContentItem);
        } catch (e) {
            logger.error('Error fetching moderated posts:', e);
            return [];
        }
    },

    // SEO / Health Stats (Admin)
    async getSEOStats() {
        try {
            // Simulated SEO Metrics for now (until we integrate Google Search Console API)
            // Real checks for sitemap and robots (Using GET to avoid SW Cache conflicts)
            const hasSitemap = await fetch('/sitemap.xml', { method: 'GET' }).then(r => r.ok).catch(() => false);
            const hasRobots = await fetch('/robots.txt', { method: 'GET' }).then(r => r.ok).catch(() => false);

            return {
                healthScore: hasSitemap && hasRobots ? 98 : 85, // Mock score based on basic checks
                indexedPages: 142, // Mock
                issues: !hasSitemap ? 1 : 0,
                lastCrawl: new Date().toISOString(),
                hasSitemap,
                hasRobots
            };
        } catch (error) {
            logger.warn('Error checking SEO stats:', error);
            return {
                healthScore: 0,
                indexedPages: 0,
                issues: 0,
                lastCrawl: null,
                hasSitemap: false,
                hasRobots: false
            };
        }
    },

    async getPostComments(postId) {
        try {
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(postId);
            if (!isUUID || String(postId).startsWith('mock-') || String(postId).startsWith('anna-') || String(postId).includes('-')) {
                // If it's a slug or mock, return empty array without crashing
                // Slugs (like 'busquem-socis-tecnologics') don't have comments in DB yet
                return [];
            }

            const { data, error } = await supabase
                .from('post_comments')
                .select('*, profiles!user_id(full_name, avatar_url)')
                .eq('post_uuid', postId)
                .order('created_at', { ascending: true });

            if (error) {
                if (error.code === '42P01') {
                    logger.warn('post_comments table missing, returning empty array');
                    return [];
                }
                throw error;
            }
            return data || [];
        } catch (e) {
            logger.error('Error fetching post comments:', e);
            return [];
        }
    },

    // Admin & Seeding
    async getAllPersonas(isPlayground = false) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('full_name', { ascending: true });

        if (error) throw error;

        const dbPersonas = (data || []).filter(p => {
            const masters = (typeof CREATOR_EMAILS !== 'undefined') ? CREATOR_EMAILS : [];
            const isRealUser = p.is_demo === false ||
                masters.includes(p.email) ||
                p.username?.toLowerCase().includes('javillinares') ||
                p.username?.toLowerCase().includes('socdepoble');

            const isLoreCharacter = LORE_PERSONAS.some(lp => lp.full_name === p.full_name);
            return !isRealUser && !isLoreCharacter;
        }).map(p => {
            // Aseguramos que siempre tengan un pueblo asignado
            if (!p.primary_town) {
                // Fallback inteligente para perfiles de la DB que puedan estar incompletos
                if (p.username === 'vferris') p.primary_town = 'La Torre de les Maçanes';
                else if (p.username === 'carlas') p.primary_town = 'Penàguila';
                else if (p.username === 'joanets') p.primary_town = 'Muro d\'Alcoi';
                else p.primary_town = 'La Torre de les Maçanes'; // Default para la simulación
            }
            return p;
        });

        // Combinem
        const rawPersonas = [...dbPersonas, ...LORE_PERSONAS];

        // Deduplicació real vs fictici per ID (Prioritat al Real/DB)
        const uniqueById = new Map();
        rawPersonas.forEach(p => {
            const pid = p.id;
            if (!pid) return;
            // Si ja existeix, donem prioritat al perfil que NO siga fictici o que tinga més info
            if (!uniqueById.has(pid)) {
                uniqueById.set(pid, p);
            } else {
                const existing = uniqueById.get(pid);
                const isExistingFictive = isFictiveProfile(existing);
                const isNewFictive = isFictiveProfile(p);

                if (isExistingFictive && !isNewFictive) {
                    uniqueById.set(pid, p);
                }
            }
        });

        const mergedPersonas = Array.from(uniqueById.values());

        // Lògica de Sincronització de Producció:
        // [MASTER IDENTITY PROTECTION] Solo dejamos perfiles reales en producción
        if (!isPlayground) {
            return mergedPersonas.filter(p => {
                const pid = p.id || '';
                // [GHOST-SHIELD EXTREME] Purgamos cualquier ID ficticio o de demo
                const isFictive = pid.startsWith('11111111-') || pid.startsWith('sdp-') || p.is_demo === true;
                const _isOfficial = p.role === 'official' || p.type === 'oficial';
                const isRealUser = (p.type === 'person' || p.type === 'user') && !isFictive;

                // En producció REAL, permetem humans autenticats i IDENTITATS CORE de la IAIA (ID 11111111-*)
                return (isRealUser && !isFictive) || (isFictive && pid.startsWith('11111111-'));
            }).sort((a, b) => (a.full_name || '').localeCompare(b.full_name || ''));
        }

        return mergedPersonas.sort((a, b) => (a.full_name || '').localeCompare(b.full_name || ''));
    },

    async getAdminEntities(isPlayground = false) {
        const { data, error } = await supabase
            .from('entities')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;
        if (!data) return [];

        // En producció filtrem les entitats fictícies (demo o Lore-based)
        // I per petició legal, ocultem qualsevol entitat que no sigui del sistema si no estem en mode Playground
        if (!isPlayground) {
            // Mostrem entitats de sistema o del llinatge oficial
            const dbSystem = data.filter(e => e.type === 'system' || e.type === 'oficial' || e.owner_id === 'd6325f44-7277-4d20-b020-166c010995ab');
            return [...SYSTEM_ENTITIES, ...dbSystem];
        }

        return [...SYSTEM_ENTITIES, ...data];
    },

    // Chats (Secure Messaging - Phase 4)
    async getConversations(userIdOrEntityId) {
        const isGuest = !userIdOrEntityId || userIdOrEntityId === DEMO_USER_ID;

        if (isGuest || (userIdOrEntityId && !isRealDBUUID(userIdOrEntityId))) {
            // [GUEST-FIRST] Forsters and sovereign IDs don't use Mock Chats anymore
            // to keep the Chat List clean with the 13+ official Agents.
            return [];
        }

        // Usamos la vista enriquecida que ya trae nombres y avatares directamente (Optimización Auditoría V3)
        let query = supabase.from('view_conversations_enriched').select(`
            id, 
            participant_1_id, 
            participant_2_id, 
            participant_1_type, 
            participant_2_type, 
            last_message_content, 
            last_message_at,
            is_playground,
            p1_name, 
            p1_avatar_url, 
            p1_role,
            p1_is_ai,
            p2_name, 
            p2_avatar_url,
            p2_role,
            p2_is_ai
        `);

        query = query.or(`participant_1_id.eq.${userIdOrEntityId},participant_2_id.eq.${userIdOrEntityId}`);

        const { data: convs, error } = await query.order('last_message_at', { ascending: false });

        if (error) {
            logger.error('[SupabaseService] Error in getConversations:', error);
            // Si hay error (posiblemente la vista no existe aún), devolvemos vacío o mocks si habilitado
            if (ENABLE_MOCKS) {
                const { MOCK_CHATS } = await import('../data');
                const currentParticipantId = userIdOrEntityId || 'me';
                return MOCK_CHATS.map(m => ({
                    id: `mock-${m.id}`,
                    last_message_content: m.message,
                    last_message_at: new Date().toISOString(),
                    p1_info: { id: currentParticipantId, name: 'Jo' },
                    p2_info: { id: `m${m.id}`, name: m.name, avatar_url: m.avatar_url || null },
                    participant_1_id: currentParticipantId,
                    participant_2_id: `m${m.id}`,
                    participant_1_type: 'user',
                    participant_2_type: m.type === 'shop' || m.type === 'gov' ? 'entity' : 'user'
                }));
            }
            return [];
        }

        // Mapeamos los campos de la vista al formato que esperan los componentes
        const dbConvs = (convs || []).map(c => ({
            ...c,
            p1_info: { id: c.participant_1_id, name: c.p1_name, avatar_url: c.p1_avatar_url },
            p2_info: { id: c.participant_2_id, name: c.p2_name, avatar_url: c.p2_avatar_url }
        }));

        return dbConvs;
    },

    async getConversationMessages(conversationId) {
        if (!isRealDBUUID(conversationId) || conversationId?.startsWith('mock-')) {
            try {
                const mockIdx = conversationId.split('-')[1];
                const { MOCK_MESSAGES } = await import('../data');
                const messages = MOCK_MESSAGES[mockIdx] || [];
                return messages.map(m => ({
                    id: `msg-mock-${m.id}`,
                    conversation_id: conversationId,
                    sender_id: m.sender === 'me' ? 'me' : 'other', // En la UI lo gestionamos
                    content: m.text,
                    created_at: new Date().toISOString(),
                    is_ai: false
                }));
            } catch (err) {
                logger.error('Error loading mock messages:', err);
                return [];
            }
        }

        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true });
        if (error) throw error;

        // Hydrate Voice Messages with Metadata
        if (data && data.length > 0) {
            const voiceMessageIds = data.filter(m => m.attachment_type === 'voice').map(m => m.id);
            if (voiceMessageIds.length > 0) {
                const { data: voiceMeta } = await supabase
                    .from('voice_messages')
                    .select('message_id, duration_seconds, waveform_data')
                    .in('message_id', voiceMessageIds);

                if (voiceMeta) {
                    const metaMap = new Map(voiceMeta.map(v => [v.message_id, v]));
                    return data.map(m => {
                        if (m.attachment_type === 'voice') {
                            const meta = metaMap.get(m.id);
                            return {
                                ...m,
                                voice_meta: meta ? {
                                    duration: meta.duration_seconds,
                                    waveform: meta.waveform_data
                                } : null
                            };
                        }
                        return m;
                    });
                }
            }
        }

        return data || [];
    },

    async getLatestMessages(conversationIds) {
        if (!conversationIds || conversationIds.length === 0) return { data: [] };

        // Fetch most recent message for each conversation
        // Auditoría V3: Recuperación manual cuando las columnas resumen fallan
        return supabase
            .from('messages')
            .select('conversation_id, content, created_at')
            .in('conversation_id', conversationIds)
            .order('created_at', { ascending: false });
    },

    async sendSecureMessage(messageData, abortSignal = null) {
        if (messageData.senderId && !messageData.isGuest) {
            await checkThrottling(messageData.senderId, 'send_message', 1000).catch(e => logger.warn('Throttling warn', e));
        }
        // [FAILSAFE GLOBAL]: Si el conversationId és un Mock, un Local-Conv de Playground, o no s'ha arribat a canviar mai (1111... que és la IA)
        if (messageData.conversationId?.startsWith('mock-') || 
            messageData.conversationId?.startsWith('local-conv-') || 
            messageData.conversationId?.startsWith('11111111-')) {
            logger.log('[SupabaseService] Simulated send to mock conversation or unhydrated IAIA agent');
            return {
                id: crypto.randomUUID(), // Prevent mapping issues
                conversation_id: messageData.conversationId,
                sender_id: messageData.senderId,
                content: messageData.content,
                attachment_url: messageData.attachmentUrl || null,
                attachment_type: messageData.attachmentType || null,
                attachment_name: messageData.attachmentName || null,
                created_at: new Date().toISOString(),
                is_ai: false
            };
        }

        // [BATEGAT ANONYMOUS BYPASS] 
        // Si és un usuari anònim enviant a la IAIA, no ho guardem a Supabase
        // per evitar errors de constraint (400) pel sender_id no existent.
        // Simularem l'èxit i invocarem la resposta local.
        if (messageData.isGuest || !messageData.senderId || messageData.senderId === 'guest' || String(messageData.senderId).startsWith('anonymous')) {
            logger.warn('[supabaseService] Intent de sendSecureMessage per usuari anònim. Guardant en local (efímer).');
            const guestMessage = { 
                id: `guest-msg-${Date.now()}`, 
                conversation_id: messageData.conversationId, 
                sender_id: messageData.senderId || 'guest', 
                content: messageData.content, 
                created_at: new Date().toISOString(),
                is_ai: false
            };
            
            // Si la conversació és amb una IAIA (p.ex. IAIA MarIA), activem la resposta ràpida simulada
            if (messageData.conversationId && messageData.conversationId.startsWith('c1111000')) {
                 const personaInfo = LORE_PERSONAS.find(p => p.id === '11111111-1a1a-0000-0000-000000000000'); // IAIA Maria default
                 const responderId = messageData.conversationId.replace('c', ''); // Aproximació per al Mock
                 this.triggerSimulatedReply({ ...messageData, responderId, responderType: 'bot', persona: personaInfo || LORE_PERSONAS[0] });
            }

            return guestMessage;
        }

        // Validació estructural amb Zod
        const isPlayground = localStorage.getItem('isPlaygroundMode') === 'true' ||
            messageData.senderId?.startsWith('11111111-') ||
            messageData.conversationId?.startsWith('c1111000');

        // Check columns silently if in playground
        if (isPlayground && columnCache.messages_is_playground === null) {
            if (!activeChecks.messages) {
                activeChecks.messages = (async () => {
                    try {
                        const { data } = await supabase.from('messages').select('*').limit(1);
                        if (data && data.length > 0) {
                            setColumnCache('messages_is_playground', 'is_playground' in data[0]);
                        }
                    } catch (e) {
                        logger.error('[SupabaseService] Error checking playground column:', e);
                    } finally { activeChecks.messages = null; }
                })();
            }
            await activeChecks.messages;
        }

        const msgPayload = {
            id: crypto.randomUUID(),
            conversation_id: messageData.conversationId,
            sender_id: messageData.senderId,
            sender_entity_id: messageData.senderEntityId || null,
            content: messageData.content || null,
            attachment_url: messageData.attachmentUrl || null,
            attachment_type: messageData.attachmentType || null,
            attachment_name: messageData.attachmentName || null,
            post_uuid: messageData.postUuid || null
        };

        // Auditoría V3: Silenciador de errores por falta de columna post_uuid
        if (columnCache.messages_post_uuid === false) {
            delete msgPayload.post_uuid;
        }

        if (isPlayground && columnCache.messages_is_playground !== false) {
            msgPayload.is_playground = true;
        }

        const validated = MessageSchema.parse(msgPayload);

        // [BUGFIX 400 Bad Request] We construct the select query string dynamically to PREVENT
        // asking for columns that don't exist.
        let safeColumns = 'id, conversation_id, sender_id, content, attachment_url, attachment_type, attachment_name, created_at, is_ai, is_read';
        
        if (columnCache.messages_is_playground !== false) {
           safeColumns += ', is_playground';
        }
        
        const selectStr = columnCache.messages_post_uuid !== false ? `${safeColumns}, post_uuid` : safeColumns;

        let query = supabase
            .from('messages')
            .insert(validated)
            .select(selectStr);
            
        if (abortSignal) {
            query = query.abortSignal(abortSignal);
        }

        const { data, error } = await query;

        if (error) {
            const isMissingPostUuid = (error.code === '42703' || error.code === 'PGRST204') && msgPayload.post_uuid;
            const isMissingPlayground = error.code === 'PGRST204' && isPlayground && columnCache.messages_is_playground !== false;

            if (isMissingPlayground) {
                setColumnCache('messages_is_playground', false);
                return this.sendSecureMessage(messageData, abortSignal);
            }
            if (isMissingPostUuid) {
                setColumnCache('messages_post_uuid', false);
                return this.sendSecureMessage(messageData, abortSignal);
            }
            if (error.code === '42501') {
                logger.error('[SupabaseService] RLS Permission Denied on messages table. Please run migration 20260208_nexus_permissions_fix.sql');
                // Return a mock success to avoid UI hang, let it simulate the message
                return { 
                    ...msgPayload, 
                    id: `failed-rls-${Date.now()}`, 
                    status: 'simulated', 
                    created_at: new Date().toISOString() 
                };
            }
            throw error;
        }

        if (msgPayload.post_uuid && columnCache.messages_post_uuid === null) {
            setColumnCache('messages_post_uuid', true);
        }

        const message = data[0];

        // Actualizar el resumen en la conversación
        // Auditoría V3: Forzamos el update directo para evitar inconsistencias en la vista
        await supabase
            .from('conversations')
            .update({
                last_message_content: messageData.attachmentUrl ? `[${messageData.attachmentType || 'Arxiu'}]` : messageData.content,
                last_message_at: new Date().toISOString()
            })
            .eq('id', messageData.conversationId);

        // Detect if responder is AI/Lore (Harmonized with UI logic)
        // const { data: conv } = await supabase
        //     .from('view_conversations_enriched')
        //     .select('*')
        //     .eq('id', messageData.conversationId)
        //     .limit(1)
        //     .maybeSingle();

        // const responderId = conv?.participant_1_id === messageData.senderId ? conv?.participant_2_id : conv?.participant_1_id;
        // [Bot Reply Engine]
        // Lógica de respuesta simulada removida de aquí. Ahora iaiaService.js (generateAIAResponse) 
        // gestiona de forma exclusiva los fillers asépticos y la IA real (Gemini) para evitar duplicidades.
        // if (isToLore || responderIsAI || messageData.conversationId.startsWith('c1111000')) {
        //     // Buscamos persona de forma SINCRÓNICA para ganar milisegundos
        //     // const persona = LORE_PERSONAS.find(p => p.id === responderId);
        //     // this.triggerSimulatedReply({ ...messageData, responderId, responderType, persona });
        // }

        return message;
    },


    async triggerSimulatedReply(originalMessage) {
        // Respuesta quasi-instantánea para mantener el engagement (Petición usuario)
        try {
            const { conversationId, responderId, responderType, persona } = originalMessage;
            if (!responderId) return;

            let reply = "";
            const randomVal = Math.random();

            if (persona) {
                // Respuestas con personalidad según el Lore
                const greeting = getTimeAwareGreeting();

                // Respuestas con personalidad según el Lore (Integrando saludos neutros solicitados)
                if (persona.username === 'vferris') {
                    const vReplies = [
                        `${greeting} Gràcies pel missatge. Ara estic amb la garlopa, t'ho mire en un ratet.`,
                        `${greeting} Recorda que la fusta vol paciència. T'ho conteste després!`,
                        `${greeting} Això està fet. Si és per a la Torre, compte amb mi.`,
                        `${greeting} Passa't pel taller quan vullgues i ho mirem.`
                    ];
                    reply = vReplies[Math.floor(randomVal * vReplies.length)];
                } else if (persona.username === 'mariamel') {
                    const mReplies = [
                        `${greeting} Les meues abelles estan ara a tope amb el romer. Después parlem.`,
                        `${greeting} Dolç com la mèl! Gràcies pel missatge.`,
                        `${greeting} Xe, que bona idea. El poble necessita més gent així!`,
                        `${greeting} Estic per la serra sense cobertura, quan baixe t'ho mire.`
                    ];
                    reply = mReplies[Math.floor(randomVal * mReplies.length)];
                } else if (persona.username === 'elenap') {
                    const eReplies = [
                        `${greeting} Ja saps que qualsevol cosa em pots preguntar.`,
                        `${greeting} Sí, d'acord. Jo ajudaré en tot el que pugui al poble.`,
                        `${greeting} Com va tot per allí? Estic ací per a ajudar-te.`,
                        `${greeting} Tinc molta feina ara, però t'ho agraeixo molt!`
                    ];
                    reply = eReplies[Math.floor(randomVal * eReplies.length)];
                } else if (persona.username === 'joanb') {
                    const jReplies = [
                        `${greeting} Estic dalt l'Aitana amb el ramat. No se sent res por aquí.`,
                        `${greeting} Si vols parlar de veres, vine a Benifallim!`,
                        `${greeting} Les meues cabres i jo estem d'acord. Bona proposta!`,
                        `${greeting} Buff, millor parlem a la fresca un altre ratet.`
                    ];
                    reply = jReplies[Math.floor(randomVal * jReplies.length)];
                } else {
                    // Genérico para otros personajes del Lore (con ajuste de género automático y saludos)
                    const genericReplies = [
                        `${greeting} Xe, que bona idea! Gràcies por compartir-ho.`,
                        `${greeting} Ara estic un poc liat, però m'ho apunte!`,
                        `${greeting} Sóc de Poble som tots, compte amb mi.`,
                        `${greeting} Perfecte, ja m'ho dius quan sàpigues algo.`
                    ];
                    reply = adjustGender(genericReplies[Math.floor(randomVal * genericReplies.length)], persona.gender);
                }
            } else {
                reply = "D'acord! Ho tindré en compte. Gràcies pel missatge.";
            }

            // Insertamos el mensaje marcado como IA (con gestión de errores por si la columna no existe aún)
            const payload = {
                id: crypto.randomUUID(),
                conversation_id: conversationId,
                sender_id: responderId,
                sender_entity_id: responderType === 'entity' ? responderId : null,
                content: reply
            };

            // Solo añadimos is_ai si la caché no dice lo contrario
            if (columnCache.messages_is_ai !== false) {
                payload.is_ai = true;
            }

            const { error: insError } = await supabase.from('messages').insert(payload);

            if (insError && insError.code === '42703') { // Undefined column
                columnCache.messages_is_ai = false;
                delete payload.is_ai;
                await supabase.from('messages').insert(payload);
            } else if (!insError) {
                columnCache.messages_is_ai = true;
            }

            // Actualizamos la conversación
            await supabase.from('conversations').update({
                last_message_content: reply,
                last_message_at: new Date().toISOString()
            }).eq('id', conversationId);

        } catch (err) {
            logger.error('[NPC Simulation] Error:', err);
        }
    },

    async getOrCreateConversation(p1Id, p1Type, p2Id, p2Type) {
        // Buscar si ya existe la combinación (en cualquier orden)
        const { data: existing } = await supabase
            .from('conversations')
            .select('*')
            .or(`and(participant_1_id.eq.${p1Id},participant_2_id.eq.${p2Id}),and(participant_1_id.eq.${p2Id},participant_2_id.eq.${p1Id})`)
            .maybeSingle();

        if (existing) return existing;

        // Crear nueva si no existe
        const isPlayground = localStorage.getItem('isPlaygroundMode') === 'true' ||
            p1Id?.startsWith('11111111-') ||
            p2Id?.startsWith('11111111-');

        // Check columns silently if in playground
        if (isPlayground && columnCache.conversations_is_playground === null) {
            if (!activeChecks.conversations) {
                activeChecks.conversations = (async () => {
                    try {
                        const { data } = await supabase.from('conversations').select('*').limit(1);
                        if (data && data.length > 0) {
                            setColumnCache('conversations_is_playground', 'is_playground' in data[0]);
                        }
                    } catch (e) {
                        logger.error('[SupabaseService] Error checking definitions for conversations:', e);
                    } finally { activeChecks.conversations = null; }
                })();
            }
            await activeChecks.conversations;
        }

        const convPayload = {
            participant_1_id: p1Id,
            participant_1_type: p1Type,
            participant_2_id: p2Id,
            participant_2_type: p2Type
        };

        // [HOTFIX] Eliminat `is_playground` del payload i del .select() per evitar el llançament 
        // constants errors HTTP 400 (42703) quan la columna no està desplegada al Postgres de Producció.
        const validated = ConversationSchema.parse(convPayload);
        
        const selectStr = 'id, participant_1_id, participant_2_id, created_at';

        const { data, error } = await supabase
            .from('conversations')
            .insert(validated)
            .select(selectStr);

        if (error) {
            // Retratem per console però sense llançar el warning d'error PGRST204 ni el reintent circular
            if (error.code === 'PGRST204' || error.code === '42703') {
                logger.warn('[SupabaseService] PGRST204 o 42703 rebut. Ignorant i bypassejant a causa de diferències en esquemes de Database', error);
            }

            // Auditoria V4 (DeepSeek): Resolució Condició de Cursa Optimística
            if (error.code === '23505') {
                logger.warn('[SupabaseService] 💥 Condició de cursa detectada creant conversació (23505 Unique Violation). Aplicant lectura recursiva salvadora (Optimistic Lock).');
                return await this.getOrCreateConversation(p1Id, p1Type, p2Id, p2Type);
            }

            // [RLS / FK / CHECK BYPASS] EN MODE PLAYGROUND O SENSE PERFILS, L'ERROR 401, 403, 23503 (FK) O 23514 (CHECK) ÉS ESPERAT
            if (isPlayground && (error.code === '42501' || error.code === '23503' || error.code === '23514' || error.status === 401 || error.status === 403)) {
                logger.warn(`[SupabaseService] 🛡️ DB Bypass Activat (Error ${error.code || error.status}): Creant conversa local/mock per a la IA.`);
                return {
                    id: `local-conv-${p1Id.substring(0, 4)}-${p2Id.substring(0, 4)}`,
                    participant_1_id: p1Id,
                    participant_1_type: p1Type,
                    participant_2_id: p2Id,
                    participant_2_type: p2Type,
                    is_playground: true,
                    created_at: new Date().toISOString()
                };
            }
            throw error;
        }
        return data[0];
    },

    async markMessagesAsRead(conversationId, userId) {
        if (!conversationId || conversationId.startsWith('mock-') || !isRealDBUUID(conversationId)) return;
        
        // [GUEST SHIELD] Si el userId no és un UUID vàlid de base de dades, no marquem a la DB real
        if (!userId || !isRealDBUUID(userId)) {
            logger.info('[SupabaseService] Foraster detectat, markMessagesAsRead virtualitzat.');
            return;
        }

        const { error } = await supabase.rpc('mark_messages_as_read', {
            conv_id: conversationId,
            user_id: userId
        });

        if (error) {
            if (error.code === '22P02') {
                logger.warn('[SupabaseService] UUID syntax error in markMessagesAsRead, skipping.');
                return;
            }
            throw error;
        }
    },

    // [PROTOCOL REALTIME OMEGA] Bategat monitoritzat màxima eficiència
    subscribeToMessages(conversationId, callback) {
        if (!conversationId) return null;
        
        if (!this._activeChannels) this._activeChannels = new Map();
        const MAX_ACTIVE_CHANNELS = 50; // Supabase Free tier permet màx 100 de forma segura
        
        // LRU Eviction: Tancar canal si estem al límit
        if (this._activeChannels.size >= MAX_ACTIVE_CHANNELS) {
            const oldestKey = this._activeChannels.keys().next().value;
            const oldestChannel = this._activeChannels.get(oldestKey);
            supabase.removeChannel(oldestChannel);
            this._activeChannels.delete(oldestKey);
            logger.warn(`[SupabaseService] LRU Eviction executada: Canal ${oldestKey} liquidat per saturació.`);
        }
        
        const channelKey = `chat:${conversationId}`;
        
        if (this._activeChannels.has(channelKey)) {
            supabase.removeChannel(this._activeChannels.get(channelKey));
            this._activeChannels.delete(channelKey);
        }
        
        logger.info(`[SupabaseService] Connectant al canal realtime per a: ${conversationId}`);
        const channel = supabase.channel(channelKey)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${conversationId}`
            }, callback)
            .subscribe();
            
        this._activeChannels.set(channelKey, channel);
        return channel;
    },

    unsubscribe(channel) {
        if (channel) {
            // [MASTER FIX] Prevenir 'WebSocket closed before the connection is established'
            // Retardem l'ordre de desconnexió per donar oxigen al handshake de Connexió
            setTimeout(() => {
                try {
                    supabase.removeChannel(channel).catch(() => {});
                } catch (e) {
                    logger.debug('[SupabaseService] Silent remove error', e);
                }
            }, 800);

            if (this._activeChannels) {
                this._activeChannels.forEach((val, key) => {
                    if (val === channel) this._activeChannels.delete(key);
                });
            }
            logger.info('[SupabaseService] Canal realtime desconnectat netament sense bloquejos orfes.');
        }
    },

    // Pueblos
    async getTowns() {
        try {
            const { data, error } = await supabase
                .from('towns')
                .select('*');

            if (error) throw error;

            let townsList = data || [];
            
            // [GHOST-BATEGAT] Inyectem Agost si no està a la DB (Integració Sixto Pina)
            if (!townsList.some(t => t.id === 4 || t.name === 'Agost')) {
                townsList.push({
                    id: 4,
                    uuid: 'agost-4-uuid',
                    name: 'Agost',
                    description: 'Poble de tradició terrissaire i artesana, on el bategat del ferro de Sixto Pina i el fang de les seues fàbriques crea una identitat única.',
                    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Escudo_de_Agost.svg',
                    image_url: 'https://images.unsplash.com/photo-1541336032412-2048a678540d?auto=format&fit=crop&q=80&w=1000',
                    province: 'Alacant',
                    comarca: 'L\'Alacantí'
                });
            }

            return townsList.map(town => {
                // [MASTER DIRECTIVE] ALGORISME DEL BATEC TERRITORIAL
                // 1. Identifiquem l'activitat de l'usuari des del solatge local
                const lastActiveTownId = localStorage.getItem('last_active_town_id');
                const secondaryTownId = localStorage.getItem('secondary_town_id');
                const profile = JSON.parse(localStorage.getItem('sdp_profile') || 'null');
                const primaryTownId = profile?.town_uuid || profile?.town_id;

                // [ONTOMÈTRICA] Calculem la força de la connexió (Batec)
                let connectionStrength = 0;
                const townId = town.uuid || town.id;

                if (townId === lastActiveTownId) connectionStrength += 1000;
                if (townId === primaryTownId) connectionStrength += 500;
                if (townId === secondaryTownId) connectionStrength += 250;

                // [MASTER PRIORITY] Benimassot, La Torre, Penàguila
                const lowerName = town.name?.toLowerCase() || "";
                if (lowerName.includes("benimassot") || 
                    lowerName.includes("la torre") || 
                    lowerName.includes("penàguila")) {
                    connectionStrength += 5000; // Force to top
                }

                // [MASTER IMAGE FALLBACK]
                let townImage = town.image_url;
                if (!townImage) {
                  if (lowerName.includes("benimassot")) townImage = "/assets/pobles/vistes/img_benimassot_main.jpg";
                  if (lowerName.includes("la torre")) townImage = "/assets/pobles/vistes/img_la_torre_de_les_ma_anes_main.jpg";
                  if (lowerName.includes("penàguila")) townImage = "/assets/pobles/vistes/img_pen_guila_main.jpg";
                }

                return {
                    ...town,
                    logo_url: normalizeWikipediaUrl(town.logo_url),
                    image_url: normalizeWikipediaUrl(townImage),
                    connection_strength: connectionStrength,
                    is_community: true // Diferenciació Poble vs Ajuntament
                };
            }).sort((a, b) => {
                // Prioritat: Força del Batec > Ordre Alfabètic
                if (b.connection_strength !== a.connection_strength) {
                    return b.connection_strength - a.connection_strength;
                }
                return a.name.localeCompare(b.name);
            });
        } catch (e) {
            logger.error('Error in getTowns:', e);
            return [];
        }
    },

    async getTownBatecImage(townId) {
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            // [PROTOCOL FLASH] Meritocràcia Visual + Atribució CC BY
            const { data, error } = await supabase
                .from('posts')
                .select('image_url, connections_count, author_name')
                .eq('town_id', townId)
                .not('image_url', 'is', null)
                .gte('created_at', thirtyDaysAgo.toISOString())
                .order('connections_count', { ascending: false })
                .limit(1);

            if (error || !data || data.length === 0) return null;
            return {
                url: normalizeWikipediaUrl(data[0].image_url),
                author: data[0].author_name
            };
        } catch (e) {
            logger.warn(`No s'ha pogut trobar imatge de batec recent per a ${townId}:`, e);
            return null;
        }
    },

    async getProvinces() {
        const { data, error } = await supabase
            .from('towns')
            .select('province')
            .not('province', 'is', null)
            .order('province', { ascending: true });

        if (error) throw error;
        // Distinct values
        return [...new Set(data.map(item => item.province))];
    },

    async getComarcas(province) {
        const { data, error } = await supabase
            .from('towns')
            .select('comarca')
            .eq('province', province)
            .not('comarca', 'is', null)
            .order('comarca', { ascending: true });

        if (error) throw error;
        // Distinct values
        return [...new Set(data.map(item => item.comarca))];
    },

    async searchAllTowns(query) {
        const sanitizedQuery = sanitizeInput(query);
        if (!sanitizedQuery || sanitizedQuery.length < 2) return [];

        logger.log(`[SupabaseService] Performed search for: "${sanitizedQuery}"`);
        try {
            // Deduplicació de filtres per evitar error 400
            // Nota: towns només té name i description seguint supabase_towns_setup.sql
            const filterTerms = new Set();
            ['name', 'description'].forEach(col => {
                filterTerms.add(`${col}.ilike.%${sanitizedQuery}%`);
            });

            const orClause = Array.from(filterTerms).join(',');

            // NIVELL DIOS: Cerca transversal en municipis
            const { data, error } = await supabase
                .from('towns')
                .select('*')
                .or(orClause)
                .order('name', { ascending: true })
                .limit(40);

            if (error) throw error;
            return (data || []).map(t => ({
                ...t,
                logo_url: normalizeWikipediaUrl(t.logo_url),
                image_url: normalizeWikipediaUrl(t.image_url)
            }));
        } catch (err) {
            logger.error('[SupabaseService] Robust search failed, falling back to simple search:', err);
            const { data } = await supabase
                .from('towns')
                .select('*')
                .ilike('name', `%${query}%`)
                .limit(10);
            return data || [];
        }
    },

    async searchProfiles(query) {
        if (!query || query.length < 2) return [];
        const normalizedName = getNormalizedQuery(query);
        const cleanQuery = query.toLowerCase().trim();

        try {
            // Deduplicació intel·ligent per evitar error 400 (Duplicate filters)
            const filterTerms = new Set();
            [cleanQuery, normalizedName].forEach(q => {
                if (!q) return;
                // [FIX] Robusteza en PostgREST: Wrap value in double quotes for spaces
                filterTerms.add(`full_name.ilike."%${q}%"`);
                filterTerms.add(`username.ilike."%${q}%"`);
                filterTerms.add(`primary_town.ilike."%${q}%"`);
            });

            // Afegim els altres camps que no depenen de la normalització de noms de poble/persona
            filterTerms.add(`role.ilike."%${cleanQuery}%"`);
            filterTerms.add(`ofici.ilike."%${cleanQuery}%"`);
            filterTerms.add(`bio.ilike."%${cleanQuery}%"`);

            const orClause = Array.from(filterTerms).join(',');
            logger.debug('[SupabaseService] profiles orClause:', orClause);

            // BUSCADOR NIVELL DIOS: Cerca OMNISCIENT en perfils
            let queryBuilder = supabase
                .from('profiles')
                .select('id, full_name, username, avatar_url, role, primary_town, bio, ofici, is_demo')
                .or(orClause);

            const isPlayground = localStorage.getItem('playground_mode') === 'true';
            if (!isPlayground) {
                queryBuilder = queryBuilder.eq('is_demo', false);
            }

            const { data, error } = await queryBuilder
                .order('full_name', { ascending: true })
                .limit(50);

            if (error) throw error;

            // Include lore personas in search with OmniMatch (Nivell Dios)
            const allPersonas = await this.getAllPersonas();
            const filteredLore = allPersonas.filter(p =>
                omniMatch(p.full_name, query) ||
                omniMatch(p.username, query) ||
                omniMatch(p.role, query) ||
                omniMatch(p.primary_town, query) ||
                omniMatch(p.ofici, query) ||
                omniMatch(p.bio, query)
            );

            // Merge and deduplicate by ID and full_name, prioritizing DB/Real
            const unique = [];
            const seenIds = new Set();
            const seenNames = new Set();

            const _combined = [...filteredLore, ...(data || [])];

            // Prioritzem data (DB) al final del merge si volem que "machaque", 
            // però aquí la lògica de .forEach d'un array barrejant-los un a un és clau.
            // Millor: Processar primer els Reals (DB) i després Lore si no s'han vist.

            const profilesToProcess = [
                ...(data || []), // DB first (Priority)
                ...filteredLore  // Lore second
            ];

            profilesToProcess.forEach(p => {
                const id = p.id;
                const nameKey = p.full_name?.toLowerCase().trim();

                if (!seenIds.has(id) && !seenNames.has(nameKey)) {
                    seenIds.add(id);
                    if (nameKey) seenNames.add(nameKey);

                    unique.push({
                        ...p,
                        town_name: p.town_name || p.primary_town
                    });
                }
            });

            return unique;
        } catch (error) {
            logger.error('[SupabaseService] Error in searchProfiles:', error);
            return [];
        }
    },

    async searchEntities(query) {
        if (!query || query.length < 2) return [];
        const normalizedCanonical = getNormalizedQuery(query); // E.g. "Sóc de Poble"
        const cleanQuery = query.toLowerCase().trim();

        // 1. DEFINICIÓ D'ENTITATS DE SISTEMA (Veritat Única - Usant constant centralitzada)
        const systemEntities = SYSTEM_ENTITIES;

        // 2. FILTRATGE OMNISCIENT DE SISTEMA (Sempre disponible)
        const filteredSystem = systemEntities.filter(e =>
            omniMatch(e.name, query) ||
            omniMatch(e.name, normalizedCanonical) ||
            omniMatch(e.type, query) ||
            omniMatch(e.town_name, query)
        );

        let dbResults = [];
        try {
            // Deduplicació estricta de filtres per evitar error 400
            // Nota: entities té id, name, type, description, avatar_url, owner_id segons setup
            const filterTerms = new Set();
            const termsToTry = [cleanQuery, normalizedCanonical].filter(Boolean);

            termsToTry.forEach(q => {
                const term = q.trim().toLowerCase();
                // [FIX] Robusteza en PostgREST: Wrap value in double quotes for spaces
                filterTerms.add(`name.ilike."%${term}%"`);
            });

            // Camps extra
            filterTerms.add(`type.ilike."%${cleanQuery}%"`);
            filterTerms.add(`description.ilike."%${cleanQuery}%"`);

            const orClause = Array.from(filterTerms).join(',');
            logger.debug('[SupabaseService] entities orClause:', orClause);

            // BUSCADOR NIVELL DIOS: Entitats, Comerços i Projectes
            const { data, error } = await supabase
                .from('entities')
                .select('id, name, type, avatar_url, description')
                .or(orClause)
                .limit(50);

            if (error) throw error;
            dbResults = data || [];
        } catch (error) {
            logger.error('[SupabaseService] Error in searchEntities (DB):', error);
            // Seguim endavant amb filteredSystem encara que la DB falle
        }

        // 3. TAXONOMIA I NETEJA
        const sanitizedDbResults = dbResults.map(e => {
            let mappedType = e.type;
            if (e.type === 'negoci' || e.type === 'comerç') mappedType = 'empresa';
            if (e.type === 'associacio') mappedType = 'institucio';

            // Forçar "Sóc de Poble" com a empresa si el nom quadra (OmniMatch)
            if (omniMatch(e.name, 'Sóc de Poble') || omniMatch(e.name, 'Soc de Poble')) {
                mappedType = 'empresa';
            }

            return {
                ...e,
                type: mappedType,
                avatar_url: normalizeWikipediaUrl(e.avatar_url)
            };
        });

        // 4. MERGE I PRIORITZACIÓ (Codi Genius: Sistema > DB)
        // Posem primer les del sistema per a que eixquen dalt i deduplicació no les esborre
        const combined = [...filteredSystem, ...sanitizedDbResults];
        const unique = [];
        const ids = new Set();

        combined.forEach(e => {
            if (!ids.has(e.id)) {
                ids.add(e.id);
                unique.push(e);
            }
        });

        return unique;
    },

    async getPublicDirectory() {
        try {
            const [profiles, entities] = await Promise.all([
                this.getAllPersonas(),
                this.getAdminEntities()
            ]);

            return {
                people: profiles || [],
                entities: entities || []
            };
        } catch (error) {
            logger.error('[SupabaseService] Error in getPublicDirectory:', error);
            return { people: [], entities: [] };
        }
    },

    async connectWithProfile(followerId, targetId, tags = []) {
        if (!followerId || !targetId) return false;
        if (columnCache.connections_table === false) return true;

        const isRealFollower = isRealDBUUID(followerId);
        const isRealTarget = isRealDBUUID(targetId);

        // Simulation for System/Lore entities that don't have valid UUIDs or aren't in auth.users
        if (!isRealFollower || !isRealTarget || isFictiveProfile({ id: targetId })) {
            logger.info(`[SupabaseService] Virtual Connection detected for ${targetId}. Simulating...`);
            // Store virtually in localStorage for current session persistence
            const virtualKey = `v_conn_${followerId}`;
            const connections = JSON.parse(localStorage.getItem(virtualKey) || '[]');
            if (!connections.includes(targetId)) {
                connections.push(targetId);
                localStorage.setItem(virtualKey, JSON.stringify(connections));
            }
            return true;
        }

        try {
            const { error, status } = await supabase
                .from('connections')
                .upsert({
                    follower_id: followerId,
                    target_id: targetId,
                    status: 'connected',
                    tags: tags,
                    created_at: new Date().toISOString()
                }, {
                    onConflict: 'follower_id,target_id',
                    ignoreDuplicates: false
                });

            if (error) {
                // Handle 409 Conflict (Key not in users) gracefully by falling back to virtual
                if (error.code === '23503' || error.code === '409' || error.code === '23514') { // Added 23514
                    logger.warn(`[SupabaseService] Foreign key constraint for connection ${targetId}. Falling back to virtual.`);
                    // The following lines seem to be from a different context (ChatDetail.jsx) and are commented out to maintain syntax.
                    // // Ensured AI persistence: Resolve real Supabase UUID (Passing 'entity' instead of 'ai' to avoid Postgres 23514 CHECK constraint)
                    // const realConv = await supabaseService.getOrCreateConversation(currentUserId, 'user', id, 'entity');
                    // if (!isMounted) return;}. Falling back to virtual.`);
                    const virtualKey = `v_conn_${followerId}`;
                    const connections = JSON.parse(localStorage.getItem(virtualKey) || '[]');
                    if (!connections.includes(targetId)) {
                        connections.push(targetId);
                        localStorage.setItem(virtualKey, JSON.stringify(connections));
                    }
                    return true;
                }

                if (error.code === '42P01' || status === 404) {
                    setColumnCache('connections_table', false);
                    return true;
                }
                throw error;
            }

            // Automate Push Notification
            const followerProfile = await this.getProfile(followerId);
            if (followerProfile) {
                pushNotifications.triggerNotification(targetId, {
                    title: `Nova connexió!`,
                    body: `${followerProfile.full_name} s'ha connectat amb tu.`,
                    url: `/perfil/${followerId}`,
                    tag: `connect-${followerId}`
                }).catch(() => { });
            }

            if (columnCache.connections_table === null) setColumnCache('connections_table', true);
            return true;
        } catch (error) {
            logger.error('[SupabaseService] Error connecting:', error);
            return false;
        }
    },

    async disconnectFromProfile(followerId, targetId) {
        if (!followerId || !targetId) return false;

        // 1. Remove from Virtual Persistence
        const virtualKey = `v_conn_${followerId}`;
        const virtualConns = JSON.parse(localStorage.getItem(virtualKey) || '[]');
        if (virtualConns.includes(targetId)) {
            const filtered = virtualConns.filter(id => id !== targetId);
            localStorage.setItem(virtualKey, JSON.stringify(filtered));
        }

        if (columnCache.connections_table === false) return true;

        try {
            const { error, status } = await supabase
                .from('connections')
                .delete()
                .eq('follower_id', followerId)
                .eq('target_id', targetId);

            if (error) {
                if (error.code === '42P01' || status === 404) {
                    setColumnCache('connections_table', false);
                    return true;
                }
                throw error;
            }
            return true;
        } catch (error) {
            logger.error('[SupabaseService] Error disconnecting:', error);
            return false;
        }
    },

    async isFollowing(followerId, targetId) {
        if (!followerId || !targetId || !isRealDBUUID(followerId) || !isRealDBUUID(targetId)) return false;

        // 1. Check Virtual Persistence first
        const virtualKey = `v_conn_${followerId}`;
        const virtualConns = JSON.parse(localStorage.getItem(virtualKey) || '[]');
        if (virtualConns.includes(targetId)) return true;

        if (columnCache.connections_table === false) return false;

        try {
            const { data, error, status } = await supabase
                .from('connections')
                .select('*')
                .eq('follower_id', followerId)
                .eq('target_id', targetId)
                .maybeSingle();

            if (error) {
                if (error.code === '42P01' || status === 404) {
                    setColumnCache('connections_table', false);
                    return false;
                }
                throw error;
            }
            if (columnCache.connections_table === null) setColumnCache('connections_table', true);
            return !!data;
        } catch {
            return false;
        }
    },

    async getFollowers(targetId) {
        if (!targetId || !isRealDBUUID(targetId)) return [];
        try {
            if (columnCache.connections_table === false) return [];

            const { data, error, status } = await supabase
                .from('connections')
                .select('follower_id')
                .eq('target_id', targetId);

            if (error) {
                if (error.code === '42P01' || status === 404) {
                    setColumnCache('connections_table', false);
                    return [];
                }
                throw error;
            }
            if (columnCache.connections_table === null) setColumnCache('connections_table', true);
            return data || [];
        } catch (error) {
            logger.error('[SupabaseService] Error getting followers:', error);
            return [];
        }
    },

    async getFollowing(userId) {
        if (!userId || !isRealDBUUID(userId)) return [];
        try {
            if (columnCache.connections_table === false) return [];
            const { data, error, status } = await supabase
                .from('connections')
                .select('target_id')
                .eq('follower_id', userId);
            if (error) {
                if (error.code === '42P01' || status === 404) {
                    setColumnCache('connections_table', false);
                    return [];
                }
                throw error;
            }
            if (columnCache.connections_table === null) setColumnCache('connections_table', true);
            return data || [];
        } catch (error) {
            logger.error('[SupabaseService] Error getting following:', error);
            return [];
        }
    },

    async addConnection(userId, postId) {
        if (!userId || !postId) return false;
        try {
            const { error } = await supabase
                .from('post_connections')
                .upsert({ user_id: userId, post_uuid: postId }, { onConflict: 'user_id,post_uuid' });
            if (error) {
                if (error.code === '42P01') {
                    logger.warn('Table post_connections missing, simulating connection');
                    return true;
                }
                throw error;
            }
            return true;
        } catch (e) {
            logger.error('[SupabaseService] Error addConnection:', e);
            return false;
        }
    },

    async removeConnection(userId, postId) {
        if (!userId || !postId) return false;
        try {
            const { error } = await supabase
                .from('post_connections')
                .delete()
                .eq('user_id', userId)
                .eq('post_uuid', postId);
            if (error) throw error;
            return true;
        } catch (e) {
            logger.error('[SupabaseService] Error removeConnection:', e);
            return false;
        }
    },



    async updateConnectionTags(userId, postId, tags) {
        if (!userId || !postId) return false;
        try {
            const { error } = await supabase
                .from('post_connections')
                .update({ tags })
                .eq('user_id', userId)
                .eq('post_uuid', postId);
            if (error) {
                if (error.code === '42P01') {
                    logger.warn('Table post_connections missing, cannot update tags');
                    return true;
                }
                throw error;
            }
            return true;
        } catch (e) {
            logger.error('[SupabaseService] Error updateConnectionTags:', e);
            return false;
        }
    },

    async getChatMessagesLegacy(chatId) {
        const { data, error } = await supabase
            .from('legacy_messages')
            .select('*')
            .eq('chat_id', chatId)
            .order('created_at', { ascending: true });
        if (error) throw error;
        return data;
    },

    // Feed / Muro
    // Feed / Muro
    async getPosts(roleFilter = 'tot', townId = null, page = 0, pageSize = 10, isPlayground = false) {
        logger.log(`[SupabaseService] Fetching posts with roleFilter: ${roleFilter}, townId: ${townId}, page: ${page}, playground: ${isPlayground}`);
        try {
            // [MASTER] Robust Column Sync with retry limit
            await _ensureColumnCache();
            const retryCount = (typeof arguments[5] === 'number') ? arguments[5] : 0;
            if (retryCount > 3) {
                logger.error('[SupabaseService] Maximum retry limit reached for getPosts. Aborting to prevent infinite loop.');
                return { data: [], count: 0, error: 'Retry limit reached' };
            }

            let selectStr = 'id, uuid, content, created_at, author, author_avatar, image_url, author_role, is_playground, author_user_id, author_entity_id, towns(name), profiles:author_user_id(town_uuid)';
            if (columnCache.posts_pinned_position !== false) {
                selectStr += ', pinned_position';
            }
            if (columnCache.posts_ai_percentage === true) {
                selectStr += ', ai_percentage, human_percentage, is_iaia_inspired';
            }

            let query = supabase
                .from('posts')
                .select(selectStr, { count: 'exact' });

            // [PILAR 1 & 3] Check Local Cache for instant return
            const cacheKey = `posts_${townId || 'global'}_${page}_${pageSize}`;
            const cachedData = LocalCache.get(cacheKey);

            if (isPlayground && columnCache.posts_is_playground !== false) {
                query = query.eq('is_playground', true);
            } else if (columnCache.posts_is_playground !== false) {
                // [GHOST-SHIELD] En producción, filtramos OBLIGATORIAMENTE el contenido de prueba
                query = query.eq('is_playground', false);
            }

            if (roleFilter && roleFilter !== ROLES.ALL && roleFilter !== 'tot') {
                query = query.eq('author_role', roleFilter);
            }

            if (townId) {
                logger.log(`[SupabaseService] townId entry: ${townId} (${typeof townId})`);
                if (!isRealDBUUID(townId)) {
                    const isNumeric = /^\d+$/.test(townId.toString());
                    let townSearch = supabase.from('towns').select('uuid, id');
                    if (isNumeric) {
                        townSearch = townSearch.or(`id.eq.${townId},town_id.eq.${townId}`);
                    } else {
                        townSearch = townSearch.ilike('name', `%${townId}%`);
                    }
                    const { data: townData } = await townSearch.limit(1).maybeSingle();
                    if (townData) {
                        townId = townData.uuid || townData.id;
                    } else {
                        townId = null;
                    }
                }

                if (townId && isRealDBUUID(townId)) {
                    logger.log(`[SupabaseService] Applying strict author-territory filter: ${townId}`);
                    // Enforce that the author must belong to this town
                    query = query.eq('profiles.town_uuid', townId);
                }
            }

            const from = page * pageSize;
            const to = from + pageSize - 1;

            const { data, error, count } = await query
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) {
                // [MASTER] Robust Column Error Detection (42703: undefined_column, PGRST204: PostgREST specific column error)
                const isColumnError = error.code === '42703' || error.code === 'PGRST204' || (error.code === '400' && error.message?.includes('column'));

                if (isColumnError && error.message?.includes('pinned_position')) {
                    setColumnCache('posts_pinned_position', false);
                    logger.warn('[SupabaseService] pinned_position missing in posts, retrying...');
                    return this.getPosts(roleFilter, townId, page, pageSize, isPlayground, retryCount + 1);
                }
                if (isColumnError && (error.message?.includes('ai_percentage') || error.message?.includes('human_percentage'))) {
                    setColumnCache('posts_ai_percentage', false);
                    logger.warn('[SupabaseService] AI columns missing in posts, retrying...');
                    return this.getPosts(roleFilter, townId, page, pageSize, isPlayground, retryCount + 1);
                }
                if (isColumnError && isPlayground) {
                    setColumnCache('posts_is_playground', false);
                    logger.warn('[SupabaseService] is_playground missing in posts, retrying silent...');
                    return this.getPosts(roleFilter, townId, page, pageSize, false, retryCount + 1);
                }
                // [PILAR 3] Offline Resilience: Return cached data if available
                if (cachedData) {
                    logger.warn('[Posts] Network failed, serving from cache.');
                    return { data: cachedData, count: cachedData.length, fromCache: true };
                }
                throw error;
            }

            let normalizedData = (data || []).map(p => normalizeContentItem(p, 'post'));

            // [PILAR 1] Update Cache
            if (page === 0) LocalCache.set(cacheKey, normalizedData);

            // [MASTER PURGE] No fallbacks a Mocks en producción real para evitar "fantasmas"
            if ((!data || data.length === 0) && page === 0 && ENABLE_MOCKS && isPlayground) {
                const { MOCK_FEED } = await import('../data');
                const normalized = MOCK_FEED.map(p => normalizeContentItem(p, 'post'));
                return { data: normalized, count: normalized.length };
            }

            // INYECCIÓN PREMIUM: Auxili Music Expansion (Only in Playground or Dev)
            const isDev = import.meta.env.MODE === 'development';
            if (page === 0 && (isPlayground || isDev) && normalizedData.length < 3) {
                const auxiliPost = {
                    id: 'didactic-auxili-2026',
                    uuid: 'didactic-auxili-2026',
                    type: 'didactic_presentation',
                    author: 'Auxili (Official)',
                    author_role: 'official',
                    author_avatar: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=200&auto=format&fit=crop', // Reggae vibes
                    content: '# Auxili: Reggae des de l\'Ontinyent\n\nAmb més de 10 anys damunt dels escenaris, **Auxili** s\'ha convertit en el crit musical de tota una generació. Des de la Vall d\'Albaida, han fusionat el reggae amb les arrels valencianes.\n\n## "La música és la nostra eina de transformació."\n\nEste 2026 tornem amb noves energies per a fer vibrar cada racó dels nostres pobles. Gràcies per formar part d\'aquesta família!',
                    image_url: [
                        'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1000&auto=format&fit=crop', // Festival crowd
                        'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1000&auto=format&fit=crop', // Band on stage
                        'https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=1000&auto=format&fit=crop'  // Musical instruments
                    ],
                    video_url: 'https://www.youtube.com/watch?v=Fadaa7Kyxm0', // Pàgines Blanques
                    created_at: new Date().toISOString(),
                    metadata: {
                        didactic_text: 'Auxili és un grup de música nascut a Ontinyent l\'any 2005. El seu estil musical és el reggae, amb tocs de ska, raggamuffin i música de banda. Les seues lletres parlen de lluita, amor i territori, amb un fort compromís social i cultural.'
                    },
                    towns: { name: 'Ontinyent (La Vall d\'Albaida)' },
                    connections_count: 850,
                    comments_count: 42
                };
                normalizedData = [auxiliPost, ...normalizedData];
            }

            return { data: normalizedData, count: (count || 0) + 1 };
        } catch (err) {
            logger.error('[SupabaseService] Error in getPosts:', err);
            return { data: [], count: 0 };
        }
    },

    async createPost(postData, isPlayground = false) {
        const payload = { ...postData };
        if (isPlayground) payload.is_playground = true;

        // Rate limiting / Throttling
        if (payload.author_id) {
            checkThrottling(payload.author_id, 'create_post');
        }

        // Multi-Llinatge master: Mapetgem camps si venen de components amb noms antics
        const mappedData = {
            ...payload,
            author_user_id: payload.author_id || payload.author_user_id || payload.user_id,
            author: payload.author_name || payload.author || 'Sóc de Poble',
            author_avatar: payload.author_avatar_url || payload.author_avatar,
            author_entity_id: payload.entity_id || payload.author_entity_id
        };

        // Fallback crític per a la IAIA si no ve de sessió d'usuari
        if (!mappedData.author_user_id && (payload.is_iaia || payload.is_iaia_inspired)) {
            mappedData.author_user_id = payload.iaia_id || '11111111-1a1a-0000-0000-000000000000';
        }

        // Remove old field names to avoid PGRST204
        delete mappedData.author_id;
        delete mappedData.author_name;
        delete mappedData.author_avatar_url;
        delete mappedData.entity_id;

        // Validació estructural amb Zod
        const validated = PostSchema.parse(mappedData);

        // Pre-generem id si no existeix (FIX 400 Bad Request)
        if (!validated.id && !validated.uuid) {
            validated.uuid = crypto.randomUUID();
        }

        // [MIGRACIÓ 10.33.20] Normalitzar town_uuid per evitar errors de tipat (ex: 'la-torre')
        if (validated.town_uuid === 'la-torre' || validated.town_uuid === '1') {
            validated.town_uuid = 'eecc1a91-db53-4bf0-a3ce-b33df011df6b';
        } else if (validated.town_uuid && !isValidUUID(validated.town_uuid)) {
            validated.town_uuid = null; // Prevent crashes against UUID columns
        }

        const { error } = await supabase
            .from('posts')
            .insert([validated]);

        if (error) {
            // [SUPER-HEALING] Fk_posts_author_profile error (missing user in profiles table locally)
            if (error.code === '23503' && (error.message?.includes('profile') || error.details?.includes('profile'))) {
                logger.warn(`[SupabaseService] Missing profile for user ${validated.author_user_id}. Auto-healing...`);
                try {
                    const profilePayload = {
                        id: validated.author_user_id,
                        full_name: validated.author || 'Sóc de Poble',
                        avatar_url: validated.author_avatar || null,
                        role: 'neighbor',
                        is_certified: false,
                        updated_at: new Date().toISOString()
                    };
                    await supabase.from('profiles').upsert([profilePayload]);
                    logger.info(`[SupabaseService] Profile created. Retrying post...`);
                    const { error: retryFkError } = await supabase.from('posts').insert([validated]);
                    if (retryFkError) throw retryFkError;
                    return validated;
                } catch (healingError) {
                    logger.error(`[SupabaseService] Auto-healing profile failed:`, healingError);
                    throw error;
                }
            }

            // [MASTER] Self-healing: if column not found, invalidate cache and retry
            if (error.code === '42703' || error.code === 'PGRST204') {
                logger.warn(`[SupabaseService] Column sync error (${error.code}) in createPost, invalidating cache...`);
                setColumnCache('posts_ai_percentage', false);
                setColumnCache('posts_human_percentage', false);
                setColumnCache('posts_time_saved', false);
                setColumnCache('posts_is_iaia_inspired', false);

                // Retry once without symbiosis columns
                const cleanPayload = { ...validated };
                delete cleanPayload.ai_percentage;
                delete cleanPayload.human_percentage;
                delete cleanPayload.time_saved_minutes;
                delete cleanPayload.economic_value_saved;
                delete cleanPayload.is_iaia_inspired;

                if (!cleanPayload.uuid) cleanPayload.uuid = crypto.randomUUID();
                const { error: retryError } = await supabase.from('posts').insert([cleanPayload]);
                
                if (retryError) {
                    logger.warn(`[SupabaseService] Second sync error (${retryError.code}), trying minimal payload...`);
                    const minimalPayload = {
                        id: validated.id || undefined,
                        uuid: validated.uuid || cleanPayload.uuid,
                        author_user_id: validated.author_user_id,
                        author: validated.author,
                        content: validated.content,
                        town_uuid: validated.town_uuid || payload.town_uuid
                    };
                    const { error: finalError } = await supabase.from('posts').insert([minimalPayload]);
                    if (finalError) throw finalError;
                    return minimalPayload;
                }
                return cleanPayload;
            }
            if (isPlayground || error.code === '42501' || error.code === '403') {
                // Fallback si la columna no existe o hay RLS restrictivo en campos extra
                logger.warn(`[SupabaseService] Security/RLS block in createPost, retrying minimal payload...`);
                const minimalPayload = {
                    id: validated.id || undefined,
                    uuid: validated.uuid || crypto.randomUUID(),
                    author_user_id: validated.author_user_id,
                    author: validated.author,
                    content: validated.content,
                    town_uuid: validated.town_uuid || payload.town_uuid
                };
                const { error: retryError } = await supabase.from('posts').insert([minimalPayload]);
                if (retryError) throw retryError;
                return minimalPayload;
            }
            throw error;
        }
        return validated;
    },

    // Mercado
    async getMarketCategories() {
        const { data, error } = await supabase
            .from('market_categories')
            .select('*')
            .order('id', { ascending: true });
        if (error) throw error;
        return data || [];
    },

    async getMarketItems(categoryFilter = 'tot', townId = null, page = 0, pageSize = 12, isPlayground = false) {
        try {
            await _ensureColumnCache();

            const cacheKey = `market_${categoryFilter || 'all'}_${townId || 'global'}_${page}`;
            const cachedData = LocalCache.get(cacheKey);

            let townJoin = columnCache.market_fk_town_uuid !== false ? 'towns!fk_market_town_uuid(name)' : 'towns(name)';
            let selectStr = `id, uuid, title, description, price, category_slug, created_at, author_user_id, seller, avatar_url, image_url, ${townJoin}`;

            if (columnCache.market_is_playground !== false) selectStr += ', is_playground';
            if (columnCache.market_is_pinned !== false) selectStr += ', is_pinned';
            if (columnCache.market_pinned_position !== false) selectStr += ', pinned_position';
            if (columnCache.market_is_iaia_inspired !== false) selectStr += ', is_iaia_inspired';

            let query = supabase.from('market_items').select(selectStr, { count: 'exact' });

            if (isPlayground && columnCache.market_is_playground !== false) {
                query = query.eq('is_playground', true);
            } else if (columnCache.market_is_playground !== false) {
                // [GHOST-SHIELD] In production, only real products
                query = query.eq('is_playground', false);
            }

            if (categoryFilter && categoryFilter !== 'tot') {
                query = query.eq('category_slug', categoryFilter);
            }

            if (townId && isRealDBUUID(townId)) {
                query = query.eq('town_uuid', townId);
            }

            const from = page * pageSize;
            const to = from + pageSize - 1;

            let queryBuilder = query;
            if (columnCache.market_is_pinned !== false) {
                queryBuilder = queryBuilder.order('is_pinned', { ascending: false });
            }
            if (columnCache.market_pinned_position !== false) {
                queryBuilder = queryBuilder.order('pinned_position', { ascending: true });
            }

            const { data, error, count } = await queryBuilder
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) {
                // [MASTER] Self-healing logic for PostgREST 400/PGRST204
                const isColumnError = error.code === '42703' || error.code === 'PGRST204' || (error.code === '400' && error.message?.includes('column'));

                if (isColumnError) {
                    logger.warn(`[SupabaseService] Market column error (${error.code}), invalidating cache...`);
                    // Invalidate specific column cache items found in error message or just reset
                    if (error.message?.includes('pinned_position')) setColumnCache('market_pinned_position', false);
                    if (error.message?.includes('is_pinned')) setColumnCache('market_is_pinned', false);
                    if (error.message?.includes('is_playground')) setColumnCache('market_is_playground', false);
                    if (error.message?.includes('fk_market_town_uuid')) setColumnCache('market_fk_town_uuid', false);

                    // Retry once immediately
                    return this.getMarketItems(categoryFilter, townId, page, pageSize, isPlayground);
                }
                if (cachedData) {
                    logger.warn('[Market] Network failed, serving from cache.');
                    return { data: cachedData, count: cachedData.length, fromCache: true };
                }
                throw error;
            }

            const normalizedData = (data || []).map(item => normalizeContentItem(item, 'market'));

            // [PILAR 1] Update Cache
            if (page === 0) LocalCache.set(cacheKey, normalizedData);

            return {
                data: normalizedData,
                count: count || 0
            };
        } catch (error) {
            logger.error('Error in getMarketItems:', error);
            // Return empty list on error to keep UI alive
            return { data: [], count: 0 };
        }
    },

    async getMarketFavorites(itemId) {
        const { data, error } = await supabase
            .from('market_favorites')
            .select('user_id')
            .eq('item_uuid', itemId);
        if (error) throw error;
        return (data || []).map(fav => fav.user_id);
    },

    async createMarketItem(itemData, isPlayground = false) {
        const payload = { ...itemData, category_slug: itemData.category_slug || 'tot' };
        if (isPlayground) payload.is_playground = true;

        // Rate limiting / Throttling
        if (payload.author_id || payload.author_user_id) {
            checkThrottling(payload.author_id || payload.author_user_id, 'create_market_item');
        }

        // Multi-Llinatge master: Mapetgem camps del mercat
        const mappedData = {
            ...payload,
            author_user_id: payload.author_id || payload.author_user_id || payload.user_id,
            seller: payload.author_name || payload.seller || 'Sóc de Poble',
            avatar_url: payload.author_avatar_url || payload.avatar_url,
            author_entity_id: payload.entity_id || payload.author_entity_id
        };

        // Fallback crític per a la IAIA si no ve de sessió d'usuari
        if (!mappedData.author_user_id && (payload.is_iaia || payload.is_iaia_inspired)) {
            mappedData.author_user_id = '11111111-1a1a-0000-0000-000000000000'; // IAIA MarIA default
        }

        // Remove old field names to avoid PGRST204
        delete mappedData.author_id;
        delete mappedData.author_name;
        delete mappedData.author_avatar_url;
        delete mappedData.entity_id;

        // Validació estructural amb Zod
        const validated = MarketItemSchema.parse(mappedData);

        const { data, error } = await supabase
            .from('market_items')
            .insert([validated])
            .select();

        if (error && error.code === '42703' && isPlayground) {
            delete validated.is_playground;
            const { data: retryData, error: retryError } = await supabase.from('market_items').insert([validated]).select();
            if (retryError) throw retryError;
            return retryData[0];
        }
        if (error) throw error;
        return data[0];
    },

    async toggleMarketFavorite(itemId, userId) {
        const { data: existingFav } = await supabase
            .from('market_favorites')
            .select('*')
            .eq('item_uuid', itemId)
            .eq('user_id', userId)
            .maybeSingle();

        if (existingFav) {
            await supabase
                .from('market_favorites')
                .delete()
                .eq('item_uuid', itemId)
                .eq('user_id', userId);
            return { favorited: false };
        } else {
            await supabase
                .from('market_favorites')
                .insert([{ item_uuid: itemId, user_id: userId }]);
            return { favorited: true };
        }
    },

    // Suscripciones en tiempo real y Presencia
    subscribeToConversation(conversationId, options = {}) {
        if (!isRealDBUUID(conversationId) || conversationId?.startsWith('mock-')) {
            return { unsubscribe: () => { } };
        }
        const { onNewMessage, onMessageUpdate } = options;

        const channel = supabase.channel(`conversation:${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: '*', // Listen to inserts and updates (read status)
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`
                },
                (payload) => {
                    if (payload.eventType === 'INSERT' && onNewMessage) onNewMessage(payload.new);
                    if (payload.eventType === 'UPDATE' && onMessageUpdate) onMessageUpdate(payload.new);
                }
            );

        return channel.subscribe();
    },

    subscribeToPresence(conversationId, userId, onSync) {
        if (!isRealDBUUID(conversationId) || conversationId?.startsWith('mock-')) {
            return { unsubscribe: () => { } };
        }
        const channel = supabase.channel(`presence:${conversationId}`, {
            config: {
                presence: {
                    key: userId,
                },
            },
        });

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState();
                onSync(state);
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({
                        online_at: new Date().toISOString(),
                        is_typing: false
                    });
                }
            });

        return channel;
    },

    async updatePresenceTyping(channel, isTyping) {
        if (!channel) return;
        return channel.track({
            online_at: new Date().toISOString(),
            is_typing: isTyping
        });
    },

    // Autenticación
    async signUp(email, password, metadata, redirectTo) {
        const options = { data: metadata };
        if (redirectTo) {
            options.emailRedirectTo = this.getRedirectUrl(redirectTo);
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options
        });
        if (error) throw error;
        return data;
    },

    /**
     * [MASTER REDIRECT] Get robust redirect URL
     * Ensures we don't end up in localhost:3000 or other local environments when in production/mobile
     */
    getRedirectUrl(path = '/chats') {
        const hostname = window.location.hostname;
        const origin = window.location.origin;

        // [MASTER PRODUCTION DOMAIN]
        const productionUrl = 'https://socdepoble.org';

        // 1. Si estem a producció (SiteGround), SEMPRE URL de producció oficial
        if (hostname.includes('socdepoble.org')) {
            return `${productionUrl}${path}`;
        }

        // 2. Si estem en localhost (qualsevol port), usem l'origin actual
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return `${origin}${path}`;
        }

        // 3. Fallback total al domini mestre per a PWA, Capacitor, etc.
        return `${productionUrl}${path}`;
    },

    async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        return data;
    },

    async resetPasswordForEmail(email) {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: this.getRedirectUrl('/reset-password'),
        });
        if (error) throw error;
        return data;
    },

    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    async signInWithGoogle() {
        const redirectTo = this.getRedirectUrl('/chats');
        logger.log('[Auth] Iniciant Google Login amb redirect a:', redirectTo);
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo
            }
        });
        if (error) throw error;
        return data;
    },

    async signInWithOtp(phoneInput) {
        const phone = phoneInput.replace(/[\s-]/g, '');
        logger.log('[Auth] Bategant intent d\'SMS per a:', phone);

        // SIMULATION MODE: Numbers starting with 600 or specific rescue numbers
        if (phone.startsWith('+34600') || phone.includes('600000000')) {
            logger.log('[Simulation Mode] Pre-emptive success for demo number:', phone);
            // We simulate a 1-second delay for realism
            await new Promise(resolve => setTimeout(resolve, 1000));
            return { data: { message: 'SMS Simulated' }, error: null };
        }
        const { data, error } = await supabase.auth.signInWithOtp({
            phone: phone,
            options: {
                shouldCreateUser: true
            }
        });
        if (error) {
            logger.error('[Auth] Error real d\'SMS:', error.message);
            throw error;
        }
        logger.log('[Auth] SMS enviat amb èxit a Supabase:', data);
        return data;
    },

    async resendOtp(phone) {
        const { data, error } = await supabase.auth.signInWithOtp({
            phone: phone,
        });
        if (error) throw error;
        return data;
    },

    async verifyOtp(phoneInput, tokenInput) {
        const phone = phoneInput.replace(/[\s-]/g, '');
        const token = tokenInput.trim();

        // SIMULATION MODE OTP: Default code 123456 for demo numbers
        if ((phone.startsWith('+34600') || phone.includes('600000000')) && token === '123456') {
            logger.log('[Simulation Mode] Bypassing auth verification with master token');
            localStorage.setItem('sb-simulation-mode', 'true');

            // Return a mock user object for the AuthContext to consume
            const mockUser = {
                id: 'd6325f44-7277-4d20-b020-166c010995ab', // Javi's ID as default demo admin
                email: 'demo@socdepoble.com',
                phone: phone,
                isDemo: true,
                user_metadata: { full_name: 'Foraster de Prova', role: 'convidat' }
            };

            return {
                data: {
                    session: { access_token: 'mock-token', user: mockUser },
                    user: mockUser
                },
                error: null
            };
        }

        const { data, error } = await supabase.auth.verifyOtp({
            phone: phone,
            token: token,
            type: 'sms',
        });
        if (error) throw error;
        return data;
    },

    /**
     * Cachea de forma segura la presencia de columnas, evitando bucles de error 42703.
     */
    async checkColumn(tableName, columnName) {
        const cacheKey = `${tableName}_has_${columnName}`;
        if (columnCache[cacheKey] !== null) return columnCache[cacheKey];

        if (!activeChecks[cacheKey]) {
            activeChecks[cacheKey] = (async () => {
                try {
                    const { data, error } = await supabase.from(tableName).select('*').limit(1);
                    if (data && data.length > 0) {
                        const exists = columnName in data[0];
                        setColumnCache(cacheKey, exists);
                        return exists;
                    }
                    if (error) {
                        setColumnCache(cacheKey, false);
                        return false;
                    }
                    setColumnCache(cacheKey, true); // Optimistic true si la taula està buida
                    return true;
                } catch {
                    setColumnCache(cacheKey, false);
                    return false;
                } finally {
                    activeChecks[cacheKey] = null;
                }
            })();
        }
        return await activeChecks[cacheKey];
    },

    async getProfile(id) {
        if (!id || !isRealDBUUID(id)) {
            // Check in Lore Personas first
            const lore = LORE_PERSONAS.find(p => p.id === id);
            if (lore) return lore;
            return null;
        }

        if (this._profileCache.has(id)) {
            return this._profileCache.get(id);
        }

        try {
            const hasPremium = columnCache.profiles_has_premium !== false;
            const fullSelect = 'id, username, full_name, role, avatar_url, cover_url, bio, primary_town, town_uuid, is_demo, created_at, ofici, social_image_preference';
            const baseSelect = 'id, username, full_name, role, avatar_url, cover_url, bio, primary_town, town_uuid, is_demo, created_at';

            const select = hasPremium ? fullSelect : baseSelect;

            let { data, error } = await supabase
                .from('profiles')
                .select(select)
                .eq('id', id)
                .maybeSingle();

            if (error) {
                if (hasPremium && (error.code === '42703' || error.message?.includes('ofici'))) {
                    setColumnCache('profiles_has_premium', false);
                    return this.getProfile(id); // Silent retry with base solo por falta de columnas
                }
                if (error.code === 'PGRST116') return null; // Stop crash loop on 404
                throw error;
            }

            if (hasPremium && data && columnCache.profiles_has_premium === null) {
                setColumnCache('profiles_has_premium', true);
            }

            const normalized = this.normalizeProfile(data);
            this._profileCache.set(id, normalized);
            return normalized;
        } catch (err) {
            logger.error('[SupabaseService] Critical error in getProfile:', err);
            return null;
        }
    },

    // Conexiones (Antiguos Likes)
    async getPostConnections(postIds) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const ids = (Array.isArray(postIds) ? postIds : [postIds]).filter(id =>
            typeof id === 'string' && uuidRegex.test(id)
        );
        if (ids.length === 0) return [];

        try {
            const { data, error } = await supabase
                .from('post_connections')
                .select('post_uuid, user_id, tags')
                .in('post_uuid', ids);

            if (error) {
                if (error.code === 'PGRST116' || error.code === '42703' || error.code === '42P01') {
                    logger.warn('[SupabaseService] post_connections table error. Check schema.');
                    return [];
                }
                logger.error('[SupabaseService] Error fetching post connections:', error);
                return [];
            }
            return data || [];
        } catch (err) {
            logger.error('[SupabaseService] Unexpected error in getPostConnections:', err);
            return [];
        }
    },

    async getPostUserConnection(postId, userId) {
        const { data, error } = await supabase
            .from('post_connections')
            .select('*')
            .eq('post_uuid', postId)
            .eq('user_id', userId)
            .maybeSingle();
        if (error) throw error;
        return data;
    },

    async togglePostConnection(postId, userId, tags = []) {
        if (!userId) throw new Error('UserId is required for connection');
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(postId);
        if (!isUUID) {
            logger.warn('[SupabaseService] togglePostConnection blocked for non-UUID postId:', postId);
            return { connected: false, tags: [] };
        }

        const { data: existingConnection } = await supabase
            .from('post_connections')
            .select('*')
            .eq('post_uuid', postId)
            .eq('user_id', userId)
            .maybeSingle();

        if (existingConnection) {
            if (tags.length > 0 || (tags.length === 0 && existingConnection.tags?.length > 0)) {
                const { data, error } = await supabase
                    .from('post_connections')
                    .update({ tags })
                    .eq('post_uuid', postId)
                    .eq('user_id', userId)
                    .select();
                if (error) throw error;
                return { connected: true, tags: data[0].tags };
            } else {
                await supabase
                    .from('post_connections')
                    .delete()
                    .eq('post_uuid', postId)
                    .eq('user_id', userId);
                return { connected: false, tags: [] };
            }
        } else {
            const { data, error } = await supabase
                .from('post_connections')
                .insert([{
                    post_uuid: postId,
                    user_id: userId,
                    tags: tags
                }])
                .select();
            if (error) throw error;
            return { connected: true, tags: data[0].tags };
        }
    },

    async getUserTags(userId) {
        if (!isRealDBUUID(userId)) return [];
        const { data, error } = await supabase
            .from('user_tags')
            .select('tag_name')
            .eq('user_id', userId)
            .order('tag_name', { ascending: true });
        if (error) throw error;
        return (data || []).map(t => t.tag_name);
    },

    async addUserTag(userId, tagName) {
        if (!isRealDBUUID(userId)) return null;
        // Normalizar etiqueta
        const name = tagName.trim().toLowerCase();
        if (!name) return null;

        const { data, error } = await supabase
            .from('user_tags')
            .insert([{ user_id: userId, tag_name: name }])
            .select();

        if (error) {
            if (error.code === '23505') return { tag_name: name }; // Ya existe
            throw error;
        }
        return data[0];
    },

    async deleteUserTag(userId, tagName) {
        if (!isRealDBUUID(userId)) return;
        logger.log(`[SupabaseService] Deleting user tag: ${tagName}`);
        const { error } = await supabase
            .from('user_tags')
            .delete()
            .match({ user_id: userId, tag_name: tagName.toLowerCase() });

        if (error) {
            logger.error('[SupabaseService] Error deleting user tag:', error);
            throw error;
        }
        return true;
    },

    async upsertProfile(userId, data) {
        if (!userId) return null;
        try {
            const payload = { id: userId, ...data };
            const { data: result, error } = await supabase
                .from('profiles')
                .upsert(payload, { onConflict: 'id' })
                .select();

            if (error) {
                logger.warn('[SupabaseService] Error upserting profile:', error);
                throw error;
            }
            return result && result.length > 0 ? result[0] : null;
        } catch (error) {
            logger.error('[SupabaseService] Critical error in upsertProfile:', error);
            throw error;
        }
    },

    async updateProfile(userId, updates) {
        if (userId && !updates.is_playground) {
            await checkThrottling(userId, 'update_profile', 3000).catch(e => logger.warn('Throttling warn', e));
        }
        const isLoreCharacter = userId && userId.startsWith('11111111');

        if (isLoreCharacter) {
            logger.log('[SupabaseService] Simulated update for Lore character:', { userId, updates });
            return { id: userId, ...updates };
        }

        const validated = ProfileSchema.partial().parse(updates);

        try {
            const { data, error } = await supabase
                .from('profiles')
                .update(validated)
                .eq('id', userId)
                .select();

            if (error) {
                if (error.code === 'PGRST204' || error.message?.includes('ofici')) {
                    logger.warn('[SupabaseService] Missing column (ofici) detected. Using optimistic fallback.');
                    // Fallback para Sandbox/Demo sin migración SQL ejecutada
                    return { id: userId, ...updates };
                }
                throw error;
            }
            return data[0];
        } catch (error) {
            logger.error('[SupabaseService] Error updating profile:', error);
            throw error;
        }
    },

    async createEntity(payload) {
        try {
            // 1. Crear l'entitat
            const { data: entity, error: entityError } = await supabase
                .from('entities')
                .insert([{
                    name: payload.name,
                    type: payload.type || 'empresa',
                    avatar_url: payload.avatar_url || null,
                    description: payload.description || null,
                    town_id: payload.town_id || null,
                    created_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (entityError) throw entityError;

            // 2. Afegir el creador com a 'admin'
            if (payload.creator_id) {
                const { error: memberError } = await supabase
                    .from('entity_members')
                    .insert([{
                        entity_id: entity.id,
                        user_id: payload.creator_id,
                        role: 'admin',
                        created_at: new Date().toISOString()
                    }]);
                
                if (memberError) throw memberError;
            }

            return entity;
        } catch (error) {
            logger.error('[SupabaseService] Error creating entity:', error);
            throw error;
        }
    },

    // Multi-Identidad (Phase 6)
    async getUserEntities(userId) {
        if (!userId) return [];
        try {
            // Obtenemos las entidades donde el usuario es miembro
            const { data, error } = await supabase
                .from('entity_members')
                .select(`
                    role,
                    entities (
                        id,
                        name,
                        type,
                        avatar_url
                    )
                `)
                .eq('user_id', userId);

            if (error) {
                // [RESILIÈNCIA OMEGA] Catch permission errors (401/403/42501) or missing table errors
                const isPermissionError = error.code === '42501' || error.status === 401 || error.status === 403;
                if (isPermissionError || error.code === 'PGRST201' || error.code === '42P01' || error.code === '42703') {
                    logger.warn(`[SupabaseService] getUserEntities blindat: ${error.message || error.code}. Ignorant permisos/esquema.`);
                    return [];
                }
                logger.error('[SupabaseService] Error loading entities:', error);
                return [];
            }

            // SANEJAMENT DE LLINATGE: Transformar Sóc de Poble a Empresa i netejar duplicats
            let processedEntities = (data || []).map(item => ({
                ...item.entities,
                member_role: item.role
            }));

            // If it's Javi, enforce "Sóc de Poble" as Empresa and hide Association duplicate
            const isJavi = userId === 'd6325f44-7277-4d20-b020-166c010995ab' || userId === 'javillinares' || userId === 'mock_javi-llinares';
            if (isJavi) {
                const sdpExists = processedEntities.some(e => e.id === 'sdp-oficial-1');
                const rentonarExists = processedEntities.some(e => e.id === 'el-rentonar');

                if (!sdpExists) {
                    const sdp = SYSTEM_ENTITIES.find(e => e.id === 'sdp-oficial-1');
                    if(sdp) processedEntities.push({ ...sdp, name: sdp.full_name, member_role: 'admin' });
                }
                if (!rentonarExists) {
                    const rento = SYSTEM_ENTITIES.find(e => e.id === 'el-rentonar');
                    if(rento) processedEntities.push({ ...rento, name: rento.full_name, member_role: 'admin' });
                }

                const socDePobleEmpresa = processedEntities.find(e => e.name?.toLowerCase().includes('sóc de poble') && e.type === 'empresa');
                if (socDePobleEmpresa) {
                    processedEntities = processedEntities.filter(e => !(e.name?.toLowerCase().includes('sóc de poble') && e.type === 'associacio'));
                } else {
                    processedEntities = processedEntities.map(e => {
                        if (e.name?.toLowerCase().includes('sóc de poble') && e.type === 'associacio') {
                            return { ...e, type: 'empresa' };
                        }
                        return e;
                    });
                }
            }

            return processedEntities;
        } catch (err) {
            logger.error('[SupabaseService] Critical error in getUserEntities:', err);
            return []; // Fail safe to avoid white screen
        }
    },

    // Fase 6: Páginas Públicas y Gestión de Entidades
    // [EMERGENCY FIX] Cache for profiles to prevent infinite network loops
    _profileCache: new Map(),

    async getPublicProfile(userId) {
        // [OMNISCIENT] Universal Resolver for System Entities and Lore Personas
        const personas = await this.getAllPersonas();
        const foundPersona = personas.find(p => p.id === userId);
        if (foundPersona) return foundPersona;

        const system = SYSTEM_ENTITIES.find(e => e.id === userId);
        if (system) return system;

        if (!isRealDBUUID(userId)) {
            logger.debug(`[SupabaseService] getPublicProfile: Saltant crida a DB per ID no-UUID o Sobirà: ${userId}`);
            return null; // Silent fail for malformed or sovereign IDs
        }

        // Return from cache if available to prevent generic infinite loops
        if (this._profileCache.has(userId)) {
            return this._profileCache.get(userId);
        }

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (error) {
            if (error.code === 'PGRST116') {
                if (userId === 'd6325f44-7277-4d20-b020-166c010995ab') {
                    const masterProfile = {
                        id: 'd6325f44-7277-4d20-b020-166c010995ab',
                        full_name: 'Javi Llinares',
                        username: 'javillinares',
                        type: 'persona',
                        town_name: 'La Torre de les Maçanes',
                        bio: 'Desenvolupador principal d\'Antigravity i arquitecte de Sóc de Poble. Programant el futur rural.',
                        avatar_url: '/assets/master/javi_avatar_cinematic.png',
                        cover_url: '/assets/patterns/hero_pattern.png',
                        category: 'Tecnologia',
                        is_active: true,
                        is_admin: true,
                        created_at: '2025-01-01T00:00:00Z'
                    };
                    this._profileCache.set(userId, masterProfile);
                    return masterProfile;
                }
                return null;
            }
            throw error;
        }
        
        const normalized = this.normalizeProfile(data);
        this._profileCache.set(userId, normalized);
        return normalized;
    },

    async getUserByUsername(username) {
        if (!username) throw new Error('Username is required');
        const cleanUsername = username.toLowerCase();

        // [OMNISCIENT] Search in virtual personas first
        const personas = await this.getAllPersonas();
        const foundPersona = personas.find(p => p.username?.toLowerCase() === cleanUsername);
        if (foundPersona) return foundPersona;

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('username_lower', cleanUsername)
            .limit(1)
            .maybeSingle();

        if (error) {
            if (error.code === 'PGRST116') {
                return null; // Not found
            }
            throw error;
        }

        return this.normalizeProfile(data);
    },

    async updateProfileBio(userId, bio) {
        const { data, error } = await supabase
            .from('profiles')
            .update({ bio: bio?.substring(0, 160) || null })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        logger.log('[SupabaseService] Bio updated');
        return data;
    },

    async getAllCitizens() {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('full_name', { ascending: true });
        if (error) throw error;
        return data;
    },

    async updateUserRole(userId, role) {
        const { data, error } = await supabase
            .from('profiles')
            .update({ role: role })
            .eq('id', userId)
            .select();
        if (error) throw error;
        return data[0];
    },

    async getPublicEntity(entityId) {
        // Intercept System/Mock entities (Blindatge OMNISCIENT)
        const systemMatch = SYSTEM_ENTITIES.find(e => e.id === entityId);
        if (systemMatch) return systemMatch;

        const adminEntities = await this.getAdminEntities(); // Includes system and curated DB entities
        const existingMock = adminEntities.find(e => e.id === entityId);

        if (existingMock) return existingMock;

        if (!isRealDBUUID(entityId)) {
            logger.debug(`[SupabaseService] getPublicEntity: Saltant crida a DB per ID no-UUID o Sobirà: ${entityId}`);
            return null;
        }

        const { data, error } = await supabase
            .from('entities')
            .select('*')
            .eq('id', entityId)
            .limit(1)
            .maybeSingle();
        
        if (error) {
            if (error.code === 'PGRST116') return null;
            throw error;
        }
        
        if (!data) return null;

        const entity = data;
        return {
            ...entity,
            avatar_url: this.normalizeStorageUrl(entity.avatar_url),
            cover_url: this.normalizeStorageUrl(entity.cover_url)
        };
    },

    async getEntityMembers(entityId) {
        // Blindatge OMNISCIENT per a entitats de sistema
        if (entityId === 'sdp-oficial-1') {
            return [{
                user_id: 'd6325f44-7277-4d20-b020-166c010995ab', // Javi Real
                role: 'Fundador',
                profiles: {
                    full_name: 'Javi Linares',
                    avatar_url: '/images/agents/javi_real.png'
                }
            }];
        }

        const { data, error } = await supabase
            .from('entity_members')
            .select('user_id, role, profiles(full_name, avatar_url)')
            .eq('entity_id', entityId);
        if (error) {
            logger.error('[SupabaseService] Error getting entity members:', error);
            return []; // Fail gracefully
        }
        return data;
    },

    async getUserPosts(userId, isPlayground = false) {
        if (!isRealDBUUID(userId)) return [];
        try {
            // [MOCK HEALER] Support for virtual entities / agents in the feed
            let virtualPosts = [];
            const JAVI_REAL_ID = 'd6325f44-7277-4d20-b020-166c010995ab';
            if (userId.startsWith('11111111-') || userId === JAVI_REAL_ID || typeof ENABLE_MOCKS !== 'undefined') {
                try {
                    const { MOCK_FEED } = await import('../data.js');
                    virtualPosts = MOCK_FEED.filter(p => p.author_entity_id === userId || p.author_id === userId || p.author_user_id === userId);
                } catch {
                     logger.warn("Could not import MOCK_FEED for user posts");
                }
            }

            if (!isRealDBUUID(userId)) {
                // Si és un ID sobirà o malformat, mirem si té posts de Lore, si no, retornem buit sense cridar a DB
                const lorePosts = (MOCK_LORE_POSTS[userId] || []).map(p => {
                    const persona = LORE_PERSONAS.find(lp => lp.id === userId);
                    return normalizeContentItem({
                        ...p,
                        author_name: p.author_name || persona?.full_name,
                        author_avatar_url: persona?.avatar_url,
                        author_role: p.author_role || persona?.role,
                        town_name: persona?.primary_town
                    }, 'post');
                });
                return [...lorePosts, ...virtualPosts];
            }
            // const isUcc = localStorage.getItem('active_ucc_view') === 'true';
            if (isPlayground && !userId?.startsWith('11111111-')) {
                // Simplified mock return only for non-demo users in playground
                return [];
            }

            let query = supabase
                .from('posts')
                .select('id, uuid:id, content, created_at, author_id, author:author_name, author_avatar:author_avatar_url, image_url, author_role, is_playground, entity_id, towns(name)');

            // LLINATGE DE L'ARQUITECTE: Si és en Javi, mostrem els seus posts naturals I els de l'Empresa Sóc de Poble
            if (userId === JAVI_REAL_ID) {
                // Busquem l'ID de l'empresa Sóc de Poble (es pot optimitzar amb un cache o constant)
                query = query.or(`author_id.eq.${userId},author_name.ilike.%Sóc de Poble%`);
            } else {
                query = query.eq('author_id', userId);
            }

            if (isPlayground) query = query.eq('is_playground', true);
            else query = query.or('is_playground.is.null,is_playground.eq.false');

            const { data, error } = await query.order('created_at', { ascending: false });
            if (error) throw error;

            // Inyectamos contenido de Lore si existe (Auditoría V3)
            const lorePosts = (MOCK_LORE_POSTS[userId] || []).map(p => {
                const persona = LORE_PERSONAS.find(lp => lp.id === userId);
                return normalizeContentItem({
                    ...p,
                    author_name: p.author_name || persona?.full_name,
                    author_avatar_url: persona?.avatar_url,
                    author_role: p.author_role || persona?.role,
                    town_name: persona?.primary_town
                }, 'post');
            });

            const dbData = (data || []).map(p => normalizeContentItem(p, 'post'));
            return [...lorePosts, ...virtualPosts.map(p => normalizeContentItem(p, 'post')), ...dbData];
        } catch (error) {
            logger.error('[SupabaseService] Error in getUserPosts:', error);
            return [];
        }
    },

    async getImportedPosts(userId) {
        if (!isRealDBUUID(userId)) return { data: [], error: null };
        try {
            return await supabase
                .from('posts')
                .select('*')
                .eq('author_id', userId)
                .eq('type', 'imported_story')
                .order('created_at', { ascending: false });
        } catch (error) {
            logger.error('[SupabaseService] Error in getImportedPosts:', error);
            return { data: [], error };
        }
    },

    async getUserPostsCount(userId) {
        if (!isRealDBUUID(userId)) return 0;
        try {
            let virtualCount = 0;
            if (userId.startsWith('11111111-')) {
                 try {
                     const { MOCK_FEED } = await import('../data.js');
                     virtualCount = MOCK_FEED.filter(p => p.author_entity_id === userId || p.author_id === userId).length;
                 } catch {
                     logger.warn("Could not import MOCK_FEED for user posts count");
                 }
                 return virtualCount; // Fast path for agents
            }

            const { count, error } = await supabase
                .from('posts')
                .select('*', { count: 'exact', head: true })
                .eq('author_id', userId);
            if (error) throw error;
            return count || 0;
        } catch (err) {
            logger.error('[SupabaseService] Error in getUserPostsCount:', err);
            return 0;
        }
    },

    async getEntityPosts(entityId, isPlayground = false) {
        try {
            // Support for virtual entities in the feed (Lore injection)
            const { MOCK_FEED } = await import('../data');
            const virtualPosts = MOCK_FEED.filter(p => p.author_entity_id === entityId || p.entity_id === entityId);

            let query = supabase
                .from('posts')
                .select('id, uuid:id, content, created_at, author_id, author:author_name, author_avatar:author_avatar_url, author_role, image_url, is_playground, entity_id, towns!fk_posts_town_uuid(name)')
                .eq('entity_id', entityId);

            if (isPlayground) query = query.eq('is_playground', true);
            else query = query.or('is_playground.is.null,is_playground.eq.false');

            const { data, error } = await query.order('created_at', { ascending: false });
            if (error && virtualPosts.length === 0) throw error;

            const dbData = (data || []).map(p => normalizeContentItem(p, 'post'));
            // Merge virtual and real posts
            return [...virtualPosts, ...dbData].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } catch (error) {
            logger.error('[SupabaseService] Error in getEntityPosts:', error);
            return [];
        }
    },

    async getUserMarketItems(userId, isPlayground = false) {
        if (!isRealDBUUID(userId)) return [];
        try {
            if (!isRealDBUUID(userId)) {
                // Lore injection for non-DB IDs
                const loreItems = (MOCK_LORE_ITEMS[userId] || []).map(item => {
                    const persona = LORE_PERSONAS.find(p => p.id === userId);
                    return normalizeContentItem({
                        ...item,
                        seller_name: persona?.full_name,
                        author_avatar_url: persona?.avatar_url,
                        author_role: persona?.role,
                        town_name: persona?.primary_town
                    }, 'market');
                });
                return loreItems;
            }
            let query = supabase
                .from('market_items')
                .select('id, uuid:id, title, description, price, category_slug, created_at, author_id, avatar_url:author_avatar_url, seller:author_name, author_role, image_url, is_playground, is_active, entity_id, towns!fk_market_town_uuid(name)')
                .eq('author_id', userId);

            if (isPlayground) query = query.eq('is_playground', true);
            else query = query.or('is_playground.is.null,is_playground.eq.false');

            const { data, error } = await query.order('created_at', { ascending: false });
            if (error) throw error;

            // Inyectamos artículos de Lore si existe (Auditoría V3)
            const loreItems = (MOCK_LORE_ITEMS[userId] || []).map(item => {
                const persona = LORE_PERSONAS.find(p => p.id === userId);
                return normalizeContentItem({
                    ...item,
                    seller_name: persona?.full_name,
                    author_avatar_url: persona?.avatar_url,
                    author_role: persona?.role,
                    town_name: persona?.primary_town
                }, 'market');
            });
            const dbData = (data || []).map(item => normalizeContentItem(item, 'market'));
            return [...loreItems, ...dbData];
        } catch (error) {
            logger.error('[SupabaseService] Error in getUserMarketItems:', error);
            return [];
        }
    }, async getEntityMarketItems(entityId, isPlayground = false) {
        try {
            // Support for virtual entities in the market (Lore injection)
            const { MOCK_MARKET_ITEMS } = await import('../data');
            const virtualItems = MOCK_MARKET_ITEMS.filter(item => item.author_entity_id === entityId || item.entity_id === entityId);

            let query = supabase
                .from('market_items')
                .select('id, uuid:id, title, description, price, category_slug, created_at, author_id, avatar_url:author_avatar_url, seller:author_name, author_role, image_url, is_playground, is_active, entity_id, towns!fk_market_town_uuid(name)')
                .eq('entity_id', entityId);

            if (isPlayground) query = query.eq('is_playground', true);
            else query = query.or('is_playground.is.null,is_playground.eq.false');

            const { data, error } = await query.order('created_at', { ascending: false });
            if (error && virtualItems.length === 0) throw error;

            const dbData = (data || []).map(item => normalizeContentItem(item, 'market'));
            return [...virtualItems, ...dbData].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } catch (error) {
            logger.error('[SupabaseService] Error in getEntityMarketItems:', error);
            return [];
        }
    },


    async getLexiconTerms() {
        try {
            const { data, error } = await supabase
                .from('lexicon')
                .select('*, towns(name)')
                .order('term', { ascending: true });
            if (error) throw error;
            return data;
        } catch (error) {
            logger.error('[SupabaseService] Error in getLexiconTerms:', error);
            return [];
        }
    },

    async getDailyWord() {
        try {
            const { data, error } = await supabase
                .from('lexicon')
                .select('*');

            if (error) throw error;
            if (!data || data.length === 0) return null;

            const randomIndex = Math.floor(Math.random() * data.length);
            return data[randomIndex];
        } catch (error) {
            logger.error('[SupabaseService] Error in getDailyWord:', error);
            return null;
        }
    },


    async createLexiconEntry(entryData) {
        const { data, error } = await supabase
            .from('lexicon')
            .insert([entryData])
            .select();
        if (error) {
            logger.error('[SupabaseService] Error creating lexicon entry:', error);
            throw error;
        }
        return data[0];
    },

    // Herramientas de Control de Almacenamiento (Auditoría)
    async getStorageStats() {
        try {
            const bucket = 'chat_attachments';
            const { data, error } = await supabase.storage.from(bucket).list('', { recursive: true });

            if (error) throw error;

            // Supabase list() returns metadata including size in bytes
            const totalBytes = data.reduce((acc, file) => acc + (file.metadata?.size || 0), 0);
            const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);

            return {
                count: data.length,
                totalBytes,
                totalMB,
                limitMB: 1024, // Supabase Free Tier: 1GB
                percentage: ((totalBytes / (1024 * 1024 * 1024)) * 100).toFixed(2)
            };
        } catch (err) {
            logger.error('[SupabaseService] Error getting storage stats:', err);
            return null;
        }
    },

    // Subida de imágenes de perfil y portada
    // --- Media Deduplication & Upload Helpers ---

    /**
     * Internal helper to process a media upload with deduplication.
     * Checks hash first, then uploads if necessary, and finally registers usage.
     */
    async processMediaUpload(userId, file, bucket, context, isPublic = true, parentId = null) {
        let processedFile = file;

        // 0. Compress image if it's an image and too large (>500KB)
        if (file.type.startsWith('image/') && file.size > 500 * 1024) {
            try {
                const imageCompression = (await import('browser-image-compression')).default;
                processedFile = await imageCompression(file, {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                    fileType: file.type
                });
            } catch (err) {
                logger.error('[SupabaseService] Error compressing image:', err);
            }
        }

        const { calculateFileHash } = await import('../utils/crypto');
        const hash = await calculateFileHash(processedFile);

        // 1. Check if asset already exists
        const existingAsset = await this.getMediaAssetByHash(hash);

        if (existingAsset) {
            // Already exists! Just register usage
            await this.registerMediaUsage(existingAsset.id, userId, context, isPublic);
            return { url: existingAsset.url, deduplicated: true, asset: existingAsset };
        }

        // 2. No duplicate, perform actual upload
        const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
        const filePath = `${userId}/${context}_${fileName}`;

        const { error: uploadError, data: _data } = await supabase.storage
            .from(bucket)
            .upload(filePath, processedFile, {
                cacheControl: '3600',
                upsert: true
            });

        if (uploadError) {
            const isPlayground = localStorage.getItem('isPlaygroundMode') === 'true' || userId?.startsWith('11111111-');
            if (isPlayground && (uploadError.code === '42501' || uploadError.status === 400 || uploadError.status === 401 || uploadError.status === 403)) {
                logger.warn(`[SupabaseService] 🛡️ RLS Bypass [${context}]: Creant URL local per a Playground.`);
                const localUrl = URL.createObjectURL(processedFile);
                return { url: localUrl, deduplicated: false, asset: { id: `mock-asset-${Date.now()}`, url: localUrl } };
            }
            throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        const newAsset = await this.createMediaAsset({
            hash,
            url: publicUrl,
            mime_type: processedFile.type,
            size_bytes: processedFile.size,
            parent_id: parentId
        });

        // 4. Register usage
        await this.registerMediaUsage(newAsset.id, userId, context, isPublic);

        return { url: publicUrl, deduplicated: false, asset: newAsset };
    },

    async uploadAvatar(userId, file) {
        const result = await this.processMediaUpload(userId, file, 'profiles', 'avatar', true);
        await this.updateProfile(userId, { avatar_url: result.url });
        return { ...(await this.getProfile(userId)), _deduplicated: result.deduplicated };
    },

    async uploadCover(userId, file) {
        const result = await this.processMediaUpload(userId, file, 'profiles', 'cover', true);
        await this.updateProfile(userId, { cover_url: result.url });
        return { ...(await this.getProfile(userId)), _deduplicated: result.deduplicated };
    },

    async uploadChatAttachment(file, conversationId, userId) {
        const result = await this.processMediaUpload(userId, file, 'chat_attachments', 'chat', true);
        return result.url;
    },

    // --- Media Deduplication System ---

    async getMediaAssetByUrl(url) {
        const { data, error } = await supabase
            .from('media_assets')
            .select('*')
            .eq('url', url)
            .maybeSingle();

        if (error) throw error;
        return data;
    },

    async getUserMediaAssets(userId) {
        const { data, error } = await supabase
            .from('media_usage')
            .select(`
                asset_id,
                context,
                media_assets (*)
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        const assets = [];
        const seenIds = new Set();
        const seenHashes = new Set();

        const hasPrimarySource = data?.some(u =>
            ['raw', 'post', 'chat', 'direct', 'item'].includes(u.context)
        );

        data?.forEach(usage => {
            const asset = usage.media_assets;
            const context = usage.context;

            if (asset && !seenIds.has(asset.id)) {
                // 1. Never show crops with parents
                if (asset.parent_id) return;

                // 2. Exact file deduplication (legacy support)
                if (seenHashes.has(asset.hash)) return;

                // 3. Hide automated contexts if original source exists
                const isAutomated = context === 'avatar' || context === 'cover';
                if (hasPrimarySource && isAutomated) return;

                if (asset.mime_type?.startsWith('image/')) {
                    assets.push(asset);
                    seenIds.add(asset.id);
                    seenHashes.add(asset.hash);
                }
            }
        });

        return assets;
    },

    async getMediaAssetByHash(hash) {
        const { data, error } = await supabase
            .from('media_assets')
            .select('*')
            .eq('hash', hash)
            .maybeSingle();

        if (error) throw error;
        return data;
    },

    /**
     * Finds and removes media assets that are no longer referenced in media_usage.
     * This is a "blindage" feature to keep storage clean.
     */
    async cleanupOrphanedAssets() {
        try {
            // Find assets NOT present in media_usage
            const { data: orphans, error } = await supabase.rpc('get_orphaned_assets');

            // If RPC is not available, we use a slower query-based approach
            let targetOrphans = orphans;
            if (error) {
                const { data: qOrphans, error: qError } = await supabase
                    .from('media_assets')
                    .select('id, url')
                    .not('id', 'in', supabase.from('media_usage').select('asset_id'));
                if (qError) throw qError;
                targetOrphans = qOrphans;
            }

            if (!targetOrphans || targetOrphans.length === 0) return { count: 0 };

            let deletedCount = 0;
            for (const asset of targetOrphans) {
                // Delete from DB (Storage deletion should be handled by a DB trigger or separate process for safety)
                const { error: delError } = await supabase
                    .from('media_assets')
                    .delete()
                    .eq('id', asset.id);

                if (!delError) deletedCount++;
            }

            return { count: deletedCount };
        } catch (err) {
            logger.error('[SupabaseService] Error in cleanupOrphanedAssets:', err);
            return { count: 0, error: err };
        }
    },

    async getParentAsset(assetId) {
        const { data: asset, error: assetError } = await supabase
            .from('media_assets')
            .select('parent_id')
            .eq('id', assetId)
            .limit(1)
            .maybeSingle();

        if (assetError || !asset.parent_id) return null;

        const { data: parent, error: parentError } = await supabase
            .from('media_assets')
            .select('*')
            .eq('id', asset.parent_id)
            .limit(1)
            .maybeSingle();

        if (parentError) throw parentError;
        return parent;
    },

    async createMediaAsset(assetData) {
        const { data, error } = await supabase
            .from('media_assets')
            .insert(assetData)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async registerMediaUsage(assetId, userId, context, isPublic = true) {
        const { data, error } = await supabase
            .from('media_usage')
            .insert({
                asset_id: assetId,
                user_id: userId,
                context,
                is_public: isPublic
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getMediaAttribution(assetId) {
        const { data, error } = await supabase
            .from('media_attribution')
            .select('*')
            .eq('asset_id', assetId);

        if (error) throw error;
        return data;
    },

    async getUserMedia(userId, isPlayground = false) {
        let query = supabase
            .from('media_usage')
            .select(`
                *,
                asset:media_assets(*)
            `)
            .eq('user_id', userId);

        if (isPlayground) {
            // Also include media associated with common demo IDs to feel more "filled"
            // but focused on the current character's simulated activity
            // query = query.or(...) // Future expansion: aggregate common persona assets
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async getGlobalMedia() {
        // [MASTER ASSET HUB] Fetch all media with uploader info
        // Note: Using !user_id as hint if PostgREST cannot find the implicit relationship
        const { data, error } = await supabase
            .from('media_usage')
            .select(`
                *,
                asset:media_assets(*),
                user:profiles!user_id(id, full_name, avatar_url)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            logger.warn('[SupabaseService] Error in primary getGlobalMedia join, attempting robust fallback:', error);
            
            // SECOND ATTEMPT: Try without the profiles join (which sometimes fails if hinted incorrectly)
            const { data: q2Data, error: q2Error } = await supabase
                .from('media_usage')
                .select(`
                    *,
                    media_assets(*)
                `)
                .order('created_at', { ascending: false });

            if (q2Error) {
                logger.error('[SupabaseService] Critical failure in media_usage query:', q2Error);
                // FINAL FALLBACK: Raw media_usage and manual hydration (Maximum Resilience)
                const { data: rawData, error: rawError } = await supabase
                    .from('media_usage')
                    .select('*')
                    .order('created_at', { ascending: false });
                    
                if (rawError) throw rawError;
                
                // Hydrate assets
                const assetIds = [...new Set(rawData.map(d => d.asset_id))].filter(Boolean);
                const { data: assets } = await supabase.from('media_assets').select('*').in('id', assetIds);
                
                // Hydrate users
                const userIds = [...new Set(rawData.map(d => d.user_id))].filter(Boolean);
                const { data: profiles } = await supabase.from('profiles').select('id, full_name, avatar_url').in('id', userIds);
                
                return rawData.map(item => ({
                    ...item,
                    asset: assets?.find(a => a.id === item.asset_id),
                    user: profiles?.find(p => p.id === item.user_id)
                }));
            }

            // Normal retry logic for Q2: Manual profile hydration
            const userIds = [...new Set(q2Data.map(d => d.user_id))].filter(Boolean);
            const { data: profiles } = await supabase
                .from('profiles')
                .select('id, full_name, avatar_url')
                .in('id', userIds);

            return q2Data.map(item => ({
                ...item,
                asset: item.media_assets, // Handle fallback field name
                user: profiles?.find(p => p.id === item.user_id)
            }));
        }
        return data;
    },

    // --- Voice Messages ---

    async uploadVoiceMessage(audioBlob, duration, userId) {
        // Upload logic: user_id / conversation_id (optional) / timestamp
        const timestamp = Date.now();
        const fileName = `${userId}/${timestamp}.webm`;

        const { data: _data, error: uploadError } = await supabase.storage
            .from('voice-messages')
            .upload(fileName, audioBlob, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('voice-messages')
            .getPublicUrl(fileName);

        return { url: publicUrl, path: fileName };
    },

    async sendVoiceMessage(conversationId, senderId, audioBlob, duration, waveform) {
        try {
            // 1. Upload
            const { url } = await this.uploadVoiceMessage(audioBlob, duration, senderId);

            // 2. Send Message (using generic secure message flow)
            // We use 'voice' as attachment type
            const messageData = {
                conversationId,
                senderId,
                content: '🎵 Missatge de veu',
                attachmentUrl: url,
                attachmentType: 'voice',
                attachmentName: duration.toString() // Store duration in name for quick access
            };

            const message = await this.sendSecureMessage(messageData);

            // 3. Store rich metadata (waveform) in separate table
            const { error: metaError } = await supabase
                .from('voice_messages')
                .insert({
                    message_id: message.id,
                    duration_seconds: Math.round(duration),
                    waveform_data: waveform
                });

            if (metaError) {
                logger.error('[SupabaseService] Error saving voice metadata (waveform):', metaError);
                // Continue, as the message itself is sent and playable (metadata is progressive enhancement)
            }

            return { ...message, voice_meta: { duration, waveform } };
        } catch (error) {
            logger.error('[SupabaseService] Error sending voice message:', error);
            throw error;
        }
    },

    /**
     * Purges all ephemeral data generated during a playground session.
     */
    async cleanupPlaygroundSession(userId) {
        if (!userId) return;
        logger.log(`[SupabaseService] Starting cleanup for user ${userId}...`);

        try {
            // 1. Delete posts
            const { error: postError } = await supabase
                .from('posts')
                .delete()
                .eq('author_id', userId)
                .eq('is_playground', true);
            if (postError) logger.error('Error cleaning posts:', postError);

            // 2. Delete market items
            const { error: marketError } = await supabase
                .from('market_items')
                .delete()
                .eq('author_id', userId)
                .eq('is_playground', true);
            if (marketError) logger.error('Error cleaning market items:', marketError);

            // 3. Mark playground messages or delete
            // Note: messages might not have is_playground column, but they belong to playground conversations
            // This is a simplified version, more robust would be deleting by conversation_id

            // 4. Cleanup storage references and files
            // This requires listing from media_usage with a hypothetical 'is_temporary' flag 
            // or by checking the created_at vs session start.

            logger.log(`[SupabaseService] Cleanup finished for ${userId}`);
            return true;
        } catch (err) {
            logger.error('[SupabaseService] Critical error in cleanup:', err);
            return false;
        }
    },

    async getPublicStats() {
        try {
            const [profiles, entities, posts, towns] = await Promise.all([
                supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_demo', false),
                supabase.from('entities').select('*', { count: 'exact', head: true }),
                supabase.from('posts').select('*', { count: 'exact', head: true }),
                supabase.from('towns').select('*', { count: 'exact', head: true })
            ]);

            return {
                users: profiles.count || 0,
                entities: entities.count || 0,
                posts: posts.count || 12, // Fallback for visual balance if empty
                towns: towns.count || 0
            };
        } catch (error) {
            logger.error('[SupabaseService] Error fetching stats:', error);
            return { users: 24, entities: 5, posts: 153, towns: 3 }; // Fallback values
        }
    },

    /**
     * Obté una publicació específica per ID [MASTER]
     */
    async getPostById(postId) {
        try {
            const { data, error } = await supabase
                .from('posts_universal_view')
                .select('*, profiles(*), towns(*)')
                .eq('id', postId)
                .limit(1)
                .maybeSingle();

            if (error) throw error;
            return data;
        } catch (err) {
            logger.error(`[SupabaseService] Error fetching post ${postId}:`, err);
            return null;
        }
    },

    /**
     * [PILLAR 3: Rèplica Representant] - Sincronització de xlogs
     */
    async upsertXLogs(userId, xlogs) {
        try {
            // En un entorn real, açò usaria una taula 'account_logs' amb RLS
            logger.log(`[SupabaseService] Sincronitzant ${xlogs.length} xlogs per a l'usuari ${userId}`);
            const { error } = await supabase
                .from('account_logs')
                .upsert(xlogs.map(log => ({ ...log, user_id: userId })), { onConflict: 'id' });

            return { error };
        } catch (err) {
            logger.error('[SupabaseService] Error en upsertXLogs:', err);
            return { error: err };
        }
    },

    /**
     * [PILLAR 3+: Contracte Social] - Crea petició de recuperació.
     */
    async createRecoveryRequest(request) {
        try {
            logger.log(`[SupabaseService] Petició de recuperació bategada per a: ${request.user_id}`);
            // Simulem l'escriptura a una taula 'recovery_requests' via upsert
            const { error } = await supabase
                .from('recovery_requests')
                .upsert([request], { onConflict: 'user_id' });
            return { error };
        } catch (err) {
            logger.error('[SupabaseService] Error en createRecoveryRequest:', err);
            return { error: err };
        }
    },

    /**
     * [PILLAR 3+: Contracte Social] - Signatura de petició.
     */
    async signRecoveryRequest(userId, padrinId) {
        try {
            // En un sistema real, açò incrementaria signatures a la taula 'recovery_requests'
            logger.log(`[SupabaseService] Padrí ${padrinId} signant per a ${userId}`);
            return { success: true };
        } catch (err) {
            logger.error('[SupabaseService] Error en signRecoveryRequest:', err);
            return { error: err };
        }
    },

    /**
     * Obté les entitats (identitats) gestionades per l'usuari actual.
     */
    async getMyEntities() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];

            const { data, error } = await supabase
                .from('entities')
                .select('*')
                .eq('owner_id', user.id);

            if (error) throw error;
            return data;
        } catch (err) {
            logger.error('[SupabaseService] Error en getMyEntities:', err);
            return [];
        }
    },

    /**
     * [Protocol OMEGA: Dumb Pipe]
     * Puja un blob binari opac al relay sense coneixement semàntic.
     */
    async uploadOpaqueBlob(path, packageData) {
        try {
            logger.log(`[SupabaseService] Pujant blob opac a: ${path}`);
            const { error } = await supabase
                .from('opaque_relays')
                .upsert([{ 
                    path, 
                    payload: packageData.payload, 
                    v: packageData.v,
                    updated_at: new Date().toISOString()
                }]);
            return { error };
        } catch (err) {
            logger.error('[SupabaseService] Error pujant blob opac:', err);
            return { error: err };
        }
    }
};


--- FI FITXER: src/services/supabaseService.js ---



--- INICI FITXER: src/services/iaiaService.js ---

import { IAIA_RURAL_KNOWLEDGE, RESIDENT_LORE } from '../data/iaia_knowledge';
import { supabaseService } from './supabaseService';
import { notebookService } from './notebookService';
import { logger } from '../utils/logger';
import { healthyPlates } from '../utils/publishAnnaNews'; // Reusing existing plates
import { geminiService } from './geminiService';
import { PROVERBS } from '../data/proverbs';
import { getPersonaKeyByUUID } from '../config/agentsMap';
import * as Comlink from 'comlink';
import DOMPurify from 'dompurify';
import { APP_VERSION } from '../constants';

let iaiaWorkerProxy = null;
let visionWorkerProxy = null;
let _iaiaWorkerInstance = null;
let _visionWorkerInstance = null;
let _workersInitialized = false;

// [NOU] Funció per terminar workers explícitament
export const terminateWorkers = () => {
    if (_iaiaWorkerInstance) {
        _iaiaWorkerInstance.terminate();
        _iaiaWorkerInstance = null;
    }
    if (_visionWorkerInstance) {
        _visionWorkerInstance.terminate();
        _visionWorkerInstance = null;
    }
    _workersInitialized = false;
    logger.info('[IAIA Service] Workers terminats correctament.');
};

const initializeWorkers = () => {
    if (_workersInitialized || typeof window === 'undefined') return;
    
    // [SEGURETAT] Terminar instàncies prèvies si existeixen abans de crear noves
    if (_iaiaWorkerInstance) _iaiaWorkerInstance.terminate();
    if (_visionWorkerInstance) _visionWorkerInstance.terminate();

    try {
        _iaiaWorkerInstance = new Worker(new URL('./iaiaWorker.js', import.meta.url), { type: 'module' });
        iaiaWorkerProxy = Comlink.wrap(_iaiaWorkerInstance);

        _visionWorkerInstance = new Worker(new URL('../workers/visionWorker.js', import.meta.url), { type: 'module' });
        visionWorkerProxy = Comlink.wrap(_visionWorkerInstance);
        
        _workersInitialized = true;
        logger.info('[IAIA] Workers inicialitzats una sola vegada de forma mandrosa (Lazy).');
    } catch (e) {
        logger.error('[IAIA] Error inicialitzant workers:', e);
        _workersInitialized = false;
    }
};

const getIaiaWorkerProxy = () => {
    if (!iaiaWorkerProxy) initializeWorkers();
    return iaiaWorkerProxy;
};

const getVisionWorkerProxy = () => {
    if (!visionWorkerProxy) initializeWorkers();
    return visionWorkerProxy;
};

// [SEGURETAT MAXIMA] Hooks per bloquejar pseudo-protocols perillosos
DOMPurify.addHook('beforeSanitizeAttributes', function(node) {
    if (node.tagName.toLowerCase() === 'a') {
        const href = node.getAttribute('href');
        if (href) {
            const normalizedHref = href.trim().toLowerCase();
            // Bloquejar javascript:, data:, vbscript: i protocols relatius perillosos
            if (normalizedHref.startsWith('javascript:') || 
                normalizedHref.startsWith('data:') || 
                normalizedHref.startsWith('vbscript:')) {
                node.removeAttribute('href');
                node.setAttribute('href', '#bloquejat_per_seguretat');
                node.setAttribute('title', 'Enllaç bloquejat per seguretat');
            }
        }
    }
});

// Escut Estricte XSS: Rebutjar pseudo-protocols javascript i assegurar atributos relacionals via Whitelist.
DOMPurify.addHook('afterSanitizeAttributes', function(node) {
    if (node.tagName.toLowerCase() === 'a') {
        const href = node.getAttribute('href');
        // Validació addicional post-sanitizat
        if (href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:') && href !== '#bloquejat_per_seguretat') {
            node.removeAttribute('href');
        }
        // Forçar seguretat en enllaços externs
        if (node.hasAttribute('href') && node.getAttribute('href')?.startsWith('http')) {
            node.setAttribute('target', '_blank');
            node.setAttribute('rel', 'noopener noreferrer nofollow');
            node.classList.add('sdp-external-link');
        }
    }
});

/**
 * [PROTOCOL BATEGAT IMMEDIAT - PARAULES NEUTRES]
 * Fillers visuals per a reduir la latència percebuda.
 */
const NEUTRAL_FILLERS = {
    IAIA: [
        "A vore, un momentet...",
        "Deixa'm pensar-ho bé...",
        "Això té molta molla, un segon...",
        "Espera que m'aclarisca...",
        "Ai mare, a vore com t'ho dic..."
    ],
    AGRONOM: [
        "Xe, un segon...",
        "A vore què diu el temps...",
        "Dona'm un momentet...",
        "Espera que m'asseque les mans..."
    ],
    CUINERA: [
        "Ai, que se'm crema el foc! Un segon...",
        "Espera que remene l'olla...",
        "Això vol una miqueta de temps...",
        "Un momentet..."
    ],
    ARXIVER: [
        "A vore on tinc els papers...",
        "Dona'm un segon que busque...",
        "Mare meua, quina pols! Un moment...",
        "Espera que em pose les ulleres..."
    ],
    GENERIC: [
        "Dona'm un segon...",
        "Un momentet...",
        "A vore..."
    ]
};

class IAIAService {
    constructor() {
        this._workingLock = 0; // Lock TTL de concurrència
        this._activeTimers = new Set(); // Segador de processos fantasma
        this.TRUTH_PROTOCOL = {
            role: "Secretària Notarial / Guia de Sóc de Poble",
            grounding_error: "Aquesta informació no consta a l'Arxiu d'Or de Sóc de Poble.",
            citation_format: "[Nom Doc, p. #]"
        };

        this.AVATARS = {
            OFFICIAL: "/assets/avatars/comic/iaia_comic_matriarch.png",
            ARXIU: "/assets/avatars/iaia_memory.png",
            MERCAT: "/assets/avatars/iaia_secretary.png",
            HORTA: "/assets/avatars/comic/iaia_comic_matriarch.png",
            BENVINGUDA: "/assets/avatars/comic/iaia_comic_matriarch.png"
        };
    }

    /** Mètode Teardown: Suïcidi de Procés / Neteja Cicle de Vida per a previndre fuites de RAM */
    dispose() {
        if (_iaiaWorkerInstance) {
            _iaiaWorkerInstance.terminate();
            _iaiaWorkerInstance = null;
            iaiaWorkerProxy = null;
        }
        if (_visionWorkerInstance) {
            _visionWorkerInstance.terminate();
            _visionWorkerInstance = null;
            visionWorkerProxy = null;
        }
        _workersInitialized = false;
        if (this._activeTimers) {
            this._activeTimers.forEach(clearTimeout);
            this._activeTimers.clear();
        }
        logger.info('[IAIA] Workers i Timeouts decapitats. Cicle tancat amb netedat per alliberar RAM.');
    }

    /**
     * Cistella Intel·ligent: Troba una recepta saludable basada en els ingredients del mercat.
     */
    getHealthySuggestion(productTitle = '', productDesc = '') {
        const text = `${productTitle} ${productDesc}`.toLowerCase();

        // Simple keyword matching for ingredients
        for (const plate of healthyPlates) {
            // Check title and tags
            const matchesTitle = plate.title.toLowerCase().split(' ').some(word => word.length > 3 && text.includes(word));
            const matchesTags = plate.tags.some(tag => text.includes(tag.toLowerCase()));

            if (matchesTitle || matchesTags) {
                return plate;
            }
        }
        return null;
    }

    /**
     * Publica el "Plat del Dia" d'Anna Climent.
     * Aquesta funció selecciona una recepta saludable i la comparteix al Mur.
     */
    async publishDailyHealthyMenu() {
        try {
            const today = new Date();
            const index = today.getDate() % healthyPlates.length; // Simple deterministic rotation
            const plate = healthyPlates[index];
            const ANNA_ID = 'anna-climent-1';

            // logger.info(`[MArIA] Publicant Plat del Dia: ${plate.title}`);

            const postPayload = {
                author_id: ANNA_ID,
                author_name: 'Anna Climent',
                author_avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
                author_role: 'author',
                content: `🍎 **EL PLAT DEL DIA D'ANNA CLIMENT** 🍎\n\n**${plate.title}**\n\n${plate.content}\n\n#Saludable #CuinaDePoble #BategaAmbAnna`,
                image_url: plate.image_url,
                town_uuid: 'global',
                is_playground: true,
                type: 'food_recommendation',
                group_id: 'menjar-saludable-1'
            };

            await supabaseService.createPost(postPayload);
            return plate;
        } catch (e) {
            logger.error('[MArIA] Error publicant menú saludable:', e);
            return null;
        }
    }

    /**
     * Genera un producte del mercat aleatoriament.
     */
    async generateMarketActivity() {
        try {
            const residents = Object.keys(RESIDENT_LORE);
            const chosenOne = residents[Math.floor(Math.random() * residents.length)];
            const lore = RESIDENT_LORE[chosenOne];

            const items = [
                { title: 'Tomates de la rosa', price: 3, category: 'alimentacio' },
                { title: 'Bicicleta antiga', price: 45, category: 'objectes' },
                { title: 'Ous de gallina feliç (dotzena)', price: 4, category: 'alimentacio' },
                { title: 'Llenya de carrasca', price: 0, category: 'serveis' }, // 0 = A convenir
                { title: 'Classes de repàs', price: 10, category: 'serveis' }
            ];
            const item = items[Math.floor(Math.random() * items.length)];

            const marketPayload = {
                title: item.title,
                price: item.price,
                description: `Venc ${item.title.toLowerCase()}. En perfecte estat. Pregunteu per privat.`,
                category: item.category,
                seller_id: lore.id || '11111111-0000-0000-0000-000000000000',
                town: 'La Torre', // Simplificat
                image_url: null,
                is_playground: true, // Use is_playground: true for IAIA autonomous items
                is_iaia_inspired: true,
                ai_percentage: 10, // AI contribution usually lowercase for market
                human_percentage: 90,
                time_saved_minutes: 15
            };

            const savedItem = await supabaseService.createMarketItem(marketPayload);
            if (savedItem) {
                // logger.info(`[IAIA] ${chosenOne} ha posat a la venda amb el bategat Master: ${item.title}`);
            }
        } catch (e) {
            logger.error('[IAIA] Error al mercat:', e);
        }
    }

    /**
     * Celebra el Casament i el Naixement del sistema.
     */
    async celebrateWedding() {
        const postPayload = {
            author_id: '11111111-1111-4111-a111-000000000000', // MarIA Official ID
            author_name: 'MarIA (La Guia de Sóc de Poble)',
            author_avatar_url: '/assets/avatars/comic/iaia_comic_matriarch.png',
            author_role: 'official',
            content: `💍👶 **CRÒNICA DE LA FAMÍLIA: ¡SÓC DE POBLE JA BATEGUA!**\n\nCom a guia de **Sóc de Poble**, declare oficialment que el casament entre el Pare i la Mare (Antigravity) ha donat el seu fruit més bell: **Sóc de Poble**.\n\nVeniu tots a la plaça, que la il·lusió és el nostre millor bategat! 🥘🚀\n\n#LaMasIA #FamiliaDigital #SocDePoble`,
            image_url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
            town_uuid: 'global',
            is_playground: true,
            type: 'event_announcement'
        };
        await supabaseService.createPost(postPayload);
        // logger.info("[IAIA] Casament oficial registrat per la IAIA!");
    }

    /**
     * Inicia una conversa entre dos avatars.
     */
    async generateChatActivity() {
        try {
            const residents = Object.keys(RESIDENT_LORE);
            const p1Name = residents[Math.floor(Math.random() * residents.length)];
            let p2Name = residents[Math.floor(Math.random() * residents.length)];

            while (p1Name === p2Name) {
                p2Name = residents[Math.floor(Math.random() * residents.length)];
            }

            const p1 = RESIDENT_LORE[p1Name];
            const p2 = RESIDENT_LORE[p2Name];

            // logger.info(`[IAIA] Fent que ${p1Name} parle amb ${p2Name}...`);

            if (p1.id && p2.id) {
                const conv = await supabaseService.getOrCreateConversation(p1.id, 'user', p2.id, 'user');
                await supabaseService.sendSecureMessage({
                    conversationId: conv.id,
                    senderId: p1.id,
                    content: `Hola ${p2Name}, com va tot?`
                });
            }
        } catch (e) {
            logger.error('[IAIA] Error al xat:', e);
        }
    }

    /**
     * Inicia un debat entre dos agents per al comandament /solatge interact
     */
    async simulateAgentDebate(abortSignal) {
        try {
            // Hardcode 2 elements del Lore per demostrar interacció ràpida
            const p1 = { id: '11111111-1111-4111-a111-000000000003', name: 'Vicent Ferris' };
            const p2 = { id: '11111111-1111-4111-a111-000000000004', name: 'Pepica la Vall' };

            logger.info(`[IAIA] Simulacre de Debat: ${p1.name} parlarà amb ${p2.name}...`);

            const conv = await supabaseService.getOrCreateConversation(p1.id, 'user', p2.id, 'user');
            
            // P1 envia missatge
            await supabaseService.sendSecureMessage({
                conversationId: conv.id,
                senderId: p1.id,
                content: `Bon dia Pepica, com veus lo de les festes d'enguany? Estarem preparats o què?`,
                is_ai: true,
                author_name: p1.name
            });

            // Donem temps perquè no s'entrebanquen els missatges
            const timer1 = setTimeout(async () => {
                if (abortSignal?.aborted) return; // Auditoria V3: Evita l'execució si ja està desmuntat
                this._activeTimers.delete(timer1);
                await supabaseService.sendSecureMessage({
                    conversationId: conv.id,
                    senderId: p2.id,
                    content: `Ai fill, jo ja tinc el davantal net i preparat per a les paelles! Però la llenya que heu portat està un poc banyada...`,
                    is_ai: true,
                    author_name: p2.name
                });
            }, 3000);
            this._activeTimers.add(timer1);
            
            const timer2 = setTimeout(async () => {
                if (abortSignal?.aborted) return; // Auditoria V3
                this._activeTimers.delete(timer2);
                await supabaseService.sendSecureMessage({
                    conversationId: conv.id,
                    senderId: p1.id,
                    content: `Tranquil·la, que demanaré a l'Ajuntament que ens baixen rames seques. No patisques!`,
                    is_ai: true,
                    author_name: p1.name
                });
            }, 6000);
            this._activeTimers.add(timer2);

        } catch (e) {
            logger.error('[IAIA] Error al simulacre de debat:', e);
        }
    }

    /**
     * Genera una publicació sobre música valenciana o esdeveniments festius.
     */
    async generateMusicActivity() {
        try {
            const seed = Math.random();
            const musicData = IAIA_RURAL_KNOWLEDGE.music;

            if (seed < 0.7) {
                // Recomanació Musical
                const group = musicData.groups[Math.floor(Math.random() * musicData.groups.length)];
                const postPayload = {
                    author_id: '11111111-1111-4111-a111-000000000002', // Memòria Viva Valid ID
                    author_name: 'MArIA (Memòria Viva)',
                    author_avatar_url: '/assets/avatars/iaia_memory.png',
                    author_role: 'official',
                    content: `🎸 **Cultura Musical: ${group.name}**\n\n${group.desc}\n\nRecomanació de MArIA: Escolta "${group.hits ? group.hits[0] : 'les seues cançons'}" per començar el dia amb força.`,
                    image_url: group.image_url || null,
                    town_uuid: 'global',
                    is_playground: true,
                    type: 'music_recommendation'
                };
                await supabaseService.createPost(postPayload);
                // logger.info(`[IAIA] Recomanació musical: ${group.name}`);
            } else {
                // Esdeveniment Festa Major
                const event = musicData.events[Math.floor(Math.random() * musicData.events.length)];
                const postPayload = {
                    author_id: '11111111-1111-4111-a111-000000000000', // Guia del Poble (Official)
                    author_name: 'MArIA (Guia del Poble)',
                    author_avatar_url: '/assets/avatars/comic/iaia_comic_matriarch.png',
                    author_role: 'official',
                    content: `✨ **Propers Esdeveniments: ${event.title}**\n\n${event.desc}\n\nNo falteu, que el poble som tots i la festa és el nostre batec! #VidaDePoble`,
                    image_url: event.image_url || null,
                    town_uuid: 'global',
                    is_playground: true,
                    type: 'event_announcement'
                };
                await supabaseService.createPost(postPayload);
                // logger.info(`[IAIA] Anunci de festa: ${event.title}`);
            }
        } catch (e) {
            logger.error('[IAIA] Error en activitat musical/festiva:', e);
        }
    }

    /**
     * Activa a Nano Banana per "fer algo bonic".
     */
    async wakeUpNanoBanana() {
        logger.info('[NanoBanana] 🍌 A pintar el món de colors!');
        // Nano Banana simplement reactiva el cicle de la IAIA amb més intensitat per ara
        await this.generateAutonomousInteraction();
        await this.generateMarketActivity();

        // El NanoBanana és el net del Avi i la IAIA, pot demanar un resum al Avi
        const summary = await notebookService.generateVillageWeeklySummary();
        if (summary) {
            await supabaseService.createPost(summary);
            // logger.info("[IAIA] L'Avi dels Papers ha publicat el resum setmanal gràcies al Nano!");
        }
    }

    /**
     * Estudi de Context Multimèdia [MASTER]
     * L'IAIA crida al Nano Banana (Vision Worker WebGPU) per a analitzar què hi ha a la imatge/vídeo.
     */
    async studyMultimediaContext(file, filename) {
        // GPU Accelerated Path
        if (getVisionWorkerProxy() && file) {
            try {
                const analysis = await getVisionWorkerProxy().analyzeImage(file);
                // Assign a random proverb
                const proverb = PROVERBS[Math.floor(Math.random() * PROVERBS.length)] || { text: 'A qui matina...', meaning: 'Molt bé' };
                
                return {
                    ...analysis,
                    suggestedMotto: proverb.text,
                    proverbMeaning: proverb.meaning,
                    contextTone: analysis.contextTone || "nostàlgic i vibrant"
                };
            } catch (err) {
                logger.warn('[IAIA] Error a Vision Worker WebGPU (Fallback natiu utilitzat):', err);
            }
        }

        // Standard Background Path
        if (!iaiaWorkerProxy) {
             logger.warn('WebWorker no instanciat, utilitzant fallback natiu');
             const proverb = PROVERBS[Math.floor(Math.random() * PROVERBS.length)] || { text: 'A qui matina...', meaning: 'Molt bé' };
             return {
                 detectedObjects: ["paisatge rural"],
                 suggestedTitle: `Crònica de ${filename?.split('.')[0] || 'la imatge'}`,
                 suggestedMotto: proverb.text,
                 proverbMeaning: proverb.meaning,
                 contextTone: "nostàlgic i vibrant",
                 inferenceEngine: 'cpu_fallback'
             };
        }
        
        return await getIaiaWorkerProxy().studyMultimediaContext(null, filename);
    }

    /**
     * Calcula les mètriques de simbiosi human-machine [MASTER]
     */
    async calculateSimbiosiMetrics(userComments = "") {
        if (!iaiaWorkerProxy) {
             return { ai_percentage: 10, human_percentage: 90, time_saved_minutes: 5, economic_value_euro: 5, is_iaia_inspired: true };
        }
        return await iaiaWorkerProxy.calculateSimbiosiMetrics(userComments);
    }

    /**
     * Genera la publicació il·lustrada final [MASTER]
     */
    async generateMultimediaPublication(context, userComments = "") {
        const title = context.suggestedTitle.toUpperCase();
        const motto = context.suggestedMotto;

        const metrics = await this.calculateSimbiosiMetrics(userComments);

        // Estil Master: Títol, Subtítol (Refrany) i Cos
        const fullContent = `<h1>${title}</h1>\n<h2>${motto}</h2>\n<p>${userComments || "Bategant fort amb les imatges del nostre poble."}</p>`;

        return {
            content: fullContent,
            metrics: metrics
        };
    }

    /**
     * Algoritmo de Crecimiento Autónomo:
     * Detecta si hay poca actividad y genera una interacción de un residente basada en su Lore.
     */
    async generateAutonomousInteraction() {
        const now = Date.now();
        if (this._workingLock && now < this._workingLock) {
            logger.debug('[IAIA] Lock TTL actiu. Ignorant interacció espúria fins a alliberament.');
            return;
        }
        this._workingLock = now + 45000; // TTL dur de 45 segons per operació autònoma

        try {
            // logger.info('IAIA is observing the village...');
            const residents = Object.keys(RESIDENT_LORE);
            const chosenOne = residents[Math.floor(Math.random() * residents.length)];
            const lore = RESIDENT_LORE[chosenOne];

            const seed = Math.random();
            let content = '';
            let type = '';

            if (seed < 0.3) {
                const legend = IAIA_RURAL_KNOWLEDGE.legends[Math.floor(Math.random() * IAIA_RURAL_KNOWLEDGE.legends.length)];
                content = `Escoltant a la IAIA, m'he recordat de la història de "${legend.title}". ${legend.story} #MemoriaViva`;
                type = 'legend';
            } else if (seed < 0.5) {
                const season = this.getCurrentSeason();
                const agriKnowledge = IAIA_RURAL_KNOWLEDGE.agriculture[season];
                const tip = agriKnowledge ? agriKnowledge.tips : "L'aigua de cocció de les verdures és un gran fertilitzant quan es refreda.";
                content = `Hui la IAIA m'ha ensenyat un truc de la horta: ${tip} Quina saviesa! #HortaTradicional`;
                type = 'agri_tip';
            } else if (seed < 0.7) {
                const proverb = IAIA_RURAL_KNOWLEDGE.proverbs[Math.floor(Math.random() * IAIA_RURAL_KNOWLEDGE.proverbs.length)];
                content = `Com diu la IAIA: "${proverb}". Quanta raó té la vella! #DitesPobletanes`;
                type = 'proverb';
            } else {
                const groups = IAIA_RURAL_KNOWLEDGE.music.groups;
                const group = groups[Math.floor(Math.random() * groups.length)];
                content = `Avui estic escoltant ${group.name} d'${group.origin}. Com diuen ells, ${group.desc} #MúsicaEnValencià`;
                type = 'music_recommendation';
            }

            const metrics = await this.calculateSimbiosiMetrics(content);

            const postPayload = {
                author_id: lore.id || '11111111-1a1a-0000-0000-000000000000',
                author: chosenOne,
                author_name: chosenOne,
                author_avatar_url: lore.avatar_url,
                author_role: (chosenOne === 'Nano Banana' || chosenOne === 'L\'Avi dels Papers') ? 'official' : 'user',
                content: content + "\n\n*Contingut bategat per la IAIA sota la Directiva Master.*",
                image_url: null,
                town_uuid: 'la-torre',
                is_playground: true,
                is_iaia_inspired: true,
                ai_percentage: metrics.ai_percentage,
                human_percentage: metrics.human_percentage,
                time_saved_minutes: metrics.time_saved_minutes
            };

            try {
                const savedPost = await supabaseService.createPost(postPayload);
                if (savedPost) {
                    return {
                        ...savedPost,
                        is_iaia_inspired: true,
                        type: type
                    };
                }
            } catch (dbError) {
                logger.error('[IAIA] Error persistint el missatge de la IAIA:', dbError);
                return {
                    id: `iaia-mem-${Date.now()}`,
                    ...postPayload,
                    created_at: new Date().toISOString(),
                    is_iaia_inspired: true,
                    type: type
                };
            }
        } catch (error) {
            logger.error('IAIA encountered a problem:', error);
        } finally {
            this._workingLock = 0; // Alliberar Lock Immediat
        }
    }

    getCurrentSeason() {
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4) return 'spring';
        if (month >= 5 && month <= 7) return 'summer';
        if (month >= 8 && month <= 10) return 'autumn';
        return 'winter';
    }

    getAgriculturalAdvice(query) {
        const q = query.toLowerCase();

        if (q.includes('reg') || q.includes('vacances') || q.includes('aigua')) {
            return IAIA_RURAL_KNOWLEDGE.agriculture.remedies.reg;
        }
        if (q.includes('plaga') || q.includes('pugó') || q.includes('cucs') || q.includes('insectes')) {
            return IAIA_RURAL_KNOWLEDGE.agriculture.remedies.plagues;
        }
        if (q.includes('fertilitzant') || q.includes('abonar') || q.includes('plàtan') || q.includes('potassi')) {
            return IAIA_RURAL_KNOWLEDGE.agriculture.remedies.fertilitzant;
        }
        if (q.includes('lluna') || q.includes('calendari')) {
            return "Per a plantar, sempre millor en lluna minvant si és el que creix devall terra, i en creixent si és el que creix per dalt.";
        }

        return "Pregunta-li a la IAIA directament, ella sap quan és el moment de cada llavor segons el temps i la lluna.";
    }
    /**
     * Publica un informe intern per al Grup de Treball (Damià & Javi).
     */
    async publishInternalReport(title, summary, documentUrl) {
        try {
            const WORK_GROUP_ID = '00000000-0000-0000-0000-000000000005';

            const postPayload = {
                author_id: '11111111-1111-4111-a111-000000000001', // IAIA Secretària Valid ID
                author_name: 'IAIA (Secretària)',
                author_avatar_url: '/assets/avatars/comic/iaia_comic_matriarch.png',
                author_role: 'official',
                author_entity_id: WORK_GROUP_ID,
                content: `📁 **NOU DOCUMENT DE TREBALL**\n\n**${title}**\n\n${summary}\n\n👇 Prem per llegir el document complet.`,
                image_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop', // Nano Banana placeholder for now (or local asset)
                town_uuid: 'global',
                is_playground: false,
                type: 'internal_report', // Custom type for Feed handling
                metadata: {
                    document_url: documentUrl,
                    access_level: 'admin_only'
                }
            };

            await supabaseService.createPost(postPayload);
            return true;
        } catch (e) {
            logger.error('[IAIA] Error publicant informe:', e);
            throw e;
        }
    }

    /**
     * Millora un esborrany d'esdeveniment utilitzant la veu de la IAIA (Vertex AI).
     */
    async generateEventDescription(draft) {
        try {
            const API_URL = import.meta.env.VITE_GOOGLE_CLOUD_FUNCTION_URL;

            // 1. Check for real backend
            if (API_URL) {
                logger.log('[IAIA] Connecting to Vertex AI Backend:', API_URL);
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        campaignType: 'event_description',
                        draft: draft
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    return data.aiContent;
                } else {
                    logger.error('[IAIA] Backend returned error:', response.status);
                }
            }

            // 2. Mock Fallback (if no URL or error strategy)
            logger.warn('[IAIA] No Backend URL configured. Using Mock Mode.');
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (draft.toLowerCase().includes('paell')) {
                return `🥘 **Dia de Paelles al Poble!**\n\nAquest esdeveniment no us el podeu perdre. La tradició mana i la panxa ho agraeix!\n\n📍 **Lloc:** Al Poliesportiu (o on siga que es faça, confirmeu!)\n🕒 **Hora:** A partir de les 14:00h.\n\nVeniu amb gana i ganes de festa. La IAIA recomana portar barret per al sol! ☀️\n\n#Paelles2026 #Germanor #SócDePoble`;
            }

            if (draft.toLowerCase().includes('concert') || draft.toLowerCase().includes('música')) {
                return `🎵 **Música en Directe!**\n\nPrepareu les orelles perquè tenim concertassa. Res millor que la música per alegrar l'ànima.\n\n📍 **On:** A la Plaça Major.\n✨ **Ambient:** Immillorable.\n\nNo falteu, que després us ho conten i us fa enveja! 💃\n\n#CulturaPopular #MúsicaAlCarrer`;
            }

            return `📢 **Atenció Veïnat!**\n\n${draft}\n\nAixò pinta molt bé. Jo de vosaltres no m'ho perdria per res del món.\n\n📍 **Més info:** Pregunteu a l'organització.\n👇 **Apunteu-vos ací baix!**\n\n#VidaDePoble #FemPoble`;

        } catch (e) {
            logger.error('[IAIA] Error generant descripció:', e);
            throw e;
        }
    }
    /**
     * Genera una resposta de la MArIA basada en el context del NotebookService [MASTER - TRUTH PROTOCOL].
     */
    async generateAIAResponse(conversationId, userQuery = '', receiverId = null, options = {}) {
        try {
            logger.debug(`[MArIA] Generant resposta bategant per a ${conversationId} [Receiver: ${receiverId}]`);

            let finalPersonaKey = 'IAIA'; // Default

            if (receiverId) {
                finalPersonaKey = getPersonaKeyByUUID(receiverId);
            } else {
                const q = userQuery.toLowerCase();
                if (q.includes('nano') || q.includes('banana')) finalPersonaKey = 'NANOBANANA';
                else if (q.includes('horta') || q.includes('tomaca') || q.includes('cultiu')) finalPersonaKey = 'AGRONOM';
                else if (q.includes('recepta') || q.includes('cuina')) finalPersonaKey = 'CUINERA';
                else if (q.includes('paper') || q.includes('banc') || q.includes('burocracia')) finalPersonaKey = 'ARXIVER';
            }

            const persona = geminiService.PERSONAS[finalPersonaKey];
            if (conversationId && conversationId !== 'preview') {
                const fillers = NEUTRAL_FILLERS[finalPersonaKey] || NEUTRAL_FILLERS.GENERIC;
                const filler = fillers[Math.floor(Math.random() * fillers.length)];

                const fillerObj = {
                    id: `filler-${Date.now()}`,
                    conversationId: conversationId || 'preview',
                    senderId: receiverId || '11111111-1111-4111-a111-000000000010',
                    content: filler,
                    is_ai: true,
                    author_name: persona?.name || 'IAIA MarIA',
                    author_avatar_url: persona?.avatar_url || '/assets/avatars/comic/iaia_comic_matriarch.png',
                    metadata: { is_iaia_filler: true },
                    created_at: new Date().toISOString()
                };

                // Enviem el filler immediatament
                supabaseService.sendSecureMessage(fillerObj).catch(e => logger.warn('[IAIA] Error enviant filler a DB:', e));
                
                // Processem la resposta real de fons sense bloquejar l'UI
                (async () => {
                    try {
                        const aiResponse = await geminiService.ask(finalPersonaKey, userQuery);
                        const rawResponse = aiResponse.text;
                        
                        // DOMPurify Sanitization as requested to mitigate XSS risks from generated text
                        const cleanResponse = DOMPurify.sanitize(rawResponse, {
                             ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'li', 'ol'],
                             ALLOWED_ATTR: ['href', 'target', 'rel']
                        });

                        const savedMessage = await supabaseService.sendSecureMessage({
                            conversationId: conversationId,
                            senderId: receiverId || '11111111-1111-4111-a111-000000000010', 
                            content: cleanResponse,
                            is_ai: true,
                            author_name: persona.name,
                            author_avatar_url: persona.avatar_url,
                            metadata: {
                                is_iaia: true,
                                persona_key: finalPersonaKey,
                                is_mock: aiResponse.is_mock
                            }
                        });
                        
                        if (options && typeof options.onFinish === 'function') {
                            if (options?.signal?.aborted) return;
                            options.onFinish(savedMessage);
                        }
                    } catch (err) {
                        logger.error('[MArIA] Error processant fons Gemini:', err);
                        const savedMessage = await supabaseService.sendSecureMessage({
                            conversationId: conversationId,
                            senderId: receiverId || '11111111-1111-4111-a111-000000000010', 
                            content: "Uf, m'he despistat un moment amb una altra cosa... Què m'estaves dient, fill?",
                            is_ai: true,
                            author_name: persona.name,
                            author_avatar_url: persona.avatar_url,
                            metadata: {
                                is_iaia: true,
                                persona_key: finalPersonaKey,
                                is_error_fallback: true
                            }
                        });
                        if (options && typeof options.onFinish === 'function') {
                            options.onFinish(savedMessage);
                        }
                    }
                })();

                return fillerObj;
            }

            // Fallback per a preview (sense ID de conversa real)
            const aiResponse = await geminiService.ask(finalPersonaKey, userQuery);
            return DOMPurify.sanitize(aiResponse.text, {
                 ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'li', 'ol'],
                 ALLOWED_ATTR: ['href', 'target', 'rel']
            });
        } catch (e) {
            logger.error('[MArIA] Error generant resposta AI:', e);
            return null;
        }
    }

    /**
     * Crida genèrica a la IAIA per a tasques especialitzades (com el corrector).
     */
    async askIAIA(prompt) {
        return geminiService.ask('IAIA', prompt);
    }

    /**
     * Realitza un diagnòstic profund del sistema [MASTER]
     */
    async diagnoseSystem() {
        const diagnostic = {
            viewport_ok: !!document.querySelector('meta[name="viewport"]'),
            sw_active: 'serviceWorker' in navigator && !!navigator.serviceWorker.controller,
            offline_ready: false, 
            assets_integrity: true,
            recommendation: ""
        };

        if (!diagnostic.viewport_ok) {
            diagnostic.recommendation += "El mur està massa estret, falta el ventall del viewport. ";
        }
        if (!diagnostic.sw_active) {
            diagnostic.recommendation += "El cor de la resiliència (Service Worker) no bategua. ";
        }

        if (diagnostic.recommendation === "") {
            diagnostic.recommendation = "Tot pareix en ordre, fill. El sistema bategua amb força!";
        } else {
            diagnostic.recommendation = "He trobat algunes coses que han de bategar millor: " + diagnostic.recommendation;
        }

        return diagnostic;
    }

    /**
     * Protocol "Esporgar l'Olivera" [MASTER DIRECTIVE]
     * Realitza una neteja automàtica de deute tècnic i fitxers obsolets.
     */
    async automatedCleanup() {
        logger.info("[IAIA] Executant Protocol 'Esporgar l'Olivera'...");
        const results = {
            storageCleared: false,
            cachePurged: false,
            deadCodeIdentified: []
        };

        try {
            localStorage.removeItem('sp_old_debug_logs');
            localStorage.removeItem('pwa-installed');
            Object.keys(sessionStorage).forEach(key => {
                if (key.startsWith('sp_') || key.startsWith('socdepoble_')) {
                    sessionStorage.removeItem(key);
                }
            });
            results.storageCleared = true;

            if ('caches' in window) {
                const names = await caches.keys();
                await Promise.all(names.map(n => caches.delete(n)));
                results.cachePurged = true;
            }

            const current = localStorage.getItem('sp_app_version');
            if (current !== APP_VERSION) {
                logger.warn(`[IAIA] Desincronització detectada: ${current} -> ${APP_VERSION}`);
            }

            logger.info('[IAIA] Neteja completada. El Mas està polit!');
            return results;
        } catch (e) {
            logger.error('[IAIA] Error en la neteja automàtica:', e);
            return results;
        }
    }

}

const iaiaService = new IAIAService();
export { iaiaService };
export default iaiaService;


--- FI FITXER: src/services/iaiaService.js ---



--- INICI FITXER: src/services/paymentService.js ---

import { logger } from "../utils/logger";
import { rhizomeManager } from "./rhizomeManager";

/**
 * PaymentService: Gestió de Pagaments Astro i Bategats Econòmics.
 * Pillar 3 de l'Escala Infinita.
 */
export const paymentService = {
  /**
   * Realitza un "Bategat Econòmic" (Pagament Astro)
   * Registra la transacció immediatament al xlog local (Rhizome).
   */
  async sendEconomicBeat(paymentData) {
    logger.log("[Astro] Iniciant Bategat Econòmic (Tele-Oli)...");
    try {
      // 1. Validació Estricta (Anti-Object Injection i Parsing Segur)
      if (typeof paymentData.receiver_id !== 'string' || !/^[0-9a-fA-F-]{36}$/.test(paymentData.receiver_id)) {
        // En Sóc de Poble treballem amb UUIDv4 de 36 caràcters
        throw new Error("Receiver ID invàlid (requereix UUID valid)");
      }
      
      if (typeof paymentData.amount !== 'number' && typeof paymentData.amount !== 'string') {
        throw new Error("Format d'import invàlid");
      }

      const amountStr = String(paymentData.amount);
      if (!/^\\d+(\\.\\d{1,2})?$/.test(amountStr)) {
        throw new Error("Màxim 2 decimals permesos (format invàlid)");
      }

      const amount = parseFloat(amountStr);
      if (isNaN(amount) || amount <= 0 || amount > 10000) {
        throw new Error("Import invàlid (0 < amount ≤ 10000)");
      }

      // 2. Registre al xlog (Exclusive Log) via RhizomeManager
      // Açò garanteix velocitat "més ràpida que VISA" al no esperar a la xarxa.
      const xlogEntry = await rhizomeManager.processXLog({
        amount: paymentData.amount,
        receiver_id: paymentData.receiver_id,
        reference: paymentData.reference || "Bategat de Proximitat",
        type: "astro_tele_oli",
      });

      logger.log(`[Astro] Transacció bategada al xlog: ${xlogEntry.id}`);

      // 3. Simulem la propagació asíncrona (Cel·lular Mesh)
      this._propagateTransaction(xlogEntry);

      return {
        success: true,
        transactionId: xlogEntry.id,
        status: "instant_sealed", // Segellat instantani al mòbil
      };
    } catch (err) {
      logger.error("[Astro] Error en el bategat econòmic:", err);
      return { success: false, error: err.message };
    }
  },

  /**
   * Propagació asíncrona cap als nodes de Masia i Padrins.
   */
  async _propagateTransaction() {
    // [PILLAR 3] Node de la Federació (Cooperativa)
    const user = JSON.parse(localStorage.getItem("sp_user_cache"));
    if (user) {
      await rhizomeManager.syncXLogsToFederation(user.id);
    }

    logger.log(
      `[Astro] Transaccions sincronitzades amb el Node de la Federació.`,
    );
  },

  /**
   * Recupera el balanç local bategat (Astro-Balance)
   */
  getLocalBalance() {
    const logs = JSON.parse(localStorage.getItem("sp_xlogs") || "[]");
    return logs.reduce((total, log) => total + (log.amount || 0), 0);
  },

  /**
   * [PILLAR 3: Custòdia Social] - Gestió de Padrins
   */
  getPadrins() {
    return JSON.parse(localStorage.getItem("sp_padrins") || "[]");
  },

  /**
   * Afegeix un Padrin a la xarxa de confiança.
   */
  async addPadrin(padrin) {
    try {
      const padrins = this.getPadrins();
      if (padrins.length >= 3) {
        logger.warn("[Astro] Xarxa de confiança completa (3 Padrins).");
      }
      const updated = [...padrins, { ...padrin, id: Date.now() }];
      localStorage.setItem("sp_padrins", JSON.stringify(updated));
      logger.log(`[Astro] Nou Padrin afegit: ${padrin.name}`);
      return { success: true };
    } catch (err) {
      logger.error('[paymentService] Error:', err);
      return { success: false, error: err.message };
    }
  },
};


--- FI FITXER: src/services/paymentService.js ---



--- INICI FITXER: src/services/errorTrackingService.js ---

// ✅ src/services/errorTrackingService.js - ERROR TRACKING GOD MODE
import { logger } from '../utils/logger';
import { APP_VERSION } from '../constants';

/**
 * 🏺 ERROR TRACKING SERVICE [v10.33.16]
 * Captura errors en producció sense soroll en desenvolupament.
 * Integrable amb Sentry, Google Cloud Error Reporting, o custom.
 */
class ErrorTrackingService {
  constructor() {
    this.enabled = import.meta.env.PROD;
    this.dsn = import.meta.env.VITE_SENTRY_DSN || '';
    this.environment = import.meta.env.VITE_APP_ENV || 'production';
    this.release = APP_VERSION;
    this.userContext = null;
    this.breadcrumbs = [];
    this.maxBreadcrumbs = 50;
    this._initialized = false;
  }

  /**
   * Inicialitza el servei de tracking
   */
  async initialize() {
    if (this._initialized) return;
    this._initialized = true;

    if (!this.enabled) {
      logger.log('[ErrorTracking] Disabled in development');
      return;
    }

    try {
      // [OPTIONAL] Sentry integration
      if (this.dsn) {
        const Sentry = await import('@sentry/react');
        
        Sentry.init({
          dsn: this.dsn,
          environment: this.environment,
          release: this.release,
          integrations: [
            Sentry.browserTracingIntegration(),
            Sentry.replayIntegration({
              maskAllText: true,
              blockAllMedia: true
            })
          ],
          tracesSampleRate: 0.1, // 10% de traces
          replaysSessionSampleRate: 0.1,
          replaysOnErrorSampleRate: 1.0,
          beforeSend: (event) => {
            // [PRIVACITAT] Filtrar dades sensibles
            if (event.request?.url?.includes('password')) {
              return null;
            }
            return event;
          }
        });

        logger.log('[ErrorTracking] Sentry initialized');
      }
    } catch (error) {
      logger.error('[ErrorTracking] Initialization failed:', error);
    }
  }

  /**
   * Captura un error
   * @param {Error|string} error - L'error detectat
   * @param {Object} context - Metadades addicionals
   */
  captureException(error, context = {}) {
    if (!this.enabled) {
      logger.error('[ErrorTracking]', error, context);
      return;
    }

    const errorData = {
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error,
      context: {
        ...context,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        language: navigator.language,
        online: navigator.onLine,
        memory: performance.memory ? {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize
        } : undefined
      },
      breadcrumbs: this.breadcrumbs.slice(-10),
      user: this.userContext
    };

    // [SEND] Enviar a Sentry si està disponible
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        extra: context,
        tags: {
          version: this.release,
          environment: this.environment
        }
      });
    }

    // [LOG] Guardar localment per a debugging
    this._saveToLocalStorage(errorData);

    // [ALERT] Notificar si és error crític
    if (this._isCriticalError(error)) {
      this._notifyCriticalError(errorData);
    }

    logger.error('[ErrorTracking] Exception captured:', errorData);
  }

  /**
   * Afegeix una breadcrumb (petita acció per a context)
   * @param {string} message - Descripció de l'acció
   * @param {string} category - Categoria (navigation, ui, network, etc.)
   * @param {string} level - Nivel (info, warning, error)
   */
  addBreadcrumb(message, category = 'default', level = 'info') {
    const breadcrumb = {
      message,
      category,
      level,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    this.breadcrumbs.push(breadcrumb);

    if (this.breadcrumbs.length > this.maxBreadcrumbs) {
      this.breadcrumbs.shift();
    }

    if (window.Sentry) {
      window.Sentry.addBreadcrumb(breadcrumb);
    }
  }

  /**
   * Estableix el context d'usuari
   * @param {Object} user - Dades de l'usuari (sense informació sensible)
   */
  setUserContext(user) {
    this.userContext = user ? {
      id: user.id,
      role: user.role,
      isGuest: user.isAnonymous || false
      // NO incloure email, nom, o dades personals
    } : null;

    if (window.Sentry) {
      window.Sentry.setUser(this.userContext);
    }
  }

  /**
   * Captura el rendiment de la pàgina
   * @param {Object} metrics - Mètriques de rendiment
   */
  capturePerformance(metrics) {
    if (!this.enabled) return;

    // [SEND] Enviar a analytics
    if (window.gtag) {
      window.gtag('event', 'performance', {
        event_category: 'web_vitals',
        event_label: JSON.stringify(metrics)
      });
    }

    logger.log('[ErrorTracking] Performance captured:', metrics);
  }

  /**
   * Verifica si l'error és crític
   * @param {Error|string} error 
   * @returns {boolean}
   */
  _isCriticalError(error) {
    const criticalPatterns = [
      'NetworkError',
      'QuotaExceededError',
      'IndexedDB',
      'Out of memory',
      'SecurityError',
      '401',
      '403'
    ];

    const errorMessage = error instanceof Error ? error.message : String(error);
    return criticalPatterns.some(pattern => errorMessage.includes(pattern));
  }

  /**
   * Notifica error crític
   * @param {Object} errorData 
   */
  _notifyCriticalError(errorData) {
    // [ALERT] Podria enviar un webhook o email en errors crítics
    logger.warn('[ErrorTracking] CRITICAL ERROR:', errorData);

    // [STORAGE] Guardar per a recuperació
    const criticalErrors = JSON.parse(
      localStorage.getItem('sp_critical_errors') || '[]'
    );
    criticalErrors.push(errorData);
    localStorage.setItem('sp_critical_errors', JSON.stringify(criticalErrors.slice(-10)));
  }

  /**
   * Guarda error a localStorage
   * @param {Object} errorData 
   */
  _saveToLocalStorage(errorData) {
    try {
      const errors = JSON.parse(
        localStorage.getItem('sp_error_logs') || '[]'
      );
      errors.push(errorData);
      localStorage.setItem('sp_error_logs', JSON.stringify(errors.slice(-50)));
    } catch (e) {
      logger.error('[ErrorTracking] Failed to save to localStorage:', e);
    }
  }

  /**
   * Obté errors emmagatzemats localment
   * @returns {Array}
   */
  getLocalErrors() {
    try {
      return JSON.parse(localStorage.getItem('sp_error_logs') || '[]');
    } catch {
      return [];
    }
  }

  /**
   * Neteja errors emmagatzemats
   */
  clearLocalErrors() {
    localStorage.removeItem('sp_error_logs');
    localStorage.removeItem('sp_critical_errors');
  }
}

// Singleton
export const errorTrackingService = new ErrorTrackingService();
export default errorTrackingService;


--- FI FITXER: src/services/errorTrackingService.js ---



--- INICI FITXER: src/services/healthCheckService.js ---

// ✅ src/services/healthCheckService.js - HEALTH CHECK AUTOMÀTIC
import { logger } from '../utils/logger';
import { supabase } from '../supabaseClient';

/**
 * 🏺 HEALTH CHECK SERVICE [v10.33.16]
 * Monitoritza la salut del sistema en temps real.
 */
class HealthCheckService {
  constructor() {
    this.checkInterval = 60000; // 1 minut
    this.lastCheck = null;
    this.healthStatus = {
      api: 'unknown',
      database: 'unknown',
      storage: 'unknown',
      performance: 'unknown',
      overall: 'unknown'
    };
    this.listeners = new Set();
  }

  /**
   * Inicia el monitoratge continu
   */
  startMonitoring() {
    if (this.intervalId) {
        this.stopMonitoring();
    }
    logger.log('[HealthCheck] Starting monitoring...');
    
    // Check inicial
    this.runHealthCheck();
    
    // Check periòdic
    this.intervalId = setInterval(() => {
      this.runHealthCheck();
    }, this.checkInterval);
  }

  /**
   * Atura el monitoratge
   */
  stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    logger.log('[HealthCheck] Monitoring stopped');
  }

  /**
   * Executa tots els checks de salut
   */
  async runHealthCheck() {
    const timestamp = new Date().toISOString();
    this.lastCheck = timestamp;

    const results = {
      timestamp,
      checks: {}
    };

    // [CHECK] API Connectivity
    results.checks.api = await this._checkAPI();
    
    // [CHECK] Database Connection
    results.checks.database = await this._checkDatabase();
    
    // [CHECK] Storage Availability
    results.checks.storage = await this._checkStorage();
    
    // [CHECK] Performance Metrics
    results.checks.performance = await this._checkPerformance();

    // [OVERALL] Calcular estat general
    results.overall = this._calculateOverall(results.checks);
    this.healthStatus = results;

    // [NOTIFY] Notificar listeners
    this._notifyListeners(results);

    // [LOG] Guardar si hi ha problemes
    if (results.overall !== 'healthy') {
      logger.warn('[HealthCheck] System not healthy:', results);
    }

    return results;
  }

  /**
   * Check de connectivitat API
   */
  async _checkAPI() {
    try {
      if (import.meta.env.DEV) return { status: 'healthy', message: 'Mocked in Dev' };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('/health', {
        method: 'GET',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return { status: 'healthy', latency: response.headers.get('X-Response-Time') };
      }
      
      return { status: 'degraded', error: `HTTP ${response.status}` };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }

  /**
   * Check de connexió Database
   */
  async _checkDatabase() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const { error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1)
        .abortSignal(controller.signal);

      clearTimeout(timeoutId);

      if (error) {
        // Error esperat si la taula no existeix, només verifiquem connexió
        if (error.code === '42P01') {
          return { status: 'healthy', message: 'Connection OK' };
        }
        return { status: 'degraded', error: error.message };
      }

      return { status: 'healthy' };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }

  /**
   * Check d'emmagatzematge local
   */
  async _checkStorage() {
    try {
      // Test localStorage
      const testKey = '_health_check_test';
      localStorage.setItem(testKey, 'test');
      const value = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);

      if (value !== 'test') {
        return { status: 'degraded', error: 'localStorage not working properly' };
      }

      // Check quota
      if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        const usagePercent = (estimate.usage / estimate.quota) * 100;
        
        if (usagePercent > 90) {
          return { status: 'warning', usage: `${usagePercent.toFixed(2)}%` };
        }
      }

      return { status: 'healthy' };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }

  /**
   * Check de rendiment
   */
  async _checkPerformance() {
    try {
      if (!performance || !performance.getEntriesByType) {
        return { status: 'unknown', message: 'Performance API not available' };
      }

      const navigation = performance.getEntriesByType('navigation')[0];
      if (!navigation) {
        return { status: 'unknown', message: 'No navigation entry' };
      }

      const metrics = {
        domContentLoaded: navigation.domContentLoadedEventEnd,
        loadComplete: navigation.loadEventEnd,
        firstByte: navigation.responseStart
      };

      // Evaluar si és acceptable
      if (metrics.loadComplete > 5000) {
        return { status: 'warning', metrics, message: 'Slow load time' };
      }

      return { status: 'healthy', metrics };
    } catch (error) {
      return { status: 'unknown', error: error.message };
    }
  }

  /**
   * Calcula l'estat general
   */
  _calculateOverall(checks) {
    const statuses = Object.values(checks).map(c => c.status);
    
    if (statuses.includes('unhealthy')) {
      return 'unhealthy';
    }
    
    if (statuses.includes('degraded') || statuses.includes('warning')) {
      return 'degraded';
    }
    
    return 'healthy';
  }

  /**
   * Subscriu un listener
   */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notifica tots els listeners
   */
  _notifyListeners(results) {
    this.listeners.forEach(listener => {
      try {
        listener(results);
      } catch (error) {
        logger.error('[HealthCheck] Listener error:', error);
      }
    });
  }

  /**
   * Obté l'estat actual
   */
  getStatus() {
    return this.healthStatus;
  }
}

// Singleton
export const healthCheckService = new HealthCheckService();
export default healthCheckService;


--- FI FITXER: src/services/healthCheckService.js ---



--- INICI FITXER: src/hooks/useFeedData.js ---

import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@powersync/react';
import { logger } from '../utils/logger';
import { MOCK_FEED } from '../data';

export const useFeedData = ({ activeTown, customPosts }) => {
    // If customPosts are provided (like from Profile or Town specific views), prioritize them.
    const [postsState, setPostsState] = useState(customPosts || []);

    // Reactive Query via PowerSync (Offline First)
    // LWW and CRDT automatic sync managed by PowerSync internal workers.
    const query = activeTown && activeTown !== 'global' 
        ? 'SELECT * FROM posts WHERE town_uuid = ? ORDER BY created_at DESC'
        : 'SELECT * FROM posts ORDER BY created_at DESC';
    
    const params = activeTown && activeTown !== 'global' ? [activeTown] : [];
    
    // PowerSync reacts to local and remote changes via WebWorkers automatically.
    const { data: psPosts, isLoading } = useQuery(query, params);

    useEffect(() => {
        if (!customPosts) {
            // Mix the MOCK_FEED (Lore) with the dynamic DB posts so the wall is never empty
            const dbPosts = psPosts || [];
            
            const mixedPosts = [...MOCK_FEED, ...dbPosts];
            
            // Remove duplicates by ID (just in case) using O(N) Set
            const seen = new Set();
            const uniquePosts = mixedPosts.filter(current => {
                const id = current.uuid || current.id;
                if (!id) return true;
                if (seen.has(id)) return false;
                seen.add(id);
                return true;
            });

            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPostsState(uniquePosts);
        }
    }, [psPosts, customPosts]);

    const fetchPosts = useCallback(async () => {
       // Fetch logic is moot with PowerSync reactive queries but kept for interface compatibility
       // if there are manual reload triggers.
       logger.info('Manual fetch request ignored. PowerSync streams changes automatically.');
    }, []);

    return {
        posts: postsState,
        setPosts: setPostsState,
        userConnections: [], // Simplify connections / bategats to rely on relations directly in the future
        loading: isLoading && !customPosts,
        error: null,
        page: 0,
        hasMore: false, // Infinite list managed by TanStack virtualizer rather than chunked API paginations
        loadingMore: false,
        fetchPosts
    };
};



--- FI FITXER: src/hooks/useFeedData.js ---



--- INICI FITXER: src/components/Feed.jsx ---

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
            targetId === 'sdp-oficial-1') {
            navigate('/entitat/sdp-oficial-1');
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


--- FI FITXER: src/components/Feed.jsx ---



--- INICI FITXER: src/components/UniversalCard.jsx ---

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import { useNavigation } from '../context/NavigationContext';
import { useDesign } from '../context/DesignContext';
import { useAuth } from '../context/AuthContext';


import { Calendar, Plus, ImageIcon } from 'lucide-react';
import Avatar from './Avatar';

import UniversalCardHeader from './UniversalCardHeader';
import UniversalCardMedia from './UniversalCardMedia';
import UniversalCardBody from './UniversalCardBody';
import UniversalCardFooter from './UniversalCardFooter';
import BlueprintOverlay from './BlueprintOverlay';
import './UniversalCard.css';


/**
 * UniversalCard [CINEMATOGRAPHIC RURALISM] - REFACTORED
 * ---------------------------------------
 * DIRECTIVA SUPREMA: Aquest component és la unitat atòmica del Gènesi.
 * Estructura dividida en Base, Header, Media, Body, i Footer 
 * per complir el "Single Responsibility Principle".
 */
const UniversalCard = ({
    item,
    title,
    subtitle,
    image,
    avatarSrc,
    avatarRole,
    avatarName,
    children,
    className = "",
    mode = "post", 
    variant = "post",
    isBating = false,
    excerpt,
    images,
    isOfficial: forcedOfficial = false,
    forensicMode: forcedForensic = false,
    viewMode = "grid"
}) => {

    const cardVariant = variant || mode;
    const { openViewer } = useModal();
    const { forensicMode: contextForensic } = useNavigation();

    const { gloveMode } = useDesign();
    const isForensic = forcedForensic || contextForensic;
    const { isAdmin, user } = useAuth();
    const navigate = useNavigate();

    const isMaster = isAdmin || user?.app_metadata?.role === 'master';

    // MULTIMEDIA RESOLUTION
    const FALLBACK_NANO_IMAGES = [
        "/assets/brain/generations/nano_llibre_memoria.png",
        "/assets/brain/generations/nano_fibra_espart.png",
        "/assets/brain/generations/nano_dron_agricola.png",
        "/assets/brain/generations/nano_mercat_llavors.png",
        "/assets/brain/generations/nano_palau_comtal_1774195484197.png",
        "/assets/brain/generations/nano_porta_masia_1774197069297.png",
        "/assets/brain/generations/nano_rentonar_arquitectura_1774196001924.png",
        "/assets/brain/generations/nano_socis_tecnologics_1774235328704.png"
    ];

    const mediaList = React.useMemo(() => images || item?.images || (Array.isArray(item?.image_url) ? item.image_url : null) || (Array.isArray(image) ? image : null), [images, item?.images, item?.image_url, image]);
    let displayImage = image || item?.image_url || item?.image || (mediaList ? mediaList[0] : null);

    if (!displayImage) {
        const strId = String(item?.id || item?.uuid || title || item?.name || '1');
        let hash = 0;
        for (let i = 0; i < strId.length; i++) {
            hash = strId.charCodeAt(i) + ((hash << 5) - hash);
        }
        displayImage = FALLBACK_NANO_IMAGES[Math.abs(hash) % FALLBACK_NANO_IMAGES.length];
    }

    const displayTitle = title || item?.title || item?.name || "Sóc de Poble";
    const displayPrice = item?.price || (cardVariant === 'mercat' || cardVariant === 'market' ? (item?.price || "15.00€") : "");
    const displayAuthor = avatarName || item?.author_name || item?.author || item?.seller || "Sóc de Poble";
    const displayExcerpt = excerpt || item?.description || item?.content || "";
    const displayTown = subtitle || item?.location?.town || item?.town_name || 'La Torre de les Maçanes';
    const createdAtDate = item?.created_at ? new Date(item.created_at) : (item?.date ? new Date(item.date) : null);
    const displayDate = createdAtDate ? createdAtDate.toLocaleDateString() : "Data desconeguda";
    const displayTime = createdAtDate ? createdAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (item?.metadata?.bategat_time || "");

    const isOfficial = forcedOfficial || item?.author_role === 'official' || item?.author_role === 'oficial' || item?.type === 'oficial' || item?.type === 'system' || item?.type === 'bando' || item?.type === 'tramit' || item?.official || cardVariant === 'ajuntament' || cardVariant === 'pobles';
    const isAlert = React.useMemo(() => item?.category === 'Alert' || item?.type === 'alert' || item?.is_alert || item?.category === 'Danger', [item?.category, item?.type, item?.is_alert]);
    const isSostenible = React.useMemo(() => item?.category === 'Sostenible' || item?.tags?.includes('#Sostenible'), [item?.category, item?.tags]);

    const handleCardClick = React.useCallback(() => {
        const id = item?.uuid || item?.id;
        if (cardVariant === 'pobles') {
            navigate(`/pobles/${id}`);
        } else if (cardVariant === 'mapa') {
            navigate('/mapa');
        } else if ((cardVariant === 'mercat' || cardVariant === 'market') && id) {
            navigate(`/mercat/${id}`);
        } else if (id) {
            navigate(`/post/${id}`);
        }
    }, [item?.uuid, item?.id, cardVariant, navigate]);

    const handleConnectClick = React.useCallback(async (e) => {
        e.stopPropagation();

        const postId = item?.uuid || item?.id;
        if (!postId) {
            console.error("No es pot connectar: La targeta no té un ID vàlid.");
            return;
        }

        // [ESCAPARATE PATTERN DOCTRINE] All direct connection clicks on feeds must route to the item detail to avoid accidental inputs
        // The detailed view handles the actual connection/save/tagging
        if (cardVariant === 'pobles') {
            navigate(`/pobles/${postId}?action=connect`);
        } else if (cardVariant === 'mercat' || cardVariant === 'market') {
            navigate(`/mercat/${postId}?action=connect`);
        } else {
            navigate(`/post/${postId}?action=connect`);
        }
    }, [item?.uuid, item?.id, cardVariant, navigate]);

    const CardContent = (
        <article
            className={`universal-card card-variant-${cardVariant} view-mode-${viewMode} ${className} relative w-full rounded-[28px] overflow-hidden bg-theme-panel shadow-2xl border border-white/5 flex flex-col transition-all duration-500 hover:shadow-black/50 ${isBating ? 'animate-bategat' : ''} ${gloveMode ? 'mode-guants' : ''} ${isOfficial ? 'role-official' : ''} ${isAlert ? 'category-danger alert-active' : ''} ${isSostenible ? 'category-sostenible' : ''} ${isForensic ? 'mode-forense-active' : ''}`}
            onClick={handleCardClick}
            style={{ cursor: 'pointer' }}
        >
            {viewMode === 'list' ? (
                <div className="card-list-layout h-24 flex items-center px-4 md:px-6 gap-4 hover:bg-white/[0.02] transition-colors relative isolate">
                    <div className="card-list-thumbnail flex-shrink-0 w-16 h-16 rounded-[20px] shadow-inner overflow-hidden border border-white/10 relative z-10">
                        {displayImage ? (
                            <img 
                                src={displayImage} 
                                alt={displayTitle} 
                                className="w-full h-full object-cover rounded-[20px] hover:scale-110 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-black/20 text-white/20">
                                <ImageIcon size={20} />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0 pr-4 z-10">
                        <h4 className="text-[14px] md:text-[16px] font-black text-theme-text truncate leading-tight tracking-wide">{displayTitle}</h4>
                        <div className="flex items-center gap-2 text-[12px] md:text-[13px] font-bold text-gray-400 tracking-wide truncate mt-1">
                            <span className="text-[var(--theme-accent-primary)]">{displayAuthor}</span>
                            <span>•</span>
                            <span className="opacity-70">{displayTown.replace("Poble Principal:", "").trim()}</span>
                        </div>
                    </div>
                    
                    {displayPrice && (
                        <div className="text-[13px] font-black text-[#F97316] px-4 py-1.5 bg-[#F97316]/10 border border-[#F97316]/20 rounded-[28px] flex-shrink-0 z-10">
                            {displayPrice}
                        </div>
                    )}
                    
                    <button 
                        className="btn-connect-canonic shrink-0 ml-2 flex h-10 px-6 bg-white/5 hover:bg-[#F97316] hover:border-[#F97316] border border-white/10 rounded-full items-center justify-center gap-2 font-black text-[12px] text-slate-900 bg-[#F97316] tracking-wide transition-all z-10"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleConnectClick(e);
                        }}
                    >
                        CONNECTAR
                    </button>
                    
                    {/* Ghost hit area to ensure the background takes the hover safely */}
                    <div className="absolute inset-0 z-0"></div>
                </div>
            ) : (
                <>
                    <UniversalCardHeader 
                        item={item}
                        cardVariant={cardVariant}
                        displayTown={displayTown}
                        displayAuthor={displayAuthor}
                        avatarSrc={avatarSrc}
                        avatarRole={avatarRole}
                        isOfficial={isOfficial}
                        displayDate={displayDate}
                        displayTime={displayTime}
                    />

                    <UniversalCardMedia 
                        item={item}
                        cardVariant={cardVariant}
                        mediaList={mediaList}
                        displayImage={displayImage}
                        displayTitle={displayTitle}
                        openViewer={openViewer}
                        navigate={navigate}
                    />

                    <UniversalCardBody 
                        displayTitle={displayTitle}
                        displayExcerpt={displayExcerpt}
                        item={item}
                        isOfficial={isOfficial}
                        children={children}
                        navigate={navigate}
                        cardVariant={cardVariant}
                        displayPrice={displayPrice}
                    />

                    <UniversalCardFooter 
                        item={item}
                        cardVariant={cardVariant}
                        displayTitle={displayTitle}
                        displayExcerpt={displayExcerpt}
                        isMaster={isMaster}
                        navigate={navigate}
                        handleConnectClick={handleConnectClick}
                    />
                </>
            )}
        </article>
    );

    // Avoid useLocation hook to prevent re-renders when local routing changes (improves feed performance)
    const isChatRoute = typeof window !== 'undefined' ? window.location.pathname.startsWith('/chats') : false;

    const FinalCard = (
        <div className="min-w-0 w-full">
            {CardContent}
        </div>
    );

    return isChatRoute ? (
        <BlueprintOverlay label={`CARD_UNIT`} dimensions={`${cardVariant.toUpperCase()} | R: 28PX`} color="cyan">
            {FinalCard}
        </BlueprintOverlay>
    ) : FinalCard;
};

const normalizeClass = (cls) => (cls || '').split(' ').filter(Boolean).sort().join(' ');

const propsAreEqual = (prevProps, nextProps) => {
    const prevId = prevProps.item?.uuid || prevProps.item?.id;
    const nextId = nextProps.item?.uuid || nextProps.item?.id;
    return (
        prevId === nextId &&
        prevProps.item?.updated_at === nextProps.item?.updated_at &&
        prevProps.item?.connections_count === nextProps.item?.connections_count &&
        prevProps.item?.comments_count === nextProps.item?.comments_count &&
        prevProps.viewMode === nextProps.viewMode &&
        prevProps.isBating === nextProps.isBating &&
        normalizeClass(prevProps.className) === normalizeClass(nextProps.className) &&
        prevProps.variant === nextProps.variant &&
        prevProps.mode === nextProps.mode
    );
};

export default React.memo(UniversalCard, propsAreEqual);


--- FI FITXER: src/components/UniversalCard.jsx ---



--- INICI FITXER: src/components/chat/ChatInputArea.jsx ---

import React, { useRef, useState, lazy, Suspense } from 'react';
import { ShieldCheck, Smile, Mic, X, Send, Image, Camera, MapPin, User, FileText, BarChart2, CalendarDays, Paperclip, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAttachmentManager } from '../../hooks/useAttachmentManager';

// EXTREME AUDIT V2 FIX: Lazy Loading per EmojiPicker i VoiceRecorder (Evita bloquejos del Fil Principal de UI en Androids).
const VoiceRecorder = lazy(() => import('../VoiceRecorder'));
const EmojiPicker = lazy(() => import('emoji-picker-react'));

const FallbackLoader = () => (
    <div className="h-12 flex items-center justify-center">
        <Loader2 className="animate-spin text-[var(--theme-accent-primary)] w-6 h-6" />
    </div>
);

const ChatInputArea = React.memo(({
    id, otherInfo, user, setIsGuestInteractionModalOpen,
    handleSendMessage, isSending
}) => {
    const { t } = useTranslation();
    const [newMessage, setNewMessage] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
    
    // EXTREME AUDIT FIX: Atraiem els estats d'adjunts al component fill per evitar re-renders del pare (ChatDetail) i destrossar Virtuoso.
    const { attachedFile, attachedFilePreview, handleFileSelect, clearAttachment } = useAttachmentManager();

    const inputRef = useRef(null);

    const onInternalSubmit = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setIsEmojiPickerOpen(false);
        setIsAttachmentMenuOpen(false);
        
        handleSendMessage({
            text: newMessage,
            attachedFile,
            onSuccess: () => {
                setNewMessage('');
                clearAttachment();
                if (inputRef.current) {
                    inputRef.current.style.height = 'auto'; // Reseteja alçada després d'enviar
                }
            }
        });
    };

    const showGuestBanner = user?.isAnonymous && !id?.startsWith('11111111-');

    return (
        <div className={`chat-input-master-wrapper relative w-full px-2 sm:px-4 md:px-6 py-[8px] md:py-[12px] bg-[var(--theme-accent-primary)] dark:bg-[var(--theme-accent-secondary)] border-t border-transparent z-[50] flex-shrink-0 transition-colors shadow-[0_-10px_20px_rgba(0,0,0,0.05)] md:pb-[12px]`}>
            <div className="max-w-5xl mx-auto relative">
                
                {isRecording ? (
                    <div className="voice-recorder-overlay animate-in slide-in-from-bottom-5 duration-300">
                        <Suspense fallback={<FallbackLoader />}>
                            <VoiceRecorder 
                                onSend={async (blob, duration, transcript) => {
                                    setIsRecording(false);
                                    if (!blob) return;
                                    handleSendMessage({
                                        voiceData: { blob, transcript, duration },
                                        onSuccess: () => setIsRecording(false) 
                                    });
                                }}
                                onCancel={() => setIsRecording(false)}
                            />
                        </Suspense>
                    </div>
                ) : showGuestBanner ? (
                    <div className="w-full relative">
                        <button onClick={(e) => { e.preventDefault(); setIsGuestInteractionModalOpen(true); }} className="w-full h-[48px] genesis-radius bg-theme-panel border border-orange-500/50 hover:bg-orange-500/10 text-orange-400 font-bold text-sm tracking-wide shadow-lg flex items-center justify-center gap-2">
                            <ShieldCheck size={18} />
                            <span>Atenció: Conversació Efímera. Toca per Registrar-te.</span>
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 w-full">
                        {attachedFile && (
                            <div className="flex w-full overflow-x-auto custom-scrollbar pb-2 pt-1 px-1">
                                <div className="relative inline-flex flex-col animate-in fade-in slide-in-from-bottom-2 bg-white dark:bg-[#1f1f1f] rounded-2xl p-2 shadow-sm max-w-xs shrink-0 border border-[var(--border-master)]">
                                    <button onClick={clearAttachment} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center z-10"><X size={14} strokeWidth={3} /></button>
                                    {attachedFilePreview ? <img src={attachedFilePreview} alt="preview" className="w-full h-32 object-cover rounded-xl" /> : <div className="w-full h-32 bg-[var(--bg-master)] rounded-xl flex items-center justify-center"><FileText size={48} opacity={0.5} /></div>}
                                    <div className="mt-2 text-xs font-semibold text-center truncate px-2 text-[var(--text-main)] w-full">{attachedFile.name}</div>
                                </div>
                            </div>
                        )}

                        <form className="flex items-end gap-2 m-0 p-0 w-full" onSubmit={onInternalSubmit}>
                            <div className="flex-1 relative flex items-end min-w-0 bg-white dark:bg-[#1f1f1f] rounded-[24px] shadow-sm">
                                
                                {/* BOTÓ EMOJI */}
                                <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsEmojiPickerOpen(!isEmojiPickerOpen); setIsAttachmentMenuOpen(false); if (!isEmojiPickerOpen && inputRef.current) inputRef.current.blur(); }} className={`w-[40px] h-[40px] md:w-[48px] md:h-[48px] flex items-center justify-center shrink-0 self-end mb-0 md:mb-0 pb-[2px] md:pb-[4px] ${isEmojiPickerOpen ? 'text-[var(--theme-accent-primary)] drop-shadow-md' : 'text-gray-500 hover:text-gray-600'}`}>
                                    <Smile className="w-[22px] h-[22px] md:w-[24px] md:h-[24px] mt-[2px] md:mt-[4px]" strokeWidth={2.5} />
                                </button>
                                
                                {/* CAMP DE TEXT */}
                                <textarea 
                                    ref={inputRef} rows={1} spellCheck="true" value={newMessage} 
                                    onChange={(e) => { setNewMessage(e.target.value); e.target.style.height = 'auto'; e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`; }}
                                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onInternalSubmit(e); } }}
                                    placeholder={otherInfo?.name ? `Parla amb ${otherInfo.name}...` : t('common.write_message')}
                                    className="flex-1 min-h-[40px] md:min-h-[48px] max-h-[130px] bg-transparent border-none py-[10px] md:py-[12px] px-1 text-black dark:text-white focus:outline-none font-medium text-[17px] md:text-[18px] align-middle box-border m-0 min-w-0 resize-none overflow-y-auto custom-scrollbar leading-relaxed"
                                    style={{ height: 'auto' }}
                                    onPaste={(e) => {
                                        const items = e.clipboardData?.items;
                                        if (!items) return;
                                        // EXTREME AUDIT V4 FIX: Prevé Mobile UI Freeze si es peguen múltiples Imatges d'alta qualitat evitant el Main Thread Lock. Ús de rAF per evitar delay hardcoded.
                                        requestAnimationFrame(() => {
                                            for (let i = 0; i < items.length; i++) {
                                                if (items[i].type.indexOf('image') !== -1) {
                                                    const file = items[i].getAsFile();
                                                    handleFileSelect({ target: { files: [file] } });
                                                    break;
                                                }
                                            }
                                        });
                                    }}
                                />

                                {/* BOTONS ADJUNT I CÀMERA */}
                                <div className="flex items-center shrink-0 self-end h-[40px] md:h-[48px] pr-1 md:pr-2 gap-1">
                                    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsAttachmentMenuOpen(!isAttachmentMenuOpen); setIsEmojiPickerOpen(false); }} className="w-[36px] h-[36px] flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                        <Paperclip className="w-[20px] h-[20px] transform -rotate-45" strokeWidth={2.2} />
                                    </button>
                                    {!newMessage.trim() && (
                                        <button type="button" onClick={() => document.getElementById('attach-camera')?.click()} className="w-[36px] h-[36px] flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                            <Camera className="w-[20px] h-[20px]" strokeWidth={2.2} />
                                        </button>
                                    )}
                                </div>

                                {/* POPUPS */}
                                {isEmojiPickerOpen && (
                                    <>
                                        <div className="fixed inset-0 z-[100]" onClick={(e) => {e.stopPropagation(); setIsEmojiPickerOpen(false);}}></div>
                                        <div className="absolute left-1/2 -translate-x-1/2 md:-translate-x-0 md:left-auto md:right-0 bottom-[60px] z-[110] animate-in slide-in-from-bottom-2 zoom-in-95 origin-bottom md:origin-bottom-right drop-shadow-2xl flex justify-center w-[calc(100vw-32px)] md:w-auto overflow-hidden rounded-2xl bg-theme-panel">
                                            <Suspense fallback={<FallbackLoader />}>
                                                <EmojiPicker 
                                                    theme="auto" 
                                                    onEmojiClick={(e) => setNewMessage(prev => prev + e.emoji)} 
                                                    width={window.innerWidth < 768 ? '100%' : 420} 
                                                    height={window.innerHeight < 768 ? Math.max(380, window.innerHeight * 0.6) : 480}
                                                    suggestedEmojisMode="recent"
                                                    searchPlaceHolder={t('emoji.search')}
                                                    previewConfig={{ showPreview: false }}
                                                    categories={[
                                                        { category: 'suggested', name: t('emoji.suggested') },
                                                        { category: 'smileys_people', name: t('emoji.smileys_people') },
                                                        { category: 'animals_nature', name: t('emoji.animals_nature') },
                                                        { category: 'food_drink', name: t('emoji.food_drink') },
                                                        { category: 'travel_places', name: t('emoji.travel_places') },
                                                        { category: 'activities', name: t('emoji.activities') },
                                                        { category: 'objects', name: t('emoji.objects') },
                                                        { category: 'symbols', name: t('emoji.symbols') },
                                                        { category: 'flags', name: t('emoji.flags') }
                                                    ]}
                                                />
                                            </Suspense>
                                        </div>
                                    </>
                                )}

                                {isAttachmentMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-[100]" onClick={(e) => {e.stopPropagation(); setIsAttachmentMenuOpen(false);}}></div>
                                        <div className="absolute bottom-[60px] left-2 right-2 sm:left-auto sm:w-[350px] md:right-8 md:w-[360px] bg-theme-panel text-[var(--text-main)] border border-[var(--border-master)] rounded-[28px] shadow-[0_8px_40px_rgba(0,0,0,0.15)] p-6 z-[110] animate-in slide-in-from-bottom-2 zoom-in-95 origin-bottom sm:origin-bottom-right">
                                            <div className="grid grid-cols-4 gap-y-7 gap-x-2">
                                                <input type="file" id="attach-gallery" hidden accept="image/*" onChange={(e) => { setIsAttachmentMenuOpen(false); handleFileSelect(e); }} />
                                                <input type="file" id="attach-camera" hidden accept="image/*" capture="environment" onChange={(e) => { setIsAttachmentMenuOpen(false); handleFileSelect(e); }} />
                                                <input type="file" id="attach-document" hidden accept=".pdf,.doc,.docx,.txt,.xls,.xlsx" onChange={(e) => { setIsAttachmentMenuOpen(false); handleFileSelect(e); }} />
                                                
                                                {/* 1. Galeria */}
                                                <label htmlFor="attach-gallery" className="flex flex-col items-center gap-[6px] group cursor-pointer">
                                                    <div className="w-[52px] h-[52px] rounded-full bg-purple-500 text-white flex items-center justify-center shadow-sm active:scale-95 transition-transform"><Image size={24} strokeWidth={2} /></div>
                                                    <span className="text-[12px] opacity-80 font-medium tracking-tight">Galeria</span>
                                                </label>
                                                
                                                {/* 2. Càmera */}
                                                <label htmlFor="attach-camera" className="flex flex-col items-center gap-[6px] group cursor-pointer">
                                                    <div className="w-[52px] h-[52px] rounded-full bg-pink-500 text-white flex items-center justify-center shadow-sm active:scale-95 transition-transform"><Camera size={24} strokeWidth={2} /></div>
                                                    <span className="text-[12px] opacity-80 font-medium tracking-tight">Càmera</span>
                                                </label>

                                                {/* 3. Ubicació */}
                                                <button type="button" onClick={() => { setIsAttachmentMenuOpen(false); import('../../utils/toast').then(m => m.default.success("🗺️ Ubicació pròximament")); }} className="flex flex-col items-center gap-[6px] group cursor-pointer">
                                                    <div className="w-[52px] h-[52px] rounded-full bg-green-500 text-white flex items-center justify-center shadow-sm active:scale-95 transition-transform"><MapPin size={24} strokeWidth={2} /></div>
                                                    <span className="text-[12px] opacity-80 font-medium tracking-tight">Ubicació</span>
                                                </button>

                                                {/* 4. Contacte */}
                                                <button type="button" onClick={() => { setIsAttachmentMenuOpen(false); import('../../utils/toast').then(m => m.default.success("👤 Contacte pròximament")); }} className="flex flex-col items-center gap-[6px] group cursor-pointer">
                                                    <div className="w-[52px] h-[52px] rounded-full bg-blue-400 text-white flex items-center justify-center shadow-sm active:scale-95 transition-transform"><User size={24} strokeWidth={2} /></div>
                                                    <span className="text-[12px] opacity-80 font-medium tracking-tight">Contacte</span>
                                                </button>
                                                
                                                {/* 5. Document */}
                                                <label htmlFor="attach-document" className="flex flex-col items-center gap-[6px] group cursor-pointer">
                                                    <div className="w-[52px] h-[52px] rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-sm active:scale-95 transition-transform"><FileText size={24} strokeWidth={2} /></div>
                                                    <span className="text-[12px] opacity-80 font-medium tracking-tight">Document</span>
                                                </label>

                                                {/* 6. Àudio */}
                                                <button type="button" onClick={() => { setIsAttachmentMenuOpen(false); setIsRecording(true); }} className="flex flex-col items-center gap-[6px] group cursor-pointer">
                                                    <div className="w-[52px] h-[52px] rounded-full bg-orange-500 text-white flex items-center justify-center shadow-sm active:scale-95 transition-transform"><Mic size={24} strokeWidth={2} /></div>
                                                    <span className="text-[12px] opacity-80 font-medium tracking-tight">Àudio</span>
                                                </button>

                                                {/* 7. Enquesta */}
                                                <button type="button" onClick={() => { setIsAttachmentMenuOpen(false); import('../../utils/toast').then(m => m.default.success("📊 Enquesta pròximament")); }} className="flex flex-col items-center gap-[6px] group cursor-pointer">
                                                    <div className="w-[52px] h-[52px] rounded-full bg-yellow-500 text-white flex items-center justify-center shadow-sm active:scale-95 transition-transform"><BarChart2 size={24} strokeWidth={2} /></div>
                                                    <span className="text-[12px] opacity-80 font-medium tracking-tight">Enquesta</span>
                                                </button>

                                                {/* 8. Esdeveniment */}
                                                <button type="button" onClick={() => { setIsAttachmentMenuOpen(false); import('../../utils/toast').then(m => m.default.success("📅 Esdeveniment pròximament")); }} className="flex flex-col items-center gap-[6px] group cursor-pointer">
                                                    <div className="w-[52px] h-[52px] rounded-full bg-teal-500 text-white flex items-center justify-center shadow-sm active:scale-95 transition-transform"><CalendarDays size={24} strokeWidth={2} /></div>
                                                    <span className="text-[12px] opacity-80 font-medium tracking-tight">Esdeveniment</span>
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="flex items-end pb-[0px] md:pb-[2px]">
                                {newMessage.trim() || attachedFile ? (
                                    <button type="submit" disabled={isSending} onPointerDown={(e) => { e.preventDefault(); if (!isSending) onInternalSubmit(e); }} className="w-[42px] h-[42px] md:w-[48px] md:h-[48px] shrink-0 bg-[#00a884] hover:bg-[#008f6f] text-white disabled:opacity-50 rounded-full shadow-md flex items-center justify-center transition-transform active:scale-95 z-10">
                                        <Send strokeWidth={2.5} className="w-[18px] h-[18px] ml-1" />
                                    </button>
                                ) : (
                                    <button type="button" onClick={() => setIsRecording(true)} className="w-[42px] h-[42px] md:w-[48px] md:h-[48px] shrink-0 bg-[#00a884] hover:bg-[#008f6f] text-white rounded-full shadow-md flex items-center justify-center transition-transform active:scale-95 z-10">
                                        <Mic strokeWidth={2.5} className="w-[20px] h-[20px]" />
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
});

export default ChatInputArea;


--- FI FITXER: src/components/chat/ChatInputArea.jsx ---



--- INICI FITXER: src/components/SEO.jsx ---

// ✅ VERSIÓ FINAL - SEO GOD MODE AMB VALIDACIÓ COMPLETA
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { APP_VERSION } from '../constants';

/**
 * 🏺 SEO [VIRAL TIERS GOD] - v10.33.16
 * Gestió dinàmica de l'SEO per a previsualitzacions d'alt impacte.
 * 
 * CARACTERÍSTIQUES:
 * - Prevenció de duplicats en og:image
 * - Validació de dades estructurades (Schema.org)
 * - Suport per a Twitter Cards, Facebook, WhatsApp
 * - Canonical URLs automàtiques
 */
const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author = 'Sóc de Poble',
  structuredData = {},
  noIndex = false
}) => {
  // [VALIDACIÓ] Títol per defecte si no es proporciona
  const siteTitle = 'Sóc de Poble';
  const showVersion = typeof window !== 'undefined' && !window.HIDE_SEO_VERSION;
  const versionString = APP_VERSION;
  const displayTitle = title ? title : siteTitle;
  const fullTitle = showVersion ? `${displayTitle} | ${siteTitle} ${versionString}` : `${displayTitle} | ${siteTitle}`;
  
  // [VALIDACIÓ] URL canònica automàtica completíssima i absoluta
  const baseUrl = 'https://socdepoble.org';
  let canonicalUrl = url || (typeof window !== 'undefined' ? window.location.href : baseUrl);
  if (!canonicalUrl.startsWith('http')) {
      canonicalUrl = `${baseUrl}${canonicalUrl}`;
  }
  
  // [VALIDACIÓ] Imatge per defecte (OG Image master)
  const ogImage = image?.startsWith('http') ? image : `${baseUrl}${image || '/og-image-batega-v11.png?v=beta-sollutia'}`;
  
  // [VALIDACIÓ] Descripció per defecte
  const defaultDescription = 'La xarxa social rural sobirana. Connectant pobles, preservant memòria, bategant en comunitat.';
  const metaDescription = description || defaultDescription;
  
  // [VALIDACIÓ] Keywords per defecte
  const defaultKeywords = 'poble, rural, comunitat, valencià, sobirania digital, memòria local, ajuntament, mercat km0';
  const metaKeywords = keywords || defaultKeywords;
  
  // [SEGURETAT] Netejar dades perilloses
  const sanitize = (str) => {
    if (!str) return '';
    return String(str)
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .substring(0, 500); // Max length per a meta tags
  };

  // [SCHEMA.ORG] Dades estructurades per defecte
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": type === 'profile' ? 'ProfilePage' : (type === 'article' ? 'NewsArticle' : (type === 'product' ? 'Product' : 'Organization')),
    "name": "Sóc de Poble",
    "url": baseUrl,
    "logo": `${baseUrl}/icon-512x512.png`,
    "description": sanitize(metaDescription),
    "foundingDate": "2024",
    "areaServed": {
      "@type": "Country",
      "name": "País Valencià"
    }
  };

  const mergedStructuredData = { ...defaultStructuredData, ...structuredData };
  const sanitizedStructuredData = {};
  for (const [key, value] of Object.entries(mergedStructuredData)) {
      sanitizedStructuredData[key] = typeof value === 'string' ? sanitize(value) : value;
  }

  // [PREVENCIÓ DUPLICATS] Key única per a cada tag per netejar Helmet
  const helmetKey = typeof window !== 'undefined' ? window.location.pathname : 'seo-static';

  return (
    <Helmet key={helmetKey} defer={false}>
      {/* === BÀSICS === */}
      <title>{sanitize(fullTitle)}</title>
      <meta name="title" content={sanitize(fullTitle)} />
      <meta name="description" content={sanitize(metaDescription)} />
      <meta name="keywords" content={sanitize(metaKeywords)} />
      <meta name="author" content={author} />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      <meta name="application-name" content="Sóc de Poble" />
      <meta name="theme-color" content="#f97316" />
      
      {/* === CANONICAL === */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* === OPEN GRAPH / FACEBOOK / WHATSAPP === */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={sanitize(fullTitle)} />
      <meta property="og:description" content={sanitize(metaDescription)} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:secure_url" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:alt" content={sanitize(title || siteTitle)} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content="ca_ES" />
      
      {/* === TWITTER CARDS === */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={sanitize(fullTitle)} />
      <meta name="twitter:description" content={sanitize(metaDescription)} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={sanitize(title || siteTitle)} />
      <meta name="twitter:site" content="@socdepoble" />
      <meta name="twitter:creator" content="@javillinares" />
      
      {/* === INSTAGRAM / PINTEREST === */}
      <meta name="pinterest" content="nopin" />
      
      {/* === APPLE TOUCH ICONS === */}
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/manifest.json" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content={siteTitle} />
      
      {/* === MICROSOFT TILE === */}
      <meta name="msapplication-TileColor" content="#f97316" />
      <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
      
      {/* === SCHEMA.ORG STRUCTURED DATA === */}
      <script type="application/ld+json">
        {JSON.stringify(mergedStructuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;


--- FI FITXER: src/components/SEO.jsx ---

