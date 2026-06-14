// src/components/SpriteConsoleExtended.jsx
import React, { useRef, useState, useEffect } from "react";
import useSpriteAnimator from "../hooks/useSpriteAnimator";
import sequences from "../lib/spriteSequences";
import macros from "../lib/macroSequences";
import * as Sprites from "./sprites";
import { downloadJSON, savePresetToLocal, loadPresetFromLocal, listLocalPresets } from "../lib/presetUtils";
const spriteKeys = Object.keys(sequences);
export default function SpriteConsoleExtended() {
  const wrapperRef = useRef(null);
  const [selectedSprite, setSelectedSprite] = useState(spriteKeys[0]);
  const [selectedSeq, setSelectedSeq] = useState(Object.keys(sequences[spriteKeys[0]])[0]);
  const [size, setSize] = useState(160);
  const [log, setLog] = useState([]);
  const [macroName, setMacroName] = useState(Object.keys(macros)[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedSteps, setRecordedSteps] = useState([]);
  const [presetName, setPresetName] = useState('');
  const [localPresets, setLocalPresets] = useState(listLocalPresets());
  const spriteRootsRef = useRef({});
  useEffect(() => {
    spriteKeys.forEach(k => {
      const id = `${k}-wrapper`;
      spriteRootsRef.current[k] = document.getElementById(id);
    });
  }, []);
  const {
    trigger,
    runMacro,
    stopAll
  } = useSpriteAnimator(wrapperRef, sequences[selectedSprite], {
    autoReset: true
  });
  useEffect(() => {
    const seqs = Object.keys(sequences[selectedSprite] || {});
    setSelectedSeq(seqs[0] || "");
  }, [selectedSprite]);
  function logLine(text) {
    setLog(l => [`${new Date().toLocaleTimeString()} • ${text}`, ...l].slice(0, 80));
  }
  function handleTrigger() {
    trigger(selectedSeq);
    logLine(`${selectedSprite} → ${selectedSeq}`);
  }
  function handleStop() {
    stopAll();
    logLine('STOP all');
  }
  function handleRunMacro(name) {
    const macro = macros[name];
    if (!macro) return;
    const blocks = macro.map(item => {
      const root = document.querySelector(item.rootQuery) || spriteRootsRef.current[item.spriteKey] || null;
      const seqObj = sequences[item.spriteKey];
      const seq = seqObj ? seqObj[item.sequenceName] : null;
      return {
        root,
        steps: seq || [],
        offset: item.offset || 0,
        meta: item
      };
    }).filter(b => b.root && b.steps && b.steps.length);
    runMacro(blocks);
    logLine(`Macro ${name} executed`);
  }
  function addRecordedStep(step) {
    setRecordedSteps(s => [...s, step]);
    logLine(`Recorded step: ${step.selector} ${step.className}`);
  }
  function startRecording() {
    setRecordedSteps([]);
    setIsRecording(true);
    logLine('Recording started');
  }
  function stopRecording() {
    setIsRecording(false);
    logLine('Recording stopped');
  }
  function savePreset() {
    if (!presetName) return;
    const preset = {
      name: presetName,
      createdAt: new Date().toISOString(),
      steps: recordedSteps
    };
    savePresetToLocal(presetName, preset);
    setLocalPresets(listLocalPresets());
    logLine(`Preset saved: ${presetName}`);
  }
  function exportPreset() {
    if (!presetName) return;
    const preset = {
      name: presetName,
      createdAt: new Date().toISOString(),
      steps: recordedSteps
    };
    downloadJSON(preset, `${presetName}.json`);
    logLine(`Preset exported: ${presetName}.json`);
  }
  function loadPreset(name) {
    const p = loadPresetFromLocal(name);
    if (!p) return;
    setRecordedSteps(p.steps || []);
    setPresetName(p.name);
    logLine(`Preset loaded: ${name}`);
  }
  function importPresetFile(file) {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const obj = JSON.parse(e.target.result);
        if (obj && obj.steps) {
          setRecordedSteps(obj.steps);
          setPresetName(obj.name || 'imported');
          logLine(`Preset imported: ${obj.name || 'imported'}`);
        }
      } catch (err) {
        logLine('Import failed: invalid JSON');
      }
    };
    reader.readAsText(file);
  }
  const SpritePreview = ({
    keyName
  }) => {
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
    const Comp = map[keyName] || (() => <div>no sprite</div>);
    const id = `${keyName}-wrapper`;
    return (
      <div id={id} className='p-2 bg-sdp-sdp-bg-primary rounded' style={{
        width: size + 40
      }}>
          <Comp size={size} className="sprite-wrapper" ariaLabel={`${keyName} preview`} />
        </div>
    );
  };
  return (
    <div className='p-4 bg-sdp-sdp-bg-surface rounded-md shadow-sm space-y-4'>
        <h3 className="text-lg font-semibold">Director d'Orquestra Caòtic</h3>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-3">
            <label className="block text-sm">Sprite</label>
            <select value={selectedSprite} onChange={e => setSelectedSprite(e.target.value)} className="w-full p-2 rounded bg-slate-800">
              {spriteKeys.map(k => <option key={k} value={k}>{k}</option>)}
            </select>

            <label className="block text-sm">Seqüència</label>
            <select value={selectedSeq} onChange={e => setSelectedSeq(e.target.value)} className="w-full p-2 rounded bg-slate-800">
              {Object.keys(sequences[selectedSprite] || {}).map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <div className="flex gap-2 mt-2">
              <button onClick={handleTrigger} className="px-3 py-2 bg-orange-500 rounded text-black font-semibold">Trigger</button>
              <button onClick={handleStop} className="px-3 py-2 border rounded text-slate-200">Stop</button>
            </div>

            <label className="block text-sm mt-3">Mida (px)</label>
            <input type="range" min="80" max="420" value={size} onChange={e => setSize(Number(e.target.value))} className="w-full" />
          </div>

          <div className="md:col-span-2 space-y-3">
            <div className="flex gap-3">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <SpritePreview keyName="sausage" />
                <SpritePreview keyName="pixel" />
                <SpritePreview keyName="rat" />
                <SpritePreview keyName="worm" />
              </div>

              <div className="w-64 p-2 bg-slate-900 rounded text-xs text-slate-300">
                <div className="font-medium mb-2">Registre</div>
                <div style={{
                maxHeight: 260,
                overflow: 'auto'
              }}>
                  {log.length === 0 && <div className="text-slate-500">Cap activitat</div>}
                  {log.map((l, i) => <div key={i} className="py-1 border-b border-slate-800">{l}</div>)}
                </div>
              </div>
            </div>

            <div className='bg-sdp-sdp-bg-primary p-3 rounded'>
              <div className="flex items-center gap-3">
                <label className="font-medium">Macros</label>
                <select value={macroName} onChange={e => setMacroName(e.target.value)} className="p-2 rounded bg-slate-800">
                  {Object.keys(macros).map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <button onClick={() => handleRunMacro(macroName)} className="ml-auto px-3 py-2 bg-emerald-500 rounded text-black">Run Macro</button>
              </div>
              <div className="text-xs text-slate-400 mt-2">Executa macros que encadenen seqüències entre sprites.</div>
            </div>

            <div className='bg-sdp-sdp-bg-primary p-3 rounded space-y-2'>
              <div className="flex items-center gap-2">
                <button onClick={() => isRecording ? stopRecording() : startRecording()} className={`px-3 py-2 rounded ${isRecording ? 'bg-red-600 text-white' : 'bg-yellow-500 text-black'}`}>
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>

                <button onClick={() => {
                const rootQuery = `#${selectedSprite}-wrapper`;
                const step = {
                  rootQuery,
                  selector: sequences[selectedSprite] && sequences[selectedSprite][selectedSeq] ? sequences[selectedSprite][selectedSeq][0].selector : '[data-part="spark"]',
                  className: sequences[selectedSprite] && sequences[selectedSprite][selectedSeq] ? sequences[selectedSprite][selectedSeq][0].className : 'anim-spark',
                  delay: 0,
                  duration: sequences[selectedSprite] && sequences[selectedSprite][selectedSeq] ? sequences[selectedSprite][selectedSeq][0].duration : 900
                };
                addRecordedStep(step);
              }} className="px-3 py-2 border rounded">Add Step</button>

                <input value={presetName} onChange={e => setPresetName(e.target.value)} placeholder="Preset name" className="ml-2 p-2 rounded bg-slate-800" />
                <button onClick={savePreset} className="px-3 py-2 bg-blue-600 rounded text-white">Save</button>
                <button onClick={exportPreset} className="px-3 py-2 bg-indigo-600 rounded text-white">Export</button>
              </div>

              <div className="text-xs text-slate-400">Recorded steps: {recordedSteps.length}</div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <label className="text-xs">Local presets</label>
                  <select onChange={e => loadPreset(e.target.value)} className="w-full p-2 rounded bg-slate-800">
                    <option value="">-- select --</option>
                    {localPresets.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs">Import preset</label>
                  <input type="file" accept="application/json" onChange={e => {
                  const f = e.target.files && e.target.files[0];
                  if (f) importPresetFile(f);
                }} className="w-full p-2 rounded bg-slate-800" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
  );
}