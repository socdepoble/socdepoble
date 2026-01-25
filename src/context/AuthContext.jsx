import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { supabaseService } from '../services/supabaseService';
import { logger } from '../utils/logger';
import i18n from '../i18n/config';
import { DEMO_USER_ID, AUTH_EVENTS, USER_ROLES } from '../constants';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [realUser, setRealUser] = useState(null);
    const [realProfile, setRealProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPlayground, setIsPlayground] = useState(localStorage.getItem('isPlaygroundMode') === 'true');
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

        // DUAL IDENTITY: 
        // 1. Technical Actor (Supabase Auth) stays as realUser if present
        // 2. Visual Persona (Profile) becomes the character

        if (realUser) {
            setUser(realUser); // Supabase expects the real JWT for RLS
        } else {
            // Fallback for non-logged users: full mock
            setUser({ id: personaProfile.id, email: `${personaProfile.username}@playground.local`, isDemo: true });
        }

        setProfile({ ...personaProfile, is_playground_session: true });
        setLoading(false);
    };

    const loginAsGuest = () => {
        // Fallback backward compatibility or default demo entry
        adoptPersona({
            id: DEMO_USER_ID,
            full_name: 'Vicent Ferris',
            username: 'vferris',
            role: USER_ROLES.NEIGHBOR,
            is_demo: true,
            avatar_url: '/images/demo/avatar_man_old.png'
        });
    };

    const logout = async () => {
        if (isPlayground && realUser) {
            // Cleanup ephemeral data before fully leaving (handled by caller or useEffect)
            logger.log('[AuthContext] Leaving Playground, triggering cleanup...');
        }

        localStorage.removeItem('isPlaygroundMode');
        setIsPlayground(false);
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setRealUser(null);
        setRealProfile(null);
    };

    useEffect(() => {
        let isMounted = true;
        let initialCheckDone = false;

        const handleAuth = async (event, session) => {
            if (!isMounted) return;
            logger.log('[AuthContext] Auth Event:', event, session?.user?.id);

            const playgroundStored = localStorage.getItem('isPlaygroundMode') === 'true';

            if (session?.user) {
                setRealUser(session.user);

                // Only force out of playground if specifically signing in now
                // or if no playground session was active
                if (event === 'SIGNED_IN' || !playgroundStored) {
                    setUser(session.user);
                    localStorage.removeItem('isPlaygroundMode');
                    setIsPlayground(false);
                }

                // Load profile if we don't have one or if we are NOT in playground
                if (!profile || (event === 'SIGNED_IN' || !playgroundStored)) {
                    try {
                        const profileData = await supabaseService.getProfile(session.user.id);
                        if (isMounted) {
                            setRealProfile(profileData);
                            // Only update visual profile if not in playground
                            if (!playgroundStored) {
                                setProfile(profileData);
                            }
                        }
                    } catch (error) {
                        logger.error('[AuthContext] Error loading profile:', error);
                    }
                }
            } else if (playgroundStored) {
                // We keep the state in memory if possible, or reload default
                if (!user) {
                    logger.log('[AuthContext] Restoring playground guest session');
                    loginAsGuest();
                }
            } else {
                setUser(null);
                setProfile(null);
            }

            if (isMounted) setLoading(false);
        };

        supabase.auth.getSession().then(({ data: { session }, error }) => {
            if (error) {
                logger.error('[AuthContext] Error getting session:', error);
            }
            initialCheckDone = true;
            handleAuth(AUTH_EVENTS.INITIAL_SESSION, session);
        }).catch(err => {
            logger.error('[AuthContext] Crash in getSession:', err);
            initialCheckDone = true;
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (!initialCheckDone && event === 'SIGNED_IN') return;

            // Handle TOKEN_REFRESHED or USER_UPDATED to avoid stale UI
            if (event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
                logger.log(`[AuthContext] Refreshing data for event: ${event}`);
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
            logout,
            isPlayground,
            setIsPlayground,
            isSuperAdmin: profile?.is_super_admin || user?.email === 'socdepoblecom@gmail.com',
            isAdmin: profile?.is_admin || profile?.is_super_admin || user?.email === 'socdepoblecom@gmail.com' || user?.email === 'damimus@gmail.com',
            impersonatedProfile,
            setImpersonatedProfile,
            activeEntityId,
            setActiveEntityId,
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
