#!/usr/bin/env node
// tools/run-detect-changed.js
// Helper for lint-staged or pre-commit to pass only changed files to the parser.
// Usage in lint-staged: "node tools/run-detect-changed.js -- <your-parser-cmd>"

const { spawnSync } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const cmdIndex = args.indexOf('--');
if (cmdIndex === -1) {
  console.error('Usage: run-detect-changed.js -- <command...>');
  process.exit(2);
}
const command = args.slice(cmdIndex + 1);
if (!command.length) {
  console.error('No command provided to run on changed files.');
  process.exit(2);
}

// get staged files (or changed files in CI)
const gitArgs = ['diff', '--name-only', '--cached'];
const res = spawnSync('git', gitArgs, { encoding: 'utf8' });
if (res.status !== 0) {
  console.error('git diff failed', res.stderr);
  process.exit(1);
}
const files = res.stdout.split('\n').map(s => s.trim()).filter(Boolean)
  .filter(f => /\.(js|jsx|ts|tsx)$/.test(f));

if (!files.length) {
  console.log('No JS/TS files changed.');
  process.exit(0);
}

// run the provided command with file list appended
const fullCmd = command.concat(files);
const proc = spawnSync(fullCmd[0], fullCmd.slice(1), { stdio: 'inherit' });
process.exit(proc.status);
