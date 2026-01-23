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
        setUser({ id: personaProfile.id, email: `${personaProfile.username}@playground.local`, isDemo: true });
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
        localStorage.removeItem('isPlaygroundMode');
        setIsPlayground(false);
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
    };

    useEffect(() => {
        let isMounted = true;
        let initialCheckDone = false;

        const handleAuth = async (event, session) => {
            if (!isMounted) return;
            logger.log('[AuthContext] Auth Event:', event, session?.user?.id);

            if (session?.user) {
                setUser(session.user);
                localStorage.removeItem('isPlaygroundMode');
                setIsPlayground(false);
                try {
                    const profileData = await supabaseService.getProfile(session.user.id);
                    if (isMounted) setProfile(profileData);
                } catch (error) {
                    logger.error('[AuthContext] Error loading profile:', error);
                }
            } else if (localStorage.getItem('isPlaygroundMode') === 'true') {
                // We keep the state in memory if possible, or reload default
                if (!user) loginAsGuest();
            } else {
                setUser(null);
                setProfile(null);
            }

            if (isMounted) setLoading(false);
        };

        supabase.auth.getSession().then(({ data: { session } }) => {
            initialCheckDone = true;
            handleAuth(AUTH_EVENTS.INITIAL_SESSION, session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (!initialCheckDone && event === 'SIGNED_IN') return;
            handleAuth(event, session);
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            profile,
            loading,
            setProfile,
            adoptPersona,
            loginAsGuest,
            logout,
            isPlayground,
            setIsPlayground,
            isSuperAdmin: profile?.is_super_admin || user?.email === 'socdepoblecom@gmail.com',
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
