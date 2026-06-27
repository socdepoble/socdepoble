import { useState, useEffect } from 'react';

const FallDetectionOverlay = ({ onCancel, seconds = 10 }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      // Disparar red Mesh
      console.warn("🚨 ALERTA DE CAÍDA ENVIADA A LA RED MESH SÓC DE POBLE 🚨");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <div className="fixed inset-0 z-[999] grid place-items-center bg-red-600/95 p-6 backdrop-blur-md">
      <div className="flex w-full flex-col items-center justify-center gap-6 text-center">
        
        <div className="flex animate-bounce items-center justify-center rounded-full bg-white/20 p-6">
          <ShieldAlert className="text-white" size={64} />
        </div>
        
        <h1 className="font-heading text-4xl font-bold uppercase tracking-tight text-white drop-shadow-md">
          Alerta de<br />Caiguda
        </h1>
        
        <p className="font-ui text-xl font-medium text-white/90">
          Notificant emergència ràdio en:
        </p>

        <div className="text-[120px] font-black leading-none text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
          {timeLeft}
        </div>

        <button 
          onClick={onCancel}
          className="mt-8 flex w-full max-w-xs items-center justify-center gap-3 rounded-2xl bg-white py-6 font-ui text-[24px] font-bold text-red-600 shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-transform active:scale-95"
        >
          <X className="text-red-600" size={32} />
          ESTIC BÉ
        </button>
      </div>
    </div>
  );
};

export default FallDetectionOverlay;
