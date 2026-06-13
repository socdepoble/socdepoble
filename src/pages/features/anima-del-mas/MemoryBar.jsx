import React, { useMemo } from "react";

export default function MemoryBar({ sample }) {
  const { impact = 0.5, intensity = 5, daysAgo = 0 } = sample || {};
  const raw = impact * (intensity / 10);
  const opacity = Math.max(0.18, Math.exp(-daysAgo / 30));
  const widthPct = Math.min(100, Math.round(raw * 100));

  const label = useMemo(() => {
    const weight = raw;
    if (weight > 0.6) return "Pesat (Alt)";
    if (weight > 0.3) return "Tebi (Mitjà)";
    return "Lleuger (Baix)";
  }, [raw]);

  return (
    <div className="bg-[rgba(255,255,255,0.03)] p-5 rounded-xl border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-bold text-slate-200 flex items-center gap-2"><span className="text-xl">🎚️</span> Memòria Recent</div>
        <div className="text-xs text-amber-500 font-mono tracking-wider uppercase bg-amber-500/10 px-2 py-1 rounded">{label} · Fa {daysAgo} dies</div>
      </div>

      <div className="w-full bg-[rgba(255,255,255,0.05)] rounded-full h-4 overflow-hidden shadow-inner">
        <div
          className="memory-bar"
          style={{
            width: `${widthPct}%`,
            opacity,
            transition: "width 600ms ease, opacity 600ms ease"
          }}
          aria-hidden="true"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-medium">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-brasa)] block shadow-[0_0_8px_var(--color-brasa)]" />
          <span>Impacte: {impact}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--sdp-accent)] block shadow-[0_0_8px_var(--sdp-accent)]" />
          <span>Intensitat: {intensity}</span>
        </div>
        <div className="ml-auto text-slate-500">
          Pes absolut: {(raw * Math.exp(-daysAgo/30)).toFixed(2)}
        </div>
      </div>
    </div>
  );
}
