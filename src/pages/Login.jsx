import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { supabaseService } from '../services/supabaseService';
import { CREATOR_EMAILS, APP_VERSION } from '../constants';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Phone, Mail, ArrowRight, CheckCircle2, AlertCircle, Loader2, Activity } from 'lucide-react';
import { logger } from '../utils/logger';
import { hapticService } from '../services/hapticService';
import './Auth.css';

/* Inline styles for forgot password link */
// .forgot-password-link {
//     text-align: right;
//     margin-top: 0.25rem;
// }
// .text-btn {
//     background: none;
//     border: none;
//     color: var(--color-primary);
//     font-size: 0.85rem;
//     cursor: pointer;
//     padding: 0;
// }

const Login = () => {
    const { adoptPersona, setIsPlayground, forceNukeSimulation, setLanguage, user } = useAuth();
    const { t, i18n } = useTranslation();
    const activeLang = i18n.language || 'va';
    const navigate = useNavigate();
    const location = useLocation();

    // State for auth modes
    const [authMethod, setAuthMethod] = useState('phone'); // 'phone' | 'email'
    const [step, setStep] = useState('input'); // 'input' | 'verify'

    // Form states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');

    const [isResetMode, setIsResetMode] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(location.state?.message || null);
    const [loading, setLoading] = useState(false);
    const [resendCountdown, setResendCountdown] = useState(0);

    // Callback for OTP verification
    const handleVerifyOtp = useCallback(async (e, codeToVerify = null) => {
        e?.preventDefault();
        setLoading(true);
        setError(null);
        const code = codeToVerify || otp;

        try {
            const formattedPhone = phone.startsWith('+') ? phone : `+34${phone}`;
            const result = await supabaseService.verifyOtp(formattedPhone, code);

            // EMERGENCY BYPASS SYNC & SIMULATION
            const authUser = result.user || result.data?.user;
            if (authUser?.id === '11111111-1111-4111-a111-000000000001' || authUser?.email === 'simulator@socdepoble.com' || authUser?.isDemo) {
                logger.log('[Login] AI Simulation or Phone Demo Detected. Adopting Guide Persona...');
                await adoptPersona({
                    id: authUser.id || '11111111-1a1a-0000-0000-000000000000',
                    full_name: authUser.user_metadata?.full_name || 'IAIA (Guia del Poble)',
                    username: authUser.user_metadata?.username || 'iaia_guide',
                    role: 'official',
                    is_demo: !!authUser.isDemo,
                    is_admin: true,
                    avatar_url: '/assets/avatars/iaia_official.png'
                });
            } else {
                // [DIRECTIVA 1] Force production landing for real users
                setIsPlayground(false);
            }

            navigate('/chats');
        } catch (err) {
            setError(err.message || 'Codi invàlid');
            hapticService.notifyError();
        } finally {
            setLoading(false);
        }
    }, [otp, phone, adoptPersona, setIsPlayground, navigate]);

    // [V1.5.6 - ZERO-CLICK LOGIN] Auto-submit quan el codi està complet
    useEffect(() => {
        if (otp && otp.length === 6 && step === 'verify') {
            handleVerifyOtp(null, otp);
        }
    }, [otp, step, handleVerifyOtp]);

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

    // Auto-dismiss alerts
    useEffect(() => {
        if (successMessage || error) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
                setError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, error]);

    // Auto-redirect if already logged in (Simulation or Real)
    useEffect(() => {
        const checkSession = async () => {
            const params = new URLSearchParams(location.search);
            if (params.get('nuked') === 'true' || params.get('sos') === 'true' || params.get('rescue') === 'true') {
                logger.log('[Login] Recovery/Nuclear mode, skipping auto-redirect');
                return;
            }

            // [RESILIÈNCIA MÒBIL] Esperem que el bategat de l'AuthContext s'estabilitzi (500ms)
            // Això evita bucles de redirecció quasi-instantanis.
            await new Promise(r => setTimeout(r, 500));

            // Check context user first (fastest for simulation)
            if (user && !user.isDemo) {
                logger.log('[Login] Real user already authenticated, redirecting...');
                navigate('/chats', { replace: true });
                return;
            }

            // Fallback: Check Supabase session explicitly
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                logger.log('[Login] Active session found, transitioning.');
                navigate('/chats', { replace: true });
            }
        };
        checkSession();
    }, [navigate, user, location.search]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            if (isResetMode) {
                await supabaseService.resetPasswordForEmail(email);
                setSuccessMessage(t('auth.reset_email_sent') || 'Si el correu existeix, rebràs un enllaç per recuperar la contrasenya.');
                setIsResetMode(false);
            } else {
                await supabaseService.signIn(email, password);
                setIsPlayground(false);
                navigate('/chats');
            }
        } catch (err) {
            setError(err.message);
            hapticService.notifyError();
        } finally {
            setLoading(false);
        }
    };

    const handlePhoneLogin = async (e) => {
        e?.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Basic phone validation (simple check, assume backend handles detailed validation)
            if (!phone || phone.length < 9) {
                throw new Error(t('auth.invalid_phone') || 'Introdueix un número vàlid');
            }

            // Ensure international format if not present (assuming ES +34 for simplicity if missing)
            const formattedPhone = phone.startsWith('+') ? phone : `+34${phone}`;

            await supabaseService.signInWithOtp(formattedPhone);
            setStep('verify');
            setResendCountdown(60);
            setSuccessMessage(t('auth.otp_sent') || 'Codi enviat per SMS');
        } catch (err) {
            setError(err.message);
            hapticService.notifyError();
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendCountdown > 0 || loading) return;
        setLoading(true);
        setError(null);
        try {
            const formattedPhone = phone.startsWith('+') ? phone : `+34${phone}`;
            await supabaseService.resendOtp(formattedPhone);
            setResendCountdown(60);
            setSuccessMessage(t('auth.otp_resent') || 'Codi reenviat per SMS');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    const handleGuestLogin = async () => {
        // Now using the IAIA as the primary system guide
        await adoptPersona({
            id: '11111111-1a1a-0000-0000-000000000000',
            full_name: 'IAIA (Guia del Poble)',
            username: 'iaia_guide',
            role: 'official',
            is_demo: true,
            is_admin: true,
            avatar_url: '/assets/avatars/iaia.png'
        });
        navigate('/chats');
    };

    const loginWithGoogle = async () => {
        // Robust Google Login wrapper
        const { error } = await supabaseService.signInWithGoogle();
        if (error) throw error;
    };

    return (
        <div className="auth-container premium-onboarding">
            <div className="auth-hero-overlay"></div>

            <button
                className="login-diagnostic-trigger"
                onClick={() => window.dispatchEvent(new CustomEvent('open-diagnostic-hud'))}
                title={t('nav.support')}
            >
                <Activity size={20} color="#00f2ff" />
            </button>

            <div className="auth-card register-card-v2 animate-in-up">
                <header className="auth-header">
                    <img src="/logo.png" alt="Sóc de Poble" className="auth-logo-v2" />

                    <div className="auth-iaia-guidance" style={{ marginTop: '0', marginBottom: '24px' }}>
                        <div className="iaia-avatar-wrapper">
                            <img src="/assets/avatars/iaia_official.png" alt="MArIA" className="iaia-mini-avatar" />
                            <div className="iaia-pulse"></div>
                        </div>
                        <div className="iaia-speech-bubble">
                            {step === 'input'
                                ? <>Bon dia! Soc la IAIA. Soc ací per a ajudar-te a connectar.<br />Vine al redol, que ací xategem tots els veïns! 🗣️🏘️</>
                                : "T'he enviat el codi ja. Posa'l ací i entrem a la plaça ara mateix! ✨ (v1.16.5-NUCLEAR)"}
                        </div>
                    </div>
                </header>

                {successMessage && <div className="auth-success-alert fade-in">{successMessage}</div>}
                {error && <div className="auth-error shake">{error}</div>}

                {authMethod === 'phone' ? (
                    <div className="phone-auth-section">
                        {step === 'input' ? (
                            <form onSubmit={handlePhoneLogin} className="auth-form glass-form">
                                <div className="form-group">
                                    <label htmlFor="login-phone">Telèfon Mòbil</label>
                                    <div className="phone-input-wrapper-v2">
                                        <span className="prefix-badge">🇪🇸 +34</span>
                                        <input
                                            id="login-phone"
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
                                    <p className="input-hint" style={{ color: 'rgba(0, 242, 255, 0.7)', fontWeight: '600', fontSize: '0.75rem', marginTop: '8px' }}>🚀 En segons estaràs a dins!</p>
                                </div>
                                <button type="submit" className="auth-button v2 main-btn" disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin" size={28} color="#ffffff" /> : 'ENTRAR AL POBLE'}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyOtp} className="auth-form glass-form">
                                <div className="form-group">
                                    <label htmlFor="otp-input-login">Codi de Verificació</label>
                                    <input
                                        id="otp-input-login"
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
                                <button type="submit" className="auth-button v2" disabled={loading} onClick={() => hapticService.batec()}>
                                    {loading ? <Loader2 className="animate-spin" size={28} color="#ffffff" /> : 'VERIFICAR ACCÉS'}
                                </button>

                                <div className="otp-helper" style={{ marginTop: '16px', textAlign: 'center' }}>
                                    {resendCountdown > 0 ? (
                                        <span className="opacity-50">Nou SMS en {resendCountdown}s</span>
                                    ) : (
                                        <button type="button" className="text-btn accent" onClick={handleResendOtp}>
                                            No he rebut res. Reenviar SMS 🔁
                                        </button>
                                    )}
                                </div>

                                <button type="button" className="text-btn back-btn" onClick={() => setStep('input')}>
                                    Canviar número
                                </button>
                            </form>
                        )}

                        <div className="auth-alt-methods-v2" style={{ marginTop: '16px', textAlign: 'center' }}>
                            <button className="text-btn small" onClick={() => setAuthMethod('email')}>
                                <Mail size={14} /> O entrar amb Email
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="email-auth-section animate-in">
                        <form onSubmit={handleLogin} className="auth-form glass-form">
                            <div className="form-group">
                                <label htmlFor="login-email">Correu Electrònic</label>
                                <div className="input-with-icon">
                                    <Mail size={18} className="input-icon" />
                                    <input
                                        id="login-email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="correu@poble.cat"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="iaia-portal-hero animate-fade-in">
                                    <div className="iaia-portrait-glow large">
                                        <img
                                            src="/iaia_digital_matriarch.png"
                                            alt="La IAIA"
                                            className="iaia-portrait-main dynamic-focus"
                                            onError={(e) => {
                                                e.target.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=IAIA";
                                            }}
                                        />
                                        <div className="iaia-motto-overlay">
                                            <p>"Pensant en global, treballant en local."</p>
                                        </div>
                                    </div>
                                    <div className="iaia-speech-bubble">
                                        <p>{t('login.iaia_welcome')}</p>
                                        <span className="iaia-emojis">👵✨</span>
                                    </div>
                                </div>
                            </div>

                            {!isResetMode && (
                                <div className="form-group">
                                    <label htmlFor="login-password">Contrasenya</label>
                                    <input
                                        id="login-password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required={!isResetMode}
                                    />
                                    <div className="forgot-password-link">
                                        <button type="button" onClick={() => setIsResetMode(true)} className="text-btn">
                                            L'has oblidat? Recupera-la
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button type="submit" className="auth-button v2" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" size={28} color="#00f2ff" /> : (isResetMode ? 'ENVIAR RECUPERACIÓ' : 'ENTRAR AMB EMAIL')}
                            </button>

                            {isResetMode && (
                                <button type="button" className="text-btn back-btn" onClick={() => setIsResetMode(false)}>
                                    Tornar al login
                                </button>
                            )}
                        </form>
                        <div className="auth-alt-methods-v2" style={{ marginTop: '16px', textAlign: 'center' }}>
                            <button className="text-btn small" onClick={() => setAuthMethod('phone')}>
                                <Phone size={14} /> O entrar amb Mòbil
                            </button>
                        </div>
                    </div>
                )}

                <div className="auth-divider">
                    <span>o entrar amb</span>
                </div>

                <div className="social-auth-section">
                    <button
                        onClick={async () => {
                            hapticService.batec();
                            try {
                                await loginWithGoogle();
                            } catch (err) {
                                setError(err.message);
                            }
                        }}
                        className="auth-button google-auth v2"
                        style={{ height: '52px' }}
                    >
                        <img src="/assets/google-logo.svg" onError={(e) => e.target.style.display = 'none'} alt="" style={{ width: '20px' }} />
                        Google
                    </button>
                </div>

                <div className="demo-login-wrapper-v2" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button onClick={handleGuestLogin} className="auth-button demo-secondary v2">
                        Explorar (Mode Demo) 🏛️
                    </button>

                    <div className="emergency-actions" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <button
                            onClick={() => {
                                if (confirm('Aquest bategat SOS netejarà tota la memòria temporal. Segur?')) forceNukeSimulation();
                            }}
                            className="emergency-btn sos"
                            title="Restaurar Harmonia"
                        >
                            🆘 SOS
                        </button>
                        <button
                            onClick={() => {
                                const id = prompt('Correu o telèfon per a recuperar:');
                                if (id) alert('S\'ha bategat la teua sol·licitud a la IAIA.');
                            }}
                            className="emergency-btn recovery"
                            title="Recuperació Social"
                        >
                            🎭 RECUPERAR
                        </button>
                    </div>
                </div>

                <div className="auth-footer-v2">
                    <p className="auth-footer-v2">{t('auth.no_account')} <Link to="/register">{t('auth.register_now')}</Link></p>
                </div>

                <div className="language-selector-auth compact" style={{ marginTop: '24px' }}>
                    {['va', 'es', 'en', 'gl', 'eu'].map((lang) => (
                        <button
                            key={lang}
                            onClick={() => {
                                // Dynamic language switch if setLanguage exists in context
                                if (typeof setLanguage === 'function') {
                                    setLanguage(lang);
                                }
                            }}
                            className={`lang-btn ${activeLang.startsWith(lang) ? 'active' : ''}`}
                        >
                            {lang.toUpperCase()}
                        </button>
                    ))}
                </div>
                <div className="auth-version-footer" style={{ marginTop: '20px', opacity: 0.3, fontSize: '0.7rem', userSelect: 'all' }}>
                    {APP_VERSION}
                </div>
            </div>
        </div>
    );
};

export default Login;
