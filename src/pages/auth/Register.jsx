import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ChevronRight, MapPin, CheckCircle2, Zap, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabaseService } from "../../core/services/supabaseService";
import { useAuth } from "../../app/context/AuthContext";
import { useI18n } from "../../app/context/I18nContext";
import { logger } from "../../utils/logger";
import { hapticService } from "../../core/services/hapticService";
import { APP_VERSION } from "../../constants";
import "./Auth.css";
import { authService } from '../../core/services/authService';
import BrandLogo from "../../components/ui/BrandLogo";
import TownSelectorModal from "../../components/modals/TownSelectorModal";

const Register = () => {
  logger.log("[Register] Inicialitzant component...");
  const auth = useAuth();
  const { setIsPlayground, user } = auth;
  const { language, setLanguage } = useI18n();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/';

  useEffect(() => {
    if (user && !user.isDemo && !user.is_sovereign) {
      navigate(returnTo, { replace: true });
    }
  }, [user, navigate, returnTo]);

  const isLoginRoute = window.location.pathname.includes('/login');
  const [mode] = useState(isLoginRoute ? "login" : "register");
  const [step, setStep] = useState(isLoginRoute ? "connection" : "identity");

  const ENABLE_MANUAL_REGISTRATION = false;

  const [fullName, setFullName] = useState(() => localStorage.getItem("sp_draft_name") || "");
  const [phone, setPhone] = useState(() => localStorage.getItem("sp_draft_phone") || "");
  const [otp, setOtp] = useState("");

  const [selectedTown, setSelectedTown] = useState(() => {
    const saved = sessionStorage.getItem('register_selected_town');
    return saved ? JSON.parse(saved) : null;
  });
  const [showTownPicker, setShowTownPicker] = useState(false);

  const [error, setError] = useState(null);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [loading, setLoading] = useState(false);

  const isPhoneValid = phone.length >= 9;
  const isNameValid = fullName.trim().length >= 3;

  const handleVerifyOtp = useCallback(async (e, codeToVerify = null) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    const code = codeToVerify || otp;
    try {
      const formattedPhone = phone.startsWith("+") ? phone : `+34${phone}`;
      const { user: verifiedUser } = await authService.verifyOtp(formattedPhone, code);
      if (verifiedUser) {
        if (mode === "register") {
          await supabaseService.updateProfile(verifiedUser.id, {
            full_name: fullName,
            town_uuid: selectedTown?.uuid,
            primary_town: selectedTown?.name
          });
        }
        logger.log("[Registration/Login] Success for:", mode === "register" ? fullName : verifiedUser.id);
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
  }, [phone, fullName, selectedTown, otp, navigate, setIsPlayground, returnTo, mode]);

  useEffect(() => {
    if (otp && otp.length === 6 && step === "verify") {
      handleVerifyOtp(null, otp);
    }
  }, [step, handleVerifyOtp, otp]);

  useEffect(() => {
    if ("OTPCredential" in window && step === "verify") {
      const ac = new AbortController();
      navigator.credentials.get({
        otp: { transport: ["sms"] },
        signal: ac.signal
      }).then(otpData => {
        if (otpData && otpData.code) {
          logger.log("[WebOTP] Codi detectat automàticament:", otpData.code);
          setOtp(otpData.code);
        }
      }).catch(err => {
        if (err.name !== "AbortError") {
          logger.warn("[WebOTP] Error o cancel·lat", err);
        }
      });
      return () => ac.abort();
    }
  }, [step]);

  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setInterval(() => setResendCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const handleRegister = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (mode === "register" && !selectedTown) {
      setError("Selecciona el teu poble per a continuar el procés.");
      setLoading(false);
      return;
    }
    try {
      if (!phone || phone.length < 9) {
        throw new Error("Introdueix un número de mòbil vàlid.");
      }
      localStorage.setItem("sp_draft_phone", phone);
      if (mode === "register") {
        localStorage.setItem("sp_draft_name", fullName);
      }
      const formattedPhone = phone.startsWith("+") ? phone : `+34${phone}`;
      await authService.signInWithOtp(formattedPhone);
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
      await authService.signInWithGoogle();
      hapticService.batec();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const languages = [
    { code: "va", label: "VAL", flag: "🔴" },
    { code: "es", label: "CAS", flag: "🥘" },
    { code: "en", label: "ENG", flag: "🇬🇧" },
    { code: "eu", label: "EUS", flag: "🏺" },
    { code: "gl", label: "GAL", flag: "🐙" }
  ];

  return (
    <div className="flex flex-col md:flex-row w-full min-h-[100dvh] bg-white relative overflow-hidden font-sans">
        
        {/* --- SECCIÓ ESQUERRA (ESCRIPTORI): Identitat Visual i Missatge IAIA --- */}
        <div className='hidden md:flex md:w-1/2 lg:w-[55%] bg-orange-50 relative flex-col items-center justify-center p-8 lg:p-12 border-r border-gray-200 overflow-hidden'>
          <div className="absolute inset-0 z-0 opacity-10 pointer-events-none mix-blend-multiply" style={{
            backgroundImage: "url('/assets/brand/pattern_soc.png')",
            backgroundSize: 'cover'
          }}></div>
          <div className="relative z-10 w-full max-w-xl mb-12">
            <BrandLogo className='w-full h-auto object-contain drop-shadow-lg text-orange-600' />
          </div>
          
          <div className='relative z-10 w-full max-w-xl bg-white border border-gray-200 rounded-[32px] p-8 flex gap-8 items-start shadow-xl'>
            <div className='w-24 h-24 shrink-0 rounded-full bg-orange-100 flex items-center justify-center shadow-inner overflow-hidden border-4 border-white'>
               <img src="/uploads/avatars/iaia_comic_matriarch.png" alt="IAIA" className="w-[110%] h-[110%] object-cover object-top" />
            </div>
            <div className="flex-1 pt-2">
               <h3 className='font-black text-orange-600 text-xl mb-3 uppercase tracking-tight m-0'>IAIA Guia</h3>
               <p className="text-gray-900 text-xl leading-relaxed font-medium m-0">
                 {step === "identity" ? t('auth.iaia_guide_identity') : step === "town" ? t('auth.iaia_guide_town') : step === "connection" ? t('auth.iaia_guide_connection') : step === "verify" ? t('auth.iaia_guide_verify') : t('auth.iaia_guide_welcome')}
               </p>
            </div>
          </div>
        </div>

        {/* --- SECCIÓ DRETA: Formulari Interactiu --- */}
        <div className="w-full md:w-1/2 lg:w-[45%] flex-1 flex flex-col relative overflow-y-auto pb-12 md:pb-0">
          
          <div className='absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-400 to-orange-600 opacity-80 md:hidden'></div>

          <div className="w-full flex-1 flex flex-col px-6 md:px-12 lg:px-20 pt-6 md:pt-12 pb-8 max-w-md md:max-w-2xl mx-auto md:justify-center relative">

            <div className='flex justify-center gap-1.5 mb-8 bg-white md:bg-transparent border border-gray-200 md:border-none p-1.5 md:p-0 rounded-full z-20 mx-auto'>
                {languages.map(lang => (
                  <button key={lang.code} className={`px-4 py-2 rounded-full transition-all text-[11px] font-black uppercase tracking-widest ${language === lang.code ? "bg-orange-500 text-white shadow-sm" : "text-gray-400 hover:text-gray-900"}`} onClick={() => {
                    setLanguage(lang.code);
                    hapticService.batec();
                  }}>
                    {lang.label}
                  </button>
                ))}
            </div>

            <div className="flex flex-col items-center pt-2 pb-6 md:pb-12 md:hidden">
              <BrandLogo className='w-[280px] max-w-[80vw] h-auto object-contain mb-8 text-gray-900' />

              <div className='w-full bg-orange-50 border border-orange-200 rounded-2xl p-5 flex gap-5 items-start shadow-sm mt-4'>
                 <div className='w-16 h-16 shrink-0 rounded-full bg-orange-100 flex items-center justify-center shadow-inner overflow-hidden border border-white'>
                     <img src="/uploads/avatars/iaia_comic_matriarch.png" alt="IAIA" className="w-[110%] h-[110%] object-cover object-top" />
                 </div>
                 <div className="flex-1 pt-1">
                     <h3 className='font-black text-orange-600 text-base mb-1.5 uppercase tracking-tight m-0'>IAIA Guia</h3>
                     <p className="text-gray-900 text-[15px] leading-snug font-medium m-0">
                       {step === "identity" ? t('auth.iaia_guide_identity') : step === "town" ? t('auth.iaia_guide_town') : step === "connection" ? t('auth.iaia_guide_connection') : step === "verify" ? t('auth.iaia_guide_verify') : t('auth.iaia_guide_welcome')}
                     </p>
                 </div>
              </div>
            </div>

          {error && <div className="text-red-500 bg-red-50 border border-red-200 rounded-xl p-4 font-bold text-sm mb-6 text-center">{error}</div>}

          {step !== "welcome" && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-4 items-start shadow-sm mx-1">
                <div className="w-10 h-10 shrink-0 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a9 9 0 0 0 -9 9v7h18v-7a9 9 0 0 0 -9 -9z" /><path d="M12 3v18" /><path d="M9 14h6" /><path d="M9 10h6" /><path d="M14 21v-4" /><path d="M10 21v-4" /></svg>
                </div>
                <div className="flex-1 pt-0.5">
                  <h4 className="font-black text-blue-700 text-[13px] uppercase tracking-widest mb-1 m-0">Mode Foraster en construcció</h4>
                  <p className="text-blue-800 text-[13px] font-medium leading-relaxed m-0">
                    Et trobes en una versió de proves. Estem preparant el <strong>Mode Foraster</strong>, així que <strong>no cal registrar-se encara</strong>.
                    <br />Mentrestant, ja pots llegir la història i la cultura que estem recopilant per al llibre:
                  </p>
                  <div className="mt-3">
                    <Link to="/el-projecte" className='inline-flex items-center gap-1.5 bg-orange-600 text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-orange-700 transition-colors shadow-sm'>
                      Llegir "El Projecte" <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
          )}

          {/* STEP 1: IDENTITY */}
          {step === "identity" && (
            <div className="flex flex-col gap-6 shrink-0 pb-8">
              <button onClick={signInWithGoogle} disabled={loading} type="button" className='w-full h-16 bg-white border-2 border-gray-200 rounded-[20px] flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors shadow-sm'>
                  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span className="font-black uppercase tracking-widest text-gray-900 text-base">Connectar amb Google</span>
              </button>
            </div>
          )}

          {/* STEP 2: TOWN */}
          {step === "town" && (
            <div className="flex flex-col gap-6 flex-1">
              <div className="space-y-3">
                <label htmlFor="town-picker-reg" className="text-sm font-black uppercase tracking-widest text-gray-500 ml-1">
                  A quin poble pertanys?
                </label>
                <button type="button" onClick={() => setShowTownPicker(true)} className='w-full flex items-center justify-between px-5 py-5 bg-white border-2 border-gray-200 rounded-[20px] hover:border-orange-500 hover:bg-orange-50 transition-colors shadow-sm'>
                  <div className="flex items-center gap-4">
                    <div className='w-12 h-12 bg-white shadow-sm border border-gray-200 rounded-2xl flex items-center justify-center shrink-0'>
                      <MapPin size={26} className='text-orange-500' />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-xl font-bold text-gray-900">
                        {selectedTown ? selectedTown.name : "Tria el teu poble..."}
                      </span>
                    </div>
                  </div>
                  <div className='bg-gray-100 p-3 rounded-2xl text-gray-400'>
                    <ChevronRight size={24} />
                  </div>
                </button>
              </div>

              <div className="pt-4 flex gap-3">
                <button className='h-16 px-6 rounded-[20px] font-bold text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 transition-colors' onClick={() => setStep("identity")}>
                  Enrere
                </button>
                <button className={`flex-1 h-16 rounded-[20px] flex items-center justify-center gap-2 text-white font-black uppercase tracking-widest transition-colors ${!selectedTown ? "bg-gray-300 cursor-not-allowed" : "bg-sky-500 hover:bg-sky-600 shadow-sm"}`} disabled={!selectedTown} onClick={() => {
                  hapticService.batec();
                  setStep("connection");
                }}>
                  <span className="text-lg pt-1">Connectar Poble</span>
                  <CheckCircle2 size={22} className="mt-0.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CONNECTION */}
          {step === "connection" && (
            <form onSubmit={handleRegister} className="flex flex-col gap-6 flex-1">
              <div className="space-y-3">
                <label htmlFor="reg-phone" className="text-sm font-black uppercase tracking-widest text-gray-500 ml-1">Telèfon Mòbil per Connectar</label>
                <div className="relative flex items-center">
                  <div className="absolute left-5 font-bold text-gray-400 select-none text-xl">🇪🇸 +34</div>
                  <input id="reg-phone" name="phone" type="tel" placeholder="600 000 000" value={phone} onChange={e => {
                    let val = e.target.value.replace(/[^0-9+]/g, "");
                    if (val.startsWith("+34")) val = val.substring(3);
                    val = val.replace(/[^0-9]/g, "");
                    if (val.startsWith("34") && val.length === 11) val = val.substring(2);
                    setPhone(val);
                    if (val.length === 9) hapticService.batec();
                  }} autoComplete="tel" inputMode="tel" required className={`w-full h-16 bg-white border-2 rounded-[20px] pl-24 pr-5 text-gray-900 font-bold text-2xl outline-none transition-colors placeholder:text-gray-400 tracking-wide ${phone && !isPhoneValid ? "border-red-400 focus:border-red-500 bg-red-50" : isPhoneValid ? "border-green-500 focus:border-green-600 bg-green-50" : "border-gray-200 focus:border-orange-500 focus:bg-orange-50"}`} />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                  {mode === "register" && (
                    <button type="button" className='h-16 px-6 rounded-[20px] font-bold text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 transition-colors' onClick={() => setStep("town")}>
                      Enrere
                    </button>
                  )}
                  <button type="submit" className={`flex-1 h-16 rounded-[20px] flex items-center justify-center gap-2 text-white font-black uppercase tracking-widest transition-colors ${!isPhoneValid ? "bg-gray-300 cursor-not-allowed opacity-50" : "bg-orange-500 hover:bg-orange-600 shadow-sm"}`} disabled={loading || !isPhoneValid}>
                    {loading ? <Loader2 size={28} className="animate-spin text-white" /> : (
                      <>
                        <span className="text-lg pt-1">Connectar SMS</span>
                        <Zap size={20} fill="currentColor" className="mt-0.5" />
                      </>
                    )}
                  </button>
              </div>
            </form>
          )}

          {/* STEP 4: VERIFY */}
          {step === "verify" && (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6 flex-1">
              <div className="space-y-4">
                <div className="text-center space-y-1 mb-4">
                   <h2 className="text-3xl font-black text-gray-900 m-0">Has rebut un SMS?</h2>
                   <p className="text-gray-500 font-medium text-base m-0">Hem enviat un codi al <strong className="text-gray-900 tracking-wide text-lg">{phone}</strong></p>
                </div>

                <input id="otp-input-reg" name="otp_code" type="text" placeholder="123456" value={otp} onChange={e => setOtp(e.target.value)} autoComplete="one-time-code" inputMode="numeric" maxLength={6} required className='w-full h-20 bg-white border-2 border-gray-200 focus:border-orange-500 focus:bg-orange-50 rounded-[20px] text-center text-4xl font-black text-gray-900 tracking-[0.5em] outline-none transition-colors placeholder:text-gray-300 shadow-sm' />
              </div>

              <div className="mt-auto pt-6 space-y-4">
                <button type="submit" className={`w-full h-16 rounded-[20px] flex items-center justify-center gap-2 text-white font-black uppercase tracking-widest transition-colors ${otp.length < 6 || loading ? "bg-gray-300 opacity-50 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600 shadow-sm"}`} disabled={otp.length < 6 || loading} onClick={() => hapticService.batec()}>
                  {loading ? <Loader2 size={28} className="animate-spin text-white" /> : <span className="text-lg pt-1">CONFIRMAR ENTRADA</span>}
                </button>

                <div className="text-center pt-4 pb-2 space-y-4">
                  <button type="button" className='text-base font-bold text-gray-500 hover:text-gray-900 underline underline-offset-4 decoration-2 decoration-gray-300 transition-colors' disabled={resendCountdown > 0} onClick={e => {
                    if (resendCountdown === 0) handleRegister(e);
                  }}>
                    {resendCountdown > 0 ? `Reenviar en ${resendCountdown}s` : "No reps cap missatge? Reenviar codi."}
                  </button>
                  
                  <button type="button" onClick={() => setStep("connection")} className='block w-max mx-auto text-sm font-black text-gray-500 hover:text-orange-600 uppercase tracking-widest transition-colors bg-white border border-gray-200 px-4 py-2 rounded-full'>
                    Canviar Telèfon
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* STEP 5: WELCOME SUCCESS */}
          {step === "welcome" && (
            <div className="text-center py-12 space-y-6 flex-1 flex flex-col items-center justify-center">
              <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <CheckCircle2 size={64} className="text-green-500" strokeWidth={3} />
              </div>
              <h2 className="text-4xl font-black uppercase text-gray-900 italic tracking-tight relative -left-1 m-0">
                CONNEXIÓ
                <br />ESTABLERTA
              </h2>
              <p className="font-bold text-gray-500 text-xl text-center px-4 m-0">
                "Ja eres un dels nostres. Cor de poble, bategat digital. Ens veiem a la plaça!" <br />
                <span className="text-sm mt-2 block">- L'IAIA 👵✨</span>
              </p>
            </div>
          )}

          <div className="mt-8">
            <div className="text-center text-xs text-gray-400 mb-6 font-medium leading-relaxed px-4">
              En bategar, acceptes que Sóc de Poble és un experiment de sobirania digital.
              <br />
              <Link to="/legal/aviso-legal" className="underline hover:text-gray-900 transition-colors mt-1 inline-block">Avisos Legals</Link>
            </div>
            
            <div className='text-center text-lg bg-white rounded-2xl p-4 border border-gray-200'>
              <span className="text-gray-500 font-medium">Ja tens compte?</span>{" "}
              <Link to="/login" className='text-orange-600 font-black hover:underline tracking-wide ml-1'>
                Entra ara
              </Link>
            </div>

            <div className="text-center mt-6 text-gray-400 font-bold text-xs uppercase tracking-widest">
              {APP_VERSION}
            </div>
          </div>

          <TownSelectorModal isOpen={showTownPicker} onClose={() => setShowTownPicker(false)} onSelect={town => {
            setSelectedTown(town);
            sessionStorage.setItem('register_selected_town', JSON.stringify(town));
            setShowTownPicker(false);
          }} />

          </div>
        </div>
      </div>
  );
};
export default Register;