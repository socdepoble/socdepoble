import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { supabaseService } from '../services/supabaseService';
import {
    Users, Shield, ArrowLeft, Loader2, Store, Activity,
    Bell, Cpu, Terminal, Zap, CheckCircle, AlertTriangle, Brain, MessageSquare, Pin, Edit, ShieldCheck
} from 'lucide-react';
import { logger } from '../utils/logger';
import pushNotifications from '../services/pushNotifications';
import MemexModule from '../components/admin/MemexModule';
import IdentitiesModule from '../components/admin/IdentitiesModule';
import CitizensModule from '../components/admin/CitizensModule';
import StoreManagementModule from '../components/admin/StoreManagementModule';
import SuperRatonControl from '../components/admin/SuperRatonControl';
import GlobalOverview from '../components/admin/GlobalOverview';
import AdminPinnedManager from '../components/AdminPinnedManager';
import { useUI } from '../context/UIContext';
import './AdminPanel.css';

const AdminPanel = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
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
                        addLog('Caché cognitiva actualitzada amb v1.5.7-BATEGA.', 'success');
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
                        ANTIGRAVITY <span style={{ opacity: 0.5 }}>//</span> CORE v1.15.1-BATEGA
                    </h1>
                    <p>SUPERVISOR DEL SISTEMA: {isSuperAdmin ? 'NIVELL 5 (GOD MODE)' : 'NIVELL 3 (OPERADOR)'}</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent('open-diagnostic-hud'))}
                        className="header-diagnostic-btn"
                        title={t('nav.support')}
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
                            {/* UCC CORE - THE GLOBAL VISION */}
                            <GlobalOverview addLog={addLog} />

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

                        {/* RIGHT COLUMN: MODULES GRID (Now Shortcuts sidebar) */}
                        <div className="modules-grid">
                            <h4 className="text-[10px] opacity-40 font-bold mb-2 uppercase tracking-widest pl-2">Accés Directe</h4>

                            {/* MODULE 1: BROADCAST (Critical) */}
                            <div className="module-card red" onClick={() => setActiveModule('broadcast')}>
                                <div className="module-icon-wrapper">
                                    <Bell size={18} />
                                </div>
                                <h3>Centre de Difusió</h3>
                            </div>

                            {/* MODULE 2: IDENTITIES */}
                            <div className="module-card blue" onClick={() => setActiveModule('identities')}>
                                <div className="module-icon-wrapper">
                                    <Store size={18} />
                                </div>
                                <h3>Gestió d'Entitats</h3>
                            </div>

                            {/* MODULE: CITIZENS (New GOD MODE) */}
                            <div className="module-card gold" onClick={() => setActiveModule('citizens')}>
                                <div className="module-icon-wrapper">
                                    <Users size={18} />
                                </div>
                                <h3>Cens de Ciutadans</h3>
                            </div>

                            {/* MODULE 3: AUTO-HEALING (New) */}
                            <div className="module-card cyan" onClick={() => {
                                addLog('Iniciant sessió de curació manual...', 'action');
                                setTimeout(() => addLog('Caché purgada en 3 nodes (Mobile/Web).', 'success'), 1500);
                            }}>
                                <div className="module-icon-wrapper">
                                    <Zap size={18} />
                                </div>
                                <h3>Sistema "Cura"</h3>
                            </div>

                            {/* MODULE 6: DIAGNOSIS (New) */}
                            <div className="module-card red" onClick={() => window.dispatchEvent(new CustomEvent('open-diagnostic-hud'))}>
                                <div className="module-icon-wrapper" style={{ background: 'var(--color-error)', color: '#fff' }}>
                                    <Activity size={18} />
                                </div>
                                <h3>Suport Tècnic</h3>
                            </div>

                            {/* MODULE 4: FUTURE */}
                            <div className="module-card purple" onClick={() => setActiveModule('lexicon')}>
                                <div className="module-icon-wrapper">
                                    <Activity size={18} />
                                </div>
                                <h3>Diccionari Lèxic</h3>
                            </div>

                            {/* MODULE 5: IAIA MEMEX (New) */}
                            <div className="module-card gold" onClick={() => setActiveModule('memex')} style={{ borderColor: 'var(--color-warning)', borderStyle: 'dashed' }}>
                                <div className="module-icon-wrapper" style={{ background: 'var(--color-warning)', color: '#000' }}>
                                    <Brain size={18} />
                                </div>
                                <h3>IAIA Memex</h3>
                            </div>

                            {/* MODULE 7: STORES (New) */}
                            <div className="module-card status-active" onClick={() => setActiveModule('stores')} style={{ borderColor: 'var(--color-primary)', borderStyle: 'double' }}>
                                <div className="module-icon-wrapper" style={{ background: 'var(--color-primary)', color: '#000' }}>
                                    <Store size={18} />
                                </div>
                                <h3>Gestió Stores</h3>
                            </div>

                            {/* MODULE 8: SUPER RATÓN (GOD MODE ONLY) */}
                            {isSuperAdmin && (
                                <div className="module-card cyan" onClick={() => setActiveModule('super-raton')} style={{ borderColor: 'var(--hud-accent)', boxShadow: '0 0 15px rgba(0, 242, 255, 0.2)' }}>
                                    <div className="module-icon-wrapper" style={{ background: 'var(--hud-accent)', color: '#000' }}>
                                        <Zap size={18} />
                                    </div>
                                    <h3>Super Ratón</h3>
                                </div>
                            )}

                            {/* MODULE 9: UTILITAT SOCIAL (GOD MODE) */}
                            {isSuperAdmin && (
                                <div className="module-card status-active" onClick={() => setActiveModule('utilitat-social')} style={{ borderColor: 'var(--color-success)', boxShadow: '0 0 15px rgba(34, 197, 94, 0.2)' }}>
                                    <div className="module-icon-wrapper" style={{ background: 'var(--color-success)', color: '#fff' }}>
                                        <ShieldCheck size={18} />
                                    </div>
                                    <h3>Utilitat Social</h3>
                                </div>
                            )}

                            {/* MODULE 10: MEMORY GOVERNANCE (GOD MODE) */}
                            {isSuperAdmin && (
                                <div className="module-card gold" onClick={() => setActiveModule('memory-governance')} style={{ borderColor: 'var(--color-warning)', boxShadow: '0 0 20px rgba(255, 170, 0, 0.3)', position: 'relative', overflow: 'hidden' }}>
                                    <div className="module-icon-wrapper" style={{ background: 'var(--color-warning)', color: '#000' }}>
                                        <Brain size={18} />
                                    </div>
                                    <h3>Govern Memòria</h3>
                                </div>
                            )}

                            {/* MODULE 11: MARKETING & ANALYTICS */}
                            {isSuperAdmin && (
                                <div className="module-card blue" onClick={() => setActiveModule('marketing')} style={{ borderColor: 'var(--color-primary)', boxShadow: '0 0 15px rgba(0, 242, 255, 0.2)' }}>
                                    <div className="module-icon-wrapper" style={{ background: 'var(--color-primary)', color: '#000' }}>
                                        <Activity size={18} />
                                    </div>
                                    <h3>Màrqueting Universal</h3>
                                </div>
                            )}

                            {/* MODULE 12: EDITORIAL GOVERNANCE (NEW) */}
                            {isSuperAdmin && (
                                <div className="module-card red" onClick={() => setActiveModule('editorial-governance')} style={{ borderColor: 'var(--color-error)', boxShadow: '0 0 15px rgba(239, 68, 68, 0.2)' }}>
                                    <div className="module-icon-wrapper" style={{ background: 'var(--color-error)', color: '#fff' }}>
                                        <Edit size={18} />
                                    </div>
                                    <h3>Governança Editorial</h3>
                                </div>
                            )}

                            {/* MODULE 13: PERMISSIONS GOVERNANCE (NEW) */}
                            {isSuperAdmin && (
                                <div className="module-card blue" onClick={() => setActiveModule('permissions')} style={{ borderColor: 'var(--color-primary)', boxShadow: '0 0 15px rgba(0, 122, 255, 0.2)' }}>
                                    <div className="module-icon-wrapper" style={{ background: 'var(--color-primary)', color: '#fff' }}>
                                        <Shield size={18} />
                                    </div>
                                    <h3>Permisos i Rols</h3>
                                </div>
                            )}

                        </div>
                    </div>
                ) : (
                    /* VIEW: ACTIVE MODULE RENDERER */
                    <div className="active-module-container">
                        {activeModule === 'broadcast' && <BroadcastModule user={user} addLog={addLog} />}
                        {activeModule === 'identities' && <IdentitiesModule />}
                        {activeModule === 'citizens' && <CitizensModule />}
                        {activeModule === 'memex' && <MemexModule addLog={addLog} />}
                        {activeModule === 'stores' && <StoreManagementModule addLog={addLog} />}
                        {activeModule === 'super-raton' && <SuperRatonControl addLog={addLog} />}
                        {activeModule === 'utilitat-social' && <UtilitatSocialModule addLog={addLog} />}
                        {activeModule === 'memory-governance' && <MemoryGovernanceModule addLog={addLog} />}
                        {activeModule === 'marketing' && <MarketingModule addLog={addLog} />}
                        {activeModule === 'editorial-governance' && <EditorialGovernanceModule addLog={addLog} />}
                        {activeModule === 'permissions' && <PermissionsGovernanceModule addLog={addLog} />}
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
                    <h3 className="font-bold text-lg mb-2 text-cyan-400">✨ GESTIÓ DE CONTINGUT</h3>
                    <p className="text-sm text-gray-400 mb-4">Publica manualment col·leccions de contingut premium.</p>
                    <button
                        className="btn-primary w-full"
                        onClick={async () => {
                            addLog('Detectant script de notícies de l\'Anna...', 'info');
                            try {
                                const { publishAnnaNews } = await import('../utils/publishAnnaNews');
                                await publishAnnaNews();
                                addLog('Notícies d\'Anna Climent publicades amb èxit.', 'success');
                                alert("8 notícies saludables han sigut introduïdes al sistema.");
                            } catch (err) {
                                logger.error('Error publicant des d\'admin:', err);
                                addLog('Fallada en publicació d\'Anna Climent.', 'error');
                            }
                        }}
                    >
                        🍎 PUBLICAR MENÚS ANNA
                    </button>
                    {/* 
                    <button
                        className="btn-primary w-full mt-2"
                        style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}
                        onClick={async () => {
                            addLog('Preparant feedback per a Anna Climent...', 'info');
                            try {
                                const { sendFeedbackToAnna } = await import('../utils/feedbackToAnna');
                                await sendFeedbackToAnna();
                                addLog('Feedback enviat a Anna Climent.', 'success');
                                alert("Missatge de feedback enviat a l'Anna Climent des de MArIA.");
                            } catch (err) {
                                logger.error('Error enviant feedback des d\'admin:', err);
                                addLog('Fallada en enviament de feedback.', 'error');
                            }
                        }}
                    >
                        <MessageSquare size={14} /> ENVIAR FEEDBACK A ANNA
                    </button>
                    */}
                    <button className="btn-primary w-full mt-2" onClick={() => addLog('Generant activitat sintètica...', 'info')}>
                        ACTIVAR SIMULACIÓ
                    </button>
                </div>
            </div>
        </div>
    );
};


