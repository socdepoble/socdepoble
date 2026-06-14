// src/components/SpriteConsole.jsx
import React, { useRef, useState, useEffect } from "react";
import useSpriteAnimator from "../hooks/useSpriteAnimator";
import sequences from "../lib/spriteSequences";
import * as Sprites from "./sprites"; // assume index.js exports all sprites

// Helper per llistar sprites disponibles
const spriteKeys = Object.keys(sequences);
export default function SpriteConsole() {
  const wrapperRef = useRef(null);
  const [selectedSprite, setSelectedSprite] = useState(spriteKeys[0]);
  const [selectedSeq, setSelectedSeq] = useState(Object.keys(sequences[spriteKeys[0]])[0]);
  const [size, setSize] = useState(160);
  const [isVisible, setIsVisible] = useState(true);
  const [log, setLog] = useState([]);
  const {
    trigger,
    stopAll
  } = useSpriteAnimator(wrapperRef, sequences[selectedSprite], {
    autoReset: true
  });
  useEffect(() => {
    // update selected sequence when sprite changes
    const seqs = Object.keys(sequences[selectedSprite] || {});
    setSelectedSeq(seqs[0] || "");
  }, [selectedSprite]);
  function handleTrigger() {
    if (!selectedSeq) return;
    trigger(selectedSeq);
    setLog(l => [`${new Date().toLocaleTimeString()} • ${selectedSprite} → ${selectedSeq}`, ...l].slice(0, 30));
  }
  function handleStop() {
    stopAll();
    setLog(l => [`${new Date().toLocaleTimeString()} • STOP`, ...l].slice(0, 30));
  }

  // Render the chosen sprite component dynamically
  const SpriteComponent = (() => {
    // map sprite key to component name: sausage -> SausageFuse etc.
    // Provide a small mapping to the actual exported components
    const map = {
      sausage: Sprites.SausageFuse,
      chicken: Sprites.ChickenRouter,
      pixel: Sprites.PixelPet,
      boot: Sprites.BootAntenna,
      snail: Sprites.SnailCable,
      rat: Sprites.RatSolder,
      worm: Sprites.DataWorm,
      ember: Sprites.EmberDust,
      pigeon: Sprites.PigeonDrone,
      sundial: Sprites.SundialCron
    };
    return map[selectedSprite] || (() => <div>Sprite no trobat</div>);
  })();
  return (
    <div className='p-4 bg-sdp-sdp-bg-surface rounded-md shadow-sm'>
        <h3 className="text-lg font-semibold mb-3">Consola Brasa Burst</h3>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-1 space-y-3">
            <label className="block text-sm">Sprite</label>
            <select value={selectedSprite} onChange={e => setSelectedSprite(e.target.value)} className="w-full p-2 rounded bg-slate-800">
              {spriteKeys.map(k => <option key={k} value={k}>{k}</option>)}
            </select>

            <label className="block text-sm">Seqüència</label>
            <select value={selectedSeq} onChange={e => setSelectedSeq(e.target.value)} className="w-full p-2 rounded bg-slate-800">
              {Object.keys(sequences[selectedSprite] || {}).map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <label className="block text-sm">Mida (px)</label>
            <input type="range" min="80" max="420" value={size} onChange={e => setSize(Number(e.target.value))} className="w-full" />

            <div className="flex gap-2 mt-2">
              <button onClick={handleTrigger} className="px-3 py-2 bg-orange-500 rounded text-black font-semibold">Trigger</button>
              <button onClick={handleStop} className="px-3 py-2 border rounded text-slate-200">Stop</button>
              <button onClick={() => setIsVisible(v => !v)} className="px-3 py-2 rounded bg-slate-700 text-slate-100">
                {isVisible ? "Ocultar animacions" : "Mostrar animacions"}
              </button>
            </div>
          </div>

          <div className="md:col-span-2 flex gap-4">
            <div ref={wrapperRef} className={`p-4 rounded bg-slate-800 flex items-center justify-center ${isVisible ? 'is-visible' : ''}`} style={{
            minWidth: 320
          }}>
              <SpriteComponent size={size} className="sprite-wrapper" ariaLabel={`${selectedSprite} preview`} />
            </div>

            <div className="w-48 p-2 bg-slate-900 rounded text-xs text-slate-300">
              <div className="font-medium mb-2">Registre</div>
              <div style={{
              maxHeight: 220,
              overflow: 'auto'
            }}>
                {log.length === 0 && <div className="text-slate-500">Cap activitat</div>}
                {log.map((l, i) => <div key={i} className="py-1 border-b border-slate-800">{l}</div>)}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-slate-400">
          Consells • Usa el selector per provar seqüències; afegeix classes Tailwind al component per combinar animacions.
        </div>
      </div>
  );
}