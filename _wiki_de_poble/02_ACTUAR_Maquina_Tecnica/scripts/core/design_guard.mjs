import { readFile, readdir } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

const SCAN_EXT = new Set(['.html', '.css', '.js', '.mjs']);
const SKIP = new Set(['node_modules', '.git', 'vendor', '_build', '04_ARXIU_Documents_Historics']);
const RAW_HEX = /#[0-9a-fA-F]{3,8}\b/g;
const FONT_SMALL = /font-size\s*:\s*(\d+(?:\.\d+)?)px/gi;
const TOUCH_SIZE = /(min-)?(width|height)\s*:\s*(\d+(?:\.\d+)?)px/gi;
const FOCUS_NONE = /outline\s*:\s*(0|none)\b/gi;
const CLASS_RE = /\bclass(?:Name)?=["'`]([^"'`]+)["'`]/g;

const ALLOWED_HEX = new Set([
  '#000', '#000000',
  '#fff', '#ffffff',
  '#FF7300', '#ff7300',
  '#0984E3', '#0984e3'
]);

async function walk(dir, out = []) {
  for (const ent of await readdir(dir, { withFileTypes: true }).catch(() => [])) {
    if (SKIP.has(ent.name) || ent.name.startsWith('.')) continue;
    const full = join(dir, ent.name);
    if (ent.isDirectory()) await walk(full, out);
    else if (SCAN_EXT.has(extname(ent.name)) && !ent.name.endsWith('.config.js')) out.push(full);
  }
  return out;
}

function lineOf(text, idx) {
  return text.slice(0, idx).split(/\r?\n/).length;
}

function scanDesign(text, file) {
  const findings = [];

  for (const m of text.matchAll(RAW_HEX)) {
    if (!ALLOWED_HEX.has(m[0]) && !text.slice(Math.max(0, m.index - 40), m.index).includes('ALLOW_RAW_COLOR')) {
      findings.push({
        severity: 'critical',
        rule: 'raw-color',
        file,
        line: lineOf(text, m.index),
        message: `Color cru no canonic: ${m[0]}. Usa token --sp-* o justifica amb ALLOW_RAW_COLOR.`
      });
    }
  }

  for (const m of text.matchAll(FONT_SMALL)) {
    const px = Number(m[1]);
    if (px < 16) {
      findings.push({
        severity: 'critical',
        rule: 'font-too-small',
        file,
        line: lineOf(text, m.index),
        message: `Font menor de 16px: ${px}px.`
      });
    }
  }

  for (const m of text.matchAll(TOUCH_SIZE)) {
    const prop = m[2];
    const px = Number(m[3]);
    const nearby = text.slice(Math.max(0, m.index - 120), m.index + 160);
    if (px > 0 && px < 48 && /button|\.sp-button|role=["']button|cursor\s*:\s*pointer/i.test(nearby)) {
      findings.push({
        severity: 'critical',
        rule: 'touch-too-small',
        file,
        line: lineOf(text, m.index),
        message: `Possible control interactiu amb ${prop} ${px}px (<48px).`
      });
    }
  }

  for (const m of text.matchAll(FOCUS_NONE)) {
    const nearby = text.slice(m.index, m.index + 160);
    if (!/focus-visible|box-shadow|outline-offset/i.test(nearby)) {
      findings.push({
        severity: 'critical',
        rule: 'focus-invisible',
        file,
        line: lineOf(text, m.index),
        message: 'Focus eliminat sense alternativa visible.'
      });
    }
  }

  for (const m of text.matchAll(CLASS_RE)) {
    for (const token of m[1].split(/\s+/)) {
      if (/^(bg|text|border|rounded|shadow|ring|from|via|to)-/.test(token)) {
        findings.push({
          severity: 'critical',
          rule: 'tailwind-visual',
          file,
          line: lineOf(text, m.index),
          message: `Classe visual Tailwind prohibida: ${token}.`
        });
      }
    }
  }

  return findings;
}

export async function run(options = {}) {
  const root = options.root || '.';
  const files = await walk(root);
  const findings = [];

  for (const abs of files) {
    const rel = relative(root, abs);
    const text = await readFile(abs, 'utf8').catch(() => '');
    findings.push(...scanDesign(text, rel));
  }

  const critical = findings.filter(f => f.severity === 'critical').length;
  const warning = findings.filter(f => f.severity === 'warning').length;

  return {
    ok: critical === 0,
    summary: `Design Guard: ${files.length} fitxers, ${critical} critics, ${warning} avisos.`,
    data: { filesScanned: files.length, findings, summary: { critical, warning } }
  };
}
