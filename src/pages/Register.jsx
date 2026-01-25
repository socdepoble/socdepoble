import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, ArrowRight, Loader2 } from 'lucide-react';
import TownSelectorModal from '../components/TownSelectorModal';
import './Auth.css';

const Register = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    // State for auth modes
    const [authMethod, setAuthMethod] = useState('phone'); // 'phone' | 'email'
    const [step, setStep] = useState('input'); // 'input' | 'verify'

    // Form states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [selectedTown, setSelectedTown] = useState(null);

    // UI states
    const [isTownModalOpen, setIsTownModalOpen] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // WebOTP API Integration
    useEffect(() => {
        if (step === 'verify' && 'OTPCredential' in window) {
            const ac = new AbortController();

            navigator.credentials.get({
                otp: { transport: ['sms'] },
                signal: ac.signal
            }).then(otp => {
                if (otp && otp.code) {
                    setOtp(otp.code);
                    handleVerifyOtp(null, otp.code); // Auto-submit
                }
            }).catch(err => {
                logger.warn('WebOTP not available or timed out', err);
            });

            return () => {
                ac.abort();
            };
        }
    }, [step]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!selectedTown) {
            setError('Has de seleccionar un poble per a registrar-te.');
            setLoading(false);
            return;
        }

        if (authMethod === 'phone') {
            try {
                // Basic phone validation
                if (!phone || phone.length < 9) {
                    throw new Error(t('auth.invalid_phone') || 'Introdueix un número vàlid');
                }

                // Ensure international format
                const formattedPhone = phone.startsWith('+') ? phone : `+34${phone}`;

                await supabaseService.signInWithOtp(formattedPhone);
                setStep('verify');
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
            return;
        }

        // Email flow
        try {
            await supabaseService.signUp(email, password, {
                full_name: fullName,
                town_id: selectedTown.id,
                town_uuid: selectedTown.uuid
            });
            navigate('/login', { state: { message: '¡Compte creat! Revisa el teu correu per a verificar l\'adreça abans d\'entrar.' } });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e, codeToVerify = null) => {
        e?.preventDefault();
        setLoading(true);
        setError(null);
        const code = codeToVerify || otp;

        try {
            const formattedPhone = phone.startsWith('+') ? phone : `+34${phone}`;
            const { user } = await supabaseService.verifyOtp(formattedPhone, code);

            // Update profile with name and town immediately after verification
            if (user) {
                await supabaseService.updateProfile(user.id, {
                    full_name: fullName,
                    town_id: selectedTown?.id, // Legacy compatibility
                    town_uuid: selectedTown?.uuid,
                    primary_town: selectedTown?.name
                });
            }

            navigate('/chats');
        } catch (err) {
            setError(err.message || 'Codi invàlid');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <img src="/favicon.png" alt="Logo" className="auth-logo" />
                <h1>{t('auth.register')}</h1>
                <p className="auth-subtitle">Registra't per a formar part del teu poble.</p>

                <div className="auth-onboarding-hint">
                    <p>✨ {authMethod === 'phone' ? 'Rebràs un codi SMS.' : 'Rebràs un correu per confirmar.'}</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                {step === 'verify' ? (
                    <form onSubmit={handleVerifyOtp} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="otp-input">Codi de Verificació</label>
                            <input
                                id="otp-input"
                                type="text"
                                placeholder="123456"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                autoComplete="one-time-code"
                                inputMode="numeric"
                                maxLength={6}
                                required
                                className="otp-input-field"
                            />
                            <p className="input-hint">Introdueix el codi que has rebut al {phone}.</p>
                        </div>
                        <button type="submit" className="auth-button" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : 'Verificar i Entrar'}
                        </button>
                        <button
                            type="button"
                            className="text-btn secondary-action"
                            onClick={() => setStep('input')}
                            disabled={loading}
                        >
                            Tornar enrere
                        </button>
                    </form>
                ) : (
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

                        {authMethod === 'email' ? (
                            <>
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
                            </>
                        ) : (
                            <div className="form-group">
                                <label htmlFor="phone-input">Mòbil</label>
                                <div className="phone-input-wrapper">
                                    <span className="phone-prefix">🇪🇸 +34</span>
                                    <input
                                        id="phone-input"
                                        type="tel"
                                        placeholder="600 000 000"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                                        autoComplete="tel-national"
                                        required
                                        className="phone-input-field"
                                    />
                                </div>
                                <p className="input-hint">T'enviarem un SMS per verificar.</p>
                            </div>
                        )}

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
                            {loading ? <Loader2 className="animate-spin" /> : (authMethod === 'email' ? t('auth.signUp') : 'Continuar')}
                        </button>

                        <div className="auth-alt-methods centered" style={{ marginTop: '16px' }}>
                            {authMethod === 'email' ? (
                                <button type="button" className="text-btn small" onClick={() => setAuthMethod('phone')}>
                                    <Phone size={14} /> Registrar-se amb Mòbil
                                </button>
                            ) : (
                                <button type="button" className="text-btn small" onClick={() => setAuthMethod('email')}>
                                    <Mail size={14} /> Registrar-se amb Email
                                </button>
                            )}
                        </div>
                    </form>
                )}

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
