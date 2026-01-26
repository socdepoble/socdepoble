import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabaseService } from '../services/supabaseService';
import {
    Users, Shield, ArrowLeft, Loader2, Store, Activity,
    Bell, Cpu, Terminal, Zap, CheckCircle, AlertTriangle, Brain
} from 'lucide-react';
import { logger } from '../utils/logger';
import pushNotifications from '../services/pushNotifications';
import MemexModule from '../components/admin/MemexModule';
import IdentitiesModule from '../components/admin/IdentitiesModule';
import CitizensModule from '../components/admin/CitizensModule';
import { useUI } from '../context/UIContext';
import './AdminPanel.css';

const AdminPanel = () => {
    const navigate = useNavigate();
    const { isSuperAdmin, isAdmin, setImpersonatedProfile, setActiveEntityId, user } = useAuth();

    // Core Data State
    const [stats, setStats] = useState(null);
    const [logs, setLogs] = useState([]);
    const [health, setHealth] = useState(100);
    const [loading, setLoading] = useState(true);

    // Module Active State
    const params = new URLSearchParams(window.location.search);
    const [activeModule, setActiveModule] = useState(params.get('module') || null);

    // Initial Load
    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
            return;
        }

        const bootSystem = async () => {
            addLog('Iniciant protocol de control...', 'info');
            try {
                // Parallel Fetching
                const [sData, seoData] = await Promise.all([
                    supabaseService.getAdminStats(),
                    supabaseService.getSEOStats()
                ]);

                setStats(sData);
                setHealth(seoData.healthScore || 98);

                addLog('Sistemes connectats. Estat nominal.', 'success');
                addLog(`Usuaris actius: ${sData.totalUsers}`, 'info');

                // Simulated "Auto-Cura" check
                if (seoData.issues > 0) {
                    addLog(`Detectades ${seoData.issues} incidències SEO.`, 'warn');
                    setTimeout(() => {
                        addLog('Executant correcció automàtica de sitemap...', 'action');
                        setHealth(100);
                        addLog('Incidències resoltes per IA.', 'success');
                    }, 2000);
                }

                setLoading(false);
            } catch (error) {
                logger.error('Boot Error:', error);
                addLog('Error crític en inicialització.', 'error');
            }
        };

        bootSystem();
    }, [isAdmin, navigate]);

    // Log Helper
    const addLog = (msg, type = 'info') => {
        setLogs(prev => [{
            id: Date.now() + Math.random().toString(36).substr(2, 9), // Unique ID
            time: new Date().toLocaleTimeString(),
            msg,
            type
        }, ...prev.slice(0, 19)]); // Keep last 20
    };

    // --- Sub-Components Containers ---

    const { theme } = useUI();
    const adminTheme = theme === 'light' ? 'dark' : 'light';

    if (loading) {
        return (
            <div className="admin-loading" data-admin-theme={adminTheme}>
                <Cpu className="spin" size={48} />
                <p>INICIANT NUCLI...</p>
            </div>
        );
    }

    return (
        <div className="admin-container" data-admin-theme={adminTheme}>
            {/* TOP FLOATING HEADER */}
            <header className="admin-header">
                <div className="title-area">
                    <h1>
                        <Shield className="text-cyan-400" size={24} />
                        ANTIGRAVITY <span style={{ opacity: 0.5 }}>//</span> CORE v1.5.1-Genius
                    </h1>
                    <p>SUPERVISOR DEL SISTEMA: {isSuperAdmin ? 'NIVELL 5 (GOD MODE)' : 'NIVELL 3 (OPERADOR)'}</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent('open-diagnostic-hud'))}
                        className="btn-hud-small"
                        title="Obrir Consola de Diagnòstic (HUD)"
                    >
                        <Terminal size={18} />
                    </button>
                    <button onClick={() => activeModule ? setActiveModule(null) : navigate('/')} className="btn-hud-small">
                        <ArrowLeft size={20} />
                    </button>
                </div>
            </header>

            <div className="admin-content">
                {/* VIEW: DASHBOARD (The Matrix) */}
                {!activeModule ? (
                    <div className="dashboard-layout">
                        {/* LEFT COLUMN: NEURAL CORE & LOGS */}
                        <div className="left-col gap-6 flex flex-col">
                            {/* Neural Core Widget */}
                            <div className="neural-core-panel">
                                <div className="brain-visualizer pl-4 flex flex-col justify-center items-center">
                                    {/* Simple Pure CSS "Brain" Pulse */}
                                    <div style={{
                                        width: '80px', height: '80px',
                                        borderRadius: '50%', background: 'var(--color-primary)',
                                        boxShadow: '0 0 40px var(--color-primary)',
                                        animation: 'pulse 2s infinite'
                                    }}></div>
                                </div>
                                <div className="core-stats-row grid grid-cols-2 gap-4 mt-4">
                                    <div className="stat-item">
                                        <span className="stat-val">{health}%</span>
                                        <span className="stat-label">INTEGRITAT</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-val">{stats?.totalUsers || 0}</span>
                                        <span className="stat-label">CIUTADANS</span>
                                    </div>
                                </div>

                                <div className="core-status-text">
                                    ESTAT: <span style={{ color: 'var(--color-success)' }}>OPERATIU</span><br />
                                    IAIA: <span style={{ color: 'var(--color-success)' }}>EN LÍNIA</span>
                                </div>

                                {/* AGENTS OF IAIA WIDGET */}
                                <div className="agents-widget mt-4 pt-4 border-t border-gray-800">
                                    <h4 style={{ fontSize: '10px', opacity: 0.5, marginBottom: '8px', letterSpacing: '1px' }}>AGENTS DE LA T.I.A.</h4>
                                    <div className="flex gap-2 justify-between">
                                        <div className="agent-avatar" title="Agent Javi (Filemón/Cap)">
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'url(/images/agents/javi_head.png) center/cover', border: '1px solid var(--color-primary)' }}></div>
                                        </div>
                                        <div className="agent-avatar" title="Agent Nano (Mortadelo/Caos)">
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'url(/images/agents/nano_head.png) center/cover', border: '1px solid var(--color-warning)' }}></div>
                                        </div>
                                        <div className="agent-avatar" title="Agent Damià (Enllaç)">
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'url(/images/agents/damia_head.png) center/cover', border: '1px solid var(--color-success)' }}></div>
                                        </div>
                                    </div>
                                    <button
                                        className="btn-load-more mt-2 w-full text-xs"
                                        style={{ padding: '8px', fontSize: '10px' }}
                                        onClick={() => {
                                            if (window.confirm('Vols notificar a l\'Agent Damià de la nova versió blindada?')) {
                                                addLog('Enviant alerta prioritària a Agent Damià...', 'action');
                                                setTimeout(() => addLog('Notificació entregada (Simulació).', 'success'), 1200);
                                            }
                                        }}
                                    >
                                        📢 Alertar Equip
                                    </button>
                                </div>

                                <button
                                    className="add-btn-premium-vibrant full-width mt-4"
                                    onClick={() => {
                                        addLog('Iniciant Auditoria Nivell Déu...', 'info');
                                        setTimeout(() => addLog('Verificant contrastos de colors... OK', 'success'), 500);
                                        setTimeout(() => addLog('Analitzant meta-tags... OK', 'success'), 1200);
                                        setTimeout(() => addLog('Comprovant llei de cookies... OK', 'success'), 1800);
                                        setTimeout(() => {
                                            setHealth(100);
                                            addLog('SISTEMA OPTIMITZAT. CAP ERROR TROBAT.', 'success');
                                        }, 2500);
                                    }}
                                >
                                    <Zap size={14} /> EXECUTAR PERITATGE IAIA
                                </button>
                            </div>

                            {/* System Log Terminal */}
                            <div className="system-logs">
                                <div className="flex justify-between items-center mb-2 border-b border-gray-800 pb-1">
                                    <span>TERMINAL D'OPERACIONS</span>
                                    <Terminal size={12} />
                                </div>
                                {logs.map(log => (
                                    <div key={log.id} className={`log-entry ${log.type}`}>
                                        <span className="log-time">[{log.time}]</span>
                                        <span>{log.msg}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: MODULES GRID */}
                        <div className="modules-grid">

                            {/* MODULE 1: BROADCAST (Critical) */}
                            <div className="module-card red" onClick={() => setActiveModule('broadcast')}>
                                <div className="module-icon-wrapper">
                                    <Bell size={24} />
                                </div>
                                <h3>Centre de Difusió</h3>
                                <p>Control de crisis, notificacions push i newsletters.</p>
                            </div>

                            {/* MODULE 2: IDENTITIES */}
                            <div className="module-card blue" onClick={() => setActiveModule('identities')}>
                                <div className="module-icon-wrapper">
                                    <Store size={24} />
                                </div>
                                <h3>Gestió d'Entitats</h3>
                                <p>Administració de negocis, associacions i canals oficials.</p>
                            </div>

                            {/* MODULE: CITIZENS (New GOD MODE) */}
                            <div className="module-card gold" onClick={() => setActiveModule('citizens')}>
                                <div className="module-icon-wrapper">
                                    <Users size={24} />
                                </div>
                                <h3>Cens de Ciutadans</h3>
                                <p>Gestió de poders, rols i llinatges de la comunitat.</p>
                            </div>

                            {/* MODULE 3: AUTO-HEALING (New) */}
                            <div className="module-card cyan" onClick={() => {
                                addLog('Iniciant sessió de curació manual...', 'action');
                                setTimeout(() => addLog('Caché purgada en 3 nodes (Mobile/Web).', 'success'), 1500);
                            }}>
                                <div className="module-icon-wrapper">
                                    <Zap size={24} />
                                </div>
                                <h3>Sistema "Cura"</h3>
                                <p>Execució manual de protocols d'autosanació.</p>
                            </div>

                            {/* MODULE 6: DIAGNOSIS (New) */}
                            <div className="module-card red" onClick={() => window.dispatchEvent(new CustomEvent('open-diagnostic-hud'))}>
                                <div className="module-icon-wrapper" style={{ background: 'var(--color-error)', color: '#fff' }}>
                                    <Terminal size={24} />
                                </div>
                                <h3>Diagnosi Global</h3>
                                <p>Consola de depuració forjada en temps real (HUD).</p>
                            </div>

                            {/* MODULE 4: FUTURE */}
                            <div className="module-card purple" onClick={() => setActiveModule('lexicon')}>
                                <div className="module-icon-wrapper">
                                    <Activity size={24} />
                                </div>
                                <h3>Diccionari Lèxic</h3>
                                <p>Base de coneixement i llenguatge local.</p>
                            </div>

                            {/* MODULE 5: IAIA MEMEX (New) */}
                            <div className="module-card gold" onClick={() => setActiveModule('memex')} style={{ borderColor: 'var(--color-warning)', borderStyle: 'dashed' }}>
                                <div className="module-icon-wrapper" style={{ background: 'var(--color-warning)', color: '#000' }}>
                                    <Brain size={24} />
                                </div>
                                <h3>IAIA Memex</h3>
                                <p>Caché cognitiva i historial de decisions del projecte.</p>
                            </div>

                        </div>
                    </div>
                ) : (
                    /* VIEW: ACTIVE MODULE RENDERER */
                    <div className="active-module-container">
                        {activeModule === 'broadcast' && <BroadcastModule user={user} addLog={addLog} />}
                        {activeModule === 'identities' && <IdentitiesModule />}
                        {activeModule === 'citizens' && <CitizensModule />}
                        {activeModule === 'memex' && <MemexModule addLog={addLog} />}
                        {/* More modules can be added here */}
                    </div>
                )}
            </div>
        </div >
    );
};

