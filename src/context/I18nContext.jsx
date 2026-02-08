import { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n/config';

const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
    // [MASTER] Usem el bategat directe de i18n.js per evitar xoc de hooks a l'arrencada
    const [language, setLanguage] = useState(i18n.language || 'va');

    useEffect(() => {
        if (language && language !== i18n.language) {
            i18n.changeLanguage(language);
        }
        localStorage.setItem('i18nextLng', language);
    }, [language]);

    const toggleLanguage = () => {
        const languages = ['va', 'es', 'gl', 'eu', 'en'];
        const currentIndex = languages.indexOf(language.split('-')[0]);
        const nextIndex = (currentIndex + 1) % languages.length;
        setLanguage(languages[nextIndex]);
    };

    return (
        <I18nContext.Provider value={{
            language,
            setLanguage,
            toggleLanguage
        }}>
            {children}
        </I18nContext.Provider>
    );
};

export const useI18n = () => {
    const context = useContext(I18nContext);
    if (!context) throw new Error('useI18n must be used within an I18nProvider');
    return context;
};
