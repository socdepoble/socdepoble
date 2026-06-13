import React, { useEffect, useRef } from "react";

const sample = [
  { id: "t1", date: "2026-05-01", title: "Deploy inicial", text: "Desplegament del sistema base amb AppShell.", type: "fact", intensity: 3, impact: 0.2, valence: 0.4 },
  { id: "t2", date: "2026-05-12", title: "Modal darrere sidebar", text: "Problema greu de z-index en Safari a iOS.", type: "scar", intensity: 8, impact: 0.7, valence: -0.6 },
  { id: "t3", date: "2026-05-20", title: "Refactor tokens CSS", text: "Unificació de colors i radii al disseny global.", type: "decision", intensity: 6, impact: 0.5, valence: 0.6 },
  { id: "t4", date: "2026-06-02", title: "Làpida: Legacy CSS", text: "Decidit enterrar els antics hacks globals per a Tailwind.", type: "tombstone", intensity: 10, impact: 1.0, valence: -0.2 }
];

function useInView(rootMargin = "0px") {
  const ref = useRef();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("in-view");
      });
    }, { root: null, rootMargin, threshold: 0.2 });
    el.querySelectorAll(".timeline-item").forEach(node => obs.observe(node));
    return () => obs.disconnect();
  }, [ref]);
  return ref;
}

export default function TimelineScroll({ items = sample }) {
  const containerRef = useInView("-15% 0px -15% 0px");

  return (
    <div ref={containerRef} className="relative py-8">
      {/* Línia central del Timeline */}
      <div className="absolute left-[38px] top-10 bottom-10 w-1 bg-gradient-to-b from-[var(--color-brasa)] via-slate-700 to-transparent rounded-full shadow-[0_0_10px_rgba(249,115,22,0.3)]" aria-hidden="true" />
      
      <ol className="space-y-12 pl-4">
        {items.map((it, idx) => {
          const isTomb = it.type === "tombstone";
          const isScar = it.type === "scar";
          const intensityDots = Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className={`inline-block w-1.5 h-1.5 rounded-full ${i < Math.round(it.intensity) ? "bg-[var(--color-brasa)]" : "bg-slate-700"} mr-1`} />
          ));
          
          return (
            <li key={it.id} className={`timeline-item fade-in-up p-6 rounded-2xl border ${isTomb ? "tombstone" : "border-slate-800 bg-[var(--sdp-bg-surface)]"}`} tabIndex={0}>
              <div className="flex items-start gap-6">
                
                {/* Node icon */}
                <div className="w-14 flex flex-col items-center relative z-10 shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-[var(--sdp-bg-primary)] shadow-lg ${isTomb ? "bg-slate-900 text-amber-500" : isScar ? "bg-red-950 text-red-500" : "bg-[var(--color-ember)] text-orange-950"} text-xl font-black`}>
                    {isTomb ? "🪦" : isScar ? "🩸" : "🔥"}
                  </div>
                  <div className="mt-3 text-xs text-slate-500 font-mono font-bold tracking-wider">{it.date}</div>
                </div>

                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white tracking-wide">{it.title}</h4>
                  <p className="text-[1.05rem] text-slate-300 mt-2 leading-relaxed">{it.text}</p>

                  <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
                    <div className="text-xs text-slate-400 flex flex-col gap-1 w-full sm:w-auto">
                      <span className="font-bold uppercase tracking-widest text-[10px]">Impacte</span>
                      <div className="w-32 h-2.5 bg-slate-800 rounded-full overflow-hidden">
                        <div style={{ width: `${Math.round(it.impact * 100)}%` }} className={`h-full ${isTomb ? "bg-amber-400" : "bg-[var(--color-brasa)]"}`} />
                      </div>
                    </div>

                    <div className="text-xs text-slate-400 flex flex-col gap-1">
                      <span className="font-bold uppercase tracking-widest text-[10px]">Intensitat</span>
                      <div className="mt-1">{intensityDots}</div>
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-slate-500 flex items-center gap-3 bg-black/20 p-2 rounded-lg w-fit">
                    <strong>Pes:</strong> <span className="font-mono text-white">{Math.round((it.impact * (it.intensity/10)) * 100)/100}</span>
                    {isTomb && <span className="text-amber-400 font-bold ml-2">LÀPIDA ETERNA</span>}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
