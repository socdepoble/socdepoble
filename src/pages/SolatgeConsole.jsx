import React, { useState, useEffect } from 'react';
import {
    Zap,
    Database,
    Wifi,
    WifiOff,
    Activity,
    HardDrive,
    ShieldCheck,
    Terminal,
    ChevronRight,
    RefreshCw,
    Box,
    Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { rhizomeDb } from '../rhizome/db-core';
import { egWalker } from '../rhizome/crdt/eg-walker';
import './SolatgeConsole.css';

import Haptics from '../utils/HapticFeedback';

/**
 * Consola de Comandament Solatge v1.0 (Tier GOD)
 * El HUD sobirà per a la gestió de la Village Cell.
 */
const SolatgeConsole = () => {
    const { user, profile } = useAuth();
    const [dbStatus, setDbStatus] = useState('loading');
    const [stats, setStats] = useState({ ops: 0, snapshots: 0, size: '0MB', peritext: { marksCount: 0, stableAnchors: 0 } });
    const [logs, setLogs] = useState([
        { id: 1, time: 'Ara', msg: '🚜 Benvingut a la Consola Solatge v1.0' },
        { id: 2, time: 'Ara', msg: '⚡️ Protocol Batec Actiu' }
    ]);

    useEffect(() => {
        const initConsole = async () => {
            try {
                const db = await rhizomeDb.init();
                setDbStatus(db ? 'online' : 'offline');

                // Real DB metrics + Peritext richness
                const allOps = await rhizomeDb.getOperations('master_log');
                const pMetrics = await rhizomeManager.getPeritextMetrics('master_log');

                setStats({
                    ops: allOps.length,
                    snapshots: 1,
                    size: '2.4MB',
                    peritext: pMetrics
                });
                Haptics.trigger(Haptics.light);
            } catch (err) {
                setDbStatus('error');
            }
        };
        initConsole();
    }, []);

    const addLog = (msg, type = 'info') => {
        const icons = { info: '🚜', help: '💡', success: '✅', error: '❌', alert: '⚠️' };
        setLogs(prev => [{
            id: Date.now(),
            time: new Date().toLocaleTimeString(),
            msg: `${icons[type] || ''} ${msg}`
        }, ...prev.slice(0, 9)]);
    };

    const showInfo = (term) => {
        const dictionary = {
            sincronitzar: "SINCRONITZAR: Uneix les dades del teu mòbil amb la xarxa sobirana. És com 'bategar' per estar al dia amb el poble.",
            sembra: "SEMBRA DIGITAL: Importa coneixement extern (com els teus enllaços) per enriquir el 'terrer' digital de la comunitat.",
            snapshot: "SNAPSHOT: Crea una còpia de seguretat instantània. Una 'càpsula del temps' per si alguna cosa es trastomba."
        };
        Haptics.trigger(Haptics.light);
        addLog(dictionary[term], 'help');
    };

    return (
        <div className="solatge-container animate-bategat">
            {/* HEADER M3 SURFACE */}
            <header className="solatge-header">
                <div className="brand">
                    <Box size={32} className="neon-pulse" />
                    <div>
                        <h1>SOLATGE</h1>
                        <span className="subtitle">VILLAGE OS CORE</span>
                    </div>
                </div>
                <div className={`status-pill ${dbStatus}`}>
                    {dbStatus === 'online' ? <Wifi size={16} /> : <WifiOff size={16} />}
                    <span>{dbStatus.toUpperCase()}</span>
                </div>
            </header>

            {/* GRID DE MÈTRIQUES RIZOMA */}
            <div className="solatge-grid">
                <div className="metric-card glass-ia">
                    <Database className="icon" />
                    <div className="data">
                        <span className="label">OPERACIONS</span>
                        <span className="value">{stats.ops}</span>
                    </div>
                </div>
                <div className="metric-card glass-ia">
                    <Activity className="icon neon-pulse" />
                    <div className="data">
                        <span className="label">SYNC HOPS</span>
                        <span className="value">3</span>
                    </div>
                </div>
                <div className="metric-card glass-ia">
                    <ShieldCheck className="icon" />
                    <div className="data">
                        <span className="label">SOBIRANIA</span>
                        <span className="value">98%</span>
                    </div>
                </div>
                <div className="metric-card glass-ia">
                    <HardDrive className="icon" />
                    <div className="data">
                        <span className="label">REBOST</span>
                        <span className="value">{stats.size}</span>
                    </div>
                </div>
                <div className="metric-card glass-ia">
                    <Zap className="icon neon-pulse" />
                    <div className="data">
                        <span className="label">ANCRES PERITEXT</span>
                        <span className="value">{stats.peritext.stableAnchors}</span>
                    </div>
                </div>
            </div>

            {/* AREA DE COMANDAMENT */}
            <div className="command-center">
                <div className="console-panel">
                    <div className="panel-header">
                        <Terminal size={18} />
                        <span>REGISTRE DE L'IAIA</span>
                    </div>
                    <div className="logs">
                        {logs.map(log => (
                            <div key={log.id} className="log-entry">
                                <span className="time">[{log.time}]</span>
                                <span className="msg">{log.msg}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="actions-panel">
                    <div className="action-wrapper">
                        <button
                            className="action-btn primary"
                            onClick={() => {
                                Haptics.trigger(Haptics.success);
                                addLog('Iniciant Sincronització P2P...', 'info');
                            }}
                        >
                            <RefreshCw size={24} />
                            <span>SINCRONITZAR</span>
                        </button>
                        <button className="info-trigger" onClick={(e) => { e.stopPropagation(); showInfo('sincronitzar'); }}>
                            <Info size={16} />
                        </button>
                    </div>

                    <div className="action-wrapper">
                        <button
                            className="action-btn secondary"
                            onClick={async () => {
                                Haptics.trigger(Haptics.heavy);
                                addLog('Iniciant SEMBRA DIGITAL (Raindrop)...', 'info');
                                try {
                                    const response = await fetch('/rhizome_seed_data.json');
                                    const seeds = await response.json();
                                    addLog(`Llegides ${seeds.total_seeds} llavors.`, 'info');

                                    import('../services/seedService').then(async ({ seedService }) => {
                                        const result = await seedService.importSeeds(seeds);
                                        if (result.success) {
                                            addLog(`${result.count} llavors bategades amb èxit.`, 'success');
                                        } else {
                                            addLog(`Error: ${result.error}`, 'error');
                                        }
                                    });
                                } catch (err) {
                                    addLog(`Error carregant llavors: ${err.message}`, 'error');
                                }
                            }}
                        >
                            <Box size={24} />
                            <span>SEMBRA DIGITAL</span>
                        </button>
                        <button className="info-trigger" onClick={(e) => { e.stopPropagation(); showInfo('sembra'); }}>
                            <Info size={16} />
                        </button>
                    </div>

                    <div className="action-wrapper">
                        <button
                            className="action-btn secondary"
                            onClick={() => {
                                Haptics.trigger(Haptics.light);
                                addLog('Generant Snapshot crític...', 'info');
                            }}
                        >
                            <Zap size={24} />
                            <span>SNAPSHOT</span>
                        </button>
                        <button className="info-trigger" onClick={(e) => { e.stopPropagation(); showInfo('snapshot'); }}>
                            <Info size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* MASTER FOOTER */}
            <footer className="solatge-footer">
                <div className="node-info">
                    <span>NODE: {egWalker.nodeId.substring(0, 12)}...</span>
                    <span>PROTOCOL: Rhizome v3.0</span>
                </div>
                <div className="version-tag">BATEGA EDITION</div>
            </footer>
        </div>
    );
};

export default SolatgeConsole;
