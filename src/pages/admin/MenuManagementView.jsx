import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, User, Database, LayoutGrid, Terminal, Search, ArrowLeft, Save, Check } from 'lucide-react';

const ALL_PAGES = [
  { id: 'notes', label: 'Bloc de Notes', category: 'Identitat', icon: <Settings size={18} /> },
  { id: 'perfil', label: 'Perfil', category: 'Identitat', icon: <User size={18} /> },
  { id: 'arxiu', label: 'Relíquies', category: 'Recursos', icon: <Database size={18} /> },
  { id: 'mapa', label: 'Mapa', category: 'Recursos', icon: <LayoutGrid size={18} /> },
  { id: 'calendari', label: 'Agenda', category: 'Recursos', icon: <Settings size={18} /> },
  { id: 'infoteca', label: 'Infoteca', category: 'Recursos', icon: <LayoutGrid size={18} /> },
  { id: 'solatge', label: 'Solatge', category: 'Recursos', icon: <Database size={18} /> },
  { id: 'genesis', label: 'Genesis Viewer', category: 'Tècnic', icon: <Terminal size={18} /> },
  { id: 'buscador-ajudes', label: 'Buscador Ajudes', category: 'Recursos', icon: <Search size={18} /> },
  { id: 'directori', label: 'Directori', category: 'Estructura', icon: <LayoutGrid size={18} /> },
  { id: 'dossier', label: 'Dossier Socis', category: 'Oficial', icon: <Database size={18} /> }
];

const MenuManagementView = () => {
  const navigate = useNavigate();
  const [selectedPages, setSelectedPages] = useState(['notes', 'perfil', 'arxiu', 'mapa', 'calendari', 'infoteca', 'solatge']);
  const [searchQuery, setSearchQuery] = useState('');

  const togglePage = id => {
    setSelectedPages(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const filteredPages = ALL_PAGES.filter(page => page.label.toLowerCase().includes(searchQuery.toLowerCase()) || page.category.toLowerCase().includes(searchQuery.toLowerCase()));
  const categories = [...new Set(ALL_PAGES.map(p => p.category))];

  return (
    <div className="flex-1 flex flex-col bg-gray-50 animate-in fade-in duration-500 overflow-hidden h-full">
        <div role="region" aria-label="Capçalera de Secció" className="h-20 flex items-center justify-between px-8 border-b border-gray-200 shrink-0 bg-white">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-[28px] bg-gray-100 hover:bg-gray-200 transition-all text-gray-500 hover:text-gray-900">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-xl font-black text-gray-900 tracking-widest uppercase m-0">GESTIÓ DE MENÚ</h1>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider m-0">IDENTITAT i RECURSOS · ADMIN CONSOLE</p>
                </div>
            </div>
            <button className="h-10 px-6 rounded-[28px] bg-orange-500 text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-sm hover:scale-105 active:scale-95 transition-all" onClick={() => alert('Configuració salvada al Gènesi!')}>
                <Save size={16} />
                GUARDAR CANVIS
            </button>
        </div>

        <div className="p-6 bg-white border-b border-gray-200 shrink-0">
            <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" placeholder="CERCA PÀGINES O CATEGORIES..." className="w-full h-12 bg-gray-50 border border-gray-200 rounded-[28px] pl-12 pr-6 text-sm text-gray-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all placeholder:text-gray-400" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="max-w-4xl mx-auto space-y-10">
                {categories.map(category => {
                  const pagesInCategory = filteredPages.filter(p => p.category === category);
                  if (pagesInCategory.length === 0) return null;
                  
                  return (
                    <section key={category} className="space-y-4">
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-1.5 h-6 bg-sky-500 rounded-[28px]" />
                            <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.3em] m-0">{category}</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {pagesInCategory.map(page => (
                              <button key={page.id} onClick={() => togglePage(page.id)} className={`flex items-center justify-between p-4 rounded-2xl border transition-all group ${selectedPages.includes(page.id) ? 'bg-orange-50 border-orange-200 text-orange-900' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 shadow-sm'}`}>
                                  <div className="flex items-center gap-4">
                                      <div className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${selectedPages.includes(page.id) ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                          {page.icon}
                                      </div>
                                      <div className="text-left">
                                          <p className="font-black text-[13px] uppercase tracking-wider m-0">{page.label}</p>
                                          <p className="text-xs opacity-60 font-bold uppercase m-0">{page.id}</p>
                                      </div>
                                  </div>
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${selectedPages.includes(page.id) ? 'bg-orange-500 text-white scale-110' : 'border border-gray-200 text-transparent'}`}>
                                      <Check size={14} strokeWidth={4} />
                                  </div>
                              </button>
                            ))}
                        </div>
                    </section>
                  );
                })}
            </div>
        </div>
        
        <style>{`
            .custom-scrollbar::-webkit-scrollbar { width: 6px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #d1d5db; border-radius: 3px; }
        `}</style>
    </div>
  );
};
export default MenuManagementView;