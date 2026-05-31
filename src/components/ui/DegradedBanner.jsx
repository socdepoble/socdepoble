import { useState, useEffect } from "react";

export default function DegradedBanner() {
  // const { status } = useContext(LocalFirstStatusContext); // Removed to fix lint
  const [isDismissed, setIsDismissed] = useState(() => {
    return sessionStorage.getItem("sp_degraded_dismissed_until_recovery") === "true";
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Només mostrar si està genuïnament offline O l'OPFS fota un pet molt greu quan NO hi ha net.
  // El mestre ha ordenat amagar-ho si hi ha internet per no mentir a l'usuari.
  if (isOnline || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem("sp_degraded_dismissed_until_recovery", "true");
  };

  return (
    <div 
      className="bg-black text-[#FF6D00] border-b-4 border-[#FF6D00] px-4 py-4 flex items-center justify-between shadow-2xl transition-all duration-300 z-50 relative rounded-none" 
    >
      <div className="flex-1 text-center pr-4 font-black uppercase tracking-wider text-[16px] leading-tight">
        Sense cobertura.<br/><span className="font-bold text-[12px] opacity-80 mt-1 block">Bategant en local</span>
      </div>
      <button 
        onClick={handleDismiss} 
        className="p-3 bg-[#FF6D00]/10 hover:bg-[#FF6D00]/30 rounded-none transition-colors border border-[#FF6D00]/50 flex-shrink-0" 
        aria-label="Tancar avís immediatament"
      >
        <X size={26} strokeWidth={3} className="text-[#FF6D00]" />
      </button>
    </div>
  );
}
