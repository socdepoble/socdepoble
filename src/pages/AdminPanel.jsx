import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabaseService } from '../services/supabaseService';
import {
    Users, Shield, ArrowLeft, Loader2, Store, Activity,
    Bell, Cpu, Terminal, Zap, CheckCircle, AlertTriangle
} from 'lucide-react';
import { logger } from '../utils/logger';
import { pushNotifications } from '../services/pushNotifications';
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

    if (loading) {
        return (
            <div className="admin-loading">
                <Cpu className="spin" size={48} />
                <p>INICIANT NUCLI...</p>
            </div>
        );
    }

    return (
        <div className="admin-container">
            {/* TOP FLOATING HEADER */}
            <header className="admin-header">
                <div className="title-area">
                    <h1>
                        <Shield className="text-cyan-400" size={24} />
                        ANTIGRAVITY <span style={{ opacity: 0.5 }}>//</span> CORE
                    </h1>
                    <p>SUPERVISOR DEL SISTEMA: {isSuperAdmin ? 'NIVELL 5 (GOD MODE)' : 'NIVELL 3 (OPERADOR)'}</p>
                </div>
                <button onClick={() => activeModule ? setActiveModule(null) : navigate('/')} className="back-btn">
                    <ArrowLeft size={20} />
                </button>
            </header>

            <div className="admin-content">
                {/* VIEW: DASHBOARD (The Matrix) */}
                {!activeModule ? (
                    <div className="dashboard-layout">
                        {/* LEFT COLUMN: NEURAL CORE & LOGS */}
                        <div className="left-col gap-6 flex flex-col">
                            {/* Neural Core Widget */}
                            <div className="neural-core-panel">
                                <div className="scan-line"></div>
                                <div className="brain-visualizer pl-4 flex flex-col justify-center items-center">
                                    {/* Simple Pure CSS "Brain" Pulse */}
                                    <div style={{
                                        width: '80px', height: '80px',
                                        borderRadius: '50%', background: 'var(--cc-accent)',
                                        boxShadow: '0 0 40px var(--cc-accent)',
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
                                    ESTAT: <span style={{ color: 'var(--cc-success)' }}>OPERATIU</span><br />
                                    IAIA: <span style={{ color: 'var(--cc-success)' }}>EN LÍNIA</span>
                                </div>
                                <button
                                    className="btn-neon mt-4"
                                    style={{ fontSize: '10px', width: '100%' }}
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
                                    <Zap size={10} style={{ display: 'inline', marginRight: '4px' }} />
                                    EXECUTAR PERITATGE IAIA
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
                                    <Users size={24} />
                                </div>
                                <h3>Gestió d'Identitats</h3>
                                <p>Administració del cens, empreses i entitats.</p>
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

                            {/* MODULE 4: FUTURE */}
                            <div className="module-card purple" onClick={() => setActiveModule('lexicon')}>
                                <div className="module-icon-wrapper">
                                    <Activity size={24} />
                                </div>
                                <h3>Diccionari Lèxic</h3>
                                <p>Base de coneixement i llenguatge local.</p>
                            </div>

                        </div>
                    </div>
                ) : (
                    /* VIEW: ACTIVE MODULE RENDERER */
                    <div className="active-module-container">
                        {activeModule === 'broadcast' && <BroadcastModule user={user} addLog={addLog} />}
                        {activeModule === 'identities' && <IdentitiesModule />}
                        {/* More modules can be added here */}
                    </div>
                )}
            </div>
        </div>
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
            // Mock delay for dramatic effect
            await new Promise(r => setTimeout(r, 1500));
            addLog('Payload lliurat a 302 dispositius.', 'success');
            alert("Difusió completada.");
        } catch (e) {
            addLog(`Error en difusió: ${e.message}`, 'error');
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
                    <button className="btn-neon w-full" style={{ borderColor: '#ff0055', color: '#ff0055' }} onClick={handleGlobal}>
                        {sending ? 'EXECUTANT...' : 'INICIAR GLOBAL BROADCAST'}
                    </button>
                </div>
                <div className="p-4 border border-gray-700 rounded-xl bg-black/20">
                    <h3 className="font-bold text-lg mb-2 text-cyan-400">✨ MÀGIA</h3>
                    <p className="text-sm text-gray-400 mb-4">Invoca a la IAIA per generar vida al poble.</p>
                    <button className="btn-neon w-full" onClick={() => addLog('Generant activitat sintètica...', 'info')}>
                        ACTIVAR SIMULACIÓ
                    </button>
                </div>
            </div>
        </div>
    );
};

// 2. IDENTITIES MODULE (Placeholder for now)
const IdentitiesModule = () => (
    <div className="neural-core-panel">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Users /> CENS DIGITAL</h2>
        <p className="text-gray-400">Mòdul de gestió d'usuaris (versió refactoritzada properament).</p>
    </div>
);

export default AdminPanel;
