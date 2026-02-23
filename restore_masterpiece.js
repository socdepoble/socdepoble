const fs = require('fs');

const content = `import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams, Link, useLocation } from "react-router-dom";
import { supabaseService } from "../services/supabaseService";
import {
  MapPin, Phone, Mail, ArrowRight, Loader2, User, ShieldCheck, CheckCircle2, ChevronRight, Globe, Zap,
} from "lucide-react";
import TownSelectorModal from "../components/TownSelectorModal";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/I18nContext";
import { hapticService } from "../services/hapticService";
import { logger } from "../utils/logger";
import { APP_VERSION } from "../constants";
import "./Auth.css";
import { useTranslation } from "react-i18next";

/**
 * [FLASH MASTERPIECE] Register.jsx v2.0
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
  const [focusedField, setFocusedField] = useState(null);

  const isPhoneValid = phone.length >= 9;
  const isNameValid = fullName.trim().length >= 3;

  const handleVerifyOtp = useCallback(
    async (e, codeToVerify = null) => {
      e?.preventDefault();
      setLoading(true);
      setError(null);
      const code = codeToVerify || otp;

      try {
        const formattedPhone = phone.startsWith("+") ? phone : \\\`+34\${phone}\\\`;
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
      const formattedPhone = phone.startsWith("+") ? phone : \\\`+34\${phone}\\\`;
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
    <div className="auth-container integrated-frame px-4 sm:px-0 py-8 overflow-y-auto flex items-center justify-center min-h-screen">
      <div className="animate-in-up w-[92%] sm:w-full max-w-[500px] flex flex-col rounded-[28px] border border-white/10 p-6 sm:p-8 bg-[#0a0a0a] shadow-2xl relative z-10 mx-auto">
        <header className="flex flex-col items-center mb-4 relative">
          <img src="/assets/master/logo_socdepoble_white_full.png" alt="Sóc de Poble" className="w-[300px] max-w-full h-auto object-contain drop-shadow-lg mb-2 hover:scale-105 transition-transform duration-500 will-change-transform" />

          {/* [NEW] Selector d'idioma Tàctil i Gegant */}
          <div className="language-selector-auth mb-8 mt-4">
            <div className="flex justify-center gap-3 bg-[#111] p-2 rounded-[24px] border border-white/5">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={\\\`w-14 items-center justify-center flex font-bold h-12 rounded-[18px] transition-all border border-transparent shadow-sm \${language === lang.code ? "bg-[#4F46E5] text-white shadow-[#4F46E5]/30 shadow-lg scale-105" : "bg-transparent text-white/50 hover:bg-white/5"}\\\`}
                  onClick={() => {
                    setLanguage(lang.code);
                    i18n.changeLanguage(lang.code);
                    hapticService.batec();
                  }}
                >
                  <span className="uppercase tracking-widest text-xs">{lang.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* [MASTER GUIDANCE] IAIA en format Xat */}
          <div className="vision-mode-card flex gap-4 p-5 mb-6 border border-white/5 rounded-3xl bg-[#151515] items-center w-full shadow-inner">
            <div
              className="relative shrink-0 w-[60px] h-[60px] rounded-2xl overflow-hidden border border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.1)] bg-[#1a0f0a] p-1 flex items-center justify-center"
              onClick={() => hapticService.batec()}
            >
              <img
                src="/assets/avatars/iaia_official.png"
                alt="IAIA"
                className="w-full h-full object-contain drop-shadow-md rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent"></div>
            </div>
            <div className="text-[1.1rem] font-medium leading-snug text-white/90 tracking-wide">
              {authMode === 'login' && step !== 'welcome'
                ? t("auth.iaia_login_greeting", "Ben tornat, bonic! Obri amb la clau i entrem a la plaça. 🔑")
                : (step === "identity"
                  ? focusedField === "name"
                    ? t("auth.iaia_focus_name", "Com et coneixen al poble? ✨")
                    : t("auth.iaia_greeting", "Hola bonica! Soc la IAIA. Com t'hem de dir ací?")
                  : step === "town"
                  ? t("auth.iaia_town_ask", "Quin és el poble on bategues? 📍")
                  : step === "connection"
                  ? t("auth.iaia_phone_ask", "Dona'm la clau del teu mòbil. 📱")
                  : step === "verify"
                  ? t("auth.iaia_otp_ask", "Posa el codi de seguretat ací! 📱")
                  : t("auth.iaia_welcome", "Benvingut a la plaça! 🎊"))}
            </div>
          </div>
        </header>

        {error && <div className="auth-error shake bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-6 text-sm flex items-center gap-3"><AlertCircle size={20} />{error}</div>}

        {/* STEP 1: IDENTITY */}
        {step === "identity" && (
          <div className="auth-step-container animate-fade-in-right">
            <div className="form-group mb-4">
              <label htmlFor="reg-fullname" className="text-[10px] font-black tracking-[2px] text-white/40 uppercase mb-2 block">{t("auth.name_label", "Nom i Cognoms")}</label>
              <div className="relative flex items-center">
                <div className="absolute left-4 opacity-50"><User size={20} style={{ color: '#f97316' }} /></div>
                <input
                  id="reg-fullname"
                  name="full_name"
                  type="text"
                  placeholder={t("auth.name_placeholder", "Qui eres? (Nom i Cognoms)")}
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (e.target.value.length === 3) hapticService.batec();
                  }}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="name"
                  required
                  className={\\\`w-full text-lg py-5 pl-12 pr-4 font-normal tracking-wide bg-[#111] border rounded-[20px] text-white focus:outline-none transition-all placeholder:text-white/20 \${
                    fullName && !isNameValid ? "border-red-500/30 focus:border-red-500" : isNameValid ? "border-orange-500/50 bg-orange-500/5 focus:border-orange-500 focus:bg-orange-500/10" : "border-white/5 focus:border-white/20"
                  }\\\`}
                />
              </div>
            </div>

            <div className="personal-identity-tip animate-fade-in p-5 bg-[#151515] border border-orange-500/10 rounded-[20px] mb-8 mt-6">
              <div className="flex gap-4 items-start">
                <div className="tip-icon-orb shrink-0 bg-transparent border border-orange-500/20 p-2 rounded-xl mt-1">
                  <ShieldCheck size={20} className="text-orange-400" />
                </div>
                <div className="text-left">
                  <h4 className="tip-title text-[12px] text-orange-400 font-bold tracking-[2px] uppercase mb-1">{t("auth.personal_register_title", "Registre Personal")}</h4>
                  <p className="tip-description text-[14px] text-white/50 leading-relaxed font-light" dangerouslySetInnerHTML={{ __html: t("auth.personal_register_desc", "Registra't primer com a persona. Una vegada dins, podràs crear les teues <span class=\\\\"text-white font-medium\\\\">empreses o institucions</span>.") }} />
                </div>
              </div>
            </div>

            <button
              className={\\\`w-full h-16 rounded-[20px] text-[15px] font-bold uppercase tracking-[2px] bg-[#4F46E5] text-white transition-all flex items-center justify-center gap-3 \${
                !isNameValid ? "opacity-30 pointer-events-none" : "hover:bg-[#4338ca] hover:scale-[1.02] active:scale-[0.98] shadow-[0_8px_30px_-10px_rgba(79,70,229,0.5)]"
              }\\\`}
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
                {t("auth.town_picker_label", "Poble de Residència")}
              </label>
              <button
                id="town-picker-reg"
                name="town_picker"
                type="button"
                className={\\\`w-full flex items-center justify-between p-4 bg-[#111] border rounded-[20px] transition-all text-left \${
                  selectedTown ? "bg-orange-500/5 border-orange-500/50" : "border-white/5 hover:border-white/20"
                }\\\`}
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
                className={\\\`flex-1 h-16 rounded-[20px] text-[15px] font-bold uppercase tracking-[2px] bg-white text-black transition-all flex items-center justify-center gap-3 \${
                  !selectedTown ? "opacity-30 pointer-events-none" : "hover:scale-[1.02] active:scale-[0.98] shadow-[0_8px_30px_-10px_rgba(255,255,255,0.3)]"
                }\\\`}
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
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    setPhone(val);
                    if (val.length === 9) hapticService.batec();
                  }}
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="tel"
                  inputMode="numeric"
                  required
                  className={\\\`flex-1 h-full bg-transparent border-none text-white text-[1.2rem] font-medium px-5 focus:outline-none placeholder:text-white/20 tracking-[1px] \${
                    phone && !isPhoneValid ? "text-red-400" : isPhoneValid ? "text-white" : ""
                  }\\\`}
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
                  className={\\\`flex-1 h-16 rounded-[20px] text-[15px] font-bold uppercase tracking-[2px] transition-all flex items-center justify-center gap-3 \${
                    authMode === 'login' ? 'bg-white text-black hover:scale-[1.02] shadow-[0_8px_30px_-10px_rgba(255,255,255,0.2)]' : 'bg-[#4F46E5] text-white hover:bg-[#4338ca] hover:scale-[1.02] shadow-[0_8px_30px_-10px_rgba(79,70,229,0.3)]'
                  } \${
                    !isPhoneValid ? "opacity-30 pointer-events-none" : "active:scale-[0.98]"
                  }\\\`}
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
                <img src="/assets/master/google_icon_mono.png" alt="Google" className="w-5 h-5 opacity-70" onError={(e) => { e.target.src="/assets/master/google_icon.png" }} />
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
                onFocus={() => setFocusedField("otp")}
                onBlur={() => setFocusedField(null)}
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
                    <span className="text-[12px] font-medium text-white/40">{t("auth.already_have_account", "Ja tens compte al poble?")}</span>
                    <button 
                    onClick={() => { setAuthMode('login'); setStep('connection'); setError(null); }} 
                    className="text-[14px] font-bold text-orange-500 hover:text-orange-400 tracking-wide transition-colors"
                    >
                    {t("auth.enter_now", "Entrar Directament")}
                    </button>
                </div>
                ) : (
                <div className="flex flex-col gap-2 items-center">
                    <span className="text-[12px] font-medium text-white/40">{t("auth.dont_have_account", "Encara no tens connexió?")}</span>
                    <button 
                    onClick={() => { setAuthMode('register'); setStep('identity'); setError(null); }} 
                    className="text-[14px] font-bold text-orange-500 hover:text-orange-400 tracking-wide transition-colors"
                    >
                    {t("auth.register_now", "Crear Access")}
                    </button>
                </div>
                )}
            </div>
            <div className="mt-8 text-center flex flex-col items-center">
                <p className="text-[10px] text-white/30 max-w-[250px] leading-relaxed">
                    Operant sota la clàusula verda digital Sóc de Poble. 
                    <Link to="/legal" className="underline hover:text-white/50 ml-1">Condicions legals</Link>
                </p>
                <div className="mt-4 text-[9px] font-mono opacity-20">{APP_VERSION} CORE</div>
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
`

fs.writeFileSync('/Users/javillinares/Documents/Antigravity/Sóc de Poble/src/pages/Register.jsx', content);

