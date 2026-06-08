// 🚧 SOSP-STATUS: LOCKED
// ╔══════════════════════════════════════════════════════════════╗
// ║  UmamiDashboard.jsx · STATUS: ACTIU v2.0.0                  ║
// ║  Propietari: Consell de la Petorreta / Javi (el Mestre)      ║
// ║  Data de revisió: 2026-06-08 · Auditor: Eixam Complet       ║
// ║  Clau: MESTRE_PERMET_EDITAR                                  ║
// ║  NOTA: API_KEY i WEBSITE_ID han d'anar a .env (VITE_*)       ║
// ║  Regla Anti-Frankenstein: rewrite_limit 20%                  ║
// ╚══════════════════════════════════════════════════════════════╝

import React, { useState, useEffect } from 'react';
import { Users, Eye, MousePointerClick, Activity, ExternalLink, RefreshCw } from 'lucide-react';

export default function UmamiDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const startAt = 1717000000000;
        const endAt = Date.now() + 86400000; 
        const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID ?? '6ffce900-c41a-470e-9b12-38fb6028db18';
        const apiKey = import.meta.env.VITE_UMAMI_API_KEY ?? 'api_OHQt4qmq3BGhUnnUNa1e0IqESiiy7eFy';

        const response = await fetch(`https://api.umami.is/v1/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}`, {
          headers: {
            'x-umami-api-key': apiKey
          }
        });

        if (!response.ok) throw new Error('Error al connectar amb el servidor de telemetria');
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="w-full mt-12 bg-white dark:bg-[#1a1a1a] rounded-3xl border border-black/10 dark:border-white/10 shadow-lg overflow-hidden notranslate flex flex-col">
      {/* Header and Call to Action */}
      <div className="p-6 sm:p-10 border-b border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-stone-50 dark:bg-stone-900/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--theme-accent-secondary)] flex items-center justify-center text-white shrink-0 shadow-sm">
            <Activity size={24} />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-black dark:text-white uppercase tracking-tight m-0 leading-none">Telemetria Poca-solta</h2>
            <p className="text-[var(--theme-accent-primary)] font-bold uppercase text-sm mt-1">Dades públiques de Sóc de Poble</p>
          </div>
        </div>
        <a 
          href="https://cloud.umami.is/share/lQNmqOm9PM8XD3eF" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold uppercase px-6 py-3 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-transform active:scale-95 shadow-md w-full sm:w-auto justify-center"
        >
          <ExternalLink size={20} />
          <span>Tauler Complet (Gràfics)</span>
        </a>
      </div>

      {/* Stats Grid */}
      <div className="p-6 sm:p-10">
        {loading ? (
          <div className="w-full h-[200px] flex items-center justify-center bg-black/5 dark:bg-white/5 rounded-2xl animate-pulse">
            <div className="flex flex-col items-center opacity-50">
              <RefreshCw size={32} className="animate-spin mb-4" />
              <span className="font-bold tracking-widest uppercase">Connectant amb la matriu...</span>
            </div>
          </div>
        ) : error ? (
          <div className="w-full p-8 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 flex flex-col items-center justify-center">
            <Activity size={32} className="mb-2" />
            <p className="font-bold text-center">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden group hover:bg-[var(--theme-accent-secondary)] transition-colors duration-300">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity flex items-center justify-center"><Users size={120} /></div>
              <Users size={32} className="text-[var(--theme-accent-secondary)] group-hover:text-white mb-3" />
              <span className="text-4xl sm:text-5xl font-black text-black dark:text-white group-hover:text-white relative z-10">{stats?.visitors || 0}</span>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider opacity-60 group-hover:text-white group-hover:opacity-100 mt-2 relative z-10">Visitants Únics</span>
            </div>
            <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden group hover:bg-[var(--theme-accent-primary)] transition-colors duration-300">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity flex items-center justify-center"><Eye size={120} /></div>
              <Eye size={32} className="text-[var(--theme-accent-primary)] group-hover:text-white mb-3" />
              <span className="text-4xl sm:text-5xl font-black text-black dark:text-white group-hover:text-white relative z-10">{stats?.pageviews || 0}</span>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider opacity-60 group-hover:text-white group-hover:opacity-100 mt-2 relative z-10">Pàgines Vistes</span>
            </div>
            <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden group hover:bg-black dark:hover:bg-white transition-colors duration-300">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-10 transition-opacity flex items-center justify-center"><MousePointerClick size={120} className="dark:text-black text-white" /></div>
              <MousePointerClick size={32} className="text-black dark:text-white group-hover:text-white dark:group-hover:text-black mb-3" />
              <span className="text-4xl sm:text-5xl font-black text-black dark:text-white group-hover:text-white dark:group-hover:text-black relative z-10">{stats?.visits || 0}</span>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider opacity-60 group-hover:text-white dark:group-hover:text-black group-hover:opacity-100 mt-2 relative z-10">Visites Totals</span>
            </div>
            <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden group hover:bg-red-500 transition-colors duration-300">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity flex items-center justify-center"><Activity size={120} /></div>
              <Activity size={32} className="text-red-500 group-hover:text-white mb-3" />
              <span className="text-4xl sm:text-5xl font-black text-black dark:text-white group-hover:text-white relative z-10">{stats?.bounces || 0}</span>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider opacity-60 group-hover:text-white group-hover:opacity-100 mt-2 relative z-10">Rebots</span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-amber-100 dark:bg-amber-900/30 p-4 border-t border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-sm flex items-start gap-3">
        <Activity size={18} className="shrink-0 mt-0.5" />
        <p className="m-0 leading-tight">
          <strong>Restricció Tècnica (COEP):</strong> L'arquitectura d'alta seguretat de Sóc de Poble bloqueja la incrustació d'iframes en navegadors que no suporten "credentialless" (com <b>Firefox</b> o Safari). A dalt tens un accés directe per veure els gràfics en una nova pestanya sense restriccions.
        </p>
      </div>
    </div>
  );
}
