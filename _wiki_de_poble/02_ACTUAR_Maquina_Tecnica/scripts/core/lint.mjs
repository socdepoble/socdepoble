// commands/lint.mjs — Bloqueja el commit si troba Tailwind estètic il·legal (bg-*, text-*,
// rounded-*, valors arbitraris [...]). Tailwind de maquetació (flex, grid, gap-*...) és lícit.
import { readFile, readdir } from 'node:fs/promises';
import { join, relative, extname } from 'node:path';

const RULES_URL = new URL('../rules/trellat-rules.json', import.meta.url);
const SCAN_EXT = new Set(['.html', '.jsx', '.tsx', '.js', '.vue', '.md']);
const CLASS_ATTR_RE = /class(?:Name)?=["'`]([^"'`]+)["'`]/g;

async function loadRules() {
  return JSON.parse(await readFile(RULES_URL, 'utf8'));
}

async function walk(dir, acc = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name.startsWith('.') || e.name === 'node_modules') continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) await walk(full, acc);
    else if (SCAN_EXT.has(extname(e.name))) acc.push(full);
  }
  return acc;
}

function violationRule(token, rules) {
  const { forbiddenColorPrefixes, forbiddenRadiusPrefixes, colorExceptions, arbitraryValuePattern, allowedLayoutPrefixes } = rules.tailwind;
  if (colorExceptions.includes(token)) return null;
  if (allowedLayoutPrefixes.some((p) => token.startsWith(p))) return null;
  if (/^(bg|text|border|rounded|shadow)-/.test(token) && new RegExp(arbitraryValuePattern).test(token)) return 'valor-arbitrari';
  if (forbiddenColorPrefixes.some((p) => token.startsWith(p))) return 'color-tailwind-il·legal';
  if (forbiddenRadiusPrefixes.some((p) => token.startsWith(p))) return 'radi-tailwind-il·legal';
  return null;
}

export async function run(options) {
  const root = options.root || '.';
  const rules = await loadRules();
  const singleFile = Boolean(options.file);
  const targets = singleFile ? [options.file] : await walk(root);
  const violations = [];

  for (const file of targets) {
    const label = singleFile ? file : relative(root, file);
    const raw = await readFile(file, 'utf8').catch(() => '');
    raw.split('\n').forEach((line, idx) => {
      for (const m of line.matchAll(CLASS_ATTR_RE)) {
        for (const token of m[1].split(/\s+/).filter(Boolean)) {
          const rule = violationRule(token, rules);
          if (rule) violations.push({ file: label, line: idx + 1, token, rule });
        }
      }
    });
  }

  const ok = violations.length === 0;
  const summary = ok
    ? `Lint net: ${targets.length} fitxers escanejats, cap Tailwind il·legal.`
    : `Lint FALLIT: ${violations.length} classe(s) il·legal(s) en ${targets.length} fitxers.`;

  return { ok, summary, data: { filesScanned: targets.length, violations } };
}
