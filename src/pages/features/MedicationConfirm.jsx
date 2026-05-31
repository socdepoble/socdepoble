import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
// import { medicationService } from '../../core/services/medicationService';
// import { useTranslation } from 'react-i18next';
const MedicationConfirm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('pending'); // pending, confirmed, snoozed
  const [countdown, setCountdown] = useState(60); // 60 seconds to auto-remind or alert

  const handleConfirm = async () => {
    setStatus('confirmed');
    // Implement ID extraction if passed in URL, for now just mocking update
    // await medicationService.confirmMedication(id);
    setTimeout(() => {
      navigate('/seguretat');
    }, 3000);
  };

  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'confirm') {
      setTimeout(() => {
        handleConfirm();
      }, 0);
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (status !== 'pending') return;
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Could trigger an alert to family members here
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  const handleSnooze = async () => {
    setStatus('snoozed');
    // await medicationService.snoozeMedication(id);
    setTimeout(() => {
      navigate('/seguretat');
    }, 2000);
  };

  if (status === 'confirmed') {
    return (
      <div className="fixed inset-0 bg-[#0a0a0a] z-50 flex flex-col items-center justify-center text-white p-6">
        <CheckCircle size={100} className="text-green-500 mb-6 drop-shadow-[0_0_20px_rgba(34,197,94,0.5)]" />
        <h1 className="text-4xl font-bold text-center tracking-tight mb-2">Pastilla Confirmada</h1>
        <p className="text-xl text-gray-400 text-center">Tornant a la seguretat...</p>
      </div>
    );
  }

  if (status === 'snoozed') {
    return (
      <div className="fixed inset-0 bg-[#0a0a0a] z-50 flex flex-col items-center justify-center text-white p-6">
        <Clock size={100} className="text-orange-500 mb-6 drop-shadow-[0_0_20px_rgba(249,115,22,0.5)]" />
        <h1 className="text-4xl font-bold text-center tracking-tight mb-2">Aplaçat 10 min</h1>
        <p className="text-xl text-gray-400 text-center">T'avisaré més tard.</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] z-50 flex flex-col justify-between text-white p-6 pb-12">
      <div className="mt-12 text-center">
        <div className="w-32 h-32 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-8 border-4 border-red-500 animate-pulse">
           <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 20.5 4 14l6.5-6.5a7.78 7.78 0 0 1 11 11z"/><path d="m14 6-6 6"/></svg>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Hora de la Pastilla!</h1>
        <p className="text-2xl text-gray-300">Tria la correcta, per favor.</p>
        
        <div className="mt-8 text-6xl font-black text-red-500 tabular-nums">
          00:{countdown.toString().padStart(2, '0')}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <button 
          onClick={handleConfirm}
          className="w-full bg-green-500 hover:bg-green-400 text-white rounded-[24px] py-6 text-2xl font-bold transition-all transform active:scale-95 shadow-[0_0_30px_rgba(34,197,94,0.3)]"
        >
          JA L'HE PRESA
        </button>
        <button 
          onClick={handleSnooze}
          className="w-full bg-gray-800 hover:bg-gray-700 text-white rounded-[24px] py-6 text-xl font-medium transition-all transform active:scale-95"
        >
          Ajorna 10 minuts
        </button>
      </div>
    </div>
  );
};

export default MedicationConfirm;
