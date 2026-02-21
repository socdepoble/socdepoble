import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
    User, MessageSquare, Briefcase, Settings, Database, 
    Users, Calendar, Image as ImageIcon, LogOut, ChevronRight,
    Shield, Sparkles, Brain, Map as MapIcon, Wrench, LayoutGrid,
    Store, MapPin, Zap, FileText, ShieldCheck, Cpu, ArrowLeft,
    Clock, Globe, Wallet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './HubView.css';

const OS_CATEGORIES = [
  {
    id: "comunitat",
    title: "Comunitat i Diàleg",
    description: "L'espai on el poble bategua. Substitut de WhatsApp i Instagram, amb trellat.",
    image: "/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/iaia_oficial_vosc_v2_1770060040751.png",
    items: [
      { id: "chats", label: "Xat i Consells", icon: MessageSquare, description: "Missatgeria sobirana i privada.", to: "/chats" },
      { id: "mur", label: "Mur del Poble", icon: LayoutGrid, description: "La teua finestra a la vida rural.", to: "/mur" },
      { id: "pobles", label: "Pobles i Gent", icon: MapPin, description: "Explora el territori i els veïns.", to: "/pobles" },
      { id: "directori", label: "Directori", icon: Users, description: "Cerca perfils de confiança.", to: "/directori" },
    ]
  },
  {
    id: "economia",
    title: "Economia i Gestió",
    description: "El mercat i l'ofici. Substitut de Wallapop i LinkedIn rural.",
    image: "/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/iaia_mercat_vosc_v2_1770060056125.png",
    items: [
      { id: "mercat", label: "Mercat Rural", icon: Store, description: "Compra i ven amb km 0.", to: "/mercat" },
      { id: "ajudes", label: "Ajudes", icon: ShieldCheck, description: "Buscador d'oportunitats i subvencions.", to: "/ajudes" },
      { id: "ofici", label: "Ofici de Doc.", icon: FileText, description: "Documentació tècnica i legal.", to: "/ofici" },
      { id: "dossier", label: "Dossier Socis", icon: Briefcase, description: "La teua tarja de presentació.", to: "/dossier" },
    ]
  },
  {
    id: "memoria",
    title: "Memòria i Arxiu",
    description: "El llegat digital del Mas. Guardem el que és important.",
    image: "/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/iaia_arxiu_vosc_v2_1770060070010.png",
    items: [
      { id: "arxiu", label: "Relíquies", icon: Database, description: "Arxiu documental del poble.", to: "/arxiu" },
      { id: "infoteca", label: "Infoteca", icon: ImageIcon, description: "Galeria visual de la memòria.", to: "/infoteca" },
      { id: "notes", label: "Bloc de Notes", icon: Settings, description: "Organitza els teus bategats.", to: "/notes" },
      { id: "genesis", label: "Gènesi", icon: Cpu, description: "Explorador de la matriu del Mas.", to: "/genesis" },
    ]
  },
  {
    id: "mestre",
    title: "Eines del Mas",
    description: "Control total de la infraestructura i l'entorn.",
    image: "/assets/brain/29cb42cf-ba4e-45af-a1f9-254a5b27cd7a/nanobanana_tia_style_1770057831273.png",
    items: [
      { id: "mapa", label: "Mapa Tàctic", icon: MapIcon, description: "Cartografia avançada del territori.", to: "/mapa" },
      { id: "calendari", label: "Agenda", icon: Calendar, description: "Rituals i esdeveniments rurals.", to: "/calendari" },
      { id: "utilitats", label: "Utilitats Master", icon: Wrench, description: "Eines de camp i diagnòstic.", to: "/utilitats" },
      { id: "accessibilitat", label: "Accessibilitat", icon: Shield, description: "Ajustos d'inclusió universal.", to: "/accessibilitat" },
    ]
  }
];

