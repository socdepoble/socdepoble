import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import './Auth.css';

const Login = () => {
    const { t } = useTranslation();
    const { loginAsGuest } = useAppContext();
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
            navigate('/mur');
        }
        setLoading(false);
    };

    const handleGuestLogin = () => {
        loginAsGuest();
        navigate('/mur');
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <img src="/favicon.png" alt="Logo" className="auth-logo" />
                <h1>{t('auth.login')}</h1>
                <p className="auth-subtitle">Benvingut de nou a la teua comunitat</p>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>{t('auth.email')}</label>
                        <input
                            type="email"
                            placeholder="usuari@exemple.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('auth.password')}</label>
                        <input
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

                <div className="auth-divider">
                    <span>o bé</span>
                </div>

                <button onClick={handleGuestLogin} className="auth-button secondary">
                    Entrar com a Veí (Demo)
                </button>

                <div className="auth-footer">
                    {t('auth.noAccount')} <Link to="/register">{t('auth.signUp')}</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
