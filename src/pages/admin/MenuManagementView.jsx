import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const ALL_PAGES = [{
  id: 'notes',
  label: 'Bloc de Notes',
  category: 'Identitat',
  icon: <Settings size={18} />
}, {
  id: 'perfil',
  label: 'Perfil',
  category: 'Identitat',
  icon: <User size={18} />
}, {
  id: 'arxiu',
  label: 'Relíquies',
  category: 'Recursos',
  icon: <Database size={18} />
}, {
  id: 'mapa',
  label: 'Mapa',
  category: 'Recursos',
  icon: <LayoutGrid size={18} />
}, {
  id: 'calendari',
  label: 'Agenda',
  category: 'Recursos',
  icon: <Settings size={18} />
}, {
  id: 'infoteca',
  label: 'Infoteca',
  category: 'Recursos',
  icon: <LayoutGrid size={18} />
}, {
  id: 'solatge',
  label: 'Solatge',
  category: 'Recursos',
  icon: <Database size={18} />
}, {
  id: 'genesis',
  label: 'Genesis Viewer',
  category: 'Tècnic',
  icon: <Terminal size={18} />
}, {
  id: 'buscador-ajudes',
  label: 'Buscador Ajudes',
  category: 'Recursos',
  icon: <Search size={18} />
}, {
  id: 'directori',
  label: 'Directori',
  category: 'Estructura',
  icon: <LayoutGrid size={18} />
}, {
  id: 'dossier',
  label: 'Dossier Socis',
  category: 'Oficial',
  icon: <Database size={18} />
}];
const MenuManagementView = () => {
  const navigate = useNavigate();
  const [selectedPages, setSelectedPages] = useState(['notes', 'perfil', 'arxiu', 'mapa', 'calendari', 'infoteca', 'solatge']);
  const [searchQuery, setSearchQuery] = useState('');
  const togglePage = id => {
    setSelectedPages(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };
  const filteredPages = ALL_PAGES.filter(page => page.label.toLowerCase().includes(searchQuery.toLowerCase()) || page.category.toLowerCase().includes(searchQuery.toLowerCase()));
  const categories = [...new Set(ALL_PAGES.map(p => p.category))];
  return <div className="flex-1 flex flex-col bg-theme-base animate-in fade-in duration-500 overflow-hidden h-full">
      {/* HEADER GESTIÓ */}
      <div role="region" aria-label="Capçalera de Secció" className="h-20 flex items-center justify-between px-8 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-[28px] bg-white/5 hover:bg-white/10 transition-all text-white/70 hover:text-white">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black text-white tracking-widest uppercase">GESTIÓ DE MENÚ</h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">IDENTITAT i RECURSOS · ADMIN CONSOLE</p>
          </div>
        </div>
        <button className="h-10 px-6 rounded-[28px] bg-primary text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all" onClick={() => alert('Configuració salvada al Gènesi!')}>
          <Save size={16} />
          GUARDAR CANVIS
        </button>
      </div>

      {/* FILTRES I RECERCA */}
      <div className="p-6 bg-black/20 border-b border-white/5 shrink-0">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input type="text" placeholder="CERCA PÀGINES O CATEGORIES..." className="w-full h-12 bg-white/5 border border-white/10 rounded-[28px] pl-12 pr-6 text-sm text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-gray-600" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
      </div>

      {/* LLISTAT DE PÀGINES PER CATEGORIA */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-10">
          {categories.map(category => {
          const pagesInCategory = filteredPages.filter(p => p.category === category);
          if (pagesInCategory.length === 0) return null;
          return <section key={category} className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-1.5 h-6 bg-secondary rounded-[28px]" />
                  <h2 className="text-sm font-black text-white/50 uppercase tracking-[0.3em]">{category}</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pagesInCategory.map(page => <button key={page.id} onClick={() => togglePage(page.id)} className={`
                        flex items-center justify-between p-4 rounded-2xl border transition-all group
                        ${selectedPages.includes(page.id) ? 'bg-primary/10 border-primary/30 text-white' : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/20'}
                      `}>
                      <div className="flex items-center gap-4">
                        <div className={`
                          w-10 h-10 flex items-center justify-center rounded-xl transition-all
                          ${selectedPages.includes(page.id) ? 'bg-primary text-white' : 'bg-white/5 text-gray-500'}
                        `}>
                          {page.icon}
                        </div>
                        <div className="text-left">
                          <p className="font-black text-[13px] uppercase tracking-wider">{page.label}</p>
                          <p className="text-xs opacity-40 font-bold uppercase">{page.id}</p>
                        </div>
                      </div>
                      <div className={`
                        w-6 h-6 rounded-full flex items-center justify-center transition-all
                        ${selectedPages.includes(page.id) ? 'bg-primary text-white scale-110' : 'border border-white/10 text-transparent'}
                      `}>
                        <Check size={14} strokeWidth={4} />
                      </div>
                    </button>)}
                </div>
              </section>;
        })}
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #333; border-radius: 3px; }
      `}</style>
    </div>;
};
export default MenuManagementView;