import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
    X, User, MessageSquare, Briefcase, Settings, Database, 
    Users, Calendar, Image as ImageIcon, LogOut, ChevronRight,
    Shield, Sparkles, Brain, Map as MapIcon, Wrench, LayoutGrid,
    Store, MapPin, Zap, FileText, ShieldCheck, Cpu, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './HubView.css';

const PILARS_SAGRATS = [
  { id: "perfil", label: "Perfil Sobirà", icon: User, to: "/perfil", featured: true },
  { id: "chats", label: "Xat i Consells", icon: MessageSquare, to: "/chats" },
  { id: "mur", label: "Mur del Poble", icon: LayoutGrid, to: "/mur" },
  { id: "mercat", label: "Mercat Rural", icon: Store, to: "/mercat" },
  { id: "pobles", label: "Pobles i Gent", icon: MapPin, to: "/pobles" },
  { id: "nexus", label: "Nexus Flash", icon: Zap, to: "/nexus" },
  { id: "mapa", label: "Mapa Tàctic", icon: MapIcon, to: "/mapa" },
];

const RECURSOS_IDENTITAT = [
  { id: "notes", label: "Bloc de Notes", icon: Settings, to: "/notes" },
  { id: "arxiu", label: "Relíquies (Arxiu)", icon: Database, to: "/arxiu" },
  { id: "calendari", label: "Agenda del Mas", icon: Calendar, to: "/calendari" },
  { id: "infoteca", label: "Infoteca Gallery", icon: ImageIcon, to: "/infoteca" },
  { id: "genesis", label: "Gènesi Viewer", icon: Database, to: "/genesis" },
  { id: "solatge", label: "Solatge Console", icon: Database, to: "/solatge" },
];

const OFICI_GESTIO = [
  { id: "ofici", label: "Ofici de Doc.", icon: FileText, to: "/ofici" },
  { id: "ajudes", label: "Buscador d'Ajudes", icon: ShieldCheck, to: "/ajudes" },
  { id: "dossier", label: "Dossier de Socis", icon: Briefcase, to: "/dossier" },
  { id: "directori", label: "Directori de Gent", icon: Users, to: "/directori" },
  { id: "iaia_hub", label: "La IAIA Hub", icon: Sparkles, to: "/iaia" },
];

const TECNIC_MESTRE = [
  { id: "chrome145", label: "Informe Chrome 145", icon: Cpu, to: "/chrome-145" },
  { id: "utilitats", label: "Utilitats Master", icon: Wrench, to: "/utilitats" },
  { id: "accessibilitat", label: "Accessibilitat", icon: Shield, to: "/accessibilitat" },
];

/**
 * [HUB SAGRAT - VEÍ DEL POBLE]
 * Vista a pantalla completa que centralitza tots els nodes del Mas.
 */
