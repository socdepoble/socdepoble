import { create } from 'zustand';
import { supabase } from '../../supabaseClient';
import { supabaseService } from '../../core/services/supabaseService';
import { identityService } from '../../core/services/identityService';
import { profileHealingService } from '../../core/services/profileHealingService';
import { terminateWorkers } from '../../core/services/iaiaService';
import { logger } from '../../utils/logger';
import i18n from '../../i18n/config';
import { IAIA_ID, USER_ROLES } from '../../constants';
import { webCryptoService } from '../../core/services/webCryptoService';
import { rhizomeManager } from '../../core/services/rhizomeManager';

/**
 * ZUSTAND AUTH STORE (Fase 6: Estalvi Energètic i J.A.R.V.I.S.)
 * Aquesta arquitectura prevé el re-render de 80 components permetent
 * als nodes subscriure's únicament a parts específiques de l'estat.
 */
export const useAuthStore = create((set, get) => ({
    // --- ESTAT BASE ---
    user: null,
    profile: null,
    realUser: null,
    realProfile: null,
    loading: true,
    isPlayground: localStorage.getItem('isPlaygroundMode') === 'true',
    impersonatedProfile: null,
    activeEntityId: null,
    simulatedRole: localStorage.getItem('simulatedRole') || null,
    language: localStorage.getItem('i18nextLng') || 'va',

    // --- PROTOCOL J.A.R.V.I.S ---
    // Defineix qui està operant els controls. Pot ser 'human', 'ai_agent' (IAIA), o 'system_bot'
    activeActor: { type: 'human', id: null, actingOnBehalfOf: null },

    // --- SETTERS DIRECTES ---
    setLanguage: (lang) => {
        set({ language: lang });
        localStorage.setItem('i18nextLng', lang);
        i18n.changeLanguage(lang);
    },
    setSimulatedRole: (role) => {
        set({ simulatedRole: role });
        if (role) localStorage.setItem('simulatedRole', role);
        else localStorage.removeItem('simulatedRole');
    },
    setIsPlayground: (val) => {
        const { realUser } = get();
        if (val && realUser) {
            logger.warn('[AuthStore] DIRECTIVA 1: Els usuaris registrats han de tancar la sessió per a jugar.');
            return;
        }
        set({ isPlayground: val });
        localStorage.setItem('isPlaygroundMode', String(val));
        if (!val) {
            localStorage.removeItem('isPlaygroundMode');
            localStorage.removeItem('sb-simulation-mode');
        }
    },
    setProfile: (profile) => set({ profile }),
    setImpersonatedProfile: (profile) => set({ impersonatedProfile: profile }),
    setActiveEntityId: (id) => set({ activeEntityId: id }),

    // --- ACCIONS COMPLEXES ---
    generateSovereignIdentity: async () => {
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
    },

    adoptPersona: (personaProfile) => {
        get().setIsPlayground(true);
        localStorage.setItem('isPlaygroundMode', 'true');
        const newUser = { id: personaProfile.id, email: `${personaProfile.username}@playground.local`, isDemo: true };
        set({
            user: newUser,
            profile: { ...personaProfile, is_playground_session: true },
            loading: false,
            activeActor: { type: 'human', id: newUser.id }
        });
    },

    loginAsGuest: () => {
        get().adoptPersona({
            id: IAIA_ID,
            full_name: 'IAIA (Guia del Poble)',
            username: 'iaia_guide',
            role: USER_ROLES.ADMIN,
            is_demo: true,
            is_admin: true,
            avatar_url: '/uploads/avatars/iaia_comic_matriarch.png'
        });
    },

    loginAsGuestAnonymous: () => {
        logger.log('[AuthStore] Entering as Guest Anonymous (Open Community)');
        const guestUser = {
            id: 'guest_' + Math.random().toString(36).substr(2, 9),
            full_name: 'Visitant Gentil',
            username: 'guest',
            role: 'guest',
            isAnonymous: true,
            avatar_url: '/uploads/avatars/guest_avatar.png'
        };
        set({
            user: guestUser,
            profile: guestUser,
            loading: false,
            activeActor: { type: 'human', id: guestUser.id }
        });
        localStorage.setItem('isGuestMode', 'true');
    },

    forceNukeSimulation: async () => {
        logger.log('[AuthStore] NUCLEAR RESET TRIGGERED - PURGING SIMULATION');
        try { await supabase.auth.signOut(); } catch (e) {
            logger.error('[AuthStore] Supabase signOut error during nuke:', e);
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
                logger.error('[AuthStore] SW Unregister error:', swError);
            }
        }

        set({
            user: null, profile: null, realUser: null, realProfile: null,
            isPlayground: false, impersonatedProfile: null, activeEntityId: null,
            loading: false, activeActor: { type: 'human', id: null }
        });
        localStorage.setItem('nuke_in_progress', 'true');
        window.location.href = '/login?nuked=true&v=' + Date.now();
    },

    exitPlayground: async () => {
        logger.log('[AuthStore] Exiting Playground mode...');
        const { realUser, realProfile } = get();
        if (realUser) {
            get().setIsPlayground(false);
            set({ user: realUser, profile: realProfile, activeActor: { type: 'human', id: realUser.id } });
            window.location.href = '/';
        } else {
            await get().forceNukeSimulation();
        }
    },

    switchContext: async (entityId = null) => {
        logger.log('[AuthStore] Switching context to:', entityId || 'Personal Profile');
        set({ activeEntityId: entityId });

        if (!entityId) {
            const { realProfile } = get();
            set({ profile: realProfile, impersonatedProfile: null });
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
                set({ impersonatedProfile: impersonated, profile: impersonated });
            }
        } catch (err) {
            logger.error('[AuthStore] Error switching context:', err);
        }
    },

    logout: async () => {
        logger.log('[AuthStore] !!! COMENÇANT SEQÜÈNCIA DE SORTIDA RESILIENT !!!');
        const { isPlayground } = get();

        const clearLocalState = () => {
            localStorage.removeItem('isPlaygroundMode');
            localStorage.removeItem('sb-simulation-mode');
            localStorage.removeItem('nuke_in_progress');
            localStorage.removeItem('sp_sovereign_identity');
            localStorage.removeItem('isGuestMode');
            localStorage.removeItem('sp_user_cache');
            terminateWorkers();
            set({
                user: null, profile: null, realUser: null, realProfile: null,
                isPlayground: false, impersonatedProfile: null, activeEntityId: null,
                loading: false, activeActor: { type: 'human', id: null }
            });
        };

        if (isPlayground) {
            await get().forceNukeSimulation();
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
                logger.warn('[AuthStore] Supabase signOut failed or timed out:', err);
            });
            clearTimeout(timerId);
        } catch (err) {
            logger.error('[AuthStore] Error during Supabase signOut:', err);
        } finally {
            clearLocalState();
            logger.log('[AuthStore] Local state cleared.');
        }
    },

    // El mètode central que inicialitza l'estat des de Supabase. Aïllat ací, alliberant el Context.
    handleAuthEvent: async (event, session) => {
        logger.log(`[AuthStore] Auth Event: ${event}`, session?.user?.id);
        const { isPlayground, loginAsGuest, generateSovereignIdentity } = get();

        try {
            const isSimulation = isPlayground ||
                localStorage.getItem('sb-simulation-mode') === 'true' ||
                (session?.user?.id === IAIA_ID);

            if (session?.user) {
                if (isSimulation) {
                    set({ isPlayground: false });
                    localStorage.removeItem('isPlaygroundMode');
                    localStorage.removeItem('sb-simulation-mode');
                }

                set({
                    realUser: session.user, user: session.user,
                    impersonatedProfile: null, activeEntityId: null,
                    activeActor: { type: 'human', id: session.user.id }
                });

                try {
                    let profileData = await supabaseService.getProfile(session.user.id);
                    profileData = await profileHealingService.healGhostProfile(session, profileData, isSimulation);
                    const { effectiveProfile, isOfficialCreator } = profileHealingService.protectMasterIdentity(session, profileData);

                    set({ realProfile: effectiveProfile, profile: effectiveProfile });
                    logger.log(`[AuthStore] 🏺 IDENTITY CONSOLIDATED:`, isOfficialCreator ? 'MESTRE JAVI' : effectiveProfile.full_name);
                } catch (error) {
                    logger.error('[AuthStore] Error loading profile:', error);
                    const fallback = {
                        id: session.user.id,
                        full_name: session.user.email?.split('@')[0] || 'Sóc de Poble',
                        role: USER_ROLES.NEIGHBOR
                    };
                    set({ realProfile: fallback, profile: fallback });
                }
            } else if (isSimulation) {
                loginAsGuest();
                set({ realUser: null, realProfile: null });
            } else if (localStorage.getItem('isGuestMode') === 'true') {
                const guestUser = { id: 'guest_restored', full_name: 'Visitant Gentil', role: 'guest', isAnonymous: true };
                set({ user: guestUser, profile: guestUser, activeActor: { type: 'human', id: guestUser.id } });
            } else {
                let genesis = await identityService.getStoredIdentity();
                if (!genesis) genesis = await generateSovereignIdentity();
                
                if (genesis.full_name === 'Foraster de Poble' || genesis.full_name === 'Sóc de Poble' || genesis.full_name === 'Sóc de Poble!') {
                    genesis.full_name = 'Foraster';
                }
                
                const sovereignUser = { ...genesis, is_sovereign: true, isAnonymous: true, role: USER_ROLES.GUEST };
                set({ user: sovereignUser, profile: genesis, activeActor: { type: 'human', id: sovereignUser.id } });
            }
        } catch (error) {
            logger.error('[AuthStore] Auth handle failed:', error);
        } finally {
            set({ loading: false });
        }
    }
}));
