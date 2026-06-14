import './CalendarManagerModal.css';
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
      <div className="calendar-modal-overlay animate-in" onClick={onClose}>
                <div className="calendar-modal-content" onClick={e => e.stopPropagation()}>
                    <div role="region" aria-label="Capçalera de Secció" className="calendar-modal-header">
                        <div className="title-group">
                            <Settings size={22} className='text-sdp-theme-accent-primary' />
                            <h2>TRAMPANTE OAUTH2 & SDB</h2>
                        </div>
                        <button className="btn-close-modal" onClick={onClose}><X size={20} /></button>
                    </div>

                    <div className="calendar-modal-body overflow-y-auto max-h-[70vh]">
                        
                        {/* SECCIÓ CALENDARIS SÓC DE POBLE (INTERNS) */}
                        <div className='oauth-dashboard mb-6 pb-6 border-b border-sdp-border-master'>
                            <div className="dashboard-header-flex mb-2">
                                <h3 className="flex items-center gap-2 text-emerald-400">
                                    <Layers size={18} /> Equips Sóc de Poble
                                </h3>
                            </div>
                            <p className="dashboard-explanation text-sm mb-4">
                                Sincronització automàtica i interaccions d'Agents IA en Sóc de Poble. 
                            </p>
                            <div className="calendars-list">
                                {internalCalendars.map(cal => {
                  const isSelected = selectedInternalCalIds.includes(cal.id);
                  return <div key={cal.id} className={`calendar-item-row ${isSelected ? 'row-active' : ''}`}>
                                            <div className="cal-info">
                                                <div className="cal-color-dot" style={{
                        backgroundColor: cal.color_id || '#169CF9'
                      }} />
                                                <span className="cal-name truncate font-sans font-bold text-white text-[15px] max-w-[200px]">
                                                    {cal.name}
                                                </span>
                                            </div>
                                            <div className="cal-actions">
                                                <label className="cal-visibility-toggle">
                                                    <input type="checkbox" checked={isSelected} onChange={() => toggleInternalCalendar(cal.id)} />
                                                    <div className="checkbox-visual">
                                                        {isSelected && <Check size={14} color="#000" />}
                                                    </div>
                                                </label>
                                            </div>
                                        </div>;
                })}
                                {internalCalendars.length === 0 && <div className='p-4 text-center text-sdp-text-muted italic text-sm'>
                                        No hi ha equips disponibles per al teu perfil.
                                    </div>}
                            </div>
                        </div>

                        {/* SECCIÓ GOOGLE CALENDAR */}
                        {!token ? <div className="oauth-login-box">
                                <Brain size={40} className="mb-4 text-emerald-400" />
                                <h3>Connecta el teu Cervell</h3>
                                <p>Vincula el teu compte de Google per importar i exportar memòries vitals pròpies.</p>
                                <button className="btn-oauth-login mt-4" onClick={() => login()}>
                                    <CalendarIcon size={18} /> INICIAR SESSIÓ AMB GOOGLE
                                </button>
                            </div> : <div className="oauth-dashboard">
                                <div className="dashboard-header-flex">
                                    <h3>Google Calendar Personal</h3>
                                    <button className="btn-oauth-logout" onClick={() => logout()}>
                                        <LogOut size={16} /> DESCONNECTAR
                                    </button>
                                </div>
                                
                                <p className="dashboard-explanation">
                                    Escull quins calendaris es previsualitzaran a la teua reixa (👁️) i quin serà el teu "Host" (✍️).
                                </p>

                                <div className="calendars-list">
                                    {calendars.map(cal => {
                  const isSelected = selectedCalIds.includes(cal.id);
                  const isHost = hostCalId === cal.id;
                  return <div key={cal.id} className={`calendar-item-row ${isSelected ? 'row-active' : ''}`}>
                                                <div className="cal-info">
                                                    <div className="cal-color-dot" style={{
                        backgroundColor: cal.backgroundColor || '#ccc'
                      }} />
                                                    <span className="cal-name truncate font-sans font-bold text-white text-[15px] max-w-[180px]">
                                                        {cal.summaryOverride || cal.summary}
                                                    </span>
                                                </div>
                                                
                                                <div className="cal-actions">
                                                    <button className={`btn-host-toggle ${isHost ? 'host-active' : ''}`} onClick={() => toggleHost(cal.id)} title="Fer d'asentament principal (Host)">
                                                        <PenTool size={16} />
                                                    </button>

                                                    <label className="cal-visibility-toggle">
                                                        <input type="checkbox" checked={isSelected} onChange={() => toggleCalendar(cal.id)} />
                                                        <div className="checkbox-visual">
                                                            {isSelected && <Check size={14} color="#000" />}
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>;
                })}
                                    {calendars.length === 0 && <div className='p-4 text-center text-sdp-text-muted italic'>
                                            Carregant els teus sub-dorsals mentals...
                                        </div>}
                                </div>
                            </div>}
                    </div>
                </div>
            </div>
  );
};
export default CalendarManagerModal;