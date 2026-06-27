import { useState } from 'react';
import { useFallDetection } from '../../hooks/useFallDetection';

const FallDetectionToggle = () => {
  const [isActive, setIsActive] = useState(false);
  const { fallState, hasPermission, requestPermission, sensorError, cancelAlert } = useFallDetection(isActive);

  const toggleMode = async () => {
    if (!isActive) {
      if (!hasPermission) {
        await requestPermission();
      }
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      {sensorError && (
        <div className="flex items-center gap-2 rounded-xl bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
          <AlertTriangle size={16} />
          {sensorError}
        </div>
      )}

      <button
        onClick={toggleMode}
        className={`flex w-full items-center justify-between overflow-hidden rounded-2xl p-4 transition-all duration-300 ${
          isActive 
            ? 'bg-red-600 text-white shadow-lg shadow-red-500/30 ring-2 ring-red-400' 
            : 'bg-[var(--background-color)] text-[var(--text-main)] ring-1 ring-[#00000008] dark:ring-[#ffffff0a] hover:bg-[var(--outline-color)]/20'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${isActive ? 'bg-white/20' : 'bg-red-100 dark:bg-red-900/30'}`}>
            {isActive ? <ShieldAlert size={24} className="animate-pulse" /> : <Shield size={24} className="text-red-500 dark:text-red-400" />}
          </div>
          <div className="flex flex-col text-left">
            <span className="font-heading text-[18px] font-bold tracking-tight">
              {isActive ? 'Escut Actiu' : 'Escut Desactivat'}
            </span>
            <span className={`text-[13px] font-medium ${isActive ? 'text-white/80' : 'text-[var(--text-muted)]'}`}>
              {isActive ? 'Detectant impactes severs...' : 'Prem per iniciar l\'anàlisi de caigudes'}
            </span>
          </div>
        </div>

        {/* Toggle Switch Visual */}
        <div className={`relative h-7 w-12 rounded-full transition-colors ${isActive ? 'bg-red-400' : 'bg-[var(--outline-color)]'}`}>
          <div 
            className={`absolute top-1/2 left-1 h-5 w-5 -translate-y-1/2 transform rounded-full transition-transform ${
              isActive ? 'translate-x-[20px] bg-white shadow-sm' : 'bg-white shadow-sm'
            }`} 
          />
        </div>
      </button>

      {fallState === 'alerting' && (
        <FallDetectionOverlay onCancel={cancelAlert} seconds={10} />
      )}
    </div>
  );
};

export default FallDetectionToggle;
