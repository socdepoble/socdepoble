import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';
import { useTranslation } from 'react-i18next';
import './Auth.css';

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
            alert(t('auth.checkEmail'));
            navigate('/login');
        }
        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <img src="/favicon.png" alt="Logo" className="auth-logo" />
                <h1>{t('auth.register')}</h1>
                <p className="auth-subtitle">Crea el teu compte i connecta amb el poble</p>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label>{t('auth.fullName')}</label>
                        <input
                            type="text"
                            placeholder="Nom i cognoms"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>
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
                            placeholder="Mínim 6 caràcters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? t('common.loading') : t('auth.signUp')}
                    </button>
                </form>

                <div className="auth-footer">
                    {t('auth.haveAccount')} <Link to="/login">{t('auth.signIn')}</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
