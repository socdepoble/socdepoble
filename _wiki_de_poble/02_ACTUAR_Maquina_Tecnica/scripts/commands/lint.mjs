import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const SKIP = new Set(['node_modules', '.git', 'dist', 'build']);
const EXT = /\.(mjs|js|ts|tsx|jsx|html|md)$/;

async function rules() {
  const url = new URL('../rules/trellat-rules.json', import.meta.url);
  return JSON.parse(await readFile(url, 'utf8'));
}

async function walk(dir, out = []) {
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    if (SKIP.has(ent.name)) continue;
    const p = join(dir, ent.name);
    if (ent.isDirectory()) await walk(p, out);
    else if (EXT.test(p)) out.push(p);
  }
  return out;
}

function lineOf(text, idx) {
  return text.slice(0, idx).split(/\r?\n/).length;
}

function scan(text, file, r) {
  const findings = [];
  const rx = /\b(?:class|className)=["'`]([^"'`]+)["'`]/g;
  for (const m of text.matchAll(rx)) {
    const classes = m[1].split(/\s+/).filter(Boolean);
    for (const c of classes) {
      const illegal = r.illegalTailwindPrefixes.find(p => c.startsWith(p));
      if (illegal) {
        findings.push({
          file,
          line: lineOf(text, m.index),
          rule: illegal === 'bg-' ? 'bg-tailwind-block' : 'tailwind-illegal',
          value: c
        });
      }
    }
  }
  return findings;
}

export async function run({ root, args }) {
  const r = await rules();
  const targets = args.length ? args.map(a => join(root, a)) : await walk(root);
  const findings = [];
  for (const abs of targets) {
    const text = await readFile(abs, 'utf8').catch(() => '');
    if (text) findings.push(...scan(text, relative(root, abs), r));
  }
  return {
    code: findings.length ? 1 : 0,
    summary: findings.length ? 'Tailwind il·legal detectat' : 'Pedra Seca neta',
    findings,
    errors: findings.length ? ['Commit bloquejat per classes Tailwind il·legals'] : []
  };
}
