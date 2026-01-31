import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Shield, Activity, Zap, X, Trash2, Info, Copy, Check, Brain, Link2, RefreshCw, User, Mic } from 'lucide-react';
import { CREATOR_EMAILS } from '../constants';
import { notebookService } from '../services/notebookService';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { didacticData } from '../data/didacticData';
import { feedbackService } from '../services/feedbackService';
import { iaiaService } from '../services/iaiaService';
import VoiceRecorder from './VoiceRecorder';
import './DiagnosticConsole.css';

const DiagnosticConsole = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [screenshotMode, setScreenshotMode] = useState(false);
    const [logs, setLogs] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [showVoiceFeedback, setShowVoiceFeedback] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedbackSent, setFeedbackSent] = useState(false);
    const [didacticAlert, setDidacticAlert] = useState(null);
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { user, profile, isAdmin, forceNukeSimulation } = useAuth();
    const { visionMode } = useUI();
    const location = useLocation();
    const [showHelp, setShowHelp] = useState(false);
    const [copied, setCopied] = useState(false);
    const terminalRef = useRef(null);

    const [verifyingIntegrity, setVerifyingIntegrity] = useState(false);
    const [isHealing, setIsHealing] = useState(false);
    const [iaiaAdvice, setIaiaAdvice] = useState(null);
    const VERSION = "v1.5.6-BATEGA";

    const addHudLog = (type, args) => {
        const VERSION = "v1.5.6-BATEGA";
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
            const hudElement = document.querySelector('.diagnostic-hud');
            const triggerBtn = document.querySelector('.btn-icon-hud');

            if (hudElement && !hudElement.contains(e.target) &&
                (!triggerBtn || !triggerBtn.contains(e.target))) {
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
        if ('caches' in window) {
            const keys = await caches.keys();
            await Promise.all(keys.map(key => caches.delete(key)));
            addHudLog('success', [t('diag.nuke_cache_purged')]);
        }
        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            await Promise.all(registrations.map(r => r.unregister()));
            addHudLog('success', [t('diag.nuke_sw_removed')]);
        }
        setTimeout(() => {
            window.location.href = window.location.origin + window.location.pathname + '?v=' + Date.now();
        }, 1000);
    };

    const deepCleanSession = async () => {
        addHudLog('action', [t('diag.clean_start')]);
        const flags = ['isPlaygroundMode', 'sb-simulation-mode', 'pwa_prompt_dismissed', 'impersonation_id'];
        flags.forEach(f => localStorage.removeItem(f));
        const { supabase } = await import('../supabaseClient');
        await supabase.auth.signOut();
        addHudLog('success', [t('diag.clean_ok')]);
        setTimeout(() => {
            window.location.href = '/login?harmony=true';
        }, 800);
    };

    const verifyIntegrity = async () => {
        setVerifyingIntegrity(true);
        addHudLog('action', [t('diag.integrity_start')]);
        const resources = ['/favicon.png', '/assets/avatars/iaia_official.png'];
        let errors = 0;
        for (const res of resources) {
            try {
                const resp = await fetch(res, { method: 'HEAD' });
                if (!resp.ok) throw new Error('Not found');
                addHudLog('success', [`OK: ${res}`]);
            } catch (e) {
                addHudLog('error', [`ERROR: ${res}`]);
                errors++;
            }
        }
        if (errors === 0) addHudLog('success', [t('diag.integrity_ok')]);
        else addHudLog('warn', [t('diag.integrity_error', { count: errors })]);
        setVerifyingIntegrity(false);
    };

    const forceUpdateAndClear = async () => {
        if ('serviceWorker' in navigator) {
            const regs = await navigator.serviceWorker.getRegistrations();
            for (let reg of regs) await reg.unregister();
        }
        localStorage.clear();
        window.location.reload(true);
    };

    const runSelfHealing = async () => {
        setIsHealing(true);
        addHudLog('action', ['[MASTER] Iniciant Auto-Sanejament...']);

        try {
            const diag = await iaiaService.diagnoseSystem();
            setIaiaAdvice(diag.recommendation);
            addHudLog('info', [diag.recommendation]);

            // [MASTER] Auto-Fix Viewport
            if (!diag.viewport_ok) {
                addHudLog('action', ['Reparant Viewport...']);
                const meta = document.createElement('meta');
                meta.name = "viewport";
                meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
                document.getElementsByTagName('head')[0].appendChild(meta);
                addHudLog('success', ['Viewport bategat correctament.']);
            }

            // [MASTER] Cache Integrity Check
            addHudLog('action', ['Audit de caches i imatges...']);
            await verifyIntegrity();

            addHudLog('success', ['[MASTER] Auto-Sanejament completat. El sistema és ara més fort.']);
        } catch (error) {
            addHudLog('error', ['Error en el procés de cura: ' + error.message]);
        } finally {
            setIsHealing(false);
        }
    };

    const copySystemReport = () => {
        const report = `SÓC DE POBLE SYSTEM REPORT\nTime: ${new Date().toLocaleString()}\nVersion: ${VERSION}\nUser: ${user?.id || 'GUEST'}\nRole: ${profile?.role || 'null'}\nLogs:\n${logs.map(l => `[${l.time}] ${l.msg}`).join('\n')}`;
        navigator.clipboard.writeText(report).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleVoiceFeedback = async (audioBlob, duration, transcript) => {
        setIsSubmitting(true);
        const result = await feedbackService.sendVoiceFeedback(audioBlob, duration, transcript, {
            context: 'HUD Direct Feedback',
            location: location.pathname
        });

        if (result.success) {
            setFeedbackSent(true);
            addHudLog('success', ['Sugerència enviada amb èxit! Gràcies.']);
            setTimeout(() => setFeedbackSent(false), 3000);
        }
        setShowVoiceFeedback(false);
        setIsSubmitting(false);
    };

    const toggleHud = (e) => {
        if (e) e.stopPropagation();
        setIsOpen(prev => !prev);
    };

    if (!isVisible && !isAdmin) return (
        <div className="hud-toggle-trigger" onClick={(e) => e.detail >= 3 && toggleHud(e)} />
    );

    return (
        <>
            <div className={`diagnostic-hud ${!isOpen ? 'hidden' : ''} ${screenshotMode ? 'screenshot-mode' : ''}`}>
                <div className="hud-header">
                    <div className="hud-title-zone">
                        <span className="hud-badge">{VERSION}</span>
                        <h2>CONSOLA DE COMANDAMENT SOLATGE</h2>
                    </div>
                    <div className="hud-header-actions">
                        <button className={`btn-hud-tool ${showHelp ? 'active' : ''}`} onClick={() => setShowHelp(!showHelp)}>
                            <Mic size={20} />
                        </button>
                        <button className="btn-hud-tool" onClick={() => setShowHelp(!showHelp)}>
                            <Info size={20} />
                        </button>
                        <button className="btn-hud-tool close-trigger" onClick={(e) => toggleHud(e)}>
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="hud-body">
                    {showVoiceFeedback && (
                        <div className="hud-voice-feedback-panel animate-slide-up">
                            <div className="hud-card-header">
                                <strong>Feedback Directe</strong>
                                <X size={14} onClick={() => setShowVoiceFeedback(false)} className="clickable" />
                            </div>
                            <p className="voice-recorder-hint">Explica'ns què milloraries d'esta pantalla:</p>
                            <VoiceRecorder
                                onSend={handleVoiceFeedback}
                                onCancel={() => setShowVoiceFeedback(false)}
                                lang={i18n.language}
                            />
                        </div>
                    )}

                    {iaiaAdvice && (
                        <div className="hud-iaia-advice animate-in" style={{ background: 'rgba(0, 242, 255, 0.1)', padding: '12px', borderRadius: '12px', border: '1px solid #00f2ff', marginBottom: '15px' }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                                <Brain size={16} color="#00f2ff" />
                                <strong style={{ fontSize: '12px', color: '#00f2ff' }}>CONSELL DE LA IAIA (Auto-Cura)</strong>
                            </div>
                            <p style={{ fontSize: '13px', fontStyle: 'italic' }}>{iaiaAdvice}</p>
                        </div>
                    )}

                    {showHelp && !didacticAlert && !showVoiceFeedback && !iaiaAdvice && (
                        <div className="hud-educational-banner">
                            <Brain size={16} />
                            <span>{t('diag.didactic_hint')}</span>
                        </div>
                    )}

                    {didacticAlert ? (
                        <div className="hud-didactic-card animate-slide-up">
                            <div className="hud-card-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Brain size={18} color="var(--hud-accent)" />
                                    <strong style={{ letterSpacing: '1px' }}>{didacticAlert.title}</strong>
                                </div>
                                <X size={18} onClick={() => setDidacticAlert(null)} className="clickable" />
                            </div>
                            <div className="hud-card-body" style={{ padding: '20px' }}>
                                <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '20px', color: '#fff' }}>{didacticAlert.iaia_says || didacticAlert.explanation}</p>

                                {didacticAlert.when && (
                                    <div style={{ marginBottom: '15px' }}>
                                        <strong style={{ fontSize: '11px', color: 'var(--hud-accent)', textTransform: 'uppercase' }}>Quan usar-lo?</strong>
                                        <p style={{ fontSize: '13px', marginTop: '4px' }}>{didacticAlert.when}</p>
                                    </div>
                                )}

                                {didacticAlert.effect && (
                                    <div style={{ marginBottom: '15px' }}>
                                        <strong style={{ fontSize: '11px', color: '#ff0055', textTransform: 'uppercase' }}>Quin efecte té?</strong>
                                        <p style={{ fontSize: '13px', marginTop: '4px' }}>{didacticAlert.effect}</p>
                                    </div>
                                )}

                                {didacticAlert.details && (
                                    <ul className="didactic-list">
                                        {didacticAlert.details.map((d, i) => (
                                            <li key={i} dangerouslySetInnerHTML={{ __html: d.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="hud-sections-grid">
                            <section className="hud-panel" onClick={() => showHelp && setDidacticAlert(didacticData.identity)}>
                                <div className="panel-header"><User size={16} /> <h3>ESTAT DE LA SESSIÓ</h3></div>
                                <div className="panel-content">
                                    <div className="data-row"><span>ID:</span> <strong>{user?.id?.substring(0, 8) || 'GUEST'}</strong></div>
                                    <div className="stat-value" style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '10px', color: 'var(--hud-accent)' }}>{VERSION}</div>
                                </div>
                            </section>

                            <section className="hud-panel" onClick={() => showHelp && setDidacticAlert(didacticData.pulse)}>
                                <div className="panel-header"><Activity size={16} /> <h3>ESTAT DE LA XARXA</h3></div>
                                <div className="panel-content">
                                    <div className="data-row"><span>Versió:</span> <strong>{VERSION}</strong></div>
                                    <div className="data-row"><span>Xarxa:</span> <strong className="status-ok">Connectat</strong></div>
                                </div>
                            </section>

                            <section className="hud-panel full-width" onClick={() => showHelp && setDidacticAlert(didacticData.logs)}>
                                <div className="panel-header"><Terminal size={16} /> <h3>ACTIVITAT RECENT</h3></div>
                                <div className="hud-terminal-container">
                                    <div className="hud-terminal" ref={terminalRef}>
                                        {logs.map(log => (
                                            <div key={log.id} className={`log-line ${log.type}`}>
                                                <span className="log-time">[{log.time}]</span>
                                                <span className="log-msg">{log.msg}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}
                </div>

                <div className="hud-actions-footer">
                    <div className="main-actions" style={{ display: 'flex', gap: '12px', width: '100%' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <button className="btn-hud-primary level-1" onClick={copySystemReport} style={{ width: '100%' }}>
                                {copied ? <Check size={20} /> : <Copy size={20} />}
                                <span>{copied ? 'SISTEMA COPIAT' : 'INFORME CONTROL'}</span>
                            </button>
                            <Info size={14} className="hud-info-trigger" onClick={() => setDidacticAlert(didacticData.actions.copy_report)} />
                        </div>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <button
                                className={`btn-hud-primary level-2 master-heal ${isHealing ? 'healing' : ''}`}
                                onClick={runSelfHealing}
                                disabled={isHealing}
                                style={{ width: '100%' }}
                            >
                                <Zap size={20} />
                                <span>{isHealing ? 'SANEJANT...' : 'AUTO-SANEJAMENT'}</span>
                            </button>
                            <Info size={14} className="hud-info-trigger" onClick={() => setDidacticAlert(didacticData.actions.self_healing)} />
                        </div>
                    </div>
                    <div className="secondary-actions">
                        <div style={{ flex: 1, position: 'relative' }}>
                            <button className="btn-hud-outline level-1" onClick={verifyIntegrity} disabled={verifyingIntegrity} style={{ width: '100%' }}>
                                <Shield size={16} /> <span>VERIFICAR SISTEMA</span>
                            </button>
                            <Info size={12} className="hud-info-trigger small" onClick={() => setDidacticAlert(didacticData.actions.verify_system)} />
                        </div>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <button className="btn-hud-outline level-1" onClick={forceUpdateAndClear} style={{ width: '100%' }}>
                                <RefreshCw size={16} /> <span>REFRESCAR MATRIZ</span>
                            </button>
                            <Info size={12} className="hud-info-trigger small" onClick={() => setDidacticAlert(didacticData.actions.refresh_matrix)} />
                        </div>
                    </div>
                    <div className="danger-zone">
                        <div style={{ flex: 1, position: 'relative' }}>
                            <button className="btn-hud-danger level-3" onClick={deepCleanSession} style={{ width: '100%' }}>
                                <Trash2 size={16} /> <span>PURGA DE SESSIÓ</span>
                            </button>
                            <Info size={12} className="hud-info-trigger small" onClick={() => setDidacticAlert(didacticData.actions.session_purge)} />
                        </div>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <button className="btn-hud-danger level-3" onClick={nuclearReload} style={{ width: '100%' }}>
                                <Zap size={16} /> <span>RESEMBRA TOTAL (RESET)</span>
                            </button>
                            <Info size={12} className="hud-info-trigger small" onClick={() => setDidacticAlert(didacticData.actions.nuclear_reset)} />
                        </div>
                    </div>
                    <button className="btn-hud-restore" onClick={async () => await forceNukeSimulation()}>
                        <Activity size={18} /> <span>RESTAURAR SOBIRANIA DEL PERFIL</span>
                    </button>
                </div>
            </div>

            {isVisible && (
                <button
                    className={`btn-icon-hud ${isOpen ? 'active' : ''}`}
                    onClick={(e) => toggleHud(e)}
                    data-admin-theme={isAdmin ? (visionMode === 'humana' ? 'dark' : 'light') : 'dark'}
                >
                    <Terminal size={14} /> <span>{t('common.support_short') || 'DIAG'}</span>
                </button>
            )}
        </>
    );
};

export default DiagnosticConsole;
