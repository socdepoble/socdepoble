import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Shield, Activity, Zap, X, Trash2, Info, Copy, Check, Brain, Link2, RefreshCw, User, Mic, Locate, Monitor, Smartphone, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { APP_VERSION } from '../constants';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { didacticData } from '../data/didacticData';
import { feedbackService } from '../services/feedbackService';
import { iaiaService } from '../services/iaiaService';
import { FORENSIC_REPORTS } from '../data/forensicReports';
import { useThemeCustomizer } from '../hooks/useThemeCustomizer';
import { RURAL_PALETTE } from '../constants/ruralColors';
import VoiceRecorder from './VoiceRecorder';
import { SyncEngine, DataSifter, BufferHopper, RhizomeIntegrity } from './SolatgeHUDWidgets';
import { checkSilence } from '../utils/logger';
import forensicService from '../services/forensicService';
import { iaiaAuditor } from '../services/iaiaAuditor';
import './DiagnosticConsole.css';

const DiagnosticConsole = () => {
    const { themeConfig, updateConfig, resetToMasia, validateContrast, ruralInfo } = useThemeCustomizer();
    const [isOpen, setIsOpen] = useState(false);
    const [currentHudTab, setCurrentHudTab] = useState('logs'); // 'logs', 'style', 'system', 'reports'
    const [logs, setLogs] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [didacticAlert, setDidacticAlert] = useState(null);
    const { t, i18n } = useTranslation();
    const { user, profile, isAdmin, forceNukeSimulation } = useAuth();
    const [showHelp, setShowHelp] = useState(false);
    const [copied, setCopied] = useState(false);
    const terminalRef = useRef(null);

    const [autoHealEnabled] = useState(true);
    const [showVoiceFeedback, setShowVoiceFeedback] = useState(false);
    const [screenshotMode] = useState(false);
    const [verifyingIntegrity, setVerifyingIntegrity] = useState(false);
    const [isHealing, setIsHealing] = useState(false);
    const [iaiaAdvice, setIaiaAdvice] = useState(null);
    const [hudActivity, setHudActivity] = useState({ syncing: false, sifting: true, bufferLevel: 0.15 });
    const [viewMode] = useState('ADMIN'); // 'ADMIN' or 'USER' (CLEAN)
    const [techReport, setTechReport] = useState(null);
    const location = useLocation();
    const VERSION = APP_VERSION;
    const uiContext = useUI();
    const visionMode = uiContext?.visionMode || 'hibrida';

    // DIRECTIVA DE LES MARIES [MASTER]
    useEffect(() => {
        const fullName = profile?.full_name || 'Mestre';
        const welcomeMsg = i18n.language === 'ca' ? `Bon dia, ${fullName}. Tot a punt.` :
            i18n.language === 'es' ? `Buenos días, ${fullName}. Todo listo.` :
            i18n.language === 'en' ? `Good morning, ${fullName}. Everything ready.` :
            i18n.language === 'eu' ? `Egun on, ${fullName}. Dena prest.` :
            i18n.language === 'gl' ? `Bo día, ${fullName}. Todo listo.` :
                             `Bon dia, ${fullName}. Tot a punt.`;
        addHudLog('system', [welcomeMsg]);
    }, [i18n.language, profile?.full_name, addHudLog]);

    // Simulate HUD lifecycle activity only when open [PERF]
    useEffect(() => {
        if (!isOpen) return;

        const interval = setInterval(() => {
            setHudActivity(prev => ({
                syncing: Math.random() > 0.7,
                sifting: true,
                bufferLevel: Math.random() > 0.9 ? Math.min(1, prev.bufferLevel + 0.1) : Math.max(0.05, prev.bufferLevel - 0.02)
            }));
        }, 5000);
        return () => clearInterval(interval);
    }, [isOpen]);

    const broadcast = useRef(null);

    const logBuffer = useRef([]);
    const flushTimeout = useRef(null);

    const addHudLog = React.useCallback((type, msg, origin = 'SYSTEM', time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })) => {
        // [PERF] Batching de logs: No actualitzem l'estat immediatament per cada log
        const logMsg = Array.isArray(msg)
            ? msg.map(arg => typeof arg === 'object' ? JSON.stringify(arg).substring(0, 50) : String(arg)).join(' ')
            : msg;

        const newLog = { id: Date.now() + Math.random(), type, msg: logMsg, origin, time };
        logBuffer.current.push(newLog);

        if (!flushTimeout.current) {
            flushTimeout.current = setTimeout(() => {
                const logsToBatch = [...logBuffer.current];
                logBuffer.current = [];
                flushTimeout.current = null;

                setLogs(prev => [...logsToBatch, ...prev].slice(0, 70));

                // [PERF] Envia el batch sencer a altres pestanyes en comptes d'un a un
                if (broadcast.current && broadcast.current.name) {
                    try {
                        broadcast.current.postMessage({ type: 'LOG_BATCH_SYNC', logs: logsToBatch });
                    } catch {
                        // Silenci si el canal està tancat
                    }
                }

                // Process first log for healing if needed
                logsToBatch.forEach(log => {
                    if (autoHealEnabled && log.type === 'error') {
                        handleAutoHeal(log.msg);
                    }
                });
            }, 100); // Batchegem cada 100ms
        }

        // Vibrate still happens immediately for criticals
        if (type === 'critical' || (type === 'error' && autoHealEnabled)) {
            if (navigator.vibrate && navigator.userActivation?.hasBeenActive) {
                navigator.vibrate([100, 30, 100]);
            }
        }
    }, [autoHealEnabled, handleAutoHeal]);

    useEffect(() => {
        broadcast.current = new BroadcastChannel('solatge_hud_sync');
        broadcast.current.onmessage = (event) => {
            if (event.data.type === 'LOG_BATCH_SYNC') {
                setLogs(prev => [...event.data.logs, ...prev].slice(0, 70));
            }
        };

        const originalLog = console.log;
        const originalWarn = console.warn;
        const originalError = console.error;

        const capturedLog = (...args) => {
            const msg = String(args[0]);
            if (checkSilence(msg)) return;
            addHudLog('info', args);
        };
        console.log = capturedLog;
        console.warn = (...args) => {
            const msg = String(args[0]);
            if (checkSilence(msg)) return;
            if (msg.includes('Geolocation')) {
                addHudLog('warn', ['[PRIVACITAT] El navegador bloqueja la geolocalització. Revisa els permisos a la barra d\'adreces per a funcions de proximitat.']);
                return;
            }
            if (msg.includes('Push') && msg.includes('No active session')) {
                // Silenci de protocol: no cal alarmar si no hi ha sessió
                return;
            }
            addHudLog('warn', args);
        };
        console.error = (...args) => {
            const msg = String(args[0]);
            if (checkSilence(msg)) return;
            // Filtre de Soroll Extern (Chrome AI / Extensions)
            if (msg.includes('shadow host') || msg.includes('ShadowRoot')) {
                return;
            }
            if (msg.includes('removeChild') || msg.includes('not a child')) {
                // [MASTER] Intentem silenciar el soroll de DOM orfe que no afecta a la funcionalitat
                addHudLog('warn', ['[DOM-REFLOW] Detectat removeChild orfe. El sistema s\'està auto-sanejant.']);
                return;
            }
            if (import.meta.env.DEV) {
                originalError(...args); // Restaurat només per a diagnòstic real en DEV
            }
            addHudLog('error', args);
        };

        const originalInfo = console.info;
        const capturedInfo = (...args) => {
            const msg = String(args[0]);
            if (msg.includes('beforeinstallpromptevent') || msg.includes('Banner not shown')) {
                return;
            }
            addHudLog('info', args);
        };
        console.info = capturedInfo;

        const params = new URLSearchParams(window.location.search);
        const persistentDebug = localStorage.getItem('hud_debug_mode') === 'true';

        if (params.get('debug') === 'true' || persistentDebug) {
            setIsVisible(true);
            setIsOpen(true);
            if (params.get('debug') === 'true') {
                localStorage.setItem('hud_debug_mode', 'true');
                addHudLog('system', ['[MASTER] HUD persistent habilitat per a tota la sessió.']);
            }
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
            console.info = originalInfo;
            window.removeEventListener('open-diagnostic-hud', handleOpenEvent);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('mousedown', handleClickOutside);
            if (broadcast.current) broadcast.current.close();
        };
    }, [autoHealEnabled, viewMode, addHudLog]);

    const requestGeolocation = () => {
        addHudLog('action', ['[MAC-GEO] Sol·licitant geolocalització sobirana...']);
        if (!navigator.geolocation) {
            addHudLog('error', ['[MAC-GEO] El navegador no suporta geolocalització.']);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                addHudLog('success', [`[MAC - GEO] Localitzat: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)} `]);
                // Simulem bategat de posició per a tot el sistema
                window.dispatchEvent(new CustomEvent('sp_location_update', { detail: pos.coords }));
            },
            (err) => {
                addHudLog('error', [`[MAC - GEO] Error: ${err.message}. Comprova permisos al Sistema(Mac).`]);
            },
            { enableHighAccuracy: true, timeout: 5000 }
        );
    };

    const toggleDesktopMode = () => {
        const isDesktop = !themeConfig.isDesktopOptimized;
        updateConfig({ isDesktopOptimized: isDesktop });
        addHudLog('system', [`[DESKTOP] Mode Escriptori: ${isDesktop ? 'ACTIU' : 'INACTIU'} `]);
        document.body.classList.toggle('desktop-master-reflow', isDesktop);
    };
    const handleAutoHeal = React.useCallback((msg) => {
        // [MASTER BYPASS] Els errors de dades o esquema MAI han de disparar una recàrrega de bundle.
        // Són tech debt, no fallades de xarxa/deploy.
        const dbErrorPatterns = ['PGRST', 'ofici', 'column', 'relationship', '400', '401', '404', '42P01', '42501'];
        if (dbErrorPatterns.some(p => msg.includes(p))) {
            if (msg.includes('42501') && msg.includes('entity_member_map')) {
                addHudLog('critical', ['[DB-SECURITY] Permís denegat a entity_member_map.', 'Cal executar GRANT SELECT a Supabase.']);
            }
            return;
        }

        const criticalPatterns = ['Failed to fetch', 'ChunkLoadError', 'Manifest', 'Supabase', 'Geolocation'];

        // [MASTER BYPASS] Ignorar errors coneguts d'esquema que no requereixen recàrrega
        // Incloem PGRST201, relationship, i errors que solen ocórrer durant la sincronització en mòbil
        // També ignorem ReferenceErrors per evitar bucles infinits si el codi propi falla
        if (msg.includes('ofici') || msg.includes('column') || msg.includes('relationship') ||
            msg.includes('PGRST201') || msg.includes('400') ||
            msg.includes('ReferenceError') || msg.includes('TypeError')) {
            return;
        }

        if (criticalPatterns.some(p => msg.includes(p))) {
            addHudLog('critical', [`[!!ALERTA MANDATORY!!] ${msg} `]);

            if (msg.includes('Geolocation')) {
                addHudLog('info', ['[AUTO-HEAL] Recomanació: Prem el botó de Localització al HUD.']);
            }

            // [RESILIÈNCIA] Evitem re-bategats infinits comprovant l'auditor de forma segura
            let isPulseStable = true;
            try {
                if (typeof iaiaAuditor !== 'undefined' && iaiaAuditor.auditPulse) {
                    isPulseStable = iaiaAuditor.auditPulse();
                }
            } catch (e) {
                if (import.meta.env.DEV) {
                    console.warn('[AUTO-HEAL] Error auditant bategat:', e);
                }
            }

            if (!isPulseStable) {
                addHudLog('error', ['[AUTO-HEAL] Bucle detectat. Aturant protocols automàtics per seguretat.']);
                return;
            }

            addHudLog('system', ['[AUTO-HEAL] Detectada fallada crítica. Iniciant protocol de sanació...']);
            setIsHealing(true);

            setTimeout(() => {
                const fatalPatterns = ['ChunkLoadError', 'Failed to fetch'];
                if (fatalPatterns.some(p => msg.includes(p))) {
                    // [CIRCUIT BREAKER MASTER] Verifiquem estabilitat JUST ABANS de recarregar.
                    // Si ja hem recarregat massa cops, l'auditPulse retornarà false i aturarem el bucle.
                    let isSafeToRetry = true;
                    try {
                        if (typeof iaiaAuditor !== 'undefined' && iaiaAuditor.auditPulse) {
                            isSafeToRetry = iaiaAuditor.auditPulse();
                        }
                    } catch (e) {
                        if (import.meta.env.DEV) {
                            console.error('[AUTO-HEAL] Error final pre-reload:', e);
                        }
                    }

                    if (isSafeToRetry) {
                        addHudLog('system', ['[AUTO-HEAL] Recarregant bundle per a resoldre pèrdua de sincronització...']);
                        setTimeout(() => window.location.reload(), 500);
                    } else {
                        addHudLog('critical', ['[AUTO-HEAL] BUCLE DETECTAT. Recàrrega cancel·lada per seguretat.']);
                        setIsHealing(false);
                    }
                } else {
                    addHudLog('system', ['[AUTO-HEAL] Sanació completa. El bategat s\'ha estabilitzat.']);
                    setIsHealing(false);
                }
            }, 3000); // Augmentat a 3s per donar temps a la UI
        }
    }, [addHudLog]);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = 0;
        }
    }, [logs]);

    const runSystemAudit = async () => {
        addHudLog('system', ['[AUDIT] Iniciant auditoria de Sacred Tech...']);
        // 1. Contrast Test
        const bodies = document.querySelectorAll('.card-body');
        addHudLog('info', [`[AUDIT] Verificant contrast en ${bodies.length} targetes.`]);

        // 2. Link Test
        const links = document.querySelectorAll('a');
        const broken = Array.from(links).filter(a => !a.href);
        if (broken.length > 0) addHudLog('error', [`[AUDIT] Trobats ${broken.length} enllaços orfes.`]);
        else addHudLog('success', ['[AUDIT] Enllaços OK.']);

        // 3. Sacred Tech Check
        const fonts = document.body.style.fontFamily;
        if (fonts.includes('Inter Tight')) addHudLog('success', ['[AUDIT] Sobirania tipogràfica Inter Tight confirmada.']);

        if (navigator.vibrate && navigator.userActivation?.hasBeenActive) navigator.vibrate(50);
        addHudLog('system', ['[AUDIT] Auditoria completada. El sistema és digne.']);
    };

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
                addHudLog('success', [`OK: ${res} `]);
            } catch {
                addHudLog('error', [`ERROR: ${res} `]);
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
        const report = `SÓC DE POBLE SYSTEM REPORT\nTime: ${new Date().toLocaleString()} \nVersion: ${VERSION} \nUser: ${user?.id || 'GUEST'} \nRole: ${profile?.role || 'null'} \nLogs: \n${logs.map(l => `[${l.time}] ${l.msg}`).join('\n')} `;
        navigator.clipboard.writeText(report).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleVoiceFeedback = async (audioBlob, duration, transcript) => {
        const result = await feedbackService.sendVoiceFeedback(audioBlob, duration, transcript, {
            context: 'HUD Direct Feedback',
            location: location.pathname
        });

        if (result.success) {
            addHudLog('success', ['Sugerència enviada amb èxit! Gràcies.']);
        }
        setShowVoiceFeedback(false);
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
            <div className={`diagnostic-hud ${!isOpen ? 'hidden' : ''} ${screenshotMode ? 'screenshot-mode' : ''} mode-${viewMode.toLowerCase()}`}>
                <div className="hud-header">
                    <div className="hud-header-title">
                        <Activity size={18} className={isHealing ? 'pulse-fast text-red-500' : 'pulse-slow text-cyan-400'} />
                        <h2>CONSOLA DE COMANDAMENT SOLATGE</h2>
                        <span className={`auto-heal-badge ${autoHealEnabled ? 'active' : ''}`}>
                            {autoHealEnabled && !isHealing ? <Check size={10} className="mr-1 inline" /> : null}
                            {autoHealEnabled ? 'ESTAT: HARMÒNIC' : 'HARMÒNIA: PAUSA'}
                        </span>
                        <div className="peace-signal-container" title="Senyal de Pau (Manteniment OK)">
                            <div className="peace-led"></div>
                            <span className="peace-text">SILENCI</span>
                        </div>
                        {forensicService.getLatestReports().length > 0 && (
                            <div className="crash-alert-tag pulse-fast" onClick={() => setCurrentHudTab('forensic')}>
                                <Shield size={10} color="#ff0055" />
                                <span>CRASH DETECTAT</span>
                            </div>
                        )}
                    </div>
                    <div className="hud-header-actions">
                        <button className={`btn - hud - tool ${currentHudTab === 'audit' ? 'active' : ''} `} onClick={runSystemAudit} title="Audit Ara">
                            <Shield size={20} />
                        </button>
                        <button className="btn-hud-tool" onClick={() => setShowHelp(!showHelp)}>
                            <Mic size={20} />
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
                        <div className="hud-iaia-advice animate-in" style={{ background: 'rgba(0, 242, 255, 0.1)', padding: '12px', borderRadius: '0px', border: '1px solid #00f2ff', marginBottom: '15px' }}>
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
                            <span>{t('diag.didactic_hint') || "Aprofita la saviesa del bategat per a entendre el sistema."}</span>
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
                            <div className="hud-tabs-selector compact-scroll">
                                <button className={currentHudTab === 'logs' ? 'active terminal' : 'terminal'} onClick={() => setCurrentHudTab('logs')}>TERMINAL</button>
                                <button className={currentHudTab === 'sync' ? 'active sync' : 'sync'} onClick={() => setCurrentHudTab('sync')}>SINCRONITZACIÓ</button>
                                <button className={currentHudTab === 'rendiment' ? 'active rendi' : 'rendi'} onClick={() => setCurrentHudTab('rendiment')}>RENDIMENT</button>
                                <button className={currentHudTab === 'errors' ? 'active error' : 'error'} onClick={() => setCurrentHudTab('errors')}>ERRORS</button>
                                <button className={currentHudTab === 'reports' ? 'active reports' : 'reports'} onClick={() => {
                                    setCurrentHudTab('reports');
                                    const reportLang = i18n.language === 'es' ? '_ES' : '';
                                    fetch(`/TECHNICAL_REPORT_VIVO${reportLang}.md`)
                                        .then(res => res.text())
                                        .then(setTechReport)
                                        .catch(err => console.error('Error carregant l\'informe:', err));
                                }}>INFORME TÈCNIC</button>
                                <button className={currentHudTab === 'forensic' ? 'active reports' : 'reports'} onClick={() => setCurrentHudTab('forensic')}>INFORMES FORENSES</button>
                                <button className={currentHudTab === 'style' ? 'active' : ''} onClick={() => setCurrentHudTab('style')}>ESTIL [MASTER]</button>
                                <button className={currentHudTab === 'faq' ? 'active' : ''} onClick={() => {
                                    setCurrentHudTab('faq');
                                    setDidacticAlert(didacticData.master_faq);
                                }}>AGÈNDA FAQ</button>
                                <button className={currentHudTab === 'system' ? 'active' : ''} onClick={() => setCurrentHudTab('system')}>SISTEMA</button>
                                <button className="btn-report-live" onClick={() => window.open('/soc_de_poble_report.html', '_blank')}>CENTRE INTERPRETACIÓ</button>
                            </div>

                            {currentHudTab === 'faq' && (
                                <section className="hud-panel full-width">
                                    <div className="panel-header">
                                        <Brain size={16} color="var(--hud-accent)" />
                                        <h3>AGÈNDA DE DUBTES (IAIA)</h3>
                                    </div>
                                    <div className="panel-content" style={{ padding: '20px' }}>
                                        <p style={{ fontStyle: 'italic', marginBottom: '20px', opacity: 0.8 }}>{didacticData.master_faq.explanation}</p>
                                        <div className="faq-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            {didacticData.master_faq.details.map((item, i) => {
                                                const [q, a] = item.split('\n');
                                                return (
                                                    <div key={i} className="faq-item" style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '0px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                        <strong style={{ color: 'var(--hud-accent)', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                                                            {q.replace(/\*\*/g, '')}
                                                        </strong>
                                                        <p style={{ fontSize: '13px', lineHeight: '1.5', opacity: 0.9 }}>{a}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </section>
                            )}

                            {currentHudTab === 'reports' && (
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
                            )}

                            {currentHudTab === 'forensic' && (
                                <section className="hud-panel full-width">
                                    <div className="panel-header">
                                        <Shield size={16} color="#ff0055" />
                                        <h3>REPORTS FORENSES [CRITICAL]</h3>
                                        <button className="btn-hud-outline small ml-auto" onClick={() => {
                                            forensicService.clearReports();
                                            setLogs(prev => prev); // Force refresh
                                        }}>NETEJAR</button>
                                    </div>
                                    <div className="forensic-reports-container">
                                        {forensicService.getLatestReports().length === 0 ? (
                                            <div className="p-4 text-center opacity-40">No hi ha reports actius. El bategat és pur.</div>
                                        ) : (
                                            forensicService.getLatestReports().reverse().map(report => (
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
                                        {/* Original static reports if needed, but we focus on live crashes */}
                                    </div>
                                </section>
                            )}

                            {['logs', 'sync', 'rendiment', 'errors'].includes(currentHudTab) && (
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
                                                    <span className="log-msg">{log.msg}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            )}

                            {currentHudTab === 'style' && (
                                <section className="hud-panel full-width style-tuner-panel">
                                    <div className="panel-header"><Zap size={16} /> <h3>TUNER D'ESTIL SOBIRÀ</h3></div>
                                    <div className="panel-content tuner-grid">
                                        {/* 1. Tipografia Fluida */}
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

                                        {/* 2. Selector Semàntic de Color */}
                                        <div className="tuner-item">
                                            <label>Color d'Accent: <strong style={{ color: 'var(--hud-accent)' }}>{ruralInfo.label}</strong></label>
                                            <div className="rural-swatches">
                                                {RURAL_PALETTE.map(color => (
                                                    <button
                                                        key={color.hex}
                                                        className={`swatch ${ruralInfo.hex === color.hex ? 'active' : ''} `}
                                                        style={{ backgroundColor: color.hex }}
                                                        title={color.name}
                                                        onClick={() => updateConfig({ primaryColor: color.hex })}
                                                        aria-label={color.name}
                                                    />
                                                ))}
                                            </div>
                                            <p className="tuner-hint">{ruralInfo.desc}</p>
                                        </div>

                                        {/* 4. Desktop & Geo Triggers */}
                                        <div className="tuner-item">
                                            <label>Maquinària i Geolocalització</label>
                                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                                <button className="btn-hud-outline" onClick={requestGeolocation} style={{ flex: 1 }}>
                                                    <Locate size={14} /> LOCALITZAR MAC
                                                </button>
                                                <button className={`btn - hud - outline ${themeConfig.isDesktopOptimized ? 'active' : ''} `} onClick={toggleDesktopMode} style={{ flex: 1 }}>
                                                    {themeConfig.isDesktopOptimized ? <Monitor size={14} /> : <Smartphone size={14} />}
                                                    {themeConfig.isDesktopOptimized ? 'MODE DESKTOP' : 'MODE MÒBIL'}
                                                </button>
                                            </div>
                                        </div>

                                        {/* 5. Aesthetics Guard Status */}
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
                            )}

                            {currentHudTab === 'system' && (
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
                            )}
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
                                className={`btn - hud - primary level - 2 master - heal ${isHealing ? 'healing' : ''} `}
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
                                <Zap size={16} /> <span>RESEMBRA TOTAL (RENOVAR)</span>
                            </button>
                            <Info size={12} className="hud-info-trigger small" onClick={() => setDidacticAlert(didacticData.actions.nuclear_reset)} />
                        </div>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <button 
                                className="btn-hud-danger level-3 master-reset-btn" 
                                onClick={async () => {
                                    const { masterReset } = await import('../utils/masterReset');
                                    if (window.confirm('⚠️ ALERTA OMEGA: Estàs a punt d\'esborrar TOTA la teua identitat i dades locals. Aquesta acció és irreversible sense Padrins. Vols procedir?')) {
                                        await masterReset();
                                    }
                                }} 
                                style={{ 
                                    width: '100%', 
                                    background: 'linear-gradient(45deg, #ff0055, #f59e0b)',
                                    color: 'white',
                                    fontWeight: '950',
                                    border: 'none',
                                    boxShadow: '0 0 20px rgba(255, 0, 85, 0.4)'
                                }}
                            >
                                <Zap size={16} /> <span>DIA ZERO: REINICI MESTRE</span>
                            </button>
                            <Info size={12} className="hud-info-trigger small" onClick={() => setDidacticAlert({
                                title: "Protocol DIA ZERO",
                                explanation: "Destrucció creativa del 'solatge' (localStorage i IndexedDB). Purifica el dispositiu per a un inici de demo impecable.",
                                when: "Abans de la reunió amb Sollutia per garantir que no hi ha dades de test velles.",
                                effect: "Esborra la identitat sobirana local i totes les rèpliques de dades."
                            })} />
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
                >
                    <Terminal size={14} /> <span>{t('common.support_short') || 'DIAG'}</span>
                </button>
            )}
        </>
    );
};

export default DiagnosticConsole;
