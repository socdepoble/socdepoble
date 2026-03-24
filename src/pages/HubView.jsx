import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Newspaper, Store, MapPin, Calendar, Bot, Shield, Rocket, LogOut, StickyNote, ArrowLeft, Terminal, FileText, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import { useDesign } from '../context/DesignContext';

const HubView = () => {
    const { openPostModal, setIsEventModalOpen, setIsMarketModalOpen } = useModal();
    useTranslation();
    const { isSuperAdmin, isAdmin, logout, user } = useAuth();
    const navigate = useNavigate();
    const { isDark } = useDesign();
    const isDayMode = !isDark;

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/mur');
        }
    };

    const bgColor = isDayMode ? 'bg-[#f8fafc]' : 'bg-[#111]';
    const textColor = isDayMode ? 'text-black' : 'text-white';
    const mutedText = isDayMode ? 'text-black/40' : 'text-white/40';
    const cardBg = isDayMode ? 'bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border-gray-100' : 'bg-white/[0.03] border-white/10 shadow-none';
    const highlightCardBg = isDayMode ? 'bg-orange-50 border-orange-200 hover:bg-orange-100' : 'bg-gradient-to-r from-orange-500/20 to-orange-500/5 hover:from-orange-500/30 hover:to-orange-500/10 border-orange-500/40';

    return (
        <div className={`hub-view-container min-h-full w-full ${bgColor} ${textColor} flex flex-col items-center transition-colors duration-500`}>
            
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
                    <h2 className={`text-[11px] font-black uppercase tracking-[0.3em] ${mutedText} mb-4 pl-2`}>Accions Principals</h2>
                    <div className="flex flex-col gap-4">
                        
                        {/* THE MASTER BUTTON: Publicar al Mur */}
                        <button className={`w-full flex items-center p-6 border-2 rounded-[32px] transition-all group active:scale-[0.98] ${highlightCardBg}`} onClick={() => {
                            if (user?.isAnonymous) {
                                navigate('/registre?returnTo=/hub');
                            } else {
                                openPostModal();
                            }
                        }}>
                            <div className="w-16 h-16 rounded-[24px] bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(249,115,22,0.4)] group-hover:scale-110 transition-transform">
                                <Newspaper size={32} />
                            </div>
                            <div className="flex flex-col items-start ml-6 text-left">
                                <span className={`font-black text-2xl uppercase tracking-tighter ${textColor}`}>Publicar al Mur</span>
                                <span className={`${isDayMode ? 'text-orange-600/80' : 'text-orange-300/80'} text-sm font-bold tracking-widest mt-1 uppercase`}>Compartir novetats</span>
                            </div>
                        </button>

                        <button className={`w-full flex items-center p-5 border rounded-[32px] transition-all group active:scale-[0.98] ${cardBg} ${isDayMode ? 'hover:border-emerald-300 hover:bg-emerald-50' : 'hover:border-emerald-500/50 hover:bg-emerald-500/10'}`} onClick={() => {
                            if (user?.isAnonymous) {
                                navigate('/registre?returnTo=/hub');
                            } else {
                                setIsMarketModalOpen(true);
                            }
                        }}>
                            <div className={`w-14 h-14 rounded-[24px] ${isDayMode ? 'bg-emerald-100 text-emerald-600' : 'bg-emerald-500/20 text-emerald-400'} group-hover:bg-emerald-500 group-hover:text-white flex items-center justify-center shrink-0 transition-colors`}>
                                <Store size={28} />
                            </div>
                            <span className={`font-black text-xl uppercase tracking-tighter ${textColor} ml-6`}>Vendre al Mercat</span>
                        </button>

                        <button className={`w-full flex items-center p-5 border rounded-[32px] transition-all group active:scale-[0.98] ${cardBg} ${isDayMode ? 'hover:border-blue-300 hover:bg-blue-50' : 'hover:border-blue-500/50 hover:bg-blue-500/10'}`} onClick={() => {
                            if (user?.isAnonymous) {
                                navigate('/registre?returnTo=/hub');
                            } else {
                                setIsEventModalOpen(true);
                            }
                        }}>
                            <div className={`w-14 h-14 rounded-[24px] ${isDayMode ? 'bg-blue-100 text-blue-600' : 'bg-blue-500/20 text-blue-400'} group-hover:bg-blue-500 group-hover:text-white flex items-center justify-center shrink-0 transition-colors`}>
                                <Calendar size={28} />
                            </div>
                            <span className={`font-black text-xl uppercase tracking-tighter ${textColor} ml-6`}>Crear Esdeveniment</span>
                        </button>

                        <button className={`w-full flex items-center p-5 border rounded-[32px] transition-all group active:scale-[0.98] ${cardBg} ${isDayMode ? 'hover:border-purple-300 hover:bg-purple-50' : 'hover:border-purple-500/50 hover:bg-purple-500/10'}`} onClick={() => {
                            navigate('/mapa');
                        }}>
                            <div className={`w-14 h-14 rounded-[24px] ${isDayMode ? 'bg-purple-100 text-purple-600' : 'bg-purple-500/20 text-purple-400'} group-hover:bg-purple-500 group-hover:text-white flex items-center justify-center shrink-0 transition-colors`}>
                                <MapPin size={28} />
                            </div>
                            <span className={`font-black text-xl uppercase tracking-tighter ${textColor} ml-6`}>Veure Mapes</span>
                        </button>
                    </div>
                </div>

                {/* SECONDARY RESOURCES - Tools for the Mas */}
                <div>
                    <h2 className={`text-[11px] font-black uppercase tracking-[0.3em] ${mutedText} mb-4 pl-2`}>Recursos i Eines</h2>
                    
                    <div className="mb-3">
                        <button className={`w-full h-full flex items-center justify-start gap-3 p-4 border rounded-[24px] transition-all group active:scale-95 ${isDayMode ? 'bg-orange-50 border-orange-200 hover:bg-orange-100' : 'bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/20'}`} onClick={() => {
                            navigate('/chats/11111111-0000-0000-0000-000000000000');
                        }}>
                            <div className={`w-12 h-12 rounded-[20px] ${isDayMode ? 'bg-[#0ea5e9]/20 text-[#0ea5e9]' : 'bg-blue-100 text-orange-600'} group-hover:bg-[#0ea5e9] group-hover:text-white flex items-center justify-center transition-colors shadow-lg shrink-0`}>
                                <Bot size={24} />
                            </div>
                            <div className="flex flex-col items-start font-black text-sm uppercase tracking-tight pt-0.5">
                                <span className={`text-[10px] tracking-widest leading-none mb-0.5 ${isDayMode ? 'text-[#0ea5e9]' : 'text-blue-400'}`}>Canal Directe</span>
                                <span className={`text-[15px] leading-tight text-left ${textColor}`}>Missatges per a dubtes</span>
                            </div>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button className={`flex items-center gap-3 p-4 border rounded-[24px] transition-all active:scale-95 ${cardBg} ${isDayMode ? 'hover:bg-gray-50' : 'hover:bg-white/10'}`} onClick={() => {
                            navigate('/notes');
                        }}>
                            <div className={`w-10 h-10 rounded-[28px] ${isDayMode ? 'bg-yellow-100 text-yellow-600' : 'bg-yellow-500/20 text-yellow-500'} flex items-center justify-center shrink-0`}>
                                <StickyNote size={18} />
                            </div>
                            <span className="font-bold text-sm tracking-tight text-left">Bloc de Notes</span>
                        </button>

                        <button className={`flex items-center gap-3 p-4 border rounded-[24px] transition-all active:scale-95 ${cardBg} ${isDayMode ? 'hover:bg-gray-50' : 'hover:bg-white/10'}`} onClick={() => {
                            navigate('/financament');
                        }}>
                            <div className={`w-10 h-10 rounded-[28px] ${isDayMode ? 'bg-emerald-100 text-emerald-600' : 'bg-emerald-500/20 text-emerald-500'} flex items-center justify-center shrink-0`}>
                                <Wallet size={18} />
                            </div>
                            <span className="font-bold text-sm tracking-tight text-left">Finançament</span>
                        </button>

                        <button className={`flex items-center gap-3 p-4 border rounded-[24px] transition-all active:scale-95 ${cardBg} ${isDayMode ? 'hover:bg-gray-50' : 'hover:bg-white/10'}`} onClick={() => {
                            navigate('/ofici');
                        }}>
                            <div className={`w-10 h-10 rounded-[28px] ${isDayMode ? 'bg-indigo-100 text-indigo-600' : 'bg-indigo-500/20 text-indigo-500'} flex items-center justify-center shrink-0`}>
                                <Terminal size={18} />
                            </div>
                            <span className="font-bold text-sm tracking-tight text-left">Sistema Operatiu</span>
                        </button>

                        <button className={`flex items-center gap-3 p-4 border rounded-[24px] transition-all active:scale-95 ${cardBg} ${isDayMode ? 'hover:bg-gray-50' : 'hover:bg-white/10'}`} onClick={() => {
                            navigate('/legal');
                        }}>
                            <div className={`w-10 h-10 rounded-[28px] ${isDayMode ? 'bg-orange-100 text-orange-600' : 'bg-orange-500/20 text-orange-500'} flex items-center justify-center shrink-0`}>
                                <FileText size={18} />
                            </div>
                            <span className="font-bold text-sm tracking-tight text-left">Info Legal</span>
                        </button>
                    </div>
                </div>

                {/* ADMIN SECTOR */}
                <div className={`pt-6 border-t ${isDayMode ? 'border-gray-200' : 'border-white/5'} space-y-3`}>
                    {(isSuperAdmin || isAdmin) && (
                        <button className={`w-full flex items-center justify-center gap-2 py-4 border rounded-[28px] text-xs font-black tracking-widest uppercase transition-colors ${isDayMode ? 'bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border-red-200' : 'bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white border-red-500/30'}`} onClick={() => {
                            navigate('/admin');
                        }}>
                            <Shield size={18} />
                            <span>Administració</span>
                        </button>
                    )}

                    <button className={`w-full flex items-center justify-center gap-2 py-4 rounded-[28px] transition-colors text-xs font-black tracking-widest uppercase ${isDayMode ? 'text-black/40 hover:text-black hover:bg-gray-100' : 'text-white/30 hover:text-white hover:bg-white/5'}`} onClick={() => {
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

