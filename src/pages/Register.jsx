import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';
import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';
import TownSelectorModal from '../components/TownSelectorModal';
import './Auth.css';

const Register = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [selectedTown, setSelectedTown] = useState(null);
    const [isTownModalOpen, setIsTownModalOpen] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!selectedTown) {
            setError('Has de seleccionar un poble per a registrar-te.');
            setLoading(false);
            return;
        }

        try {
            await supabaseService.signUp(email, password, {
                full_name: fullName,
                town_id: selectedTown.id,
                town_uuid: selectedTown.uuid
            });
            alert(t('auth.checkEmail'));
            navigate('/login');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
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
                        <label htmlFor="register-name">{t('auth.fullName') || 'Nombre Completo'}</label>
                        <input
                            id="register-name"
                            name="full_name"
                            type="text"
                            autoComplete="name"
                            placeholder="Nom i cognoms"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="register-email">{t('auth.email')}</label>
                        <input
                            id="register-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder="usuari@exemple.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="register-password">{t('auth.password')}</label>
                        <input
                            id="register-password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            placeholder="Mínim 6 caràcters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>El teu poble principal (Obligatori)</label>
                        <button
                            type="button"
                            className={`town-picker-trigger ${!selectedTown ? 'empty' : ''}`}
                            onClick={() => setIsTownModalOpen(true)}
                        >
                            <MapPin size={18} color="var(--color-primary)" />
                            <span>{selectedTown ? selectedTown.name : 'Prem per a seleccionar poble'}</span>
                        </button>
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? t('common.loading') : t('auth.signUp')}
                    </button>
                </form>

                <div className="auth-footer">
                    {t('auth.haveAccount')} <Link to="/login">{t('auth.signIn')}</Link>
                </div>
            </div>

            <TownSelectorModal
                isOpen={isTownModalOpen}
                onClose={() => setIsTownModalOpen(false)}
                onSelect={(town) => {
                    setSelectedTown(town);
                    setIsTownModalOpen(false);
                    setError(null);
                }}
            />
        </div>
    );
};

export default Register;
