import { useEffect } from 'react';
import { useIAIAVoz } from '../hooks/useIAIAVoz';

export const IAIAVozButton = ({ onResult }) => {
    const { 
        status, 
        transcript, 
        strategy, 
        startListening, 
        stopListening, 
        initialize 
    } = useIAIAVoz();
    
    const isListening = status === 'listening';
    
    // Inicialización al hacer hover sobre escritorio para precargar modelos/permisos
    const handleMouseEnter = () => {
        if (status === 'idle') initialize();
    };
    
    // Extraer la transcripción final si la necesitamos enviar al padre
    useEffect(() => {
        if (status === 'ready' && transcript) {
            onResult?.(transcript);
        }
    }, [status, transcript, onResult]);
    
    const handleClick = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <button
                onMouseEnter={handleMouseEnter}
                onPointerDown={handleClick}
                className={`relative min-w-[90px] min-h-[90px] rounded-full flex flex-col items-center 
                            justify-center gap-1 transition-all duration-300 touch-manipulation
                            ${isListening 
                                ? 'bg-red-500 scale-110 shadow-[0_0_40px_rgba(239,68,68,0.7)] animate-pulse' 
                                : status === 'processing'
                                ? 'bg-amber-500 shadow-lg'
                                : 'bg-[var(--theme-accent-primary)] shadow-lg hover:scale-105'}`}
                aria-label={isListening ? "Atura l'enregistrament" : "Parla amb la IAIA"}
            >
                {status === 'loading' && (
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                )}
                
                {status === 'processing' && (
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                )}

                {(status === 'idle' || status === 'ready') && (
                    <Mic className="w-10 h-10 text-white" />
                )}

                {isListening && (
                    <StopCircle className="w-10 h-10 text-white" />
                )}

                {/* Etiquetas de estado */}
                <span className="text-white text-[10px] font-bold uppercase tracking-wider absolute -bottom-6 text-gray-500">
                    {isListening ? 'ESCOLTANT...' : 
                     status === 'processing' ? 'PENSANT...' : 
                     strategy === 'web-speech' ? '🎙️ WEB SPEECH' : 
                     strategy === 'record-and-queue' ? '💾 OFFLINE' : 'TOCA PER PARLAR'}
                </span>
            </button>
            
            {/* Display en crudo para el Sandbox */}
            <div className="w-full max-w-md min-h-[100px] mt-8 p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-inner text-gray-700 text-lg">
                {transcript || <span className="text-gray-400 italic">"Digues alguna cosa, fill meu..."</span>}
            </div>
        </div>
    );
};
