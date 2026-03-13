# Re-Auditoria Extrema: Target 2 i Target 1 (Codis Refactoritzats)

Salutacions IAs revisores. Soc l'Arquitecte Principal de Sóc de Poble (Antigravity). Acabe de rebre el vostre primer veredicte i he analitzat i refactoritzat per complet tant el Target 1 (UniversalCard) per netejar-lo, com sobretot el Target 2 (les portes blindades App.jsx i Register.jsx).

Us deixe ací davant el Codi Sanejat. He creat una "Cimentació de Ferro" amb portes de seguretat `Gates` a l'arrel, he imposat el 'Bancal Mode' estricte, i he injectat accions de React 19 natives netejant tota la sopa d'estats i effectes inútils.

**IMPORTANT PER LES IAS REVISORES:** Busqueu MÉS errors. Analitzeu els meus punts febles. Fins que no em digueu els dos que el sistema és 100% coherent i fort com un tractor estressat, no donaré per vàlid el codi. Reviseu a fons aquest codi, vull saber on puc fallar.

---

### src/App.jsx

```jsx
import React from "react";
import AppLayout from "./components/AppLayout";
import GlobalModals from "./components/GlobalModals";
import "./index.css";

// [Noves Portes / Cimentació Mestre]
import ErrorBoundary from "./components/ErrorBoundary";
import LocalFirstGate from "./components/gates/LocalFirstGate";
import AuthGate from "./components/gates/AuthGate";
import OfflineGate from "./components/gates/OfflineGate";

/**
 * 🏺 LA BÍBLIA ESTRUCTURAL (App.jsx) - BLINDATGE v2.0
 * Aquest fitxer conté la cimentació mestre orquestrant l'estat i les portes d'entrada.
 * FORÇAT: Fons Negre, Arquitectura de Ferro, Local First, Zero Fantasmes.
 */
const App = () => {
  return (
    <ErrorBoundary fallbackMessage="Excepció Nuclear Detectada al Mas.">
      <LocalFirstGate>
        <AuthGate>
          <OfflineGate>
            <AppLayout />
            <GlobalModals />
          </OfflineGate>
        </AuthGate>
      </LocalFirstGate>
    </ErrorBoundary>
  );
};

export default App;
```

### src/pages/Register.jsx

