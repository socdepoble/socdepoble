const IAIASandbox = () => {
  return <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4 font-sans max-w-3xl mx-auto">
            <Helmet>
                <title>IAIA Voz Sandbox - Sóc de Poble</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            {/* Cabecera del Prototipo */}
            <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                    <ShieldAlert className="w-8 h-8 text-amber-500 opacity-20" />
                </div>
                
                <h1 className="text-3xl font-black text-gray-800 mb-2 tracking-tight">
                    <span className="text-[var(--theme-accent-primary,blue)]">IAIA</span> Voz (V13 PoC)
                </h1>
                
                <p className="text-gray-600 text-sm mb-4 max-w-md mx-auto leading-relaxed">
                    Aquest és el prototip funcional de la sisena onada de l'auditoria. 
                    Actua com un laboratori aïllat per provar la captura d'àudio i la transcripció natiu.
                </p>
                <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full text-xs font-semibold">
                    <Ear size={14} />
                    Entorn Aïllat (Sense enviament a backend)
                </div>
            </div>

            {/* Zona de Pruebas (El Botón) */}
            <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-10 flex flex-col items-center justify-center min-h-[400px]">
                <h2 className="text-xl font-bold text-gray-700 mb-8 w-full text-center border-b border-gray-100 pb-4">
                    Laboratori d'Interacció
                </h2>
                
                <IAIAVozButton onResult={text => {}} />
            </div>

            {/* Contexto técnico */}
            <div className="w-full mt-8 p-6 bg-gray-800 rounded-xl text-gray-300 font-mono text-xs shadow-xl">
                <div className="flex items-center gap-2 mb-3 border-b border-gray-700 pb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="font-bold text-white">ESTAT DEL SISTEMA NADIU</span>
                </div>
                <p className="mb-2">» Aquest PoC implementa la ruta fallback (Web Speech API / Offline Queuing).</p>
                <p className="mb-2">» Detecció de suport per idioma: <code>ca-ES</code> (Català/Valencià).</p>
                <p>» Per connectar xarxes neuronals quantitzades localment (WebGPU), s'haurien d'instal·lar i descarregar ~40MB via @huggingface/transformers. Hem blindat aquesta acció en producció.</p>
            </div>
        </div>;
};
export default IAIASandbox;