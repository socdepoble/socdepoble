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

    useEffect(() => {
        // MODO DEMO: Usuario de prueba si no hay sesión real
        const setupDemo = () => {
            const demoId = '00000000-0000-0000-0000-000000000000';
            setUser({ id: demoId, email: 'vei@socdepoble.net' });
            setProfile({
                id: demoId,
                full_name: 'Javi Llinares',
                username: 'javillinares',
                role: 'vei',
                avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Javi'
            });
            setLoading(false);
        };

        // Escuchar cambios de autenticación
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                setUser(session.user);
                try {
                    const profileData = await supabaseService.getProfile(session.user.id);
                    setProfile(profileData);
                } catch (error) {
                    console.error('Error loading profile:', error);
                }
                setLoading(false);
            } else {
                // Si no hay sesión, entramos en modo demo para Javi
                setupDemo();
            }
        });

        return () => {
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
            user,
            profile,
            setProfile,
            loading,
            setUser
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
