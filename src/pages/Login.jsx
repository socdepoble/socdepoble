import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const { t } = useTranslation();
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

    return (
        <div className="auth-container" style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
            <h1>{t('auth.login')}</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                    type="email"
                    placeholder={t('auth.email')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder={t('auth.password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading} style={{
                    backgroundColor: '#2e7d32',
                    color: 'white',
                    padding: '0.8rem',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}>
                    {loading ? t('common.loading') : t('auth.signIn')}
                </button>
            </form>
            <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                {t('auth.noAccount')} <Link to="/register">{t('auth.signUp')}</Link>
            </p>
        </div>
    );
};

export default Login;
