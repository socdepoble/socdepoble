import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/context/AuthContext';
import { useModalDispatch } from '../../app/context/ModalContext';
import PageHeader from '../../components/layout/PageHeader';
import { UniversalButton as Button } from '../../components/ui/Button/UniversalButton';
import { Newspaper, Store, Calendar, MapPin, Bot, StickyNote, Shield, Cpu, LogOut } from 'lucide-react';

const HubView = () => {
  const { openPostModal, setIsEventModalOpen, setIsMarketModalOpen } = useModalDispatch();
  const { isSuperAdmin, isAdmin, logout, user } = useAuth();
  const navigate = useNavigate();

  return (
      <div className="min-h-full w-full bg-white text-gray-900 flex flex-col items-center transition-colors duration-500">
                <PageHeader title="Centre de Control" subtitle="Sóc de Poble V16.3" sticky={true} onBack={() => {
          if (window.history.length > 1) navigate(-1);else navigate('/mur');
        }} />

                <div className="w-full max-w-2xl space-y-8 p-4 pt-6 md:p-8 animate-in fade-in duration-500">
                    
                    {/* PRIMARY ACTIONS - The Big 5 */}
                    <div>
                        <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 mb-4 pl-2 m-0">Accions Principals</h2>
                        <div className="flex flex-col gap-4">
                            
                            {/* THE MASTER BUTTON: Publicar al Mur */}
                            <button className='w-full flex items-center p-5 border border-orange-200 rounded-[28px] bg-gradient-to-r from-orange-50 to-transparent hover:from-orange-100 transition-all group active:scale-[0.98] shadow-sm' onClick={() => {
                if (user?.isAnonymous) navigate('/registre?returnTo=/hub');else openPostModal();
              }}>
                                <div className='w-14 h-14 rounded-[20px] bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-transform'>
                                    <Newspaper size={28} />
                                </div>
                                <div className="flex flex-col items-start ml-5 text-left">
                                    <span className="font-sans text-[22px] font-black uppercase tracking-widest leading-none text-gray-900">Publicar al Mur</span>
                                    <span className='text-[13px] font-bold tracking-[0.2em] mt-1.5 uppercase text-orange-600'>Compartir novetats</span>
                                </div>
                            </button>

                            <button className="w-full flex items-center p-4 border border-gray-200 rounded-[28px] bg-gray-50 hover:bg-white hover:border-gray-300 transition-all group active:scale-[0.98] shadow-sm" onClick={() => {
                if (user?.isAnonymous) navigate('/registre?returnTo=/hub');else setIsMarketModalOpen(true);
              }}>
                                <div className="w-12 h-12 rounded-[18px] bg-gray-200 text-gray-600 group-hover:bg-gray-900 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                                    <Store size={24} />
                                </div>
                                <span className="font-sans text-lg font-black uppercase tracking-widest leading-none text-gray-900 ml-5 opacity-90 group-hover:opacity-100">Vendre al Mercat</span>
                            </button>

                            <button className="w-full flex items-center p-4 border border-gray-200 rounded-[28px] bg-gray-50 hover:bg-white hover:border-gray-300 transition-all group active:scale-[0.98] shadow-sm" onClick={() => {
                if (user?.isAnonymous) navigate('/registre?returnTo=/hub');else setIsEventModalOpen(true);
              }}>
                                <div className="w-12 h-12 rounded-[18px] bg-gray-200 text-gray-600 group-hover:bg-gray-900 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                                    <Calendar size={24} />
                                </div>
                                <span className="font-sans text-lg font-black uppercase tracking-widest leading-none text-gray-900 ml-5 opacity-90 group-hover:opacity-100">Crear Esdeveniment</span>
                            </button>

                            <button className="w-full flex items-center p-4 border border-gray-200 rounded-[28px] bg-gray-50 hover:bg-white hover:border-gray-300 transition-all group active:scale-[0.98] shadow-sm" onClick={() => navigate('/mapa')}>
                                <div className="w-12 h-12 rounded-[18px] bg-gray-200 text-gray-600 group-hover:bg-gray-900 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                                    <MapPin size={24} />
                                </div>
                                <span className="font-sans text-lg font-black uppercase tracking-widest leading-none text-gray-900 ml-5 opacity-90 group-hover:opacity-100">Veure Mapes</span>
                            </button>
                        </div>
                    </div>

                    {/* SECONDARY RESOURCES - Tools for the Mas */}
                    <div>
                        <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500 mb-4 pl-2 m-0">Recursos i Eines</h2>
                        
                        <div className="mb-3">
                            <button className="w-full h-full flex items-center justify-start gap-3 p-4 border border-gray-200 rounded-[24px] bg-gray-50 hover:bg-white transition-all group active:scale-95 shadow-sm" onClick={() => navigate('/chats/11111111-0000-0000-0000-000000000000')}>
                                <div className="w-12 h-12 rounded-[20px] bg-sky-100 text-sky-500 group-hover:bg-sky-500 group-hover:text-white flex items-center justify-center transition-colors shadow-sm shrink-0">
                                    <Bot size={24} />
                                </div>
                                <div className="flex flex-col items-start font-black text-sm uppercase tracking-tight pt-0.5">
                                    <span className="text-xs tracking-[0.3em] leading-none mb-1.5 text-sky-500">Canal Directe</span>
                                    <span className="font-sans text-base leading-none text-left text-gray-900 font-black tracking-widest opacity-90">Missatges per a dubtes</span>
                                </div>
                            </button>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button intent="secondary" size="lg" fullWidth leftIcon={<StickyNote size={20} className="text-yellow-500" />} onClick={() => navigate('/notes')} className="min-h-[56px] justify-start rounded-[24px] font-sans text-base font-black uppercase tracking-widest text-gray-900 bg-gray-50 border border-gray-200 hover:bg-white shadow-sm">
                                Bloc de Notes
                            </Button>

                            <Button intent="canonic" size="lg" fullWidth leftIcon={<Shield size={24} />} onClick={() => navigate('/el-projecte')} className="min-h-[64px] rounded-[24px] font-sans text-xl font-black uppercase tracking-widest mt-2 shadow-md hover:scale-[1.02] transition-transform">
                                EL PROJECTE
                            </Button>

                            {isSuperAdmin && <Button intent="ghost" size="lg" fullWidth leftIcon={<Cpu size={24} />} onClick={() => navigate('/ofici')} className="min-h-[56px] rounded-[24px] font-sans text-base font-black uppercase tracking-widest text-gray-500 hover:text-gray-900">
                                    SISTEMA OPERATIU
                                </Button>}
                        </div>
                    </div>

                    {/* ADMIN SECTOR */}
                    <div className="pt-6 border-t border-gray-200 space-y-3">
                        {(isSuperAdmin || isAdmin) && <Button intent="danger" fullWidth leftIcon={<Shield size={18} />} onClick={() => navigate('/admin')} className="min-h-[56px] rounded-[28px] font-sans text-base font-black uppercase tracking-widest">
                                Administració
                            </Button>}

                        <Button intent="ghost" fullWidth leftIcon={<LogOut size={16} />} onClick={() => {
              logout();
              navigate('/');
            }} className="min-h-[56px] rounded-[28px] font-sans text-base font-black uppercase tracking-widest text-gray-500 hover:text-red-500 bg-transparent hover:bg-red-50 transition-colors">
                            Eixir del Poble
                        </Button>
                    </div>

                </div>
            </div>
  );
};
export default HubView;