import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Shield, Cpu, Activity, Zap, X, Eye, Camera, Trash2, Info, Copy, Check, Brain, Link2, RefreshCw, User } from 'lucide-react';
import { notebookService } from '../services/notebookService';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { didacticData } from '../data/didacticData';
import './DiagnosticConsole.css';

const DiagnosticConsole = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [screenshotMode, setScreenshotMode] = useState(false);
    const [logs, setLogs] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, profile, isAdmin, forceNukeSimulation } = useAuth();
    const { visionMode } = useUI();
    const location = useLocation();
    const [showHelp, setShowHelp] = useState(false);
    const [copied, setCopied] = useState(false);
    const terminalRef = useRef(null);

    const [didacticAlert, setDidacticAlert] = useState(null);
    const [cognitiveHealth, setCognitiveHealth] = useState({ sources: 0, health: 'Optim' });
    const [verifyingIntegrity, setVerifyingIntegrity] = useState(false);

    const helpContext = didacticData;

    const addHudLog = (type, args) => {
        const msg = args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg).substring(0, 100) : String(arg)
        ).join(' ');

        setLogs(prev => [{
            id: Date.now() + Math.random(),
            time: new Date().toLocaleTimeString(),
            type,
            msg
        }, ...prev].slice(0, 50));
    };

    useEffect(() => {
        const originalLog = console.log;
        const originalWarn = console.warn;
        const originalError = console.error;

        console.log = (...args) => {
            originalLog(...args);
            addHudLog('info', args);
        };
        console.warn = (...args) => {
            originalWarn(...args);
            addHudLog('warn', args);
        };
        console.error = (...args) => {
            originalError(...args);
            addHudLog('error', args);
        };

        const params = new URLSearchParams(window.location.search);
        if (params.get('debug') === 'true') {
            setIsVisible(true);
            setIsOpen(true);
        }

        const handleOpenEvent = () => {
            setIsVisible(true);
            setIsOpen(true);
        };
        window.addEventListener('open-diagnostic-hud', handleOpenEvent);

        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                setIsVisible(true);
                setIsOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        const handleClickOutside = (e) => {
            // Only handle if HUD is open
            const hudElement = document.querySelector('.diagnostic-hud');
            const triggerBtn = document.querySelector('.btn-neon');
            const headerToggle = document.querySelector('.header-diagnostic-btn');

            if (hudElement && !hudElement.contains(e.target) &&
                (!triggerBtn || !triggerBtn.contains(e.target)) &&
                (!headerToggle || !headerToggle.contains(e.target))) {
                setIsOpen(false);
            }
        };
        window.addEventListener('mousedown', handleClickOutside);

        return () => {
            console.log = originalLog;
            console.warn = originalWarn;
            console.error = originalError;
            window.removeEventListener('open-diagnostic-hud', handleOpenEvent);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = 0;
        }
    }, [logs]);

    const nuclearReload = async () => {
        addHudLog('action', [t('diag.nuke_start')]);

        // 1. Clear CacheStorage
        if ('caches' in window) {
            const keys = await caches.keys();
            await Promise.all(keys.map(key => caches.delete(key)));
            addHudLog('success', [t('diag.nuke_cache_purged')]);
        }

        // 2. Unregister Service Workers
        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            await Promise.all(registrations.map(r => r.unregister()));
            addHudLog('success', [t('diag.nuke_sw_removed')]);
        }

        addHudLog('info', ['Reiniciant app en 1s...']);
        setTimeout(() => {
            window.location.href = window.location.origin + window.location.pathname + '?v=' + Date.now();
        }, 1000);
    };

    const deepCleanSession = async () => {
        addHudLog('action', [t('diag.clean_start')]);

        // Purge all possible session/sim flags
        const flags = [
            'isPlaygroundMode',
            'sb-simulation-mode',
            'pwa_prompt_dismissed',
            'impersonation_id',
            'last_update_check'
        ];

        flags.forEach(f => localStorage.removeItem(f));

        // Remove cp_ columns
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('cp_')) localStorage.removeItem(key);
        });

        // Trigger Supabase logout
        const { supabase } = await import('../supabaseClient');
        await supabase.auth.signOut();

        addHudLog('success', [t('diag.clean_ok')]);

        setTimeout(() => {
            window.location.href = '/login?clean=true';
        }, 800);
    };

    const verifyIntegrity = async () => {
        setVerifyingIntegrity(true);
        addHudLog('action', [t('diag.integrity_start')]);

        const resources = [
            '/favicon.png',
            '/assets/avatars/iaia_official.png',
            '/assets/avatars/nano_banana.png',
            '/assets/avatars/avi_papers.png'
        ];

        let errors = 0;
        for (const res of resources) {
            try {
                const resp = await fetch(res, { method: 'HEAD' });
                if (!resp.ok) throw new Error('Not found');
                addHudLog('success', [`Recurs OK: ${res}`]);
            } catch (e) {
                addHudLog('error', [`Recurs CORRUPTE o faltant: ${res}`]);
                errors++;
            }
        }

        if (errors === 0) {
            addHudLog('success', [t('diag.integrity_ok')]);
        } else {
            addHudLog('warn', [t('diag.integrity_error', { count: errors })]);
        }

        setVerifyingIntegrity(false);
    };

    const forceUpdateAndClear = async () => {
        addHudLog('warn', ['PURGANT SERVICE WORKER I CACHÉ...']);
        if ('serviceWorker' in navigator) {
            const regs = await navigator.serviceWorker.getRegistrations();
            for (let reg of regs) {
                await reg.unregister();
            }
        }

        // Clear all except critical auth if possible
        const isSim = localStorage.getItem('isPlaygroundMode');
        localStorage.clear();
        if (isSim) localStorage.setItem('isPlaygroundMode', isSim); // Preserve sim but reset state

        addHudLog('success', ['CACHE PURGADA. RECARREGANT...']);
        setTimeout(() => {
            window.location.reload(true);
        }, 1000);
    };

    const copySystemReport = () => {
        const report = `
=== SÓC DE POBLE: SYSTEM REPORT ===
Time: ${new Date().toLocaleString()}
Version: v1.5.1-Genius
Route: ${location.pathname}

--- IDENTITY ---
User ID: ${user?.id || 'GUEST'}
Role: ${profile?.role || 'null'}
Email: ${user?.email || 'N/A'}

--- SYSTEM PULSE ---
Browser: ${navigator.userAgent}
SW Status: ${'serviceWorker' in navigator ? 'Active' : 'Missing'}
Cookies Enabled: ${navigator.cookieEnabled}

--- OPERATIONAL LOGS ---
${logs.map(l => `[${l.time}] (${l.type.toUpperCase()}) ${l.msg}`).join('\n')}

=== END REPORT ===
        `.trim();

        navigator.clipboard.writeText(report).then(() => {
            setCopied(true);
            addHudLog('success', [t('diag.copied')]);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const toggleHud = (e) => {
        if (e) e.stopPropagation();
        setIsOpen(prev => !prev);
    };

    if (!isVisible && !isAdmin) return (
        <div
            className="hud-toggle-trigger"
            title="Sóc de Poble Secret Console"
            onClick={(e) => {
                if (e.detail >= 3) {
                    toggleHud(e);
                }
            }}
        />
    );

    return (
        <>
            <div className={`diagnostic-hud ${!isOpen ? 'hidden' : ''} ${screenshotMode ? 'screenshot-mode' : ''}`}>
                <div className="hud-header">
                    <h2><Terminal size={14} aria-hidden="true" style={{ display: 'inline', marginRight: '8px' }} />{t('diag.title')}</h2>
                    <div className="flex gap-2" role="group" aria-label="HUD Controls">
                        <button
                            className={`btn-hud-small ${showHelp ? 'active-neon' : ''}`}
                            onClick={() => setShowHelp(!showHelp)}
                            title="Activar Guia Didàctica"
                            aria-label="Activar Guia Didàctica"
                            aria-pressed={showHelp}
                        >
                            <Info size={14} />
                        </button>
                        <button
                            className="btn-hud-small"
                            onClick={() => setScreenshotMode(!screenshotMode)}
                            title={helpContext.screenshot}
                            aria-label="Mode Captura"
                        >
                            {screenshotMode ? <Eye size={14} /> : <Camera size={14} />}
                        </button>
                        <button
                            className="btn-hud-small close-btn-large"
                            onClick={(e) => toggleHud(e)}
                            aria-label="Tancar Consola"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <div className="hud-drag-handle" />

                {showHelp && !didacticAlert && (
                    <div className="hud-didactic-alert">
                        🎓 <strong>{t('diag.didactic_active')}</strong>: {t('diag.didactic_hint')}
                    </div>
                )}

                {didacticAlert && (
                    <div className="hud-didactic-alert expanded">
                        <div className="flex justify-between items-center mb-2">
                            <strong>{didacticAlert.title}</strong>
                            <X size={12} onClick={() => setDidacticAlert(null)} className="cursor-pointer" />
                        </div>
                        <p>{didacticAlert.explanation}</p>
                        <ul className="mt-2 text-left list-disc pl-4 opacity-80">
                            {didacticAlert.details.map((d, i) => (
                                <li key={i} dangerouslySetInnerHTML={{ __html: d.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
                            ))}
                        </ul>
                    </div>
                )}

                <div className="hud-content">
                    <section className={`hud-section ${showHelp ? 'didactic-blink' : ''}`} onClick={() => showHelp && setDidacticAlert(didacticData.identity)}>
                        <h3><Shield size={10} /> {t('diag.identity')} {showHelp && <span className="help-tag">?</span>}</h3>
                        <div className="stat-row">
                            <span className="stat-label">User ID:</span>
                            <span className="stat-value">{user?.id?.substring(0, 8) || 'GUEST'}...</span>
                        </div>
                        <div className="stat-row">
                            <span className="stat-label">Role:</span>
                            <span className="stat-value">{profile?.role || 'null'}</span>
                        </div>
                    </section>

                    <section className={`hud-section ${showHelp ? 'didactic-blink' : ''}`} onClick={() => showHelp && setDidacticAlert(didacticData.pulse)}>
                        <h3><Cpu size={10} /> {t('diag.pulse')} {showHelp && <span className="help-tag">?</span>}</h3>
                        <div className="stat-row">
                            <span className="stat-label">Route:</span>
                            <span className="stat-value">{location.pathname}</span>
                        </div>
                        <div className="stat-row">
                            <span className="stat-label">SW Version:</span>
                            <span className="stat-value ok">v1.5.1-Genius</span>
                        </div>
                    </section>

                    <section className={`hud-section`}>
                        <h3><Brain size={10} /> {t('diag.cognitive')}</h3>
                        <div className="stat-row">
                            <span className="stat-label">Fonts Memòria:</span>
                            <span className="stat-value">{notebookService.sources.length} docs</span>
                        </div>
                        <div className="stat-row">
                            <span className="stat-label">Estat Avi:</span>
                            <span className="stat-value ok">Vigilant</span>
                        </div>
                    </section>

                    <section className={`hud-section ${showHelp ? 'didactic-blink' : ''}`} onClick={() => showHelp && setDidacticAlert(didacticData.logs)}>
                        <h3><Activity size={10} /> {t('diag.logs')} {showHelp && <span className="help-tag">?</span>}</h3>
                        <div className="log-terminal" ref={terminalRef}>
                            {logs.map(log => (
                                <div key={log.id} className={`log-entry ${log.type}`}>
                                    <span style={{ opacity: 0.5 }}>[{log.time}]</span> {log.msg}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="hud-footer">
                    <div className="flex w-full gap-2 mb-2">
                        <button
                            className="btn-primary full-width"
                            style={{ fontSize: '12px', padding: '10px' }}
                            onClick={copySystemReport}
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? t('diag.copied') : t('diag.copy_report')}
                        </button>
                    </div>

                    <div className="flex w-full gap-2 mb-2">
                        <button
                            className="btn-load-more"
                            style={{ flex: 1, fontSize: '11px', padding: '8px' }}
                            onClick={verifyIntegrity}
                        >
                            <Link2 size={12} /> {t('diag.integrity')}
                        </button>
                        <button
                            className="btn-load-more"
                            style={{ flex: 1, fontSize: '11px', padding: '8px', background: 'var(--color-warning)' }}
                            onClick={forceUpdateAndClear}
                        >
                            <RefreshCw size={12} /> {t('diag.force_update')}
                        </button>
                    </div>

                    {isAdmin && (
                        <button
                            className="add-btn-premium-vibrant full-width mb-2"
                            onClick={async () => {
                                const { iaiaService } = await import('../services/iaiaService');
                                await iaiaService.launchGlobalProduction();
                                addHudLog('success', [t('diag.launch_ok')]);
                            }}
                        >
                            🚀 {t('diag.launch')}
                        </button>
                    )}

                    <button
                        className="btn-primary full-width"
                        style={{ background: 'var(--color-primary)', color: 'black', marginBottom: '8px' }}
                        onClick={async () => {
                            addHudLog('action', ['Iniciant PURGA NUCLEAR per a restaurar producció...']);
                            await forceNukeSimulation();
                        }}
                    >
                        <User size={14} /> {t('diag.view_profile')} (RESTAURA PRODUCCIÓ)
                    </button>

                    <div className="flex w-full gap-2">
                        <button
                            className="btn-load-more"
                            style={{ flex: 1, fontSize: '10px', background: 'var(--color-error)' }}
                            onClick={deepCleanSession}
                        >
                            <Trash2 size={12} /> {t('diag.deep_clean')}
                        </button>
                        <button
                            className="btn-load-more"
                            style={{ flex: 1, fontSize: '10px', background: '#000' }}
                            onClick={nuclearReload}
                        >
                            <Activity size={12} /> {t('diag.nuclear')}
                        </button>
                    </div>
                </div>
            </div>

            {isVisible && (
                <button
                    className={`btn-icon-hud ${isOpen ? 'active' : ''}`}
                    onClick={(e) => toggleHud(e)}
                    data-admin-theme={isAdmin ? (visionMode === 'humana' ? 'dark' : 'light') : 'dark'}
                >
                    <Terminal size={14} /> <span>DIAG</span>
                </button>
            )}
        </>
    );
};

export default DiagnosticConsole;
