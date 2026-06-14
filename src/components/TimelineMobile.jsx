// src/components/TimelineMobile.jsx
import React, { useState, useRef, useCallback } from "react";

/*
Props:
 - initialSteps: [{ id, label, rootQuery, selector, className, delay, duration }]
 - onRunMacro(blocks)
 - pxPerMs (optional) default 0.12
 - snapMs (optional) default 50
*/
export default function TimelineMobile({
  initialSteps = [],
  onRunMacro,
  pxPerMs = 0.12,
  snapMs = 50
}) {
  const [steps, setSteps] = useState(initialSteps.map((s, i) => ({
    ...s,
    id: s.id || `m${i}`
  })));
  const [selected, setSelected] = useState(null);
  const containerRef = useRef(null);

  // helpers
  const msToPx = useCallback(ms => Math.round(ms * pxPerMs), [pxPerMs]);
  const pxToMs = useCallback(px => Math.round(px / pxPerMs), [pxPerMs]);

  // snap function: rounds to nearest snapMs
  const snap = useCallback(ms => Math.round(ms / snapMs) * snapMs, [snapMs]);

  // update step
  function updateStep(id, patch) {
    setSteps(s => s.map(x => x.id === id ? {
      ...x,
      ...patch
    } : x));
  }

  // touch drag to move delay (snap)
  function startDragDelay(e, id) {
    e.preventDefault();
    const touch = e.touches ? e.touches[0] : e;
    const startX = touch.clientX;
    const step = steps.find(s => s.id === id);
    if (!step) return;
    const origDelay = step.delay || 0;
    function onMove(ev) {
      const t = ev.touches ? ev.touches[0] : ev;
      const dx = t.clientX - startX;
      const newDelay = Math.max(0, origDelay + pxToMs(dx));
      updateStep(id, {
        delay: snap(newDelay)
      });
    }
    function onEnd() {
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("mouseup", onEnd);
    }
    window.addEventListener("touchmove", onMove, {
      passive: false
    });
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchend", onEnd);
    window.addEventListener("mouseup", onEnd);
  }

  // resize duration by vertical drag on mobile (simple)
  function startResizeDuration(e, id) {
    e.preventDefault();
    const touch = e.touches ? e.touches[0] : e;
    const startX = touch.clientX;
    const step = steps.find(s => s.id === id);
    if (!step) return;
    const origDuration = step.duration || 800;
    function onMove(ev) {
      const t = ev.touches ? ev.touches[0] : ev;
      const dx = t.clientX - startX;
      const newDuration = Math.max(50, origDuration + pxToMs(dx));
      updateStep(id, {
        duration: snap(newDuration)
      });
    }
    function onEnd() {
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("mouseup", onEnd);
    }
    window.addEventListener("touchmove", onMove, {
      passive: false
    });
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchend", onEnd);
    window.addEventListener("mouseup", onEnd);
  }

  // run timeline (simple sequential macro builder)
  function runTimeline() {
    if (!onRunMacro) return;
    let cumulative = 0;
    const blocks = steps.map(st => {
      const root = document.querySelector(st.rootQuery);
      const stepObj = {
        selector: st.selector,
        className: st.className,
        delay: st.delay || 0,
        duration: st.duration || 800
      };
      const block = {
        root,
        steps: [stepObj],
        offset: cumulative
      };
      cumulative += (st.delay || 0) + (st.duration || 800);
      return block;
    }).filter(b => b.root);
    onRunMacro(blocks);
  }
  return <div ref={containerRef} className="timeline-mobile p-3 bg-slate-900 rounded-2xl shadow-xl border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-semibold text-white">Timeline (mòbil)</div>
        <button onClick={runTimeline} className="px-4 py-1.5 bg-orange-500 rounded-lg text-white font-bold shadow-md">Run</button>
      </div>

      <div className="space-y-3">
        {steps.map((st, i) => <div key={st.id} className="bg-slate-800 p-3 rounded-xl flex items-center gap-3 border border-slate-700">
            <div className="w-8 text-xs text-slate-400 font-mono font-bold">{i + 1}</div>

            <div className="flex-1">
              <div className="text-sm font-medium truncate text-white">{st.label || st.selector}</div>
              <div className="text-xs text-slate-400 font-mono mt-1">{st.rootQuery}</div>

              <div className="mt-3 relative h-12 bg-slate-900 rounded-lg overflow-hidden border border-slate-700" onTouchStart={e => startDragDelay(e, st.id)} onMouseDown={e => startDragDelay(e, st.id)}>
                <div style={{
              position: 'absolute',
              left: `${msToPx(st.delay || 0)}px`,
              width: `${Math.max(24, msToPx(st.duration || 800))}px`,
              height: '100%',
              background: 'linear-gradient(90deg,#F97316,#FFB86B)',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 8px',
              color: '#071124',
              fontSize: 12,
              fontWeight: 'bold'
            }}>
                  <div>{Math.round(st.delay || 0)}ms</div>
                  <div onTouchStart={e => startResizeDuration(e, st.id)} onMouseDown={e => startResizeDuration(e, st.id)} style={{
                width: 18,
                height: 28,
                background: 'rgba(0,0,0,0.15)',
                borderRadius: 4,
                cursor: 'ew-resize'
              }} />
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <div className="text-xs text-slate-400 font-medium">Delay</div>
                <input type="range" min="0" max="5000" step={snapMs} value={st.delay || 0} onChange={e => updateStep(st.id, {
              delay: Number(e.target.value)
            })} className="flex-1 accent-orange-500" />
                <div className="text-xs w-16 text-right text-slate-300">{st.delay || 0}ms</div>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <div className="text-xs text-slate-400 font-medium">Durada</div>
                <input type="range" min="50" max="5000" step={snapMs} value={st.duration || 800} onChange={e => updateStep(st.id, {
              duration: Number(e.target.value)
            })} className="flex-1 accent-orange-500" />
                <div className="text-xs w-16 text-right text-slate-300">{st.duration || 800}ms</div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button onClick={() => setSelected(st.id)} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-white transition-colors">Edit</button>
              <button onClick={() => setSteps(s => s.filter(x => x.id !== st.id))} className="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-xs text-white transition-colors">Del</button>
            </div>
          </div>)}
      </div>
    </div>;
}