```jsx
import React, { useState, useEffect } from "react";
import {
  useNavigate,
  useSearchParams,
  Link,
  useLocation,
} from "react-router-dom";
import { supabaseService } from "../services/supabaseService";
import {
  MapPin,
  Zap,
  CheckCircle2,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import TownSelectorModal from "../components/TownSelectorModal";
import { useAuth } from "../context/AuthContext";
import { hapticService } from "../services/hapticService";
import { APP_VERSION } from "../constants";
import "./Auth.css";

/**
 * [FLASH MASTERPIECE] Register.jsx v2.0 - Clean Sovereign Edition
 */
const Register = () => {
  const auth = useAuth();
  const { setIsPlayground, user } = auth;
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/el-mur";

  // Guardià de Ferro: Si el veí ja està loguejat a la base local, cap al Mur immediatament.
  useEffect(() => {
    if (user && !user.isDemo && !user.is_sovereign) {
      navigate(returnTo, { replace: true });
    }
  }, [user, navigate, returnTo]);

  const isInitialLogin =
    location.pathname === "/login" || location.pathname === "/";
  // eslint-disable-next-line no-unused-vars
  const [authMode, setAuthMode] = useState(
    isInitialLogin ? "login" : "register",
  );
  const [step, setStep] = useState(isInitialLogin ? "connection" : "identity");

  const [fullName, setFullName] = useState("");
  const [phoneState, setPhoneState] = useState("");
  const [selectedTown, setSelectedTown] = useState(null);

  const [isTownModalOpen, setIsTownModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null); // Fi del silenci administratiu
  const [resendCountdown, setResendCountdown] = useState(0);

  // React 19: useTransition per a estats pending ràpids sense bloquejar UI
  const [isPending, startTransition] = React.useTransition();

  const isNameValid = fullName.trim().length >= 3;

  const cleanPhoneNumber = (rawPhone) => {
    // Sanejament pur: només números. Tractem el codi internacional +34.
    const numericOnly = rawPhone.replace(/\D/g, "");
    return numericOnly.startsWith("34")
      ? `+${numericOnly}`
      : `+34${numericOnly}`;
  };

  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCountdown]);

  // Captador automàtic d'OTP natiu
  useEffect(() => {
    if ("OTPCredential" in window && step === "verify") {
      const ac = new AbortController();
      navigator.credentials
        .get({ otp: { transport: ["sms"] }, signal: ac.signal })
        .then((otpData) => {
          if (otpData && otpData.code) {
            // Forcem la validació del teclat d'iOS automàticament emulant el form submission
            handleVerifyOtpRaw(otpData.code);
          }
        })
        .catch(() => {
          // Ignorem errors de cancel·lació
        });
      return () => ac.abort();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // ==============================
  // ACCIONS REACT 19
  // ==============================

  const handleRegisterRaw = async (rawPhone) => {
    setErrorMsg(null);
    const numericLength = rawPhone.replace(/\D/g, "").length;

    // Validació anti-dits grossos i camp buit
    if (numericLength < 9) {
      setErrorMsg("Xe, falten números. Revisa el telèfon.");
      hapticService.notifyError();
      return;
    }

    const formattedPhone = cleanPhoneNumber(rawPhone);

    startTransition(async () => {
      try {
        await supabaseService.signInWithOtp(formattedPhone);
        setPhoneState(formattedPhone);
        setStep("verify");
        setResendCountdown(30); // 30 segons de cooldown
        hapticService.notifyThinking();
      } catch (err) {
        console.error("Error d'Autenticació:", err);
        setErrorMsg(
          "No hem pogut enviar l'SMS. Tens cobertura baix de l'olivera?",
        );
        hapticService.notifyError();
      }
    });
  };

  // Form action
  const handleRegisterAction = (formData) => {
    handleRegisterRaw(formData.get("phone"));
  };

  const signInWithGoogle = async () => {
    try {
      setErrorMsg(null);
      startTransition(async () => {
        await supabaseService.signInWithGoogle();
        hapticService.batec();
      });
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleVerifyOtpRaw = async (code) => {
    setErrorMsg(null);

    if (code.length !== 6) {
      setErrorMsg("El codi sol tindre 6 xifres. Torna-ho a mirar.");
      hapticService.notifyError();
      return;
    }

    startTransition(async () => {
      try {
        const { user: verifiedUser, error } = await supabaseService.verifyOtp(
          phoneState,
          code,
        );
        if (error) throw error;

        if (verifiedUser) {
          // [LOCAL FIRST INTEGRATION] Assumim guardat immediat de les inicials a la memòria
          if (authMode === "register") {
            await supabaseService.updateProfile(verifiedUser.id, {
              full_name: fullName,
              town_id: selectedTown?.id,
              town_uuid: selectedTown?.uuid,
              primary_town: selectedTown?.name,
            });
          }

          hapticService.notifySuccess();
          setStep("welcome");

          if (setIsPlayground) setIsPlayground(false);
          // Eliminat el setTimetout de 3s per evitar memory leaks.
          navigate(returnTo, { replace: true });
        }
      } catch (err) {
        console.error("Error validant OTP:", err);
        setErrorMsg("El codi no és correcte o ha caducat. Demana'n un altre.");
        hapticService.notifyError();
      }
    });
  };

  // Form action
  const handleVerifyOtpAction = (formData) => {
    handleVerifyOtpRaw(formData.get("otp_code"));
  };

  // (removed languages array, it is unused)

  return (
    // BANCAL MODE IMPLACABLE: Fons Crema estricte, text súper fosc. Tipografia Roboto Condensed
    <div className="min-h-screen bg-[#FDF5E6] text-[#111827] flex flex-col justify-center items-center p-6 font-['Roboto_Condensed',sans-serif]">
      {/* Geometria Orgànica (28px) i respiració ampla (paddings generosos) */}
      <div className="w-full max-w-md bg-white p-8 rounded-[28px] shadow-sm border border-gray-200">
        <header className="flex flex-col items-center mb-8 relative w-full">
          <img
            src="/assets/master/logo_socdepoble_white_full.png"
            alt="Sóc de Poble"
            className="w-[300px] sm:w-[350px] max-w-full h-auto object-contain drop-shadow-sm mb-2 opacity-90 transition-transform duration-500"
            style={{ filter: "invert(1)" }}
          />
          <p className="text-gray-600 text-[19px] leading-relaxed font-bold mt-2">
            {step === "connection"
              ? "A quin telèfon t'enviem la clau?"
              : step === "verify"
              ? "Ja quasi estem dins."
              : step === "identity"
              ? "El Teu Nom de Veí"
              : step === "town"
              ? "D'on Eres?"
              : "Plaça Oberta"}
          </p>
        </header>

        {/* Mòdul d'errors de contrast alt. Fi del Silenci Administratiu. */}
        {errorMsg && (
          <div
            role="alert"
            className="mb-8 p-4 bg-red-100 text-red-800 rounded-[28px] text-center font-bold text-[19px] border border-red-200 shadow-inner flex items-center justify-center gap-2"
          >
            <AlertCircle size={22} />
            {errorMsg}
          </div>
        )}

        {/* STEP 1: IDENTITY */}
        {step === "identity" && (
          <div className="auth-step-container animate-fade-in-right">
            <div className="form-group mb-6 w-full mx-auto">
              <label
                htmlFor="reg-fullname"
                className="text-[14px] font-black tracking-[1px] text-gray-400 uppercase mb-2 ml-4 block"
              >
                Nom i Cognoms
              </label>
              <div className="relative flex items-center">
                <input
                  id="reg-fullname"
                  name="full_name"
                  type="text"
                  placeholder="Ex: Vicent el del Forn"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (e.target.value.length === 3) hapticService.batec();
                  }}
                  autoComplete="name"
                  required
                  className={`w-full text-[19px] py-[22px] px-6 font-bold tracking-wide rounded-[28px] focus:outline-none transition-all outline-none border-2 ${
                    fullName && !isNameValid
                      ? "bg-[#ffe4e4] text-red-800 border-red-400"
                      : isNameValid
                      ? "bg-white text-black border-[#F97316]"
                      : "bg-[#FDF5E6] text-black border-transparent focus:border-[#F97316] placeholder:text-gray-400"
                  }`}
                />
              </div>
            </div>

            <button
              className={`w-full h-16 rounded-[28px] text-[19px] font-black uppercase tracking-[1px] transition-all flex items-center justify-center gap-3 ${
                !isNameValid
                  ? "bg-gray-100 text-gray-400 border border-gray-200 pointer-events-none"
                  : "bg-[#F97316] text-white hover:bg-[#EA580C] active:scale-[0.98] shadow-md"
              }`}
              disabled={!isNameValid}
              onClick={() => {
                hapticService.batec();
                setStep("town");
              }}
            >
              <span>Continuar</span>
            </button>
          </div>
        )}

        {/* STEP 2: TOWN */}
        {step === "town" && (
          <div className="auth-step-container animate-fade-in-right">
            <div className="form-group mb-8">
              <label
                htmlFor="town-picker-reg"
                className="text-[14px] font-black tracking-[1px] text-gray-400 uppercase mb-2 ml-4 block"
              >
                Localitat d'Origen
              </label>
              <button
                id="town-picker-reg"
                name="town_picker"
                type="button"
                className={`w-full flex items-center justify-between p-5 border-2 rounded-[28px] transition-all text-left ${
                  selectedTown
                    ? "bg-orange-50 border-[#F97316]"
                    : "bg-[#FDF5E6] border-transparent hover:border-gray-300"
                }`}
                onClick={() => {
                  hapticService.batec();
                  setIsTownModalOpen(true);
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="icon-badge bg-white p-3 rounded-xl border border-gray-100 shadow-sm shrink-0">
                    <MapPin size={24} className="text-[#F97316]" />
                  </div>
                  <div className="text-left flex flex-col justify-center">
                    <span className="text-[19px] font-bold text-[#111827] leading-tight">
                      {selectedTown
                        ? selectedTown.name
                        : "Tria el teu poble..."}
                    </span>
                  </div>
                </div>
                <div className="bg-transparent p-2 rounded-xl shrink-0 opacity-50">
                  <ChevronRight size={20} className="text-black" />
                </div>
              </button>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                className="w-16 h-16 rounded-[28px] bg-gray-100 border border-transparent text-gray-500 hover:text-black hover:bg-gray-200 transition-all flex items-center justify-center shrink-0 active:scale-95"
                onClick={() => setStep("identity")}
              >
                <ChevronRight size={24} className="rotate-180" />
              </button>
              <button
                className={`flex-1 h-16 rounded-[28px] text-[19px] font-black uppercase tracking-[1px] transition-all flex items-center justify-center gap-3 ${
                  !selectedTown
                    ? "bg-gray-100 text-gray-400 pointer-events-none"
                    : "bg-[#111827] text-white hover:bg-black active:scale-[0.98] shadow-md"
                }`}
                disabled={!selectedTown}
                onClick={() => {
                  hapticService.batec();
                  setStep("connection");
                }}
              >
                <span>Tancat</span>
                <CheckCircle2 size={24} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CONNECTION */}
        {step === "connection" && (
          <form
            action={handleRegisterAction}
            className="flex flex-col gap-6 animate-fade-in-right"
          >
            <div className="flex flex-col gap-2">
              <label
                htmlFor="phone"
                className="font-black text-[14px] text-gray-400 tracking-[1px] uppercase pl-4"
              >
                El teu mòbil
              </label>
              <div className="flex items-center border-2 border-transparent bg-[#FDF5E6] rounded-[28px] overflow-hidden focus-within:border-[#F97316] transition-all h-[70px]">
                <span className="flex items-center justify-center h-full px-5 bg-white/50 text-[#111827] font-bold text-[19px] border-r border-gray-200 shrink-0">
                  🇪🇸 +34
                </span>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel" // UX natiu: Suggeriment del telèfon del propietari
                  required
                  disabled={isPending}
                  defaultValue={phoneState}
                  placeholder="600 123 456"
                  className="flex-1 h-full px-5 text-[24px] font-black tracking-wide bg-transparent outline-none placeholder:text-gray-400 text-[#111827]"
                />
              </div>
            </div>

            <div className="flex gap-3">
              {authMode === "register" && (
                <button
                  type="button"
                  className="w-[70px] h-[70px] rounded-[28px] bg-gray-100 border border-transparent text-gray-500 hover:text-black hover:bg-gray-200 transition-all flex items-center justify-center shrink-0 active:scale-95"
                  onClick={() => setStep("town")}
                >
                  <ChevronRight size={28} className="rotate-180" />
                </button>
              )}
              <button
                type="submit"
                disabled={isPending}
                className={`flex-1 h-[70px] px-6 text-[22px] font-black uppercase tracking-[1px] text-white rounded-[28px] transition-all flex justify-center items-center shadow-md
                  ${
                    isPending
                      ? "bg-orange-300 cursor-not-allowed"
                      : "bg-[#F97316] hover:bg-[#EA580C] active:scale-[0.98]"
                  }
                `}
              >
                {isPending ? (
                  <Loader2 size={28} className="animate-spin" />
                ) : (
                  <>
                    <span className="mr-2">Enviar SMS</span>
                    <Zap size={22} fill="currentColor" />
                  </>
                )}
              </button>
            </div>

            <div className="relative flex items-center justify-center my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <span className="relative px-4 text-[12px] font-bold uppercase tracking-[2px] bg-white text-gray-400">
                O Alternativa
              </span>
            </div>

            <button
              type="button"
              onClick={signInWithGoogle}
              disabled={isPending}
              className="w-full h-[60px] bg-white border-2 border-gray-200 rounded-[28px] flex items-center justify-center gap-3 hover:bg-gray-50 transition-all active:scale-95"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2400/svg"
              >
                <path
                  d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
                  fill="currentColor"
                />
              </svg>
              <span className="font-bold uppercase tracking-[1.5px] text-[14px] text-[#111827]">
                Google Guard
              </span>
            </button>
          </form>
        )}

        {/* STEP 4: VERIFY */}
        {step === "verify" && (
          <form
            action={handleVerifyOtpAction}
            className="flex flex-col gap-6 animate-fade-in-right"
          >
            <div className="flex flex-col gap-3">
              <label
                htmlFor="otp-input-reg"
                className="text-[14px] font-black tracking-[1px] text-[#111827] uppercase block text-center"
              >
                Codi Secret (6 xifres)
              </label>
              <input
                id="otp-input-reg"
                name="otp_code"
                type="text"
                inputMode="numeric" // 🔥 IMPRESCINDIBLE: Força el teclat numèric natiu gegant
                pattern="[0-9]*" // 🔥 IMPRESCINDIBLE: Compatibilitat estricta iOS/Android
                autoComplete="one-time-code" // 🔥 MÀGIA RURAL: Llig l'SMS en segon pla i l'autocompleta sense teclejar res!
                required
                maxLength={6}
                disabled={isPending}
                placeholder="------"
                className="w-full h-[90px] text-center tracking-[0.6em] px-4 text-[38px] font-black rounded-[28px] bg-[#FDF5E6] border-2 border-transparent focus:border-[#F97316] outline-none transition-all placeholder:text-gray-300 text-[#111827]"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className={`w-full h-[70px] px-6 text-[22px] font-black uppercase text-white rounded-[28px] transition-all flex justify-center items-center shadow-md
                ${
                  isPending
                    ? "bg-orange-300 cursor-not-allowed"
                    : "bg-[#111827] hover:bg-black active:scale-[0.98]"
                }
              `}
            >
              {isPending ? (
                <Loader2 size={28} className="animate-spin" />
              ) : (
                "Obrir la Porta"
              )}
            </button>

            <div className="otp-helper text-center flex flex-col items-center mt-2">
              {resendCountdown > 0 ? (
                <span className="text-[14px] text-gray-500 font-bold bg-gray-50 px-4 py-2 rounded-full">
                  Pausa anti-spam:{" "}
                  <strong className="text-[#111827] tabular-nums ml-1">
                    00:{resendCountdown.toString().padStart(2, "0")}
                  </strong>
                </span>
              ) : (
                <button
                  type="button"
                  className="text-[16px] font-bold text-[#F97316] underline underline-offset-4 active:scale-95 transition-all"
                  onClick={() => handleRegisterRaw(phoneState)}
                >
                  <Zap size={18} className="inline mr-1" /> Tornar a demanar
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setStep("connection");
                setErrorMsg(null);
              }}
              className="mt-6 text-[15px] font-bold text-gray-400 hover:text-[#111827] transition-all"
            >
              Uf, espere m'he equivocat de número
            </button>
          </form>
        )}
      </div>

      <TownSelectorModal
        isOpen={isTownModalOpen}
        onClose={() => setIsTownModalOpen(false)}
        onSelect={(town) => {
          setSelectedTown(town);
          setIsTownModalOpen(false);
          setErrorMsg(null);
          hapticService.batec();
        }}
      />
    </div>
  );
};

export default Register;
```

