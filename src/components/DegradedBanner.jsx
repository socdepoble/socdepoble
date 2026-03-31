import React, { useContext, useState } from "react";
import { LocalFirstStatusContext } from "../context/LocalFirstStatusContext";
import { X } from "lucide-react";

export default function DegradedBanner() {
  const { status } = useContext(LocalFirstStatusContext);
  const [isDismissed, setIsDismissed] = useState(() => {
    return sessionStorage.getItem("sp_degraded_dismissed_until_recovery") === "true";
  });

  // Si no està en mode degradat o l'usuari l'ha tancat aquesta sessió, no el mostres
  if (status !== "degraded" || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem("sp_degraded_dismissed_until_recovery", "true");
  };

  return (
    <div 
      className="bg-orange-600/90 backdrop-blur-md border-b border-orange-500 text-white px-4 py-3 flex items-start sm:items-center justify-between shadow-sm transition-all duration-200" 
      style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
    >
      <div className="flex-1 text-center pr-2 text-[13px] font-bold">
        Mode Sense Connexió · Tanca les pestanyes duplicades per activar la sincronització completa.
      </div>
      <button 
        onClick={handleDismiss} 
        className="p-1 hover:bg-black/20 rounded-full transition-colors flex-shrink-0" 
        aria-label="Tancar avís"
      >
        <X size={16} />
      </button>
    </div>
  );
}
