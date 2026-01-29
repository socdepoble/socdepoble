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
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { user, profile, isAdmin, forceNukeSimulation } = useAuth();
    const { visionMode } = useUI();
    const location = useLocation();
    const [showHelp, setShowHelp] = useState(false);
    const [copied, setCopied] = useState(false);
    const terminalRef = useRef(null);

    const [verifyingIntegrity, setVerifyingIntegrity] = useState(false);
    const VERSION = "v1.5.4-Genius-Absolut";

    const addHudLog = (type, args) => {
        const VERSION = "v1.5.4-Genius-Absolut";
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
            window.location.href = '/login?clean=true';
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
                        <div className="hud-badge">V1.5.4-GENIUS-ABSOLUT</div>
                        <h2>ANTIGRAVITY HUD CORE</h2>
                    </div>
                    <div className="hud-header-actions">
                        <button
                            className={`btn-hud-tool ${showVoiceFeedback ? 'active' : ''}`}
                            onClick={() => setShowVoiceFeedback(!showVoiceFeedback)}
                            title="Enviar suggerència per veu"
                            disabled={isSubmitting}
                        >
                            <Mic size={18} />
                        </button>
                        <button
                            className={`btn-hud-tool ${showHelp ? 'active' : ''}`}
                            onClick={() => setShowHelp(!showHelp)}>
                            <Info size={18} />
                        </button>
                        <button className="btn-hud-tool close-trigger" onClick={(e) => toggleHud(e)}>
                            <X size={24} />
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

                    {showHelp && !didacticAlert && !showVoiceFeedback && (
                        <div className="hud-educational-banner">
                            <Brain size={16} />
                            <span>{t('diag.didactic_hint')}</span>
                        </div>
                    )}

                    {didacticAlert ? (
                        <div className="hud-didactic-card animate-slide-up">
                            <div className="hud-card-header">
                                <strong>{didacticAlert.title}</strong>
                                <X size={14} onClick={() => setDidacticAlert(null)} className="clickable" />
                            </div>
                            <div className="hud-card-body">
                                <p>{didacticAlert.explanation}</p>
                                <ul className="didactic-list">
                                    {didacticAlert.details.map((d, i) => (
                                        <li key={i} dangerouslySetInnerHTML={{ __html: d.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="hud-sections-grid">
                            <section className="hud-panel" onClick={() => showHelp && setDidacticAlert(didacticData.identity)}>
                                <div className="panel-header"><Shield size={14} /> <h3>{t('diag.identity')}</h3></div>
                                <div className="panel-content">
                                    <div className="data-row"><span>ID:</span> <strong>{user?.id?.substring(0, 8) || 'GUEST'}</strong></div>
                                    <div className="stat-value">v1.5.4-Genius-Absolut</div>
                                </div>
                            </section>

                            <section className="hud-panel" onClick={() => showHelp && setDidacticAlert(didacticData.pulse)}>
                                <div className="panel-header"><Activity size={14} /> <h3>{t('diag.pulse')}</h3></div>
                                <div className="panel-content">
                                    <div className="data-row"><span>Versió:</span> <strong>{VERSION}</strong></div>
                                    <div className="data-row"><span>Xarxa:</span> <strong className="status-ok">Connectat</strong></div>
                                </div>
                            </section>

                            <section className="hud-panel full-width" onClick={() => showHelp && setDidacticAlert(didacticData.logs)}>
                                <div className="panel-header"><Terminal size={14} /> <h3>{t('diag.logs')}</h3></div>
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
                    <div className="main-actions">
                        <button className="btn-hud-primary" onClick={copySystemReport}>
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                            <span>{copied ? t('diag.copied') : t('diag.copy_report')}</span>
                        </button>
                    </div>
                    <div className="secondary-actions">
                        <button className="btn-hud-outline" onClick={verifyIntegrity} disabled={verifyingIntegrity}>
                            <Link2 size={16} /> <span>{t('diag.integrity')}</span>
                        </button>
                        <button className="btn-hud-outline warning" onClick={forceUpdateAndClear}>
                            <RefreshCw size={16} /> <span>{t('diag.force_update')}</span>
                        </button>
                    </div>
                    <div className="danger-zone">
                        <button className="btn-hud-danger" onClick={deepCleanSession}>
                            <Trash2 size={16} /> <span>{t('diag.deep_clean')}</span>
                        </button>
                        <button className="btn-hud-danger" onClick={nuclearReload}>
                            <Zap size={16} /> <span>{t('diag.nuclear')}</span>
                        </button>
                    </div>
                    <button className="btn-hud-restore" onClick={async () => await forceNukeSimulation()}>
                        <User size={16} /> <span>{t('diag.view_profile')}</span>
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
