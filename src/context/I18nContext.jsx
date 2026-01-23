import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
    const { i18n } = useTranslation();
    const [language, setLanguage] = useState(i18n.language || 'va');

    useEffect(() => {
        if (language && language !== i18n.language) {
            i18n.changeLanguage(language);
        }
        localStorage.setItem('i18nextLng', language);
    }, [language, i18n]);

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
