const VitalSecurity = () => {
  return (
      <div className='flex h-screen w-full flex-col bg-sdp-background-color'>
                <ContextualHeader title="Àngels de la Guarda" backUrl="/mur" />
                
                <div className="flex flex-1 flex-col overflow-y-auto p-4 custom-scrollbar padding-bottom-safe">
                    <div className="mx-auto w-full max-w-2xl px-2 py-6 flex flex-col gap-8">
                        
                        {/* Sección 1: Asistente Quirúrgico de Medicación (IndexedDB + PWA Push) */}
                        <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in delay-100">
                            <MedicationManager />
                        </div>

                        {/* Sección 2: Modo Seguridad Anticaídas (DeviceMotionEvent) - Placeholder */}
                        <div className='animate-in slide-in-from-bottom-4 duration-500 fade-in delay-200 flex flex-col gap-4 rounded-3xl bg-sdp-surface-color p-6 shadow-sm ring-1 ring-red-500/20'>
                            <div className="flex flex-col gap-2">
                                <h2 className="font-heading text-2xl font-bold tracking-tight text-red-500 dark:text-red-400">
                                    Escut Anticaigudes
                                </h2>
                                <p className='text-sm font-medium text-sdp-text-muted'>
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