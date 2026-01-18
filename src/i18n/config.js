import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import vaTranslations from './locales/va.json';
import esTranslations from './locales/es.json';
import glTranslations from './locales/gl.json';
import euTranslations from './locales/eu.json';
import enTranslations from './locales/en.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            va: { translation: vaTranslations },
            es: { translation: esTranslations },
            gl: { translation: glTranslations },
            eu: { translation: euTranslations },
            en: { translation: enTranslations }
        },
        fallbackLng: 'va',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
