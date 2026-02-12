import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, Newspaper, Store, MapPin, Users, Shield, Calendar, Bot, Share2, Rocket, LogOut, BookOpen, StickyNote, FileText, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import './CreationHub.css';

const CreationHub = () => {
    const { t } = useTranslation();
    const {
        isCreateModalOpen,
        setIsCreateModalOpen,
        openPostModal,
        setIsEventModalOpen,
        setIsMarketModalOpen,
        setIsNotePadOpen
    } = useUI();
    const { isSuperAdmin, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    if (!isCreateModalOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop Blur Master (v10.20) */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" 
                onClick={() => setIsCreateModalOpen(false)}
            ></div>
            
            {/* Modal Content - Geometria Sagrada 40px */}
            <div className="relative w-full max-w-lg p-8 rounded-[40px] shadow-2xl transform animate-in zoom-in-95 duration-300 bg-[#1A1A1A] border border-slate-800 text-white overflow-hidden">
                <button 
                    onClick={() => setIsCreateModalOpen(false)} 
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors text-slate-400"
                >
                    <X size={24} />
                </button>
                
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto bg-[#4F46E5] rounded-full flex items-center justify-center mb-4 shadow-xl shadow-indigo-500/30">
                        <Plus className="w-10 h-10 text-white" strokeWidth={3} />
                    </div>
                    <h2 className="text-3xl font-bold mb-2 tracking-tight">
                        {t('common.create_new') || 'Què vols crear?'}
                    </h2>
                    <p className="text-lg text-slate-400">
                        Tria el tipus de publicació per al teu poble.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    {/* OPTION: MUR */}
                    <button className="creation-hub-btn group border-slate-700 hover:border-orange-500 hover:bg-slate-800" onClick={() => {
                        setIsCreateModalOpen(false);
                        openPostModal();
                    }}>
                        <div className="icon-wrap bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white">
                            <Newspaper size={28} />
                        </div>
                        <span className="font-bold">{t('nav.feed')}</span>
                    </button>

                    {/* OPTION: MERCAT */}
                    <button className="creation-hub-btn group border-slate-700 hover:border-emerald-500 hover:bg-slate-800" onClick={() => {
                        setIsCreateModalOpen(false);
                        setIsMarketModalOpen(true);
                    }}>
                        <div className="icon-wrap bg-emerald-100 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white">
                            <Store size={28} />
                        </div>
                        <span className="font-bold">{t('nav.market')}</span>
                    </button>

                    {/* OPTION: AGENDA */}
                    <button className="creation-hub-btn group border-slate-700 hover:border-blue-500 hover:bg-slate-800" onClick={() => {
                        setIsCreateModalOpen(false);
                        setIsEventModalOpen(true);
                    }}>
                        <div className="icon-wrap bg-blue-100 text-blue-600 group-hover:bg-blue-500 group-hover:text-white">
                            <Calendar size={28} />
                        </div>
                        <span className="font-bold">{t('nav.events') || 'Esdeveniment'}</span>
                    </button>

                    {/* OPTION: IAIA/BANDOS */}
                    <button className="creation-hub-btn group border-slate-700 hover:border-purple-500 hover:bg-slate-800" onClick={() => {
                        setIsCreateModalOpen(false);
                        navigate('/iaia');
                    }}>
                        <div className="icon-wrap bg-purple-100 text-purple-600 group-hover:bg-purple-500 group-hover:text-white">
                            <Bot size={28} />
                        </div>
                        <span className="font-bold">IAIA / Bandos</span>
                    </button>
                </div>

                {/* TOOLS SECTION (v10.20 EXTRA) */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                    <div className="grid grid-cols-2 gap-3">
                         <button className="tool-btn-alzina bg-slate-800 text-white" onClick={() => {
                            setIsCreateModalOpen(false);
                            setIsNotePadOpen(true);
                        }}>
                            <StickyNote size={18} />
                            <span>Notepad</span>
                        </button>

                        <button className="tool-btn-alzina bg-slate-800 text-white" onClick={() => {
                            setIsCreateModalOpen(false);
                            const shareData = {
                                title: 'Sóc de Poble',
                                text: 'Connecta amb la teua comunitat.',
                                url: window.location.origin
                            };
                            if (navigator.share) navigator.share(shareData);
                            else alert('Enllaç copiat!');
                        }}>
                            <Share2 size={18} />
                            <span>Compartir</span>
                        </button>
                    </div>

                    {(isSuperAdmin || isAdmin) && (
                        <button className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black transition-colors" onClick={() => {
                            setIsCreateModalOpen(false);
                            navigate('/admin');
                        }}>
                            <Shield size={18} />
                            <span>ADMINISTRACIÓ</span>
                        </button>
                    )}

                    <button className="w-full flex items-center justify-center gap-2 py-3 text-slate-500 hover:text-white transition-colors text-xs font-bold" onClick={() => {
                        setIsCreateModalOpen(false);
                        logout();
                        navigate('/login');
                    }}>
                        <LogOut size={16} />
                        <span>Eixir del poble</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreationHub;

