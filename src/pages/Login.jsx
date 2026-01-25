import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

/* Inline styles for forgot password link */
// .forgot-password-link {
//     text-align: right;
//     margin-top: 0.25rem;
// }
// .text-btn {
//     background: none;
//     border: none;
//     color: var(--color-primary);
//     font-size: 0.85rem;
//     cursor: pointer;
//     padding: 0;
// }

const Login = () => {
    const { adoptPersona, isPlayground, logout, setLanguage, language } = useAuth();
    const { t, i18n } = useTranslation();
    const activeLang = language || i18n.language || 'va';
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isResetMode, setIsResetMode] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(location.state?.message || null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            if (isResetMode) {
                await supabaseService.resetPasswordForEmail(email);
                setSuccessMessage(t('auth.reset_email_sent') || 'Si el correu existeix, rebràs un enllaç per recuperar la contrasenya.');
                setIsResetMode(false);
            } else {
                await supabaseService.signIn(email, password);
                navigate('/chats');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGuestLogin = async () => {
        // "Guest" effectively means using the demo persona in this context or playground mode
        await adoptPersona('11111111-1111-4111-a111-000000000001'); // Vicent Ferris default
        navigate('/chats');
    };

    const loginWithGoogle = async () => {
        // Robust Google Login wrapper
        const { error } = await supabaseService.signInWithGoogle();
        if (error) throw error;
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <img src="/logo.png" alt="Logo" className="auth-logo-elongated" />

                {successMessage && <div className="auth-success-alert">{successMessage}</div>}

                <div className="demo-login-wrapper">
                    <button onClick={handleGuestLogin} className="auth-button demo-secondary">
                        Explorar com a Veí (Demo)
                    </button>
                    <p className="demo-hint">Accés ràpid per a provar, sense registre.</p>

                    <div className="language-selector-auth">
                        {[
                            { code: 'va', label: 'VA' },
                            { code: 'es', label: 'ES' },
                            { code: 'en', label: 'EN' },
                            { code: 'gl', label: 'GL' },
                            { code: 'eu', label: 'EU' }
                        ].map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => setLanguage(lang.code)}
                                className={`lang-btn ${activeLang.startsWith(lang.code) ? 'active' : ''}`}
                            >
                                {lang.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="auth-divider">
                    <span>{t('auth.or_sign_in')}</span>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleLogin} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="login-email">{t('auth.email')}</label>
                        <input
                            id="login-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder={t('auth.email_placeholder')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {!isResetMode && (
                        <div className="form-group">
                            <label htmlFor="login-password">{t('auth.password')}</label>
                            <input
                                id="login-password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required={!isResetMode}
                            />
                            <div className="forgot-password-link">
                                <button type="button" onClick={() => setIsResetMode(true)} className="text-btn">
                                    {t('auth.forgot_password') || 'Has oblidat la contrasenya?'}
                                </button>
                            </div>
                        </div>
                    )}

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? t('common.loading') : (isResetMode ? (t('auth.send_reset_link') || 'Enviar enllaç de recuperació') : t('auth.signIn'))}
                    </button>

                    {isResetMode && (
                        <button type="button" className="auth-button secondary" onClick={() => setIsResetMode(false)}>
                            {t('common.cancel') || 'Cancel·lar'}
                        </button>
                    )}
                </form>

                <div className="social-auth-section">
                    <button
                        onClick={async () => {
                            try {
                                await loginWithGoogle();
                            } catch (err) {
                                setError(err.message);
                            }
                        }}
                        className="auth-button google-auth"
                    >
                        <img src="/assets/google-logo.svg" onError={(e) => e.target.style.display = 'none'} alt="" />
                        {t('auth.continue_google')}
                    </button>
                </div>

                <div className="auth-footer">
                    {t('auth.noAccount')} <Link to="/register">{t('auth.signUp')}</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