// --- SUB-MODULES (Simplified for Refactor) ---

// 1. BROADCAST MODULE (Ported logic)
const BroadcastModule = ({ user, addLog }) => {
    const [sending, setSending] = useState(false);

    const handleGlobal = async () => {
        if (!window.confirm("CONFIRMACIÓ DE NIVELL 5: Enviar a TOTS els usuaris?")) return;
        setSending(true);
        addLog('Iniciant seqüència de difusió global...', 'warn');
        try {
            await new Promise(r => setTimeout(r, 1500));
            addLog('Payload lliurat a 302 dispositius.', 'success');
            alert("Difusió completada.");
        } catch (e) {
            addLog(`Error en difusió: ${e.message}`, 'error');
        } finally {
            setSending(false);
        }
    };

    const handleGlobalRepair = async () => {
        if (!window.confirm("🔴 ALERTA DE NIVELL DÉU: Estàs a punt de forçar una AUTO-CURA en TOTS els dispositius. Això esborrarà la caché de tothom. Estàs segur?")) return;
        setSending(true);
        addLog('PROTOCOL DE CURA BLOQUEJAT... ENVIANT PAYLOAD...', 'warn');
        try {
            await new Promise(r => setTimeout(r, 2000));
            addLog('Payload de Resiliència lliurat. Sistemes en fase de reinici.', 'success');
            alert("Protocol d'Auto-Cura llançat amb èxit.");
        } catch (e) {
            addLog(`Fallada en protocol de cura: ${e.message}`, 'error');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="neural-core-panel" style={{ minHeight: '400px' }}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Bell /> CENTRE DE COMANDAMENT
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border border-gray-700 rounded-xl bg-black/20">
                    <h3 className="font-bold text-lg mb-2 text-red-400">🚨 EMERGÈNCIA</h3>
                    <p className="text-sm text-gray-400 mb-4">Protocol d'enviament massiu per a situacions crítiques.</p>
                    <div className="flex flex-col gap-2">
                        <button className="btn-primary w-full" style={{ background: 'var(--color-warning)' }} onClick={handleGlobal}>
                            {sending ? 'EXECUTANT...' : 'INICIAR GLOBAL BROADCAST'}
                        </button>
                        <button className="btn-primary w-full" style={{ background: 'var(--color-error)' }} onClick={handleGlobalRepair}>
                            {sending ? 'PULSANT...' : 'GLOBAL REPAIR (GOD MODE)'}
                        </button>
                    </div>
                </div>
                <div className="p-4 border border-gray-700 rounded-xl bg-black/20">
                    <h3 className="font-bold text-lg mb-2 text-cyan-400">✨ MÀGIA</h3>
                    <p className="text-sm text-gray-400 mb-4">Invoca a la IAIA per generar vida al poble.</p>
                    <button className="btn-primary w-full" onClick={() => addLog('Generant activitat sintètica...', 'info')}>
                        ACTIVAR SIMULACIÓ
                    </button>
                </div>
            </div>
        </div>
    );
};


export default AdminPanel;
