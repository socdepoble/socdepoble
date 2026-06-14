// vite-plugin-trellat.js
// Place in project root and register in vite.config.js plugins.
// Provides an internal HTTP endpoint /__trellat/ast?file=... that returns cached AST
// and a small in-memory index for fast CI queries.

const { parse } = require('@swc/core');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CACHE_DIR = path.resolve('.cache', 'ast');

function hash(content) {
  return crypto.createHash('sha1').update(content).digest('hex');
}

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
}

module.exports = function trellatPlugin(options = {}) {
  const root = options.root || process.cwd();
  const watchExtensions = options.watchExtensions || ['.js', '.jsx', '.ts', '.tsx'];
  const astIndex = new Map(); // file -> { hash, ast }

  ensureCacheDir();

  async function parseAndCache(file) {
    try {
      const code = fs.readFileSync(file, 'utf8');
      const h = hash(code);
      const cacheFile = path.join(CACHE_DIR, `${path.basename(file)}.${h}.json`);
      if (fs.existsSync(cacheFile)) {
        const ast = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
        astIndex.set(file, { hash: h, ast });
        return ast;
      }
      const ast = await parse(code, { syntax: 'ecmascript', jsx: true, ts: true });
      fs.writeFileSync(cacheFile, JSON.stringify(ast));
      astIndex.set(file, { hash: h, ast });
      return ast;
    } catch (e) {
      // swallow parse errors but keep index consistent
      return null;
    }
  }

  return {
    name: 'vite-plugin-trellat',
    configureServer(server) {
      // pre-populate index for project files
      const walk = (dir) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            if (entry.name === 'node_modules' || entry.name === '.git') continue;
            walk(full);
          } else if (watchExtensions.includes(path.extname(entry.name))) {
            parseAndCache(full).catch(() => {});
          }
        }
      };
      walk(root);

      // watch file changes and update cache
      server.watcher.on('change', (file) => {
        if (watchExtensions.includes(path.extname(file))) {
          parseAndCache(file).catch(() => {});
        }
      });

      // expose a simple endpoint for CI/dev tools
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/__trellat/')) return next();
        const url = new URL(req.url, 'http://localhost');
        const file = url.searchParams.get('file');
        if (!file) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'file param required' }));
          return;
        }
        const abs = path.isAbsolute(file) ? file : path.join(root, file);
        if (!fs.existsSync(abs)) {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'file not found' }));
          return;
        }
        const entry = astIndex.get(abs);
        if (entry && entry.ast) {
          res.setHeader('content-type', 'application/json');
          res.end(JSON.stringify({ cached: true, hash: entry.hash, ast: entry.ast }));
          return;
        }
        const ast = await parseAndCache(abs);
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({ cached: false, ast }));
      });
    }
  };
};
