#!/usr/bin/env node
// scripts/analyze-flat.js
// Reads nodes.json (1D DOM extract) and computes WrapperScore and Topology Budget.
// Usage: node scripts/analyze-flat.js nodes.json [--config config.json]
// Output: writes analysis.json and prints candidates to stdout.

const fs = require('fs');
const path = require('path');

const argv = process.argv.slice(2);
const input = argv[0] || 'nodes.json';
const configPathIndex = argv.indexOf('--config');
const configPath = configPathIndex !== -1 ? argv[configPathIndex + 1] : null;

if (!fs.existsSync(input)) {
  console.error('Input nodes.json not found:', input);
  process.exit(1);
}

// default weights and params; override via config file
const DEFAULT_CONFIG = {
  base: 1,
  wListeners: 6,
  wStyle: 5,
  alphaDepth: 1.08,
  betaChildren: 0.5,
  gammaAttrs: 4,
  thresholds: { safe: 1, review: 8 },
  budgetThresholds: { healthy: 0.5, review: 1.5 }
};

let CONFIG = DEFAULT_CONFIG;
if (configPath && fs.existsSync(configPath)) {
  try {
    const user = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    CONFIG = { ...DEFAULT_CONFIG, ...user };
  } catch (e) {
    console.warn('Failed to read config, using defaults', e.message);
  }
}

// helper: compute depth from path if not provided
function computeDepth(n) {
  if (typeof n.depth === 'number') return n.depth;
  if (n.path) return Math.max(0, n.path.split('/').length - 1);
  return 0;
}

function countUsefulAttrs(n) {
  let count = 0;
  if (n.classes) count += 1;
  if (n.id) count += 1;
  if (n.aria && Array.isArray(n.aria)) count += n.aria.length;
  if (n.hasRef) count += 1;
  return count;
}

function wrapperScore(n) {
  const A = countUsefulAttrs(n);
  const L = n.hasListeners ? 1 : 0;
  const S = n.inlineStyle ? 1 : 0;
  const P = computeDepth(n);
  const C = n.childrenCount || 0;

  const b = CONFIG.base;
  const wL = CONFIG.wListeners;
  const wS = CONFIG.wStyle;
  const alpha = CONFIG.alphaDepth;
  const beta = CONFIG.betaChildren;
  const gamma = CONFIG.gammaAttrs;

  // children factor in range (0.5 .. 1.5) roughly
  const childFactor = 1 + beta * ((C - 1) / (C + 1 || 1));
  const raw = (b + wL * L + wS * S) * Math.pow(alpha, P) * childFactor - gamma * A;
  const normalized = Math.max(0, Math.round(raw * 10) / 10);
  return normalized;
}

const nodes = JSON.parse(fs.readFileSync(input, 'utf8'));

// augment nodes with computed fields for downstream tooling
const results = nodes.map((n, idx) => {
  const depth = computeDepth(n);
  const score = wrapperScore({ ...n, depth });
  const classification = score <= CONFIG.thresholds.safe ? 'safe-to-remove'
    : (score <= CONFIG.thresholds.review ? 'review' : 'required');
  return { index: idx, path: n.path, tag: n.tag, classes: n.classes, id: n.id, inlineStyle: n.inlineStyle, computed: n.computed, childrenCount: n.childrenCount, hasListeners: n.hasListeners, aria: n.aria, depth, score, classification };
});

fs.writeFileSync('analysis.json', JSON.stringify(results, null, 2));

// compute topology budget
const totalScore = results.reduce((s, r) => s + r.score, 0);
const budget = totalScore / Math.max(1, results.length);
const status = budget < CONFIG.budgetThresholds.healthy ? 'healthy'
  : (budget < CONFIG.budgetThresholds.review ? 'review' : 'action-required');

const summary = {
  timestamp: new Date().toISOString(),
  input,
  nodeCount: results.length,
  totalScore,
  budget,
  status,
  thresholds: CONFIG
};

fs.writeFileSync('analysis-summary.json', JSON.stringify(summary, null, 2));

// print candidates for pipeline consumption
const candidates = results.filter(r => r.classification !== 'required');
console.log(JSON.stringify({ summary, candidates }, null, 2));

process.exit(0);