const HubView = () => {
    const navigate = useNavigate();
    const { user, profile, signOut, isSuperAdmin, isAdmin } = useAuth();

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="hub-view-container min-h-screen bg-black text-white p-6 lg:p-12 animate-in fade-in duration-500">
            {/* HEADER: IDENTITY & NAVIGATION */}
            <header className="hub-header flex items-center justify-between mb-12">
                <div className="flex items-center gap-4 lg:gap-8">
                    <button 
                        onClick={handleBack} 
                        className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                        title="Tornar al Mas"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div className="user-identity-hub flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-2xl font-black border-2 border-white/10 overflow-hidden">
                            {profile?.avatar_url ? (
                                <img 
                                    src={profile.avatar_url} 
                                    alt="P" 
                                    className="w-full h-full object-cover" 
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                    }}
                                />
                            ) : null}
                            <span className={`avatar-placeholder ${profile?.avatar_url ? 'hidden' : ''}`}>
                                {profile?.full_name?.substring(0, 1) || user?.email?.substring(0, 1).toUpperCase() || 'V'}
                            </span>
                        </div>
                        <div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">{profile?.full_name || user?.email?.split('@')[0] || 'Sóc de Poble'}</h2>
                            <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Identitat Consolidada • {profile?.role || 'Sobirana'}</p>
                        </div>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 text-slate-400 rounded-full border border-white/10">
                    <Shield size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Protecció Rhizome Ativa</span>
                </div>
            </header>

            <div className="hub-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                {/* SECTION: PILARS DEL MAS */}
                <section className="hub-section">
                    <h3 className="section-title text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6 flex items-center gap-2">
                        <div className="w-1 h-1 bg-indigo-500 rounded-full"></div> Pilars del Mas
                    </h3>
                    <div className="hub-items space-y-3">
                        {PILARS_SAGRATS.map(item => (
                            <NavLink 
                                key={item.id} 
                                to={item.to} 
                                className={`hub-item flex items-center gap-4 p-4 rounded-3xl border border-white/5 transition-all hover:translate-x-2 ${item.featured ? 'hub-item-featured' : 'bg-white/5 hover:bg-white/10'}`}
                            >
                                <div className={`hub-icon w-10 h-10 flex items-center justify-center rounded-2xl ${item.featured ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400'}`}>
                                    <item.icon size={20} />
                                </div>
                                <span className={`hub-label font-bold text-sm ${item.featured ? 'text-white font-black' : 'text-slate-300'}`}>{item.label}</span>
                                {item.featured && <span className="ml-auto text-[10px] font-black bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-500/30">Privilegiat</span>}
                                {!item.featured && <ChevronRight size={14} className="ml-auto opacity-20" />}
                            </NavLink>
                        ))}
                    </div>
                </section>

                {/* SECTION: IDENTITAT i RECURSOS */}
                <section className="hub-section">
                    <h3 className="section-title text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6 flex items-center gap-2">
                        <div className="w-1 h-1 bg-indigo-500 rounded-full"></div> Identitat i Recursos
                    </h3>
                    <div className="hub-items space-y-3">
                        {RECURSOS_IDENTITAT.map(item => (
                            <NavLink 
                                key={item.id} 
                                to={item.to} 
                                className="hub-item flex items-center gap-4 p-4 bg-white/5 rounded-3xl border border-white/5 transition-all hover:bg-white/10 hover:translate-x-2"
                            >
                                <div className="hub-icon w-10 h-10 flex items-center justify-center bg-white/5 text-slate-400 rounded-2xl">
                                    <item.icon size={20} />
                                </div>
                                <span className="hub-label font-bold text-sm text-slate-300">{item.label}</span>
                                <ChevronRight size={14} className="ml-auto opacity-20" />
                            </NavLink>
                        ))}
                    </div>
                </section>

                {/* SECTION: OFICI i GESTIÓ */}
                <section className="hub-section">
                    <h3 className="section-title text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6 flex items-center gap-2">
                        <div className="w-1 h-1 bg-indigo-500 rounded-full"></div> Ofici i Gestió
                    </h3>
                    <div className="hub-items space-y-3">
                        {OFICI_GESTIO.map(item => (
                            <NavLink 
                                key={item.id} 
                                to={item.to} 
                                className="hub-item flex items-center gap-4 p-4 bg-white/5 rounded-3xl border border-white/5 transition-all hover:bg-white/10 hover:translate-x-2"
                            >
                                <div className="hub-icon w-10 h-10 flex items-center justify-center bg-white/5 text-slate-400 rounded-2xl">
                                    <item.icon size={20} />
                                </div>
                                <span className="hub-label font-bold text-sm text-slate-300">{item.label}</span>
                                <ChevronRight size={14} className="ml-auto opacity-20" />
                            </NavLink>
                        ))}
                    </div>
                </section>

                {/* SECTION: TÈCNIC & MESTRE */}
                <section className="hub-section">
                    <h3 className="section-title text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6 flex items-center gap-2">
                        <div className="w-1 h-1 bg-indigo-500 rounded-full"></div> Tècnic & Mestre
                    </h3>
                    <div className="hub-items space-y-3">
                        {TECNIC_MESTRE.map(item => (
                            <NavLink 
                                key={item.id} 
                                to={item.to} 
                                className="hub-item flex items-center gap-4 p-4 bg-white/5 rounded-3xl border border-white/5 transition-all hover:bg-white/10 hover:translate-x-2"
                            >
                                <div className="hub-icon w-10 h-10 flex items-center justify-center bg-white/5 text-slate-400 rounded-2xl">
                                    <item.icon size={20} />
                                </div>
                                <span className="hub-label font-bold text-sm text-slate-300">{item.label}</span>
                                <ChevronRight size={14} className="ml-auto opacity-20" />
                            </NavLink>
                        ))}

                        {/* ADMIN PANEL: NOMÉS MESTRE */}
                        {(isSuperAdmin || isAdmin) && (
                            <NavLink 
                                to="/admin" 
                                className="hub-item flex items-center gap-4 p-4 bg-orange-500/5 rounded-3xl border border-orange-500/20 transition-all hover:bg-orange-500/10 hover:translate-x-2"
                            >
                                <div className="hub-icon w-10 h-10 flex items-center justify-center bg-orange-500/20 text-orange-500 rounded-2xl">
                                    <Shield size={20} />
                                </div>
                                <span className="hub-label font-black text-sm text-orange-500 uppercase italic">Administració</span>
                                <ChevronRight size={14} className="ml-auto opacity-20" />
                            </NavLink>
                        )}
                    </div>
                </section>
            </div>

            <footer className="hub-footer flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/5 gap-6">
                <div className="footer-v text-slate-600 font-black text-[10px] tracking-widest uppercase mb-4 md:mb-0">
                    Sóc de Poble! v10.27.0-CANÒNIC • {new Date().getFullYear()}
                </div>
                
                <div className="auth-actions flex items-center gap-4">
                     <div className="disabled-option opacity-30 flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 cursor-not-allowed">
                        <Shield size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Privacitat Rhizome</span>
                     </div>
                     <button 
                        onClick={() => { signOut(); navigate('/'); }}
                        className="flex items-center gap-2 bg-red-500/10 text-red-500 px-6 py-2 rounded-full border border-red-500/20 hover:bg-red-500/20 transition-colors font-black uppercase text-[10px] tracking-widest"
                     >
                        <LogOut size={14} /> Tancar Sessió
                     </button>
                </div>

                <div className="archon-status flex items-center gap-3 bg-fuchsia-500/5 border border-fuchsia-500/20 px-6 py-2 rounded-full">
                    <Brain size={16} className="text-fuchsia-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-400">ARCHON CONSOLIDATED</span>
                </div>
            </footer>
        </div>
    );
};

export default HubView;
