import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    X, User, MessageSquare, Briefcase, Settings, Database, 
    Users, Calendar, Image as ImageIcon, LogOut, ChevronRight,
    Shield, Sparkles, Brain, Map as MapIcon, Wrench, LayoutGrid,
    Store, MapPin, Zap, FileText, ShieldCheck, Cpu
} from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { useAuth } from '../context/AuthContext';
import './ProfilePowerMenu.css';

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

const ProfilePowerMenu = () => {
    const { isProfileMenuOpen, closeProfileMenu } = useNavigation();
    const { user, profile, signOut, isSuperAdmin, isAdmin } = useAuth();

    if (!isProfileMenuOpen) return null;

    return (
        <div className="profile-power-menu-overlay" onClick={closeProfileMenu}>
            <div className="power-menu-container animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
                {/* HEADER: IDENTITY */}
                <header className="power-header">
                    <div className="user-info-large">
                        <div className="avatar-huge">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="User" />
                            ) : (
                                <span>{profile?.full_name?.substring(0, 1) || user?.email?.substring(0, 1).toUpperCase()}</span>
                            )}
                        </div>
                        <div className="u-text">
                            <h2 className="text-2xl font-black tracking-tighter uppercase">{profile?.full_name || user?.email?.split('@')[0] || 'Sóc de Poble'}</h2>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">{user?.email}</p>
                        </div>
                    </div>
                    <button className="close-power-btn" onClick={closeProfileMenu}>
                        <X size={24} />
                    </button>
                </header>

                <div className="power-grid">
                    {/* SECTION: PILARS DEL MAS */}
                    <div className="power-section">
                        <h3 className="section-title">Pilars del Mas</h3>
                        <div className="pg-items">
                            {PILARS_SAGRATS.map(item => (
                                <NavLink 
                                    key={item.id} 
                                    to={item.to} 
                                    className={`pg-item ${item.featured ? 'pg-item-featured' : ''}`}
                                    onClick={closeProfileMenu}
                                >
                                    <div className="pg-icon"><item.icon size={20} /></div>
                                    <span className="pg-label">{item.label}</span>
                                    {item.featured && <span className="ml-auto text-[10px] font-black bg-indigo-500 text-white px-2 py-0.5 rounded-full uppercase tracking-widest">Obrir</span>}
                                    {!item.featured && <ChevronRight size={14} className="ml-auto opacity-20" />}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* SECTION: IDENTITAT i RECURSOS */}
                    <div className="power-section">
                        <h3 className="section-title">Identitat i Recursos</h3>
                        <div className="pg-items">
                            {RECURSOS_IDENTITAT.map(item => (
                                <NavLink 
                                    key={item.id} 
                                    to={item.to} 
                                    className="pg-item" 
                                    onClick={closeProfileMenu}
                                >
                                    <div className="pg-icon"><item.icon size={20} /></div>
                                    <span className="pg-label">{item.label}</span>
                                    <ChevronRight size={14} className="ml-auto opacity-20" />
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* SECTION: OFICI i GESTIÓ */}
                    <div className="power-section">
                        <h3 className="section-title">Ofici i Gestió</h3>
                        <div className="pg-items">
                            {OFICI_GESTIO.map(item => (
                                <NavLink 
                                    key={item.id} 
                                    to={item.to} 
                                    className="pg-item" 
                                    onClick={closeProfileMenu}
                                >
                                    <div className="pg-icon"><item.icon size={20} /></div>
                                    <span className="pg-label">{item.label}</span>
                                    <ChevronRight size={14} className="ml-auto opacity-20" />
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* SECTION: TÈCNIC & MESTRE */}
                    <div className="power-section">
                        <h3 className="section-title">Tècnic & Mestre</h3>
                        <div className="pg-items">
                            {TECNIC_MESTRE.map(item => (
                                <NavLink 
                                    key={item.id} 
                                    to={item.to} 
                                    className="pg-item" 
                                    onClick={closeProfileMenu}
                                >
                                    <div className="pg-icon"><item.icon size={20} /></div>
                                    <span className="pg-label">{item.label}</span>
                                    <ChevronRight size={14} className="ml-auto opacity-20" />
                                </NavLink>
                            ))}
                            
                            {/* ADMIN PANEL: NOMÉS MESTRE */}
                            {(isSuperAdmin || isAdmin) && (
                                <NavLink 
                                    to="/admin" 
                                    className="pg-item bg-orange-500/5 group" 
                                    onClick={closeProfileMenu}
                                >
                                    <div className="pg-icon text-orange-500"><Shield size={20} /></div>
                                    <span className="pg-label text-orange-500 font-black">Panell d'Admin</span>
                                    <ChevronRight size={14} className="ml-auto opacity-20" />
                                </NavLink>
                            )}
                        </div>
                    </div>

                    {/* SECTION: AJUSTES & SOBIRANIA */}
                    <div className="power-section">
                        <h3 className="section-title">Sobirania</h3>
                        <div className="pg-items">
                             <div className="pg-item disabled opacity-50">
                                <div className="pg-icon"><Shield size={20} /></div>
                                <span className="pg-label">Privacitat Rhizome</span>
                             </div>
                             <div className="pg-item" onClick={() => { signOut(); closeProfileMenu(); }}>
                                <div className="pg-icon text-red-500"><LogOut size={20} /></div>
                                <span className="pg-label text-red-500">Tancar Sessió</span>
                             </div>
                        </div>
                    </div>
                </div>

                <footer className="power-footer">
                    <div className="footer-v">v10.33.3-CANÒNIC</div>
                    <div className="archon-status flex items-center gap-2">
                        <Brain size={12} className="text-fuchsia-500" />
                        <span>ARCHON CONNECTED</span>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default ProfilePowerMenu;
