import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { supabaseService } from '../services/supabaseService';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Phone, Mail, ArrowRight, Loader2, Activity } from 'lucide-react';
import { logger } from '../utils/logger';
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
    const { adoptPersona, isPlayground, logout, forceNukeSimulation, setLanguage, language, user } = useAuth();
    const { t, i18n } = useTranslation();
    const activeLang = language || i18n.language || 'va';
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

    // Auto-redirect if already logged in (Simulation or Real)
    useEffect(() => {
        const checkSession = async () => {
            const params = new URLSearchParams(location.search);
            if (params.get('nuked') === 'true' || params.get('sos') === 'true') {
                logger.log('[Login] Nuclear reset detected, skipping auto-redirect');
                return;
            }

            // Check context user first (fastest for simulation)
            // [DIRECTIVA 1] Only redirect if it's a REAL user (not demo/simulated)
            if (user && !user.isDemo) {
                logger.log('[Login] Real user already authenticated, redirecting to production chats...');
                navigate('/chats', { replace: true });
                return;
            }

            // Fallback: Check Supabase session explicitly (for hard refresh scenarios)
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                logger.log('[Login] Active session found, forcing transition to production.');
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
            setSuccessMessage(t('auth.otp_sent') || 'Codi enviat per SMS');
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
            const result = await supabaseService.verifyOtp(formattedPhone, code);

            // EMERGENCY BYPASS SYNC
            if (result.user.id === '11111111-1111-4111-a111-000000000001' || result.user.email === 'simulator@socdepoble.com') {
                logger.log('[Login] AI Simulation Detected. Adopting IAIA (System Guide)...');
                await adoptPersona({
                    id: '11111111-1a1a-0000-0000-000000000000',
                    full_name: 'IAIA (Guia del Poble)',
                    username: 'iaia_guide',
                    role: 'official',
                    is_admin: true,
                    is_super_admin: false,
                    avatar_url: '/assets/avatars/iaia.png'
                });
            } else {
                // [DIRECTIVA 1] Force production landing for real users
                setIsPlayground(false);
            }

            navigate('/chats');
        } catch (err) {
            setError(err.message || 'Codi invàlid');
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
        <div className="auth-container">
            <button
                className="login-diagnostic-trigger"
                onClick={() => window.dispatchEvent(new CustomEvent('open-diagnostic-hud'))}
                title="Consola Didàctica"
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    background: 'rgba(0, 242, 255, 0.1)',
                    border: '1px solid #00f2ff',
                    borderRadius: '50%',
                    padding: '8px',
                    cursor: 'pointer',
                    zIndex: 1000
                }}
            >
                <Activity size={20} color="#00f2ff" />
            </button>
            <div className="auth-card">
                <img src="/logo.png" alt="Logo" className="auth-logo-elongated" />

                {successMessage && <div className="auth-success-alert">{successMessage}</div>}

                {/* Primary Auth Method Switcher logic can go here or implicit via UI tabs */}

                {authMethod === 'phone' ? (
                    <div className="phone-auth-section">
                        {step === 'input' ? (
                            <form onSubmit={handlePhoneLogin} className="auth-form">
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
                                    <p className="input-hint" style={{ color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>T'enviarem un SMS per verificar.</p>
                                </div>
                                <button type="submit" className="auth-button" disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin" /> : 'Continuar'}
                                    {!loading && <ArrowRight size={18} style={{ marginLeft: '8px' }} />}
                                </button>
                            </form>
                        ) : (
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
                                    <p className="input-hint" style={{ color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>Introdueix el codi de 6 dígits que has rebut.</p>
                                </div>
                                <button type="submit" className="auth-button" disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin" /> : 'Verificar'}
                                </button>
                                <button
                                    type="button"
                                    className="text-btn secondary-action"
                                    onClick={() => setStep('input')}
                                    disabled={loading}
                                >
                                    Canviar número
                                </button>
                            </form>
                        )}

                        <div className="auth-alt-methods">
                            <button className="text-btn small" onClick={() => setAuthMethod('email')}>
                                <Mail size={14} /> Entrar amb Email
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Legacy Email Login */}
                        <form onSubmit={handleLogin} className="auth-form">
                            <div className="form-group">
                                <label htmlFor="login-email">{t('auth.email')}</label>
                                <input
                                    id="login-email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder={t('auth.email_placeholder')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {!isResetMode && (
                                <div className="form-group">
                                    <label htmlFor="login-password">{t('auth.password')}</label>
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
                                            {t('auth.forgot_password') || 'Has oblidat la contrasenya?'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button type="submit" className="auth-button" disabled={loading}>
                                {loading ? t('common.loading') : (isResetMode ? (t('auth.send_reset_link') || 'Enviar enllaç de recuperació') : t('auth.signIn'))}
                            </button>

                            {isResetMode && (
                                <button type="button" className="auth-button secondary" onClick={() => setIsResetMode(false)}>
                                    {t('common.cancel') || 'Cancel·lar'}
                                </button>
                            )}
                        </form>
                        <div className="auth-alt-methods">
                            <button className="text-btn small" onClick={() => setAuthMethod('phone')}>
                                <Phone size={14} /> Entrar amb Mòbil
                            </button>
                        </div>
                    </>
                )}

                <div className="auth-divider">
                    <span>o continuar amb</span>
                </div>

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
                        <img src="/assets/google-logo.svg" onError={(e) => e.target.style.display = 'none'} alt="" />
                        {t('auth.continue_google')}
                    </button>
                </div>

                <div className="demo-login-wrapper compact" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button onClick={handleGuestLogin} className="auth-button demo-secondary">
                        Explorar (Demo)
                    </button>
                    <button
                        onClick={async () => {
                            if (confirm('Això tancarà totes les sessions, esborrarà la cache i expulsarà qualsevol simulació de la IAIA. Estàs segur?')) {
                                logger.warn('SOS ACTIVAT: Neteja nuclear en marxa...');
                                forceNukeSimulation();
                            }
                        }}
                        className="auth-button"
                        style={{ backgroundColor: 'transparent', border: '1px solid #ff0055', color: '#ff0055', fontSize: '0.8rem' }}
                    >
                        🆘 SOS: RESET TOTAL (EXPULSAR IAIA I NETEJAR)
                    </button>
                </div>

                <div className="auth-footer">
                    {t('auth.noAccount')} <Link to="/register">{t('auth.signUp')}</Link>
                </div>

                <div className="padrinos-blessing" style={{ marginTop: '20px', textAlign: 'center', opacity: 0.6, fontSize: '0.7rem' }}>
                    <p>Protegit pels Padrinos de Sóc de Poble 🛡️</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '5px' }}>
                        <span>El Rentonar</span> • <span>Claude & GPT Padrinos</span> • <span>Antigravity Core</span>
                    </div>
                </div>

                <div className="auth-didactic-help" style={{ marginTop: '12px' }}>
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent('open-diagnostic-hud'))}
                        className="text-btn small opacity-70 hover-opacity-100"
                        style={{ fontSize: '0.75rem', textDecoration: 'underline' }}
                    >
                        Vols ajuda per entrar? (Guia Didàctica)
                    </button>
                </div>

                <div className="language-selector-auth compact">
                    {[
                        { code: 'va', label: 'VA' },
                        { code: 'es', label: 'ES' },
                        { code: 'en', label: 'EN' },
                        { code: 'fr', label: 'FR' },
                        { code: 'de', label: 'DE' },
                        { code: 'it', label: 'IT' }
                    ].map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => setLanguage(lang.code)}
                            className={`lang-btn ${activeLang.startsWith(lang.code) ? 'active' : ''}`}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Login;
