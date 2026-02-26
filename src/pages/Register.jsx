import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams, Link, useLocation } from "react-router-dom";
import { supabaseService } from "../services/supabaseService";
import {
  MapPin, Phone, Mail, ArrowRight, Loader2, User, ShieldCheck, CheckCircle2, ChevronRight, Globe, Zap,
} from "lucide-react";
import TownSelectorModal from "../components/TownSelectorModal";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/I18nContext";
import { hapticService } from "../services/hapticService";
import { APP_VERSION } from "../constants";
import "./Auth.css";
import { useTranslation } from "react-i18next";

/**
 * [FLASH MASTERPIECE] Register.jsx v2.0 - Clean Sovereign Edition
 */
const Register = () => {
  const auth = useAuth();
  const { setIsPlayground, user } = auth;
  const { language, setLanguage } = useI18n();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/chats';

  useEffect(() => {
    if (user && !user.isDemo && !user.is_sovereign) {
      navigate(returnTo, { replace: true });
    }
  }, [user, navigate, returnTo]);

  const isInitialLogin = location.pathname === '/login' || location.pathname === '/';
  const [authMode, setAuthMode] = useState(isInitialLogin ? 'login' : 'register');
  const [step, setStep] = useState(isInitialLogin ? 'connection' : 'identity');

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [selectedTown, setSelectedTown] = useState(null);

  const [isTownModalOpen, setIsTownModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [loading, setLoading] = useState(false);

  const isPhoneValid = phone.length >= 9;
  const isNameValid = fullName.trim().length >= 3;

  const handleVerifyOtp = useCallback(
    async (e, codeToVerify = null) => {
      e?.preventDefault();
      setLoading(true);
      setError(null);
      const code = codeToVerify || otp;

      try {
        const formattedPhone = phone.startsWith("+") ? phone : `+34${phone}`;
        const { user: verifiedUser } = await supabaseService.verifyOtp(
          formattedPhone,
          code,
        );

        if (verifiedUser) {
          if (authMode === 'register') {
            await supabaseService.updateProfile(verifiedUser.id, {
              full_name: fullName,
              town_id: selectedTown?.id,
              town_uuid: selectedTown?.uuid,
              primary_town: selectedTown?.name,
            });
          }

          hapticService.notifySuccess();

          setStep("welcome");
          setTimeout(() => {
            if (setIsPlayground) setIsPlayground(false);
            navigate(returnTo);
          }, 3000);
        }
      } catch (err) {
        setError(err.message || "Codi de seguretat invàlid.");
        hapticService.notifyError();
      } finally {
        setLoading(false);
      }
    },
    [phone, fullName, selectedTown, otp, navigate, setIsPlayground, returnTo, authMode],
  );

  useEffect(() => {
    if (otp && otp.length === 6 && step === "verify") {
      handleVerifyOtp(null, otp);
    }
  }, [step, handleVerifyOtp, otp]);

  useEffect(() => {
    if ("OTPCredential" in window && step === "verify") {
      const ac = new AbortController();
      navigator.credentials
        .get({ otp: { transport: ["sms"] }, signal: ac.signal })
        .then((otpData) => {
          if (otpData && otpData.code) {
            setOtp(otpData.code);
          }
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            // Ignorat
          }
        });
      return () => ac.abort();
    }
  }, [otp, handleVerifyOtp, step]);

  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (authMode === 'register' && !selectedTown) {
      setError("Selecciona el teu poble per a continuar el procés.");
      setLoading(false);
      return;
    }

    try {
      if (!phone || phone.length < 9) {
        throw new Error("Introdueix un número de mòbil vàlid.");
      }
      const formattedPhone = phone.startsWith("+") ? phone : `+34${phone}`;
      await supabaseService.signInWithOtp(formattedPhone);
      setStep("verify");
      setResendCountdown(60);
      hapticService.notifyThinking();
    } catch (err) {
      setError(err.message);
      hapticService.notifyError();
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await supabaseService.signInWithGoogle();
      hapticService.batec();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const languages = [
    { code: "va", label: "VAL", flag: "🥘" },
    { code: "es", label: "CAS", flag: "🥘" },
    { code: "en", label: "ENG", flag: "🇬🇧" },
    { code: "eu", label: "EUS", flag: "🏺" },
    { code: "gl", label: "GAL", flag: "🐙" },
  ];

  return (
    <div className="auth-container integrated-frame px-4 sm:px-0 py-8 overflow-y-auto min-h-screen">
      <div className="animate-in-up w-[92%] sm:w-full max-w-[500px] flex flex-col relative z-10 mx-auto mt-4 pb-[100px] md:pb-8">
        <header className="flex flex-col items-center mb-6 relative w-full">
          <img src="/assets/master/logo_socdepoble_white_full.png" alt="Sóc de Poble" className="w-[380px] sm:w-[420px] max-w-full h-auto object-contain drop-shadow-lg mb-4 hover:scale-105 transition-transform duration-500 will-change-transform" />

        {/* Selector d'idioma Tàctil i Gegant */}
        <div className="personal-identity-tip animate-fade-in p-3 sm:p-4 bg-[#151515] border border-orange-500/10 rounded-[28px] mb-8 mt-2 w-full max-w-[500px] mx-auto">
          <div className="flex gap-3 items-start">
            <div className="shrink-0 mt-[2px]">
              <span className="text-xl">🌍</span>
            </div>
            <div className="text-left w-full pl-1">
              <h4 className="tip-title text-[11px] text-orange-400 font-bold tracking-[1.5px] uppercase mb-1">{t("auth.language_select_title", "Com vols que parlem?")}</h4>
              <p className="tip-description text-[13px] text-white/50 leading-snug font-light pr-2">
                {t("auth.language_select_desc", "Tria la llengua del poble. Pots demanar a la IAIA que et parle en la teua variant després.")}
              </p>
            </div>
          </div>
          
          <div className="language-selector-auth flex justify-between gap-1 sm:gap-2 w-full mt-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={`flex-1 items-center justify-center flex font-bold h-12 rounded-[16px] transition-all border border-transparent shadow-sm ${language === lang.code ? "bg-[#4F46E5] text-white shadow-[#4F46E5]/30 shadow-lg scale-105" : "bg-transparent text-white/50 hover:bg-white/5"}`}
                onClick={() => {
                  setLanguage(lang.code);
                  i18n.changeLanguage(lang.code);
                  hapticService.batec();
                }}
              >
                <span className="uppercase tracking-wider text-[11px]">{lang.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

        {error && <div className="auth-error shake bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-6 text-sm flex items-center gap-3"><ShieldCheck size={20} />{error}</div>}

        {/* STEP 1: IDENTITY */}
        {step === "identity" && (
          <div className="auth-step-container animate-fade-in-right">
            <div className="personal-identity-tip animate-fade-in p-3 sm:p-4 bg-[#151515] border border-orange-500/10 rounded-[28px] mb-6 mt-2 w-full max-w-[500px] mx-auto">
              <div className="flex gap-3 items-start">
                <div className="shrink-0 mt-[2px]">
                  <ShieldCheck size={18} className="text-orange-400" />
                </div>
                <div className="text-left w-full pl-1">
                  <h4 className="tip-title text-[11px] text-orange-400 font-bold tracking-[1.5px] uppercase mb-1">{t("auth.personal_register_title", "El Teu Nom de Veí")}</h4>
                  <p className="tip-description text-[13px] text-white/50 leading-snug font-light pr-2" dangerouslySetInnerHTML={{ __html: t("auth.personal_register_desc", "Entra primer com a persona, com s'ha fet tota la vida. Més avant ja crearem la teua <span class=\"text-white font-medium\">tenda o grup de festes</span>.") }} />
                </div>
              </div>
            </div>

            <div className="form-group mb-6 w-full max-w-[500px] mx-auto">
              <label htmlFor="reg-fullname" className="text-[10px] font-black tracking-[2px] text-white/40 uppercase mb-2 ml-4 block">{t("auth.name_label", "Nom i Cognoms")}</label>
              <div className="relative flex items-center">
                <input
                  id="reg-fullname"
                  name="full_name"
                  type="text"
                  placeholder={t("auth.name_placeholder", "Introdueix el teu Nom i Cognoms")}
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (e.target.value.length === 3) hapticService.batec();
                  }}
                  autoComplete="name"
                  required
                  className={`w-full text-[19px] py-[22px] px-6 font-bold tracking-wide rounded-[24px] focus:outline-none transition-all outline-none border-none placeholder:font-normal placeholder:tracking-normal ${
                    fullName && !isNameValid ? "bg-[#ffe4e4] text-red-600 focus:ring-4 focus:ring-red-500 placeholder:text-red-400" : isNameValid ? "bg-white text-black focus:ring-4 focus:ring-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.2)]" : "bg-white text-black focus:ring-4 focus:ring-[#0984E3]/50 placeholder:text-black/40 shadow-lg"
                  }`}
                />
              </div>
            </div>

            <button
              className={`w-full max-w-[500px] mx-auto h-16 rounded-[20px] text-[15px] font-bold uppercase tracking-[2px] transition-all flex items-center justify-center gap-3 ${
                !isNameValid ? "bg-white/5 text-white/30 border border-white/10 opacity-50 pointer-events-none" : "bg-[#f97316] text-white hover:bg-orange-500 hover:scale-[1.02] active:scale-[0.98] shadow-[0_8px_30px_-10px_rgba(249,115,22,0.4)]"
              }`}
              disabled={!isNameValid}
              onClick={() => {
                hapticService.batec();
                setStep("town");
              }}
            >
              <span>{t("auth.continue_to_town", "Continuar cap al Poble")}</span>
            </button>
          </div>
        )}

        {/* STEP 2: TOWN */}
        {step === "town" && (
          <div className="auth-step-container animate-fade-in-right">
            <div className="form-group mb-8">
              <label htmlFor="town-picker-reg" className="text-[10px] font-black tracking-[2px] text-white/40 uppercase mb-2 block">
                {t("auth.town_picker_label", "D'on Eres?")}
              </label>
              <button
                id="town-picker-reg"
                name="town_picker"
                type="button"
                className={`w-full flex items-center justify-between p-4 bg-[#111] border rounded-[20px] transition-all text-left ${
                  selectedTown ? "bg-orange-500/5 border-orange-500/50" : "border-white/5 hover:border-white/20"
                }`}
                onClick={() => {
                  hapticService.batec();
                  setIsTownModalOpen(true);
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="icon-badge bg-[#151515] p-3 rounded-xl border border-white/5 shrink-0">
                    <MapPin size={24} className="text-orange-500" />
                  </div>
                  <div className="text-left flex flex-col justify-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">{t("auth.town_picker_localitat", "Localitat")}</span>
                    <span className="text-[1.1rem] font-medium text-white leading-tight">
                      {selectedTown ? selectedTown.name : t("auth.town_picker_placeholder", "Tria el teu poble...")}
                    </span>
                  </div>
                </div>
                <div className="bg-transparent p-2 rounded-xl shrink-0 opacity-50">
                  <ChevronRight size={20} />
                </div>
              </button>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                className="w-16 h-16 rounded-[20px] bg-[#111] border border-white/5 text-white/50 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center shrink-0 active:scale-95"
                onClick={() => setStep("identity")}
              >
                <ChevronRight size={24} className="rotate-180" />
              </button>
              <button
                className={`flex-1 h-16 rounded-[20px] text-[15px] font-bold uppercase tracking-[2px] bg-white text-black transition-all flex items-center justify-center gap-3 ${
                  !selectedTown ? "opacity-30 pointer-events-none" : "hover:scale-[1.02] active:scale-[0.98] shadow-[0_8px_30px_-10px_rgba(255,255,255,0.3)]"
                }`}
                disabled={!selectedTown}
                onClick={() => {
                  hapticService.batec();
                  setStep("connection");
                }}
              >
                <span>{t("auth.this_town_button", "Aquest Poble")}</span>
                <CheckCircle2 size={20} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CONNECTION */}
        {step === "connection" && (
          <div className="auth-step-container animate-fade-in-right">
            <div className="form-group mb-8">
              <label htmlFor="reg-phone" className="text-[10px] font-black tracking-[2px] text-white/40 uppercase mb-2 block">{t("auth.phone_label", "Telèfon Mòbil")}</label>
              <div className="flex items-center bg-[#111] border border-white/5 rounded-[20px] overflow-hidden focus-within:border-white/20 transition-all h-[64px]">
                <span className="flex items-center justify-center h-full px-5 bg-black/20 text-white/50 font-medium text-[15px] border-r border-white/5 shrink-0">🇪🇸 +34</span>
                <input
                  id="reg-phone"
                  name="phone"
                  type="tel"
                  placeholder="600 000 000"
                  value={phone}
                  onChange={(e) => {
                    let val = e.target.value.replace(/[^0-9]/g, "");
                    // Si el número enganxat comença per 34 i la resta té 9 dígits (longitud estàndard espanyola), traiem el 34
                    if (val.startsWith("34") && val.length > 9) {
                        val = val.substring(2);
                    }
                    // Si es passa de 9 dígits (després de netejar), ho limitem
                    if (val.length > 9) {
                        val = val.substring(0, 9);
                    }
                    setPhone(val);
                    if (val.length === 9) hapticService.batec();
                  }}
                  autoComplete="tel"
                  inputMode="numeric"
                  required
                  className={`flex-1 h-full bg-transparent border-none text-white text-[1.2rem] font-medium px-5 focus:outline-none placeholder:text-white/20 tracking-[1px] ${
                    phone && !isPhoneValid ? "text-red-400" : isPhoneValid ? "text-white" : ""
                  }`}
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                {authMode === 'register' && (
                  <button
                    className="w-16 h-16 rounded-[20px] bg-[#111] border border-white/5 text-white/50 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center shrink-0 active:scale-95"
                    onClick={() => setStep("town")}
                  >
                    <ChevronRight size={24} className="rotate-180" />
                  </button>
                )}
                <button
                  className={`flex-1 h-16 rounded-[20px] text-[15px] font-bold uppercase tracking-[2px] transition-all flex items-center justify-center gap-3 ${
                    authMode === 'login' ? 'bg-white text-black hover:scale-[1.02] shadow-[0_8px_30px_-10px_rgba(255,255,255,0.2)]' : 'bg-[#4F46E5] text-white hover:bg-[#4338ca] hover:scale-[1.02] shadow-[0_8px_30px_-10px_rgba(79,70,229,0.3)]'
                  } ${
                    !isPhoneValid ? "opacity-30 pointer-events-none" : "active:scale-[0.98]"
                  }`}
                  disabled={loading || !isPhoneValid}
                  onClick={handleRegister}
                >
                  {loading ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : (
                    <>
                      <span>{t("auth.sms_button", "Enviar SMS")}</span>
                      <Zap size={18} fill="currentColor" />
                    </>
                  )}
                </button>
              </div>

              <div className="relative flex items-center justify-center my-2 opacity-50">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <span className="relative px-4 text-[9px] font-bold uppercase tracking-[3px] bg-[#0a0a0a] text-white/50">{t("auth.or_also", "O També")}</span>
              </div>

              <button
                onClick={signInWithGoogle}
                disabled={loading}
                className="w-full h-14 bg-[#111] border border-white/5 rounded-[18px] flex items-center justify-center gap-3 hover:bg-white/5 transition-all active:scale-95"
              >
                <svg className="w-5 h-5 opacity-70" viewBox="0 0 24 24" xmlns="http://www.w3.org/2400/svg">
                  <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" fill="currentColor" />
                </svg>
                <span className="font-bold uppercase tracking-[1.5px] text-[11px] text-white/70">{t("auth.enter_with_google", "Entra amb Google")}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: VERIFY */}
        {step === "verify" && (
          <form
            onSubmit={handleVerifyOtp}
            className="auth-form animate-fade-in-right"
          >
            <div className="form-group mb-8">
              <label htmlFor="otp-input-reg" className="text-[10px] font-black tracking-[2px] text-white/40 uppercase mb-3 block text-center">{t("auth.otp_label", "Codi de Seguretat de 6 dígits")}</label>
              <input
                id="otp-input-reg"
                name="otp_code"
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                autoComplete="one-time-code"
                inputMode="numeric"
                maxLength={6}
                required
                className="w-full h-[80px] bg-[#111] border border-white/5 rounded-[20px] text-center text-white text-[28px] font-bold tracking-[14px] font-mono focus:border-white/20 transition-all outline-none placeholder:opacity-20"
              />
            </div>

            <button type="submit" className="w-full h-16 rounded-[20px] bg-white text-black text-[15px] font-bold tracking-[2px] shadow-[0_8px_30px_-10px_rgba(255,255,255,0.2)] disabled:opacity-30 flex items-center justify-center uppercase mb-8 hover:scale-[1.02] active:scale-[0.98] transition-all" disabled={loading || otp.length < 6} onClick={() => hapticService.batec()}>
              {loading ? <Loader2 className="animate-spin" size={24} /> : t("auth.confirm_entry", "Confirmar")}
            </button>

            <div className="otp-helper text-center flex flex-col items-center gap-4">
              {resendCountdown > 0 ? (
                <span className="text-[13px] text-white/40 font-medium">
                  {t("auth.new_code_in", "Nou codi en:")}{" "}
                  <strong className="text-white/90 tabular-nums">
                    00:{resendCountdown.toString().padStart(2, '0')}
                  </strong>
                </span>
              ) : (
                <button
                  type="button"
                  className="text-[13px] font-medium text-white/70 hover:text-white transition-colors flex items-center gap-2"
                  onClick={handleRegister}
                >
                  <Zap size={14} /> {t("auth.resend_sms", "Tornar a enviar SMS")}
                </button>
              )}
              
              <button
                type="button"
                className="text-[11px] font-bold uppercase tracking-[2px] text-white/30 hover:text-white/60 transition-colors mt-2"
                onClick={() => setStep("connection")}
              >
                {t("auth.change_number", "Corregir número")}
              </button>
            </div>
          </form>
        )}

        {/* STEP 5: WELCOME CELEBRATION */}
        {step === "welcome" && (
          <div className="auth-step-container animate-zoom-in flex flex-col items-center justify-center py-8">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
               <CheckCircle2 size={40} className="text-green-500" />
            </div>
            <h2 className="text-[22px] font-medium text-white text-center mb-2">
              {t("auth.welcome_home_prefix", "Accés ")}<span className="font-bold">Autoritzat</span>
            </h2>
            <p className="text-white/50 text-[14px] mb-8 text-center px-4">Preparant la plaça digital. T'estem redundant...</p>
            
            <div className="flex gap-2">
              <div className="w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse"></div>
              <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        
        {step !== "welcome" && (
            <div className="mt-10 pt-6 border-t border-white/5">
            <div className="text-center">
                {authMode === 'register' ? (
                <div className="flex flex-col gap-2 items-center">
                    <span className="text-[15px] font-medium text-white/40">{t("auth.already_have_account", "Ja tens compte al poble?")}</span>
                    <button 
                    onClick={() => { setAuthMode('login'); setStep('connection'); setError(null); }} 
                    className="text-[17px] font-bold text-orange-500 hover:text-orange-400 tracking-wide transition-colors"
                    >
                    {t("auth.enter_now", "Entrar Directament")}
                    </button>
                </div>
                ) : (
                <div className="flex flex-col gap-2 items-center">
                    <span className="text-[15px] font-medium text-white/40">{t("auth.dont_have_account", "Encara no tens connexió?")}</span>
                    <button 
                    onClick={() => { setAuthMode('register'); setStep('identity'); setError(null); }} 
                    className="text-[17px] font-bold text-orange-500 hover:text-orange-400 tracking-wide transition-colors"
                    >
                    {t("auth.register_now", "Crear Access")}
                    </button>
                </div>
                )}
            </div>
            <div className="mt-8 text-center flex flex-col items-center">
                <p className="text-[12px] text-white/30 max-w-[250px] leading-relaxed">
                    Operant sota la clàusula verda digital Sóc de Poble. 
                    <Link to="/legal" className="underline hover:text-white/50 ml-1">Condicions legals</Link>
                </p>
                <div className="mt-4 text-[12px] font-mono opacity-20">{APP_VERSION}</div>
            </div>
            </div>
        )}
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
    </div>
  );
};

export default Register;
