import { useState } from 'react';
import { FileText, Wrench, Sparkles, ArrowRight } from 'lucide-react';

const Utilitats = () => {
  const [activeTool, setActiveTool] = useState(null);
  
  const tools = [
    {
      id: 'pdf-bategador',
      name: 'Bategador de PDFs',
      description: 'Converteix qualsevol PDF orfe en un formulari interactiu i rellenable.',
      icon: FileText,
      color: 'orange'
    }
  ];

  if (activeTool === 'pdf-bategador') {
    // If PDFBategatManager is needed, it must be imported here.
    return (
      <div className="flex-1 bg-white p-6 flex flex-col items-center justify-center">
        <p className="text-xl font-bold">PDFBategatManager component is not imported.</p>
        <button className="mt-4 px-4 py-2 bg-orange-500 text-white font-bold rounded-lg" onClick={() => setActiveTool(null)}>Tornar</button>
      </div>
    );
  }

  return (
      <div className="flex-1 bg-white p-6 md:p-12 overflow-y-auto custom-scrollbar">
          <div role="region" aria-label="Capçalera de Secció" className="mb-16 relative">
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-orange-50 blur-[120px] rounded-[28px] pointer-events-none" />
              
              <div className="flex items-center gap-6 mb-4 relative z-10">
                  <div className="w-16 h-16 bg-white border border-gray-200 rounded-[20px] flex items-center justify-center shadow-sm">
                      <Wrench className='w-8 h-8 text-orange-500' />
                  </div>
                  <div>
                      <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none mb-1 font-condensed text-gray-900 m-0">
                          UTILITATS <span className="text-sky-500">DEL MAS</span>
                      </h1>
                      <p className="text-gray-400 font-bold tracking-widest text-xs uppercase font-mono m-0 mt-2">
                          Sobirania Digital • Protocol Rhizome v10.26
                      </p>
                  </div>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
              {tools.map(tool => (
                <div key={tool.id} onClick={() => setActiveTool(tool.id)} className="group bg-white border border-gray-200 rounded-[28px] p-8 cursor-pointer hover:bg-sky-50 hover:border-sky-200 transition-all duration-500 relative overflow-hidden flex flex-col min-h-[320px] shadow-sm font-condensed">
        
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-700 pointer-events-none text-sky-500">
                        <tool.icon size={160} />
                    </div>
                    
                    <div className="bg-gradient-to-br from-sky-100 to-sky-50 w-16 h-16 rounded-[20px] flex items-center justify-center mb-8 border border-sky-200 shadow-sm">
                        <tool.icon className="text-sky-500" size={28} />
                    </div>
                    
                    <div className="mt-auto relative z-10">
                        <h3 className="text-2xl font-black mb-3 flex items-center gap-3 tracking-tight italic text-gray-900 m-0">
                            {tool.name}
                            <Sparkles size={18} className="text-fuchsia-400 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-1 group-hover:translate-y-0" />
                        </h3>
                        <p className="text-gray-500 text-[15px] leading-relaxed mb-10 font-medium m-0 mt-2">
                            {tool.description}
                        </p>
                        
                        <div className="flex items-center text-sky-500 font-black text-xs gap-3 tracking-[0.2em] group-hover:gap-4 transition-all m-0">
                            INICIAR PROTOCOL
                            <ArrowRight size={18} />
                        </div>
                    </div>
                </div>
              ))}
              
              {[1, 2].map(i => (
                <div key={i} className="bg-gray-50 border border-gray-200 border-dashed rounded-[28px] p-8 flex flex-col items-center justify-center text-gray-400 italic text-sm min-h-[320px] transition-all hover:bg-gray-100">
                    <div className="w-12 h-12 rounded-[28px] border border-current flex items-center justify-center mb-4 opacity-50">?</div>
                    <span className="font-black tracking-widest uppercase text-xs m-0">Properament...</span>
                </div>
              ))}
          </div>
      </div>
  );
};
export default Utilitats;