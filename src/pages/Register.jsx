import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';
import { useTranslation } from 'react-i18next';

const Register = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabaseService.signUp(email, password, {
            full_name: fullName
        });

        if (error) {
            setError(error.message);
        } else {
            // Éxito - redirigir o mostrar mensaje de confirmación
            alert(t('auth.checkEmail'));
            navigate('/login');
        }
        setLoading(false);
    };

    return (
        <div className="auth-container" style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
            <h1>{t('auth.register')}</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                    type="text"
                    placeholder={t('auth.fullName')}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                />
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
                    {loading ? t('common.loading') : t('auth.signUp')}
                </button>
            </form>
            <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                {t('auth.haveAccount')} <Link to="/login">{t('auth.signIn')}</Link>
            </p>
        </div>
    );
};

export default Register;
