// tools/kms-local/server.js
// Minimal KMS local for testing. HTTPS recommended in production.
// Usage: node server.js --port=8443 --token=secret-token
// Endpoints:
// GET /key/:label  Authorization: Bearer <token>  -> returns JSON { meta: { salt: [...] , ts }, wrapped: [..] }

const http = require('http');
const url = require('url');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8443;
const TOKEN = process.env.KMS_TOKEN || 'dev-token';
const STORE_DIR = path.resolve(__dirname, 'kms-store');

// ensure store dir
if (!fs.existsSync(STORE_DIR)) fs.mkdirSync(STORE_DIR, { recursive: true });

function readWrappedFile(label) {
  const p = path.join(STORE_DIR, `${label}.wrapped.json`);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

// simple auth
function checkAuth(req) {
  const h = req.headers['authorization'];
  if (!h) return false;
  const parts = h.split(' ');
  return parts[0] === 'Bearer' && parts[1] === TOKEN;
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  if (!checkAuth(req)) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'unauthorized' }));
    return;
  }
  if (req.method === 'GET' && parsed.pathname.startsWith('/key/')) {
    const label = decodeURIComponent(parsed.pathname.replace('/key/', ''));
    const data = readWrappedFile(label);
    if (!data) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'not found' }));
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
    return;
  }
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'unknown' }));
});

server.listen(PORT, () => {
  console.log(`KMS local listening on http://localhost:${PORT}  (TOKEN=${TOKEN})`);
  console.log(`Place wrapped key files in ${STORE_DIR} as <label>.wrapped.json`);
});
