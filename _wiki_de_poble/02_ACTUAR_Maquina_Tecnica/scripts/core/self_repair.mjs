import { existsSync } from 'node:fs';
import { mkdir, readFile, readdir, rename, writeFile } from 'node:fs/promises';
import { atomicWriteFile, withLock, withRollback } from './safety.mjs';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { pathToFileURL } from 'node:url';
import { parseFrontmatter, missingFields } from '../lib/frontmatter.mjs';
import { classify, EXEMPT_BASENAMES, getTimestamp, isValidContentFile } from '../lib/termodinamic.mjs';

const CANONICAL_FIELDS = ['name', 'version', 'created_at', 'updated_at', 'autor', 'categoria', 'description', 'tags'];
const DEFAULT_VERSION = '15.0.0';
const DEFAULT_AUTOR = 'Petorretes i Javi';

async function walkMd(dir, acc = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return acc;
  }

  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await walkMd(full, acc);
    else if (entry.isFile() && extname(entry.name).toLowerCase() === '.md') acc.push(full);
  }
  return acc;
}

async function scanTargets(root) {
  const files = new Map();

  for (const entry of await readdir(root, { withFileTypes: true }).catch(() => [])) {
    if (entry.isFile() && extname(entry.name).toLowerCase() === '.md') {
      const full = join(root, entry.name);
      files.set(full, full);
    }
  }

  const archive = join(root, '04_ARXIU_Documents_Historics');
  if (existsSync(archive)) {
    for (const file of await walkMd(archive)) files.set(file, file);
  }

  return [...files.values()].sort();
}

function cleanTitle(value) {
  return String(value || '')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function firstH1(raw) {
  const match = /^#\s+(.+)$/m.exec(raw);
  return match ? cleanTitle(match[1]) : '';
}

function stemOf(fileName) {
  return basename(fileName, extname(fileName));
}

function stripTermoPrefix(stem) {
  return stem.replace(/^\d{6}_\d{4}_[A-Z]+_?/, '').replace(/^\d{1,4}_?/, '');
}

function asciiToken(value, fallback = 'Document') {
  const token = String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9_]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
  return token || fallback;
}

function slugName(value) {
  return asciiToken(value, 'document').replace(/_/g, '-').toLowerCase();
}

function yamlQuote(value) {
  return `'${String(value ?? '').replace(/'/g, "''")}'`;
}

function yamlBlock(data) {
  const lines = [];
  for (const field of CANONICAL_FIELDS) {
    if (field === 'tags') {
      lines.push('tags:');
      for (const tag of data.tags) lines.push(`  - ${asciiToken(tag, 'autosanacio').toLowerCase()}`);
    } else {
      lines.push(`${field}: ${yamlQuote(data[field])}`);
    }
  }
  return `---\n${lines.join('\n')}\n---\n`;
}

function timestampFromName(fileName) {
  const match = /^(\d{6}_\d{4})_/.exec(basename(fileName));
  return match ? match[1] : getTimestamp();
}

function defaultsFor(fileName, raw) {
  const h1 = firstH1(raw);
  const stem = stripTermoPrefix(stemOf(fileName));
  const title = h1 || stem || 'Document';
  const category = classify(raw, fileName).toLowerCase();

  return {
    name: slugName(title),
    version: DEFAULT_VERSION,
    created_at: timestampFromName(fileName),
    updated_at: getTimestamp(),
    autor: DEFAULT_AUTOR,
    categoria: category,
    description: title,
    tags: ['autosanacio', category],
  };
}

function fieldLines(field, value) {
  if (field === 'tags') {
    const tags = Array.isArray(value) && value.length ? value : ['autosanacio'];
    return ['tags:', ...tags.map((tag) => `  - ${asciiToken(tag, 'autosanacio').toLowerCase()}`)];
  }
  return [`${field}: ${yamlQuote(value)}`];
}

function repairFrontmatter(raw, fileName, missing) {
  const defaults = defaultsFor(fileName, raw);
  const parsed = parseFrontmatter(raw);

  if (!parsed.hasFrontmatter) {
    return yamlBlock(defaults) + raw.replace(/^\uFEFF/, '');
  }

  const insert = [];
  for (const field of missing) insert.push(...fieldLines(field, defaults[field]));
  if (!insert.length) return raw;

  return raw.replace(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/, (_, yaml) => {
    const body = yaml.trimEnd();
    const joined = body ? `${body}\n${insert.join('\n')}` : insert.join('\n');
    return `---\n${joined}\n---\n`;
  });
}

function weakThermoTitle(fileName) {
  if (EXEMPT_BASENAMES.has(fileName)) return false;
  const stem = stemOf(fileName);
  const title = stripTermoPrefix(stem).replace(/[_\W]+/g, '');
  return /^\d+$/.test(stem) || title.length < 4;
}

