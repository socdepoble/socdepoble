import { readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

async function rules() {
  const url = new URL('../rules/trellat-rules.json', import.meta.url);
  return JSON.parse(await readFile(url, 'utf8'));
}

function illegal(c, r) {
  return r.illegalTailwindPrefixes.some(p => c.startsWith(p));
}

function convertClassList(list, r, unresolved) {
  return list.split(/\s+/).filter(Boolean).map(c => {
    if (r.translate[c]) return r.translate[c];
    if (illegal(c, r)) {
      unresolved.add(c);
      return c;
    }
    return c;
  }).join(' ');
}

function transform(text, r) {
  const unresolved = new Set();
  let count = 0;
  const next = text.replace(/\b(class|className)=["'`]([^"'`]+)["'`]/g, (_, key, list) => {
    const converted = convertClassList(list, r, unresolved);
    if (converted !== list) count++;
    return `${key}="${converted}"`;
  });
  return { text: next, count, unresolved: [...unresolved] };
}

export async function run({ root, args, flags }) {
  if (!args.length) {
    return { code: 64, summary: 'Falten fitxers', errors: ['Ús: sdp translate <fitxer...> [--write]'] };
  }

  const r = await rules();
  const findings = [];
  const warnings = [];
  let changed = 0;

  for (const p of args) {
    const abs = join(root, p);
    const old = await readFile(abs, 'utf8');
    const res = transform(old, r);
    if (res.count) {
      changed++;
      if (flags.write) await writeFile(abs, res.text);
      findings.push({ file: relative(root, abs), rule: flags.write ? 'translated' : 'would-translate', value: String(res.count) });
    }
    for (const c of res.unresolved) warnings.push(`${p}: sense mapa per a '${c}'`);
  }

  return {
    code: warnings.length ? 1 : 0,
    summary: `${changed} fitxer(s) traduïts${flags.write ? '' : ' en dry-run'}`,
    warnings,
    findings,
    data: { write: !!flags.write, changed }
  };
}
