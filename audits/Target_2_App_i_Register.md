# Objectiu d'Auditoria 2: Autenticació i Entrada al Sistema (App i Register)

Em permet presentar-te els accessos principals de "Sóc de Poble". Aquesta és la porta blindada i el gestor d'estat del sistema sencer. T'adjunte l'`App.jsx` (L'arquitectura de ferro fonamental) i el `Register.jsx` (L'experiència d'entrada al poble).
Posa't el barret d'Auditor Principal. Sense pietat. On falla l'arquitectura? On hi ha fuites de memòria? Com està la integració Local-First i Auth?

## 1. App.jsx

```jsx
import React from "react";
import AppLayout from "./components/AppLayout";
import GlobalModals from "./components/GlobalModals";
import "./index.css";

/**
 * 🏺 LA BÍBLIA ESTRUCTURAL (App.jsx) - BLINDATGE v1.25
 * Aquest fitxer conté la cimentació mestre.
 * FORÇAT: Fons Negre, Arquitectura de Ferro, Zero Fantasmes.
 */
const App = () => {
  return (
    <React.Fragment>
      <AppLayout />
      <GlobalModals />
    </React.Fragment>
  );
};
export default App;
```

## 2. Register.jsx (Fragment representatiu - Auth & OTP)

```jsx
// Aquest és el registre (Sovereign Edition)
import React, { useState, useEffect, useCallback } from "react";
import {
  useNavigate,
  useSearchParams,
  Link,
  useLocation,
} from "react-router-dom";
import { supabaseService } from "../services/supabaseService";
import { useAuth } from "../context/AuthContext";
// ... altres imports

const Register = () => {
  const auth = useAuth();
  const { user } = auth;
  const navigate = useNavigate();
  const [step, setStep] = useState("connection");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = useCallback(
    async (e, codeToVerify = null) => {
      e?.preventDefault();
      setLoading(true);
      const code = codeToVerify || otp;
      try {
        const formattedPhone = phone.startsWith("+") ? phone : `+34${phone}`;
        const { user: verifiedUser } = await supabaseService.verifyOtp(
          formattedPhone,
          code,
        );
        if (verifiedUser) {
          setStep("welcome");
          setTimeout(() => navigate("/chats"), 3000);
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    },
    [phone, otp, navigate],
  );

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formattedPhone = phone.startsWith("+") ? phone : `+34${phone}`;
      await supabaseService.signInWithOtp(formattedPhone);
      setStep("verify");
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  // Renderer JSX (amb auth-step-container, animacions, focus-within...)
  return (
    <div className="auth-container">
      {step === "connection" && (
        <div className="auth-step-container">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button onClick={handleRegister}>Enviar SMS</button>
        </div>
      )}
      {step === "verify" && (
        <div className="auth-step-container">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyOtp}>Confirmar</button>
        </div>
      )}
    </div>
  );
};
export default Register;
```
