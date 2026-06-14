import React from 'react';
import { Section } from '../primitives/Section';

export const SpacingAndGrid = () => (
  <Section id="espaiat" title="3. Espaiat i Grid">
    <h3 className="sosp-h3 mb-4">Sistema d'Espaiat (8px base)</h3>
    <div className="sosp-card p-6 mb-6">
      <div className="space-y-3">
        {[1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24].map((n) => (
          <div key={n} className="flex items-center gap-4">
            <div className="h-4 bg-[#8B4513] rounded" style={{ width: `${n * 4}px` }} />
            <span className="text-sm text-gray-600 font-mono">{n} unitats = {n * 4}px</span>
          </div>
        ))}
      </div>
    </div>

    <h3 className="sosp-h3 mb-4">Grid Responsive</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div className="bg-stone-200 p-4 rounded text-center text-sm text-stone-600">1 columna (mòbil)</div>
      <div className="bg-stone-200 p-4 rounded text-center text-sm text-stone-600">2 columnes (tauleta)</div>
      <div className="bg-stone-200 p-4 rounded text-center text-sm text-stone-600">3 columnes (escriptori)</div>
    </div>
  </Section>
);
