import React from "react";
import { motion } from "framer-motion";
export default function EmotionalArc({
  points = [0, 0.2, -0.3, 0.5]
}) {
  const w = 800,
    h = 320,
    pad = 40;
  // Forcem l'escala entre -1 i 1 per tenir sempre la línia base al centre
  const min = -1,
    max = 1;
  const range = max - min;
  const path = points.map((p, i) => {
    const x = pad + i / (points.length - 1) * (w - pad * 2);
    const y = pad + (max - p) / range * (h - pad * 2);
    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
  }).join(" ");

  // Creem una àrea davall de la línia per pintar-la
  const areaPath = `${path} L ${w - pad} ${pad + max / range * (h - pad * 2)} L ${pad} ${pad + max / range * (h - pad * 2)} Z`;

  // Color de la línia depenent de l'estat actual
  const currentPoint = points[points.length - 1];
  const strokeColor = currentPoint > 0.2 ? "#10B981" : currentPoint < -0.2 ? "#EF4444" : "#60A5FA";
  return <div className="w-full overflow-hidden relative bg-[#0a0f1c] p-6 rounded-3xl border border-slate-800 shadow-2xl">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto drop-shadow-2xl" role="img" aria-label="Arc emocional">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.4" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Línia Central de Calma */}
        <line x1={pad} y1={pad + max / range * (h - pad * 2)} x2={w - pad} y2={pad + max / range * (h - pad * 2)} stroke="#334155" strokeWidth="2" strokeDasharray="8 8" />
        <text x={pad} y={pad + max / range * (h - pad * 2) - 12} fill="#94A3B8" fontSize="14" fontWeight="800" letterSpacing="2">ESTAT DE CALMA (RUTINA)</text>

        {/* Textos Extrems */}
        <text x={w - pad - 220} y={pad + 15} fill="#10B981" fontSize="16" fontWeight="800" letterSpacing="1">↑ EUFÒRIA / PRODUCTIVITAT</text>
        <text x={w - pad - 200} y={h - pad + 25} fill="#EF4444" fontSize="16" fontWeight="800" letterSpacing="1">↓ FRUSTRACIÓ / BLOQUEIG</text>

        {/* Àrea d'ombra */}
        <motion.path d={areaPath} fill="url(#areaGrad)" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        duration: 1.5
      }} />

        {/* Línia Principal */}
        <motion.path d={path} fill="none" stroke={strokeColor} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" initial={{
        pathLength: 0
      }} animate={{
        pathLength: 1,
        d: path
      }} transition={{
        duration: 1.2,
        ease: "easeInOut"
      }} />
        
        {/* Punts Nodals */}
        {points.map((p, i) => {
        const x = pad + i / (points.length - 1) * (w - pad * 2);
        const y = pad + (max - p) / range * (h - pad * 2);
        const isLast = i === points.length - 1;
        const fill = p > 0.2 ? "#10B981" : p < -0.2 ? "#EF4444" : "#60A5FA";
        return <motion.g key={i} initial={{
          scale: 0
        }} animate={{
          scale: 1
        }} transition={{
          delay: 1.2 + i * 0.1
        }}>
              {isLast && <circle cx={x} cy={y} r={16} fill={fill} opacity="0.3" className="animate-pulse" />}
              <circle cx={x} cy={y} r={isLast ? 10 : 6} fill={fill} stroke="#0a0f1c" strokeWidth={isLast ? 4 : 2} />
            </motion.g>;
      })}
      </svg>
    </div>;
}