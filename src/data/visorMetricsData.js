import { 
  Activity, Zap, Cpu, Flame, CheckCircle, AlertTriangle, 
  Brain, ShieldCheck, HeartPulse, Network, Gauge, Database, 
  Layers, Stethoscope, ChevronDown, ChevronUp
} from 'lucide-react';

export const METRICS_DATA = [
  {
    id: 'mental-energy',
    title: 'Energia Mental',
    value: '80%',
    subtitle: 'Dipòsit del Mestre',
    icon: Zap,
    isPulsing: false,
    explanations: {
      human: 'El sistema està fresc i llest per ajudar-te. Com un llaurador ben descansat al matí.',
      tech: 'CPU usage: 12%. Queue length: 0. Throughput: 98%. Zero long tasks detected.',
      psych: 'Estat de flow òptim. Atenció sostinguda. Baixa fricció cognitiva.'
    }
  },
  {
    id: 'physical-energy',
    title: 'Energia Física',
    value: '50%',
    subtitle: 'Esgotament muscular',
    icon: Flame,
    isPulsing: true,
    explanations: {
      human: 'Compte, portes massa estona davant la pantalla. Caldria anar a fer un volt amb la bici.',
      tech: 'Session duration > 4h. Eye tracking indicates fatigue. Suggesting break.',
      psych: 'Fatiga atencional creixent. Risc de decisions subòptimes. Necessitat de desconnexió.'
    }
  },
  {
    id: 'dom-entropy',
    title: 'Entropia DOM',
    value: '22 N',
    subtitle: 'Infraccions de profunditat',
    icon: Layers,
    isPulsing: false,
    explanations: {
      human: 'La pàgina està neta i ordenada. Només hi ha el necessari, com una casa ben endreçada.',
      tech: 'DOM nodes: 22. Layout recalcs: 0. Paint operations: 1. Zero thrashing.',
      psych: 'Ambient digital minimalista. Reducció de soroll visual. Claritat mental.'
    }
  },
  {
    id: 'swarm-cohesion',
    title: 'Cohesió Eixam',
    value: '98%',
    subtitle: 'Sincronia entre IAs',
    icon: Network,
    isPulsing: true,
    explanations: {
      human: 'Totes les intel·ligències estan alineades i treballen juntes com un sol equip.',
      tech: 'Consensus algorithm: 98% agreement. Latency between nodes: <5ms. Zero conflicts.',
      psych: 'Harmonia col·lectiva. Pensament de grup coherent. Sinergia màxima.'
    }
  },
  {
    id: 'sosp-protocol',
    title: 'Protocol SOSP',
    value: 'LOCK',
    subtitle: 'Codi i rutes blindades',
    icon: ShieldCheck,
    isPulsing: false,
    explanations: {
      human: 'La casa està tancada amb clau i forrellat. Ningú pot entrar sense permís.',
      tech: 'Authentication active. API routes secured. JWT token valid. Zero vulnerabilities.',
      psych: 'Sensació de seguretat i control. Entorn protegit de perturbacions externes.'
    }
  },
  {
    id: 'rhizome-beat',
    title: 'Batec del Rizo',
    value: '60 BPM',
    subtitle: 'Motor principal actiu',
    icon: HeartPulse,
    isPulsing: true,
    explanations: {
      human: 'El cor de la Masia batega a un ritme tranquil i constant.',
      tech: 'Core event loop running at 60Hz. Worker threads fully operational. Zero blocking operations.',
      psych: 'Ritme vital pausat però actiu. Sensació de flux constant i ininterromput.'
    }
  },
  {
    id: 'memory-usage',
    title: 'Memòria JS',
    value: '14.2 MB',
    subtitle: 'Petjada V8 (iPad A10 limit)',
    icon: Database,
    isPulsing: false,
    explanations: {
      human: 'El sistema fa servir molt poca memòria. El teu mòbil no es cansarà.',
      tech: 'JS Heap: 14.2MB. DOM size: 8KB. CSS size: 12KB. Zero memory leaks.',
      psych: 'Eficiència termodinàmica. Mínim consum energètic. Sostenibilitat digital.'
    }
  },
  {
    id: 'response-time',
    title: 'Latència Lògica',
    value: '118 ms',
    subtitle: 'Temps de reacció',
    icon: Gauge,
    isPulsing: true,
    explanations: {
      human: 'El sistema respon a l\'instant. Com parlar amb algú que t\'escolta amb atenció.',
      tech: 'P95 latency: 118ms. P99 latency: 245ms. Zero timeout errors.',
      psych: 'Fluïdesa conversacional. Ritme natural. Absència de fricció temporal.'
    }
  },
  {
    id: 'ast-nodes',
    title: 'Nodes AST',
    value: '3.402',
    subtitle: 'Arbre de sintaxi activa',
    icon: Cpu,
    isPulsing: false,
    explanations: {
      human: 'La complexitat del codi que estem mirant és molt baixa. Fàcil d\'entendre.',
      tech: 'Abstract Syntax Tree node count: 3402. Parsing time < 10ms. V8 optimization successful.',
      psych: 'Reducció de càrrega cognitiva estructural. Arquitectura plana.'
    }
  },
  {
    id: 'tactile-aggression',
    title: 'Agressió Tàctil',
    value: '0%',
    subtitle: 'group-hover erradicat',
    icon: CheckCircle,
    isPulsing: false,
    explanations: {
      human: 'Estàs fent servir el mòbil amb calma, sense presses ni frustració.',
      tech: 'Touch events/min: 12. Force average: 0.3. Zero rage taps detected.',
      psych: 'Estat emocional estable. Interacció conscient. Baixa ansietat tàctil.'
    }
  },
  {
    id: 'iaia-sanity',
    title: 'Sanitat IAIA',
    value: '99.9%',
    subtitle: 'Índex Psiquiàtric Forense',
    icon: Stethoscope,
    isPulsing: false,
    explanations: {
      human: 'La intel·ligència artificial està en el seu millor moment. Res de respostes boges.',
      tech: 'Hallucination rate: <0.1%. Context relevance: 99%. Token economy optimized.',
      psych: 'Confiança plena en l\'assistent. Reducció de paranoia algorítmica.'
    }
  }
];
