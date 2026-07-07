import React, { useState, useEffect } from 'react';
import { Activity, HardDrive, Cpu, ShieldAlert, Server } from 'lucide-react';

const ConfigMas = () => {
  const [memory, setMemory] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Simulació de lectura de la Consola Termodinàmica
    if (performance && performance.memory) {
      setMemory(performance.memory);
    }
    
    // Logs ficticis d'arrancada
    setLogs([
      { time: new Date().toLocaleTimeString(), msg: '[SDP-BOOT] Sistema iniciat amb Arquitectura Pedra Seca', type: 'info' },
      { time: new Date().toLocaleTimeString(), msg: '[CRDT] y-indexeddb muntat correctament', type: 'success' },
      { time: new Date().toLocaleTimeString(), msg: '[TERMO] Bancal Budget Manager monitoritzant 1.2GB limit', type: 'info' },
    ]);
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto font-mono text-sm" style={{ color: 'var(--sp-text-fosc)' }}>
      <header className="mb-8 border-b pb-4" style={{ borderColor: 'var(--sp-orange-20)' }}>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Server size={32} style={{ color: 'var(--sp-orange-100)' }} />
          Consola Termodinàmica
        </h1>
        <p className="opacity-70 mt-2">Panell de control del Mas i Perfil Psiquiàtric de la Iaia (Mode Administrador)</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-5 rounded-2xl border" style={{ backgroundColor: 'var(--sp-white-100)', borderColor: 'var(--sp-orange-20)' }}>
          <div className="flex items-center gap-2 mb-2 font-bold opacity-70">
            <Cpu size={18} /> Rendiment CPU (Main Thread)
          </div>
          <div className="text-2xl font-bold text-green-600">{'< 16ms / frame'}</div>
          <p className="text-xs opacity-60 mt-1">Estat: Òptim (60FPS)</p>
        </div>

        <div className="p-5 rounded-2xl border" style={{ backgroundColor: 'var(--sp-white-100)', borderColor: 'var(--sp-orange-20)' }}>
          <div className="flex items-center gap-2 mb-2 font-bold opacity-70">
            <HardDrive size={18} /> Memòria RAM (JS Heap)
          </div>
          <div className="text-2xl font-bold" style={{ color: 'var(--sp-blue-100)' }}>
            {memory ? `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB` : 'N/A'}
          </div>
          <p className="text-xs opacity-60 mt-1">Límit A10: 1200 MB</p>
        </div>

        <div className="p-5 rounded-2xl border bg-orange-50" style={{ borderColor: 'var(--sp-orange-100)' }}>
          <div className="flex items-center gap-2 mb-2 font-bold text-orange-700">
            <Activity size={18} /> Índex de Trellat (IT)
          </div>
          <div className="text-2xl font-bold text-orange-600">96.5%</div>
          <p className="text-xs opacity-80 mt-1">Simbiosi Òptima. Pedra Seca Pura.</p>
        </div>
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--sp-orange-20)' }}>
        <div className="p-3 bg-neutral-900 text-neutral-100 font-bold flex items-center gap-2">
          <ShieldAlert size={18} className="text-orange-500" />
          Registres Forenses (Logs)
        </div>
        <div className="bg-black text-green-400 p-4 h-64 overflow-y-auto">
          {logs.map((l, i) => (
            <div key={i} className="mb-1">
              <span className="opacity-50">[{l.time}]</span> 
              <span className={l.type === 'info' ? 'text-blue-300' : 'text-green-400'}> {l.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConfigMas;
