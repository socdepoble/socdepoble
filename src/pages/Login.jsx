import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import './Auth.css';

const Login = () => {
    const { t, i18n } = useTranslation();
    const { loginAsGuest, loginWithGoogle } = useAppContext();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabaseService.signIn(email, password);

        if (error) {
            setError(error.message);
        } else {
            navigate('/chats');
        }
        setLoading(false);
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
                    <button onClick={handleGuestLogin} className="auth-button demo-primary">
                        {t('auth.demo_access') || 'Entrar com a Veí (Demo)'}
                    </button>
                    <p className="demo-hint">{t('auth.demo_hint') || 'Accés ràpid per a revisió sense registre'}</p>

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
                                onClick={() => i18n.changeLanguage(lang.code)}
                                className={`lang-btn ${i18n.language?.startsWith(lang.code) ? 'active' : ''}`}
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
                        <label>{t('auth.email')}</label>
                        <input
                            id="login-email"
                            name="email"
                            type="email"
                            placeholder={t('auth.email_placeholder')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('auth.password')}</label>
                        <input
                            id="login-password"
                            name="password"
                            type="password"
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
                        {t('auth.continue_google') || 'Continua amb Google'}
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
