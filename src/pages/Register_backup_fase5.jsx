import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabaseService } from "../services/supabaseService";
import {
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Loader2,
  User,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Globe,
  Zap,
} from "lucide-react";
import TownSelectorModal from "../components/TownSelectorModal";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/I18nContext"; // AFIEGIT PER A IDIOMES
import { logger } from "../utils/logger";
import { hapticService } from "../services/hapticService";
import { APP_VERSION } from "../constants";
import "./Auth.css";

/**
 * [FLASH MASTERPIECE] Register.jsx v2.0
 * La millor pàgina de registre del món: ràpida, premium i sobirana.
 */
const Register = () => {
  logger.log("[Register] Inicialitzant component...");
  const auth = useAuth();
  const { setIsPlayground, user } = auth;
  const { language, setLanguage } = useI18n(); // RECUPEREM EL CONTROL DEL BATEGAT IDIOMÀTIC
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/';

  // [DIRECTIVA 1] Auto-redirect already authenticated users
  useEffect(() => {
    if (user && !user.isDemo && !user.is_sovereign) {
      navigate(returnTo, { replace: true });
    }
  }, [user, navigate, returnTo]);

  // State for auth modes & steps
  const [step, setStep] = useState("identity"); // 'identity' | 'verify'

  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [selectedTown, setSelectedTown] = useState(null);

  // UI states
  const [isTownModalOpen, setIsTownModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null); // 'name' | 'phone' | 'email' | 'town' | 'otp'

  // Real-time validation visual cues
  const isPhoneValid = phone.length >= 9;
  const isNameValid = fullName.trim().length >= 3;
  // const isFormPreValid = authMethod === 'phone' ? (isPhoneValid && isNameValid && selectedTown) : (email.includes('@') && isNameValid && selectedTown);

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
          await supabaseService.updateProfile(verifiedUser.id, {
            full_name: fullName,
            town_id: selectedTown?.id,
            town_uuid: selectedTown?.uuid,
            primary_town: selectedTown?.name,
          });

          // Track activation
          logger.log("[Registration] Success for:", fullName);
          hapticService.notifySuccess();

          // [VICTORY SEQUENCE]
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
    [phone, fullName, selectedTown, otp, navigate, setIsPlayground, returnTo],
  );

  useEffect(() => {
    if (otp && otp.length === 6 && step === "verify") {
      handleVerifyOtp(null, otp);
    }
  }, [step, handleVerifyOtp, otp]);

  // [V1.5.6 - ZERO-CLICK LOGIN] WebOTP API per a lectura automàtica d'SMS
  useEffect(() => {
    if ("OTPCredential" in window && step === "verify") {
      const ac = new AbortController();
      navigator.credentials
        .get({
          otp: { transport: ["sms"] },
          signal: ac.signal,
        })
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

  // Resend countdown timer
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

    if (!selectedTown) {
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
    { code: "va", label: "VALENCIÀ", flag: "🥘" },
    { code: "es", label: "CASTELLANO", flag: "🥘" },
    { code: "en", label: "ENGLISH", flag: "🇬🇧" },
    { code: "eu", label: "EUSKERA", flag: "🏺" },
    { code: "fr", label: "FRANÇAIS", flag: "🇫🇷" },
  ];

  return (
    <div className="auth-container integrated-frame">
      <div className="auth-card animate-in-up">
        {/* Visual Progress Bar */}
        <div className="onboarding-progress">
          <div
            className={`progress-segment ${
              step === "identity" ? "active" : "completed"
            }`}
          ></div>
          <div
            className={`progress-segment ${
              step === "verify" ? "active" : ""
            }`}
          ></div>
        </div>

        <header className="auth-header">
          <img src="/assets/master/logo-socdepoble-rect.svg" alt="Sóc de Poble" className="auth-logo-v2" />

          {/* [NEW] Selector d'idioma ultra-compacte */}
          <div className="language-selector-auth mb-4">
            <div className="flex justify-center gap-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={`lang-pill ${language === lang.code ? "active" : ""}`}
                  onClick={() => {
                    setLanguage(lang.code);
                    hapticService.batec();
                  }}
                  style={{ padding: "4px 8px" }}
                >
                  <span className="text-[9px] font-black uppercase tracking-widest">{lang.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* [MASTER GUIDANCE] IAIA en format Xat */}
          <div className="auth-iaia-guidance interstellar-iaia">
            <div
              className="iaia-avatar-wrapper"
              onClick={() => hapticService.batec()}
            >
              <img
                src="/assets/avatars/iaia_dinamica.png"
                alt="IAIA"
                className="iaia-mini-avatar focus-face-speaker"
              />
              <div className="iaia-pulse"></div>
            </div>
            <div className="iaia-speech-bubble-interstellar">
              {step === "identity"
                ? focusedField === "name"
                  ? "Com et coneixen al poble? ✨"
                  : "Hola bonica! Soc la IAIA. Com t'hem de dir ací?"
                : step === "town"
                ? "Quin és el poble on bategues? 📍"
                : step === "connection"
                ? "Dona'm la clau del teu mòbil. 📱"
                : step === "verify"
                ? "Posa el codi de seguretat ací! 📱🏛️"
                : "Benvingut a la plaça, veí! 🎊"}
            </div>
          </div>
        </header>

        {error && <div className="auth-error shake">{error}</div>}

        {/* STEP 1: IDENTITY */}
        {step === "identity" && (
          <div className="auth-step-container animate-fade-in-right">
            <div className="form-group mb-2">
              <label 
                htmlFor="reg-fullname" 
                className="flex items-center gap-2 text-xl font-light text-[#00f2ff] tracking-widest mb-3"
              >
                QUI ERES?
              </label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  id="reg-fullname"
                  name="full_name"
                  type="text"
                  placeholder="El teu Nom i Cognoms"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (e.target.value.length === 3) hapticService.batec();
                  }}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="name"
                  required
                  className={
                    fullName && !isNameValid
                      ? "input-error"
                      : isNameValid
                      ? "input-success"
                      : ""
                  }
                />
              </div>
            </div>

            {/* [DIRECTIVA MESTRE] Avis d'identitat personal - REFINED ALZINA */}
            <div className="personal-identity-tip animate-fade-in">
              <div className="flex gap-4 items-center">
                <div className="tip-icon-orb">
                  <ShieldCheck size={20} className="text-indigo-400" />
                </div>
                <div className="text-left">
                  <h4 className="tip-title">REGISTRE PERSONAL</h4>
                  <p className="tip-description">
                    Registra't primer com a persona. Una vegada dins, podràs crear les teues <span className="text-white">empreses o institucions</span>.
                  </p>
                </div>
              </div>
            </div>

            <button
              className={`auth-button v2 main-btn ${
                !isNameValid ? "btn-dimmed" : ""
              }`}
              disabled={!isNameValid}
              onClick={() => {
                hapticService.batec();
                setStep("town");
              }}
            >
              <span>CONTINUAR CAP AL POBLE</span>
            </button>
          </div>
        )}

        {/* STEP 2: TOWN */}
        {step === "town" && (
          <div className="auth-step-container animate-fade-in-right">
            <div className="form-group">
              <label htmlFor="town-picker-reg">
                Poble de Primera Residència
              </label>
              <button
                id="town-picker-reg"
                name="town_picker"
                type="button"
                className={`town-selector-premium ${
                  selectedTown ? "selected" : ""
                }`}
                onClick={() => {
                  hapticService.batec();
                  setIsTownModalOpen(true);
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="icon-badge bg-orange-500/20 p-3 rounded-[28px] border border-orange-500/30">
                    <MapPin size={24} className="text-orange-500" />
                  </div>
                  <div className="text-left flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Localitat</span>
                    <span className="text-xl font-bold">
                      {selectedTown ? selectedTown.name : "Tria el teu poble..."}
                    </span>
                  </div>
                </div>
                <div className="bg-white/5 p-2 rounded-[28px]">
                  <ChevronRight size={20} className="text-gray-500" />
                </div>
              </button>
            </div>
            <div className="flex gap-4">
              <button
                className="text-btn back-btn-step"
                onClick={() => setStep("identity")}
              >
                Enrere
              </button>
              <button
                className={`auth-button v2 main-btn ${
                  !selectedTown ? "btn-dimmed" : ""
                }`}
                disabled={!selectedTown}
                onClick={() => {
                  hapticService.batec();
                  setStep("connection");
                }}
              >
                <span>TRIAR AQUEST POBLE</span>
                <CheckCircle2 size={20} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CONNECTION */}
        {step === "connection" && (
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
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    setPhone(val);
                    if (val.length === 9) hapticService.batec();
                  }}
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="tel"
                  inputMode="numeric"
                  required
                  className={`phone-input-prime ${
                    phone && !isPhoneValid
                      ? "input-error"
                      : isPhoneValid
                      ? "input-success"
                      : ""
                  }`}
                />
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex gap-4">
                <button
                  className="text-btn back-btn-step"
                  onClick={() => setStep("town")}
                >
                  Enrere
                </button>
                <button
                  className={`auth-button v2 main-btn flex-1 ${
                    !isPhoneValid ? "btn-dimmed" : ""
                  }`}
                  disabled={loading || !isPhoneValid}
                  onClick={handleRegister}
                >
                  {loading ? (
                    <Loader2 size={28} className="animate-spin text-[#00f2ff]" />
                  ) : (
                    <>
                      <span>SMS</span>
                      <Zap size={18} fill="currentColor" />
                    </>
                  )}
                </button>
              </div>

              <div className="relative flex items-center justify-center my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <span className="relative px-4 text-[10px] font-black uppercase tracking-widest bg-black text-gray-500">O TAMBÉ</span>
              </div>

              <button
                onClick={signInWithGoogle}
                disabled={loading}
                className="auth-button-google w-full h-14 bg-white/5 border border-white/10 rounded-[28px] flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-95"
              >
                <img src="/assets/master/google_icon.png" alt="Google" className="w-5 h-5" />
                <span className="font-black uppercase tracking-widest text-xs">Entra amb Google</span>
              </button>
              
              <p className="text-[9px] text-gray-500 text-center opacity-60">
                L'accés amb Google és més ràpid i no necessita SMS.
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
            <div className="form-group">
              <label htmlFor="otp-input-reg">Codi de 6 dígits</label>
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
                className="otp-input-field big"
              />
            </div>

            <button
              type="submit"
              className="auth-button v2"
              disabled={loading || otp.length < 6}
              onClick={() => hapticService.batec()}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={28} />
              ) : (
                "CONFIRMAR ENTRADA"
              )}
            </button>

            <div className="otp-helper" style={{ marginTop: "16px" }}>
              {resendCountdown > 0 ? (
                <span>
                  Nou codi disponible en{" "}
                  <strong style={{ color: "var(--color-primary)" }}>
                    {resendCountdown}s
                  </strong>
                </span>
              ) : (
                <button
                  type="button"
                  className="text-btn accent"
                  onClick={handleRegister}
                >
                  No he rebut res. Reenviar SMS 🔁
                </button>
              )}
            </div>

            <button
              type="button"
              className="text-btn back-btn"
              onClick={() => setStep("connection")}
            >
              Canviar número
            </button>
          </form>
        )}

        {/* STEP 5: WELCOME CELEBRATION */}
        {step === "welcome" && (
          <div className="auth-step-container celebration-step animate-zoom-in">
            <div className="celebration-icon">🎊</div>
            <h2 className="victory-text">
              Benvingut a casa, {fullName.split(" ")[0]}!
            </h2>
            <div className="iaia-final-blessing">
              <p>
                "Ja eres un dels nostres. Cor de poble, bategat digital. Ens
                veiem a la plaça!"
              </p>
              <span className="iaia-signature">- L'IAIA 👵✨</span>
            </div>
            <div className="loading-dots-premium">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div className="auth-footer-integrated mt-8">
          <div className="auth-legal-text mb-4">
            En bategar, acceptes que Sóc de Poble és un experiment de sobirania digital.
            <br />
            <Link to="/legal" className="underline hover:text-white">Avisos Legals</Link>
          </div>
          
          <div className="text-center text-sm">
            <span className="opacity-50">Ja tens compte?</span>{" "}
            <Link to="/login" className="text-orange-500 font-bold hover:underline">
              Entra ara
            </Link>
          </div>

          <div className="auth-version-footer-integrated mt-4 opacity-30 text-[10px] uppercase tracking-widest">
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
