#!/usr/bin/env node
/**
 * Purga Fantasmes UI - Pedra Seca
 *
 * Node vanilla. Scans project UI files for Tailwind utilities, inline styles,
 * and wrapper patterns that contaminate Universal Pages and Universal Cards.
 */

import fs from 'node:fs/promises';
import path from 'node:path';

const UI_EXTENSIONS = new Set(['.html', '.jsx', '.tsx', '.js', '.mjs', '.ts']);
const DEFAULT_IGNORES = new Set([
  '.git',
  '.next',
  '.turbo',
  '.vercel',
  '.cache',
  'coverage',
  'dist',
  'build',
  'node_modules',
  'outputs',
  'work',
]);

const CANONICAL_MARKERS = [
  'universal-page',
  'universal-grid',
  'universal-card',
  'uc-caputxa',
  'uc-cos',
  'uc-peu',
  'up-document',
  'up-titol-wrapper',
  'up-titol-caixa',
  'sp-app-container',
  'sp-app-shell-main',
];

const TAILWIND_EXACT = new Set([
  'absolute',
  'relative',
  'fixed',
  'sticky',
  'block',
  'inline-block',
  'inline-flex',
  'flex',
  'grid',
  'hidden',
  'contents',
  'container',
  'items-start',
  'items-center',
  'items-end',
  'justify-start',
  'justify-center',
  'justify-end',
  'justify-between',
  'justify-around',
  'justify-evenly',
  'text-left',
  'text-center',
  'text-right',
  'uppercase',
  'lowercase',
  'capitalize',
  'font-bold',
  'font-black',
  'font-semibold',
  'font-medium',
  'font-normal',
  'object-cover',
  'object-contain',
  'overflow-hidden',
  'overflow-auto',
  'overflow-x-auto',
  'overflow-y-auto',
  'whitespace-nowrap',
  'm-0',
  'p-0',
  'mt-auto',
  'rounded-none',
  'bg-white',
  'text-white',
  'text-black',
  'transition',
  'transition-opacity',
  'transition-transform',
]);

const TAILWIND_PREFIX = /^(?:-?m[trblxy]?|-?p[trblxy]?|w|min-w|max-w|h|min-h|max-h|gap|space-[xy]|rounded|border|bg|text|font|leading|tracking|shadow|opacity|overflow|object|items|justify|content|self|place|flex|grid|col|row|aspect|z|inset|top|right|bottom|left|translate|scale|rotate|transition|duration|ease|order|basis|grow|shrink)-/;
const TAILWIND_VARIANT = /^(?:hover|focus|active|visited|disabled|group-hover|focus-visible|sm|md|lg|xl|2xl|dark):/;
const ARBITRARY_VALUE = /(?:\[[^\]]+\]|#[0-9a-fA-F]{3,8}|\/\d+)$/;

function parseArgs(argv) {
  const options = {
    root: process.cwd(),
    strict: false,
    json: false,
    aplana: true,
    context: 900,
  };

  const positional = [];
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--root') {
      options.root = argv[++index] || options.root;
    } else if (arg === '--strict') {
      options.strict = true;
    } else if (arg === '--json') {
      options.json = true;
    } else if (arg === '--no-aplana') {
      options.aplana = false;
    } else if (arg === '--context') {
      options.context = Number(argv[++index] || options.context);
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else {
      positional.push(arg);
    }
  }

  if (positional[0]) options.root = positional[0];
  options.root = path.resolve(options.root);
  return options;
}

function printHelp() {
  console.log(`Purga Fantasmes UI

Usage:
  node _scripts/purga_fantasmes_ui.mjs [root] [--strict] [--json] [--no-aplana]

Options:
  --root <dir>     Project root. Defaults to current working directory.
  --strict         Exit with code 1 when any finding is present.
  --json           Print machine-readable JSON.
  --no-aplana      Disable DOM flattening suggestions.
  --context <n>    Character window used to decide canonical scope. Default: 900.
`);
}