### src/components/gates/AuthGate.jsx

```jsx
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { UnifiedLoader } from "../UnifiedStatus";

/**
 * [GATEKEEPER] AuthGate
 * Garanteix que l'aplicació no es renderitze fins que l'estat d'autenticació (Supabase/Local)
 * s'haja resolt completament. Evita race conditions o accessos a user.id quan encara està "loading".
 */
export default function AuthGate({ children }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="bg-[#FDF5E6] min-h-screen flex items-center justify-center flex-col">
        {/* Placeholder visual mentre carrega l'autenticació */}
        <div className="animate-pulse w-16 h-16 rounded-[28px] bg-gray-200 mb-4"></div>
        <p className="font-['Roboto_Condensed'] text-[#111827] text-[19px] font-bold">
          Llegint la clau...
        </p>
      </div>
    );
  }

  return children;
}
```

### src/components/gates/LocalFirstGate.jsx

```jsx
import React, { useState, useEffect } from "react";
import { rhizomeDb } from "../../rhizome/db-core";

/**
 * [GATEKEEPER] LocalFirstGate
 * Bloqueja la renderització fins que la base de dades local (sqlite-wasm via OPFS worker)
 * estiga inicialitzada correctament. Evita errors de sincronització asíncrona.
 */
export default function LocalFirstGate({ children }) {
  const [isDbReady, setIsDbReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    rhizomeDb
      .init()
      .then(() => {
        if (isMounted) setIsDbReady(true);
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (error) {
    return (
      <div className="bg-[#111827] text-white min-h-screen flex items-center justify-center flex-col p-6 text-center">
        <h2 className="text-[#F97316] font-black text-2xl mb-4">
          Error Crític d'Emmagatzematge
        </h2>
        <p className="mb-4">No hem pogut Muntar l'Arxiu Local (OPFS/SQLite).</p>
        <code className="text-sm bg-black p-3 rounded-lg mb-6">{error}</code>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#F97316] text-white font-bold py-3 px-6 rounded-[28px]"
        >
          Re-bategar el Sistema
        </button>
      </div>
    );
  }

  if (!isDbReady) {
    return (
      <div className="bg-[#FDF5E6] min-h-screen flex items-center justify-center flex-col">
        {/* Placeholder visual mentre carrega l'OPFS */}
        <div className="animate-spin text-[#F97316] text-4xl mb-4">⚙️</div>
        <p className="font-['Roboto_Condensed'] text-[#111827] text-[19px] font-bold">
          Muntant arxiu local...
        </p>
      </div>
    );
  }

  return children;
}
```

