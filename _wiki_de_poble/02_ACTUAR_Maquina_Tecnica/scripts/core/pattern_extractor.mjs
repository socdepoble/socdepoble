import { readdir, readFile, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const ACTA_DIR = '04_ARXIU_Documents_Historics/actes_arxivades';
const REGISTRE = '05_Escriptori_L_Era_del_Mas/CORE_Registre_Automillora.md';
const PATTERN = /^\s*(?:[-*]\s*)?(Nova regla:|Patró detectat:|Acte reflex afegit:)\s*(.+?)\s*$/i;

function stamp() {
  const d = new Date();
  const yy = String(d.getFullYear()).slice(2);
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const da = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${yy}${mo}${da}_${hh}${mm}`;
}

async function latestMarkdown(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = entries
    .filter(e => e.isFile() && e.name.endsWith('.md'))
    .map(e => e.name)
    .sort();
  return files.length ? join(dir, files[files.length - 1]) : null;
}

function extractPatterns(text) {
  const out = [];
  const seen = new Set();

  for (const line of text.split(/\r?\n/)) {
    const m = line.match(PATTERN);
    if (!m) continue;

    const tipus = m[1].replace(':', '').trim();
    const text = m[2].trim();
    const key = `${tipus}|${text}`.toLowerCase();

    if (!seen.has(key)) {
      seen.add(key);
      out.push({ tipus, text });
    }
  }

  return out;
}

function ensureTable(md) {
  if (md.includes('| Data | Tipus | Patró | Origen |')) return md;

  const block = [
    '',
    '## Patrons Consolidats',
    '',
    '| Data | Tipus | Patró | Origen |',
    '|---|---|---|---|',
    ''
  ].join('\n');

  return `${md.trimEnd()}\n${block}`;
}

function hasPattern(md, text) {
  const needle = text.toLowerCase();
  return md.toLowerCase().includes(needle);
}

async function atomicWrite(path, text) {
  const tmp = `${path}.tmp`;
  await writeFile(tmp, text, 'utf8');
  await rename(tmp, path);
}

export async function run(options = {}) {
  const root = options.root || process.cwd();
  const actaDir = join(root, options.actaDir || ACTA_DIR);
  const registrePath = join(root, options.registre || REGISTRE);
  const acta = options.acta ? join(root, options.acta) : await latestMarkdown(actaDir);

  if (!acta) {
    return { ok: false, summary: 'Cap acta Markdown trobada.', data: { added: 0 } };
  }

  const [actaText, registreText] = await Promise.all([
    readFile(acta, 'utf8'),
    readFile(registrePath, 'utf8').catch(() => [
      '---',
      "name: 'registre-automillora'",
      "version: '15.00'",
      `created_at: '${stamp()}'`,
      `updated_at: '${stamp()}'`,
      "autor: 'IAIA MarIA'",
      "categoria: 'registre'",
      "description: 'Registre d’automillora i patrons consolidats.'",
      '---',
      '',
      "# Registre d'Automillora"
    ].join('\n'))
  ]);

  const patterns = extractPatterns(actaText);
  let next = ensureTable(registreText);
  let added = 0;
  const date = stamp();
  const origin = acta.split('/').pop();

  for (const p of patterns) {
    if (hasPattern(next, p.text)) continue;
    next += `| ${date} | ${p.tipus} | ${p.text.replaceAll('|', '\\|')} | ${origin} |\n`;
    added++;
  }

  if (added && options.write !== false) await atomicWrite(registrePath, next);

  return {
    ok: true,
    summary: `${added} patró(ns) afegit(s) des de ${origin}.`,
    data: { acta, registre: registrePath, found: patterns.length, added, written: added > 0 && options.write !== false }
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = Object.fromEntries(process.argv.slice(2).map(a => {
    const [k, v = true] = a.replace(/^--/, '').split('=');
    return [k, v];
  }));

  run({
    root: args.root || process.cwd(),
    acta: args.acta,
    write: args.write !== 'false'
  }).then(r => {
    console.log(JSON.stringify(r, null, 2));
    process.exit(r.ok ? 0 : 1);
  }).catch(err => {
    console.error(JSON.stringify({ ok: false, error: err.message }, null, 2));
    process.exit(1);
  });
}
