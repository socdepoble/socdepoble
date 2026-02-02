import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, ArrowRight, Loader2, User, ShieldCheck, CheckCircle2, ChevronRight, Globe, Zap } from 'lucide-react';
import MeshStar from '../components/MeshStar';
import TownSelectorModal from '../components/TownSelectorModal';
import { useAuth } from '../context/AuthContext';
import { logger } from '../utils/logger';
import './Auth.css';

/**
 * [FLASH MASTERPIECE] Register.jsx v2.0
 * La millor pàgina de registre del món: ràpida, premium i sobirana.
 */
const Register = () => {
    const { setIsPlayground, user } = useAuth();
    const { i18n } = useTranslation();
    const navigate = useNavigate();

    // [DIRECTIVA 1] Auto-redirect already authenticated users
    useEffect(() => {
        if (user && !user.isDemo) {
            navigate('/chats', { replace: true });
        }
    }, [user, navigate]);

    // State for auth modes & steps
    const [authMethod, setAuthMethod] = useState('phone'); // 'phone' | 'email'
    const [step, setStep] = useState('identity'); // 'identity' | 'verify'

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
    const [resendCountdown, setResendCountdown] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleVerifyOtp = useCallback(async (e, codeToVerify = null) => {
        e?.preventDefault();
        setLoading(true);
        setError(null);
        const code = codeToVerify || otp;

        try {
            const formattedPhone = phone.startsWith('+') ? phone : `+34${phone}`;
            const { user: verifiedUser } = await supabaseService.verifyOtp(formattedPhone, code);

            if (verifiedUser) {
                await supabaseService.updateProfile(verifiedUser.id, {
                    full_name: fullName,
                    town_id: selectedTown?.id,
                    town_uuid: selectedTown?.uuid,
                    primary_town: selectedTown?.name
                });

                // Track activation
                logger.log('[Registration] Success for:', fullName);
            }

            setIsPlayground(false);
            navigate('/chats');
        } catch (err) {
            setError(err.message || 'Codi de seguretat invàlid.');
        } finally {
            setLoading(false);
        }
    }, [otp, phone, fullName, selectedTown, setIsPlayground, navigate]);

    useEffect(() => {
        if (otp && otp.length === 6 && step === 'verify') {
            handleVerifyOtp(null, otp);
        }
    }, [step, handleVerifyOtp, otp]);

    // [V1.5.8 - ZERO-CLICK LOGIN] WebOTP API per a lectura automàtica d'SMS
    useEffect(() => {
        if ('OTPCredential' in window && step === 'verify') {
            const ac = new AbortController();
            navigator.credentials.get({
                otp: { transport: ['sms'] },
                signal: ac.signal
            }).then(otpData => {
                if (otpData && otpData.code) {
                    logger.log('[WebOTP] Codi detectat automàticament:', otpData.code);
                    setOtp(otpData.code);
                }
            }).catch(err => {
                if (err.name !== 'AbortError') {
                    logger.warn('[WebOTP] Error o cancel·lat', err);
                }
            });

            return () => ac.abort();
        }
    }, [otp, handleVerifyOtp, step]);

    // Resend countdown timer
    useEffect(() => {
        let timer;
        if (resendCountdown > 0) {
            timer = setInterval(() => {
                setResendCountdown(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [resendCountdown]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!selectedTown) {
            setError('Selecciona el teu poble per a continuar el procés.');
            setLoading(false);
            return;
        }

        if (authMethod === 'phone') {
            try {
                if (!phone || phone.length < 9) {
                    throw new Error('Introdueix un número de mòbil vàlid.');
                }
                const formattedPhone = phone.startsWith('+') ? phone : `+34${phone}`;
                await supabaseService.signInWithOtp(formattedPhone);
                setStep('verify');
                setResendCountdown(60);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
            return;
        }

        // Email flow
        try {
            await supabaseService.signUp(
                email,
                password,
                {
                    full_name: fullName,
                    town_id: selectedTown.id,
                    town_uuid: selectedTown.uuid
                }
            );
            navigate('/login', { state: { message: '¡Compte creat! Revisa el teu correu per a confirmar la teua entrada.' } });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="auth-container premium-onboarding">
            <div className="auth-hero-overlay"></div>

            <div className="auth-card register-card-v2 animate-in-up">
                {/* Visual Progress Bar */}
                <div className="onboarding-progress">
                    <div className={`progress-segment ${step === 'identity' ? 'active' : 'completed'}`}></div>
                    <div className={`progress-segment ${step === 'verify' ? 'active' : ''}`}></div>
                </div>

                <header className="auth-header">
                    <img src="/logo.png" alt="Sóc de Poble" className="auth-logo-v2" />

                    {/* [MASTER GUIDANCE] La IAIA sempre guia el bategat */}
                    <div className="auth-iaia-guidance" style={{ marginTop: '0', marginBottom: '24px' }}>
                        <div className="iaia-avatar-wrapper">
                            <img src="/assets/avatars/iaia_official.png" alt="MArIA" className="iaia-mini-avatar" />
                            <div className="iaia-pulse"></div>
                        </div>
                        <div className="iaia-speech-bubble">
                            {step === 'identity'
                                ? <>Hola, bonica! Soc la IAIA. Tria el teu nom i el teu poble.<br />Vine al redol, que ací xategem tots els veïns! 🗣️🏘️</>
                                : "T'he enviat el codi de seguretat al mòbil. Posa'l ací baix i entrarem a la plaça! 📱🏘️"}
                        </div>
                    </div>

                    <h1>{step === 'identity' ? 'Crea la teua Identitat' : 'Verifica el teu accés'}</h1>
                    <p className="auth-subtitle">
                        {step === 'identity'
                            ? 'Connecta amb els teus veïns d\'avui i de sempre.'
                            : `T'hem enviat un SMS al +34 ${phone}.`}
                    </p>
                </header>

                {error && <div className="auth-error shake">{error}</div>}

                {step === 'verify' ? (
                    <form onSubmit={handleVerifyOtp} className="auth-form glass-form">
                        <div className="form-group">
                            <label htmlFor="otp-input-reg">Codi de 6 dígits</label>
                            <input
                                id="otp-input-reg"
                                name="otp_code"
                                type="text"
                                placeholder="123456"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                autoComplete="one-time-code"
                                inputMode="numeric"
                                maxLength={6}
                                required
                                className="otp-input-field big"
                            />
                        </div>

                        <button type="submit" className="auth-button v2" disabled={loading}>
                            {loading ? <MeshStar size={28} color="#ffffff" /> : 'CONFIRMAR ENTRADA'}
                        </button>

                        <div className="otp-helper">
                            {resendCountdown > 0 ? (
                                <span>Nou codi disponible en <strong style={{ color: 'var(--color-primary)' }}>{resendCountdown}s</strong></span>
                            ) : (
                                <button type="button" className="text-btn accent" onClick={handleRegister}>
                                    No he rebut res. Reenviar SMS 🔁
                                </button>
                            )}
                        </div>

                        <button type="button" className="text-btn back-btn" onClick={() => setStep('identity')}>
                            Tornar a començar
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleRegister} className="auth-form">
                        {/* Step 1: Basic Identity */}
                        <div className="form-group animate-in" style={{ animationDelay: '0.1s' }}>
                            <label htmlFor="reg-fullname">Nom i Cognoms</label>
                            <div className="input-with-icon">
                                <User size={18} className="input-icon" />
                                <input
                                    id="reg-fullname"
                                    name="full_name"
                                    type="text"
                                    placeholder="Javi Llinares"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    autoComplete="name"
                                    required
                                />
                            </div>
                        </div>

                        {authMethod === 'phone' ? (
                            <div className="form-group animate-in" style={{ animationDelay: '0.2s' }}>
                                <label htmlFor="reg-phone">Telèfon Mòbil</label>
                                <div className="phone-input-wrapper-v2">
                                    <span className="prefix-badge">🇪🇸 +34</span>
                                    <input
                                        id="reg-phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="600 000 000"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                                        autoComplete="tel"
                                        required
                                        className="phone-input-prime"
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="form-group animate-in" style={{ animationDelay: '0.2s' }}>
                                    <label htmlFor="reg-email">Correu Electrònic</label>
                                    <div className="input-with-icon">
                                        <Mail size={18} className="input-icon" />
                                        <input
                                            id="reg-email"
                                            name="email"
                                            type="email"
                                            placeholder="correu@poble.cat"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            autoComplete="email"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group animate-in" style={{ animationDelay: '0.3s' }}>
                                    <label htmlFor="reg-password">Contrasenya</label>
                                    <div className="input-with-icon">
                                        <ShieldCheck size={18} className="input-icon" />
                                        <input
                                            id="reg-password"
                                            name="password"
                                            type="password"
                                            placeholder="Mínim 6 caràcters"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            autoComplete="new-password"
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="form-group animate-in" style={{ animationDelay: '0.4s' }}>
                            <label>Poble de Primera Residència</label>
                            <button
                                type="button"
                                className={`town-picker-v2 ${selectedTown ? 'selected' : ''}`}
                                onClick={() => setIsTownModalOpen(true)}
                            >
                                <div className="picker-left">
                                    <MapPin size={20} />
                                    <span>{selectedTown ? selectedTown.name : 'Tria el teu poble...'}</span>
                                </div>
                                <ChevronRight size={18} />
                            </button>
                        </div>

                        <div className="onboarding-iaia-tip animate-in" style={{ animationDelay: '0.5s' }}>
                            <div className="tip-icon">✨</div>
                            <p><strong>IAIA Diu:</strong> "Triar bé el poble és triar la teua família digital. Un cop a dins, ja tindràs el xat de la plaça disponible!"</p>
                        </div>

                        <button type="submit" className="auth-button v2 main-btn" disabled={loading}>
                            {loading ? <MeshStar size={28} color="#00f2ff" /> : (
                                <>
                                    <span>{authMethod === 'phone' ? 'ENVIAR CODI SMS' : 'CREAR COMPTE'}</span>
                                    <Zap size={18} fill="currentColor" />
                                </>
                            )}
                        </button>

                        <div className="auth-method-switcher">
                            <button type="button" className="text-btn" onClick={() => setAuthMethod(authMethod === 'phone' ? 'email' : 'phone')}>
                                {authMethod === 'phone' ? 'Registrar-se amb correu' : 'Registrar-se amb mòbil'}
                            </button>
                        </div>
                    </form>
                )}

                <div className="auth-footer-v2">
                    <p>Ja tens compte? <Link to="/login">Entra ara</Link></p>
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

            <footer className="onboarding-legal">
                <p>En bategar, acceptes que Sóc de Poble és un experiment de sobirania digital. <Link to="/legal">Avisos Legals</Link></p>
            </footer>
        </div>
    );
};

export default Register;
