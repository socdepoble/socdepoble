// commands/translate.mjs — Tradueix classes Tailwind de marca (color/radi/ombra) al
// diccionari --sp-* canònic, per a promoure un component de Forja a Core.
import { readFile } from 'node:fs/promises';
import { atomicWriteFile, resolveInside } from './safety.mjs';
import { claimReceiptForMutation, completeMutationClaim } from '../reflex_petorreta.mjs';

const RULES_URL = new URL('../rules/trellat-rules.json', import.meta.url);
const CLASS_ATTR_RE = /(class(?:Name)?=["'`])([^"'`]+)(["'`])/g;

async function loadRules() {
  return JSON.parse(await readFile(RULES_URL, 'utf8'));
}

function translateList(tokenStr, tokenMap, unmapped) {
  return tokenStr
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => {
      if (tokenMap[token]) return `sp-${tokenMap[token].replace(/^sp-/, '')}`;
      if (/^(bg|text|border|rounded|shadow)-/.test(token)) unmapped.push(token);
      return token;
    })
    .join(' ');
}

export async function run(options) {
  if (!options.file) {
    return { ok: false, summary: '[ERROR] Cal --file=<ruta> per traduir.', data: {} };
  }

  const rules = await loadRules();
  const root = options.root || '.';
  const target = resolveInside(root, options.file, 'translate file');
  const raw = await readFile(target, 'utf8');
  const unmapped = [];
  let blocksChanged = 0;

  const translated = raw.replace(CLASS_ATTR_RE, (_full, pre, classList, post) => {
    const after = translateList(classList, rules.tokenMap, unmapped);
    if (after !== classList) blocksChanged++;
    return `${pre}${after}${post}`;
  });

  const willWrite = Boolean(options.write && blocksChanged > 0);
  if (willWrite) {
    const claim = await claimReceiptForMutation({
      receiptPath: options.receipt,
      operation: 'code-translate',
      targets: [target],
      checkDirty: true,
    });
    await atomicWriteFile(target, translated, { encoding: 'utf8', backup: true });
    await completeMutationClaim({ receiptPath: options.receipt, operation: 'code-translate' }, claim.claimToken);
  }

  const ok = true;
  const summary = `Traducció ${options.file}: ${blocksChanged} bloc(s) de classes tocats, ` +
    `${new Set(unmapped).size} classe(s) sense mapa (${willWrite ? 'ESCRIT' : 'dry-run — repeteix amb --write'}).`;

  return {
    ok,
    summary,
    data: { file: options.file, blocksChanged, unmapped: [...new Set(unmapped)], written: willWrite },
  };
}
