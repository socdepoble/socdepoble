import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
    const { adoptPersona, isPlayground, logout, setLanguage, language } = useAuth();
    const { t, i18n } = useTranslation();
    const activeLang = language || i18n.language || 'va';
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await supabaseService.signIn(email, password);
            navigate('/chats');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGuestLogin = () => {
        loginAsGuest();
        navigate('/chats');
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <img src="/logo.png" alt="Logo" className="auth-logo-elongated" />

                <div className="demo-login-wrapper">
                    <button onClick={() => navigate('/playground')} className="auth-button demo-primary">
                        Simulador interactiu
                    </button>
                    <p className="demo-hint">Entra sense registre, per provar el sistema.</p>
                    <button onClick={() => navigate('/mur')} className="auth-button demo-primary">
                        Mirar sense registre
                    </button>

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
                            required
                        />
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? t('common.loading') : t('auth.signIn')}
                    </button>
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
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
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
