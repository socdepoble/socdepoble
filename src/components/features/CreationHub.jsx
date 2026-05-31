import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../app/context/AuthContext';
import { useModalDispatch } from '../../app/context/ModalContext';
import './CreationHub.css';

const CreationHub = () => {
    const { setIsCreateModalOpen, openPostModal, setIsEventModalOpen, setIsMarketModalOpen, setIsNotePadOpen } = useModalDispatch();
    const { t } = useTranslation();
    const { isSuperAdmin, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    const dispatchAction = (action) => {
        setIsCreateModalOpen(false);
        action();
    };

    return (
        <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
            {/* Backdrop Blur Master (v10.20) */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-md" 
                onClick={() => dispatchAction(() => {})}
            ></div>
            
            {/* Modal Content - Geometria Sagrada 32px */}
            <div className="relative z-50 w-full max-w-lg p-6 rounded-[32px] shadow-2xl bg-[#0A0A0A] border border-white/10 text-white animate-in zoom-in-95">
                <button 
                    id="hub-close-btn"
                    onClick={() => dispatchAction(() => {})} 
                    className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center rounded-[28px] bg-white/5 hover:bg-white/10 text-white shadow-lg transition-all active:scale-95 z-10 outline-none"
                    aria-label="Tancar"
                >
                    <X size={24} />
                </button>
                
                <div className="text-center mb-6 mt-2 relative z-10">
                    <div className="w-16 h-16 mx-auto bg-[#0984E3] rounded-[28px] flex items-center justify-center mb-4 shadow-xl shadow-[#0984E3]/20">
                        <Plus className="w-8 h-8 text-white" strokeWidth={3} />
                    </div>
                    <h2 className="text-3xl font-bold mb-2 tracking-tight">
                        {t('common.create_new', 'Què vols obrir?')}
                    </h2>
                    <p className="text-[15px] font-medium text-white/50">
                        Accedeix a les opcions de Sóc de Poble.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
                    {/* OPTION: MUR */}
                    <button className="creation-hub-btn outline-none" onClick={() => dispatchAction(openPostModal)}>
                        <div className="icon-wrap">
                            <Newspaper size={28} strokeWidth={2.5} />
                        </div>
                        <span className="font-bold tracking-wide">{t('nav.feed', 'Mur')}</span>
                    </button>

                    {/* OPTION: MERCAT */}
                    <button className="creation-hub-btn outline-none" onClick={() => dispatchAction(() => setIsMarketModalOpen(true))}>
                        <div className="icon-wrap">
                            <Store size={28} strokeWidth={2.5} />
                        </div>
                        <span className="font-bold tracking-wide">{t('nav.market', 'Mercat')}</span>
                    </button>

                    {/* OPTION: AGENDA */}
                    <button className="creation-hub-btn outline-none" onClick={() => dispatchAction(() => setIsEventModalOpen(true))}>
                        <div className="icon-wrap">
                            <Calendar size={28} strokeWidth={2.5} />
                        </div>
                        <span className="font-bold tracking-wide">{t('nav.events', 'Agenda')}</span>
                    </button>

                    {/* OPTION: PROJECTE */}
                    <button className="creation-hub-btn outline-none" onClick={() => dispatchAction(() => navigate('/el-projecte'))}>
                        <div className="icon-wrap">
                            <BookOpen size={28} strokeWidth={2.5} />
                        </div>
                        <span className="font-bold tracking-wide">{t('nav.project', 'El Projecte')}</span>
                    </button>
                </div>

                {/* TOOLS SECTION */}
                <div className="space-y-3 pt-4 border-t border-white/5 relative z-10">
                    <div className="grid grid-cols-3 gap-3">
                         <button className="tool-btn-alzina tool-btn-primary outline-none" onClick={() => dispatchAction(() => navigate('/agents'))}>
                            <Bot size={18} strokeWidth={2.5} />
                            <span>L'Equip</span>
                        </button>

                         <button className="tool-btn-alzina outline-none" onClick={() => dispatchAction(() => setIsNotePadOpen(true))}>
                            <StickyNote size={18} />
                            <span>Notes</span>
                        </button>

                        <button className="tool-btn-alzina outline-none" onClick={() => dispatchAction(() => {
                            const shareData = {
                                title: 'Sóc de Poble',
                                text: 'Connecta amb la teua comunitat.',
                                url: window.location.origin
                            };
                            if (navigator.share) navigator.share(shareData);
                            else alert('Enllaç copiat!');
                        })}>
                            <Share2 size={18} />
                            <span>Compartir</span>
                        </button>
                    </div>

                    {(isSuperAdmin || isAdmin) && (
                        <button className="w-full flex items-center justify-center gap-2 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-[24px] text-[13px] font-black transition-colors outline-none tracking-widest uppercase border border-red-500/20" onClick={() => dispatchAction(() => navigate('/admin'))}>
                            <Shield size={18} />
                            <span>Administració</span>
                        </button>
                    )}

                    <button className="w-full flex items-center justify-center gap-2 py-4 text-white/40 hover:text-white/80 transition-colors text-[13px] font-bold outline-none uppercase tracking-widest" onClick={() => dispatchAction(() => {
                        logout();
                        navigate('/login');
                    })}>
                        <LogOut size={16} />
                        <span>Eixir del poble</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreationHub;

