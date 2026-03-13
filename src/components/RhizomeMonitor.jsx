import React, { useState, useEffect } from 'react';
import { Shield, Zap, Database, Trash2, RefreshCw } from 'lucide-react';
import { rhizomeDb } from '../rhizome/db-core';
import { rhizomeManager } from '../services/rhizomeManager';
import { logger } from '../utils/logger';

const RhizomeMonitor = () => {
    const [stats, setStats] = useState({ ops: 0, snapshots: 0, lastPrune: 'Mai', version: '1.0.0' });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        setLoading(true);
        try {
            // [MASTER] - En un entorn real el worker tindria un mètode GET_STATS
            // Per a la POC, simulem el bategat basat en les dades disponibles
            const ops = await rhizomeDb.getOperations('global');
            const snapshot = await rhizomeDb.getSnapshot('global');
            const version = localStorage.getItem('sp_rhizome_version') || '1.0.0';
            
            setStats({
                ops: ops.length,
                snapshots: snapshot ? 1 : 0,
                lastPrune: localStorage.getItem('sp_rhizome_last_prune') || 'Mai',
                version: version
            });
        } catch (err) {
            logger.error('[RhizomeMonitor] Error fetching stats:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePrune = async () => {
        const success = await rhizomeManager.pruneHistory('global');
        if (success) {
            localStorage.setItem('sp_rhizome_last_prune', new Date().toLocaleTimeString());
            fetchStats();
        }
    };

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[28px] p-6 text-white font-sans mt-8">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <Database className="text-orange-500" size={24} />
                    <h3 className="text-lg font-black uppercase tracking-tighter">Motor Eg-walker CRDT</h3>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                    ONLINE
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 p-4 rounded-[28px] border border-white/5">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-1">Operacions DAG</span>
                    <div className="text-2xl font-black">{stats.ops}</div>
                </div>
                <div className="bg-white/5 p-4 rounded-[28px] border border-white/5">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-1">Versió Crítica</span>
                    <div className="text-2xl font-black text-orange-500">{stats.version}</div>
                </div>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-xs">
                    <span className="text-gray-500 font-bold uppercase tracking-widest">Darrera Poda ($Vcrit):</span>
                    <span className="font-mono">{stats.lastPrune}</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="text-gray-500 font-bold uppercase tracking-widest">Integritat Graph:</span>
                    <span className="text-green-500 font-bold">W-LEVEL-MAX</span>
                </div>
            </div>

            <div className="flex gap-3">
                <button 
                    onClick={fetchStats}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[28px] transition-all flex items-center justify-center gap-2"
                >
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    <span className="text-[10px] font-black uppercase">Refrescar</span>
                </button>
                <button 
                    onClick={handlePrune}
                    className="flex-1 py-3 bg-orange-500/20 hover:bg-orange-500/40 border border-orange-500/30 text-orange-400 rounded-[28px] transition-all flex items-center justify-center gap-2"
                >
                    <Trash2 size={14} />
                    <span className="text-[10px] font-black uppercase">Poda Atòmica</span>
                </button>
            </div>

            <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-[28px] flex items-start gap-3">
                <Shield className="text-indigo-400 mt-1" size={16} />
                <p className="text-[10px] text-indigo-300 italic leading-relaxed">
                    Arquitectura de Ferro: Les dades bateguen localment al Rhizome privat. Cap servidor pot destruir la memòria del Mas.
                </p>
            </div>
        </div>
    );
};

export default RhizomeMonitor;
