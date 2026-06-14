import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, AlertTriangle, Brain } from 'lucide-react';
import UniversalPage from '../../pages/public/UniversalPage';
import { METRICS_DATA } from '../../data/visorMetricsData';
import UniversalCard from '../../components/ui/universal-card';
import { useNavigate } from 'react-router-dom';

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT PRINCIPAL: VISOR NANO
// ═══════════════════════════════════════════════════════════════════════════


const VisorNano = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [localTimestamp, setLocalTimestamp] = useState(() => Date.now());

  // Batec local per simular el worker
  useEffect(() => {
    const interval = setInterval(() => setLocalTimestamp(Date.now()), 2000);
    return () => clearInterval(interval);
  }, []);

  const domEntropy = 22 + (localTimestamp % 6000 > 3000 ? -1 : 0);
  const swarmCohesion = 98 + (localTimestamp % 8000 > 4000 ? -2 : 0);
  const memoryUsage = 14.2 + (localTimestamp % 4000 > 2000 ? 0.3 : -0.1);
  const responseTime = 118 + (localTimestamp % 10000 > 5000 ? 12 : -4);

  return (
    <UniversalPage 
      title="Consola Termodinàmica" 
      subtitle="Psiquiatria Màquina i Control de l'Eixam" 
      standAlone={false}
      forcedTitle="Consola Termodinàmica"
      forcedSubtitle="Psiquiatria Màquina i Control de l'Eixam"
    >
      <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-8 pb-24">
        
        {/* LA MATRIU DELS QUADRES */}
        <section>
          <header className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <Brain className="text-brand-blue" size={32} />
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-neutral-900 dark:text-neutral-100 m-0 leading-tight">Electroencefalograma del Sistema (EGG)</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Supervisió de Mètriques i Vitals (Acta 13)</p>
            </div>
          </header>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {METRICS_DATA.map(metric => {
              let displayValue = metric.value;
              if (metric.id === 'dom-entropy') displayValue = `${domEntropy} N`;
              if (metric.id === 'swarm-cohesion') displayValue = `${swarmCohesion}%`;
              if (metric.id === 'memory-usage') displayValue = `${memoryUsage.toFixed(1)} MB`;
              if (metric.id === 'response-time') displayValue = `${responseTime} ms`;

              return (
                <UniversalCard 
                  key={metric.id}
                  variant="metric"
                  item={{ ...metric, displayValue }}
                  onClick={() => navigate(`/visor-nano/${metric.id}`)}
                />
              );
            })}
          </div>
        </section>

        {/* CONSOLA DE REFACTORITZACIÓ */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 mt-8">
          <header className="flex items-center gap-3 mb-6">
            <Activity className="text-brand-orange" size={24} />
            <h2 className="text-xl font-black text-neutral-900 m-0">Tauler de Refactorització Quirúrgica</h2>
          </header>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-100 flex flex-col justify-between hover:bg-neutral-100 transition-colors">
              <div>
                <h3 className="font-bold text-neutral-800 flex items-center gap-2">DesignSystem.jsx <AlertTriangle size={16} className="text-brand-orange"/></h3>
                <p className="text-sm text-neutral-500 mt-2">13 infraccions de profunditat. Requereix descomposició en components atòmics.</p>
              </div>
            </div>
            
            <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-100 flex flex-col justify-between hover:bg-neutral-100 transition-colors">
              <div>
                <h3 className="font-bold text-neutral-800 flex items-center gap-2">ProfileSettingsModal.jsx <AlertTriangle size={16} className="text-brand-blue"/></h3>
                <p className="text-sm text-neutral-500 mt-2">2 infraccions. Transformar urgentment a l'etiqueta dialog nativa d'HTML5.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </UniversalPage>
  );
};

export default VisorNano;