const HubView = () => {
    const navigate = useNavigate();
    const { profile, logout, isSuperAdmin, isAdmin } = useAuth();

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="hub-view-container min-h-screen bg-black text-white p-6 lg:p-12 animate-in fade-in duration-700">
            {/* SISTEMA OPERATIU HEADER */}
            <header className="hub-header flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={handleBack} 
                        className="w-14 h-14 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-all active:scale-95 border border-white/10"
                        title="Tornar al Mas"
                    >
                        <ArrowLeft size={28} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">Node Central</span>
                            <div className="h-[1px] w-8 bg-indigo-500/30"></div>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-none italic">Sistema Operatiu <span className="text-indigo-500">Rural</span></h1>
                    </div>
                </div>
                
                <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-full border border-white/10 backdrop-blur-xl">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-black border border-white/20 overflow-hidden shrink-0">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <span>{profile?.full_name?.substring(0,1) || 'V'}</span>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-black uppercase leading-none">{profile?.full_name || 'Sobirà'}</span>
                        <span className="text-[9px] text-indigo-400 font-black uppercase tracking-widest mt-1">Identitat v10.33</span>
                    </div>
                </div>
            </header>

            {/* CATEGORIES GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-7xl mx-auto mb-20">
                {OS_CATEGORIES.map(category => (
                    <section key={category.id} className="os-category-block rounded-[40px] bg-white/[0.03] border border-white/10 overflow-hidden flex flex-col group transition-all hover:bg-white/5 shadow-2xl">
                        <div className="relative h-64 overflow-hidden">
                            <img 
                                src={category.image} 
                                alt={category.title} 
                                className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                            <div className="absolute bottom-6 left-8 right-8">
                                <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-2">{category.title}</h2>
                                <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-xs">{category.description}</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 p-4 flex-1">
                            {category.items.map(item => (
                                <NavLink 
                                    key={item.id} 
                                    to={item.to}
                                    className="flex flex-col p-4 bg-white/5 rounded-[28px] border border-white/5 hover:bg-indigo-500 hover:border-indigo-400 transition-all hover:translate-y-[-4px] group/item shadow-lg"
                                >
                                    <div className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl text-indigo-400 group-hover/item:text-white group-hover/item:bg-white/20 transition-colors mb-4">
                                        <item.icon size={20} />
                                    </div>
                                    <span className="text-sm font-black uppercase tracking-tight mb-1 group-hover/item:text-white transition-colors">{item.label}</span>
                                    <span className="text-[9px] text-gray-500 font-medium group-hover/item:text-white/70 transition-colors line-clamp-2">{item.description}</span>
                                </NavLink>
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            {/* MASTER CONSOLE AREA (IF ADMIN) */}
            {(isSuperAdmin || isAdmin) && (
                <section className="max-w-7xl mx-auto mb-20">
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-[40px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border-dashed">
                        <div className="flex items-center gap-8">
                             <div className="w-20 h-20 bg-orange-500 text-white rounded-[28px] flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.5)]">
                                <Cpu size={40} />
                             </div>
                             <div>
                                <h2 className="text-3xl font-black uppercase tracking-tighter italic">Consola <span className="text-orange-500">Mestre</span></h2>
                                <p className="text-sm text-gray-400 max-w-md mt-2">Accés a les funcions de governament, anàlisi forense i gestió profunda de la matriu del poble.</p>
                             </div>
                        </div>
                        <button 
                            onClick={() => navigate('/admin')}
                            className="bg-orange-500 hover:bg-orange-400 text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-sm transition-all active:scale-95 shadow-xl flex items-center gap-3"
                        >
                            <Shield size={20} /> Entrar en Administració
                        </button>
                    </div>
                </section>
            )}

            <footer className="hub-footer flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/5 gap-8">
                <div className="footer-v flex flex-col gap-2">
                    <div className="text-slate-600 font-black text-[10px] tracking-widest uppercase">
                        Sóc de Poble! v10.33.1 • {new Date().getFullYear()}
                    </div>
                    <div className="flex items-center gap-4 text-[8px] font-black uppercase tracking-[0.2em] text-slate-700">
                        <span>Llicència Rural v1.0</span>
                        <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
                        <span>Orgull de Poble</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => { logout(); navigate('/'); }}
                        className="flex items-center gap-2 text-red-500/60 hover:text-red-500 px-4 py-2 transition-all font-black uppercase text-[10px] tracking-widest"
                    >
                        <LogOut size={16} /> Tancar Sessió
                    </button>
                    <div className="archon-status flex items-center gap-3 bg-fuchsia-500/5 border border-fuchsia-500/20 px-6 py-3 rounded-[24px]">
                        <Brain size={20} className="text-fuchsia-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-400">ARCHON CONSOLIDATED v10.33</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HubView;
