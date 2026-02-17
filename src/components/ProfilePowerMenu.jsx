import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    X, User, MessageSquare, Briefcase, Settings, Database, 
    Users, Calendar, Ghost, Image as ImageIcon, LogOut, ChevronRight,
    Shield, Sparkles, Brain
} from 'lucide-react';
import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';
import './ProfilePowerMenu.css';

const SIDEBAR_ORG = [
  { id: "perfil", label: "El meu Perfil", icon: User, to: "/perfil" },
  { id: "iaia_hub", label: "La IAIA (Hub)", icon: MessageSquare, to: "/iaia" },
  { id: "dossier", label: "Dossier de Socis", icon: Briefcase, to: "/dossier" },
  { id: "trellat", label: "Taller de Trellat", icon: Settings, to: "/tools/trellat" },
  { id: "arxiu", label: "L'Arxiu d'Or", icon: Database, to: "/arxiu" },
  { id: "directori", label: "Directori de Veïns", icon: Users, to: "/directori" },
];

const SIDEBAR_COLLECTIONS = [
  { id: "col_gent", label: "Gent del Poble", icon: Users, to: "/directori" },
  { id: "calendari_master", label: "Agenda Cultural", icon: Calendar, to: "/calendari" },
  { id: "memorial", label: "Memorial Fantasmes", icon: Ghost, to: "/memorial" },
  { id: "infoteca", label: "Infoteca Nano", icon: ImageIcon, to: "/infoteca" },
];

const ProfilePowerMenu = () => {
    const { isProfileMenuOpen, closeProfileMenu } = useUI();
    const { user, profile } = useAuth();

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
                            <h2 className="text-2xl font-black tracking-tighter uppercase">{profile?.full_name || user?.email?.split('@')[0] || 'Veí de Poble'}</h2>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">{user?.email}</p>
                        </div>
                    </div>
                    <button className="close-power-btn" onClick={closeProfileMenu}>
                        <X size={24} />
                    </button>
                </header>

                <div className="power-grid">
                    {/* SECTION: ORGANITZACIÓ */}
                    <div className="power-section">
                        <h3 className="section-title">Organització</h3>
                        <div className="pg-items">
                            {SIDEBAR_ORG.map(item => (
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

                    {/* SECTION: COL·LECCIONS */}
                    <div className="power-section">
                        <h3 className="section-title">Col·leccions</h3>
                        <div className="pg-items">
                            {SIDEBAR_COLLECTIONS.map(item => (
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

                    {/* SECTION: AJUSTES & SOBIRANIA */}
                    <div className="power-section">
                        <h3 className="section-title">Sobirania</h3>
                        <div className="pg-items">
                             <div className="pg-item disabled">
                                <div className="pg-icon"><Shield size={20} /></div>
                                <span className="pg-label">Privacitat Rhizome</span>
                             </div>
                             <div className="pg-item" onClick={() => { alert("Adéu!"); closeProfileMenu(); }}>
                                <div className="pg-icon text-red-500"><LogOut size={20} /></div>
                                <span className="pg-label text-red-500">Tancar Sessió</span>
                             </div>
                        </div>
                    </div>
                </div>

                <footer className="power-footer">
                    <div className="footer-v">v10.27.0-MINIMALISM</div>
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
