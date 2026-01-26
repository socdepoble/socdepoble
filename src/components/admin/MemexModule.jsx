import React, { useState } from 'react';
import { Brain, Zap, Shield, LayoutGrid, AlertTriangle, CheckCircle, RefreshCcw, BookOpen } from 'lucide-react';
import { memexData } from '../../data/memexData';

const MemexModule = ({ addLog }) => {
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSync = () => {
        setIsSyncing(true);
        addLog('Iniciant sincronització de Memex...', 'action');

        // Simulated sync logic
        setTimeout(() => {
            addLog('Escanejant IAIA_MEMEX.md...', 'info');
        }, 800);

        setTimeout(() => {
            addLog('Caché cognitiva actualitzada amb v1.5.1.', 'success');
            setIsSyncing(false);
        }, 2000);
    };

    const getIcon = (iconName) => {
        switch (iconName) {
            case 'Shield': return <Shield size={18} />;
            case 'Zap': return <Zap size={18} />;
            case 'LayoutGrid': return <LayoutGrid size={18} />;
            case 'AlertTriangle': return <AlertTriangle size={18} />;
            case 'CheckCircle': return <CheckCircle size={18} />;
            default: return <BookOpen size={18} />;
        }
    };

    return (
        <div className="memex-module-inner">
            <div className="module-header-modern mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2 text-cyan-400">
                            <Brain /> IAIA MEMEX <span className="text-xs opacity-50 font-mono">v{memexData.version}</span>
                        </h2>
                        <p className="text-gray-400 text-sm">Caché de coneixement persistent del projecte.</p>
                    </div>
                    <button
                        className={`btn-neon flex items-center gap-2 ${isSyncing ? 'opacity-50 pointer-events-none' : ''}`}
                        onClick={handleSync}
                    >
                        <RefreshCcw size={16} className={isSyncing ? 'spin' : ''} />
                        {isSyncing ? 'SINCRONITZANT...' : 'RE-SINCRONITZAR'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="stat-node-compact">
                    <span className="label">INTEGRITAT</span>
                    <span className="value text-cyan-400">{memexData.stats.architectureIntegrity}%</span>
                </div>
                <div className="stat-node-compact">
                    <span className="label">RETENCIÓ</span>
                    <span className="value text-green-400">{memexData.stats.cognitiveRetention}%</span>
                </div>
                <div className="stat-node-compact">
                    <span className="label">INCIDÈNCIES</span>
                    <span className="value text-yellow-400">{memexData.stats.unresolvedIncidents}</span>
                </div>
            </div>

            <h3 className="text-xs font-mono mb-4 text-gray-500 uppercase tracking-widest">Knowledge Nodes</h3>

            <div className="knowledge-grid">
                {memexData.knowledgeNodes.map(node => (
                    <div key={node.id} className={`knowledge-node-card ${node.priority}`}>
                        <div className="node-header">
                            <div className="node-icon">{getIcon(node.icon)}</div>
                            <span className="node-category">{node.category}</span>
                        </div>
                        <h4 className="node-title">{node.title}</h4>
                        <p className="node-content text-sm">{node.content}</p>
                        <div className="node-footer">
                            <span className={`priority-tag ${node.priority}`}>{node.priority}</span>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .knowledge-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 16px;
                }
                .knowledge-node-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 20px;
                    border-radius: 16px;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                .knowledge-node-card:hover {
                    background: rgba(255, 255, 255, 0.05);
                    transform: translateY(-4px);
                    border-color: rgba(255, 255, 255, 0.2);
                }
                .knowledge-node-card.crítica {
                    border-left: 4px solid #ff0055;
                }
                .knowledge-node-card.alta {
                    border-left: 4px solid #00f2ff;
                }
                .knowledge-node-card.mitjana {
                    border-left: 4px solid #5d5fef;
                }
                .node-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 12px;
                }
                .node-icon {
                    color: rgba(255, 255, 255, 0.5);
                }
                .node-category {
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 1px;
                    color: rgba(255, 255, 255, 0.3);
                    text-transform: uppercase;
                }
                .node-title {
                    font-size: 1.1rem;
                    font-weight: 700;
                    margin-bottom: 8px;
                    color: #fff;
                }
                .node-content {
                    color: #aaa;
                    line-height: 1.5;
                    margin-bottom: 16px;
                }
                .priority-tag {
                    font-size: 10px;
                    font-weight: 700;
                    padding: 2px 8px;
                    border-radius: 4px;
                    text-transform: uppercase;
                }
                .priority-tag.crítica { background: #ff005522; color: #ff0055; }
                .priority-tag.alta { background: #00f2ff22; color: #00f2ff; }
                .priority-tag.mitjana { background: #5d5fef22; color: #5d5fef; }
                
                .stat-node-compact {
                    background: rgba(0, 0, 0, 0.3);
                    padding: 16px;
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .stat-node-compact .label { font-size: 10px; color: #666; font-weight: 700; }
                .stat-node-compact .value { font-size: 1.5rem; font-weight: 800; font-family: 'Courier New', Courier, monospace; }
            `}</style>
        </div>
    );
};

export default MemexModule;
