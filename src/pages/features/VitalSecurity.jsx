import ContextualHeader from '../../components/layout/ContextualHeader';
import MedicationManager from '../../components/features/MedicationManager';
import FallDetectionToggle from '../../components/features/FallDetectionToggle';

const VitalSecurity = () => {
  return (
    <div className='flex h-screen w-full flex-col bg-gray-50'>
        <ContextualHeader title="Àngels de la Guarda" backUrl="/mur" />
        
        <div className="flex flex-1 flex-col overflow-y-auto p-4 custom-scrollbar pb-20">
            <div className="mx-auto w-full max-w-2xl px-2 py-6 flex flex-col gap-8">
                
                {/* Sección 1: Asistente Quirúrgico de Medicación (IndexedDB + PWA Push) */}
                <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in delay-100">
                    <MedicationManager />
                </div>

                {/* Sección 2: Modo Seguridad Anticaídas (DeviceMotionEvent) - Placeholder */}
                <div className='animate-in slide-in-from-bottom-4 duration-500 fade-in delay-200 flex flex-col gap-4 rounded-[28px] bg-white p-6 shadow-sm border border-gray-100 ring-1 ring-red-500/10'>
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl font-black tracking-tight text-red-500 m-0">
                            Escut Anticaigudes
                        </h2>
                        <p className='text-[13px] font-medium text-gray-500 leading-relaxed m-0 mt-2'>
                            Aquesta funcionalitat usarà l'acceleròmetre del teu dispositiu per detectar impactes bruscos i emetre un avís ràdio d'emergència si no és cancel·lat en 10 segons.
                        </p>
                    </div>
                    <FallDetectionToggle />
                </div>

            </div>
        </div>
    </div>
  );
};
export default VitalSecurity;