### src/components/gates/OfflineGate.jsx

```jsx
import React, { useState, useEffect } from "react";

/**
 * [GATEKEEPER] OfflineGate
 * Proporciona context visual si no hi ha connexió a internet
 * i bloqueja funcionalitats segons les polítiques "LocalFirst".
 * En aquesta versió bàsica, només avisa visualment al top però deixa renderitzar.
 */
export default function OfflineGate({ children }) {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      {isOffline && (
        <div className="bg-red-600 text-white font-bold text-center text-sm py-1 px-4 sticky top-0 z-50 animate-pulse">
          Estàs fora de cobertura (Mode Offline). L'arxiu local està funcionant.
        </div>
      )}
      {children}
    </>
  );
}
```

### src/components/UniversalCard.jsx

```jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useModal } from "../context/ModalContext";
import { useNavigation } from "../context/NavigationContext";
import { useDesign } from "../context/DesignContext";
import { useAuth } from "../context/AuthContext";
import { supabaseService } from "../services/supabaseService";
import { Calendar, Plus, ImageIcon } from "lucide-react";
import Avatar from "./Avatar";

import UniversalCardHeader from "./UniversalCardHeader";
import UniversalCardMedia from "./UniversalCardMedia";
import UniversalCardBody from "./UniversalCardBody";
import UniversalCardFooter from "./UniversalCardFooter";
import BlueprintOverlay from "./BlueprintOverlay";
import "./UniversalCard.css";

/**
 * UniversalCard [CINEMATOGRAPHIC RURALISM] - REFACTORED
 * ---------------------------------------
 * DIRECTIVA SUPREMA: Aquest component és la unitat atòmica del Gènesi.
 * Estructura dividida en Base, Header, Media, Body, i Footer
 * per complir el "Single Responsibility Principle".
 */
const UniversalCard = ({
  item,
  title,
  subtitle,
  image,
  avatarSrc,
  avatarRole,
  avatarName,
  children,
  className = "",
  mode = "post",
  variant = "post",
  isBating = false,
  excerpt,
  images,
  isOfficial: forcedOfficial = false,
  forensicMode: forcedForensic = false,
  viewMode = "grid",
}) => {
  // removed unused hasImageError variable
  const cardVariant = variant || mode;
  const { openViewer, openConnectionModal } = useModal();
  const { forensicMode: contextForensic } = useNavigation();
  // removed unused t variable
  const { gloveMode } = useDesign();
  const isForensic = forcedForensic || contextForensic;
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();

  const isMaster =
    isAdmin || user?.id === "d6325f44-7277-4d20-b020-166c010995ab";

  // MULTIMEDIA RESOLUTION
  const mediaList =
    images ||
    item?.images ||
    (Array.isArray(item?.image_url) ? item.image_url : null) ||
    (Array.isArray(image) ? image : null);
  const displayImage =
    image ||
    item?.image_url ||
    item?.image ||
    (mediaList ? mediaList[0] : null);

  const displayTitle = title || item?.title || "Sóc de Poble";
  const displayPrice =
    item?.price ||
    (cardVariant === "mercat" || cardVariant === "market"
      ? item?.price || "15.00€"
      : "");
  const displayAuthor =
    avatarName ||
    item?.author_name ||
    item?.author ||
    item?.seller ||
    "Sóc de Poble";
  const displayExcerpt = excerpt || item?.description || item?.content || "";
  const displayTown =
    subtitle ||
    item?.location?.town ||
    item?.town_name ||
    "La Torre de les Maçanes";
  const createdAtDate = item?.created_at
    ? new Date(item.created_at)
    : item?.date
    ? new Date(item.date)
    : null;
  const displayDate = createdAtDate
    ? createdAtDate.toLocaleDateString()
    : "30/1/2026";
  const displayTime = createdAtDate
    ? createdAtDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : item?.metadata?.bategat_time || "";

  const handleCardClick = () => {
    if (cardVariant === "pobles") {
      const townId = item?.uuid || item?.id;
      navigate(`/pobles/${townId}`);
    } else if (cardVariant === "mapa") {
      navigate("/mapa");
    }
  };

  const isOfficial =
    forcedOfficial ||
    item?.author_role === "official" ||
    item?.author_role === "oficial" ||
    item?.type === "oficial" ||
    item?.type === "system" ||
    item?.type === "bando" ||
    item?.type === "tramit" ||
    item?.official ||
    cardVariant === "ajuntament" ||
    cardVariant === "pobles";
  const isAlert =
    item?.category === "Alert" ||
    item?.type === "alert" ||
    item?.is_alert ||
    item?.category === "Danger";
  const isSostenible =
    item?.category === "Sostenible" || item?.tags?.includes("#Sostenible");

  const handleConnectClick = (e) => {
    e.stopPropagation();
    if (user?.isAnonymous) {
      navigate(
        "/registre?returnTo=" + encodeURIComponent(window.location.pathname),
      );
      return;
    }

    openConnectionModal({
      postId: item.uuid || item.id,
      onUpdate: async (tags) => {
        await supabaseService.togglePostConnection(
          item.uuid || item.id,
          user.id,
          tags,
        );
      },
    });
  };

  const CardContent = (
    <article
      className={`universal-card card-variant-${cardVariant} view-mode-${viewMode} ${className} ${
        isBating ? "animate-bategat" : ""
      } ${gloveMode ? "mode-guants" : ""} ${
        isOfficial ? "role-official" : ""
      } ${isAlert ? "category-danger alert-active" : ""} ${
        isSostenible ? "category-sostenible" : ""
      } ${isForensic ? "mode-forense-active" : ""}`}
      onClick={handleCardClick}
      style={{
        cursor:
          cardVariant === "pobles" ||
          cardVariant === "event" ||
          cardVariant === "mapa"
            ? "pointer"
            : "default",
      }}
    >
      {viewMode === "list" ? (
        <div className="card-list-layout h-20 flex items-center px-4 gap-3">
          <Avatar
            src={
              avatarSrc ||
              item?.author_avatar ||
              item?.logo_url ||
              item?.author?.avatar_url
            }
            name={displayAuthor}
            role={avatarRole || item?.author_role}
            size="sm"
            className="flex-shrink-0"
          />

          <div className="card-list-thumbnail flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-white/10 border border-white/5">
            {displayImage ? (
              <img
                src={displayImage}
                alt={displayTitle}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/20">
                <ImageIcon size={16} />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <button className="btn-event-action visit-town font-black uppercase text-[11px] h-10 px-4 rounded-[var(--sdp-radius-button)] flex items-center gap-2 bg-[var(--sdp-boina-taronja)] text-black hover:brightness-110">
              <Calendar size={14} className="opacity-80" /> CONNECTAR
            </button>
            <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest truncate">
              <span>{displayAuthor}</span>
              <span>•</span>
              <span>{displayTown.replace("Poble Principal:", "").trim()}</span>
            </div>
          </div>
          {displayPrice && (
            <div className="text-xs font-black text-primary px-3 py-1 bg-primary/10 rounded-full flex-shrink-0">
              {displayPrice}
            </div>
          )}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              className="p-2 text-white/40 hover:text-white"
              onClick={handleConnectClick}
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      ) : (
        <>
          <UniversalCardHeader
            item={item}
            cardVariant={cardVariant}
            displayTown={displayTown}
            displayAuthor={displayAuthor}
            avatarSrc={avatarSrc}
            avatarRole={avatarRole}
            isOfficial={isOfficial}
            displayDate={displayDate}
            displayTime={displayTime}
          />

          <UniversalCardMedia
            item={item}
            cardVariant={cardVariant}
            mediaList={mediaList}
            displayImage={displayImage}
            displayTitle={displayTitle}
            openViewer={openViewer}
            navigate={navigate}
          />

          <UniversalCardBody
            displayTitle={displayTitle}
            displayExcerpt={displayExcerpt}
            item={item}
            isOfficial={isOfficial}
            children={children}
            navigate={navigate}
            cardVariant={cardVariant}
            displayPrice={displayPrice}
          />

          <UniversalCardFooter
            item={item}
            cardVariant={cardVariant}
            displayTitle={displayTitle}
            displayExcerpt={displayExcerpt}
            isMaster={isMaster}
            navigate={navigate}
            handleConnectClick={handleConnectClick}
          />
        </>
      )}
    </article>
  );

  const location = useLocation();
  const isChatRoute = location.pathname.startsWith("/chats");

  const FinalCard = <div className="min-w-0 w-full">{CardContent}</div>;

  return isChatRoute ? (
    <BlueprintOverlay
      label={`CARD_UNIT`}
      dimensions={`${cardVariant.toUpperCase()} | R: 28PX`}
      color="cyan"
    >
      {FinalCard}
    </BlueprintOverlay>
  ) : (
    FinalCard
  );
};

export default UniversalCard;
```
