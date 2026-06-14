import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/context/AuthContext';
import { useModalDispatch } from '../../app/context/ModalContext';
import PageHeader from '../../components/layout/PageHeader';
import { UniversalButton as Button } from '../../components/ui/Button/UniversalButton';
import { Newspaper, Store, Calendar, MapPin, Bot, StickyNote, Shield, Cpu, LogOut } from 'lucide-react';
const HubView = () => {
  const {
    openPostModal,
    setIsEventModalOpen,
    setIsMarketModalOpen
  } = useModalDispatch();
  const {
    isSuperAdmin,
    isAdmin,
    logout,
    user
  } = useAuth();
  const navigate = useNavigate();
  return (
      <div className="min-h-full w-full bg-theme-base text-theme-text flex flex-col items-center transition-colors duration-500">
                
                <PageHeader title="Centre de Control" subtitle="Sóc de Poble V16.3" sticky={true} onBack={() => {
          if (window.history.length > 1) navigate(-1);else navigate('/mur');
        }} />

                <div className="w-full max-w-2xl space-y-8 p-4 pt-6 md:p-8 animate-in fade-in duration-500">
                    
                    {/* PRIMARY ACTIONS - The Big 5 */}
                    <div>
                        <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-theme-text/40 mb-4 pl-2">Accions Principals</h2>
                        <div className="flex flex-col gap-4">
                            
                            {/* THE MASTER BUTTON: Publicar al Mur */}
                            <button className='w-full flex items-center p-5 border border-sdp-theme-accent-primary/30 rounded-[28px] bg-gradient-to-r from-sdp-theme-accent-primary/10 to-transparent hover:from-sdp-theme-accent-primary/20 transition-all group active:scale-[0.98] shadow-sm' onClick={() => {
                if (user?.isAnonymous) navigate('/registre?returnTo=/hub');else openPostModal();
              }}>
                                <div className='w-14 h-14 rounded-[20px] bg-sdp-theme-accent-primary text-white flex items-center justify-center shrink-0 shadow-[0_0_20px_var(--theme-accent-primary)] opacity-90 group-data-[active=true]:opacity-100 group-data-[active=true]:scale-110 transition-transform'>
                                    <Newspaper size={28} />
                                </div>
                                <div className="flex flex-col items-start ml-5 text-left">
                                    <span className="font-sans text-[22px] font-black uppercase tracking-widest leading-none text-theme-text">Publicar al Mur</span>
                                    <span className='text-[13px] font-bold tracking-[0.2em] mt-1.5 uppercase text-sdp-theme-accent-primary'>Compartir novetats</span>
                                </div>
                            </button>

                            <button className="w-full flex items-center p-4 border border-theme-border rounded-[28px] bg-theme-panel/50 data-[active=true]:bg-theme-panel data-[active=true]:border-theme-text/20 transition-all group active:scale-[0.98] shadow-sm" data-active="false" onPointerEnter={(e) => e.currentTarget.dataset.active = "true"} onPointerLeave={(e) => e.currentTarget.dataset.active = "false"} onPointerCancel={(e) => e.currentTarget.dataset.active = "false"} onClick={() => {
                if (user?.isAnonymous) navigate('/registre?returnTo=/hub');else setIsMarketModalOpen(true);
              }}>
                                <div className="w-12 h-12 rounded-[18px] bg-black/5 dark:bg-white/5 text-theme-text/80 group-data-[active=true]:bg-theme-text group-data-[active=true]:text-theme-base flex items-center justify-center shrink-0 transition-colors" data-active="false" onPointerEnter={(e) => e.currentTarget.dataset.active = "true"} onPointerLeave={(e) => e.currentTarget.dataset.active = "false"} onPointerCancel={(e) => e.currentTarget.dataset.active = "false"}>
                                    <Store size={24} />
                                </div>
                                <span className="font-sans text-lg font-black uppercase tracking-widest leading-none text-theme-text ml-5 opacity-90 group-data-[active=true]:opacity-100" data-active="false" onPointerEnter={(e) => e.currentTarget.dataset.active = "true"} onPointerLeave={(e) => e.currentTarget.dataset.active = "false"} onPointerCancel={(e) => e.currentTarget.dataset.active = "false"}>Vendre al Mercat</span>
                            </button>

                            <button className="w-full flex items-center p-4 border border-theme-border rounded-[28px] bg-theme-panel/50 data-[active=true]:bg-theme-panel data-[active=true]:border-theme-text/20 transition-all group active:scale-[0.98] shadow-sm" data-active="false" onPointerEnter={(e) => e.currentTarget.dataset.active = "true"} onPointerLeave={(e) => e.currentTarget.dataset.active = "false"} onPointerCancel={(e) => e.currentTarget.dataset.active = "false"} onClick={() => {
                if (user?.isAnonymous) navigate('/registre?returnTo=/hub');else setIsEventModalOpen(true);
              }}>
                                <div className="w-12 h-12 rounded-[18px] bg-black/5 dark:bg-white/5 text-theme-text/80 group-data-[active=true]:bg-theme-text group-data-[active=true]:text-theme-base flex items-center justify-center shrink-0 transition-colors" data-active="false" onPointerEnter={(e) => e.currentTarget.dataset.active = "true"} onPointerLeave={(e) => e.currentTarget.dataset.active = "false"} onPointerCancel={(e) => e.currentTarget.dataset.active = "false"}>
                                    <Calendar size={24} />
                                </div>
                                <span className="font-sans text-lg font-black uppercase tracking-widest leading-none text-theme-text ml-5 opacity-90 group-data-[active=true]:opacity-100" data-active="false" onPointerEnter={(e) => e.currentTarget.dataset.active = "true"} onPointerLeave={(e) => e.currentTarget.dataset.active = "false"} onPointerCancel={(e) => e.currentTarget.dataset.active = "false"}>Crear Esdeveniment</span>
                            </button>

                            <button className="w-full flex items-center p-4 border border-theme-border rounded-[28px] bg-theme-panel/50 data-[active=true]:bg-theme-panel data-[active=true]:border-theme-text/20 transition-all group active:scale-[0.98] shadow-sm" data-active="false" onPointerEnter={(e) => e.currentTarget.dataset.active = "true"} onPointerLeave={(e) => e.currentTarget.dataset.active = "false"} onPointerCancel={(e) => e.currentTarget.dataset.active = "false"} onClick={() => navigate('/mapa')}>
                                <div className="w-12 h-12 rounded-[18px] bg-black/5 dark:bg-white/5 text-theme-text/80 group-data-[active=true]:bg-theme-text group-data-[active=true]:text-theme-base flex items-center justify-center shrink-0 transition-colors" data-active="false" onPointerEnter={(e) => e.currentTarget.dataset.active = "true"} onPointerLeave={(e) => e.currentTarget.dataset.active = "false"} onPointerCancel={(e) => e.currentTarget.dataset.active = "false"}>
                                    <MapPin size={24} />
                                </div>
                                <span className="font-sans text-lg font-black uppercase tracking-widest leading-none text-theme-text ml-5 opacity-90 group-data-[active=true]:opacity-100" data-active="false" onPointerEnter={(e) => e.currentTarget.dataset.active = "true"} onPointerLeave={(e) => e.currentTarget.dataset.active = "false"} onPointerCancel={(e) => e.currentTarget.dataset.active = "false"}>Veure Mapes</span>
                            </button>
                        </div>
                    </div>

                    {/* SECONDARY RESOURCES - Tools for the Mas */}
                    <div>
                        <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-theme-text/40 mb-4 pl-2">Recursos i Eines</h2>
                        
                        <div className="mb-3">
                            <button className="w-full h-full flex items-center justify-start gap-3 p-4 border border-theme-border rounded-[24px] bg-theme-panel/50 data-[active=true]:bg-theme-panel transition-all group active:scale-95 shadow-sm" data-active="false" onPointerEnter={(e) => e.currentTarget.dataset.active = "true"} onPointerLeave={(e) => e.currentTarget.dataset.active = "false"} onPointerCancel={(e) => e.currentTarget.dataset.active = "false"} onClick={() => navigate('/chats/11111111-0000-0000-0000-000000000000')}>
                                <div className="w-12 h-12 rounded-[20px] bg-[#0ea5e9]/10 text-[#0ea5e9] group-data-[active=true]:bg-[#0ea5e9] group-data-[active=true]:text-white flex items-center justify-center transition-colors shadow-sm shrink-0" data-active="false" onPointerEnter={(e) => e.currentTarget.dataset.active = "true"} onPointerLeave={(e) => e.currentTarget.dataset.active = "false"} onPointerCancel={(e) => e.currentTarget.dataset.active = "false"}>
                                    <Bot size={24} />
                                </div>
                                <div className="flex flex-col items-start font-black text-sm uppercase tracking-tight pt-0.5">
                                    <span className="text-xs tracking-[0.3em] leading-none mb-1.5 text-[#0ea5e9]">Canal Directe</span>
                                    <span className="font-sans text-base leading-none text-left text-theme-text font-black tracking-widest opacity-90">Missatges per a dubtes</span>
                                </div>
                            </button>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button intent="secondary" size="lg" fullWidth leftIcon={<StickyNote size={20} className="text-yellow-500" />} onClick={() => navigate('/notes')} className="min-h-[56px] justify-start rounded-[24px] font-sans text-base font-black uppercase tracking-widest text-theme-text bg-theme-panel/50 border border-theme-border hover:bg-theme-panel shadow-sm">
                                Bloc de Notes
                            </Button>

                            <Button intent="canonic" size="lg" fullWidth leftIcon={<Shield size={24} />} onClick={() => navigate('/el-projecte')} className="min-h-[64px] rounded-[24px] font-sans text-xl font-black uppercase tracking-widest mt-2 shadow-md hover:scale-[1.02] transition-transform">
                                EL PROJECTE
                            </Button>

                            {isSuperAdmin && <Button intent="ghost" size="lg" fullWidth leftIcon={<Cpu size={24} />} onClick={() => navigate('/ofici')} className="min-h-[56px] rounded-[24px] font-sans text-base font-black uppercase tracking-widest text-theme-text/60 hover:text-theme-text">
                                    SISTEMA OPERATIU
                                </Button>}
                        </div>
                    </div>

                    {/* ADMIN SECTOR */}
                    <div className="pt-6 border-t border-theme-border space-y-3">
                        {(isSuperAdmin || isAdmin) && <Button intent="danger" fullWidth leftIcon={<Shield size={18} />} onClick={() => navigate('/admin')} className="min-h-[56px] rounded-[28px] font-sans text-base font-black uppercase tracking-widest">
                                Administració
                            </Button>}

                        <Button intent="ghost" fullWidth leftIcon={<LogOut size={16} />} onClick={() => {
              logout();
              navigate('/');
            }} className="min-h-[56px] rounded-[28px] font-sans text-base font-black uppercase tracking-widest text-theme-text/40 hover:text-red-500 bg-transparent hover:bg-red-500/10 transition-colors">
                            Eixir del Poble
                        </Button>
                    </div>

                </div>
            </div>
  );
};
export default HubView;