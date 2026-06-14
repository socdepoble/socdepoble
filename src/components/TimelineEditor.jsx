// src/components/TimelineEditor.jsx
import React, { useState, useRef, useEffect } from "react";
import { downloadJSON, savePresetToLocal, listLocalPresets, loadPresetFromLocal } from "../lib/presetUtils";

/*
 Props:
  - initialSteps: array of steps { rootQuery, selector, className, delay, duration }
  - onRunMacro(blocks): function to run macro (blocks format for runMacro)
  - containerSelector: selector string for the orchestration container (used for recording)
*/
export default function TimelineEditor({
  initialSteps = [],
  onRunMacro,
  containerSelector = "#orchestra"
}) {
  const [steps, setSteps] = useState(initialSteps);
  const [dragIndex, setDragIndex] = useState(null);
  const [presetName, setPresetName] = useState("");
  const [localPresets, setLocalPresets] = useState(listLocalPresets());
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recordedBlobsRef = useRef([]);
  const recordingStreamRef = useRef(null);
  useEffect(() => {
    setLocalPresets(listLocalPresets());
  }, []);

  // Drag handlers (HTML5)
  function handleDragStart(e, idx) {
    setDragIndex(idx);
    e.dataTransfer.effectAllowed = "move";
    try {
      e.dataTransfer.setData("text/plain", String(idx));
    } catch {}
  }
  function handleDragOver(e, idx) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }
  function handleDrop(e, idx) {
    e.preventDefault();
    const from = dragIndex !== null ? dragIndex : Number(e.dataTransfer.getData("text/plain"));
    if (from === idx) return;
    const copy = [...steps];
    const [moved] = copy.splice(from, 1);
    copy.splice(idx, 0, moved);
    setSteps(copy);
    setDragIndex(null);
  }

  // Step CRUD
  function addStep(step) {
    setSteps(s => [...s, step]);
  }
  function updateStep(i, patch) {
    setSteps(s => s.map((st, idx) => idx === i ? {
      ...st,
      ...patch
    } : st));
  }
  function removeStep(i) {
    setSteps(s => s.filter((_, idx) => idx !== i));
  }

  // Run timeline as macro: schedule each step with cumulative offset
  function runTimeline() {
    if (!onRunMacro) return;
    // Convert steps into blocks with offsets so they run in sequence
    const blocks = [];
    let cumulative = 0;
    steps.forEach(st => {
      const root = document.querySelector(st.rootQuery);
      if (!root) {
        // still push a placeholder to preserve timing
        cumulative += (st.delay || 0) + (st.duration || 800);
        return;
      }
      const stepObj = {
        selector: st.selector,
        className: st.className,
        delay: st.delay || 0,
        duration: st.duration || 800
      };
      blocks.push({
        root,
        steps: [stepObj],
        offset: cumulative
      });
      cumulative += (st.delay || 0) + (st.duration || 800);
    });
    onRunMacro(blocks);
  }

  // Preset management
  function savePreset() {
    if (!presetName) return;
    const preset = {
      name: presetName,
      createdAt: new Date().toISOString(),
      steps
    };
    savePresetToLocal(presetName, preset);
    setLocalPresets(listLocalPresets());
  }
  function loadPreset(name) {
    const p = loadPresetFromLocal(name);
    if (!p) return;
    setSteps(p.steps || []);
    setPresetName(p.name || "");
  }
  function exportPreset() {
    if (!presetName) return;
    const preset = {
      name: presetName,
      createdAt: new Date().toISOString(),
      steps
    };
    downloadJSON(preset, `${presetName}.json`);
  }

  // Video recording: try element.captureStream(), fallback to getDisplayMedia()
  async function startRecording() {
    if (isRecordingVideo) return;
    const container = document.querySelector(containerSelector) || document.body;
    let stream = null;
    try {
      // try captureStream (works on canvas and some browsers for elements)
      if (typeof container.captureStream === "function") {
        stream = container.captureStream(30);
      } else {
        // fallback: ask for display capture (user will see prompt)
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false
        });
      }
    } catch (err) {
      console.error("Recording start failed", err);
      alert("No s'ha pogut iniciar la gravació. Prova amb getDisplayMedia o comprova permisos.");
      return;
    }
    recordedBlobsRef.current = [];
    recordingStreamRef.current = stream;
    const options = {
      mimeType: 'video/webm;codecs=vp9'
    };
    let mediaRecorder;
    try {
      mediaRecorder = new MediaRecorder(stream, options);
    } catch (e) {
      // fallback codec
      mediaRecorder = new MediaRecorder(stream);
    }
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.ondataavailable = e => {
      if (e.data && e.data.size > 0) recordedBlobsRef.current.push(e.data);
    };
    mediaRecorder.onstop = () => {
      // stop tracks if we used captureStream fallback
      if (recordingStreamRef.current && recordingStreamRef.current.getTracks) {
        recordingStreamRef.current.getTracks().forEach(t => t.stop());
      }
      const blob = new Blob(recordedBlobsRef.current, {
        type: 'video/webm'
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `brasa-replay-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 1000);
      setIsRecordingVideo(false);
    };
    mediaRecorder.start();
    setIsRecordingVideo(true);
  }
  function stopRecording() {
    if (!isRecordingVideo || !mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
  }

  // UI
  return (
    <div className='bg-sdp-sdp-bg-primary p-3 rounded space-y-3'>
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">Editor de Timeline</h4>
          <div className="flex gap-2">
            <button onClick={runTimeline} className="px-3 py-1 bg-orange-500 rounded text-black">Run Timeline</button>
            {!isRecordingVideo ? <button onClick={startRecording} className="px-3 py-1 bg-emerald-500 rounded text-black">Start Replay Record</button> : <button onClick={stopRecording} className="px-3 py-1 bg-red-600 rounded text-white">Stop & Download</button>}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <div className="mb-2 text-xs text-slate-300">Pasos (arrossega per reordenar)</div>
            <div className="space-y-2">
              {steps.map((st, i) => <div key={i} draggable onDragStart={e => handleDragStart(e, i)} onDragOver={e => handleDragOver(e, i)} onDrop={e => handleDrop(e, i)} className="p-2 bg-slate-800 rounded flex items-start gap-2">
                  <div className="w-6 text-xs text-slate-400">{i + 1}</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{st.selector}</div>
                    <div className="text-xs text-slate-400">{st.rootQuery} • {st.className} • delay {st.delay || 0}ms</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => removeStep(i)} className="text-xs px-2 py-1 bg-red-700 rounded text-white">Del</button>
                    <button onClick={() => addStep({
                  ...st
                })} className="text-xs px-2 py-1 bg-slate-700 rounded text-white">Dup</button>
                  </div>
                </div>)}
            </div>

            <div className="mt-3 p-2 bg-slate-900 rounded">
              <div className="text-xs text-slate-300 mb-2">Afegeix pas manual</div>
              <AddStepForm onAdd={s => addStep(s)} defaultRoot="#sausage-wrapper" />
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs text-slate-300">Presets</div>
            <div className="flex gap-2 mb-2">
              <input value={presetName} onChange={e => setPresetName(e.target.value)} placeholder="Nom preset" className="flex-1 p-2 rounded bg-slate-800" />
              <button onClick={savePreset} className="px-3 py-2 bg-blue-600 rounded text-white">Save</button>
              <button onClick={exportPreset} className="px-3 py-2 bg-indigo-600 rounded text-white">Export</button>
            </div>

            <div className="mb-2">
              <label className="text-xs text-slate-400">Carrega preset local</label>
              <select onChange={e => loadPreset(e.target.value)} className="w-full p-2 rounded bg-slate-800">
                <option value="">-- select --</option>
                {localPresets.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className="mb-2">
              <label className="text-xs text-slate-400">Importa preset (.json)</label>
              <input type="file" accept="application/json" onChange={e => {
              const f = e.target.files && e.target.files[0];
              if (!f) return;
              const reader = new FileReader();
              reader.onload = ev => {
                try {
                  const obj = JSON.parse(ev.target.result);
                  if (obj && Array.isArray(obj.steps)) {
                    setSteps(obj.steps);
                    setPresetName(obj.name || 'imported');
                  } else {
                    alert('Preset invàlid');
                  }
                } catch (err) {
                  alert('Error llegint JSON');
                }
              };
              reader.readAsText(f);
            }} className="w-full p-2 rounded bg-slate-800" />
            </div>
          </div>
        </div>
      </div>
  );
}
function AddStepForm({
  onAdd,
  defaultRoot = "#sausage-wrapper"
}) {
  const [rootQuery, setRootQuery] = useState(defaultRoot);
  const [selector, setSelector] = useState('[data-part="spark"]');
  const [className, setClassName] = useState('anim-spark');
  const [delay, setDelay] = useState(0);
  const [duration, setDuration] = useState(900);
  function submit(e) {
    e.preventDefault();
    onAdd({
      rootQuery,
      selector,
      className,
      delay: Number(delay),
      duration: Number(duration)
    });
    setSelector('[data-part="spark"]');
    setClassName('anim-spark');
    setDelay(0);
    setDuration(900);
  }
  return <form onSubmit={submit} className="space-y-2">
      <input value={rootQuery} onChange={e => setRootQuery(e.target.value)} className="w-full p-2 rounded bg-slate-800" placeholder="#sausage-wrapper" />
      <input value={selector} onChange={e => setSelector(e.target.value)} className="w-full p-2 rounded bg-slate-800" placeholder='[data-part="spark"]' />
      <div className="flex gap-2">
        <input value={className} onChange={e => setClassName(e.target.value)} className="flex-1 p-2 rounded bg-slate-800" placeholder="anim-spark" />
        <input type="number" value={delay} onChange={e => setDelay(e.target.value)} className="w-24 p-2 rounded bg-slate-800" />
        <input type="number" value={duration} onChange={e => setDuration(e.target.value)} className="w-24 p-2 rounded bg-slate-800" />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="px-3 py-2 bg-emerald-500 rounded text-black">Add</button>
      </div>
    </form>;
}