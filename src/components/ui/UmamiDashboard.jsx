import React, { useState, useEffect } from 'react';
import { Users, Eye, MousePointerClick, Activity } from 'lucide-react';

export default function UmamiDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Obtenim estadístiques globals des del principi
        const startAt = 1717000000000;
        const endAt = Date.now() + 86400000; // Demà
        const websiteId = '6ffce900-c41a-470e-9b12-38fb6028db18';
        const apiKey = 'api_OHQt4qmq3BGhUnnUNa1e0IqESiiy7eFy';

        const response = await fetch(`https://api.umami.is/v1/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}`, {
          headers: {
            'x-umami-api-key': apiKey
          }
        });

        if (!response.ok) {
          throw new Error('Error al connectar amb el servidor de telemetria');
        }

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

  if (loading) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-black/5 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10 animate-pulse mt-12">
        <div className="flex flex-col items-center opacity-50">
          <Activity size={32} className="animate-spin mb-4" />
          <span className="font-bold tracking-widest uppercase">Connectant amb la matriu...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 flex flex-col items-center justify-center mt-12">
        <Activity size={32} className="mb-2" />
        <p className="font-bold text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full mt-12 bg-white dark:bg-[#1a1a1a] rounded-3xl border border-black/10 dark:border-white/10 shadow-lg p-6 sm:p-10 notranslate">
      <div className="mb-8 border-b border-black/10 dark:border-white/10 pb-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[var(--theme-accent-secondary)] flex items-center justify-center text-white shrink-0">
          <Activity size={24} />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-black dark:text-white uppercase tracking-tight m-0 leading-none">Telemetria en Viu</h2>
          <p className="text-[var(--theme-accent-primary)] font-bold uppercase text-sm mt-1">Dades públiques de Sóc de Poble</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Visitors */}
        <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden group hover:bg-[var(--theme-accent-secondary)] transition-colors duration-300">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity flex items-center justify-center">
             <Users size={120} />
          </div>
          <Users size={32} className="text-[var(--theme-accent-secondary)] group-hover:text-white mb-3" />
          <span className="text-4xl sm:text-5xl font-black text-black dark:text-white group-hover:text-white relative z-10">{stats?.visitors || 0}</span>
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider opacity-60 group-hover:text-white group-hover:opacity-100 mt-2 relative z-10">Visitants Únics</span>
        </div>

        {/* Pageviews */}
        <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden group hover:bg-[var(--theme-accent-primary)] transition-colors duration-300">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity flex items-center justify-center">
             <Eye size={120} />
          </div>
          <Eye size={32} className="text-[var(--theme-accent-primary)] group-hover:text-white mb-3" />
          <span className="text-4xl sm:text-5xl font-black text-black dark:text-white group-hover:text-white relative z-10">{stats?.pageviews || 0}</span>
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider opacity-60 group-hover:text-white group-hover:opacity-100 mt-2 relative z-10">Pàgines Vistes</span>
        </div>

        {/* Visits */}
        <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden group hover:bg-black dark:hover:bg-white transition-colors duration-300">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-10 transition-opacity flex items-center justify-center">
             <MousePointerClick size={120} className="dark:text-black text-white" />
          </div>
          <MousePointerClick size={32} className="text-black dark:text-white group-hover:text-white dark:group-hover:text-black mb-3" />
          <span className="text-4xl sm:text-5xl font-black text-black dark:text-white group-hover:text-white dark:group-hover:text-black relative z-10">{stats?.visits || 0}</span>
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider opacity-60 group-hover:text-white dark:group-hover:text-black group-hover:opacity-100 mt-2 relative z-10">Visites Totals</span>
        </div>

        {/* Bounces */}
        <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden group hover:bg-red-500 transition-colors duration-300">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity flex items-center justify-center">
             <Activity size={120} />
          </div>
          <Activity size={32} className="text-red-500 group-hover:text-white mb-3" />
          <span className="text-4xl sm:text-5xl font-black text-black dark:text-white group-hover:text-white relative z-10">{stats?.bounces || 0}</span>
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider opacity-60 group-hover:text-white group-hover:opacity-100 mt-2 relative z-10">Rebots</span>
        </div>

      </div>
    </div>
  );
}
