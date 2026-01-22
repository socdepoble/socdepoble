import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';
import { supabaseService } from '../services/supabaseService';
import { DEMO_USER_ID, AUTH_EVENTS, USER_ROLES } from '../constants';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const { i18n } = useTranslation();
    const [language, setLanguage] = useState(i18n.language || 'va');
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [impersonatedProfile, setImpersonatedProfile] = useState(null);
    const [activeEntityId, setActiveEntityId] = useState(null); // Managed entity

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const loginAsGuest = () => {
        // Habilitat en producció per a auditoria (Fase 4)

        const demoId = DEMO_USER_ID;
        setUser({ id: demoId, email: 'vferris@socdepoble.net', isDemo: true });
        setProfile({
            id: demoId,
            full_name: 'Vicent Ferris',
            username: 'vferris',
            role: USER_ROLES.NEIGHBOR,
            is_demo: true,
            avatar_url: '/images/demo/avatar_man_old.png'
        });
        setLoading(false);
        localStorage.setItem('isDemoMode', 'true');
    };
    const loginWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/chats`
            }
        });
        if (error) throw error;
    };

    const logout = async () => {
        localStorage.removeItem('isDemoMode');
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
    };

    useEffect(() => {
        let isMounted = true;
        let initialCheckDone = false;

        const handleAuth = async (event, session) => {
            if (!isMounted) return;
            console.log('[AppContext] Auth Event:', event, session?.user?.id);

            if (session?.user) {
                setUser(session.user);
                localStorage.removeItem('isDemoMode');
                try {
                    const profileData = await supabaseService.getProfile(session.user.id);
                    if (isMounted) setProfile(profileData);
                } catch (error) {
                    console.error('[AppContext] Error loading profile:', error);
                }
            } else if (localStorage.getItem('isDemoMode') === 'true') {
                loginAsGuest();
            } else {
                setUser(null);
                setProfile(null);
            }

            if (isMounted) setLoading(false);
        };

        // 1. Verificació inicial de sessió explícita
        supabase.auth.getSession().then(({ data: { session } }) => {
            initialCheckDone = true;
            handleAuth(AUTH_EVENTS.INITIAL_SESSION, session);
        });

        // 2. Suscripció a canvis futurs
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            // Ignorar SIGNED_IN durant la càrrega inicial per evitar race conditions
            if (!initialCheckDone && event === 'SIGNED_IN') {
                console.log('[AppContext] Ignorant SIGNED_IN duplicat durant la càrrega inicial');
                return;
            }

            if (Object.values(AUTH_EVENTS).includes(event) || event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
                handleAuth(event, session);
            }
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        // Al montar, sincronizar el estado local con i18n (que ya detectó vía localStorage)
        if (i18n.language && i18n.language !== language) {
            setLanguage(i18n.language);
        }
    }, []);

    useEffect(() => {
        if (language && language !== i18n.language) {
            i18n.changeLanguage(language);
        }
        localStorage.setItem('i18nextLng', language);
    }, [language, i18n]);

    const toggleLanguage = () => {
        const languages = ['va', 'es', 'gl', 'eu', 'en'];
        const currentIndex = languages.indexOf(language.split('-')[0]); // Manejar va-ES
        const nextIndex = (currentIndex + 1) % languages.length;
        setLanguage(languages[nextIndex]);
    };

    return (
        <AppContext.Provider value={{
            language,
            setLanguage,
            toggleLanguage,
            theme,
            toggleTheme,
            user,
            profile,
            setProfile,
            loading,
            setUser,
            loginAsGuest,
            logout,
            loginWithGoogle,
            isCreateModalOpen,
            setIsCreateModalOpen,
            isSuperAdmin: profile?.is_super_admin || user?.email === 'socdepoblecom@gmail.com',
            impersonatedProfile,
            setImpersonatedProfile,
            activeEntityId,
            setActiveEntityId
        }}>
            {children}
        </AppContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext debe usarse dentro de un AppProvider');
    }
    return context;
};
