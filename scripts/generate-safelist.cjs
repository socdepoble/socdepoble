#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function exitWith(msg) {
  console.error(msg);
  process.exit(1);
}

const infile = process.argv[2] || 'informe-tractor-2.0.json';
if (!fs.existsSync(infile)) exitWith(`Fitxer no trobat: ${infile}`);

let raw;
try {
  raw = fs.readFileSync(infile, 'utf8');
} catch (e) {
  exitWith('Error llegint el fitxer: ' + e.message);
}

let report;
try {
  report = JSON.parse(raw);
} catch (e) {
  exitWith('Error parsejant JSON: ' + e.message);
}

let findings = [];
if (Array.isArray(report)) findings = report;
else if (Array.isArray(report.findings)) findings = report.findings;
else if (Array.isArray(report.results)) findings = report.results;
else {
  const possible = [];
  for (const k of Object.keys(report)) {
    if (Array.isArray(report[k])) possible.push(...report[k]);
  }
  if (possible.length) findings = possible;
  else exitWith('No he trobat una llista d’entrades al JSON.');
}

function extractClassFromEntry(e) {
  const keys = ['class', 'value', 'raw', 'node', 'code', 'className', 'classname', 'classList', 'original'];
  for (const k of keys) {
    if (e[k]) return e[k];
  }
  if (typeof e === 'string') return e;
  return null;
}

const arbitraryRegex = /([a-zA-Z0-9-]+)-\[(.+?)\]/g;
const cssVarRegex = /var\(--([a-zA-Z0-9-_]+)\)/;

const prefixMap = {
  text: 'colors', bg: 'colors', 'bg-gradient-to': 'backgroundImage',
  border: 'colors', rounded: 'borderRadius', w: 'spacing', h: 'spacing',
  'min-w': 'spacing', 'min-h': 'spacing', 'max-w': 'spacing', 'max-h': 'spacing',
  gap: 'spacing', p: 'spacing', px: 'spacing', py: 'spacing', pt: 'spacing',
  pr: 'spacing', pb: 'spacing', pl: 'spacing'
};

const safelistSet = new Set();
const themeExtend = { colors: {}, borderRadius: {}, spacing: {}, backgroundImage: {} };
const componentMap = new Map();
const classToEntries = new Map();

for (const entry of findings) {
  const rawClass = extractClassFromEntry(entry);
  if (!rawClass || typeof rawClass !== 'string') continue;

  let m;
  while ((m = arbitraryRegex.exec(rawClass)) !== null) {
    const full = m[0];
    const prefix = m[1];
    const inner = m[2];

    const classNormalized = full.trim();
    safelistSet.add(classNormalized);

    const varMatch = cssVarRegex.exec(inner);
    if (varMatch) {
      const varName = varMatch[1];
      const key = `sdp-${varName.replace(/[^a-z0-9-_]/gi, '-')}`;
      const target = prefixMap[prefix] || null;
      if (target === 'colors') themeExtend.colors[key] = `var(--${varName})`;
      else if (target === 'borderRadius') themeExtend.borderRadius[key] = `var(--${varName})`;
      else if (target === 'spacing') themeExtend.spacing[key] = `var(--${varName})`;
      else if (target === 'backgroundImage') themeExtend.backgroundImage[key] = `var(--${varName})`;
      else themeExtend.colors[key] = `var(--${varName})`;
    } else {
      const literalKey = inner.replace(/[^a-z0-9-_]/gi, '-').replace(/^-+|-+$/g, '');
      const key = `__lit_${literalKey}`.slice(0, 40);
      const target = prefixMap[prefix] || 'spacing';
      if (target === 'colors') themeExtend.colors[key] = inner;
      else if (target === 'borderRadius') themeExtend.borderRadius[key] = inner;
      else if (target === 'spacing') themeExtend.spacing[key] = inner;
      else themeExtend.spacing[key] = inner;
    }

    const file = entry.file || entry.filename || entry.path || entry.filePath || entry.source || 'unknown';
    const compKey = file;
    if (!componentMap.has(compKey)) componentMap.set(compKey, new Set());
    componentMap.get(compKey).add(classNormalized);

    if (!classToEntries.has(classNormalized)) classToEntries.set(classNormalized, []);
    classToEntries.get(classNormalized).push({ file, raw: rawClass, entry });
  }
}

const safelist = Array.from(safelistSet).sort();
fs.writeFileSync('safelist.json', JSON.stringify(safelist, null, 2), 'utf8');

function generateThemeExtendJS(themeObj) {
  const cleaned = {};
  for (const k of Object.keys(themeObj)) {
    if (Object.keys(themeObj[k]).length > 0) cleaned[k] = themeObj[k];
  }
  return `module.exports = ${JSON.stringify({ extend: cleaned }, null, 2)};\n`;
}

fs.writeFileSync('tailwind-theme-extend.js', generateThemeExtendJS(themeExtend), 'utf8');

const compArray = Array.from(componentMap.entries()).map(([k, set]) => ({ file: k, count: set.size, classes: Array.from(set).slice(0, 20) }));
compArray.sort((a, b) => b.count - a.count);

const lines = ['# Roadmap de fixes'];
for (const c of compArray.slice(0, 20)) {
  lines.push(`### ${c.file} — ${c.count} classes`);
}
fs.writeFileSync('roadmap.md', lines.join('\n'), 'utf8');

console.log('=== Generació completada ===');
console.log(`Classes arbitràries: ${safelist.length}`);
console.log(`Fitxers afectats: ${compArray.length}`);
