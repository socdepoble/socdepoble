import { AuthProvider, useAuth } from './AuthContext';
import { UIProvider, useUI } from './UIContext';
import { I18nProvider, useI18n } from './I18nContext';
import { SocialProvider, useSocial } from './SocialContext';

export const AppProvider = ({ children }) => {
    return (
        <I18nProvider>
            <UIProvider>
                <AuthProvider>
                    <SocialProvider>
                        {children}
                    </SocialProvider>
                </AuthProvider>
            </UIProvider>
        </I18nProvider>
    );
};

// Shorthand for backward compatibility during transition
export const useAppContext = () => {
    const auth = useAuth();
    const ui = useUI();
    const i18n = useI18n();
    const social = useSocial();
    return { ...auth, ...ui, ...i18n, ...social };
};
