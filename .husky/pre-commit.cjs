#!/usr/bin/env node
// Cross-platform Node.js pre-commit hook to forbid creating/modifying files at repo root
// Usage: .husky/pre-commit should call `node .husky/pre-commit.js`

const { spawnSync } = require('child_process');
const path = require('path');

const ALLOWED_ROOT_FILES = new Set([
  '.gitignore',
  'package.json',
  'package-lock.json',
  'yarn.lock',
  'README.md',
  'LICENSE',
  '.gitattributes',
  'SPEC-CENTRAL.md'
]);

const ALLOWED_DIR_PREFIXES = [
  '_scripts/',
  '_docs/',
  '_auditories/',
  '.husky/',
  '.git/',
  '_skills/',
  'public/',
  'src/',
  '.gemini/'
];

function runGit(args) {
  const res = spawnSync('git', args, { encoding: 'utf8' });
  if (res.error) throw res.error;
  if (res.status !== 0) throw new Error(res.stderr || 'git failed');
  return res.stdout.trim();
}

function normalize(p) {
  return p.replace(/^\.\/+/, '').replace(/\\/g, '/');
}

function main() {
  try {
    // Get staged files (Added, Copied, Modified)
    const staged = runGit(['diff', '--cached', '--name-only', '--diff-filter=ACM']).split('\n').filter(Boolean);
    if (staged.length === 0) process.exit(0);

    const offenders = [];

    for (const raw of staged) {
      const file = normalize(raw);
      if (!file.includes('/')) {
        // file at repo root
        if (!ALLOWED_ROOT_FILES.has(file)) offenders.push(file);
      } else {
        // file in subdir: ensure it starts with an allowed prefix or allowed top-level dirs
        let ok = false;
        for (const p of ALLOWED_DIR_PREFIXES) {
          if (file.startsWith(p)) { ok = true; break; }
        }
        if (!ok) offenders.push(file);
      }
    }

    if (offenders.length > 0) {
      console.error('\nERROR: Creating or modifying files at repository root or disallowed paths is forbidden.\nMove new files into one of: _scripts/, _docs/, _auditories/ or update allowed lists.\nStaged offending files:\n');
      for (const o of offenders) console.error('  - ' + o);
      console.error('\nFix options:\n  * Move new files into _scripts/, _docs/ or _auditories/.\n  * If a file must live at root, add it to ALLOWED_ROOT_FILES in .husky/pre-commit.js (team decision).\n  * For temporary files, use .gitignore and a temp folder under _scripts/tmp/.\n');
      process.exit(1);
    }

    // Optional: remove stale temp files older than TTL (uncomment to enable)
    // spawnSync('bash', ['-lc', 'find _scripts/tmp -type f -mtime +3 -print -delete'], { stdio: 'ignore' });

    process.exit(0);
  } catch (err) {
    console.error('pre-commit hook failed:', err.message || err);
    process.exit(2);
  }
}

main();