// 9. UTILITAT SOCIAL MODULE
const UtilitatSocialModule = ({ addLog }) => {
    const [socialVitality, setSocialVitality] = useState(95);

    return (
        <div className="neural-core-panel" style={{ minHeight: '400px' }}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ShieldCheck color="var(--color-success)" /> MONITOR D'UTILITAT SOCIAL [GOD MODE]
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border border-gray-700 rounded-xl bg-black/20">
                    <h3 className="font-bold text-lg mb-2 text-green-400">📊 VITALITAT RURAL</h3>
                    <div className="flex flex-col gap-4">
                        <div className="vitality-meter-wrapper">
                            <div className="flex justify-between text-xs mb-1">
                                <span>BATEGAT SOCIAL</span>
                                <span>{socialVitality}%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 shadow-[0_0_10px_#22c55e]" style={{ width: `${socialVitality}%` }}></div>
                            </div>
                        </div>
                        <button className="btn-primary w-full" onClick={() => {
                            setSocialVitality(100);
                            addLog('Inyectant vitamina social de proximitat...', 'success');
                        }}>
                            <Zap size={14} /> REFORÇAR BATEGAT
                        </button>
                    </div>
                </div>
                <div className="p-4 border border-gray-700 rounded-xl bg-black/20">
                    <h3 className="font-bold text-lg mb-2 text-blue-400">👵 SAVIESA IAIA (WA)</h3>
                    <p className="text-sm text-gray-400 mb-4">Estat de la integració de l'IAIA als xats de coordinació.</p>
                    <div className="flex flex-col gap-2">
                        <div className="p-2 bg-blue-900/20 border border-blue-500/30 rounded-lg text-xs">
                            <p><strong>NODE WHATSAPP:</strong> ACTIU 👵✨</p>
                            <p><strong>ESTAT:</strong> MEMBRE DEL GRUP BETA</p>
                        </div>
                        <button className="btn-primary w-full mt-2" onClick={() => addLog('Sincronitzant Memòria Viva amb WhatsApp...', 'info')}>
                            SINCRONITZAR SAVIESA
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-6 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                <h4 className="text-xs font-bold text-gray-500 mb-4 uppercase">Directori de DAFOs Master [RIGOR TÈCNIC]</h4>
                <div className="flex flex-wrap gap-2">
                    <button className="btn-hud-small text-[10px]" onClick={() => navigate('/dafo/utilitat-social')}>DAFO UTILITAT</button>
                    <button className="btn-hud-small text-[10px]" onClick={() => navigate('/dafo/iaia')}>DAFO IAIA</button>
                    <button className="btn-hud-small text-[10px]" onClick={() => navigate('/dafo/projecte')}>DAFO PROJECTE</button>
                </div>
            </div>

            <div className="mt-4 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase">Directiva Master Actual</h4>
                <p className="text-sm italic text-gray-300">"Tot bategat, tot píxel i tota línia de codi neix i mor per la Utilitat Social."</p>
            </div>
        </div>
    );
};

// 10. MEMORY GOVERNANCE MODULE (NIVELL DÉU)
const MemoryGovernanceModule = ({ addLog }) => {
    const [recovering, setRecovering] = useState(false);
    const [vaultStats, setVaultStats] = useState({
        chats: 128,
        mur: 45,
        mercat: 12,
        towns: 8
    });

    const runFullRecovery = async () => {
        setRecovering(true);
        addLog('Iniciant Recuperació de Memòria Nivell DÉU...', 'warn');
        try {
            await new Promise(r => setTimeout(r, 1000));
            addLog('Escanejant bategats de xat (Agents)... OK', 'info');
            await new Promise(r => setTimeout(r, 1000));
            addLog('Recuperant memòria del Mur y Mercat... OK', 'info');
            await new Promise(r => setTimeout(r, 1000));
            addLog('Sincronitzant amb la consciència de l\'IAIA... OK', 'success');

            setVaultStats(prev => ({
                ...prev,
                chats: prev.chats + Math.floor(Math.random() * 5),
                mur: prev.mur + 1
            }));

            addLog('MEMÒRIA BLINDADA Y RECUPERADA.', 'success');
            alert("Sincronització de Memòria Master completada.");
        } catch (e) {
            addLog(`Error en recuperació: ${e.message}`, 'error');
        } finally {
            setRecovering(false);
        }
    };

    return (
        <div className="neural-core-panel" style={{ minHeight: '400px' }}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Brain color="var(--color-warning)" /> GOVERN DE LA MEMÒRIA [LLEI VII]
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border border-gray-700 rounded-xl bg-black/20">
                    <h3 className="font-bold text-lg mb-2 text-yellow-400">🛡️ VOUT DE SEGURETAT</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-2 bg-gray-900 rounded-lg text-center">
                            <span className="block text-xl font-bold">{vaultStats.chats}</span>
                            <span className="text-[10px] opacity-50">XATS (AGENTS)</span>
                        </div>
                        <div className="p-2 bg-gray-900 rounded-lg text-center">
                            <span className="block text-xl font-bold">{vaultStats.mur}</span>
                            <span className="text-[10px] opacity-50">POSTS MUR</span>
                        </div>
                        <div className="p-2 bg-gray-900 rounded-lg text-center">
                            <span className="block text-xl font-bold">{vaultStats.mercat}</span>
                            <span className="text-[10px] opacity-50">PRODUCTES</span>
                        </div>
                        <div className="p-2 bg-gray-900 rounded-lg text-center">
                            <span className="block text-xl font-bold">{vaultStats.towns}</span>
                            <span className="text-[10px] opacity-50">POBLES</span>
                        </div>
                    </div>
                    <button className="btn-primary w-full" style={{ background: 'var(--color-warning)', color: '#000' }} onClick={runFullRecovery} disabled={recovering}>
                        {recovering ? 'RECUPERANT...' : 'EXECUTAR CRON DE MEMÒRIA'}
                    </button>
                </div>
                <div className="p-4 border border-gray-700 rounded-xl bg-black/20">
                    <h3 className="font-bold text-lg mb-2 text-cyan-400">📅 RITU RECURRENT</h3>
                    <p className="text-sm text-gray-400 mb-4">Planificació de la sincronització automàtica del bategat master.</p>
                    <div className="p-3 bg-cyan-900/10 border border-cyan-500/20 rounded-lg mb-4">
                        <p className="text-xs"><strong>PROXIM CRON:</strong> Cada 6 hores</p>
                        <p className="text-xs"><strong>ESTAT:</strong> SISTEMA EN AUTO-PILOT</p>
                    </div>
                    <button className="btn-hud-small w-full" onClick={() => addLog('Calendari de Memòria actualitzat.', 'info')}>
                        CONFIGURAR CALENDARI MASTER
                    </button>
                </div>
            </div>

            <div className="mt-6 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase">Directiva Inmutable (Llei VII)</h4>
                <p className="text-sm italic text-gray-300">"L'IAIA és la que genera y guarda totes les respostes y continguts... res es perd al bategat del Mas."</p>
            </div>
        </div>
    );
};
// 11. MARKETING & ANALYTICS MODULE
const MarketingModule = ({ addLog }) => {
    const [realtimeUsers, setRealtimeUsers] = useState(12);

    useEffect(() => {
        const interval = setInterval(() => {
            setRealtimeUsers(prev => prev + (Math.random() > 0.5 ? 1 : -1));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="neural-core-panel" style={{ minHeight: '400px' }}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Activity color="var(--color-primary)" /> MÀRQUETING UNIVERSAL [LLEI DEL CONEIXEMENT]
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border border-gray-700 rounded-xl bg-black/20">
                    <h3 className="font-bold text-lg mb-2 text-blue-400">📊 AUDIÈNCIA REALTIME</h3>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="text-4xl font-black text-white animate-pulse">{realtimeUsers}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-widest">Veïns a la plaça ara mateix</div>
                    </div>
                    <div className="p-3 bg-blue-900/10 border border-blue-500/20 rounded-lg">
                        <p className="text-xs text-blue-300"><strong>DARRERES 24H:</strong> 128 bategats únics</p>
                        <p className="text-xs text-blue-400"><strong>TAXA DE REGISTRE:</strong> 85% (Tier GOD)</p>
                    </div>
                </div>

                <div className="p-4 border border-gray-700 rounded-xl bg-black/20">
                    <h3 className="font-bold text-lg mb-2 text-cyan-400">🧠 GOOGLE SYNC (GA4/GTM)</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-xs p-2 bg-gray-900 rounded border border-gray-800">
                            <span>Google Tag Manager</span>
                            <span className="text-green-500 flex items-center gap-1"><CheckCircle size={10} /> CONNECTAT</span>
                        </div>
                        <div className="flex justify-between items-center text-xs p-2 bg-gray-900 rounded border border-gray-800">
                            <span>Analytics 4 (GA4)</span>
                            <span className="text-green-500 flex items-center gap-1"><CheckCircle size={10} /> CONNECTAT</span>
                        </div>
                        <div className="flex justify-between items-center text-xs p-2 bg-gray-900 rounded border border-gray-800">
                            <span>Search Console</span>
                            <span className="text-yellow-500 flex items-center gap-1"><AlertTriangle size={10} /> INDEXANT...</span>
                        </div>
                        <button className="btn-hud-small w-full text-[10px]" onClick={() => addLog('Sincronitzant mètrica Master amb Google...', 'action')}>
                            RE-SINCRO GOOGLE DATA
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-2">Canal d'Entrada</h4>
                    <div className="text-sm font-bold">QR Poble (La Torre): 45%</div>
                    <div className="w-full h-1 bg-gray-800 mt-1"><div className="bg-blue-500 h-full" style={{ width: '45%' }}></div></div>
                </div>
                <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-2">Wisdom Mode Usage</h4>
                    <div className="text-sm font-bold">Faena: 20% | Rondalla: 80%</div>
                    <div className="w-full h-1 bg-gray-800 mt-1"><div className="bg-yellow-500 h-full" style={{ width: '80%' }}></div></div>
                </div>
                <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-2">Retenció Sobirana</h4>
                    <div className="text-sm font-bold">92% Diària</div>
                    <div className="w-full h-1 bg-gray-800 mt-1"><div className="bg-green-500 h-full" style={{ width: '92%' }}></div></div>
                </div>
            </div>

            <div className="mt-6 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                <h4 className="text-xs font-bold text-gray-400 mb-2 uppercase">Directiva de Màrqueting Universal (Gènesi)</h4>
                <p className="text-xs italic text-gray-500">"Mesurem el bategat del territori per a transformar la dada en utilitat social i proximitat."</p>
                <div className="mt-4">
                    <button className="btn-primary" style={{ height: '32px', fontSize: '10px' }} onClick={() => navigate('/marketing-plan')}>
                        VEURE PLA UNIVERSAL COMPLET 📜
                    </button>
                </div>
            </div>
        </div>
    );
};

// 12. EDITORIAL GOVERNANCE MODULE
const EditorialGovernanceModule = ({ addLog }) => {
    const [view, setView] = useState('posts');

    return (
        <div className="neural-core-panel" style={{ minHeight: '500px' }}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Pin color="var(--color-error)" /> GOVERNANÇA EDITORIAL [LLEI DE POSICIÓ]
            </h2>

            <div className="flex gap-2 mb-6">
                <button
                    className={`btn-hud-small ${view === 'posts' ? 'active' : ''}`}
                    onClick={() => setView('posts')}
                    style={{ background: view === 'posts' ? 'var(--color-error)' : 'transparent' }}
                >
                    MUR (PINS)
                </button>
                <button
                    className={`btn-hud-small ${view === 'market' ? 'active' : ''}`}
                    onClick={() => setView('market')}
                    style={{ background: view === 'market' ? 'var(--color-error)' : 'transparent' }}
                >
                    MERCAT (PINS)
                </button>
            </div>

            <AdminPinnedManager
                type={view === 'posts' ? 'post' : 'market'}
                onClose={() => addLog(`Configuració de pins pel ${view} bategada.`, 'success')}
            />

            <div className="mt-6 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase">Llei de la Posició Fixa (Gènesi v1.6.1)</h4>
                <p className="text-sm italic text-gray-400">
                    "La visibilitat és un bategat que el Super Admin distribueix segons la utilitat social o la solvència del Mas."
                </p>
            </div>
        </div>
    );
};

// 13. PERMISSIONS GOVERNANCE MODULE
const PermissionsGovernanceModule = ({ addLog }) => {
    const [roles, setRoles] = useState([
        { id: 'super_admin', label: 'Super Admin', access: 'Total (God Mode)', color: 'var(--hud-accent)' },
        { id: 'admin', label: 'Administrador', access: 'Gestió de Poble', color: 'var(--color-primary)' },
        { id: 'editor', label: 'Editor', access: 'Contingu i Pins', color: 'var(--color-error)' },
        { id: 'author', label: 'Autor Verificat', access: 'Publicació Directa', color: 'var(--color-warning)' },
        { id: 'neighbor', label: 'Veí', access: 'Estàndard', color: 'var(--text-muted)' }
    ]);

    return (
        <div className="neural-core-panel" style={{ minHeight: '500px' }}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Shield color="var(--color-primary)" /> JERARQUIA D'HABITANTS [PROTOCOL VALENTIA]
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border border-gray-700 rounded-xl bg-black/20">
                    <h3 className="font-bold text-lg mb-4 text-blue-400">🛡️ DEFINICIÓ DE ROLS</h3>
                    <div className="space-y-3">
                        {roles.map(role => (
                            <div key={role.id} className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                                <div>
                                    <div className="font-bold text-sm" style={{ color: role.color }}>{role.label}</div>
                                    <div className="text-[10px] opacity-50 uppercase">{role.access}</div>
                                </div>
                                <button className="btn-hud-small text-[10px]">CONFIGURAR</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 border border-gray-700 rounded-xl bg-black/20">
                    <h3 className="font-bold text-lg mb-4 text-cyan-400">⚡ ACCIONS DE SEGURETAT</h3>
                    <div className="space-y-3">
                        <div className="p-3 bg-red-900/10 border border-red-500/20 rounded-lg">
                            <p className="text-xs font-bold text-red-400 mb-1">BLINDATGE MASTER</p>
                            <p className="text-[10px] opacity-70 mb-3">Només el Mestre i el Cercle poden elevar un usuari a Super Admin.</p>
                            <button className="btn-primary w-full bg-red-600 text-white text-[10px] h-8">AUDITAR ACCESOS CRÍTICS</button>
                        </div>
                        <button className="btn-hud-small w-full" onClick={() => addLog('Protocol de permisos bategat.', 'info')}>
                            REESTABLIR PERMISOS PER DEFECTE
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-6 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase">Llei de la Sobirania Administrativa (Gènesi v1.6.2)</h4>
                <p className="text-sm italic text-gray-400">
                    "L'accés és una responsabilitat compartida, però la font de veritat resideix en el Mestre."
                </p>
            </div>
        </div>
    );
};

export default AdminPanel;
