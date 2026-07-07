// commands/audit.mjs — Unifica wiki-integrity.js + semantic_auditor.mjs + validate_knowledge.cjs
// + audit_estructura.mjs en una sola comanda. Sense IA: regles de negoci pures (Trellat).
import { readFile, readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { parseFrontmatter, missingFields } from '../lib/frontmatter.mjs';

const RULES_URL = new URL('../rules/trellat-rules.json', import.meta.url);

async function loadRules() {
  return JSON.parse(await readFile(RULES_URL, 'utf8'));
}

async function walkMd(dir, acc = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name.startsWith('.') || e.name === 'node_modules') continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) await walkMd(full, acc);
    else if (e.isFile() && e.name.endsWith('.md')) acc.push(full);
  }
  return acc;
}

function h1Of(body) {
  const m = /^#\s+(.+)$/m.exec(body);
  if (!m) return null;
  return m[1].replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '').trim().toLowerCase();
}

function wikilinksOf(body) {
  return [...body.matchAll(/\[\[([^\]|#]+)/g)].map((m) => m[1].trim());
}

export async function run(options) {
  const root = options.root || '.';
  const rules = await loadRules();
  const files = await walkMd(root);
  const findings = [];
  const titles = new Map();
  const basenames = new Set(files.map((f) => f.split(sep).pop().replace(/\.md$/, '')));

  for (const file of files) {
    const rel = relative(root, file) || file;
    const raw = await readFile(file, 'utf8');
    const { data, body, hasFrontmatter } = parseFrontmatter(raw);
    const topFolder = rel.split(sep)[0];

    if (!hasFrontmatter) {
      findings.push({ severity: 'warning', rule: 'sense-frontmatter', file: rel, message: 'Sense capçalera YAML.' });
    } else {
      const missing = missingFields(data, rules.requiredFrontmatter);
      if (missing.length) {
        findings.push({ severity: 'warning', rule: 'frontmatter-incomplet', file: rel, message: `Falten camps: ${missing.join(', ')}` });
      }
    }

    if (!rules.pillars.includes(topFolder)) {
      findings.push({ severity: 'critical', rule: 'fora-de-pilar', file: rel, message: `"${topFolder}" no és cap dels 5 Pilars canònics.` });
    }

    const h1 = h1Of(body);
    if (h1) {
      if (titles.has(h1)) {
        findings.push({ severity: 'warning', rule: 'possible-duplicat', file: rel, message: `Mateix H1 que ${titles.get(h1)}.` });
      } else {
        titles.set(h1, rel);
      }
    }

    for (const link of wikilinksOf(body)) {
      const target = link.split('/').pop();
      if (!basenames.has(target)) {
        findings.push({ severity: 'warning', rule: 'enllac-trencat', file: rel, message: `[[${link}]] no resol a cap fitxer.` });
      }
    }
  }

  const counts = { critical: 0, warning: 0, info: 0 };
  for (const f of findings) counts[f.severity] = (counts[f.severity] || 0) + 1;

  const ok = counts.critical === 0;
  const summary = `Auditoria (${options.mode}): ${files.length} fitxers, ${counts.critical} crítics, ${counts.warning} avisos.`;

  return {
    ok,
    summary,
    data: {
      root,
      mode: options.mode,
      timestamp: new Date().toISOString(),
      findings,
      summary: { ...counts, filesScanned: files.length },
    },
  };
}
