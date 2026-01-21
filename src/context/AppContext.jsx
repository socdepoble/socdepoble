import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';
import { supabaseService } from '../services/supabaseService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const { i18n } = useTranslation();
    const [language, setLanguage] = useState(i18n.language || 'va');
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const loginAsGuest = () => {
        const demoId = '00000000-0000-0000-0000-000000000000';
        setUser({ id: demoId, email: 'vei@socdepoble.net', isDemo: true });
        setProfile({
            id: demoId,
            full_name: 'Veí de Prova',
            username: 'veiprestat',
            role: 'vei',
            is_demo: true,
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo'
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

        // 1. Verificación inicial de sesión explícita
        supabase.auth.getSession().then(({ data: { session } }) => {
            handleAuth('INITIAL_SESSION', session);
        });

        // 2. Suscripción a cambios futuros
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            // Algunos eventos secundarios no necesitan disparar todo el proceso
            if (event === 'SIGNED_OUT' || event === 'SIGNED_IN' || event === 'USER_UPDATED') {
                handleAuth(event, session);
            }
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (language !== i18n.language) {
            i18n.changeLanguage(language);
        }
        localStorage.setItem('language', language);
    }, [language, i18n]);

    const toggleLanguage = () => {
        const languages = ['va', 'es', 'gl', 'eu', 'en'];
        const currentIndex = languages.indexOf(language);
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
            setIsCreateModalOpen
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
