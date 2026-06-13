import React from "react";

export default function EmotionalArc({ points = [0, 0.2, -0.3, 0.5] }) {
  const w = 600, h = 140, pad = 16;
  const min = Math.min(...points), max = Math.max(...points);
  const range = Math.max(0.001, max - min);
  
  const path = points.map((p, i) => {
    const x = pad + (i / (points.length - 1)) * (w - pad * 2);
    const y = pad + ((max - p) / range) * (h - pad * 2);
    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
  }).join(" ");

  const avg = points.reduce((s, v) => s + v, 0) / points.length;
  const stroke = avg > 0.2 ? "url(#gradPos)" : avg < -0.2 ? "url(#gradNeg)" : "url(#gradNeu)";

  return (
    <div className="w-full overflow-hidden relative">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-32" role="img" aria-label="Arc emocional">
        <defs>
          <linearGradient id="gradPos" x1="0" x2="1">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <linearGradient id="gradNeg" x1="0" x2="1">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
          <linearGradient id="gradNeu" x1="0" x2="1">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <path d={path} className="sparkline" stroke={stroke} filter="url(#glow)" />
        
        {points.map((p, i) => {
          const x = pad + (i / (points.length - 1)) * (w - pad * 2);
          const y = pad + ((max - p) / range) * (h - pad * 2);
          const fill = p > 0.2 ? "#10B981" : p < -0.2 ? "#EF4444" : "#60A5FA";
          return <circle key={i} cx={x} cy={y} r={4.5} fill={fill} className="transition-all hover:r-6 cursor-pointer" />;
        })}
      </svg>
    </div>
  );
}