async function walk(dir, files = []) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return files;
  }

  for (const entry of entries) {
    if (DEFAULT_IGNORES.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath, files);
      continue;
    }
    if (entry.isFile() && UI_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

async function collectFiles(target) {
  let stat;
  try {
    stat = await fs.stat(target);
  } catch {
    return [];
  }

  if (stat.isFile()) {
    return UI_EXTENSIONS.has(path.extname(target)) ? [target] : [];
  }

  if (stat.isDirectory()) {
    return walk(target);
  }

  return [];
}

function buildLineIndex(source) {
  const starts = [0];
  for (let index = 0; index < source.length; index += 1) {
    if (source[index] === '\n') starts.push(index + 1);
  }
  return starts;
}

function lineCol(starts, offset) {
  let low = 0;
  let high = starts.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (starts[mid] <= offset) low = mid + 1;
    else high = mid - 1;
  }
  const line = Math.max(0, high);
  return { line: line + 1, column: offset - starts[line] + 1 };
}

function lineAt(source, starts, line) {
  const start = starts[line - 1] ?? 0;
  const end = source.indexOf('\n', start);
  return source.slice(start, end === -1 ? source.length : end).trim();
}

function hasCanonicalMarker(text) {
  return CANONICAL_MARKERS.some((marker) => text.includes(marker));
}

function scopeFor(source, index, contextSize) {
  const start = Math.max(0, index - contextSize);
  const end = Math.min(source.length, index + contextSize);
  return hasCanonicalMarker(source.slice(start, end)) ? 'canonical' : 'global';
}

function splitClasses(raw) {
  return raw
    .replace(/\$\{[^}]*\}/g, ' ')
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function isTailwindToken(token) {
  if (!token || token.startsWith('sp-') || token.startsWith('uc-') || token.startsWith('up-')) return false;
  if (token.startsWith('universal-')) return false;
  if (token === 'active' || token === 'sense-vora' || token === 'opacitat-mitja' || token === 'boto-centrat' || token === 'icona-centre') return false;
  return TAILWIND_EXACT.has(token)
    || TAILWIND_PREFIX.test(token)
    || TAILWIND_VARIANT.test(token)
    || (TAILWIND_PREFIX.test(token.replace(/^[a-z-]+:/, '')) && ARBITRARY_VALUE.test(token));
}

function pushIssue(issues, source, starts, file, offset, data) {
  const position = lineCol(starts, offset);
  issues.push({
    file,
    line: position.line,
    column: position.column,
    ...data,
    excerpt: lineAt(source, starts, position.line),
  });
}

function scanInlineStyles(source, starts, file, options, issues) {
  const stylePattern = /\bstyle\s*=\s*(?:"[^"]*"|'[^']*'|\{\{[\s\S]*?\}\}|\{[^}]*\})/g;
  for (const match of source.matchAll(stylePattern)) {
    const scope = scopeFor(source, match.index, options.context);
    const severity = scope === 'canonical' ? 'error' : 'warn';
    pushIssue(issues, source, starts, file, match.index, {
      severity,
      type: 'inline-style',
      token: 'style=',
      scope,
      message: scope === 'canonical'
        ? 'Inline style touching Pedra Seca canonical UI. Move this visual rule to pedra-seca.css or use an existing class.'
        : 'Inline style found outside canonical scope. Review before keeping it.',
      suggestion: 'Replace style= with a canonical class such as uc-cos, uc-peu, opacitat-mitja, or a new reusable class in pedra-seca.css.',
    });
  }

  const mutationPattern = /\.style\.[a-zA-Z-]+\s*=/g;
  for (const match of source.matchAll(mutationPattern)) {
    const scope = scopeFor(source, match.index, options.context);
    pushIssue(issues, source, starts, file, match.index, {
      severity: scope === 'canonical' ? 'error' : 'warn',
      type: 'runtime-style-mutation',
      token: match[0],
      scope,
      message: 'Runtime style mutation found. Pedra Seca UI should not mutate visual rules through JavaScript.',
      suggestion: 'Toggle a canonical class and define the visual state in pedra-seca.css.',
    });
  }
}

function scanClassAttributes(source, starts, file, options, issues) {
  const classPattern = /\bclass(?:Name)?\s*=\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`|\{\s*"([^"]*)"\s*\}|\{\s*'([^']*)'\s*\}|\{\s*`([^`]*)`\s*\})/g;
  for (const match of source.matchAll(classPattern)) {
    const classText = match.slice(1).find(Boolean) || '';
    const tokens = splitClasses(classText);
    for (const token of tokens) {
      if (!isTailwindToken(token)) continue;
      const tokenOffset = match.index + match[0].indexOf(token);
      const scope = scopeFor(source, tokenOffset, options.context);
      pushIssue(issues, source, starts, file, tokenOffset >= match.index ? tokenOffset : match.index, {
        severity: scope === 'canonical' ? 'error' : 'warn',
        type: 'tailwind-class',
        token,
        scope,
        message: scope === 'canonical'
          ? `Tailwind utility "${token}" is contaminating Universal UI.`
          : `Tailwind-like utility "${token}" found outside canonical scope.`,
        suggestion: 'Use only sp-*, up-*, uc-*, universal-* classes, or add a reusable Pedra Seca class to the CSS source of truth.',
      });
    }
  }
}

