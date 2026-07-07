import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UniversalHeader } from '../../components/ui/Header/UniversalHeader';
import MetricCard from '../../components/ui/MetricCard';
import { Battery, Brain, Cpu, Shield, ArrowLeft } from 'lucide-react';

const mockMetrics = [
  // DOMINI 1: TERMODINÀMICA
  {
    id: 'm1',
    domain: 'termodinamica',
    metric: 'Índex de Trellat (IT)',
    description: '(Ordre / Complexitat). Rei de les mètriques.',
    value: '94.2',
    thresholdStr: 'Crític si < 90',
    trend: 'stable',
    status: 'ok',
    history: [92, 93, 91, 93, 94.2]
  },
  {
    id: 'm2',
    domain: 'termodinamica',
    metric: 'Entropia Semàntica',
    description: 'Conceptes repetits / Idees totals.',
    value: '4.8%',
    thresholdStr: 'Crític si > 10%',
    trend: 'down',
    status: 'ok',
    history: [7.2, 6.5, 6.0, 5.2, 4.8]
  },
  {
    id: 'm3',
    domain: 'termodinamica',
    metric: 'Compressió Cognitiva',
    description: 'Coneixement útil / Paraules totals.',
    value: 'Elevada',
    thresholdStr: 'Mantenir densitat',
    trend: 'up',
    status: 'ok',
    history: [60, 65, 70, 75, 80]
  },
  {
    id: 'm4',
    domain: 'termodinamica',
    metric: 'Pressió Arquitectònica',
    description: 'Dependències creuades entre SKILLS.',
    value: 'Mitjana',
    thresholdStr: 'Evitar nivells Alts',
    trend: 'stable',
    status: 'warning',
    history: [20, 30, 45, 50, 48]
  },

  // DOMINI 2: MEMÒRIA
  {
    id: 'm5',
    domain: 'memoria',
    metric: "Índex d'Orfandat",
    description: 'Nodes sense cap enllaç entrant/eixint.',
    value: '0',
    thresholdStr: 'Crític si > 0',
    trend: 'stable',
    status: 'ok',
    history: [3, 2, 0, 0, 0]
  },
  {
    id: 'm6',
    domain: 'memoria',
    metric: 'Cobertura de Coneixement',
    description: 'Conceptes referenciats vs existents.',
    value: '97%',
    thresholdStr: 'Crític si < 95%',
    trend: 'up',
    status: 'ok',
    history: [92, 94, 94, 95, 97]
  },
  {
    id: 'm7',
    domain: 'memoria',
    metric: 'Frescor de Memòria',
    description: "Dies des de l'última auditoria de la Wiki.",
    value: '2 dies',
    thresholdStr: 'Crític si > 7 dies',
    trend: 'stable',
    status: 'ok',
    history: [5, 4, 3, 2, 2]
  },
  {
    id: 'm8',
    domain: 'memoria',
    metric: 'Traçabilitat',
    description: '% de normes amb Origen + Skill + Test.',
    value: '88%',
    thresholdStr: 'Objectiu: 100%',
    trend: 'up',
    status: 'warning',
    history: [60, 70, 75, 85, 88]
  },

  // DOMINI 3: SISTEMA
  {
    id: 'm9',
    domain: 'sistema',
    metric: 'Pressió de RAM',
    description: 'RAM + IndexedDB + CRDT + Cache.',
    value: '840MB',
    thresholdStr: 'Crític si > 1.2GB',
    trend: 'up',
    status: 'warning',
    history: [600, 650, 700, 800, 840]
  },
  {
    id: 'm10',
    domain: 'sistema',
    metric: 'Tombstone Load',
    description: 'Tombstones / Nodes vius.',
    value: '0.04',
    thresholdStr: 'Crític si > 0.15',
    trend: 'stable',
    status: 'ok',
    history: [0.08, 0.07, 0.05, 0.04, 0.04]
  },
  {
    id: 'm11',
    domain: 'sistema',
    metric: 'Temps de Sincronització',
    description: 'Temps entre canvi local, merge i IDB.',
    value: '42ms',
    thresholdStr: 'Crític si > 200ms',
    trend: 'down',
    status: 'ok',
    history: [120, 90, 60, 50, 42]
  },
  {
    id: 'm12',
    domain: 'sistema',
    metric: 'FPS Garantits',
    description: 'El pitjor 5% de FPS (P5).',
    value: '58 FPS',
    thresholdStr: 'Crític si < 45 FPS',
    trend: 'stable',
    status: 'ok',
    history: [55, 59, 58, 60, 58]
  },

  // DOMINI 4: GOVERNANÇA
  {
    id: 'm13',
    domain: 'governanca',
    metric: 'Compliment Constitucional',
    description: '% de regles amb estat PASS.',
    value: '100%',
    thresholdStr: 'Crític si < 98%',
    trend: 'stable',
    status: 'ok',
    history: [96, 98, 99, 100, 100]
  },
  {
    id: 'm14',
    domain: 'governanca',
    metric: 'Cobertura de Validació',
    description: '% de normes que tenen validator pur.',
    value: '45%',
    thresholdStr: 'Crític si < 100%',
    trend: 'up',
    status: 'critical',
    history: [10, 20, 30, 40, 45]
  },
  {
    id: 'm15',
    domain: 'governanca',
    metric: 'Confiança Epistèmica',
    description: '% de respostes basades en Constitució.',
    value: '95%',
    thresholdStr: 'Crític si < 90%',
    trend: 'up',
    status: 'ok',
    history: [85, 88, 90, 92, 95]
  }
];

const ConsolaTermodinamicaView = () => {
  const navigate = useNavigate();

  const renderDomain = (title, icon, domainId) => {
    const domainMetrics = mockMetrics.filter(m => m.domain === domainId);
    return (
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
          {icon}
          <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">{title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {domainMetrics.map(m => (
            <MetricCard key={m.id} {...m} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#fcfcfc] overflow-hidden rounded-tl-2xl">
      <UniversalHeader 
        title="CONSOLA TERMODINÀMICA"
        subtitle="Índex de Salut del Mas"
        leftSlot={
          <button 
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 transition-colors"
            onClick={() => navigate('/hub')}
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto pb-24">
          
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 md:p-6 mb-8 text-orange-900 shadow-sm">
            <h3 className="font-bold text-lg mb-2">L'Electrocardiograma del Sistema</h3>
            <p className="text-sm md:text-base opacity-90 leading-relaxed">
              Aquest panell mesura l'estat actual i la tendència temporal de 15 mètriques clau. 
              El sistema és proactiu: si una mètrica creua un llindar d'emergència, s'activaran 
              les proteccions automàtiques (SKILLS de reparació, neteja de cau o bloquejos d'auditoria).
            </p>
          </div>

          {renderDomain('Domini I: Termodinàmica', <Battery className="text-orange-500" size={24} />, 'termodinamica')}
          {renderDomain('Domini II: Memòria', <Brain className="text-pink-500" size={24} />, 'memoria')}
          {renderDomain('Domini III: Sistema', <Cpu className="text-blue-500" size={24} />, 'sistema')}
          {renderDomain('Domini IV: Governança', <Shield className="text-green-500" size={24} />, 'governanca')}
          
        </div>
      </div>
    </div>
  );
};

export default ConsolaTermodinamicaView;
