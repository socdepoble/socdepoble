// tools/fast-parse.js
// Fast SWC parse with file-hash cache.
// Usage from Node: const { parseFile } = require('./tools/fast-parse');
// parseFile(filePath) -> returns parsed AST (JSON-serializable)

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { parse } = require('@swc/core');

const CACHE_DIR = path.resolve('.cache', 'ast');

function hash(content) {
  return crypto.createHash('sha1').update(content).digest('hex');
}

async function parseFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const h = hash(code);
  const cacheFile = path.join(CACHE_DIR, `${path.basename(filePath)}.${h}.json`);

  if (fs.existsSync(cacheFile)) {
    try {
      return JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
    } catch (e) {
      // fall through to reparse
    }
  }

  const ast = await parse(code, {
    syntax: 'ecmascript',
    jsx: true,
    ts: true,
    decorators: true,
    dynamicImport: true
  });

  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(cacheFile, JSON.stringify(ast));
  return ast;
}

function clearCache() {
  if (fs.existsSync(CACHE_DIR)) {
    fs.rmSync(CACHE_DIR, { recursive: true, force: true });
  }
}

module.exports = { parseFile, clearCache, CACHE_DIR };
