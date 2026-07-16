import { readdir, readFile, realpath } from 'node:fs/promises';
import path, { basename, join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseFrontmatter } from '../lib/frontmatter.mjs';
import { validarFrontmatter } from '../entropia_zero_router.js';
import { isValidContentFile } from '../lib/termodinamic.mjs';

const ACTA_DIR = '04_ARXIU_Documents_Historics/actes_arxivades';
const REGISTRE = '00_SER_Brain_Identitat/CORE_Registre_Automillora.md';
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
  const symlink = entries.find(e => e.isSymbolicLink() && e.name.endsWith('.md'));
  if (symlink) throw new Error(`Symlink Markdown no admés: ${join(dir, symlink.name)}`);
  const files = entries
    .filter(e => e.isFile()
      && isValidContentFile(e.name)
      && ['ACTA', 'AUDITORIA', 'REPORT'].includes(e.name.split('_')[2]))
    .map(e => e.name)
    .sort((a, b) => a.localeCompare(b, 'ca'));
  return files.length ? join(dir, files[files.length - 1]) : null;
}

function isInside(root, candidate) {
  const rel = relative(root, candidate);
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
}

async function resolveExistingInside(root, candidate, label) {
  const lexical = resolve(root, candidate);
  if (!isInside(root, lexical)) throw new Error(`${label} fora de la Wiki: ${candidate}`);
  const actual = await realpath(lexical);
  if (!isInside(root, actual)) throw new Error(`${label} resol fora de la Wiki: ${candidate}`);
  return actual;
}

function parseCanonicalDocument(text, label) {
  const parsed = parseFrontmatter(text);
  if (!parsed.hasFrontmatter) {
    const reason = parsed.malformed ? 'frontmatter obert però no tancat' : 'frontmatter absent';
    throw new Error(`${label}: ${reason}`);
  }
  if (parsed.errors.length) {
    throw new Error(`${label}: YAML invàlid: ${parsed.errors.join('; ')}`);
  }
  const schemaErrors = validarFrontmatter(parsed.data);
  if (schemaErrors.length) {
    throw new Error(`${label}: schema v2 invàlid: ${schemaErrors.join(' ')}`);
  }
  return parsed;
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

export async function run(options = {}) {
  const root = await realpath(resolve(options.root || process.cwd()));
  const actaDir = join(root, options.actaDir || ACTA_DIR);
  if (!isInside(root, resolve(actaDir))) throw new Error(`Directori d'actes fora de la Wiki: ${actaDir}`);
  const registrePath = await resolveExistingInside(root, options.registre || REGISTRE, 'Registre');
  const latest = options.acta ? options.acta : await latestMarkdown(actaDir);
  const acta = latest ? await resolveExistingInside(root, latest, 'Acta') : null;

  if (!acta) {
    return { ok: false, summary: 'Cap acta Markdown trobada.', data: { added: 0 } };
  }

  const [actaText, registreText] = await Promise.all([
    readFile(acta, 'utf8'),
    readFile(registrePath, 'utf8')
  ]);

  const parsedActa = parseCanonicalDocument(actaText, relative(root, acta));
  const parsedRegistre = parseCanonicalDocument(registreText, relative(root, registrePath));
  if (parsedRegistre.data.tipus !== 'registre') {
    throw new Error(`${relative(root, registrePath)}: tipus ha de ser registre`);
  }

  const patterns = extractPatterns(parsedActa.body);
  let next = ensureTable(registreText);
  let added = 0;
  const date = stamp();
  const origin = basename(acta);

  for (const p of patterns) {
    if (hasPattern(next, p.text)) continue;
    next += `| ${date} | ${p.tipus} | ${p.text.replaceAll('|', '\\|')} | ${origin} |\n`;
    added++;
  }

  const shouldWrite = options.write === true;
  if (added && shouldWrite) {
    throw new Error('SDP-LOCK: pattern-extract és consultiu fins integrar manifest durable i restore; cap escriptura aplicada.');
  }

  return {
    ok: true,
    summary: `${added} patró(ns) afegit(s) des de ${origin}.`,
    data: { acta, registre: registrePath, found: patterns.length, added, written: added > 0 && shouldWrite }
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = Object.fromEntries(process.argv.slice(2).map(a => {
    const [k, v = true] = a.replace(/^--/, '').split('=');
    return [k, v];
  }));

  run({
    root: args.root || process.cwd(),
    acta: args.acta,
    write: args.write === 'true',
    receipt: args.receipt,
  }).then(r => {
    console.log(JSON.stringify(r, null, 2));
    process.exit(r.ok ? 0 : 1);
  }).catch(err => {
    console.error(JSON.stringify({ ok: false, error: err.message }, null, 2));
    process.exit(1);
  });
}
