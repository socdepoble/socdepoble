// src/components/TimelineGraphic.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { downloadJSON } from "../lib/presetUtils";

/*
  TimelineGraphic
  Props:
    - initialSteps: [{ id, label, rootQuery, selector, className, delay, duration }]
    - onRunMacro(blocks): function(blocks) -> runMacro(blocks)
    - width: timeline width in px (default 900)
    - pxPerMs: scale (pixels per millisecond) default 0.12 (so 1000ms -> 120px)
    - containerSelector: selector for recording preview
*/
export default function TimelineGraphic({
  initialSteps = [],
  onRunMacro,
  width = 900,
  pxPerMs = 0.12,
  containerSelector = "#orchestra"
}) {
  const [steps, setSteps] = useState(initialSteps.map((s, i) => ({ ...s, id: s.id || `s${i}` })));
  const [selectedId, setSelectedId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playhead, setPlayhead] = useState(0); // ms
  const [durationMs, setDurationMs] = useState(4000);
  const timelineRef = useRef(null);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedAtRef = useRef(0);

  // compute timeline length from steps
  useEffect(() => {
    const max = steps.reduce((m, s) => Math.max(m, (s.delay || 0) + (s.duration || 800)), 0);
    setDurationMs(Math.max(2000, Math.ceil(max / 100) * 100));
  }, [steps]);

  // helpers: convert ms to px and back
  const msToPx = useCallback(ms => Math.round(ms * pxPerMs), [pxPerMs]);
  const pxToMs = useCallback(px => Math.round(px / pxPerMs), [pxPerMs]);

  // play loop
  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    startTimeRef.current = performance.now() - pausedAtRef.current;
    const tick = (t) => {
      const elapsed = t - startTimeRef.current;
      setPlayhead(elapsed);
      if (elapsed >= durationMs) {
        setIsPlaying(false);
        setPlayhead(durationMs);
        pausedAtRef.current = 0;
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, durationMs]);

  // run timeline: build blocks and call onRunMacro
  function runTimelineFromStart() {
    // build blocks with cumulative offset
    let cumulative = 0;
    const blocks = [];
    steps.forEach(st => {
      const root = document.querySelector(st.rootQuery);
      if (!root) {
        cumulative += (st.delay || 0) + (st.duration || 800);
        return;
      }
      const stepObj = { selector: st.selector, className: st.className, delay: st.delay || 0, duration: st.duration || 800 };
      blocks.push({ root, steps: [stepObj], offset: cumulative });
      cumulative += (st.delay || 0) + (st.duration || 800);
    });
    if (onRunMacro) onRunMacro(blocks);
  }

  // play controls
  function handlePlay() {
    // if starting from 0, trigger runTimelineFromStart
    runTimelineFromStart();
    pausedAtRef.current = 0;
    setPlayhead(0);
    setIsPlaying(true);
  }
  function handlePause() {
    setIsPlaying(false);
    pausedAtRef.current = playhead;
  }
  function handleSeek(ms) {
    setPlayhead(ms);
    pausedAtRef.current = ms;
  }

  // CRUD steps
  function addStep(step) {
    setSteps(s => [...s, { id: `s${Date.now()}`, ...step }]);
  }
  function updateStep(id, patch) {
    setSteps(s => s.map(x => x.id === id ? { ...x, ...patch } : x));
  }
  function removeStep(id) {
    setSteps(s => s.filter(x => x.id !== id));
  }

  // drag horizontal: we implement drag to reposition delay (ms) by dragging the bar
  function onBarMouseDown(e, id) {
    e.preventDefault();
    const startX = e.clientX;
    const step = steps.find(s => s.id === id);
    if (!step) return;
    const origDelay = step.delay || 0;
    function onMove(ev) {
      const dx = ev.clientX - startX;
      const newDelay = Math.max(0, origDelay + pxToMs(dx));
      updateStep(id, { delay: newDelay });
    }
    function onUp() {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  // resize duration by dragging right edge
  function onResizeMouseDown(e, id) {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const step = steps.find(s => s.id === id);
    if (!step) return;
    const origDuration = step.duration || 800;
    function onMove(ev) {
      const dx = ev.clientX - startX;
      const newDuration = Math.max(80, origDuration + pxToMs(dx));
      updateStep(id, { duration: newDuration });
    }
    function onUp() {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  // export/import
  function exportPreset(name = `timeline-${Date.now()}`) {
    const preset = { name, createdAt: new Date().toISOString(), steps };
    downloadJSON(preset, `${name}.json`);
  }
  function importPreset(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const obj = JSON.parse(e.target.result);
        if (obj && Array.isArray(obj.steps)) {
          setSteps(obj.steps.map((s, i) => ({ id: s.id || `s${i}`, ...s })));
        } else {
          alert("Preset invàlid");
        }
      } catch (err) {
        alert("Error llegint JSON");
      }
    };
    reader.readAsText(file);
  }

  // render timeline bars
  return (
    <div className="timeline-graphic p-3 bg-[var(--sdp-bg-primary)] rounded">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button onClick={handlePlay} className="px-3 py-1 bg-orange-500 rounded text-black font-semibold">Play</button>
          <button onClick={handlePause} className="px-3 py-1 border rounded text-slate-200">Pause</button>
          <div className="text-sm text-slate-300 ml-3">Playhead: <strong>{Math.min(Math.round(playhead), durationMs)} ms</strong></div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400">Scale</label>
          <input type="range" min="0.04" max="0.3" step="0.01" value={pxPerMs} onChange={() => {}} className="w-36" disabled />
          <button onClick={() => exportPreset('timeline-preset')} className="px-3 py-1 bg-blue-600 rounded text-white">Export</button>
          <input type="file" accept="application/json" onChange={e => {
            const f = e.target.files && e.target.files[0];
            if (f) importPreset(f);
          }} className="text-xs" />
        </div>
      </div>

      <div className="timeline-canvas relative border border-slate-800 rounded" style={{ width: width, height: 220 }}>
        {/* time ruler */}
        <div className="absolute left-0 top-0 right-0 h-8 border-b border-slate-800 bg-slate-900 flex items-center">
          <div className="ml-2 text-xs text-slate-400">0 ms</div>
          <div className="flex-1 relative">
            {/* ticks */}
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}>
              {Array.from({ length: Math.ceil(durationMs / 500) + 1 }).map((_, i) => {
                const x = msToPx(i * 500);
                return <div key={i} style={{ position: 'absolute', left: x, top: 0, height: '100%', width: 1, background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ position: 'absolute', top: 10, left: 2, fontSize: 11, color: '#9aa4b2' }}>{i * 500}ms</div>
                </div>;
              })}
            </div>
          </div>
        </div>

        {/* bars area */}
        <div className="absolute left-0 top-8 right-0 bottom-0 overflow-auto">
          <div style={{ position: 'relative', height: '100%', width: Math.max(width, msToPx(durationMs) + 120) }}>
            {/* playhead */}
            <div style={{
              position: 'absolute',
              left: msToPx(playhead),
              top: 0,
              bottom: 0,
              width: 2,
              background: 'linear-gradient(180deg, rgba(249,115,22,0.9), rgba(255,184,107,0.6))',
              zIndex: 50
            }} />

            {/* render each step as a bar */}
            {steps.map((st, idx) => {
              const x = msToPx(st.delay || 0);
              const w = msToPx(st.duration || 800);
              const y = 12 + idx * 44;
              const isSelected = selectedId === st.id;
              return (
                <div key={st.id}
                     className={`timeline-step absolute ${isSelected ? 'selected' : ''}`}
                     style={{ left: x, top: y, width: Math.max(24, w), height: 36, cursor: 'pointer', zIndex: 40 }}>
                  <div
                    onMouseDown={(e) => onBarMouseDown(e, st.id)}
                    onClick={() => setSelectedId(st.id)}
                    className="bar h-full rounded flex items-center justify-between px-2"
                    style={{
                      background: isSelected ? 'linear-gradient(90deg,#F97316,#FFB86B)' : '#0b1220',
                      border: '1px solid rgba(255,255,255,0.04)',
                      color: '#fff'
                    }}>
                    <div className="text-xs truncate" style={{ maxWidth: Math.max(40, w - 60) }}>{st.label || st.selector}</div>
                    <div className="flex items-center gap-2">
                      <div className="text-[10px] text-slate-300">{Math.round(st.delay || 0)}ms</div>
                      <div className="drag-handle" onMouseDown={(e) => onResizeMouseDown(e, st.id)} style={{ width: 10, height: 20, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }} />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* vertical spacing placeholder */}
            <div style={{ position: 'absolute', left: 0, top: 12 + steps.length * 44, height: 20, width: 1 }} />
          </div>
        </div>
      </div>

      {/* inspector */}
      <div className="mt-3 grid grid-cols-3 gap-3">
        <div className="col-span-2 p-3 bg-slate-900 rounded">
          <div className="text-sm font-medium mb-2 text-white">Inspector</div>
          {selectedId ? (
            (() => {
              const st = steps.find(s => s.id === selectedId);
              if (!st) return <div className="text-xs text-slate-400">Pas no trobat</div>;
              return (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input value={st.label || ''} onChange={e => updateStep(st.id, { label: e.target.value })} className="flex-1 p-2 rounded bg-slate-800 text-white" placeholder="Etiqueta" />
                    <button onClick={() => removeStep(st.id)} className="px-3 py-2 bg-red-700 rounded text-white">Eliminar</button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input value={st.rootQuery} onChange={e => updateStep(st.id, { rootQuery: e.target.value })} className="p-2 rounded bg-slate-800 text-white" />
                    <input value={st.selector} onChange={e => updateStep(st.id, { selector: e.target.value })} className="p-2 rounded bg-slate-800 text-white" />
                    <input value={st.className} onChange={e => updateStep(st.id, { className: e.target.value })} className="p-2 rounded bg-slate-800 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-400">Delay</label>
                    <input type="range" min="0" max={durationMs} value={st.delay || 0} onChange={e => updateStep(st.id, { delay: Number(e.target.value) })} className="flex-1" />
                    <div className="text-xs text-slate-300 w-20 text-right">{Math.round(st.delay || 0)} ms</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-400">Durada</label>
                    <input type="range" min="80" max={durationMs} value={st.duration || 800} onChange={e => updateStep(st.id, { duration: Number(e.target.value) })} className="flex-1" />
                    <div className="text-xs text-slate-300 w-20 text-right">{Math.round(st.duration || 800)} ms</div>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="text-xs text-slate-400">Selecciona un pas per editar-lo o afegeix un de nou.</div>
          )}
        </div>

        <div className="p-3 bg-slate-900 rounded">
          <div className="text-sm font-medium mb-2 text-white">Add Step</div>
          <AddStepInline onAdd={(s) => addStep(s)} />
        </div>
      </div>
    </div>
  );
}

function AddStepInline({ onAdd }) {
  const [rootQuery, setRootQuery] = useState("#sausage-wrapper");
  const [selector, setSelector] = useState('[data-part="spark"]');
  const [className, setClassName] = useState('anim-spark');
  const [delay, setDelay] = useState(0);
  const [duration, setDuration] = useState(900);
  const [label, setLabel] = useState('');

  function submit(e) {
    e.preventDefault();
    onAdd({ rootQuery, selector, className, delay: Number(delay), duration: Number(duration), label });
    setLabel('');
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Etiqueta (opcional)" className="w-full p-2 rounded bg-slate-800 text-white" />
      <input value={rootQuery} onChange={e => setRootQuery(e.target.value)} className="w-full p-2 rounded bg-slate-800 text-white" />
      <input value={selector} onChange={e => setSelector(e.target.value)} className="w-full p-2 rounded bg-slate-800 text-white" />
      <div className="flex gap-2">
        <input value={className} onChange={e => setClassName(e.target.value)} className="flex-1 p-2 rounded bg-slate-800 text-white" />
        <input type="number" value={delay} onChange={e => setDelay(e.target.value)} className="w-24 p-2 rounded bg-slate-800 text-white" />
        <input type="number" value={duration} onChange={e => setDuration(e.target.value)} className="w-24 p-2 rounded bg-slate-800 text-white" />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="px-3 py-2 bg-emerald-500 rounded text-black font-medium">Add</button>
      </div>
    </form>
  );
}
