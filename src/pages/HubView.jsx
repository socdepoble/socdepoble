import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Newspaper, Store, MapPin, Calendar, Bot, Shield, Rocket, LogOut, StickyNote, ArrowLeft, Terminal, FileText, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';

const HubView = () => {
    const { openPostModal, setIsEventModalOpen, setIsMarketModalOpen } = useModal();
    useTranslation();
    const { isSuperAdmin, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/mur');
        }
    };

    return (
        <div className="hub-view-container min-h-full w-full bg-[#111] text-white flex flex-col items-center">
            
            {/* CAPUTXA TARONJA (Llei de la Boina) */}
            <div className="w-full h-[72px] bg-[var(--gradient-bategat)] flex items-center justify-between px-4 md:px-8 shadow-md z-10 sticky top-0">
                <button 
                    onClick={handleBack} 
                    className="w-10 h-10 flex items-center justify-center rounded-[28px] bg-black/20 hover:bg-black/40 text-white shadow-sm transition-all active:scale-95 border-none"
                    title="Tornar"
                >
                    <ArrowLeft size={22} strokeWidth={2.5} />
                </button>
                <div className="text-center flex flex-col items-center justify-center">
                    <h1 className="text-[20px] font-black tracking-tight uppercase text-white drop-shadow-sm leading-tight">Centre de Control</h1>
                    <span className="text-[9px] text-white/80 font-bold uppercase tracking-widest">Sóc de Poble v10.33</span>
                </div>
                <div className="w-10"></div> {/* Spacer for centering */}
            </div>

            <div className="w-full max-w-2xl space-y-8 p-4 pt-6 md:p-8 animate-in fade-in duration-500">
                
                {/* PRIMARY ACTIONS - The Big 5 */}
                <div>
                    <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 mb-4 pl-2">Accions Principals</h2>
                    <div className="flex flex-col gap-4">
                        
                        {/* THE MASTER BUTTON: Publicar al Mur */}
                        <button className="w-full flex items-center p-6 bg-gradient-to-r from-orange-500/20 to-orange-500/5 hover:from-orange-500/30 hover:to-orange-500/10 border-2 border-orange-500/40 hover:border-orange-500 rounded-[32px] transition-all group active:scale-[0.98]" onClick={() => {
                            openPostModal();
                        }}>
                            <div className="w-16 h-16 rounded-[24px] bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(249,115,22,0.4)] group-hover:scale-110 transition-transform">
                                <Newspaper size={32} />
                            </div>
                            <div className="flex flex-col items-start ml-6 text-left">
                                <span className="font-black text-2xl uppercase tracking-tighter text-white">Publicar al Mur</span>
                                <span className="text-orange-300/80 text-sm font-bold tracking-widest mt-1 uppercase">Compartir novetats</span>
                            </div>
                        </button>

                        <button className="w-full flex items-center p-5 bg-white/[0.03] border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/10 rounded-[32px] transition-all group active:scale-[0.98]" onClick={() => {
                            setIsMarketModalOpen(true);
                        }}>
                            <div className="w-14 h-14 rounded-[24px] bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                                <Store size={28} />
                            </div>
                            <span className="font-black text-xl uppercase tracking-tighter text-white ml-6">Vendre al Mercat</span>
                        </button>

                        <button className="w-full flex items-center p-5 bg-white/[0.03] border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 rounded-[32px] transition-all group active:scale-[0.98]" onClick={() => {
                            setIsEventModalOpen(true);
                        }}>
                            <div className="w-14 h-14 rounded-[24px] bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                                <Calendar size={28} />
                            </div>
                            <span className="font-black text-xl uppercase tracking-tighter text-white ml-6">Crear Esdeveniment</span>
                        </button>

                        <button className="w-full flex items-center p-5 bg-white/[0.03] border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10 rounded-[32px] transition-all group active:scale-[0.98]" onClick={() => {
                            navigate('/mapa');
                        }}>
                            <div className="w-14 h-14 rounded-[24px] bg-purple-500/20 text-purple-400 group-hover:bg-purple-500 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                                <MapPin size={28} />
                            </div>
                            <span className="font-black text-xl uppercase tracking-tighter text-white ml-6">Veure Mapes</span>
                        </button>
                    </div>
                </div>

                {/* SECONDARY RESOURCES - Tools for the Mas */}
                <div>
                    <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 mb-4 pl-2">Recursos i Eines</h2>
                    
                    <div className="mb-3">
                        <button className="w-full h-full flex items-center justify-start gap-3 p-4 bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 rounded-[24px] transition-all group active:scale-95" onClick={() => {
                            navigate('/perfil/iaia-1');
                        }}>
                            <div className="w-12 h-12 rounded-[20px] bg-blue-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white flex items-center justify-center transition-colors shadow-lg shrink-0">
                                <Bot size={24} />
                            </div>
                            <div className="flex flex-col items-start font-black text-sm uppercase tracking-tight pt-0.5">
                                <span className="text-blue-400 text-[10px] tracking-widest leading-none mb-0.5">Canal Directe</span>
                                <span className="text-white text-[15px] leading-tight text-left">Missatge al Mestre d'Adreces</span>
                            </div>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 hover:bg-white/10 rounded-[24px] transition-all active:scale-95" onClick={() => {
                            navigate('/notes');
                        }}>
                            <div className="w-10 h-10 rounded-[28px] bg-yellow-500/20 text-yellow-500 flex items-center justify-center shrink-0">
                                <StickyNote size={18} />
                            </div>
                            <span className="font-bold text-sm tracking-tight text-left">Bloc de Notes</span>
                        </button>

                        <button className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 hover:bg-white/10 rounded-[24px] transition-all active:scale-95" onClick={() => {
                            navigate('/financament');
                        }}>
                            <div className="w-10 h-10 rounded-[28px] bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                                <Wallet size={18} />
                            </div>
                            <span className="font-bold text-sm tracking-tight text-left">Finançament</span>
                        </button>

                        <button className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 hover:bg-white/10 rounded-[24px] transition-all active:scale-95" onClick={() => {
                            navigate('/ofici');
                        }}>
                            <div className="w-10 h-10 rounded-[28px] bg-indigo-500/20 text-indigo-500 flex items-center justify-center shrink-0">
                                <Terminal size={18} />
                            </div>
                            <span className="font-bold text-sm tracking-tight text-left">Sistema Operatiu</span>
                        </button>

                        <button className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 hover:bg-white/10 rounded-[24px] transition-all active:scale-95" onClick={() => {
                            navigate('/legal');
                        }}>
                            <div className="w-10 h-10 rounded-[28px] bg-orange-500/20 text-orange-500 flex items-center justify-center shrink-0">
                                <FileText size={18} />
                            </div>
                            <span className="font-bold text-sm tracking-tight text-left">Info Legal</span>
                        </button>
                    </div>
                </div>

                {/* ADMIN SECTOR */}
                <div className="pt-6 border-t border-white/5 space-y-3">
                    {(isSuperAdmin || isAdmin) && (
                        <button className="w-full flex items-center justify-center gap-2 py-4 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/30 rounded-[28px] text-xs font-black tracking-widest uppercase transition-colors" onClick={() => {
                            navigate('/admin');
                        }}>
                            <Shield size={18} />
                            <span>Administració</span>
                        </button>
                    )}

                    <button className="w-full flex items-center justify-center gap-2 py-4 text-white/30 hover:text-white hover:bg-white/5 rounded-[28px] transition-colors text-xs font-black tracking-widest uppercase" onClick={() => {
                        logout();
                        navigate('/');
                    }}>
                        <LogOut size={16} />
                        <span>Eixir del Poble</span>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default HubView;
