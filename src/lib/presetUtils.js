// src/lib/presetUtils.js
export function downloadJSON(obj, filename = 'preset.json') {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj, null, 2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", filename);
  document.body.appendChild(dlAnchor);
  dlAnchor.click();
  dlAnchor.remove();
}

export function savePresetToLocal(name, preset) {
  const key = `brasa_preset_${name}`;
  localStorage.setItem(key, JSON.stringify(preset));
}

export function loadPresetFromLocal(name) {
  const key = `brasa_preset_${name}`;
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

export function listLocalPresets() {
  return Object.keys(localStorage)
    .filter(k => k.startsWith('brasa_preset_'))
    .map(k => k.replace('brasa_preset_', ''));
}
