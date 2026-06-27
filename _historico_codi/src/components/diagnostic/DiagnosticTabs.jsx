import { RURAL_PALETTE } from '../../constants/ruralColors';

export const DiagnosticFAQTab = ({ didacticData }) => {
    return (
        <section className="hud-panel full-width">
            <div className="panel-header">
                <Brain size={16} color="var(--hud-accent)" />
                <h3>AGÈNDA DE DUBTES (IAIA)</h3>
            </div>
            <div className="panel-content" style={{ padding: '20px' }}>
                <p style={{ fontStyle: 'italic', marginBottom: '20px', opacity: 0.8 }}>{didacticData?.master_faq?.explanation}</p>
                <div className="faq-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {didacticData?.master_faq?.details?.map((item, i) => {
                        const [q, a] = item.split('\n');
                        return (
                            <div key={i} className="faq-item" style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '0px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <strong style={{ color: 'var(--hud-accent)', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                                    {q ? q.replace(/\*\*/g, '') : ''}
                                </strong>
                                <p style={{ fontSize: '13px', lineHeight: '1.5', opacity: 0.9 }}>{a}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export const DiagnosticReportsTab = ({ techReport, i18n }) => {
    return (
        <section className="hud-panel full-width">
            <div className="panel-header">
                <Shield size={16} />
                <h3>INFORME TÈCNIC VIVID</h3>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                    <a href={`/TECHNICAL_REPORT_VIVO${i18n.language === 'es' ? '_ES' : ''}.md`} download className="btn-hud-outline small">MD</a>
                    <button className="btn-hud-outline small" onClick={() => window.print()}>PDF / IMPRIMIR</button>
                </div>
            </div>
            <div className="tech-report-content" style={{ padding: '20px', fontSize: '14px', lineHeight: '1.6', maxHeight: '500px', overflowY: 'auto' }}>
                {techReport ? (
                    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', opacity: 0.9 }}>
                        {techReport}
                    </pre>
                ) : (
                    <div className="pulse-slow">Sichronitzant amb el Rebost de l'IAIA...</div>
                )}
            </div>
        </section>
    );
};

export const DiagnosticForensicTab = ({ forensicService, setLogs }) => {
    const reports = forensicService.getLatestReports();
    return (
        <section className="hud-panel full-width">
            <div className="panel-header">
                <Shield size={16} color="#ff0055" />
                <h3>REPORTS FORENSES [CRITICAL]</h3>
                <button className="btn-hud-outline small ml-auto" onClick={() => {
                    forensicService.clearReports();
                    setLogs(prev => [...prev]); // Trigger re-render in parent safely
                }}>NETEJAR</button>
            </div>
            <div className="forensic-reports-container">
                {reports.length === 0 ? (
                    <div className="p-4 text-center opacity-40">No hi ha reports actius. El bategat és pur.</div>
                ) : (
                    reports.reverse().map(report => (
                        <div key={report.id} className="forensic-card status-critical">
                            <div className="forensic-card-header">
                                <div className="forensic-card-title">
                                    <Activity size={14} color="#ff0055" />
                                    <h4 style={{ color: '#ff0055' }}>{report.type}</h4>
                                </div>
                                <span className="forensic-timestamp">{new Date(report.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <p className="forensic-summary" style={{ fontWeight: 'bold' }}>{report.error}</p>
                            <div className="forensic-details" style={{ fontSize: '11px', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '4px', marginTop: '8px', overflowX: 'auto' }}>
                                <pre>{report.stack?.substring(0, 300)}...</pre>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export const DiagnosticTerminalTab = ({ currentHudTab, logs, terminalRef, analyzeErrorWithIAIA }) => {
    return (
        <section className="hud-panel full-width">
            <div className="panel-header"><Terminal size={16} /> <h3>{currentHudTab.toUpperCase()}</h3></div>
            <div className="hud-terminal-container">
                <div className="hud-terminal" ref={terminalRef}>
                    {logs.filter(log => {
                        if (currentHudTab === 'sync') return log.msg.includes('SYNC') || log.msg.includes('Rhizome') || log.type === 'system';
                        if (currentHudTab === 'rendiment') return log.type === 'info' && !log.msg.includes('SYNC') && !log.msg.includes('Rhizome');
                        if (currentHudTab === 'errors') return log.type === 'error' || log.type === 'warn';
                        return true; // logs tab shows everything
                    }).map((log, idx) => (
                        <div key={`${log.id}-${idx}`} className={`log-line ${log.type}`}>
                            <span className="log-time">[{log.time}]</span>
                            <span className="log-origin">[{log.origin}]</span>
                            <span className="log-msg flex-1 break-all">{log.msg}</span>
                            {(log.type === 'error' || log.type === 'critical') && (
                                <button 
                                    className="ml-2 bg-[#ff0055]/20 hover:bg-[#ff0055]/40 text-[#ff0055] rounded-[28px] p-1 transition-colors"
                                    title="Analitzar amb IAIA (Chrome DevTools Alternative)"
                                    onClick={() => analyzeErrorWithIAIA(log.msg)}
                                >
                                    <Brain size={12} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export const DiagnosticStyleTab = ({ themeConfig, updateConfig, ruralInfo, requestGeolocation, toggleDesktopMode, validateContrast, resetToMasia }) => {
    return (
        <section className="hud-panel full-width style-tuner-panel">
            <div className="panel-header"><Zap size={16} /> <h3>TUNER D'ESTIL SOBIRÀ</h3></div>
            <div className="panel-content tuner-grid">
                <div className="tuner-item">
                    <label>Escala de Batec (Font Size)</label>
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            min="0.8"
                            max="1.5"
                            step="0.1"
                            value={themeConfig.fontScale}
                            onChange={(e) => updateConfig({ fontScale: parseFloat(e.target.value) })}
                        />
                        <span className="badge-value">{themeConfig.fontScale}x</span>
                    </div>
                </div>

                <div className="tuner-item">
                    <label>Color d'Accent: <strong style={{ color: 'var(--hud-accent)' }}>{ruralInfo.label}</strong></label>
                    <div className="rural-swatches">
                        {RURAL_PALETTE.map(color => (
                            <button
                                key={color.hex}
                                className={`swatch ${ruralInfo.hex === color.hex ? 'active' : ''}`}
                                style={{ backgroundColor: color.hex }}
                                title={color.name}
                                onClick={() => updateConfig({ primaryColor: color.hex })}
                                aria-label={color.name}
                            />
                        ))}
                    </div>
                    <p className="tuner-hint">{ruralInfo.desc}</p>
                </div>

                <div className="tuner-item">
                    <label>Maquinària i Geolocalització</label>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <button className="btn-hud-outline" onClick={requestGeolocation} style={{ flex: 1 }}>
                            <Locate size={14} /> LOCALITZAR MAC
                        </button>
                        <button className={`btn-hud-outline ${themeConfig.isDesktopOptimized ? 'active' : ''}`} onClick={toggleDesktopMode} style={{ flex: 1 }}>
                            {themeConfig.isDesktopOptimized ? <Monitor size={14} /> : <Smartphone size={14} />}
                            {themeConfig.isDesktopOptimized ? 'MODE DESKTOP' : 'MODE MÒBIL'}
                        </button>
                    </div>
                </div>

                <div className="tuner-item status">
                    <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                            <ShieldCheck size={14} color={validateContrast(themeConfig.primaryColor) ? "#00f2ff" : "#ff4444"} />
                            Aesthetics Guard: {validateContrast(themeConfig.primaryColor) ? 'Optimum' : 'Alerta de Lectura'}
                        </span>
                        <button className="btn-restore-masia" onClick={resetToMasia}>RESTAURAR MASIA</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export const DiagnosticSystemTab = ({ i18n, hudActivity, isHealing, VERSION, setDidacticAlert, didacticData, user, profile, visionMode, isAdmin, forceNukeSimulation, showHelp }) => {
    return (
        <div className="system-grid">
            <section className="hud-panel full-width">
                <div className="panel-header"><RefreshCw size={16} /> <h3>IDIOMA (PROTOCOL THORSTEN)</h3></div>
                <div className="panel-content">
                    <div className="language-selector-grid">
                        {['ca', 'es', 'en', 'eu', 'gl'].map(lang => (
                            <button
                                key={lang}
                                className={`btn-hud-lang ${i18n.language === lang ? 'active' : ''}`}
                                onClick={() => i18n.changeLanguage(lang)}
                            >
                                {lang.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="hud-panel widgets-panel full-width">
                <div className="panel-header"><Zap size={16} /> <h3>ESTAT DE LA MAQUINÀRIA [SOLATGE]</h3></div>
                <div className="hud-widgets-row">
                    <SyncEngine active={hudActivity.syncing || isHealing} />
                    <DataSifter vibrating={hudActivity.sifting} />
                    <BufferHopper level={hudActivity.bufferLevel} />
                    <RhizomeIntegrity amnesic={true} version={VERSION} />
                </div>
            </section>
            
            <section className="hud-panel" onClick={() => showHelp && setDidacticAlert(didacticData.identity)}>
                <div className="panel-header"><User size={16} /> <h3>SESSIÓ</h3></div>
                <div className="panel-content">
                    <div className="session-info-grid">
                        <div className="session-item">
                            <label>ID</label>
                            <code>{user?.id?.substring(0, 8) || 'GUEST'}</code>
                        </div>
                        <div className="session-item">
                            <label>ROL</label>
                            <span className="badge-role">{profile?.role || 'convidat'}</span>
                        </div>
                        <div className="session-item">
                            <label>Vcrit</label>
                            <code>{VERSION}</code>
                        </div>
                        <div className="session-item">
                            <label>Hibrid</label>
                            <code>{visionMode}</code>
                        </div>
                    </div>
                    {isAdmin && (
                        <button className="btn-nuke-sim" onClick={() => forceNukeSimulation()}>SIMULAR NUKE</button>
                    )}
                </div>
            </section>
            
            <section className="hud-panel" onClick={() => showHelp && setDidacticAlert(didacticData.pulse)}>
                <div className="panel-header"><Activity size={16} /> <h3>XARXA</h3></div>
                <div className="panel-content">
                    <div className="data-row"><span>Estat:</span> <strong className="status-ok">ESTABLE</strong></div>
                </div>
            </section>
        </div>
    );
};