function scanFlattening(source, starts, file, options, issues) {
  if (!options.aplana) return;

  const wrapperPattern = /<div\b[^>]*\bclass(?:Name)?\s*=\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`|\{\s*"([^"]*)"\s*\}|\{\s*'([^']*)'\s*\}|\{\s*`([^`]*)`\s*\})[^>]*>[\s\S]{0,700}?\b(?:universal-card|universal-page|universal-grid)\b/g;
  for (const match of source.matchAll(wrapperPattern)) {
    const classText = match.slice(1).find(Boolean) || '';
    const tokens = splitClasses(classText);
    const badTokens = tokens.filter(isTailwindToken);
    if (badTokens.length === 0) continue;

    pushIssue(issues, source, starts, file, match.index, {
      severity: 'error',
      type: 'wrapper-layout',
      token: badTokens.join(' '),
      scope: 'canonical',
      message: 'A wrapper div with layout utilities surrounds a Universal Page/Grid/Card.',
      suggestion: 'Aplana el DOM: remove the wrapper and let sp-app-shell-main, up-document, universal-grid, and universal-card own layout.',
    });
  }

  const nestedCardPattern = /\buniversal-card\b[\s\S]{0,500}?\bclass(?:Name)?\s*=\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`|\{\s*"([^"]*)"\s*\}|\{\s*'([^']*)'\s*\}|\{\s*`([^`]*)`\s*\})/g;
  for (const match of source.matchAll(nestedCardPattern)) {
    const classText = match.slice(1).find(Boolean) || '';
    const tokens = splitClasses(classText).filter(isTailwindToken);
    if (tokens.length === 0) continue;
    pushIssue(issues, source, starts, file, match.index, {
      severity: 'error',
      type: 'card-child-layout',
      token: tokens.join(' '),
      scope: 'canonical',
      message: 'A child inside universal-card uses foreign layout utilities.',
      suggestion: 'Use the canonical children only: uc-caputxa, uc-cos, and uc-peu.',
    });
  }
}

async function scanFile(file, options) {
  const source = await fs.readFile(file, 'utf8');
  const starts = buildLineIndex(source);
  const issues = [];
  scanInlineStyles(source, starts, file, options, issues);
  scanClassAttributes(source, starts, file, options, issues);
  scanFlattening(source, starts, file, options, issues);
  return issues;
}

function relativeIssue(root, issue) {
  return {
    ...issue,
    file: path.relative(root, issue.file) || issue.file,
  };
}

function printReport(root, issues) {
  const errors = issues.filter((issue) => issue.severity === 'error').length;
  const warnings = issues.filter((issue) => issue.severity === 'warn').length;

  console.log('Purga Fantasmes UI - Pedra Seca');
  console.log(`Root: ${root}`);
  console.log(`Findings: ${issues.length} (${errors} errors, ${warnings} warnings)`);

  if (issues.length === 0) {
    console.log('OK: no Tailwind utilities or inline styles found around canonical UI.');
    return;
  }

  for (const issue of issues.map((item) => relativeIssue(root, item))) {
    console.log('');
    console.log(`[${issue.severity.toUpperCase()}] ${issue.type} ${issue.file}:${issue.line}:${issue.column}`);
    console.log(`Token: ${issue.token}`);
    console.log(issue.message);
    console.log(`Code: ${issue.excerpt}`);
    console.log(`Fix: ${issue.suggestion}`);
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const files = await collectFiles(options.root);
  const allIssues = [];

  for (const file of files) {
    const issues = await scanFile(file, options);
    allIssues.push(...issues);
  }

  allIssues.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.column - b.column);

  if (options.json) {
    console.log(JSON.stringify({
      root: options.root,
      filesScanned: files.length,
      findings: allIssues.map((issue) => relativeIssue(options.root, issue)),
    }, null, 2));
  } else {
    printReport(options.root, allIssues);
  }

  if (options.strict && allIssues.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 2;
});
