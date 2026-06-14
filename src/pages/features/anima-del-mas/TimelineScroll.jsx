import React from "react";
import { motion, AnimatePresence } from "framer-motion";
const sample = [{
  id: "t1",
  date: "2026-05-01",
  title: "Deploy inicial",
  text: "Desplegament del sistema base amb AppShell.",
  type: "fact",
  intensity: 3,
  impact: 0.2,
  valence: 0.4
}, {
  id: "t2",
  date: "2026-05-12",
  title: "Modal darrere sidebar",
  text: "Problema greu de z-index en Safari a iOS.",
  type: "scar",
  intensity: 8,
  impact: 0.7,
  valence: -0.6
}, {
  id: "t3",
  date: "2026-05-20",
  title: "Refactor tokens CSS",
  text: "Unificació de colors i radii al disseny global.",
  type: "decision",
  intensity: 6,
  impact: 0.5,
  valence: 0.6
}, {
  id: "t4",
  date: "2026-06-02",
  title: "Làpida: Legacy CSS",
  text: "Decidit enterrar els antics hacks globals per a Tailwind.",
  type: "tombstone",
  intensity: 10,
  impact: 1.0,
  valence: -0.2
}];
export default function TimelineScroll({
  items = sample
}) {
  return (
    <div className="relative py-8">
        <ul className="space-y-6" style={{
        listStyleType: 'none',
        paddingLeft: 0
      }}>
          <AnimatePresence>
          {items.map((it, idx) => {
            const isTomb = it.type === "tombstone";
            const isScar = it.type === "scar";
            const intensityDots = Array.from({
              length: 10
            }).map((_, i) => <span key={i} className={`inline-block w-1.5 h-1.5 rounded-full ${i < Math.round(it.intensity) ? "bg-[var(--color-brasa)]" : "bg-slate-700"} mr-1`} />);
            return (
              <motion.li key={it.id} initial={{
                opacity: 0,
                y: -40,
                scale: 0.95
              }} animate={{
                opacity: 1,
                y: 0,
                scale: 1
              }} transition={{
                type: "spring",
                stiffness: 200,
                damping: 20
              }} className={`p-6 rounded-2xl border ${isTomb ? "tombstone bg-slate-900 border-amber-500/50" : "border-slate-800 bg-[var(--sdp-bg-surface)]"}`}>
                  <div className="flex items-start gap-6">
                    
                    {/* Node icon */}
                    <div className="w-14 flex flex-col items-center shrink-0 mt-1">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 border-sdp-sdp-bg-primary shadow-md ${isTomb ? "bg-slate-900 text-amber-500" : isScar ? "bg-red-950 text-red-500" : "bg-[var(--color-ember)] text-orange-950"} text-xl font-black`}>
                        {isTomb ? "🪦" : isScar ? "🩸" : "🔥"}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white tracking-wide mb-1" style={{
                      marginTop: 0
                    }}>{it.title}</h4>
                      <div className="text-sm font-bold text-slate-300 font-mono tracking-wider mb-3">{it.date}</div>
                      <p className="text-[1.05rem] text-slate-300 leading-relaxed mb-0">{it.text}</p>

                      <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-4">
                        <div className="text-sm font-bold text-slate-200 flex flex-col gap-1 w-full sm:w-auto">
                          <span className="font-bold uppercase tracking-widest text-xs">Impacte</span>
                          <div className="w-32 h-2.5 bg-slate-800 rounded-full overflow-hidden">
                            <div style={{
                            width: `${Math.round(it.impact * 100)}%`
                          }} className={`h-full ${isTomb ? "bg-amber-400" : "bg-[var(--color-brasa)]"}`} />
                          </div>
                        </div>

                        <div className="text-sm font-bold text-slate-200 flex flex-col gap-1">
                          <span className="font-bold uppercase tracking-widest text-xs">Intensitat</span>
                          <div className="mt-1">{intensityDots}</div>
                        </div>
                      </div>

                      <div className="mt-4 text-sm font-bold text-slate-300 flex items-center gap-3 bg-black/40 p-2 rounded-lg w-fit">
                        <strong>Pes:</strong> <span className="font-mono text-white">{Math.round(it.impact * (it.intensity / 10) * 100) / 100}</span>
                        {isTomb && <span className="text-amber-400 font-bold ml-2">LÀPIDA ETERNA</span>}
                      </div>
                    </div>
                  </div>
                </motion.li>
            );
          })}
          </AnimatePresence>
        </ul>
      </div>
  );
}