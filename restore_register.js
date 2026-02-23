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
import { logger } from "../utils/logger";
import { hapticService } from "../services/hapticService";
import { APP_VERSION } from "../constants";
import "./Auth.css";
import { useTranslation } from "react-i18next";

/**
 * [FLASH MASTERPIECE] Register.jsx v2.0
 */
const Register = () => {
  logger.log("[Register] Inicialitzant component...");
  const auth = useAuth();
  const { setIsPlayground, user } = auth;
  const { language, setLanguage } = useI18n();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/';

  useEffect(() => {
    if (user && !user.isDemo && !user.is_sovereign) {
      navigate(returnTo, { replace: true });
    }
  }, [user, navigate, returnTo]);

  const isInitialLogin = location.pathname === '/login';
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
        const formattedPhone = phone.startsWith("+") ? phone : \`+34\${phone}\`;
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

          logger.log("[Registration] Success for:", fullName || verifiedUser.id);
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
            logger.log("[WebOTP] Codi detectat automàticament:", otpData.code);
            setOtp(otpData.code);
          }
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            logger.warn("[WebOTP] Error o cancel·lat", err);
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
      const formattedPhone = phone.startsWith("+") ? phone : \`+34\${phone}\`;
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
      <div className="animate-in-up w-[92%] sm:w-full max-w-[500px] flex flex-col rounded-[28px] border border-white/10 p-6 sm:p-8 bg-black/60 shadow-2xl relative z-10 mx-auto">
        <header className="flex flex-col items-center mb-4 relative">
          <img src="/assets/master/logo_socdepoble_white_full.png" alt="Sóc de Poble" className="w-[400px] max-w-full h-auto object-contain drop-shadow-lg mb-2 hover:scale-105 transition-transform duration-500 will-change-transform" />

          {/* [NEW] Selector d'idioma Tàctil i Gegant */}
          <div className="language-selector-auth mb-8 mt-4">
            <div className="flex justify-center gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={\`w-14 items-center justify-center flex font-bold h-12 rounded-[20px] transition-all border border-transparent shadow-sm \${language === lang.code ? "bg-[#4F46E5] text-white shadow-[#4F46E5]/30 shadow-lg scale-105" : "bg-white/5 text-white/60 hover:bg-white/10"}\`}
                  onClick={() => {
                    setLanguage(lang.code);
                    i18n.changeLanguage(lang.code);
                    hapticService.batec();
                  }}
                >
                  <span className="uppercase tracking-widest">{lang.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* [MASTER GUIDANCE] IAIA en format Xat */}
          <div className="vision-mode-card flex gap-4 p-5 mb-6 border border-white/10 rounded-3xl bg-white/5 items-center">
            <div
              className="relative shrink-0 w-[80px] h-[80px] rounded-2xl overflow-hidden border-2 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)] bg-[#1a0f0a] p-1 flex items-center justify-center"
              onClick={() => hapticService.batec()}
            >
              <img
                src="/assets/avatars/iaia_official.png"
                alt="IAIA"
                className="w-full h-full object-contain drop-shadow-md"
              />
              <div className="absolute inset-0 bg-orange-500/20 animate-pulse"></div>
            </div>
            <div className="text-[1.3rem] font-medium leading-relaxed text-white tracking-wide">
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
                  ? t("auth.iaia_otp_ask", "Posa el codi de seguretat ací! 📱🏛️")
                  : t("auth.iaia_welcome", "Benvingut a la plaça, veí! 🎊"))}
            </div>
          </div>
        </header>

        {error && <div className="auth-error shake">{error}</div>}

        {/* STEP 1: IDENTITY */}
        {step === "identity" && (
          <div className="auth-step-container animate-fade-in-right">
            <div className="form-group mb-4">
              <label htmlFor="reg-fullname" className="hidden">{t("auth.name_label", "Nom i Cognoms")}</label>
              <div className="input-with-icon">
                <User size={28} className="input-icon" style={{ left: '16px', color: '#f97316' }} />
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
                  className={\`w-full text-2xl py-6 pl-[60px] font-light tracking-wide bg-white/5 border border-white/10 rounded-[20px] text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:bg-orange-500/5 transition-all \${
                    fullName && !isNameValid ? "border-red-500/50 bg-red-500/5" : isNameValid ? "border-orange-500/50 bg-orange-500/5 shadow-[0_0_15px_rgba(249,115,22,0.15)]" : ""
                  }\`}
                />
              </div>
            </div>

            <div className="personal-identity-tip animate-fade-in p-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-[20px] mb-6">
              <div className="flex gap-4 items-center">
                <div className="tip-icon-orb shrink-0">
                  <ShieldCheck size={28} className="text-orange-400" />
                </div>
                <div className="text-left">
                  <h4 className="tip-title text-[18px] text-orange-400 font-black tracking-widest uppercase mb-1 drop-shadow-sm">{t("auth.personal_register_title", "REGISTRE PERSONAL")}</h4>
                  <p className="tip-description text-[16px] text-white/80 leading-snug drop-shadow-sm font-medium" dangerouslySetInnerHTML={{ __html: t("auth.personal_register_desc", "Registra't primer com a persona. Una vegada dins, podràs crear les teues <span class=\\"text-white font-bold\\">empreses o institucions</span>.") }} />
                </div>
              </div>
            </div>

            <button
              className={\`w-full h-16 rounded-[20px] text-[1.15rem] font-black uppercase tracking-[2.5px] bg-[#4F46E5] text-white shadow-[0_10px_30px_rgba(79,70,229,0.3)] transition-all hover:bg-[#4338ca] hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(79,70,229,0.5)] flex items-center justify-center gap-4 \${
                !isNameValid ? "opacity-50 pointer-events-none" : ""
              }\`}
              disabled={!isNameValid}
              onClick={() => {
                hapticService.batec();
                setStep("town");
              }}
            >
              <span>{t("auth.continue_to_town", "CONTINUAR CAP AL POBLE")}</span>
            </button>
          </div>
        )}

        {/* STEP 2: TOWN */}
        {step === "town" && (
          <div className="auth-step-container animate-fade-in-right">
            <div className="form-group mb-8">
              <label htmlFor="town-picker-reg" className="text-sm font-black text-white/90 uppercase tracking-[1.5px] mb-3 block drop-shadow-md">
                {t("auth.town_picker_label", "Poble de Primera Residència")}
              </label>
              <button
                id="town-picker-reg"
                name="town_picker"
                type="button"
                className={\`w-full flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-[20px] transition-all hover:bg-white/10 hover:border-orange-500 text-left \${
                  selectedTown ? "bg-orange-500/5 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.15)]" : ""
                }\`}
                onClick={() => {
                  hapticService.batec();
                  setIsTownModalOpen(true);
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="icon-badge bg-orange-500/20 p-3 rounded-2xl border border-orange-500/30 shrink-0">
                    <MapPin size={28} className="text-orange-500" />
                  </div>
                  <div className="text-left flex flex-col justify-center">
                    <span className="text-[11px] font-black uppercase tracking-widest text-white/50 mb-1">{t("auth.town_picker_localitat", "Localitat")}</span>
                    <span className="text-[1.3rem] font-bold text-white leading-tight">
                      {selectedTown ? selectedTown.name : t("auth.town_picker_placeholder", "Tria el teu poble...")}
                    </span>
                  </div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl shrink-0">
                  <ChevronRight size={24} className="text-orange-500/70" />
                </div>
              </button>
            </div>
            <div className="flex gap-4 mt-4">
              <button
                className="w-[100px] h-16 rounded-[20px] bg-white/5 border border-white/10 text-white/70 font-bold uppercase tracking-wider hover:bg-white/10 transition-all flex items-center justify-center shrink-0"
                onClick={() => setStep("identity")}
              >
                {t("auth.back_button", "Enrere")}
              </button>
              <button
                className={\`flex-1 h-16 rounded-[20px] text-[1.15rem] font-black uppercase tracking-[2.5px] bg-gradient-to-r from-orange-500 to-orange-400 text-black shadow-[0_10px_30px_rgba(249,115,22,0.2)] transition-all flex items-center justify-center gap-4 \${
                  !selectedTown ? "opacity-40 grayscale pointer-events-none" : "hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(249,115,22,0.4)]"
                }\`}
                disabled={!selectedTown}
                onClick={() => {
                  hapticService.batec();
                  setStep("connection");
                }}
              >
                <span>{t("auth.this_town_button", "AQUEST POBLE")}</span>
                <CheckCircle2 size={24} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CONNECTION */}
        {step === "connection" && (
          <div className="auth-step-container animate-fade-in-right">
            <div className="form-group">
              <label htmlFor="reg-phone" className="text-sm font-black text-white/90 uppercase tracking-[1.5px] mb-3 block drop-shadow-md">{t("auth.phone_label", "Telèfon Mòbil")}</label>
              <div className="flex items-center bg-white/5 border border-white/10 rounded-[20px] overflow-hidden focus-within:border-orange-500 focus-within:bg-orange-500/5 focus-within:shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all h-[72px]">
                <span className="flex items-center justify-center h-full px-6 bg-white/5 text-white font-bold text-[1.1rem] border-r border-white/10 shrink-0">🇪🇸 +34</span>
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
                  className={\`flex-1 h-full bg-transparent border-none text-white text-[1.25rem] font-bold px-6 focus:outline-none placeholder:text-white/30 tracking-[2px] \${
                    phone && !isPhoneValid ? "text-red-400" : isPhoneValid ? "text-orange-400" : ""
                  }\`}
                />
              </div>
            </div>
            <div className="flex flex-col gap-6 mt-4">
              <div className="flex gap-4">
                {authMode === 'register' && (
                  <button
                    className="w-[100px] h-16 rounded-[20px] bg-white/5 border border-white/10 text-white/70 font-bold uppercase tracking-wider hover:bg-white/10 transition-all flex items-center justify-center shrink-0"
                    onClick={() => setStep("town")}
                  >
                    {t("auth.back_button", "Enrere")}
                  </button>
                )}
                <button
                  className={\`flex-1 h-16 rounded-[20px] text-[1.15rem] font-black uppercase tracking-[2.5px] bg-gradient-to-r from-orange-500 to-orange-400 text-black shadow-[0_10px_30px_rgba(249,115,22,0.2)] transition-all flex items-center justify-center gap-4 \${
                    !isPhoneValid ? "opacity-40 grayscale pointer-events-none" : "hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(249,115,22,0.4)]"
                  }\`}
                  disabled={loading || !isPhoneValid}
                  onClick={handleRegister}
                >
                  {loading ? (
                    <Loader2 size={28} className="animate-spin text-black" />
                  ) : (
                    <>
                      <span>{t("auth.sms_button", "SMS")}</span>
                      <Zap size={18} fill="currentColor" />
                    </>
                  )}
                </button>
              </div>

              <div className="relative flex items-center justify-center my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <span className="relative px-4 text-[10px] font-black uppercase tracking-widest bg-black text-gray-500">{t("auth.or_also", "O TAMBÉ")}</span>
              </div>

              <button
                onClick={signInWithGoogle}
                disabled={loading}
                className="auth-button-google w-full h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-95"
              >
                <img src="/assets/master/google_icon.png" alt="Google" className="w-5 h-5" />
                <span className="font-black uppercase tracking-widest text-xs">{t("auth.enter_with_google", "Entra amb Google")}</span>
              </button>
              
              <p className="text-[9px] text-gray-500 text-center opacity-60">
                {t("auth.google_faster_hint", "L'accés amb Google és més ràpid i no necessita SMS.")}
              </p>
            </div>
          </div>
        )}

        {/* STEP 4: VERIFY */}
        {step === "verify" && (
          <form
            onSubmit={handleVerifyOtp}
            className="auth-form glass-form animate-fade-in-right"
          >
            <div className="form-group mb-6">
              <label htmlFor="otp-input-reg" className="text-sm font-black text-white/90 uppercase tracking-[1.5px] mb-3 block drop-shadow-md text-center">{t("auth.otp_label", "Codi de 6 dígits")}</label>
              <input
                id="otp-input-reg"
                name="otp_code"
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                onFocus={() => setFocusedField("otp")}
                onBlur={() => setFocusedField(null)}
                autoComplete="one-time-code"
                inputMode="numeric"
                maxLength={6}
                required
                className="w-full h-[80px] bg-white/5 border border-white/10 rounded-[20px] text-center text-white text-[2rem] font-black tracking-[0.5em] font-mono focus:border-orange-500 focus:bg-orange-500/5 focus:shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all outline-none"
              />
            </div>

            <button type="submit" className="w-full h-16 rounded-[20px] bg-[#4F46E5] text-white text-[1.15rem] font-black tracking-[2.5px] shadow-lg disabled:opacity-50 flex items-center justify-center uppercase mb-6 hover:-translate-y-1 hover:shadow-xl transition-all" disabled={loading || otp.length < 6} onClick={() => hapticService.batec()}>
              {loading ? <Loader2 className="animate-spin" size={28} /> : t("auth.confirm_entry", "CONFIRMAR ENTRADA")}
            </button>

            <div className="otp-helper text-center mb-4">
              {resendCountdown > 0 ? (
                <span className="text-white/60">
                  {t("auth.new_code_in", "Nou codi en")}{" "}
                  <strong className="text-orange-400">
                    {resendCountdown}{t("auth.seconds_short", "s")}
                  </strong>
                </span>
              ) : (
                <button
                  type="button"
                  className="text-orange-400 font-bold hover:underline"
                  onClick={handleRegister}
                >
                  {t("auth.resend_sms", "No he rebut res. Reenviar SMS 🔁")}
                </button>
              )}
            </div>

            <button
              type="button"
              className="w-full text-center text-white/50 text-[14px] font-bold hover:text-white transition-colors uppercase tracking-widest"
              onClick={() => setStep("connection")}
            >
              {t("auth.change_number", "Canviar número")}
            </button>
          </form>
        )}

        {/* STEP 5: WELCOME CELEBRATION */}
        {step === "welcome" && (
          <div className="auth-step-container celebration-step animate-zoom-in">
            <div className="celebration-icon text-5xl mb-4 text-center">🎊</div>
            <h2 className="victory-text text-3xl font-black text-white text-center mb-6">
              {t("auth.welcome_home_prefix", "Benvingut a casa, ")}{fullName.split(" ")[0]}!
            </h2>
            <div className="iaia-final-blessing bg-white/5 p-6 rounded-2xl border border-white/10 w-full text-center">
              <p className="text-[1.1rem] leading-relaxed italic text-white/90 mb-4">
                {t("auth.iaia_final_speech", "\\"Ja eres un dels nostres. Cor de poble, bategat digital. Ens veiem a la plaça!\\"")}
              </p>
              <span className="iaia-signature font-bold text-orange-400 tracking-widest uppercase">{t("auth.iaia_signature", "- L'IAIA 👵✨")}</span>
            </div>
            <div className="loading-dots-premium flex justify-center gap-2 mt-8">
              <span className="w-2 h-2 bg-white/80 rounded-full animate-ping"></span>
            </div>
          </div>
        )}
        <div className="auth-footer-integrated mt-10">
          <div className="auth-legal-text mb-6 text-[16px] text-white/60 leading-relaxed px-4 text-center">
            {t("auth.legal_accept", "En bategar, acceptes que Sóc de Poble és un experiment de sobirania digital.")}
            <br />
            <Link to="/legal" className="underline hover:text-white text-orange-400 font-bold mt-2 inline-block">{t("auth.legal_notices", "Avisos Legals")}</Link>
          </div>
          
          <div className="text-center text-[18px]">
            {authMode === 'register' ? (
              <>
                <span className="opacity-70 text-white">{t("auth.already_have_account", "Ja tens compte?")}</span>{" "}
                <button 
                  onClick={() => { setAuthMode('login'); setStep('connection'); setError(null); }} 
                  className="text-orange-500 font-black hover:text-orange-400 hover:underline tracking-wide bg-transparent border-none cursor-pointer"
                >
                  {t("auth.enter_now", "Entra ara")}
                </button>
              </>
            ) : (
              <>
                <span className="opacity-70 text-white">{t("auth.dont_have_account", "No tens compte?")}</span>{" "}
                <button 
                  onClick={() => { setAuthMode('register'); setStep('identity'); setError(null); }} 
                  className="text-orange-500 font-black hover:text-orange-400 hover:underline tracking-wide bg-transparent border-none cursor-pointer"
                >
                  {t("auth.register_now", "Registra't ara")}
                </button>
              </>
            )}
          </div>

          <div className="auth-version-footer-integrated mt-6 mb-4 opacity-40 text-[12px] uppercase tracking-[3px] text-center font-bold">
            {APP_VERSION}
          </div>
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
    </div>
  );
};

export default Register;
`

fs.writeFileSync('/Users/javillinares/Documents/Antigravity/Sóc de Poble/src/pages/Register.jsx', content);

