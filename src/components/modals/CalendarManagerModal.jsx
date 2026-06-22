import { Settings, X, Layers, Check, Brain, Calendar as CalendarIcon, LogOut, PenTool } from 'lucide-react';

const CalendarManagerModal = ({
  isOpen,
  onClose,
  calendars,
  selectedCalIds,
  toggleCalendar,
  hostCalId,
  toggleHost,
  token,
  login,
  logout,
  internalCalendars = [],
  selectedInternalCalIds = [],
  toggleInternalCalendar = () => {}
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-modal flex items-center justify-center p-4 animate-in fade-in" onClick={onClose}>
        <div className="bg-white border border-gray-200 rounded-[28px] w-full max-w-md shadow-sm overflow-hidden relative flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            
            <div role="region" aria-label="Capçalera de Secció" className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <Settings size={22} className='text-orange-500' />
                    <h2 className="text-xl font-black uppercase tracking-widest text-gray-900 m-0">TRAMPANTE OAUTH2 & SDB</h2>
                </div>
                <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-500 transition-colors" onClick={onClose}>
                    <X size={20} />
                </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 flex flex-col bg-gray-50">
                
                {/* SECCIÓ CALENDARIS SÓC DE POBLE (INTERNS) */}
                <div className='mb-6 pb-6 border-b border-gray-200 flex flex-col'>
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="flex items-center gap-2 text-emerald-600 font-bold m-0 text-lg">
                            <Layers size={18} /> Equips Sóc de Poble
                        </h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-4 m-0">
                        Sincronització automàtica i interaccions d'Agents IA en Sóc de Poble. 
                    </p>
                    <div className="flex flex-col gap-2">
                        {internalCalendars.map(cal => {
                            const isSelected = selectedInternalCalIds.includes(cal.id);
                            return (
                                <div key={cal.id} className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${isSelected ? 'bg-white border-emerald-200 shadow-sm' : 'bg-transparent border-transparent hover:bg-gray-100'}`}>
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cal.color_id || '#10b981' }} />
                                        <span className="truncate font-bold text-gray-900 text-[15px] m-0">
                                            {cal.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <label className="relative cursor-pointer w-7 h-7 flex items-center justify-center">
                                            <input type="checkbox" className="sr-only" checked={isSelected} onChange={() => toggleInternalCalendar(cal.id)} />
                                            <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors border ${isSelected ? 'bg-emerald-500 border-emerald-500' : 'bg-gray-100 border-gray-300 hover:bg-gray-200'}`}>
                                                {isSelected && <Check size={14} color="#fff" strokeWidth={3} />}
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            );
                        })}
                        {internalCalendars.length === 0 && (
                            <div className='p-4 text-center text-gray-400 italic text-sm border border-dashed border-gray-300 rounded-xl'>
                                No hi ha equips disponibles per al teu perfil.
                            </div>
                        )}
                    </div>
                </div>

                {/* SECCIÓ GOOGLE CALENDAR */}
                {!token ? (
                    <div className="p-8 flex flex-col items-center text-center gap-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
                        <Brain size={40} className="text-emerald-500 mb-2" />
                        <h3 className="text-xl font-black text-gray-900 m-0">Connecta el teu Cervell</h3>
                        <p className="text-gray-500 text-sm m-0">Vincula el teu compte de Google per importar i exportar memòries vitals pròpies.</p>
                        <button className="mt-4 bg-white border border-gray-300 text-gray-900 py-3 px-6 rounded-full font-bold text-sm tracking-wide flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm" onClick={() => login()}>
                            <CalendarIcon size={18} /> INICIAR SESSIÓ AMB GOOGLE
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-bold text-gray-900 m-0">Google Calendar Personal</h3>
                            <button className="bg-red-50 text-red-500 border border-red-100 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-red-100 transition-colors" onClick={() => logout()}>
                                <LogOut size={14} /> DESCONNECTAR
                            </button>
                        </div>
                        
                        <p className="text-sm text-gray-500 mb-4 m-0">
                            Escull quins calendaris es previsualitzaran a la teua reixa (👁️) i quin serà el teu "Host" (✍️).
                        </p>

                        <div className="flex flex-col gap-2">
                            {calendars.map(cal => {
                                const isSelected = selectedCalIds.includes(cal.id);
                                const isHost = hostCalId === cal.id;
                                return (
                                    <div key={cal.id} className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${isSelected ? 'bg-white border-blue-200 shadow-sm' : 'bg-transparent border-transparent hover:bg-gray-100'}`}>
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cal.backgroundColor || '#ccc' }} />
                                            <span className="truncate font-bold text-gray-900 text-[15px] m-0">
                                                {cal.summaryOverride || cal.summary}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center gap-3">
                                            <button className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isHost ? 'bg-orange-500 text-white shadow-sm' : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-900'}`} onClick={() => toggleHost(cal.id)} title="Fer d'asentament principal (Host)">
                                                <PenTool size={14} />
                                            </button>

                                            <label className="relative cursor-pointer w-7 h-7 flex items-center justify-center">
                                                <input type="checkbox" className="sr-only" checked={isSelected} onChange={() => toggleCalendar(cal.id)} />
                                                <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors border ${isSelected ? 'bg-blue-500 border-blue-500' : 'bg-gray-100 border-gray-300 hover:bg-gray-200'}`}>
                                                    {isSelected && <Check size={14} color="#fff" strokeWidth={3} />}
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                );
                            })}
                            {calendars.length === 0 && (
                                <div className='p-4 text-center text-gray-400 italic text-sm border border-dashed border-gray-300 rounded-xl'>
                                    Carregant els teus sub-dorsals mentals...
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};
export default CalendarManagerModal;