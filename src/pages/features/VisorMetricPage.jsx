import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Activity } from 'lucide-react';
import UniversalPage from '../../pages/public/UniversalPage';
import { METRICS_DATA } from '../../data/visorMetricsData';

const VisorMetricPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [localTimestamp, setLocalTimestamp] = useState(() => Date.now());

  // Simular el worker pulse
  useEffect(() => {
    const interval = setInterval(() => setLocalTimestamp(Date.now()), 2000);
    return () => clearInterval(interval);
  }, []);

  const metric = METRICS_DATA.find(m => m.id === id);

  if (!metric) {
    return (
      <SystemPageLayout title="Mètrica no trobada" standAlone={false}>
        <div className="p-6 text-center">
          <p>Aquesta mètrica no existeix a l'EGG del sistema.</p>
          <button onClick={() => navigate('/visor-nano')} className="mt-4 text-brand-blue hover:underline">Tornar al Visor</button>
        </div>
      </SystemPageLayout>
    );
  }

  // Dynamic values calculation (mocking the real-time engine)
  let displayValue = metric.value;
  if (metric.id === 'dom-entropy') displayValue = `${22 + (localTimestamp % 6000 > 3000 ? -1 : 0)} N`;
  if (metric.id === 'swarm-cohesion') displayValue = `${98 + (localTimestamp % 8000 > 4000 ? -2 : 0)}%`;
  if (metric.id === 'memory-usage') displayValue = `${(14.2 + (localTimestamp % 4000 > 2000 ? 0.3 : -0.1)).toFixed(1)} MB`;
  if (metric.id === 'response-time') displayValue = `${118 + (localTimestamp % 10000 > 5000 ? 12 : -4)} ms`;

  const { title, subtitle, icon: Icon, explanations, isPulsing } = metric;
  const pulseClass = isPulsing ? 'animate-pulse text-brand-orange' : 'text-brand-blue';

  return (
    <UniversalPage 
      title={title} 
      subtitle={subtitle} 
      standAlone={false}
      forcedTitle={title}
      forcedSubtitle={subtitle}
    >
      <main className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-8 pb-32">
        
        {/* Navegació Superior */}
        <button 
          onClick={() => navigate('/visor-nano')}
          className="flex items-center gap-2 text-sm font-bold uppercase text-neutral-500 hover:text-neutral-800 transition-colors"
        >
          <ArrowLeft size={16} /> Tornar a l'EGG
        </button>

        {/* Hero de la Mètrica */}
        <header className="bg-white border border-neutral-200 rounded-[32px] p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Icon className={`w-8 h-8 ${pulseClass}`} />
              <h1 className="text-3xl font-black text-neutral-900 m-0">{title}</h1>
            </div>
            <p className="text-lg text-neutral-500">{subtitle}</p>
          </div>
          
          <div className="bg-neutral-50 px-8 py-6 rounded-[24px] border border-neutral-100 flex-shrink-0 text-center min-w-[200px]">
            <span className="block text-sm font-bold text-neutral-400 uppercase tracking-widest mb-2">Lectura Actual</span>
            <div className={`text-5xl font-black font-mono tracking-tighter ${pulseClass}`}>
              {displayValue}
            </div>
          </div>
        </header>

        {/* Triple Explicació */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {explanations.human && (
            <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/5 rounded-bl-[100px] pointer-events-none"></div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-orange mb-3 flex items-center gap-2">
                <span>🧑</span> Perspectiva Humana
              </h3>
              <p className="text-neutral-700 leading-relaxed">{explanations.human}</p>
            </div>
          )}
          
          {explanations.tech && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue/5 rounded-bl-[100px] pointer-events-none"></div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-blue opacity-80 mb-3 flex items-center gap-2">
                <span>💻</span> Visió Tècnica
              </h3>
              <p className="text-neutral-300 font-mono text-xs leading-relaxed">{explanations.tech}</p>
            </div>
          )}

          {explanations.psych && (
            <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-neutral-200/30 rounded-bl-[100px] pointer-events-none"></div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3 flex items-center gap-2">
                <Brain size={14} /> Índex Psiquiàtric
              </h3>
              <p className="text-neutral-600 italic leading-relaxed">{explanations.psych}</p>
            </div>
          )}
        </section>

        {/* Tauler Històric Mockup */}
        <section className="bg-neutral-50 rounded-3xl p-8 border border-neutral-200 border-dashed text-center mt-12 opacity-80">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-white border border-neutral-200 rounded-2xl mx-auto flex items-center justify-center shadow-sm">
              <Activity className="w-8 h-8 text-neutral-400" />
            </div>
            <h2 className="text-lg font-bold text-neutral-700">Registre Històric Termodinàmic</h2>
            <p className="text-sm text-neutral-500">L'arquitectura Pedra Seca està recollint mètriques. Quan hi haja prou dades per traçar la línia de temps, els gràfics apareixeran ací de forma automàtica per comparar setmanes i mesos.</p>
          </div>
        </section>

      </main>
    </UniversalPage>
  );
};

export default VisorMetricPage;
