import React, { useState, useEffect } from 'react';
import { supabaseService } from '../../services/supabaseService';
import {
    Activity, Users, Store, Zap, Heart, TrendingUp,
    MessageCircle, AlertCircle, Clock, CheckCircle, Brain
} from 'lucide-react';
import { logger } from '../../utils/logger';

const GlobalOverview = ({ addLog }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const overview = await supabaseService.getGlobalOverview();
                setData(overview);
            } catch (err) {
                logger.error('UCC Load Error:', err);
                if (addLog) addLog('Error al carregar la Visió Global.', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchOverview();

        // Polling for "Real-Time" feel (every 30s)
        const interval = setInterval(fetchOverview, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="ucc-loading">
                <Activity className="animate-pulse text-cyan-400" size={32} />
                <p className="text-xs font-mono mt-4 opacity-50 uppercase tracking-widest">Sincronitzant Nucli Cognitiu...</p>
            </div>
        );
    }

    const stats = data?.stats || {};
    const timeline = data?.timeline || [];
    const seo = data?.seo || {};

    return (
        <div className="ucc-dashboard animate-fadeIn">
            {/* KPI STRIP */}
            <div className="ucc-kpi-grid mb-8">
                <div className="kpi-card border-l-4 border-cyan-500">
                    <div className="kpi-icon text-cyan-400"><Users size={20} /></div>
                    <div className="kpi-content">
                        <span className="kpi-val">{stats.totalUsers}</span>
                        <span className="kpi-label">CIUTADANS TOTALS</span>
                    </div>
                </div>
                <div className="kpi-card border-l-4 border-green-500">
                    <div className="kpi-icon text-green-400"><TrendingUp size={20} /></div>
                    <div className="kpi-content">
                        <span className="kpi-val">+{stats.newUsers24h}</span>
                        <span className="kpi-label">NOUS (24h)</span>
                    </div>
                </div>
                <div className="kpi-card border-l-4 border-red-500">
                    <div className="kpi-icon text-red-400"><AlertCircle size={20} /></div>
                    <div className="kpi-content">
                        <span className="kpi-val">{stats.errorCount}</span>
                        <span className="kpi-label">INCIDÈNCIES</span>
                    </div>
                </div>
                <div className="kpi-card border-l-4 border-blue-500">
                    <div className="kpi-icon text-blue-400"><Activity size={20} /></div>
                    <div className="kpi-content">
                        <span className="kpi-val">{seo.healthScore}%</span>
                        <span className="kpi-label">SALUT SEO</span>
                    </div>
                </div>
            </div>

            <div className="ucc-main-layout">
                {/* LEFT: ACTIVITY PIPELINE */}
                <div className="ucc-column ucc-pipeline">
                    <div className="column-header">
                        <div className="flex items-center gap-2">
                            <Zap className="text-yellow-400" size={18} />
                            <h3>ACTIVITY PIPELINE</h3>
                        </div>
                        <span className="badge-live">LIVE</span>
                    </div>

                    <div className="ucc-pipeline-scroll">
                        {timeline.length > 0 ? timeline.map((item, idx) => (
                            <div key={`${item.type}-${item.id}-${idx}`} className={`pipeline-item ${item.type}`}>
                                <div className="item-icon">
                                    {item.type === 'post' && <MessageCircle size={14} />}
                                    {item.type === 'market' && <Store size={14} />}
                                    {item.type === 'user' && <Users size={14} />}
                                </div>
                                <div className="item-details">
                                    <div className="item-meta">
                                        <span className="item-label">{item.label}</span>
                                        <span className="item-time">
                                            {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="item-title">{item.title || item.content?.substring(0, 50) + '...'}</p>
                                    <p className="item-author">per {item.profiles?.full_name || 'Usuari'}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="opacity-30 text-center py-12 italic text-sm">Sense activitat recent detectada.</div>
                        )}
                    </div>
                </div>

                {/* RIGHT: SYSTEM NODES */}
                <div className="ucc-column ucc-nodes">
                    {/* NODE: SYSTEM STATUS */}
                    <div className="ucc-node-card mb-6">
                        <div className="column-header mb-4">
                            <div className="flex items-center gap-2">
                                <Brain className="text-purple-400" size={18} />
                                <h3>ESTAT DEL NUCLI</h3>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="node-stat-row">
                                <span className="label">Versió actual</span>
                                <span className="value font-mono text-cyan-400">v1.5.7-BATEGA</span>
                            </div>
                            <div className="node-stat-row">
                                <span className="label">Base de dades</span>
                                <span className="value flex items-center gap-1 text-green-400">
                                    <CheckCircle size={12} /> CONNECTAT
                                </span>
                            </div>
                            <div className="node-stat-row">
                                <span className="label">Fons de l'IAIA</span>
                                <span className="value flex items-center gap-1 text-cyan-400">
                                    <CheckCircle size={12} /> OPERATIU
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/5">
                            <h4 className="text-[10px] uppercase tracking-widest opacity-40 mb-3">Auditoria ràpida</h4>
                            <div className="flex flex-wrap gap-2">
                                <div className={`badge-status ${seo.hasSitemap ? 'success' : 'warn'}`}>Sitemap</div>
                                <div className={`badge-status ${seo.hasRobots ? 'success' : 'warn'}`}>Robots.txt</div>
                                <div className="badge-status success">RLS SSL</div>
                            </div>
                        </div>
                    </div>

                    {/* NODE: DIRECT ACTIONS */}
                    <div className="ucc-node-card">
                        <div className="column-header mb-4">
                            <div className="flex items-center gap-2">
                                <Activity className="text-red-400" size={18} />
                                <h3>ACCIONS RÀPIDES</h3>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <button className="ucc-action-btn" onClick={() => addLog('Purgant caché cognitiva...', 'action')}>
                                <RefreshCcw size={14} className="mr-2" /> Purgar Caché Global
                            </button>
                            <button className="ucc-action-btn" onClick={() => addLog('Executant backup de seguretat...', 'action')}>
                                <Shield size={14} className="mr-2" /> Escaneig de Seguretat
                            </button>
                            <button className="ucc-action-btn highlight" onClick={() => window.dispatchEvent(new CustomEvent('open-diagnostic-hud'))}>
                                <Terminal size={14} className="mr-2" /> Obrir Consola HUD
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .ucc-dashboard {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                }
                
                .ucc-kpi-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 16px;
                }
                
                .kpi-card {
                    background: var(--admin-surface);
                    padding: 20px;
                    border-radius: 0px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                
                .kpi-icon {
                    width: 40px;
                    height: 40px;
                    background: rgba(255,255,255,0.03);
                    border-radius: 0px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .kpi-val {
                    display: block;
                    font-size: 24px;
                    font-weight: 800;
                    line-height: 1;
                    font-family: monospace;
                }
                
                .kpi-label {
                    font-size: 10px;
                    opacity: 0.5;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                }
                
                .ucc-main-layout {
                    display: grid;
                    grid-template-columns: 1fr 340px;
                    gap: 24px;
                }
                
                @media (max-width: 1200px) {
                    .ucc-main-layout {
                        grid-template-columns: 1fr;
                    }
                }
                
                .ucc-column {
                    background: var(--admin-surface);
                    border-radius: 0px;
                    padding: 24px;
                    border: 1px solid rgba(255,255,255,0.05);
                }
                
                .column-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                
                .column-header h3 {
                    font-size: 14px;
                    font-weight: 900;
                    letter-spacing: 1px;
                    margin: 0;
                }
                
                .badge-live {
                    background: #ff0055;
                    color: white;
                    font-size: 8px;
                    font-weight: 900;
                    padding: 2px 6px;
                    border-radius: 0px;
                    animation: pulse-red 2s infinite;
                }
                
                @keyframes pulse-red {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
                
                .ucc-pipeline-scroll {
                    max-height: 600px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    padding-right: 8px;
                }
                
                .pipeline-item {
                    background: rgba(255,255,255,0.03);
                    border-radius: 0px;
                    padding: 16px;
                    display: flex;
                    gap: 16px;
                    border: 1px solid transparent;
                    transition: all 0.2s;
                }
                
                .pipeline-item:hover {
                    background: rgba(255,255,255,0.06);
                    border-color: rgba(255,255,255,0.1);
                    transform: translateX(4px);
                }
                
                .item-icon {
                    width: 36px;
                    height: 36px;
                    border-radius: 0px;
                    background: rgba(0,0,0,0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                
                .pipeline-item.post .item-icon { color: #5d5fef; }
                .pipeline-item.market .item-icon { color: #ffaa00; }
                .pipeline-item.user .item-icon { color: #00f2ff; }
                
                .item-details {
                    flex: 1;
                }
                
                .item-meta {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 4px;
                }
                
                .item-label {
                    font-size: 10px;
                    font-weight: 800;
                    text-transform: uppercase;
                    opacity: 0.4;
                    letter-spacing: 0.5px;
                }
                
                .item-time {
                    font-size: 10px;
                    font-family: monospace;
                    opacity: 0.3;
                }
                
                .item-title {
                    font-size: 13px;
                    font-weight: 700;
                    margin: 0;
                    color: white;
                }
                
                .item-author {
                    font-size: 11px;
                    opacity: 0.5;
                    margin: 4px 0 0;
                }
                
                .ucc-node-card {
                    background: rgba(0,0,0,0.15);
                    border-radius: 0px;
                    padding: 20px;
                    border: 1px solid rgba(255,255,255,0.05);
                }
                
                .node-stat-row {
                    display: flex;
                    justify-content: space-between;
                    font-size: 12px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid rgba(255,255,255,0.03);
                }
                
                .node-stat-row .label { opacity: 0.5; }
                .node-stat-row .value { font-weight: 700; }
                
                .badge-status {
                    font-size: 9px;
                    font-weight: 800;
                    padding: 4px 10px;
                    border-radius: 0px;
                    background: rgba(255,255,255,0.03);
                    text-transform: uppercase;
                }
                
                .badge-status.success { color: #4ade80; background: rgba(74, 222, 128, 0.1); }
                .badge-status.warn { color: #fbbf24; background: rgba(251, 191, 36, 0.1); }
                
                .ucc-action-btn {
                    width: 100%;
                    padding: 12px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 0px;
                    color: white;
                    font-size: 11px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .ucc-action-btn:hover {
                    background: rgba(255,255,255,0.1);
                    border-color: rgba(255,255,255,0.2);
                }
                
                .ucc-action-btn.highlight {
                    background: var(--color-primary);
                    border-color: var(--color-primary);
                }
                
                .ucc-loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 100px 0;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

const RefreshCcw = ({ size, className }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M21 2v6h-6" />
        <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
        <path d="M3 22v-6h6" />
        <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    </svg>
);

const Shield = ({ size, className }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
);

export default GlobalOverview;