function canonicalFileName(fileName, raw) {
  const title = firstH1(raw) || stripTermoPrefix(stemOf(fileName)) || 'Document';
  const category = classify(raw, fileName);
  return `${getTimestamp()}_${category}_${asciiToken(title)}.md`;
}

async function uniquePath(dir, preferredName) {
  const ext = extname(preferredName);
  const stem = basename(preferredName, ext);
  let candidate = join(dir, preferredName);
  let i = 2;
  while (existsSync(candidate)) {
    candidate = join(dir, `${stem}_${i}${ext}`);
    i += 1;
  }
  return candidate;
}

async function appendLog(root, payload) {
  const dir = join(root, '04_ARXIU_Documents_Historics', '01_logs_termodinamics');
  await mkdir(dir, { recursive: true });
  const path = join(dir, 'self_repair.ndjson');
  await writeFile(path, JSON.stringify({ ts: new Date().toISOString(), event: 'self_repair', ...payload }) + '\n', { flag: 'a' });
  return path;
}

function reportFinding(findings, finding) {
  findings.push({ severity: 'warning', fixed: false, ...finding });
}

export async function run(options = {}) {
  const root = resolve(options.root || process.env.SDP_ROOT || process.cwd());
  const write = Boolean(options.write);
  const required = [...new Set([...(options.requiredFrontmatter || []), ...CANONICAL_FIELDS])];
  const files = await scanTargets(root);
  const findings = [];
  const fixes = [];

  return withLock(root, 'self_repair', () => withRollback(root, 'self_repair', async (tx) => {
    for (const file of files) {
      const rel = relative(root, file) || file;
      const fileName = basename(file);
      let raw = await readFile(file, 'utf8').catch(() => '');
      let nextRaw = raw;

      const { data, hasFrontmatter } = parseFrontmatter(raw);
      const missing = hasFrontmatter ? missingFields(data, required) : required;

      if (missing.length) {
        const finding = {
          rule: hasFrontmatter ? 'frontmatter-incomplet' : 'sense-frontmatter',
          file: rel,
          message: hasFrontmatter ? `Falten camps canonics: ${missing.join(', ')}` : 'Sense capcalera YAML canonica.',
        };

        if (write) {
          nextRaw = repairFrontmatter(nextRaw, fileName, missing);
          finding.fixed = true;
          fixes.push({ file: rel, action: 'frontmatter-reparat', fields: missing });
        }

        reportFinding(findings, finding);
      }

      const exempt = EXEMPT_BASENAMES.has(fileName);
      const validTermo = exempt || isValidContentFile(fileName);
      const weakTitle = !exempt && weakThermoTitle(fileName);
      let targetPath = '';

      if (!validTermo) {
        const finding = {
          rule: weakTitle ? 'titol-termodinamic-feble' : 'nom-termodinamic-no-canonic',
          severity: weakTitle ? 'warning' : 'info',
          file: rel,
          message: weakTitle ? 'Nom numeric o massa curt.' : 'Nom descriptiu pendent de normalitzacio termodinamica manual.',
        };

        if (write && weakTitle) {
          targetPath = await uniquePath(dirname(file), canonicalFileName(fileName, nextRaw));
          finding.fixed = true;
          finding.target = relative(root, targetPath);
          fixes.push({ file: rel, action: 'reanomenat', target: finding.target });
        }

        reportFinding(findings, finding);
      }

      if (write && nextRaw !== raw) {
        await tx.write(file, nextRaw, { encoding: 'utf8' });
        raw = nextRaw;
      }

      if (write && targetPath) {
        await tx.move(file, targetPath);
      }
    }

    const unresolved = findings.filter((finding) => !finding.fixed);
    const logPath = await appendLog(root, {
      root,
      write,
      filesScanned: files.length,
      findings,
      fixes,
      unresolved: unresolved.length,
    });

    return {
      ok: unresolved.length === 0,
      summary: `Self-Repair: ${files.length} fitxers, ${fixes.length} correccions, ${unresolved.length} pendents. Log: ${relative(root, logPath)}`,
      data: {
        root,
        write,
        filesScanned: files.length,
        fixes,
        findings,
        unresolved,
        logPath,
      },
    };
  }));
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      root: { type: 'string', default: '.' },
      write: { type: 'boolean', default: false },
      json: { type: 'boolean', default: false },
    },
  });

  run(values)
    .then((result) => {
      if (values.json) console.log(JSON.stringify(result, null, 2));
      else console.log(result.summary);
      process.exitCode = result.ok ? 0 : 1;
    })
    .catch((err) => {
      console.error(`[FATAL] self_repair: ${err.message}`);
      process.exitCode = 70;
    });
}
