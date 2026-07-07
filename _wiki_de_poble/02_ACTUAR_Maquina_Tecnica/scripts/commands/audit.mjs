import { readdir, readFile } from 'node:fs/promises';
import { join, relative, extname } from 'node:path';
import { parseFrontmatter } from '../lib/frontmatter.mjs';

const SKIP = new Set(['node_modules', '.git', 'dist', 'build', '.vite']);

async function loadRules() {
  const url = new URL('../rules/trellat-rules.json', import.meta.url);
  return JSON.parse(await readFile(url, 'utf8'));
}

async function walk(dir, out = []) {
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    if (SKIP.has(ent.name)) continue;
    const p = join(dir, ent.name);
    if (ent.isDirectory()) await walk(p, out);
    else out.push(p);
  }
  return out;
}

function lineOf(text, idx) {
  return text.slice(0, idx).split(/\r?\n/).length;
}

function tailwindFindings(text, file, rules) {
  const out = [];
  const rx = /\b(?:class|className)=["'`]([^"'`]+)["'`]/g;
  for (const m of text.matchAll(rx)) {
    for (const c of m[1].split(/\s+/).filter(Boolean)) {
      if (rules.illegalTailwindPrefixes.some(p => c.startsWith(p))) {
        out.push({ file, line: lineOf(text, m.index), rule: 'tailwind-illegal', value: c });
      }
    }
  }
  return out;
}

export async function run({ root }) {
  const rules = await loadRules();
  const files = await walk(root);
  const md = files.filter(f => extname(f) === '.md');
  const errors = [];
  const warnings = [];
  const findings = [];
  const names = new Map();
  const pilars = Object.fromEntries(rules.pillars.map(p => [p, 0]));

  for (const abs of files) {
    const rel = relative(root, abs);
    const top = rel.split(/[\\/]/)[0];
    if (pilars[top] !== undefined) pilars[top]++;

    if (/\.(md|mjs|js|ts|tsx|jsx|html)$/.test(abs)) {
      const text = await readFile(abs, 'utf8');
      findings.push(...tailwindFindings(text, rel, rules));

      if (extname(abs) === '.md') {
        const fm = parseFrontmatter(text);
        if (!fm.ok) errors.push(`${rel}: frontmatter absent o invàlid`);
        else {
          for (const k of rules.frontmatterRequired) {
            if (!fm.data[k]) warnings.push(`${rel}: falta frontmatter.${k}`);
          }
          if (fm.data.name) {
            const prev = names.get(fm.data.name);
            if (prev) errors.push(`name duplicat '${fm.data.name}': ${prev} | ${rel}`);
            else names.set(fm.data.name, rel);
          }
        }
      }
    }
  }

  return {
    code: errors.length || findings.length ? 1 : 0,
    summary: `${files.length} fitxers, ${md.length} markdown, ${findings.length} Tailwind il·legal`,
    errors,
    warnings,
    findings,
    data: { files: files.length, markdown: md.length, pilars }
  };
}
