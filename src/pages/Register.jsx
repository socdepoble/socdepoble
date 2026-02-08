import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, ArrowRight, Loader2, User, ShieldCheck, CheckCircle2, ChevronRight, Globe, Zap } from 'lucide-react';
import TownSelectorModal from '../components/TownSelectorModal';
import { useAuth } from '../context/AuthContext';
import { logger } from '../utils/logger';
import { hapticService } from '../services/hapticService';
import { APP_VERSION } from '../constants';
import './Auth.css';

/**
 * [FLASH MASTERPIECE] Register.jsx v2.0
 * La millor pàgina de registre del món: ràpida, premium i sobirana.
 */
const Register = () => {
    logger.log('[Register] Inicialitzant component...');
    const auth = useAuth();
    logger.log('[Register] Context d\'autenticació obtingut:', !!auth);
    const { setIsPlayground, user } = auth;
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
    const [focusedField, setFocusedField] = useState(null); // 'name' | 'phone' | 'email' | 'town' | 'otp'
    const [isCelebrating, setIsCelebrating] = useState(false);

    // Real-time validation visual cues
    const isPhoneValid = phone.length >= 9;
    const isNameValid = fullName.trim().length >= 3;
    const isFormPreValid = authMethod === 'phone' ? (isPhoneValid && isNameValid && selectedTown) : (email.includes('@') && isNameValid && selectedTown);

    const handleVerifyOtp = useCallback(async (e, codeToVerify = null) => {
        e?.preventDefault();
        setLoading(true);
        setError(null);
        const code = codeToVerify || otp;

        try {
            const formattedPhone = phone.startsWith('+') ? phone : `+ 34${phone} `;
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
                hapticService.notifySuccess();

                // [VICTORY SEQUENCE]
                setIsCelebrating(true);
                setStep('welcome');
                setTimeout(() => {
                    setIsPlayground(false);
                    navigate('/chats');
                }, 3000);
            }
        } catch (err) {
            setError(err.message || 'Codi de seguretat invàlid.');
            hapticService.notifyError();
        } finally {
            setLoading(false);
        }
    }, [otp, phone, fullName, selectedTown, setIsPlayground, navigate]);

    useEffect(() => {
        if (otp && otp.length === 6 && step === 'verify') {
            handleVerifyOtp(null, otp);
        }
    }, [step, handleVerifyOtp, otp]);

    // [V1.5.6 - ZERO-CLICK LOGIN] WebOTP API per a lectura automàtica d'SMS
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
                const formattedPhone = phone.startsWith('+') ? phone : `+ 34${phone} `;
                await supabaseService.signInWithOtp(formattedPhone);
                setStep('verify');
                setResendCountdown(60);
                hapticService.notifyThinking();
            } catch (err) {
                setError(err.message);
                hapticService.notifyError();
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
                    <div className={`progress - segment ${step === 'identity' ? 'active' : 'completed'} `}></div>
                    <div className={`progress - segment ${step === 'verify' ? 'active' : ''} `}></div>
                </div>

                <header className="auth-header glass-header">
                    <img src="/logo.png" alt="Sóc de Poble" className="auth-logo-v2" />

                    {/* [MASTER GUIDANCE] La IAIA sempre guia el bategat */}
                    <div className="auth-iaia-guidance interstellar-iaia" style={{ marginTop: '0', marginBottom: '32px' }}>
                        <div className="iaia-avatar-wrapper" onClick={() => hapticService.batec()}>
                            <img src="/assets/avatars/iaia_official.png" alt="MArIA" className="iaia-mini-avatar" />
                            <div className="iaia-pulse-outer"></div>
                            <div className="iaia-pulse"></div>
                        </div>
                        <div className="iaia-speech-bubble-interstellar">
                            {step === 'identity' ? (
                                focusedField === 'name' ? "Posa el teu nom tal com vols que et coneguen al poble, bonico! ✨" :
                                    "Hola, bonica! Soc la IAIA. Com t'hem de dir per ací?"
                            ) : step === 'town' ? (
                                "Dime on vius, que t'he de posar al cor del territori! 📍"
                            ) : step === 'connection' ? (
                                "El número de mòbil és la teua clau de la plaça. Posa'l amb trellat! 📱"
                            ) : step === 'verify' ? (
                                "T'he enviat el bategat de seguretat al mòbil. Posa'l ací i entrarem a la plaça! 📱🏛️"
                            ) : "Benvingut a la plaça, veí! Ja som un més a la comunitat! 🎊"}
                        </div>
                    </div>

                    <h1 className="interstellar-h1">
                        {step === 'identity' ? 'Qui eres?' :
                            step === 'town' ? 'D\'on eres?' :
                                step === 'connection' ? 'Connexió' :
                                    step === 'verify' ? 'Seguretat' : 'Benvinguda'}
                    </h1>
                </header>

                {error && <div className="auth-error shake">{error}</div>}

                {/* STEP 1: IDENTITY */}
                {step === 'identity' && (
                    <div className="auth-step-container animate-fade-in-right">
                        <div className="form-group">
                            <label htmlFor="reg-fullname">Nom i Cognoms</label>
                            <div className="input-with-icon">
                                <User size={18} className="input-icon" />
                                <input
                                    id="reg-fullname"
                                    name="full_name"
                                    type="text"
                                    placeholder="Javi Llinares"
                                    value={fullName}
                                    onChange={(e) => {
                                        setFullName(e.target.value);
                                        if (e.target.value.length === 3) hapticService.batec();
                                    }}
                                    onFocus={() => setFocusedField('name')}
                                    onBlur={() => setFocusedField(null)}
                                    autoComplete="name"
                                    required
                                    className={fullName && !isNameValid ? 'input-error' : (isNameValid ? 'input-success' : '')}
                                />
                            </div>
                        </div>
                        <button
                            className={`auth - button v2 main - btn ${!isNameValid ? 'btn-dimmed' : ''} `}
                            disabled={!isNameValid}
                            onClick={() => { hapticService.batec(); setStep('town'); }}
                        >
                            <span>CONTINUAR CAP AL POBLE</span>
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}

                {/* STEP 2: TOWN */}
                {step === 'town' && (
                    <div className="auth-step-container animate-fade-in-right">
                        <div className="form-group">
                            <label htmlFor="town-picker-reg">Poble de Primera Residència</label>
                            <button
                                id="town-picker-reg"
                                name="town_picker"
                                type="button"
                                className={`town - picker - v2 ${selectedTown ? 'selected' : ''} `}
                                onClick={() => setIsTownModalOpen(true)}
                            >
                                <div className="picker-left">
                                    <MapPin size={20} />
                                    <span>{selectedTown ? selectedTown.name : 'Tria el teu poble...'}</span>
                                </div>
                                <ChevronRight size={18} />
                            </button>
                        </div>
                        <div className="flex gap-4">
                            <button className="text-btn back-btn-step" onClick={() => setStep('identity')}>Enrere</button>
                            <button
                                className={`auth - button v2 main - btn ${!selectedTown ? 'btn-dimmed' : ''} `}
                                disabled={!selectedTown}
                                onClick={() => { hapticService.batec(); setStep('connection'); }}
                            >
                                <span>TRIAR AQUEST POBLE</span>
                                <CheckCircle2 size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: CONNECTION */}
                {step === 'connection' && (
                    <div className="auth-step-container animate-fade-in-right">
                        <div className="form-group">
                            <label htmlFor="reg-phone">Telèfon Mòbil</label>
                            <div className="phone-input-wrapper-v2">
                                <span className="prefix-badge">🇪🇸 +34</span>
                                <input
                                    id="reg-phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="600 000 000"
                                    value={phone}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^0-9]/g, '');
                                        setPhone(val);
                                        if (val.length === 9) hapticService.batec();
                                    }}
                                    onFocus={() => setFocusedField('phone')}
                                    onBlur={() => setFocusedField(null)}
                                    autoComplete="tel"
                                    inputMode="numeric"
                                    required
                                    className={`phone - input - prime ${phone && !isPhoneValid ? 'input-error' : (isPhoneValid ? 'input-success' : '')} `}
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button className="text-btn back-btn-step" onClick={() => setStep('town')}>Enrere</button>
                            <button
                                className={`auth - button v2 main - btn ${!isPhoneValid ? 'btn-dimmed' : ''} `}
                                disabled={loading || !isPhoneValid}
                                onClick={handleRegister}
                            >
                                {loading ? <MeshStar size={28} color="#00f2ff" /> : (
                                    <>
                                        <span>ENVIAR CODI SMS</span>
                                        <Zap size={18} fill="currentColor" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 4: VERIFY */}
                {step === 'verify' && (
                    <form onSubmit={handleVerifyOtp} className="auth-form glass-form animate-fade-in-right">
                        <div className="form-group">
                            <label htmlFor="otp-input-reg">Codi de 6 dígits</label>
                            <input
                                id="otp-input-reg"
                                name="otp_code"
                                type="text"
                                placeholder="123456"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                onFocus={() => setFocusedField('otp')}
                                onBlur={() => setFocusedField(null)}
                                autoComplete="one-time-code"
                                inputMode="numeric"
                                maxLength={6}
                                required
                                className="otp-input-field big"
                            />
                        </div>

                        <button type="submit" className="auth-button v2" disabled={loading || otp.length < 6} onClick={() => hapticService.batec()}>
                            {loading ? <Loader2 className="animate-spin" size={28} /> : 'CONFIRMAR ENTRADA'}
                        </button>

                        <div className="otp-helper" style={{ marginTop: '16px' }}>
                            {resendCountdown > 0 ? (
                                <span>Nou codi disponible en <strong style={{ color: 'var(--color-primary)' }}>{resendCountdown}s</strong></span>
                            ) : (
                                <button type="button" className="text-btn accent" onClick={handleRegister}>
                                    No he rebut res. Reenviar SMS 🔁
                                </button>
                            )}
                        </div>

                        <button type="button" className="text-btn back-btn" onClick={() => setStep('connection')}>
                            Canviar número
                        </button>
                    </form>
                )}

                {/* STEP 5: WELCOME CELEBRATION */}
                {step === 'welcome' && (
                    <div className="auth-step-container celebration-step animate-zoom-in">
                        <div className="celebration-icon">🎊</div>
                        <h2 className="victory-text">Benvingut a casa, {fullName.split(' ')[0]}!</h2>
                        <div className="iaia-final-blessing">
                            <p>"Ja eres un dels nostres. Cor de poble, bategat digital. Ens veiem a la plaça!"</p>
                            <span className="iaia-signature">- L'IAIA 👵✨</span>
                        </div>
                        <div className="loading-dots-premium">
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                )}

                <div className="auth-footer-v2">
                    {step !== 'welcome' && <p>Ja tens compte? <Link to="/login">Entra ara</Link></p>}
                </div>
            </div>

            <TownSelectorModal
                isOpen={isTownModalOpen}
                onClose={() => setIsTownModalOpen(false)}
                onSelect={(town) => {
                    setSelectedTown(town);
                    setIsTownModalOpen(false);
                    setError(null);
                    hapticService.batec();
                }}
            />

            <footer className="onboarding-legal">
                <p>En bategar, acceptes que Sóc de Poble és un experiment de sobirania digital. <Link to="/legal">Avisos Legals</Link></p>
                <div className="auth-version-footer" style={{ marginTop: '10px', opacity: 0.3, fontSize: '0.7rem', userSelect: 'all' }}>
                    {APP_VERSION}
                </div>
            </footer>
        </div>
    );
};

export default Register;
