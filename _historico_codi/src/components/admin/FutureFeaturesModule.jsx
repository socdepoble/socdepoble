
export default function FutureFeaturesModule() {
  return (
    <div className="admin-submodule p-6 text-white h-full overflow-y-auto custom-scrollbar" style={{ paddingBottom: '120px' }}>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: 'var(--color-primary)' }}>
        <Activity /> Roadmap i Visió de Futur
      </h2>
      <p className="mb-8 opacity-80 text-sm max-w-2xl leading-relaxed">
        Aquest mòdul concentra les eines en fase d'experimentació, prototipat i planificació. 
        Han sigut retirades de la UI pública principal per evitar confusió o "marejar" als usuaris.
      </p>

      {/* REINOS MULTI-TENANT */}
      <section className="mb-10 bg-white/5 p-6 rounded-2xl border border-white/10">
        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2" style={{ color: 'var(--color-warning)' }}>
          <Layers size={20} /> 1. Motor de Reines (Multi-Tenant OMEGA-10)
        </h3>
        <p className="opacity-70 text-sm mb-6 max-w-xl">
          Estat: <span className="text-yellow-400 font-bold">En Desenvolupament / Prova de concepte</span><br/>
          Botons que permeten als usuaris canviar la seua identitat i perspectiva (Món Global vs. Universitat, Falla o Ajuntament) de forma fluïda. 
        </p>
        
        <div className="relative h-[300px] bg-black/40 border border-[#333] rounded-xl overflow-hidden flex">
           {/* Renderitzem el RealmSwitcher ací com a demostració/test independent */}
           <RealmSwitcher />
           <div className="flex-1 p-6 flex flex-col items-center justify-center opacity-40">
                <Wrench size={48} className="mb-4" />
                <p>Àrea de previsualització de simulació de "Murs" del regne seleccionat.</p>
           </div>
        </div>
      </section>

      {/* CHAT FEATURES */}
      <section className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-primary)' }}>
          2. Funcionalitats de Xat, Missatgeria i Mur
        </h3>
        
        <div className="space-y-4">
            {/* Cam */}
            <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg"><Camera size={20}/></div>
                    <div>
                        <h4 className="font-bold">Càmera al Xat</h4>
                        <p className="text-xs opacity-60">Permetrà adjuntar fotografies llançant la càmera nativa del mòbil o galeria.</p>
                    </div>
                </div>
                <span className="px-3 py-1 bg-gray-800 text-gray-400 text-[10px] uppercase tracking-wider rounded-full font-bold">Botó UI implementat / Lògica Pendent</span>
            </div>

            {/* Mic */}
            <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-500/20 text-purple-400 rounded-lg"><Mic size={20}/></div>
                    <div>
                        <h4 className="font-bold">Missatges de Veu</h4>
                        <p className="text-xs opacity-60">Integració de gravadora per enviar notes d'àudio via Storage Bucket.</p>
                    </div>
                </div>
                <span className="px-3 py-1 bg-gray-800 text-gray-400 text-[10px] uppercase tracking-wider rounded-full font-bold">Botó UI implementat / Lògica Pendent</span>
            </div>

            {/* Mapa Interactivo */}
            <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-500/20 text-green-400 rounded-lg"><Map size={20}/></div>
                    <div>
                        <h4 className="font-bold">Mapa Cívic d'Incidències</h4>
                        <p className="text-xs opacity-60">Visualitzador en temps real (Mapbox/Leaflet) d'eventualitats de cada Poble.</p>
                    </div>
                </div>
                <span className="px-3 py-1 bg-gray-800 text-gray-400 text-[10px] uppercase tracking-wider rounded-full font-bold">En Modelatge de Dades</span>
            </div>
            
        </div>
      </section>

    </div>
  );
}
